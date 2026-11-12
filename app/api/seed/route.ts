import { NextResponse } from 'next/server';
import { resetToDefaultData } from '@/lib/db';

export async function POST() {
  try {
    const tasks = await resetToDefaultData();
    return NextResponse.json({
      success: true,
      message: 'Demo tasks seeded successfully',
      count: tasks.length,
      data: tasks,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

