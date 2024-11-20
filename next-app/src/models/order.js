import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        customerName: { type: String, required: true },
        items: { type: [String], required: true },
        totalAmount: { type: Number, required: true },
        status: { type: String, default: "Pending" },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);