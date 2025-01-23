import mongoose from "mongoose";

// Define the schema for orders
const OrdersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    basket: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Item ID
        name: { type: String, required: true }, // Item name
        type: { type: String, required: true }, // Item type/category
        extra: {
          name: { type: String, required: true },
          price: { type: String, required: true },
        },
        count: { type: Number, required: true }, // Quantity of the item
        price: { type: String, required: true }, // Price of the item
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["onStore", "creditCard"], // Enum for valid payment methods
      required: true,
    },
    totalPrice: { type: String, required: true },
    status: {
      received: {
        type: Boolean,
        default: true, // This ensures Mongoose sets it to true if omitted
      },
      inProgress: {
        type: Boolean,
        default: false, // This ensures Mongoose sets it to false if omitted
      },
      readyToPick: {
        type: Boolean,
        default: false, // This ensures Mongoose sets it to false if omitted
      },
      done: {
        type: Boolean,
        default: false, // This ensures Mongoose sets it to false if omitted
      },
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the model
export default mongoose.models.Orders || mongoose.model("Orders", OrdersSchema);
