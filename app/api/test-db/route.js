// app/api/test-db/route.js
import { NextResponse } from 'next/server';
import { connectToDB } from '../../../lib/db';

export async function GET() {
  try {
    await connectToDB(); // ✅ Correct function name
    return NextResponse.json({ message: 'MongoDB connected ✅' });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ error: 'Connection failed ❌' }, { status: 500 });
  }
}
