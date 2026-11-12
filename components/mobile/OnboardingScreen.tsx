'use client';

import React from 'react';
import { useTasks } from '@/context/TaskContext';

interface OnboardingScreenProps {
  onGetStarted?: () => void;
}

export function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  const { setHasSeenOnboarding } = useTasks();

  const handleStart = () => {
    setHasSeenOnboarding(true);
    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#3B5BF5] overflow-hidden select-none">
      {/* Background illustration */}
      <div className="relative flex-1 w-full flex items-center justify-center p-8">
        <div className="absolute top-0 right-0 w-36 h-36 rounded-full border-8 border-white/10 -mr-12 -mt-12 pointer-events-none" />

        <div className="absolute top-14 left-8 text-white/25 pointer-events-none">
          <svg width="84" height="60" viewBox="0 0 84 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 12L16 2L30 12L44 2L58 12L72 2L82 9"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 28L16 18L30 28L44 18L58 28L72 18L82 25"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 44L16 34L30 44L44 34L58 44L72 34L82 41"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Bottom-right Zig-zag Waves Pattern */}
        <div className="absolute bottom-16 right-8 text-white/25 pointer-events-none">
          <svg width="84" height="60" viewBox="0 0 84 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 12L16 2L30 12L44 2L58 12L72 2L82 9"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 28L16 18L30 28L44 18L58 28L72 18L82 25"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 44L16 34L30 44L44 34L58 44L72 34L82 41"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Bottom Sheet Card */}
      <div className="w-full bg-white rounded-t-[32px] px-8 pt-8 pb-10 shadow-2xl flex flex-col items-start z-10 transition-all">
        <h1 className="text-[26px] font-bold text-gray-900 leading-tight mb-3">
          Manage What To Do
        </h1>
        <p className="text-[14px] text-gray-400 font-normal leading-relaxed mb-8 max-w-[280px]">
          The best way to manage what you have to do, don&apos;t forget your plans
        </p>

        <button
          onClick={handleStart}
          className="w-full py-4 px-6 bg-[#3B5BF5] hover:bg-[#324ecc] active:scale-[0.98] text-white font-medium text-[16px] rounded-xl shadow-md shadow-blue-500/25 transition-all text-center"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

