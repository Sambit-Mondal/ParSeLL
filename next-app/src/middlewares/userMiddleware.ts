import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;

    // Check if the user is authenticated
    if (!token) {
        // Redirect unauthenticated users to the /auth page unless already on /auth
        if (req.nextUrl.pathname !== '/auth') {
            return NextResponse.redirect(new URL('/auth', req.url));
        }
        return NextResponse.next();
    }

    try {
        // Verify the JWT token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

        // Redirect authenticated users away from the /auth page
        if (req.nextUrl.pathname === '/auth') {
            return NextResponse.redirect(new URL('/', req.url));
        }

        // Attach decoded token to request headers for downstream handling (optional)
        req.headers.set('x-auth-user', JSON.stringify(decodedToken));
        return NextResponse.next();
    } catch {
        // Redirect to /auth if token verification fails
        return NextResponse.redirect(new URL('/auth', req.url));
    }
}

export const config = {
    // Apply middleware to the following routes
    matcher: ['/auth', '/', '/api/:'],
};