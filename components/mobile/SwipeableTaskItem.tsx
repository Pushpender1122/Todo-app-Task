'use client';

import React, { useState, useRef } from 'react';
import { Trash2, Edit3, Check } from 'lucide-react';
import { Task } from '@/lib/types';
import { formatTime12h } from '@/lib/date-utils';

interface SwipeableTaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function SwipeableTaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
}: SwipeableTaskItemProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiped, setIsSwiped] = useState(false);
  const startXRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const isCompleted = task.status === 'Completed';

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || startXRef.current === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;

    // Only allow left drag up to -80px
    if (diff < 0 && diff > -100) {
      setOffsetX(diff);
    } else if (diff >= 0 && isSwiped) {
      setOffsetX(Math.max(-70 + diff, 0));
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    if (offsetX < -45) {
      setOffsetX(-72);
      setIsSwiped(true);
    } else {
      setOffsetX(0);
      setIsSwiped(false);
    }
    startXRef.current = null;
  };

  const handleManualDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task._id);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl select-none">
      {/* Background Revealed Delete Action (Swipe left) */}
      <div className="absolute inset-y-0 right-0 w-[72px] bg-red-500 flex items-center justify-center text-white rounded-r-2xl transition-all">
        <button
          onClick={handleManualDelete}
          className="w-full h-full flex flex-col items-center justify-center gap-1 active:bg-red-600 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 stroke-[2.5]" />
          <span className="text-[10px] font-bold tracking-tight uppercase">Delete</span>
        </button>
      </div>

      {/* Foreground Task Card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDraggingRef.current ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative z-10 flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl shadow-2xs hover:border-gray-200 transition-colors cursor-pointer"
        onClick={() => {
          if (isSwiped) {
            setOffsetX(0);
            setIsSwiped(false);
          } else {
            onToggle(task._id);
          }
        }}
      >
        {/* Checkbox + Title */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div
            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
              isCompleted
                ? 'bg-[#3B5BF5] border-[#3B5BF5] text-white'
                : 'border-gray-300 bg-white'
            }`}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <p
              className={`text-[14px] font-medium truncate transition-colors ${
                isCompleted
                  ? 'line-through text-gray-400 font-normal'
                  : 'text-gray-900'
              }`}
            >
              {task.title}
            </p>
            {task.startTime && (
              <p className="text-[11px] text-gray-400 mt-0.5">
                {formatTime12h(task.startTime)}
                {task.endTime ? ` - ${formatTime12h(task.endTime)}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Actions (visible when not swiped) */}
        <div className="flex items-center gap-1 text-gray-400">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task._id);
            }}
            className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1.5 hover:text-[#3B5BF5] hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

