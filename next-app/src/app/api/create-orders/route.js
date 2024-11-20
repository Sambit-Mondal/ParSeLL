import { connectToDatabase } from "@/utils/db";
import Order from "@/models/Order";

export async function POST(req) {
    try {
        const body = await req.json();
        const { customerName, items, totalAmount } = body;

        if (!customerName || !items || !totalAmount) {
            return new Response(JSON.stringify({ error: "Invalid order data" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        await connectToDatabase();

        const newOrder = await Order.create({
            customerName,
            items,
            totalAmount,
        });

        return new Response(JSON.stringify({ order: newOrder }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create order" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}