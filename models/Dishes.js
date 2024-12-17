import mongoose from "mongoose";

// Define the schema for dishes
const DishesSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, // Field is mandatory
    trim: true, // Removes unnecessary spaces
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  alergenos: {
    type: String,
    default: "", // Optional field, defaults to an empty string
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: "", // Optional field
    trim: true,
  },
  imageUrl: {
    type: String,
    default: "", // Optional field
    trim: true,
  },
  price: {
    type: String, // Price should be convert to a number for calculations
    required: true,
    min: 0, // Ensure price is not negative
  },
});

// Export the model
// Prevents redefining the model during hot reload in development
export default mongoose.models.Dishes || mongoose.model("Dishes", DishesSchema);
