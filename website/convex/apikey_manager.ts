import { mutation, query } from "./_generated/server";
import CryptoJS from "crypto-js";

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

    const encryptedApiKey = CryptoJS.AES.encrypt(apiKey, process.env.SECURITY_PHRASE as string).toString();


    // for decryption :-----

    // const bytes = CryptoJS.AES.decrypt(encryptedApiKey, process.env.SECURITY_PHRASE as string);
    // const decryptedApiKey = bytes.toString(CryptoJS.enc.Utf8);

    // console.log("Decrypted API Key:", decryptedApiKey);

    
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
            key: encryptedApiKey,
            isDefault,
            isEnabled,
          },
        ],
      });
    } else {
      const updatedKeys = user.keys.filter((key) => key.provider !== provider);
      updatedKeys.push({
        provider,
        key: encryptedApiKey,
        isDefault,
        isEnabled,
      });

      await db.patch(user._id, { keys: updatedKeys });
    }
  }
);




export const getApiKeysByEmail = query(
  async ({ db }, { email }: { email: string }) => {
    const user = await db
      .query("apiKeys")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      throw new Error("User not found.");
    }

    // const secret = process.env.SECURITY_PHRASE as string;
    // if (!secret) {
    //   throw new Error("SECURITY_PHRASE is not defined in environment variables.");
    // }

    // const decryptedKeys = user.keys.map((key) => {
    //   try {
    //     if (!key.key || typeof key.key !== "string") {
    //       throw new Error(`Invalid or missing encrypted key for provider: ${key.provider}`);
    //     }
    //     const bytes = CryptoJS.AES.decrypt(key.key, secret);
    //     const decryptedApiKey = bytes.toString(CryptoJS.enc.Utf8);
    //     if (!decryptedApiKey) {
    //       throw new Error(`Decryption failed for provider: ${key.provider}`);
    //     }

    //     return {
    //       provider: key.provider,
    //       key: decryptedApiKey,
    //       isDefault: key.isDefault,
    //       isEnabled: key.isEnabled,
    //     };
    //   } catch (error:any) {
    //     throw new Error(`Error decrypting key for provider ${key.provider}: ${error.message}`);
    //   }
    // });

    return user?.keys || [];  
  }
);


export const deleteApiKey = mutation(
  async ({ db }, { email, provider }: { email: string; provider: string }) => {
    if (!provider || !email) {
      throw new Error("Missing required field for API key provider.");
    }

    const user = await db
      .query("apiKeys")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      throw new Error("User not found.");
    }

    const remainingKeys = user.keys.filter((key) => key.provider !== provider);

    if (remainingKeys.length === user.keys.length) {
      throw new Error(`No API key found for provider: ${provider}`);
    }

    await db.patch(user._id, { keys: remainingKeys });

    return { message: `API key for provider ${provider} successfully deleted.` };
  }
);


export const toggleApiKeyEnabled = mutation(
  async (
    { db },
    { email, keyId }: { email: string; keyId: string }
  ) => {
    if (!email || !keyId) {
      throw new Error("Email and keyId are required.");
    }
    const user = await db
      .query("apiKeys")
      .filter((q) => q.eq(q.field("email"), email))
      .unique();

    if (!user) {
      throw new Error("API key record not found.");
    }

    const updatedKeys = user.keys.map((key) => {
      if (key.key === keyId) {
        return { ...key, isEnabled: !key.isEnabled };
      }
      return key;
    });

    const keyToUpdate = updatedKeys.find((key) => key.key === keyId);

    if (!keyToUpdate) {
      throw new Error("API key not found in the user's keys.");
    }
    await db.patch(user._id, { keys: updatedKeys });

    return { success: true, isEnabled: keyToUpdate.isEnabled };
  }
);
