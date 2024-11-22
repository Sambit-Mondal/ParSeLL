import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Order Schema
const orderSchema = new Schema({
    buyerId: { type: String, required: true },
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentDetails: {
        method: { type: String, required: true },
        transactionId: { type: String, required: true },
    },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;