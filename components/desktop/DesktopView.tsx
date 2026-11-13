'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  Plus,
  Search,
  Calendar,
  Clock,
  Trash2,
  Edit3,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  Filter,
  BarChart3,
  ListTodo,
} from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { getDaysForWeek, formatTime12h, formatDisplayDate } from '@/lib/date-utils';
import { Task, TaskPriority } from '@/lib/types';
import { TaskModal } from '../mobile/TaskModal';

export function DesktopView() {
  const {
    tasks,
    weeks,
    selectedDate,
    setSelectedDate,
    selectedWeekStart,
    setSelectedWeekStart,
    currentWeekStats,
    toggleTaskStatus,
    deleteTask,
    resetToDemoData,
    searchQuery,
    setSearchQuery,
    searchResults,
  } = useTasks();

  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'completed' | 'high_priority'>('all');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedWeekKey, setExpandedWeekKey] = useState<string | null>(null);

  // 7 days for the selected week (Monday to Sunday)
  const daysInWeek = getDaysForWeek(selectedWeekStart);

  // Filter tasks based on activeTab and search
  const filteredTasks = tasks.filter((t) => {
    // If search active
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (activeTab === 'in_progress') return t.status === 'In Progress';
    if (activeTab === 'completed') return t.status === 'Completed';
    if (activeTab === 'high_priority') return t.priority === 'High';
    return true;
  });

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handlePrevWeek = () => {
    const currentIndex = weeks.findIndex((w) => w.weekStart === selectedWeekStart);
    if (currentIndex < weeks.length - 1) {
      setSelectedWeekStart(weeks[currentIndex + 1].weekStart);
    }
  };

  const handleNextWeek = () => {
    const currentIndex = weeks.findIndex((w) => w.weekStart === selectedWeekStart);
    if (currentIndex > 0) {
      setSelectedWeekStart(weeks[currentIndex - 1].weekStart);
    }
  };

  const currentWeekObj = weeks.find((w) => w.weekStart === selectedWeekStart) || weeks[0];

  return (
    <div className="flex-1 w-full bg-[#F8FAFC] min-h-screen text-slate-800 flex flex-col">
      {/* Top Desktop Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 lg:px-10 py-3.5 flex items-center justify-between shadow-2xs">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3B5BF5] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <CheckSquare className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">To-Do Flow</h1>
            <p className="text-xs text-slate-500 font-medium">Personal Workspace</p>
          </div>
        </div>

        {/* Center: Week Selector (Monday to Sunday) */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <button
            onClick={handlePrevWeek}
            className="p-1 hover:bg-slate-200 rounded-md transition-colors text-slate-600"
            title="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-[#3B5BF5]" />
            <span>{currentWeekObj?.weekLabel || 'Current Week'}</span>
          </div>
          <button
            onClick={handleNextWeek}
            className="p-1 hover:bg-slate-200 rounded-md transition-colors text-slate-600"
            title="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-3 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#3B5BF5] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <button
            onClick={resetToDemoData}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            title="Reset to sample tasks"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3B5BF5] hover:bg-[#324ecc] active:scale-95 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/25 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-10 py-6 space-y-6">
        {/* Overview & Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Task Complete */}
          <div className="bg-[#EDF2FE] border border-[#D5E2FD] rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                Task Complete
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center text-[#3B5BF5]">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {String(currentWeekStats.completed).padStart(2, '0')}
              </span>
              <span className="text-xs font-medium text-slate-500">This Week</span>
            </div>
          </div>

          {/* Card 2: Task Pending */}
          <div className="bg-[#FDECEC] border border-[#FCD6D6] rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                Task Pending
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {String(currentWeekStats.pending).padStart(2, '0')}
              </span>
              <span className="text-xs font-medium text-slate-500">This Week</span>
            </div>
          </div>

          {/* Card 3: Weekly Progress */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Weekly Progress
              </span>
              <span className="text-xs font-bold text-[#3B5BF5]">
                {currentWeekStats.percentage}% Done
              </span>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-[#243280] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(currentWeekStats.percentage, 5)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {currentWeekStats.completed} of {currentWeekStats.total} tasks completed
              </p>
            </div>
          </div>

          {/* Card 4: Total Tracked */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total All-Time Tasks
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <ListTodo className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {String(tasks.length).padStart(2, '0')}
              </span>
              <span className="text-xs font-medium text-slate-500">across all weeks</span>
            </div>
          </div>
        </div>

        {/* Row 2: 7-Day Interactive Calendar Strip (Monday - Sunday) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3B5BF5]" />
              <h2 className="text-sm font-bold text-slate-900">
                7-Day Weekly Schedule (Mon - Sun)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Click a day to filter tasks
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInWeek.map((day) => {
              const isSelected = day.dateStr === selectedDate;
              const countForDay = tasks.filter((t) => t.date === day.dateStr).length;

              return (
                <button
                  key={day.dateStr}
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-[#3B5BF5] text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                  }`}
                >
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider ${
                      isSelected ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {day.dayShort}
                  </span>
                  <span
                    className={`text-lg font-bold my-0.5 ${
                      isSelected ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {countForDay}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Task Management & Filter Tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Task Management</h2>
              <p className="text-xs text-slate-500">
                Selected Day: {formatDisplayDate(selectedDate)} ({tasks.filter((t) => t.date === selectedDate).length} tasks)
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All Tasks' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'completed', label: 'Completed' },
                { id: 'high_priority', label: 'High Priority' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-600">No tasks match the filter</p>
                <p className="text-xs text-slate-400 mt-1">
                  Try changing your filter, date, or create a new task.
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isCompleted = task.status === 'Completed';

                const priorityColors: Record<TaskPriority, string> = {
                  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
                  High: 'bg-rose-50 text-rose-700 border-rose-200',
                };

                return (
                  <div
                    key={task._id}
                    className={`group flex items-center justify-between p-4 bg-white border rounded-xl transition-all hover:shadow-xs ${
                      isCompleted ? 'border-slate-100 bg-slate-50/50' : 'border-slate-200'
                    }`}
                  >
                    {/* Checkbox and Task Info */}
                    <div
                      className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                      onClick={() => toggleTaskStatus(task._id)}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-[#3B5BF5] border-[#3B5BF5] text-white'
                            : 'border-slate-300 bg-white group-hover:border-[#3B5BF5]'
                        }`}
                      >
                        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-semibold truncate ${
                              isCompleted
                                ? 'line-through text-slate-400 font-normal'
                                : 'text-slate-800'
                            }`}
                          >
                            {task.title}
                          </p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              priorityColors[task.priority]
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Date / Time pill */}
                    <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 px-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{task.date}</span>
                      </div>
                      {task.startTime && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {formatTime12h(task.startTime)}
                            {task.endTime ? ` - ${formatTime12h(task.endTime)}` : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(task)}
                        className="p-2 text-slate-400 hover:text-[#3B5BF5] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit task"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Weekly Organization Cards */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Weekly Overview & Summary Cards
              </h2>
              <p className="text-xs text-slate-500">
                Organized Monday to Sunday. Click on any week&apos;s card to expand and view its tasks.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <BarChart3 className="w-4 h-4 text-[#3B5BF5]" />
              <span>{weeks.length} Week{weeks.length === 1 ? '' : 's'} Tracked</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeks.map((week) => {
              const isExpanded = expandedWeekKey === week.weekKey;
              const weekTasks = tasks.filter((t) => t.weekStart === week.weekStart);

              return (
                <div
                  key={week.weekKey}
                  className={`border rounded-2xl transition-all overflow-hidden ${
                    week.isCurrentWeek
                      ? 'border-blue-400 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    onClick={() =>
                      setExpandedWeekKey((prev) => (prev === week.weekKey ? null : week.weekKey))
                    }
                    className="p-4 cursor-pointer flex flex-col gap-3 select-none"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#3B5BF5]" />
                        <span className="text-xs font-bold text-slate-900">
                          {week.weekLabel}
                        </span>
                        {week.isCurrentWeek && (
                          <span className="px-2 py-0.5 text-[9px] font-bold bg-[#3B5BF5] text-white rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    {/* Open & Completed Cards */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl p-2.5">
                        <p className="text-[10px] font-bold uppercase text-rose-500 tracking-wider">
                          Open Tasks
                        </p>
                        <p className="text-lg font-extrabold text-slate-900 leading-tight">
                          {String(week.openTasksCount).padStart(2, '0')}
                        </p>
                      </div>

                      <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-2.5">
                        <p className="text-[10px] font-bold uppercase text-blue-500 tracking-wider">
                          Completed
                        </p>
                        <p className="text-lg font-extrabold text-slate-900 leading-tight">
                          {String(week.completedTasksCount).padStart(2, '0')}
                        </p>
                      </div>
                    </div>

                    {/* Mini progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                        <span>Progress</span>
                        <span>{week.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#3B5BF5] h-full rounded-full transition-all"
                          style={{ width: `${week.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Task list */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/80 p-3.5 space-y-2 animate-in slide-in-from-top-1 duration-150">
                      <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Week Tasks ({weekTasks.length})
                      </p>
                      {weekTasks.length === 0 ? (
                        <p className="text-xs text-slate-400 py-2 text-center">
                          No tasks for this week
                        </p>
                      ) : (
                        weekTasks.map((t) => (
                          <div
                            key={t._id}
                            className="flex items-center justify-between p-2 bg-white border border-slate-200/80 rounded-lg text-xs"
                          >
                            <div
                              className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                              onClick={() => toggleTaskStatus(t._id)}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                                  t.status === 'Completed'
                                    ? 'bg-[#3B5BF5] border-[#3B5BF5] text-white'
                                    : 'border-slate-300'
                                }`}
                              >
                                {t.status === 'Completed' && (
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                )}
                              </div>
                              <span
                                className={`truncate font-medium ${
                                  t.status === 'Completed'
                                    ? 'line-through text-slate-400'
                                    : 'text-slate-800'
                                }`}
                              >
                                {t.title}
                              </span>
                            </div>

                            <button
                              onClick={() => deleteTask(t._id)}
                              className="p-1 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Task Modal for Desktop */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
      />
    </div>
  );
}

