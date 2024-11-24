import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        const mongoUri = process.env.NEXT_APP_MONGODB_URL;
        if (!mongoUri) {
            throw new Error("NEXT_APP_MONGODB_URL is not defined");
        }
        await mongoose.connect(mongoUri, {
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;