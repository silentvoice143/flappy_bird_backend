import mongoose from "mongoose";

const connectDB = async () => {
  console.log("Connecting to MongoDB...", process.env.MONGO_URI);
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "", {
      dbName: process.env.DB_NAME || "flappy_rewards",
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
