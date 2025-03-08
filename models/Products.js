import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true }, // You may store price as a number after removing currency symbols
  image: { type: String, required: true }, // Can store image URL or Base64
  rating: { type: Number, default: null }, // Rating is nullable, assuming it’s a number
  link: { type: String, required: true }, // Product URL
  reviews: { type: String, required: false }, // Limited to specific values
  category: { type: String, required: true },
  gender: { type: String, required: false },
}, { timestamps: true }); // Adds createdAt & updatedAt fields

const Product =  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;