import { NextResponse } from "next/server";
import connectDB from "@/utils/database";
import { Order } from "@/utils/order";
import { Product } from "@/utils/products";
import { sendEmail } from "@/utils/email";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const buyerID = url.searchParams.get("buyerID");

        // Ensure buyerID is provided
        if (!buyerID) {
            return NextResponse.json(
                { success: false, message: "Missing buyerID" },
                { status: 400 }
            );
        }

        await connectDB();

        // Fetch orders for the given buyerID
        const orders = await Order.find({ buyerID });

        if (orders.length === 0) {
            return NextResponse.json(
                { success: true, message: "No orders found", data: [] },
                { status: 200 }
            );
        }

        // Transform orders to include orderId instead of _id
        const transformedOrders = orders.map((order) => ({
            orderId: order._id, // Map _id to orderId
            productName: order.productName,
            price: order.price,
            status: order.status,
            createdAt: order.createdAt,
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

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            productId,
            quantity,
            price,
            shippingAddress,
            paymentDetails,
            name,
            buyerID,
            email,
            buyerCountry,
        } = body;

        // Ensure required fields are provided
        if (!productId || !quantity || !price || !shippingAddress || !paymentDetails) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        // Fetch the product
        const product = await Product.findOne({ productId });
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        // Check if the quantity requested is available
        if (quantity > product.quantityAvailable) {
            return NextResponse.json({ success: false, message: "Insufficient stock" }, { status: 400 });
        }

        // Create the order
        const order = await Order.create({
            orderId: new mongoose.Types.ObjectId(), // Add OrderId field
            productId: product.productId,
            productName: product.productName,
            quantity,
            name,
            buyerID,
            email,
            price,
            buyerCountry,
            shippingAddress,
            paymentDetails,
            sellerID: product.sellerID,
            sellerEmail: product.email,
            sellerName: product.name,
            sellerCountry: product.country,
        });

        // Update the product quantity
        product.quantityAvailable -= quantity;
        await product.save();

        // Send email to buyer
        const buyerSubject = "Order Confirmation - Your order has been placed!";
        const buyerText = `Hello ${name},\n\nThank you for your order!\n\nProduct: ${product.productName}\nQuantity: ${quantity}\nTotal Price: $${price}\nShipping Address: ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zip}, ${shippingAddress.country}\n\nWe will notify you once your order is shipped.\n\nBest regards,\nParSeLL Team`;

        await sendEmail(email, buyerSubject, buyerText);

        // Send email to seller
        const sellerSubject = "New Order Received - You have a new order!";
        const sellerText = `Hello ${product.name},\n\nYou have received a new order!\n\nBuyer: ${name}\nQuantity: ${quantity}\nTotal Price: $${price}\nShipping Address: ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zip}, ${shippingAddress.country}\n\nPlease prepare the product for shipping.\n\nBest regards,\nParSeLL Team`;

        await sendEmail(product.email, sellerSubject, sellerText);

        return NextResponse.json(
            { success: true, message: "Order placed successfully", data: order },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error placing order:", error);

        if (error.name === "ValidationError") {
            return NextResponse.json(
                { success: false, message: "Validation Error", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}