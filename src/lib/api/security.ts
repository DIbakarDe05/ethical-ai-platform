/**
 * API Security Configuration
 * 
 * Centralized security settings for all API routes.
 * 
 * SECURITY FEATURES:
 * - API key validation for service-to-service calls
 * - CORS configuration with origin whitelist
 * - IP blocking for repeated failures
 * - Request logging utilities
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Security Configuration
 */
export const API_SECURITY_CONFIG = {
    // Allowed origins for CORS
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
        .split(',')
        .map(origin => origin.trim()),

    // API key header name
    apiKeyHeader: 'X-API-Key',

    // Maximum failed auth attempts before IP block
    maxFailedAttempts: 10,

    // Block duration in milliseconds (15 minutes)
    blockDuration: 15 * 60 * 1000,

    // Enable request logging
    enableLogging: process.env.ENABLE_API_LOGGING === 'true',
};

/**
 * IP Block Store (in-memory, use Redis in production)
 */
const ipBlockStore = new Map<string, { attempts: number; blockedUntil: number }>();

/**
 * Request Log (for monitoring)
 */
interface RequestLog {
    timestamp: string;
    method: string;
    path: string;
    ip: string;
    userId?: string;
    status: number;
    duration: number;
}

const requestLogs: RequestLog[] = [];
const MAX_LOGS = 1000;

/**
 * Validate API Key for service-to-service communication
 */
export function validateApiKey(request: NextRequest): boolean {
    const apiKey = request.headers.get(API_SECURITY_CONFIG.apiKeyHeader);
    const expectedKey = process.env.API_SECRET_KEY;

    // If no API key is configured, skip validation
    if (!expectedKey) {
        return true;
    }

    return apiKey === expectedKey;
}

/**
 * Check if request origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
    if (!origin) {
        // Same-origin requests don't have Origin header
        return true;
    }

    return API_SECURITY_CONFIG.allowedOrigins.some(
        allowed => origin === allowed || origin.endsWith(allowed.replace('https://', '.'))
    );
}

/**
 * Get CORS headers for response
 */
export function getCorsHeaders(request: NextRequest): HeadersInit {
    const origin = request.headers.get('origin');
    const allowedOrigin = isOriginAllowed(origin) ? origin : API_SECURITY_CONFIG.allowedOrigins[0];

    return {
        'Access-Control-Allow-Origin': allowedOrigin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
    };
}

/**
 * Create CORS preflight response
 */
export function corsPreflightResponse(request: NextRequest): NextResponse {
    return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(request),
    });
}

/**
 * Add CORS headers to existing response
 */
export function withCors(response: NextResponse, request: NextRequest): NextResponse {
    const corsHeaders = getCorsHeaders(request);
    Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    return response;
}

/**
 * Get client IP from request
 */
export function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    return forwarded?.split(',')[0].trim() || realIp || 'unknown';
}

/**
 * Check if IP is blocked
 */
export function isIPBlocked(ip: string): boolean {
    const entry = ipBlockStore.get(ip);
    if (!entry) return false;

    if (Date.now() > entry.blockedUntil) {
        ipBlockStore.delete(ip);
        return false;
    }

    return entry.attempts >= API_SECURITY_CONFIG.maxFailedAttempts;
}

/**
 * Record failed authentication attempt
 */
export function recordFailedAttempt(ip: string): void {
    const entry = ipBlockStore.get(ip) || { attempts: 0, blockedUntil: 0 };
    entry.attempts++;

    if (entry.attempts >= API_SECURITY_CONFIG.maxFailedAttempts) {
        entry.blockedUntil = Date.now() + API_SECURITY_CONFIG.blockDuration;
    }

    ipBlockStore.set(ip, entry);
}

/**
 * Clear failed attempts on successful auth
 */
export function clearFailedAttempts(ip: string): void {
    ipBlockStore.delete(ip);
}

/**
 * Log API request
 */
export function logRequest(
    request: NextRequest,
    status: number,
    startTime: number,
    userId?: string
): void {
    if (!API_SECURITY_CONFIG.enableLogging) return;

    const log: RequestLog = {
        timestamp: new Date().toISOString(),
        method: request.method,
        path: new URL(request.url).pathname,
        ip: getClientIP(request),
        userId,
        status,
        duration: Date.now() - startTime,
    };

    requestLogs.push(log);

    // Keep logs bounded
    if (requestLogs.length > MAX_LOGS) {
        requestLogs.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${log.method} ${log.path} - ${log.status} (${log.duration}ms)`);
    }
}

/**
 * Blocked IP response
 */
export function blockedResponse(): NextResponse {
    return NextResponse.json(
        { error: 'Too many failed attempts. Please try again later.' },
        { status: 403 }
    );
}

/**
 * Origin not allowed response
 */
export function originNotAllowedResponse(): NextResponse {
    return NextResponse.json(
        { error: 'Origin not allowed' },
        { status: 403 }
    );
}
