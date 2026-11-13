'use client';

import React from 'react';
import { Smartphone, Monitor, Columns, Sparkles } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';

export function ViewSwitcher() {
  const { viewMode, setViewMode } = useTasks();

  return (
    <aside
      aria-label="Viewport display mode switcher"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white p-1.5 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center gap-1.5 animate-in slide-in-from-bottom-3 duration-300"
    >
      <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 font-medium border-r border-slate-700/60 mr-0.5">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>View Mode:</span>
      </div>

      {/* Mobile App Mode */}
      <button
        onClick={() => setViewMode('mobile')}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
          viewMode === 'mobile'
            ? 'bg-[#3B5BF5] text-white shadow-md shadow-blue-500/30'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="View as Mobile App"
      >
        <Smartphone className="w-4 h-4" />
        <span>Mobile App</span>
      </button>

      {/* Desktop Website Mode */}
      <button
        onClick={() => setViewMode('desktop')}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
          viewMode === 'desktop'
            ? 'bg-[#3B5BF5] text-white shadow-md shadow-blue-500/30'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="View as Desktop Website"
      >
        <Monitor className="w-4 h-4" />
        <span>Desktop Website</span>
      </button>

      {/* Side-by-Side Mode */}
      <button
        onClick={() => setViewMode('split')}
        className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
          viewMode === 'split'
            ? 'bg-[#3B5BF5] text-white shadow-md shadow-blue-500/30'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="View Mobile & Desktop Side-by-Side"
      >
        <Columns className="w-4 h-4" />
        <span>Side-by-Side</span>
      </button>
    </aside>
  );
}

