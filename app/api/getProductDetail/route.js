import Connection from "@/lib/db";
import Product from "@/models/Products";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("id");

    await Connection();
    const response = await Product.findById(productId);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.error({ error,status: 500 });
  }
}
