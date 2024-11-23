import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/utils/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const { productId } = req.body;

            if (!productId) {
                res.status(400).json({ error: "Product ID is required" });
                return;
            }

            const db = await connectToDatabase();
            const productsCollection = db.collection("products");
            const ordersCollection = db.collection("orders");

            // Check if the product exists and has sufficient quantity
            const product = await productsCollection.findOne({ productId });

            if (!product) {
                res.status(404).json({ error: "Product not found" });
                return;
            }

            if (product.quantityAvailable <= 0) {
                res.status(400).json({ error: "Product is out of stock" });
                return;
            }

            // Deduct the product quantity and insert the order
            await productsCollection.updateOne(
                { productId },
                { $inc: { quantityAvailable: -1 } }
            );

            await ordersCollection.insertOne({
                productId,
                orderDate: new Date(),
            });

            res.status(201).json({ message: "Order placed successfully" });
        } else {
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}