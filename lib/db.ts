import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Task, CreateTaskInput, UpdateTaskInput, WeekSummary } from './types';
import { getWeekBounds } from './date-utils';
import { TaskModel } from './models/Task';
import { format } from 'date-fns';

const MONGODB_URI = process.env.MONGODB_URI;

let isMongoConnected = false;

export async function connectMongo(): Promise<boolean> {
  if (!MONGODB_URI) {
    return false;
  }
  if (isMongoConnected) return true;

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    return true;
  } catch (err) {
    console.warn('MongoDB connection failed, falling back to local file store:', err);
    return false;
  }
}

// Local JSON File Fallback Store
const DATA_FILE = path.join(process.cwd(), '.tasks-data.json');

function getInitialTasks(): Task[] {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const bounds = getWeekBounds(todayStr);

  return [
    {
      _id: 'task_sample_1',
      title: 'Finishing Wireframe',
      description: 'Review interface design and layout specifications',
      date: todayStr,
      startTime: '09:00',
      endTime: '11:00',
      priority: 'High',
      status: 'In Progress',
      weekStart: bounds.weekStart,
      weekEnd: bounds.weekEnd,
      weekNumber: bounds.weekNumber,
      year: bounds.year,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task_sample_2',
      title: 'Meeting with team',
      description: 'Discuss sprint backlog and design deliverables',
      date: todayStr,
      startTime: '11:30',
      endTime: '12:30',
      priority: 'Medium',
      status: 'In Progress',
      weekStart: bounds.weekStart,
      weekEnd: bounds.weekEnd,
      weekNumber: bounds.weekNumber,
      year: bounds.year,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task_sample_3',
      title: 'Buy a cat food',
      description: 'Pick up healthy salmon kibble from the pet market',
      date: todayStr,
      startTime: '14:00',
      endTime: '14:30',
      priority: 'Low',
      status: 'Completed',
      weekStart: bounds.weekStart,
      weekEnd: bounds.weekEnd,
      weekNumber: bounds.weekNumber,
      year: bounds.year,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task_sample_4',
      title: 'Finishing daily commission',
      description: 'Wrap up graphic illustrations for client deliverable',
      date: todayStr,
      startTime: '16:00',
      endTime: '17:30',
      priority: 'High',
      status: 'Completed',
      weekStart: bounds.weekStart,
      weekEnd: bounds.weekEnd,
      weekNumber: bounds.weekNumber,
      year: bounds.year,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task_sample_5',
      title: 'Doing Homework',
      description: 'Study data structures and solve practice problems',
      date: todayStr,
      startTime: '18:00',
      endTime: '20:00',
      priority: 'Medium',
      status: 'In Progress',
      weekStart: bounds.weekStart,
      weekEnd: bounds.weekEnd,
      weekNumber: bounds.weekNumber,
      year: bounds.year,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

let inMemoryTasks: Task[] | null = null;

function loadLocalTasks(): Task[] {
  if (inMemoryTasks !== null) return inMemoryTasks;

  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      inMemoryTasks = JSON.parse(data);
      return inMemoryTasks!;
    }
  } catch (err) {
    console.error('Error reading data file:', err);
  }

  inMemoryTasks = getInitialTasks();
  saveLocalTasks(inMemoryTasks);
  return inMemoryTasks;
}

function saveLocalTasks(tasks: Task[]) {
  inMemoryTasks = tasks;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data file:', err);
  }
}

export async function getAllTasks(filters?: {
  weekStart?: string;
  date?: string;
  search?: string;
  status?: string;
  priority?: string;
}): Promise<Task[]> {
  const hasMongo = await connectMongo();

  if (hasMongo) {
    const query: Record<string, unknown> = {};
    if (filters?.weekStart) query.weekStart = filters.weekStart;
    if (filters?.date) query.date = filters.date;
    if (filters?.status) query.status = filters.status;
    if (filters?.priority) query.priority = filters.priority;
    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }
    const docs = await TaskModel.find(query).sort({ date: 1, startTime: 1 }).lean();
    return docs.map((d) => ({
      ...d,
      _id: d._id.toString(),
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : new Date().toISOString(),
    })) as Task[];
  }

  let tasks = loadLocalTasks();

  if (filters?.weekStart) {
    tasks = tasks.filter((t) => t.weekStart === filters.weekStart);
  }
  if (filters?.date) {
    tasks = tasks.filter((t) => t.date === filters.date);
  }
  if (filters?.status) {
    tasks = tasks.filter((t) => t.status === filters.status);
  }
  if (filters?.priority) {
    tasks = tasks.filter((t) => t.priority === filters.priority);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }

  return tasks.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.startTime || '').localeCompare(b.startTime || '');
  });
}

export async function getTaskById(id: string): Promise<Task | null> {
  const hasMongo = await connectMongo();
  if (hasMongo) {
    const doc = await TaskModel.findById(id).lean();
    if (!doc) return null;
    return {
      ...doc,
      _id: doc._id.toString(),
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
    } as Task;
  }

  const tasks = loadLocalTasks();
  return tasks.find((t) => t._id === id) || null;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const bounds = getWeekBounds(input.date);
  const now = new Date().toISOString();

  const hasMongo = await connectMongo();
  if (hasMongo) {
    const doc = await TaskModel.create({
      title: input.title,
      description: input.description || '',
      date: input.date,
      startTime: input.startTime || '',
      endTime: input.endTime || '',
      priority: input.priority || 'Medium',
      status: 'In Progress',
      weekStart: bounds.weekStart,
      weekEnd: bounds.weekEnd,
      weekNumber: bounds.weekNumber,
      year: bounds.year,
    });
    return {
      ...doc.toObject(),
      _id: doc._id.toString(),
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    } as Task;
  }

  const tasks = loadLocalTasks();
  const newTask: Task = {
    _id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title: input.title,
    description: input.description || '',
    date: input.date,
    startTime: input.startTime || '',
    endTime: input.endTime || '',
    priority: input.priority || 'Medium',
    status: 'In Progress',
    weekStart: bounds.weekStart,
    weekEnd: bounds.weekEnd,
    weekNumber: bounds.weekNumber,
    year: bounds.year,
    createdAt: now,
    updatedAt: now,
  };

  tasks.unshift(newTask);
  saveLocalTasks(tasks);
  return newTask;
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task | null> {
  const hasMongo = await connectMongo();
  if (hasMongo) {
    const updatePayload: Record<string, unknown> = { ...input };
    if (input.date) {
      const bounds = getWeekBounds(input.date);
      updatePayload.weekStart = bounds.weekStart;
      updatePayload.weekEnd = bounds.weekEnd;
      updatePayload.weekNumber = bounds.weekNumber;
      updatePayload.year = bounds.year;
    }
    const doc = await TaskModel.findByIdAndUpdate(id, updatePayload, { new: true }).lean();
    if (!doc) return null;
    return {
      ...doc,
      _id: doc._id.toString(),
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
    } as Task;
  }

  const tasks = loadLocalTasks();
  const index = tasks.findIndex((t) => t._id === id);
  if (index === -1) return null;

  const current = tasks[index];
  const updatedDate = input.date || current.date;
  const bounds = getWeekBounds(updatedDate);

  const updated: Task = {
    ...current,
    ...input,
    date: updatedDate,
    weekStart: bounds.weekStart,
    weekEnd: bounds.weekEnd,
    weekNumber: bounds.weekNumber,
    year: bounds.year,
    updatedAt: new Date().toISOString(),
  };

  tasks[index] = updated;
  saveLocalTasks(tasks);
  return updated;
}

export async function deleteTask(id: string): Promise<boolean> {
  const hasMongo = await connectMongo();
  if (hasMongo) {
    const res = await TaskModel.findByIdAndDelete(id);
    return !!res;
  }

  const tasks = loadLocalTasks();
  const nextTasks = tasks.filter((t) => t._id !== id);
  if (nextTasks.length === tasks.length) return false;
  saveLocalTasks(nextTasks);
  return true;
}

export async function getWeeklySummaries(): Promise<WeekSummary[]> {
  const allTasks = await getAllTasks();
  const todayBounds = getWeekBounds(new Date());

  const weekMap = new Map<string, { tasks: Task[]; bounds: ReturnType<typeof getWeekBounds> }>();
  weekMap.set(todayBounds.weekKey, { tasks: [], bounds: todayBounds });

  allTasks.forEach((task) => {
    const key = `${task.year}-W${String(task.weekNumber).padStart(2, '0')}`;
    if (!weekMap.has(key)) {
      weekMap.set(key, {
        tasks: [],
        bounds: {
          weekStart: task.weekStart,
          weekEnd: task.weekEnd,
          weekNumber: task.weekNumber,
          year: task.year,
          weekKey: key,
        },
      });
    }
    weekMap.get(key)!.tasks.push(task);
  });

  const summaries: WeekSummary[] = Array.from(weekMap.entries()).map(([key, data]) => {
    const tasks = data.tasks;
    const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;
    const openTasksCount = tasks.filter((t) => t.status === 'In Progress').length;
    const totalTasksCount = tasks.length;
    const completionPercentage =
      totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    const start = new Date(data.bounds.weekStart);
    const end = new Date(data.bounds.weekEnd);
    const label = `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;

    return {
      weekKey: key,
      weekStart: data.bounds.weekStart,
      weekEnd: data.bounds.weekEnd,
      weekLabel: label,
      weekNumber: data.bounds.weekNumber,
      year: data.bounds.year,
      openTasksCount,
      completedTasksCount,
      totalTasksCount,
      completionPercentage,
      isCurrentWeek: key === todayBounds.weekKey,
    };
  });

  return summaries.sort((a, b) => b.weekStart.localeCompare(a.weekStart));
}

export async function resetToDefaultData(): Promise<Task[]> {
  const tasks = getInitialTasks();
  const hasMongo = await connectMongo();
  if (hasMongo) {
    await TaskModel.deleteMany({});
    for (const t of tasks) {
      const { _id, ...rest } = t;
      await TaskModel.create(rest);
    }
    return getAllTasks();
  }

  saveLocalTasks(tasks);
  return tasks;
}
