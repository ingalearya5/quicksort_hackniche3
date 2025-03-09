import { NextResponse } from "next/server";
import Connection from "@/lib/db";
import Purchase from "@/models/purchase";

export async function GET() {
  try {
    // Connect to database
    await Connection();

    // Fetch all products from database
    const products = await Purchase.find({});

    // Map products to match the expected format
    return NextResponse.json({ products });
    console.log(products)
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
