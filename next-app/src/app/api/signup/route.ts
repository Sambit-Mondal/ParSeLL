import { NextRequest, NextResponse } from 'next/server';
import { connectDB, UserModel } from '@/utils/users-db';
import { sendEmail } from '@/utils/email';
import bcrypt from 'bcrypt';

function generateUniqueID(role: string): string {
    const prefix = role === 'Seller' ? 'SELL-' : 'BUY-';
    const randomID = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random ID
    return `${prefix}${randomID}`;
}

export async function POST(req: NextRequest) {
    try {
        const { username, name, email, password, phone, role } = await req.json();
        await connectDB();

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const uniqueID = generateUniqueID(role);

        const newUser = new UserModel({
            username,
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            uniqueID,
        });

        await newUser.save();

        // Send the unique ID to the user's email
        const subject = 'Welcome to ParSeLL';
        const text = `Hello, welcome to ParSeLL! Your unique ID is: ${uniqueID}`;
        await sendEmail(email, subject, text);

        return NextResponse.json({ message: 'User created successfully, check your email for your unique ID.', uniqueID }, { status: 201 });
    } catch (error) {
        console.error('Signup Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
    }
}