import Connection from "@/lib/db";
import LoyaltyProfile from "@/models/UserLoyalty";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await Connection(); // Ensure DB connection
    console.log("Database connection established");

    const response = await LoyaltyProfile.findOne({ userId });
    if (!response) {
      return NextResponse.json(
        { error: "Loyalty details not found" },
        { status: 404 }
      );
    }

    console.log("Loyalty details fetched:", response);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching loyalty details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
