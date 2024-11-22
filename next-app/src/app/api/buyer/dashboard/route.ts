import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/utils/database';

type BuyerSummary = {
    totalSpent: number;
    totalOrders: number;
};

export async function GET(
    req: NextApiRequest,
    res: NextApiResponse<BuyerSummary | { message: string }>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const db = await connectToDatabase();
        const buyerSummary = await db.collection('orders').aggregate([
            { $match: { buyerId: req.query.buyerId } },
            { $group: { _id: null, totalSpent: { $sum: '$amount' }, totalOrders: { $sum: 1 } } },
        ]).toArray();

        res.status(200).json(buyerSummary[0]);
    } catch (error) {
        console.error('Error fetching buyer dashboard:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}