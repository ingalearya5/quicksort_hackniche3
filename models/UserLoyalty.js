import mongoose from "mongoose";

const userLoyalty = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    totalPoints: {
      type: Number,
      default: 0,
    },
    tier: {
      type: String,
      enum: ["Standard", "Silver", "Gold", "Platinum"],
      default: "Standard",
    },
  },
  { timestamps: true }
);

const LoyaltyProfile =
  mongoose.models.LoyaltyProfile ||
  mongoose.model("LoyaltyProfile", userLoyalty);
export default LoyaltyProfile;
