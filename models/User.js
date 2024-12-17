import mongoose from "mongoose";

// Define the schema for orders
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
// Prevents redefining the model during hot reload in development
export default mongoose.models.User || mongoose.model("User", UserSchema);
