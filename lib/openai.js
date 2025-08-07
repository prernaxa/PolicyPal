import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractRisks(text) {
  const risks = [];

  if (text.includes('resell') || text.includes('third-party')) {
    risks.push('Possible data resale');
  }
  if (text.includes('ads') || text.includes('advertisers')) {
    risks.push('Advertising/tracking data used');
  }
  if (text.includes('location')) {
    risks.push('Location data collected');
  }

  return risks;
}

function calculateTrustScore(text) {
  let score = 10;

  if (/resell|share.*data/.test(text)) score -= 3;
  if (/no responsibility|not liable/.test(text)) score -= 2;
  if (/encrypt|secure/.test(text) === false) score -= 2;

  return Math.max(0, Math.min(10, score)); // Clamp between 0–10
}

function categorizePolicy(text) {
  return {
    dataCollection: /collect|gather/.test(text),
    adTracking: /ads|advertiser/.test(text),
    thirdParty: /third[- ]party|partner/.test(text),
    dataRetention: /retain|store.*data/.test(text),
  };
}

export async function summarizeWithOpenAI(text) {
  // Toggle mock usage
  if (process.env.USE_MOCK === 'true') {
    console.log('Using mock OpenAI response');
    await new Promise((r) => setTimeout(r, 300)); // simulate delay

    const risks = extractRisks(text);
    const score = calculateTrustScore(text);
    const categories = categorizePolicy(text);

    return `
⚠️ Mock Response
- This is a mock AI response for demonstration purposes only. Real OpenAI API calls are currently disabled.

📄 Summary
- This privacy policy discusses the handling of user data.

🚨 Risks
- ${risks[0] || 'No major risks found.'}
- ${risks[1] || risks[0] || 'No major risks found.'}

🔐 Trust Score
${score} / 10

🗂️ Categories  
dataCollection: ${categories.dataCollection ? '✅' : '❌'}  
adTracking: ${categories.adTracking ? '✅' : '❌'}  
thirdParty: ${categories.thirdParty ? '✅' : '❌'}  
dataRetention: ${categories.dataRetention ? '✅' : '❌'}
    `.trim();
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
