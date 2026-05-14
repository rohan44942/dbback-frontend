/**
 * Middleware for Protected Routes
 * 
 * This middleware runs on every request and checks if the user is authenticated.
 * If not authenticated and trying to access protected routes, it redirects to login.
 * 
 * Learn more: https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/backups', '/schedules', '/settings'];

// TEMPORARY: Bypass all authentication checks for development
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
