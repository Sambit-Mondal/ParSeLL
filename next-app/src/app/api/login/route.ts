import { connectDB, UserModel } from '@/utils/users-db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export interface IUser {
    uniqueID: string;
    role: string;
    password: string;
}

export async function POST(req: NextRequest) {
    try {
        const { uniqueID, password, role } = await req.json();

        await connectDB();

        // Validate input
        if (!uniqueID || !password || !role) {
            return NextResponse.json(
                { message: 'All fields are required: Unique ID, Password, and Role' },
                { status: 400 }
            );
        }

        // Check if the user exists with the provided unique ID
        const user = await UserModel.findOne({ uniqueID });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid unique ID or password' },
                { status: 401 }
            );
        }

        // Check if the role matches
        if (user.role !== role) {
            return NextResponse.json(
                { message: `Invalid role for the provided unique ID` },
                { status: 403 }
            );
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Invalid unique ID or password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, uniqueID: user._id, role: user.role },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1h' }
        );

        // Set the JWT token in cookies
        const response = NextResponse.json(
            { message: 'Login successful', dashboard: `${user.role.toLowerCase()}` },
            { status: 200 }
        );
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600, // 1 hour
        });

        return response;
    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: (error as Error).message },
            { status: 500 }
        );
    }
}