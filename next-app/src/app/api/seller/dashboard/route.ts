import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/utils/database';

type DashboardSummary = {
    totalOrders: number;
    totalRevenue: number;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DashboardSummary | { message: string }>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const db = await connectToDatabase();
        const summary = await db.collection('orders').aggregate([
            { $group: { _id: null, totalOrders: { $sum: 1 }, totalRevenue: { $sum: '$amount' } } },
        ]).toArray();

        res.status(200).json(summary[0]);
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}