import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/utils/database';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { buyerId, productId, quantity, shippingAddress, paymentDetails } = req.body;

            if (!buyerId || !productId || !quantity || !shippingAddress || !paymentDetails) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Connect to the database
            const db = await connectToDatabase();

            // Insert the order into the database
            const result = await db.collection('orders').insertOne({
                buyerId,
                productId,
                quantity,
                shippingAddress,
                paymentDetails,
                status: 'Pending',
                createdAt: new Date(),
            });

            res.status(201).json({ message: 'Order placed successfully', orderId: result.insertedId });
        } catch (error) {
            console.error('Error placing order:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
