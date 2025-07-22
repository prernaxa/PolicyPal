import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Analysis from '../../../models/Analysis';

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// Helper: Parse OpenAI style summary text with emoji headings into clean fields
function parseOpenAISummary(raw) {
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
    const matchedHeader = sectionOrder.find((header) =>
      trimmed.startsWith(header)
    );

    if (matchedHeader) {
      current = matchedHeader;
      sections[current] = [];
    } else if (current) {
      sections[current].push(trimmed);
    }
  }

  // Build cleaned output
  const cleaned = {};

  if (sections['📄 Summary']) {
    cleaned.summary = sections['📄 Summary'].join(' ').trim();
  }

  if (sections['🚨 Risks']) {
    // Risks are bullet points, remove any leading '- ' or '• '
    cleaned.risks = sections['🚨 Risks'].map((line) =>
      line.replace(/^[-•]\s*/, '').trim()
    );
  }

  if (sections['🔐 Trust Score']) {
    // Usually a single line with "x / 10"
    cleaned.trustScore = sections['🔐 Trust Score'].join(' ').trim();
  }

  if (sections['🗂️ Categories']) {
    // Parse categories key: value lines into an object
    const cats = {};
    sections['🗂️ Categories'].forEach((line) => {
      const [key, val] = line.split(':').map((s) => s.trim());
      if (key && val) {
        cats[key] = val === '✅';
      }
    });
    cleaned.categories = cats;
  }

  return cleaned;
}

// GET route to fetch recent 50 analysis entries
export async function GET() {
  try {
    await connectDB();

    let analysis = await Analysis.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(); // plain JS objects

    // Parse summary fields for each analysis item
    analysis = analysis.map((item) => {
      if (item.summary) {
        try {
          const parsed = parseOpenAISummary(item.summary);
          return {
            ...item,
            ...parsed,
          };
        } catch {
          // If parsing fails, just return the original item
          return item;
        }
      }
      return item;
    });

    return NextResponse.json(analysis, { status: 200 });
  } catch (err) {
    console.error('Error fetching analysis history:', err);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
