import { Schema, model, models } from "mongoose";

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
        type: String,
        required: true,
    },
    quantityAvailable: {
        type: String,
        required: true,
    },
    sellerID: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export const Product = models.Product || model("Product", productSchema);