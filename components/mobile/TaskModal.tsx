'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { Task, TaskPriority } from '@/lib/types';
import { formatDisplayDate } from '@/lib/date-utils';
import { format } from 'date-fns';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export function TaskModal({ isOpen, onClose, taskToEdit }: TaskModalProps) {
  const { createTask, updateTask } = useTasks();

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setStartTime(taskToEdit.startTime || '09:00');
      setEndTime(taskToEdit.endTime || '11:00');
      setDate(taskToEdit.date || format(new Date(), 'yyyy-MM-dd'));
      setPriority(taskToEdit.priority || 'Medium');
      setDescription(taskToEdit.description || '');
    } else {
      setTitle('');
      setStartTime('09:00');
      setEndTime('11:00');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setPriority('Medium');
      setDescription('');
    }
    setError(null);
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!date) {
      setError('Task date is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (taskToEdit) {
        const ok = await updateTask(taskToEdit._id, {
          title: title.trim(),
          startTime,
          endTime,
          date,
          priority,
          description: description.trim(),
        });
        if (ok) onClose();
      } else {
        const ok = await createTask({
          title: title.trim(),
          startTime,
          endTime,
          date,
          priority,
          description: description.trim(),
        });
        if (ok) onClose();
      }
    } catch {
      setError('Failed to save task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-[20px] font-bold text-gray-900">
            {taskToEdit ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Task title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Doing Homework"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3B5BF5] focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-[15px] font-medium transition-all"
              required
              autoFocus
            />
          </div>

          {/* Set Time: Start & Ends */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Set Time <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Clock className="w-4 h-4" />
                </div>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#3B5BF5] focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 text-sm font-medium transition-all"
                  required
                />
                <span className="absolute right-3 top-2.5 text-[10px] text-gray-400 pointer-events-none uppercase font-semibold">
                  Start
                </span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Clock className="w-4 h-4" />
                </div>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#3B5BF5] focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 text-sm font-medium transition-all"
                  required
                />
                <span className="absolute right-3 top-2.5 text-[10px] text-gray-400 pointer-events-none uppercase font-semibold">
                  Ends
                </span>
              </div>
            </div>
          </div>

          {/* Set Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Set Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3B5BF5] focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-sm font-medium transition-all pr-11"
                required
              />
              <div className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none">
                <CalendarIcon className="w-5 h-5" />
              </div>
            </div>
            {date && (
              <p className="text-xs text-blue-600 font-medium mt-1">
                📅 {formatDisplayDate(date)}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as TaskPriority[]).map((p) => {
                const isSelected = priority === p;
                const colors = {
                  Low: isSelected
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
                  Medium: isSelected
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
                  High: isSelected
                    ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
                };

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${colors[p]}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add Description"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3B5BF5] focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-sm resize-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#3B5BF5] hover:bg-[#324ecc] active:scale-[0.98] disabled:opacity-50 text-white font-semibold text-[15px] rounded-xl shadow-md shadow-blue-500/25 transition-all text-center"
            >
              {submitting
                ? 'Saving...'
                : taskToEdit
                  ? 'Update task'
                  : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
