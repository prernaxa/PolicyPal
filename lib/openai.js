import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MOCK_RESPONSE = `
📄 Summary
- ExampleCorp collects, uses, and shares personal data, including with third parties for advertising, and retains data indefinitely unless deletion is requested.

🚨 Risks
- Data is shared with third-party partners for advertising.
- User data is retained indefinitely unless a deletion request is made.

🔐 Trust Score
4 / 10

🗂️ Categories  
dataCollection: ✅  
adTracking: ✅  
thirdParty: ✅  
dataRetention: ✅
`.trim();

export async function summarizeWithOpenAI(text) {
  // Toggle mock usage
  if (process.env.USE_MOCK === 'true') {
    console.log('Using mock OpenAI response');
    await new Promise((r) => setTimeout(r, 300)); // simulate delay
    return MOCK_RESPONSE;
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }

  const systemPrompt = `
You are a strict privacy policy summarizer.

Respond in this exact format, once only — do not repeat anything:
📄 Summary
- [bullet point summary]

🚨 Risks
- [two bullet points]

🔐 Trust Score
[x / 10]

🗂️ Categories  
dataCollection: ✅/❌  
adTracking: ✅/❌  
thirdParty: ✅/❌  
dataRetention: ✅/❌

Do NOT add extra commentary or outputs. Do NOT wrap in code blocks.
`;

  const userPrompt = `Here is the privacy policy to analyze:\n"""${text}"""`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error('No response from OpenAI');

    // Ensure no repeated sections
    const sectionOrder = [
      '📄 Summary',
      '🚨 Risks',
      '🔐 Trust Score',
      '🗂️ Categories',
    ];

    const sections = {};
    let current = null;

    for (const line of raw.split('\n')) {
      const trimmed = line.trim();

      // Match header by checking if line starts with a section header
      const matchedHeader = sectionOrder.find((header) =>
        trimmed.startsWith(header)
      );

      if (matchedHeader) {
        if (!sections[matchedHeader]) {
          current = matchedHeader;
          sections[current] = [];
        } else {
          current = null; // skip duplicate
        }
      } else if (current) {
        sections[current].push(trimmed);
      }
    }

    // Reconstruct summary in proper order
    const cleaned = sectionOrder
      .filter((header) => sections[header])
      .map((header) => `${header}\n${sections[header].join('\n').trim()}`)
      .join('\n\n');

    return cleaned.replace(/\*\*/g, '').trim();

  } catch (err) {
    console.error('OpenAI error:', err);
    throw new Error('An error occurred while summarizing. Please try again.');
  }
}
