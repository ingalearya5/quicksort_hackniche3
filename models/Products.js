import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true }, // You may store price as a number after removing currency symbols
  image: { type: String, required: true }, // Can store image URL or Base64
  rating: { type: Number, default: null }, // Rating is nullable, assuming it’s a number
  link: { type: String, required: true }, // Product URL
  review: { type: String, enum: ["Positive", "Neutral", "Negative"], required: true }, // Limited to specific values
  category: { type: String, required: true }
}, { timestamps: true }); // Adds createdAt & updatedAt fields

const Product =  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;