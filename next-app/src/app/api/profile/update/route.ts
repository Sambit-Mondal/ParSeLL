import { NextRequest, NextResponse } from 'next/server';
import { connectDB, UserModel } from '@/utils/users-db';

export async function PUT(req: NextRequest) {
    try {
        const { email, name, phone, address } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        await connectDB();

        const user = await UserModel.findOneAndUpdate(
            { email }, 
            { name, phone, address },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch {
        return NextResponse.json({ message: 'Error updating profile' }, { status: 500 });
    }
}