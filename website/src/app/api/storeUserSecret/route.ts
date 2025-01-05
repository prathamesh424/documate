import { createConvexClient } from "convex"; // Import the Convex client
import { NextApiRequest, NextApiResponse } from "next";

// Initialize Convex client
const client = createConvexClient({
  apiUrl: process.env.NEXT_PUBLIC_CONVEX_API_URL, // Your Convex API URL
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, encryptedToken } = req.body;

    try {
      // Call the mutation on the Convex server
      const result = await client.mutation("storeUserSecret", { email, encryptedToken });

      if (result.success) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ error: "Failed to store user secret" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
