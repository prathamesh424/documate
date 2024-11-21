import { NextResponse } from "next/server";
import { lemonSqueezyApiInstance } from "@/utils/axios";
const LEMON_API_URL = "https://api.lemonsqueezy.com/v1";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const reqData = await req.json();

    if (!reqData.productId)
      return Response.json(
        { message: "productId is required" },
        { status: 400 }
      );

    const response = await lemonSqueezyApiInstance.post("/checkouts", {
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
              id: process.env.LEMON_STORE_ID.toString(),
            },
          },
          variant: {
            data: {
              type: "variants",
              id: reqData.productId.toString(),
            },
          },
        },
      },
    });

    const checkoutUrl = response.data.data.attributes.url;
    console.log(response.data);

    return NextResponse.json({
      success: true,
      message: "Checkout session created",
      checkoutUrl,
    });
  } catch (error: any) {
    console.error("Error creating subscription:", error.message);
    return NextResponse.json(
      { message: error.response?.data || error },
      { status: error.response?.status || 500 }
    );
  }
}
