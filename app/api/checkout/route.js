import { currentUser } from "@clerk/nextjs/server";
import Purchase from "@/models/purchase";
import UserLoyalty from "@/models/UserLoyalty";
import Connection from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

// Define tier thresholds
const TIER_THRESHOLDS = {
  Standard: 0,
  Silver: 250,
  Gold: 500,
  Platinum: 1000,
};

// Function to determine the correct tier based on points
function determineTier(points) {
  if (points >= TIER_THRESHOLDS.Platinum) return "Platinum";
  if (points >= TIER_THRESHOLDS.Gold) return "Gold";
  if (points >= TIER_THRESHOLDS.Silver) return "Silver";
  return "Standard";
}

export async function POST(request) {
  try {
    // Get authenticated user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { cart, sessionData } = body;

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // Connect to MongoDB
    await Connection();

    // Fetch user's current loyalty profile before update
    let previousLoyalty = await UserLoyalty.findOne({ userId: user.id });

    // Calculate new points based on purchase
    const newPoints = Math.round(cart.totalAmount / 50);
    const currentPoints = previousLoyalty?.totalPoints || 0;
    const updatedTotalPoints = currentPoints + newPoints;

    // Determine the new tier based on updated points
    const updatedTier = determineTier(updatedTotalPoints);

    // Create a new purchase record
    const purchase = new Purchase({
      userId: user.id,
      orderId: uuidv4(),
      items: cart.items.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: Number(item.price),
      })),
      totalAmount: cart.totalAmount,
      totalItems: cart.totalItems,
      sessionData: sessionData || {},
    });

    // Save the purchase
    await purchase.save();

    // Update Loyalty Profile with new points & tier
    const updatedLoyalty = await UserLoyalty.findOneAndUpdate(
      { userId: user.id },
      {
        totalPoints: updatedTotalPoints,
        tier: updatedTier, // Upgrade tier if needed
      },
      { new: true, upsert: true }
    );

    // Update analytics for this user
    await Purchase.updatePurchaseAnalytics(user.id);

    return NextResponse.json({
      success: true,
      orderId: purchase.orderId,
      previousLoyalty: previousLoyalty || null, // If no record was found before, return null
      updatedLoyalty: updatedLoyalty,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { message: "Failed to process checkout", error: error.message },
      { status: 500 }
    );
  }
}
