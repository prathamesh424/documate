// src/app/api/highlights/route.ts
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

// Local variable to temporarily store highlights
let highlightsData: { id: number; title: string; description: string; timestamp: string; website: string }[] = [];

// Handle GET request to retrieve highlights
export async function GET() {
    try {
        return new Response(JSON.stringify(highlightsData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching highlights:', error);
        return new Response(JSON.stringify({ message: 'Error fetching highlights', error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

// Handle POST request to save highlight
export async function POST(req: Request) {
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL||"");
    const {id, title, description, timestamp, website } = await req.json(); // Parse JSON body
    // const addHighlight = useMutation(api.highlights.addHighlight);
    try {
      const newHighlightId = await client.mutation(api.highlights.addHighlight,{id, title, description, timestamp, website});
      const newHighlight = { id, title, description, timestamp, website };
  
      return new Response(JSON.stringify(newHighlight), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error saving highlight:', error);
      return new Response(JSON.stringify({ message: 'Error saving highlight', error }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }