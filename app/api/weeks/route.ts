import { NextResponse } from 'next/server';
import { getWeeklySummaries } from '@/lib/db';

export async function GET() {
  try {
    const summaries = await getWeeklySummaries();
    return NextResponse.json({ success: true, count: summaries.length, data: summaries });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

