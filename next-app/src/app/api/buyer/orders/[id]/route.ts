import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/utils/database';
import { ObjectId } from 'mongodb';

type Order = {
    _id: string;
    status: string;
    [key: string]: unknown;
};

export async function GET(
    req: NextApiRequest,
    res: NextApiResponse<Order | { message: string }>
) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const db = await connectToDatabase();
            const order = await db.collection('orders').findOne({ _id: new ObjectId(id as string) });
            if (!order) return res.status(404).json({ message: 'Order not found' });

            res.status(200).json(order);
        } catch {
            res.status(500).json({ message: 'Failed to fetch order details' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}