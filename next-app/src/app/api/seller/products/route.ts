import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/database";
import { Product } from "@/utils/products";

// Ensure database connection
connectDB();

// GET: Fetch all products
export async function GET() {
    try {
        const products = await Product.find({});
        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
    }
}

// POST: Add a new product
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, productName, price, quantityAvailable, sellerID, country, name, email } = body;

        // Validate input
        if (!productId || !productName || price <= 0 || quantityAvailable < 0 || !sellerID || !country || !name || !email) {
            return NextResponse.json(
                { success: false, message: "Invalid product data" },
                { status: 400 }
            );
        }

        // Check for duplicate product ID
        const existingProduct = await Product.findOne({ productId });
        if (existingProduct) {
            return NextResponse.json(
                { success: false, message: "Product ID already exists" },
                { status: 400 }
            );
        }

        // Save the product with user details
        const newProduct = new Product({
            productId,
            productName,
            price,
            quantityAvailable,
            sellerID,
            country,
            name,
            email
        });

        await newProduct.save();

        return NextResponse.json({ success: true, message: "Product added successfully" });
    } catch (error) {
        console.error("Error adding product:", error);
        return NextResponse.json(
            { success: false, message: "Failed to add product" },
            { status: 500 }
        );
    }
}

// PUT: Update an existing product
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { productId, updates } = body;

        // Validate input
        if (!productId || !updates) {
            return NextResponse.json(
                { success: false, message: "Invalid update data" },
                { status: 400 }
            );
        }

        // Update the product
        const updatedProduct = await Product.findOneAndUpdate({ productId }, updates, {
            new: true,
        });

        if (!updatedProduct) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 });
    }
}

// DELETE: Remove a product
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { productId } = body;

        // Validate input
        if (!productId) {
            return NextResponse.json(
                { success: false, message: "Product ID is required" },
                { status: 400 }
            );
        }

        // Delete the product
        const deletedProduct = await Product.findOneAndDelete({ productId });

        if (!deletedProduct) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully",
            data: deletedProduct,
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
    }
}