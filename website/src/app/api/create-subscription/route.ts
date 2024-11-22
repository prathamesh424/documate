import { NextResponse } from "next/server";
import axios from "axios";

const LEMON_API_URL = "https://api.lemonsqueezy.com/v1";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const reqData = await req.json();
    if (!reqData.productId || !process.env.LEMON_STORE_ID) {
      return NextResponse.json(
        { message: "productId and storeId are required" },
        { status: 400 }
      );
    }
    const payload = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              user_id: "123", 
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
              id: reqData.productId
            },
          },
        },
      },
    };

    const response = await axios.post(`${LEMON_API_URL}/checkouts`, payload, {
      headers: {
        Authorization: `Bearer ${process.env.LEMON_API_KEY}`,
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
    });

    
    const checkoutUrl = response.data.data.attributes.url;

    return NextResponse.json({
      success: true,
      message: "Checkout session created",
      checkoutUrl,
    });
  } catch (error: any) {
    if (error.response) {

      console.error("Error response from API:", error.response.data);
      return NextResponse.json({
        success: false,
        message: error.response.data.message || "An error occurred while creating the checkout session",
      });

    } else {
      console.error("Unexpected error:", error.message);
    }
    return NextResponse.json(
      { message: error.response?.data?.message || "An unexpected error occurred" },
      { status: error.response?.status || 500 }
    );
  }
}
