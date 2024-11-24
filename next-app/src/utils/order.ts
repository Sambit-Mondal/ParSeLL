import { Schema, model, models } from "mongoose";

const orderSchema = new Schema({
    OrderId: { type: String, required: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    name: { type: String, required: true },
    buyerID: { type: String, required: true },
    email: { type: String, required: true }, // Fixed field name from 'mail' to 'email'
    price: { type: Number, required: true },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: Number, required: true },
        country: { type: String, required: true },
    },
    paymentDetails: {
        method: { type: String, required: true },
        transactionId: { type: String, required: true },
    },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
    sellerEmail: { type: String, required: true },
    sellerID: { type: String, required: true },
    sellerName: { type: String, required: true },
    sellerCountry: { type: String, required: true },
    buyerCountry: { type: String, required: true },
});

export const Order = models.Order || model("Order", orderSchema);