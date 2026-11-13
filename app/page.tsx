'use client';

import React, { Suspense } from 'react';
import { TaskProvider, useTasks } from '@/context/TaskContext';
import { MobileFrame } from '@/components/mobile/MobileFrame';
import { DesktopView } from '@/components/desktop/DesktopView';
import { ViewSwitcher } from '@/components/ViewSwitcher';

function TodoAppContent() {
  const { viewMode } = useTasks();

  return (
    <div className="relative min-h-screen flex flex-col w-full">
      {viewMode === 'mobile' && (
        <div className="flex-1 w-full min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/40 to-slate-200 py-8 px-4 flex flex-col items-center justify-center">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* View Mode Tag */}
            <div className="mb-4 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-[#3B5BF5]" />
                Mobile App View
              </span>
            </div>

            <MobileFrame />
          </div>
        </div>
      )}

      {viewMode === 'desktop' && (
        <div className="flex-1 w-full flex flex-col">
          <DesktopView />
        </div>
      )}

      {viewMode === 'split' && (
        <div className="flex-1 w-full min-h-screen flex flex-col lg:flex-row bg-slate-100">
          {/* Desktop view on left */}
          <div className="flex-1 min-w-0 border-r border-slate-200 overflow-y-auto">
            <DesktopView />
          </div>

          {/* Mobile view on right */}
          <div className="w-full lg:w-[460px] bg-slate-200/80 p-8 flex flex-col items-center justify-center border-l border-slate-300/40 shadow-inner">
            <div className="mb-4 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#3B5BF5]" />
                Live Synchronized Mobile View
              </span>
            </div>
            <MobileFrame />
          </div>
        </div>
      )}

      {/* Floating Mode Switcher */}
      <ViewSwitcher />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm font-medium">
          Loading To-Do Flow...
        </div>
      }
    >
      <TaskProvider>
        <TodoAppContent />
      </TaskProvider>
    </Suspense>
  );
}
