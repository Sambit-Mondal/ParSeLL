import { NextResponse } from "next/server";
import connectDB from "@/utils/database";
import { Order } from "@/utils/order";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const sellerID = url.searchParams.get("sellerID");

        // Ensure sellerID is provided
        if (!sellerID) {
            return NextResponse.json(
                { success: false, message: "Missing sellerID" },
                { status: 400 }
            );
        }

        await connectDB();

        // Fetch orders for the given sellerID
        const orders = await Order.find({ sellerID });

        if (orders.length === 0) {
            return NextResponse.json(
                { success: true, message: "No orders found", data: [] },
                { status: 200 }
            );
        }

        // Transform orders to include orderId instead of _id
        const transformedOrders = orders.map((order) => ({
            orderId: order._id,
            productId: order.productId,
            productName: order.productName,
            buyerName: order.name,
            createdAt: order.createdAt,
            quantity: order.quantity,
            status: order.status,
        }));

        return NextResponse.json(
            { success: true, message: "Orders fetched successfully", data: transformedOrders },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectDB();

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Order status updated successfully", data: updatedOrder },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error updating order status:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}