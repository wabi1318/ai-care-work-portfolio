import OpenAI from "openai";

export async function generateUnicornStory(
  input: string = "Write a one-sentence bedtime story about a unicorn.",
  apiKey?: string
) {
  const client = new OpenAI({
    apiKey: apiKey || process.env.OPENAI_API_KEY,
  });

  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: input,
    });

    return {
      text: response.output_text,
      success: true,
    };
  } catch (error: unknown) {
    console.error("OpenAI APIエラー:", error);
    return {
      text: "",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
