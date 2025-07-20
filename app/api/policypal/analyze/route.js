// /app/api/policypal/analyze/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { text } = await req.json();

  if (!text || text.length < 20) {
    return NextResponse.json({ error: 'Text is too short or missing.' }, { status: 400 });
  }

  try {
    const summary = await summarizeWithGemini(text);

    return NextResponse.json({ success: true, data: summary });
  } catch (err) {
    console.error('Gemini API error:', err);
    return NextResponse.json({ error: 'Failed to summarize' }, { status: 500 });
  }
}
