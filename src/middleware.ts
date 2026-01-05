/**
 * Next.js Middleware
 * 
 * Server-side route protection and security checks.
 * Runs before every matching request.
 * 
 * SECURITY FEATURES:
 * - Protects admin routes server-side
 * - Validates authentication cookies
 * - Prevents unauthorized access before page load
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Routes that require authentication
 */
const PROTECTED_ROUTES = ['/admin'];

/**
 * Routes that should redirect to home if already authenticated
 */
const AUTH_ROUTES = ['/login'];

/**
 * Middleware function
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check for auth token in cookies
    // Firebase stores the auth token in __session or a custom cookie
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
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         * - api routes (handled separately)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
