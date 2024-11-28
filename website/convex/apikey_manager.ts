import { mutation, query } from "./_generated/server";

// Mutation to add or update an API key
export const addOrUpdateApiKey = mutation(
    async (
      { db },
      {
        email,
        provider,
        apiKey,
        isDefault,
        isEnabled,
      }: {
        email: string;
        provider: string;
        apiKey: string;
        isDefault: boolean;
        isEnabled: boolean;
      }
    ) => {
       if (!email || !provider || !apiKey || isDefault === undefined || isEnabled === undefined) {
        throw new Error("Missing required fields for API key.");
      }
  
       const user = await db
        .query("apiKeys")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();
  
      if (!user) {
         await db.insert("apiKeys", {
          email,
          keys: [
            {
              provider,
              key: apiKey,
              isDefault,
              isEnabled,
            },
          ],
        });
      } else {
         const updatedKeys = user.keys.filter(
          (key) => key.provider !== provider
        );  
        updatedKeys.push({
          provider,
          key: apiKey,
          isDefault,
          isEnabled,
        });
  
        await db.patch(user._id, { keys: updatedKeys });
      }
    }
  );
  

// Query to fetch API keys by email
export const getApiKeysByEmail = query(
  async ({ db }, { email }: { email: string }) => {
    const user = await db
      .query("apiKeys")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    return user?.keys || [];  
  }
);
