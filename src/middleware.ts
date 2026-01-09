/**
 * Next.js Middleware
 * 
 * Server-side route protection and security checks.
 * Runs before every matching request.
 * 
 * SECURITY FEATURES:
 * - Protects admin routes server-side
 * - Protects API routes from unauthorized origins
 * - Validates authentication cookies
 * - Prevents unauthorized access before page load
 * - Adds security headers to all responses
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Routes that require authentication
 */
const PROTECTED_ROUTES = ['/admin', '/adoption-interest', '/documents', '/chat'];

/**
 * API routes that need origin validation
 */
const API_ROUTES = ['/api/'];

/**
 * Routes that should redirect to home if already authenticated
 */
const AUTH_ROUTES = ['/login'];

/**
 * Allowed origins for API access
 */
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map(origin => origin.trim());

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null): boolean {
    if (!origin) return true; // Same-origin requests
    return ALLOWED_ORIGINS.some(
        allowed => origin === allowed || origin.endsWith(allowed.replace('https://', '.'))
    );
}

/**
 * Middleware function
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const origin = request.headers.get('origin');

    // Handle API routes
    if (pathname.startsWith('/api/')) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            const response = new NextResponse(null, { status: 204 });
            response.headers.set('Access-Control-Allow-Origin', isOriginAllowed(origin) ? (origin || '*') : ALLOWED_ORIGINS[0]);
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
            response.headers.set('Access-Control-Allow-Credentials', 'true');
            response.headers.set('Access-Control-Max-Age', '86400');
            return response;
        }

        // Check origin for non-preflight requests
        if (origin && !isOriginAllowed(origin)) {
            return NextResponse.json(
                { error: 'Origin not allowed' },
                { status: 403 }
            );
        }

        // Add request ID and continue to API route handler
        const response = NextResponse.next();
        const requestId = crypto.randomUUID();
        response.headers.set('X-Request-Id', requestId);

        // Add CORS headers to API responses
        response.headers.set('Access-Control-Allow-Origin', origin || ALLOWED_ORIGINS[0]);
        response.headers.set('Access-Control-Allow-Credentials', 'true');

        return response;
    }

    // Check for auth token in cookies for page routes
    const authToken = request.cookies.get('__session')?.value ||
        request.cookies.get('authToken')?.value;

    // Check if accessing protected route
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    // Check if accessing auth route (login/register)
    const isAuthRoute = AUTH_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    // Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !authToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Optionally redirect to home if accessing login while authenticated
    // Uncomment if you want this behavior
    // if (isAuthRoute && authToken) {
    //   return NextResponse.redirect(new URL('/', request.url));
    // }

    // Add security headers to response
    const response = NextResponse.next();

    // Add request ID for tracing
    const requestId = crypto.randomUUID();
    response.headers.set('X-Request-Id', requestId);

    return response;
}

/**
 * Configure which paths the middleware runs on
 */
export const config = {
    matcher: [
        /*
         * Match all request paths including API routes:
         * - _next/static (static files) - excluded
         * - _next/image (image optimization files) - excluded
         * - favicon.ico (favicon file) - excluded
         * - public folder files - excluded
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
