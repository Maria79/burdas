import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.set("strictQuery", true); // Keep this for stricter queries, if needed.

  // Check if the database connection is already established
  if (mongoose.connection.readyState) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectDB;
