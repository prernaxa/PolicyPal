import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Analysis from '@/models/Analysis';
import { summarizeWithOpenAI } from '@/lib/openai';
import { extractRisks } from '@/lib/extractRisks';
import { calculateTrustScore } from '@/lib/trustScore';
import { categorizePolicy } from '@/lib/categorizePolicy';
import { getAuth } from '@clerk/nextjs/server'; 

export async function POST(req) {
  await connectToDB();

  const { userId } = getAuth(req); // 👈 get user ID

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { url } = await req.json();
  if (!url || !url.startsWith('http')) {
    return NextResponse.json({ error: 'Invalid or missing URL.' }, { status: 400 });
  }

  try {
    const res = await fetch(url);
    const html = await res.text();

    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!text || text.length < 100) {
      return NextResponse.json({ error: 'Could not extract meaningful text.' }, { status: 400 });
    }

    const summary = await summarizeWithOpenAI(text);
    const risks = extractRisks(text);
    const trustScore = calculateTrustScore(text);
    const categories = categorizePolicy(text);

    await Analysis.create({
      userId, // 👈 associate with user
      source: 'url',
      input: url,
      summary,
      risks,
      trustScore,
      categories,
    });

    return NextResponse.json({
      success: true,
      data: {
        summary,
        risks,
        trustScore,
        categories,
      },
    });
  } catch (err) {
    console.error('URL analysis error:', err);
    return NextResponse.json({ error: 'Failed to analyze URL.' }, { status: 500 });
  }
}
