import Connection from "@/lib/db";
import Interaction from "@/models/Interaction.js";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { userId, action, productId, searchQuery, filtersUsed, timestamp } =
      await req.json();

    await Connection();

    console.log("entered");

    const interaction = new Interaction({
      userId,
      action,
      productId,
      searchQuery,
      filtersUsed,
    });

    await interaction.save();

    console.log(interaction);
    return NextResponse.json(
      { msg: "Interaction tracked successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.error(error, "Failed to create interaction", {
      status: 500,
    });
  }
}
