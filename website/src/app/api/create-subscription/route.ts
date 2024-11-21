import { NextResponse } from "next/server";
import axios from "axios";

const LEMON_API_URL = "https://api.lemonsqueezy.com/v1";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const reqData = await req.json();

    // Debugging: Check if productId and storeId are passed in the request
    console.log("Received Request Data:", reqData);

    // Validate productId and storeId
    if (!reqData.productId || !process.env.LEMON_STORE_ID) {
      return NextResponse.json(
        { message: "productId and storeId are required" },
        { status: 400 }
      );
    }

    // Prepare payload
    const payload = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              user_id: "123", // Replace with dynamic user ID if needed
            },
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMON_STORE_ID,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: "605843", // Dynamic product/variant ID
            },
          },
        },
      },
    };

    // Debugging: Log payload before sending
    console.log("Payload sent to Lemon Squeezy:", JSON.stringify(payload, null, 2));

    // Send POST request to Lemon Squeezy API
    const response = await axios.post(`${LEMON_API_URL}/checkouts`, payload, {
      headers: {
        Authorization: `Bearer ${process.env.LEMON_API_KEY}`,
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
    });

    // Extract checkout URL from response
    const checkoutUrl = response.data.data.attributes.url;

    return NextResponse.json({
      success: true,
      message: "Checkout session created",
      checkoutUrl,
    });
  } catch (error: any) {
    if (error.response) {
      // Detailed error logging
      console.error("Error response from API:", error.response.data);
    } else {
      console.error("Unexpected error:", error.message);
    }
    return NextResponse.json(
      { message: error.response?.data?.message || "An unexpected error occurred" },
      { status: error.response?.status || 500 }
    );
  }
}
