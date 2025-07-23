import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Analysis from '@/models/Analysis';
import { summarizeWithOpenAI } from '@/lib/openai';
import { extractRisks } from '@/lib/extractRisks';
import { calculateTrustScore } from '@/lib/trustScore';
import { categorizePolicy } from '@/lib/categorizePolicy';
import { getAuth } from '@clerk/nextjs/server';
import pdf from 'pdf-parse/lib/pdf-parse.js';

export const config = { api: { bodyParser: false } };

export async function POST(req) {
  await connectToDB();

  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB limit
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds 2MB limit.' },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const data = await pdf(buffer);
    const text = data.text;

    const summary = await summarizeWithOpenAI(text);
    const risks = extractRisks(text);
    const trustScore = calculateTrustScore(text);
    const categories = categorizePolicy(text);

    await Analysis.create({
      userId,
      source: 'pdf',
      input: file.name,
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
    console.error('PDF analysis error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
