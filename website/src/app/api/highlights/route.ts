// src/app/api/highlights/route.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { cors } from '../cors';
import { NextRequest, NextResponse } from "next/server";
// Local variable to temporarily store highlights
let highlightsData: { id: number; title: string; description: string; timestamp: string; website: string }[] = [];

// Utility function to set CORS headers
function setCorsHeaders(response: Response): Response {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow specific methods
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers
  return response;
}

// Handle GET request to retrieve highlights
export async function GET() {
  try {
    const response = new Response(JSON.stringify(highlightsData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error fetching highlights:', error);
    const response = new Response(JSON.stringify({ message: 'Error fetching highlights', error }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return setCorsHeaders(response);
  }
}

// Handle POST request to save highlight
export async function POST(req: NextRequest) {
  const res = new NextResponse();
  cors(req, res);
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");
  const { id, title, description, timestamp, website } = await req.json(); // Parse JSON body
  try {
    console.log("description is ",description);
    const newHighlightId = await client.mutation(api.highlights.addHighlight, { id, title, description, timestamp, website });
    const newHighlight = { id, title, description, timestamp, website };

    const response = new Response(JSON.stringify(newHighlight), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error saving highlight:', error);
    const response = new Response(JSON.stringify({ message: 'Error saving highlight', error }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return setCorsHeaders(response);
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  const response = new Response(null, {
    status: 204,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return setCorsHeaders(response);
}
