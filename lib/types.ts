export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'In Progress' | 'Completed';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD format (e.g. 2026-01-14)
  startTime?: string; // HH:mm format (e.g. "09:00")
  endTime?: string; // HH:mm format (e.g. "11:00")
  priority: TaskPriority;
  status: TaskStatus;
  weekStart: string; // Monday of the task's week (YYYY-MM-DD)
  weekEnd: string; // Sunday of the task's week (YYYY-MM-DD)
  weekNumber: number; // ISO week number
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeekSummary {
  weekKey: string; // e.g., "2026-W02"
  weekStart: string; // YYYY-MM-DD (Monday)
  weekEnd: string; // YYYY-MM-DD (Sunday)
  weekLabel: string; // e.g., "Jan 12 - Jan 18, 2026"
  weekNumber: number;
  year: number;
  openTasksCount: number;
  completedTasksCount: number;
  totalTasksCount: number;
  completionPercentage: number;
  isCurrentWeek: boolean;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

