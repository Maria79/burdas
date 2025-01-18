import mongoose from "mongoose";

// Define the schema for admin users
const UserAdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the model
export default mongoose.models.UserAdmin ||
  mongoose.model("UserAdmin", UserAdminSchema);
