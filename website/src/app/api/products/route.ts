import { NextResponse } from "next/server";
import axios from "axios";

const LEMON_API_URL = "https://api.lemonsqueezy.com/v1";

export async function GET() {
  try {
    const response = await axios.get(`${LEMON_API_URL}/products?include=variants`, {
      headers: {
        Authorization: `Bearer ${process.env.LEMON_API_KEY}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || "Something went wrong" },
      { status: error.response?.status || 500 }
    );
  }
}
