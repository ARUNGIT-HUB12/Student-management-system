import React from 'react';
import {
  GraduationCap,
  Plus,
  Sun,
  Moon,
  RotateCcw,
  Users,
} from 'lucide-react';

interface NavbarProps {
  studentCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAddModal: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  studentCount,
  isDarkMode,
  onToggleDarkMode,
  onOpenAddModal,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand & App Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                Student Management System
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>{studentCount} enrolled {studentCount === 1 ? 'student' : 'students'}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Database
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Reset to Demo Data button */}
            <button
              id="btn-reset-demo"
              type="button"
              onClick={onResetData}
              title="Reset to default sample data"
              className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 flex items-center justify-center transition-colors"
              aria-label="Reset to default sample data"
            >
              <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="btn-toggle-dark-mode"
              type="button"
              onClick={onToggleDarkMode}
              className="w-10 h-10 rounded-xl text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 flex items-center justify-center transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Add Student Primary CTA */}
            <button
              id="btn-add-student-nav"
              type="button"
              onClick={onOpenAddModal}
              className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Student</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
