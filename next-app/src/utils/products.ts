import mongoose, { Schema, model, models } from "mongoose";

const productSchema = new Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
    },
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantityAvailable: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export const Product = models.Product || model("Product", productSchema);