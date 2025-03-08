import Product from "@/models/Products";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("id");

    const response = await Product.findById(productId);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.error({ status: 500 });
  }
}
