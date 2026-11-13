'use client';

import React from 'react';
import {
  Search,
  Settings,
  Bell,
  Trash2,
  Edit3,
  Check,
  Plus,
  CheckSquare,
  AlertTriangle,
} from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { getCalendarStripDays, formatTime12h } from '@/lib/date-utils';
import { Task } from '@/lib/types';
import { SwipeableTaskItem } from './SwipeableTaskItem';

interface HomeScreenProps {
  onOpenSearch: () => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (task: Task) => void;
  onOpenWeeklyView: () => void;
  onOpenSettings?: () => void;
}

export function HomeScreen({
  onOpenSearch,
  onOpenAddModal,
  onOpenEditModal,
  onOpenWeeklyView,
  onOpenSettings,
}: HomeScreenProps) {
  const {
    selectedDate,
    setSelectedDate,
    selectedDayTasks,
    currentWeekStats,
    toggleTaskStatus,
    deleteTask,
    tasks,
  } = useTasks();

  const stripDays = getCalendarStripDays(selectedDate);
  const displayTasks = selectedDayTasks.length > 0 ? selectedDayTasks : tasks.slice(0, 5);
  const isSelectedDateEmpty = selectedDayTasks.length === 0 && tasks.length > 0;

  return (
    <div className="relative flex flex-col h-full w-full bg-[#FAFAFC] select-none overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-24 px-5 pt-3 space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={onOpenSettings}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div
            onClick={onOpenSearch}
            className="flex-1 flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200/90 rounded-2xl shadow-xs cursor-pointer hover:border-blue-300 transition-all"
          >
            <span className="text-[13px] text-gray-400 font-normal">Search for a task</span>
            <Search className="w-4 h-4 text-gray-400" />
          </div>

          <button
            onClick={onOpenWeeklyView}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors relative"
            title="Weekly Overview"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#3B5BF5] rounded-full" />
          </button>
        </div>

        {/* Date Strip */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 no-scrollbar">
          {stripDays.map((day) => {
            const isSelected = day.dateStr === selectedDate;

            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={`flex flex-col items-center justify-center min-w-[38px] py-2.5 px-1.5 rounded-2xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#3B5BF5] text-white shadow-md shadow-blue-500/25 scale-[1.03]'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-white'
                }`}
              >
                <span
                  className={`text-[10px] font-medium tracking-tight mb-1 ${
                    isSelected ? 'text-blue-100' : 'text-gray-400'
                  }`}
                >
                  {day.dayShort}
                </span>
                <span
                  className={`text-[15px] font-bold leading-tight ${
                    isSelected ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {day.dayNumber}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3.5">
          <div
            onClick={onOpenWeeklyView}
            className="bg-[#EDF2FE] border border-[#D5E2FD] rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-[#3B5BF5]">
                <CheckSquare className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-medium text-gray-600">Task Complete</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-extrabold text-[#111827] tracking-tight">
                {String(currentWeekStats.completed).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-medium text-gray-400">This Week</span>
            </div>
          </div>

          <div
            onClick={onOpenWeeklyView}
            className="bg-[#FDECEC] border border-[#FCD6D6] rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-medium text-gray-600">Task Pending</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-extrabold text-[#111827] tracking-tight">
                {String(currentWeekStats.pending).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-medium text-gray-400">This Week</span>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">
              Weekly Progress
            </h3>
            <span className="text-xs font-semibold text-gray-400">
              {currentWeekStats.percentage}%
            </span>
          </div>

          <div className="w-full bg-[#E5E9F5] h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-[#243280] h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${Math.max(currentWeekStats.percentage, 4)}%` }}
            />
          </div>
        </div>

        {/* Tasks Today */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">
              Tasks Today
              {isSelectedDateEmpty && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  (Showing all tasks)
                </span>
              )}
            </h3>
            <button
              onClick={onOpenWeeklyView}
              className="text-[13px] font-semibold text-[#3B5BF5] hover:text-[#2746d8] transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {displayTasks.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <p className="text-sm font-medium">No tasks found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Tap the + button below to create your first task!
                </p>
              </div>
            ) : (
              displayTasks.map((task) => (
                <SwipeableTaskItem
                  key={task._id}
                  task={task}
                  onToggle={toggleTaskStatus}
                  onDelete={deleteTask}
                  onEdit={onOpenEditModal}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-5 inset-x-0 flex justify-center pointer-events-none z-20">
        <button
          onClick={onOpenAddModal}
          className="pointer-events-auto w-14 h-14 rounded-full bg-[#3B5BF5] hover:bg-[#2f4edb] active:scale-95 text-white shadow-lg shadow-blue-500/35 flex items-center justify-center transition-all cursor-pointer"
          aria-label="Add New Task"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
