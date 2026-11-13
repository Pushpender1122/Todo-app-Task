'use client';

import React, { useRef, useEffect } from 'react';
import { ArrowLeft, Search, Trash2, Edit3, Check, X } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { Task } from '@/lib/types';
import { formatTime12h } from '@/lib/date-utils';

interface SearchScreenProps {
  onBack: () => void;
  onEditTask: (task: Task) => void;
}

export function SearchScreen({ onBack, onEditTask }: SearchScreenProps) {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    toggleTaskStatus,
    deleteTask,
    tasks,
  } = useTasks();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const displayedTasks = searchQuery.trim() ? searchResults : tasks;

  return (
    <div className="flex flex-col h-full w-full bg-white select-none">
      {/* Top Search Header */}
      <div className="pt-4 px-4 pb-3 border-b border-gray-100 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 -ml-1 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a task"
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#3B5BF5] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute right-3.5 top-3 text-gray-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
        {searchQuery.trim() && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Found {searchResults.length} result{searchResults.length === 1 ? '' : 's'}
          </p>
        )}

        {displayedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
            <Search className="w-12 h-12 mb-3 stroke-1 text-gray-300" />
            <p className="font-semibold text-gray-600">No tasks found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
              {searchQuery ? `No tasks match "${searchQuery}"` : 'No tasks in your list yet'}
            </p>
          </div>
        ) : (
          displayedTasks.map((task) => {
            const isCompleted = task.status === 'Completed';

            return (
              <div
                key={task._id}
                className="group flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-all hover:shadow-xs"
              >
                <div
                  className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                  onClick={() => toggleTaskStatus(task._id)}
                >
                  {/* Custom Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-[#3B5BF5] border-[#3B5BF5] text-white'
                        : 'border-gray-300 bg-white group-hover:border-gray-400'
                    }`}
                  >
                    {isCompleted && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>

                  {/* Task details */}
                  <div className="flex-1 min-w-0 pr-2">
                    <p
                      className={`text-[14px] font-medium truncate transition-colors ${
                        isCompleted
                          ? 'line-through text-gray-400'
                          : 'text-gray-800'
                      }`}
                    >
                      {task.title}
                    </p>
                    {(task.startTime || task.date) && (
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                        {task.date} {task.startTime ? `• ${formatTime12h(task.startTime)}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditTask(task)}
                    className="p-1.5 text-gray-400 hover:text-[#3B5BF5] hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
  );
}

