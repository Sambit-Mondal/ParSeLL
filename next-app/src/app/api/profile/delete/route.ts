import { NextRequest, NextResponse } from 'next/server';
import { connectDB, UserModel } from '@/utils/users-db';

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        await connectDB();

        const user = await UserModel.findOneAndDelete({ email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile deleted successfully' });
    } catch {
        return NextResponse.json({ message: 'Error deleting profile' }, { status: 500 });
    }
}