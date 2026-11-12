import { NextRequest, NextResponse } from 'next/server';
import { getAllTasks, createTask } from '@/lib/db';
import { CreateTaskInput } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weekStart = searchParams.get('weekStart') || undefined;
    const date = searchParams.get('date') || undefined;
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;

    const tasks = await getAllTasks({
      weekStart,
      date,
      search,
      status,
      priority,
    });

    return NextResponse.json({ success: true, count: tasks.length, data: tasks });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskInput = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Task title is mandatory.' },
        { status: 400 }
      );
    }

    if (!body.date) {
      return NextResponse.json(
        { success: false, error: 'Task date is mandatory.' },
        { status: 400 }
      );
    }

    const newTask = await createTask({
      title: body.title.trim(),
      description: body.description?.trim() || '',
      date: body.date,
      startTime: body.startTime?.trim() || '',
      endTime: body.endTime?.trim() || '',
      priority: body.priority || 'Medium',
    });

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

