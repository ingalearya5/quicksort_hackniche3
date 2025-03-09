import mongoose from "mongoose";

const InteractionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User who performed the action
  action: { type: String, required: true }, // "view", "click", "add_to_cart","purchase"
  productId: { type: String, required: false }, // Related product ID
  searchQuery: { type: String, required: false }, // If it's a search event
  filtersUsed: { type: Object, required: false }, // Filter & sort details
  timestamp: { type: Date, default: Date.now }, // Event timestamp
});

const Interaction =  mongoose.models.Interaction ||  mongoose.model("Interaction", InteractionSchema);
export default Interaction;
  