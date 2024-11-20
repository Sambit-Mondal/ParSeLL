import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;

    // If token is not available, redirect to /auth
    if (!token) {
        return NextResponse.redirect(new URL('/auth', req.url));
    }

    try {
        // Verify the JWT token
        jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        return NextResponse.next();
    } catch {
        // If verification fails, redirect to /auth
        return NextResponse.redirect(new URL('/auth', req.url));
    }
}

// Routes where this middleware would be applied
export const config = {
    matcher: ['/']
};