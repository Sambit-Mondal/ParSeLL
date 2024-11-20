import { connectDB, UserModel } from '@/utils/users-db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { email, password, role } = await req.json();

        await connectDB();

        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        // Check if the role matches
        if (user.role !== role) {
            return NextResponse.json({ message: `Invalid role for the provided email. Please login as ${user.role}.` }, { status: 403 });
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1h' }
        );

        // Set the JWT token in cookies
        const response = NextResponse.json(
            { message: 'Login successful', dashboard: `${user.role.toLowerCase()}-dashboard` },
            { status: 200 }
        );
        response.cookies.set('auth-token', token, { httpOnly: true, path: '/' });

        return response;
    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: (error as Error).message }, { status: 500 });
    }
}