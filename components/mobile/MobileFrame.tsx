'use client';

import React, { useState } from 'react';
import { Wifi, Battery, RotateCcw, HelpCircle, Smartphone } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { OnboardingScreen } from './OnboardingScreen';
import { HomeScreen } from './HomeScreen';
import { SearchScreen } from './SearchScreen';
import { TaskModal } from './TaskModal';
import { WeeklyViewModal } from './WeeklyViewModal';
import { Task } from '@/lib/types';

interface MobileFrameProps {
  className?: string;
}

export function MobileFrame({ className = '' }: MobileFrameProps) {
  const {
    hasSeenOnboarding,
    setHasSeenOnboarding,
    isSearchOpen,
    setIsSearchOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    editingTask,
    setEditingTask,
    isWeeklyViewOpen,
    setIsWeeklyViewOpen,
    resetToDemoData,
  } = useTasks();

  const [activeTaskToEdit, setActiveTaskToEdit] = useState<Task | null>(null);

  const handleOpenEdit = (task: Task) => {
    setActiveTaskToEdit(task);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setActiveTaskToEdit(null);
    setEditingTask(null);
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Device frame container */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-black rounded-[48px] p-3 shadow-2xl ring-1 ring-black/10 select-none flex flex-col">
        {/* Device Outer Details (Side buttons) */}
        <div className="absolute -left-2 top-24 w-1 h-12 bg-neutral-700 rounded-l-md" />
        <div className="absolute -left-2 top-40 w-1 h-12 bg-neutral-700 rounded-l-md" />
        <div className="absolute -right-2 top-32 w-1 h-16 bg-neutral-700 rounded-r-md" />

        {/* Screen Bezel & Display */}
        <div className="relative flex-1 w-full bg-white rounded-[38px] overflow-hidden flex flex-col shadow-inner">
          {/* Top Status Bar */}
          <div className="w-full h-11 px-7 flex items-center justify-between z-30 select-none text-xs font-semibold">
            {/* Status bar time */}
            <span
              className={
                !hasSeenOnboarding ? 'text-white' : 'text-gray-900'
              }
            >
              9:41
            </span>

            {/* Dynamic Island / Camera Notch */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1e] mr-2" />
              <div className="w-2 h-2 rounded-full bg-[#14213d]" />
            </div>

            {/* Status Icons */}
            <div
              className={`flex items-center gap-1.5 ${!hasSeenOnboarding ? 'text-white' : 'text-gray-900'
                }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="relative flex-1 w-full overflow-hidden">
            {!hasSeenOnboarding ? (
              <OnboardingScreen onGetStarted={() => setHasSeenOnboarding(true)} />
            ) : isSearchOpen ? (
              <SearchScreen
                onBack={() => setIsSearchOpen(false)}
                onEditTask={handleOpenEdit}
              />
            ) : (
              <HomeScreen
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenAddModal={() => {
                  setActiveTaskToEdit(null);
                  setIsAddModalOpen(true);
                }}
                onOpenEditModal={handleOpenEdit}
                onOpenWeeklyView={() => setIsWeeklyViewOpen(true)}
                onOpenSettings={() => setIsWeeklyViewOpen(true)}
              />
            )}
          </div>

          {/* Bottom Home Indicator */}
          <div className="w-full h-5 flex items-center justify-center bg-transparent pointer-events-none pb-1">
            <div
              className={`w-32 h-1 rounded-full ${!hasSeenOnboarding ? 'bg-white/70' : 'bg-gray-300'
                }`}
            />
          </div>
        </div>
      </div>

      {/* Helper Quick Controls below frame */}
      <div className="flex items-center gap-3 mt-4 text-xs font-medium text-gray-500">
        <button
          onClick={() => setHasSeenOnboarding(!hasSeenOnboarding)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-2xs hover:bg-gray-50 hover:text-gray-800 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#3B5BF5]" />
          <span>{hasSeenOnboarding ? 'Show Onboarding' : 'Skip Onboarding'}</span>
        </button>

        <button
          onClick={resetToDemoData}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-2xs hover:bg-gray-50 hover:text-gray-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        taskToEdit={activeTaskToEdit}
      />

      <WeeklyViewModal
        isOpen={isWeeklyViewOpen}
        onClose={() => setIsWeeklyViewOpen(false)}
        onEditTask={handleOpenEdit}
      />
    </div>
  );
}
