import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/database';

export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {
        const db = await connectToDatabase();
        const summary = await db.collection('orders').aggregate([
            { $group: { _id: null, totalOrders: { $sum: 1 }, totalRevenue: { $sum: '$amount' } } },
        ]).toArray();

        if (summary.length === 0) {
            return NextResponse.json({ message: 'No data found' }, { status: 404 });
        }

        return NextResponse.json(summary[0], { status: 200 });
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}