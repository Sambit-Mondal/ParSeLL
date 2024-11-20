import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/utils/database';
import { ObjectId } from 'mongodb';

type Order = {
  _id: string;
  status: string;
  [key: string]: string | number | boolean | object;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Order[] | { message: string }>
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const db = await connectToDatabase();
      const orders = await db.collection('orders').find({ sellerId: id }).toArray();
      res.status(200).json(orders);
    } catch {
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  } else if (req.method === 'PUT') {
    const { status } = req.body;
    try {
      const db = await connectToDatabase();
      await db.collection('orders').updateOne({ _id: new ObjectId(id as string) }, { $set: { status } });
      res.status(200).json({ message: 'Order status updated' });
    } catch {
      res.status(500).json({ message: 'Failed to update order status' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}