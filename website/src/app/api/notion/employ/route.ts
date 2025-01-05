import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/notion";

// Handle GET requests
/*
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
*/

/*
export async function GET() {
  try {
    const data = await getDatabase(); // Fetch data from Notion

    // Transform data to include only specific properties
    const transformedData = data.map((page: any) => ({
      id: page.id,
      title: page.properties.Title?.title[0]?.plain_text || "Untitled",
      status: page.properties.Status?.status?.name || "No Status",
      created: page.properties.Created?.created_time || "Unknown",
      tags: page.properties.Tags?.multi_select.map((tag: any) => tag.name) || [],
    }));

    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching Notion data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

*/

import { notion, databaseId } from "@/lib/notion";

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId!, // Use the shared database ID
    });

    return NextResponse.json({ success: true, data: response.results });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch data" }, { status: 500 });
  }
}
