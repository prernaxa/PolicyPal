export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Analysis from '@/models/Analysis';
import { summarizeWithOpenAI } from '@/lib/openai'; 
import { extractRisks } from '@/lib/extractRisks';
import { calculateTrustScore } from '@/lib/trustScore';
import { categorizePolicy } from '@/lib/categorizePolicy';
import { getAuth } from '@clerk/nextjs/server'; 

export async function POST(req) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { text } = await req.json();
  if (!text || text.length < 20) {
    return NextResponse.json(
      { error: 'Text is too short or missing.' },
      { status: 400 }
    );
  }

  try {
    await connectToDB();

    const summary = await summarizeWithOpenAI(text);
    const risks = extractRisks(text);
    const trustScore = calculateTrustScore(text);
    const categories = categorizePolicy(text);

    await Analysis.create({
      userId,
      source: 'text',
      input: text,
      summary,
      risks,
      trustScore,
      categories,
    });

    return NextResponse.json({
      success: true,
      data: { summary, risks, trustScore, categories },
    });
  } catch (err) {
    console.error('Error analyzing text:', err);
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    );
  }
}
