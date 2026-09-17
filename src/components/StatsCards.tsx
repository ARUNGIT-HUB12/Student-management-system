import React from 'react';
import { Users, Award, TrendingUp, BookOpen } from 'lucide-react';
import { Student } from '../types';

interface StatsCardsProps {
  students: Student[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ students }) => {
  const total = students.length;

  const averageMarks = total > 0
    ? Math.round((students.reduce((acc, s) => acc + s.marks, 0) / total) * 10) / 10
    : 0;

  const passingStudents = students.filter((s) => s.marks >= 50).length;
  const passRate = total > 0 ? Math.round((passingStudents / total) * 100) : 0;

  // Find department with most students
  const deptCounts: Record<string, number> = {};
  students.forEach((s) => {
    deptCounts[s.course] = (deptCounts[s.course] || 0) + 1;
  });
  let topDept = 'None';
  let topDeptCount = 0;
  Object.entries(deptCounts).forEach(([dept, count]) => {
    if (count > topDeptCount) {
      topDept = dept;
      topDeptCount = count;
    }
  });

  return (
    <div id="stats-overview" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Total Students */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Students</span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-transparent dark:border-blue-900/30">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">{total}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">active records</span>
        </div>
      </div>

      {/* Average Marks */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Average Score</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-transparent dark:border-emerald-900/30">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">
            {total > 0 ? `${averageMarks}%` : 'N/A'}
          </span>
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Cohort avg</span>
        </div>
      </div>

      {/* Pass Rate */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Pass Rate</span>
          <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-transparent dark:border-violet-900/30">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">
            {total > 0 ? `${passRate}%` : 'N/A'}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">marks &ge; 50%</span>
        </div>
      </div>

      {/* Primary Department */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors col-span-1 md:col-span-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Top Department</span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-transparent dark:border-amber-900/30">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xl font-bold text-slate-900 dark:text-white truncate" title={topDept}>
            {topDept}
          </p>
        </div>
      </div>
    </div>
  );
};
