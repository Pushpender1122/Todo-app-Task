'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Task, WeekSummary, CreateTaskInput, UpdateTaskInput } from '@/lib/types';
import { format } from 'date-fns';
import { getWeekBounds } from '@/lib/date-utils';

interface TaskContextType {
  tasks: Task[];
  weeks: WeekSummary[];
  loading: boolean;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedWeekStart: string;
  setSelectedWeekStart: (weekStart: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isWeeklyViewOpen: boolean;
  setIsWeeklyViewOpen: (open: boolean) => void;
  viewMode: 'mobile' | 'desktop' | 'split';
  setViewMode: (mode: 'mobile' | 'desktop' | 'split') => void;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (seen: boolean) => void;

  // Actions
  refreshTasks: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<boolean>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<boolean>;
  toggleTaskStatus: (id: string) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  resetToDemoData: () => Promise<void>;

  // Computed metrics
  todayTasks: Task[];
  selectedDayTasks: Task[];
  selectedWeekTasks: Task[];
  currentWeekStats: {
    completed: number;
    pending: number;
    total: number;
    percentage: number;
  };
  searchResults: Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weeks, setWeeks] = useState<WeekSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedWeekStart, setSelectedWeekStart] = useState<string>('');
  const [todayDateStr, setTodayDateStr] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWeeklyViewOpen, setIsWeeklyViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop' | 'split'>('mobile');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(true);

  // Initialize client-side dates and settings in useEffect to comply with Next.js 16 prerender
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const bounds = getWeekBounds(today);
    setTodayDateStr(today);
    setSelectedDate(today);
    setSelectedWeekStart(bounds.weekStart);

    try {
      const savedMode = localStorage.getItem('todo_view_mode') as 'mobile' | 'desktop' | 'split';
      if (savedMode && ['mobile', 'desktop', 'split'].includes(savedMode)) {
        setViewMode(savedMode);
      } else {
        if (window.innerWidth >= 1024) {
          setViewMode('desktop');
        }
      }

      const seen = localStorage.getItem('todo_onboarding_seen');
      if (seen === 'true') {
        setHasSeenOnboarding(true);
      } else if (seen === 'false') {
        setHasSeenOnboarding(false);
      } else {
        setHasSeenOnboarding(false);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleSetViewMode = (mode: 'mobile' | 'desktop' | 'split') => {
    setViewMode(mode);
    try {
      localStorage.setItem('todo_view_mode', mode);
    } catch { }
  };

  const handleSetHasSeenOnboarding = (seen: boolean) => {
    setHasSeenOnboarding(seen);
    try {
      localStorage.setItem('todo_onboarding_seen', seen ? 'true' : 'false');
    } catch { }
  };

  // Fetch all tasks and weeks
  const refreshTasks = useCallback(async () => {
    try {
      const [tasksRes, weeksRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/weeks'),
      ]);

      const tasksData = await tasksRes.json();
      const weeksData = await weeksRes.json();

      if (tasksData.success) {
        setTasks(tasksData.data);
      }
      if (weeksData.success) {
        setWeeks(weeksData.data);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  // Create Task
  const handleCreateTask = async (input: CreateTaskInput): Promise<boolean> => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTasks((prev) => [data.data, ...prev]);
        await refreshTasks();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error creating task:', err);
      return false;
    }
  };

  // Update Task
  const handleUpdateTask = async (id: string, input: UpdateTaskInput): Promise<boolean> => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, ...input, updatedAt: new Date().toISOString() } : t))
      );

      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (data.success) {
        await refreshTasks();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating task:', err);
      refreshTasks();
      return false;
    }
  };

  // Toggle Task Status (Completed <-> In Progress)
  const handleToggleTaskStatus = async (id: string): Promise<boolean> => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return false;

    const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';

    // Instant optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
    );

    return handleUpdateTask(id, { status: newStatus });
  };

  // Delete Task
  const handleDeleteTask = async (id: string): Promise<boolean> => {
    try {
      setTasks((prev) => prev.filter((t) => t._id !== id));

      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        await refreshTasks();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting task:', err);
      refreshTasks();
      return false;
    }
  };

  // Reset to Demo Data
  const handleResetToDemoData = async () => {
    try {
      setLoading(true);
      await fetch('/api/seed', { method: 'POST' });
      await refreshTasks();
    } catch (err) {
      console.error('Error resetting demo data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Computed task lists
  const todayTasks = useMemo(() => {
    if (!todayDateStr) return tasks;
    return tasks.filter((t) => t.date === todayDateStr);
  }, [tasks, todayDateStr]);

  const selectedDayTasks = useMemo(() => {
    if (!selectedDate) return tasks;
    return tasks.filter((t) => t.date === selectedDate);
  }, [tasks, selectedDate]);

  const selectedWeekTasks = useMemo(() => {
    if (!selectedWeekStart) return tasks;
    return tasks.filter((t) => t.weekStart === selectedWeekStart);
  }, [tasks, selectedWeekStart]);

  const currentWeekStats = useMemo(() => {
    const weekTasks = selectedWeekStart
      ? tasks.filter((t) => t.weekStart === selectedWeekStart)
      : tasks;
    const completed = weekTasks.filter((t) => t.status === 'Completed').length;
    const pending = weekTasks.filter((t) => t.status === 'In Progress').length;
    const total = weekTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, pending, total, percentage };
  }, [tasks, selectedWeekStart]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }, [tasks, searchQuery]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        weeks,
        loading,
        selectedDate,
        setSelectedDate,
        selectedWeekStart,
        setSelectedWeekStart,
        searchQuery,
        setSearchQuery,
        isAddModalOpen,
        setIsAddModalOpen,
        editingTask,
        setEditingTask,
        isSearchOpen,
        setIsSearchOpen,
        isWeeklyViewOpen,
        setIsWeeklyViewOpen,
        viewMode,
        setViewMode: handleSetViewMode,
        hasSeenOnboarding,
        setHasSeenOnboarding: handleSetHasSeenOnboarding,

        refreshTasks,
        createTask: handleCreateTask,
        updateTask: handleUpdateTask,
        toggleTaskStatus: handleToggleTaskStatus,
        deleteTask: handleDeleteTask,
        resetToDemoData: handleResetToDemoData,

        todayTasks,
        selectedDayTasks,
        selectedWeekTasks,
        currentWeekStats,
        searchResults,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}