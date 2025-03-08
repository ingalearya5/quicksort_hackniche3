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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

loyaltyProfileSchema.methods.updateTier = function () {
  if (this.totalPoints >= 5000) {
    this.tier = "Platinum";
  } else if (this.totalPoints >= 3000) {
    this.tier = "Gold";
  } else if (this.totalPoints >= 1000) {
    this.tier = "Silver";
  } else {
    this.tier = "Standard";
  }
};

const LoyaltyProfile = mongoose.model("LoyaltyProfile", loyaltyProfileSchema);
module.exports = LoyaltyProfile;
