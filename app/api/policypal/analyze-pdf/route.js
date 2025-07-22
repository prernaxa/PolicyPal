import { NextResponse } from 'next/server';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { connectToDB } from '@/lib/db';
import Analysis from '@/models/Analysis';
import { summarizeWithOpenAI } from '@/lib/openai'; // ✅ corrected import name
import { extractRisks } from '@/lib/extractRisks';
import { calculateTrustScore } from '@/lib/trustScore';
import { categorizePolicy } from '@/lib/categorizePolicy';

export const config = { api: { bodyParser: false } };

export async function POST(req) {
  await connectToDB();

  const formData = await req.formData();
  const file = formData.get('file');
  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const data = await pdf(buffer);
    const text = data.text;

    const summary = await summarizeWithOpenAI(text); // ✅ updated function name
    const risks = extractRisks(text);
    const trustScore = calculateTrustScore(text);
    const categories = categorizePolicy(text);

    await Analysis.create({
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
