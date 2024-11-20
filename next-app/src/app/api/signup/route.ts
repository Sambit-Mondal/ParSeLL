import { NextRequest, NextResponse } from 'next/server';
import { connectDB, UserModel } from '@/utils/users-db';
import bcrypt from 'bcrypt';

// Handle POST requests
export async function POST(req: NextRequest) {
    try {
        const { username, name, email, password, phone, role } = await req.json();
        await connectDB();

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            username,
            name,
            email,
            password: hashedPassword,
            phone,
            role,
        });

        await newUser.save();

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Signup Error:', error);  // Log the error for debugging
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
    }
}