import OpenAI from "openai";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  return new OpenAI({ apiKey });
}

export async function summarizeWithOpenAI(text) {
  // Optional mock mode (safe)
  if (process.env.USE_MOCK === "true") {
    await new Promise((r) => setTimeout(r, 300));
    return "⚠️ Mock response — OpenAI disabled";
  }

  const openai = getOpenAIClient();

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: `
You are a strict privacy policy summarizer.

Respond exactly in this format, once only:
📄 Summary
- bullet

🚨 Risks
- bullet
- bullet

🔐 Trust Score
[x / 10]

🗂️ Categories
dataCollection: ✅/❌
adTracking: ✅/❌
thirdParty: ✅/❌
dataRetention: ✅/❌
        `.trim(),
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  return response.output_text;
}
