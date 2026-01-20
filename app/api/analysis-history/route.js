import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Analysis from '../../../models/Analysis';
import { getAuth } from '@clerk/nextjs/server';

// 🔹 Lazy DB connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  if (!process.env.MONGODB_URI) {
    throw new Error('❌ Please define the MONGODB_URI environment variable');
  }
  await mongoose.connect(process.env.MONGODB_URI);
};

// Parse OpenAI summary safely
function parseOpenAISummary(raw) {
  const sectionOrder = ['📄 Summary', '🚨 Risks', '🔐 Trust Score', '🗂️ Categories'];
  const sections = {};
  let current = null;

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    const matchedHeader = sectionOrder.find((header) => trimmed.startsWith(header));

    if (matchedHeader) {
      current = matchedHeader;
      sections[current] = [];
    } else if (current) {
      sections[current].push(trimmed);
    }
  }

  const cleaned = {};
  if (sections['📄 Summary']) cleaned.summary = sections['📄 Summary'].join(' ').trim();
  if (sections['🚨 Risks']) cleaned.risks = sections['🚨 Risks'].map((line) => line.replace(/^[-•]\s*/, '').trim());
  if (sections['🔐 Trust Score']) cleaned.trustScore = sections['🔐 Trust Score'].join(' ').trim();
  if (sections['🗂️ Categories']) {
    const cats = {};
    sections['🗂️ Categories'].forEach((line) => {
      const [key, val] = line.split(':').map((s) => s.trim());
      if (key && val) cats[key] = val === '✅';
    });
    cleaned.categories = cats;
  }
  return cleaned;
}

// GET route to fetch recent 50 analysis entries for current user
export const dynamic = "force-dynamic"; // 🔹 Make this fully runtime

export async function GET(req) {
  try {
    await connectDB(); // Lazy-load DB

    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let analysis = await Analysis.find({ userId }).sort({ createdAt: -1 }).limit(50).lean();

    analysis = analysis.map((item) => {
      if (item.summary) {
        try {
          const parsed = parseOpenAISummary(item.summary);
          return { ...item, ...parsed };
        } catch {
          return item;
        }
      }
      return item;
    });

    return NextResponse.json(analysis, { status: 200 });
  } catch (err) {
    console.error('Error fetching analysis history:', err);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
