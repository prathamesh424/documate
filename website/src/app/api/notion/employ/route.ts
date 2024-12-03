import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/notion";

// Handle GET requests
export async function GET() {
  try {
    const data = await getDatabase(); // Fetch data securely from Notion
    return NextResponse.json(data, { status: 200 }); // Return JSON response
  } catch (error) {
    console.error("Error fetching Notion data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
