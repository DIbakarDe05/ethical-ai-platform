/**
 * API Authentication & Rate Limiting Helpers
 * 
 * Provides authentication and rate limiting for API routes.
 * 
 * SECURITY FEATURES:
 * - Bearer token validation using Firebase Admin SDK
 * - In-memory rate limiting (replace with Redis in production)
 * - Helper functions for consistent auth patterns
 * - API key validation for service-to-service calls
 * - IP-based blocking for repeated failures
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken, getUserRole } from '@/lib/firebase/admin';
import {
    getClientIP,
    isIPBlocked,
    recordFailedAttempt,
    clearFailedAttempts,
    blockedResponse,
    isOriginAllowed,
    originNotAllowedResponse,
    withCors,
    corsPreflightResponse,
    validateApiKey,
    logRequest,
} from './security';

/**
 * Rate Limiter Configuration
 */
interface RateLimitConfig {
    maxRequests: number;  // Max requests allowed
    windowMs: number;     // Time window in milliseconds
}

/**
 * In-memory rate limit store
 * In production, replace with Redis for distributed systems
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Default rate limit configurations by route type
 */
export const RATE_LIMITS = {
    chat: { maxRequests: 20, windowMs: 60 * 1000 },      // 20 requests per minute
    search: { maxRequests: 30, windowMs: 60 * 1000 },    // 30 requests per minute
    documents: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 requests per minute
    default: { maxRequests: 100, windowMs: 60 * 1000 },  // 100 requests per minute
} as const;

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = RATE_LIMITS.default
): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const key = identifier;
    const entry = rateLimitStore.get(key);

    // Clean up expired entries periodically
    if (rateLimitStore.size > 10000) {
        cleanupExpiredEntries();
    }

    if (!entry || now >= entry.resetTime) {
        // New window
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + config.windowMs,
        });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetIn: config.windowMs
        };
    }

    if (entry.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetIn: entry.resetTime - now
        };
    }

    entry.count++;
    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetIn: entry.resetTime - now
    };
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now >= entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}

/**
 * Authentication Result
 */
export interface AuthResult {
    authenticated: boolean;
    userId?: string;
    role?: string;
    error?: string;
}

/**
 * Extract and validate Bearer token from request
 */
export async function authenticateRequest(
    request: NextRequest
): Promise<AuthResult> {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
        return { authenticated: false, error: 'No authorization header' };
    }

    if (!authHeader.startsWith('Bearer ')) {
        return { authenticated: false, error: 'Invalid authorization format' };
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    if (!token) {
        return { authenticated: false, error: 'No token provided' };
    }

    try {
        const { valid, uid } = await verifyIdToken(token);

        if (!valid || !uid) {
            return { authenticated: false, error: 'Invalid token' };
        }

        const role = await getUserRole(uid);

        return {
            authenticated: true,
            userId: uid,
            role,
        };
    } catch (error) {
        console.error('Token verification error:', error);
        return { authenticated: false, error: 'Token verification failed' };
    }
}

/**
 * Require authentication wrapper
 * Use this to protect API routes that require a logged-in user
 */
export async function requireAuth(
    request: NextRequest
): Promise<{ auth: AuthResult; error?: NextResponse }> {
    const ip = getClientIP(request);

    // Check if IP is blocked
    if (isIPBlocked(ip)) {
        return { auth: { authenticated: false }, error: blockedResponse() };
    }

    // Check origin
    const origin = request.headers.get('origin');
    if (origin && !isOriginAllowed(origin)) {
        return { auth: { authenticated: false }, error: originNotAllowedResponse() };
    }

    const authResult = await authenticateRequest(request);

    if (!authResult.authenticated) {
        recordFailedAttempt(ip);
        return {
            auth: authResult,
            error: unauthorizedResponse(authResult.error || 'Authentication required')
        };
    }

    // Clear failed attempts on successful auth
    clearFailedAttempts(ip);

    return { auth: authResult };
}

/**
 * Require API key for service-to-service communication
 */
export function requireApiKey(request: NextRequest): { valid: boolean; error?: NextResponse } {
    if (!validateApiKey(request)) {
        return {
            valid: false,
            error: NextResponse.json(
                { error: 'Invalid or missing API key' },
                { status: 401 }
            )
        };
    }
    return { valid: true };
}

/**
 * Check if user has admin role
 */
export function isAdminUser(authResult: AuthResult): boolean {
    return authResult.authenticated && authResult.role === 'admin';
}

/**
 * Check if user has specific role
 */
export function hasRole(authResult: AuthResult, ...roles: string[]): boolean {
    return authResult.authenticated && roles.includes(authResult.role || '');
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
    return NextResponse.json(
        { error: message },
        { status: 401 }
    );
}

/**
 * Create forbidden response
 */
export function forbiddenResponse(message: string = 'Forbidden'): NextResponse {
    return NextResponse.json(
        { error: message },
        { status: 403 }
    );
}

/**
 * Create rate limit exceeded response
 */
export function rateLimitResponse(resetIn: number): NextResponse {
    return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
            status: 429,
            headers: {
                'Retry-After': Math.ceil(resetIn / 1000).toString(),
                'X-RateLimit-Reset': new Date(Date.now() + resetIn).toISOString(),
            }
        }
    );
}

/**
 * Create safe error response (hides details in production)
 */
export function errorResponse(
    message: string,
    error?: Error,
    status: number = 500
): NextResponse {
    const isDev = process.env.NODE_ENV === 'development';

    return NextResponse.json(
        {
            error: message,
            ...(isDev && error && { details: error.message }),
        },
        { status }
    );
}

/**
 * Get client identifier for rate limiting
 * Uses IP address or user ID if authenticated
 */
export function getClientIdentifier(
    request: NextRequest,
    userId?: string
): string {
    if (userId) {
        return `user:${userId}`;
    }

    // Get IP from various headers (for proxied requests)
    const ip = getClientIP(request);
    return `ip:${ip}`;
}

// Re-export security utilities for convenience
export { withCors, corsPreflightResponse, logRequest };
