'use client';

import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight, CheckCircle2, Clock, Check, Trash2, Edit3, Calendar } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { Task } from '@/lib/types';
import { formatTime12h } from '@/lib/date-utils';

interface WeeklyViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditTask: (task: Task) => void;
}

export function WeeklyViewModal({ isOpen, onClose, onEditTask }: WeeklyViewModalProps) {
  const { weeks, tasks, toggleTaskStatus, deleteTask, setSelectedDate } = useTasks();
  const [expandedWeekKey, setExpandedWeekKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleExpand = (weekKey: string) => {
    setExpandedWeekKey((prev) => (prev === weekKey ? null : weekKey));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl p-6 max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900">Weekly Overview</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Organized Monday to Sunday with open & completed breakdown
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Weekly Cards List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {weeks.map((week) => {
            const isExpanded = expandedWeekKey === week.weekKey;
            const weekTasks = tasks.filter((t) => t.weekStart === week.weekStart);

            return (
              <div
                key={week.weekKey}
                className={`border rounded-2xl transition-all overflow-hidden ${
                  week.isCurrentWeek
                    ? 'border-blue-300 shadow-sm bg-blue-50/20'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Week Summary Card Header */}
                <div
                  onClick={() => toggleExpand(week.weekKey)}
                  className="p-4 cursor-pointer flex flex-col gap-3 select-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#3B5BF5]" />
                      <span className="text-sm font-bold text-gray-900">
                        {week.weekLabel}
                      </span>
                      {week.isCurrentWeek && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-[#3B5BF5] text-white rounded-full">
                          Current Week
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  {/* Summary Counters: Open & Completed */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Open Tasks Card */}
                    <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl p-2.5 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-red-500 tracking-wider">
                          Open Tasks
                        </p>
                        <p className="text-base font-extrabold text-gray-900 leading-tight">
                          {String(week.openTasksCount).padStart(2, '0')}
                        </p>
                      </div>
                    </div>

                    {/* Completed Tasks Card */}
                    <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-2.5 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-[#3B5BF5]">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">
                          Completed
                        </p>
                        <p className="text-base font-extrabold text-gray-900 leading-tight">
                          {String(week.completedTasksCount).padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mini Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-gray-500">
                      <span>Progress</span>
                      <span>{week.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#3B5BF5] h-full rounded-full transition-all duration-300"
                        style={{ width: `${week.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Tasks List for this week */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/70 p-4 space-y-2 animate-in slide-in-from-top-1 duration-150">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Tasks in this week ({weekTasks.length})
                      </span>
                    </div>

                    {weekTasks.length === 0 ? (
                      <p className="text-xs text-gray-400 py-3 text-center">
                        No tasks scheduled for this week.
                      </p>
                    ) : (
                      weekTasks.map((task) => {
                        const isCompleted = task.status === 'Completed';

                        return (
                          <div
                            key={task._id}
                            className="flex items-center justify-between p-3 bg-white border border-gray-200/80 rounded-xl hover:shadow-xs transition-all"
                          >
                            <div
                              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                              onClick={() => toggleTaskStatus(task._id)}
                            >
                              <div
                                className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                                  isCompleted
                                    ? 'bg-[#3B5BF5] border-[#3B5BF5] text-white'
                                    : 'border-gray-300 bg-white'
                                }`}
                              >
                                {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>

                              <div className="flex-1 min-w-0 pr-2">
                                <p
                                  className={`text-xs font-semibold truncate ${
                                    isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
                                  }`}
                                >
                                  {task.title}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                  {task.date} {task.startTime ? `• ${formatTime12h(task.startTime)}` : ''}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setSelectedDate(task.date);
                                  onEditTask(task);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 rounded"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteTask(task._id)}
                                className="p-1 text-gray-400 hover:text-red-500 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

