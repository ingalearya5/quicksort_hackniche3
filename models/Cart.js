import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [cartItemSchema],
  totalItems: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;