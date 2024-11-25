import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import Chat from '@/utils/chat';

export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const { buyerID, sellerID, message } = await req.json();

        if (!buyerID || !sellerID || !message) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        let chat = await Chat.findOne({ buyerID, sellerID });

        if (!chat) {
            // If chat doesn't exist, create a new document
            chat = new Chat({ buyerID, sellerID, messages: [] });
        }

        chat.messages.push(message);
        await chat.save();

        return NextResponse.json({ success: true, chat });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
}