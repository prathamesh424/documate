import OpenAI from "openai";

const openai = new OpenAI({ baseURL: "https://api.rhymes.ai/v1", dangerouslyAllowBrowser: true, apiKey: `${process.env.NEXT_PUBLIC_ARIA_API_KEY}` });

export const callApi = async (systemPrompt:string, userPrompt:string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "aria",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};
