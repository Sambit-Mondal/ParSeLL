import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Clear the JWT token from cookies
        const response = NextResponse.json({ message: 'Signout successful' }, { status: 200 });
        response.cookies.set('auth-token', '', { httpOnly: true, path: '/', expires: new Date(0) });

        return response;
    } catch (error) {
        console.error('Signout Error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: (error as Error).message }, { status: 500 });
    }
}