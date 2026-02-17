import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // loads variables from .env

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // use env variable
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
