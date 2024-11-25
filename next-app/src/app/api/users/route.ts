import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import { UserModel } from '@/utils/users-db';
import Chat from '@/utils/chat';

export async function GET(req: NextRequest) {
    await connectDB();

    try {
        const uniqueID = req.headers.get('uniqueID');
        
        if (!uniqueID) {
            return NextResponse.json({ error: 'Missing uniqueID' }, { status: 400 });
        }

        const userChats = await Chat.find({
            $or: [{ buyerID: uniqueID }, { sellerID: uniqueID }]
        });

        const userIDs = new Set();
        userChats.forEach(chat => {
            if (chat.buyerID !== uniqueID) {
                userIDs.add(chat.buyerID);
            }
            if (chat.sellerID !== uniqueID) {
                userIDs.add(chat.sellerID);
            }
        });

        const users = await UserModel.find({ uniqueID: { $in: Array.from(userIDs) } });
        return NextResponse.json(users);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}