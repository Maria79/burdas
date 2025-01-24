import mongoose from "mongoose";

// Define the schema for orders
const OrdersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    basket: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        extras: [
          {
            name: { type: String },
          },
        ], // Ensure it's an array of extras
        count: { type: Number, required: true },
        price: { type: String, required: true },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["onStore", "creditCard"],
      required: true,
    },
    totalPrice: { type: String, required: true },
    status: {
      received: { type: Boolean, default: true },
      inProgress: { type: Boolean, default: false },
      readyToPick: { type: Boolean, default: false },
      done: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Export the model
export default mongoose.models.Orders || mongoose.model("Orders", OrdersSchema);
