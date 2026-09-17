import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  Download,
  X,
  Phone,
  Mail,
  BookOpen,
  Hash,
  Sparkles,
} from 'lucide-react';
import { Student, SortField, SortDirection, COMMON_COURSES } from '../types';
import { getGradeBadgeClasses } from '../utils/grade';

interface StudentTableProps {
  students: Student[];
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onViewStudent: (student: Student) => void;
  onAddStudent: () => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onEditStudent,
  onDeleteStudent,
  onViewStudent,
  onAddStudent,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('fullName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Available unique courses from current students + standard ones
  const availableCourses = useMemo(() => {
    const set = new Set<string>();
    COMMON_COURSES.forEach((c) => set.add(c));
    students.forEach((s) => set.add(s.course));
    return Array.from(set).sort();
  }, [students]);

  // Handle Sort Toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedStudents = useMemo(() => {
    return students
      .filter((student) => {
        // Search query check (name, roll number, or course)
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          student.fullName.toLowerCase().includes(q) ||
          student.rollNumber.toLowerCase().includes(q) ||
          student.course.toLowerCase().includes(q) ||
          student.email.toLowerCase().includes(q);

        // Course filter
        const matchesCourse =
          selectedCourse === 'ALL' || student.course === selectedCourse;

        // Grade filter
        const matchesGrade =
          selectedGrade === 'ALL' || student.grade === selectedGrade;

        return matchesQuery && matchesCourse && matchesGrade;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === 'marks') {
          comparison = a.marks - b.marks;
        } else {
          const valA = (a[sortField] || '').toLowerCase();
          const valB = (b[sortField] || '').toLowerCase();
          comparison = valA.localeCompare(valB);
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [students, searchQuery, selectedCourse, selectedGrade, sortField, sortDirection]);

  // Export to CSV
  const exportToCSV = () => {
    if (filteredAndSortedStudents.length === 0) return;
    const headers = [
      'Full Name',
      'Roll Number',
      'Email',
      'Course / Department',
      'Marks',
      'Grade',
      'Phone Number',
      'Enrollment Date',
    ];
    const rows = filteredAndSortedStudents.map((s) => [
      `"${s.fullName.replace(/"/g, '""')}"`,
      `"${s.rollNumber}"`,
      `"${s.email}"`,
      `"${s.course.replace(/"/g, '""')}"`,
      s.marks,
      `"${s.grade}"`,
      `"${s.phone}"`,
      `"${new Date(s.createdAt).toISOString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCourse !== 'ALL' || selectedGrade !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCourse('ALL');
    setSelectedGrade('ALL');
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 ml-1.5" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ml-1.5" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ml-1.5" />
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
      {/* Control Bar: Search & Filters */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="search-students-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, roll number, or course..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & Export */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Course Filter */}
            <div className="relative">
              <select
                id="filter-course-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                {availableCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Filter */}
            <div className="relative">
              <select
                id="filter-grade-select"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="ALL">All Grades</option>
                <option value="A+">Grade A+ (90-100%)</option>
                <option value="A">Grade A (80-89%)</option>
                <option value="B">Grade B (70-79%)</option>
                <option value="C">Grade C (60-69%)</option>
                <option value="D">Grade D (50-59%)</option>
                <option value="F">Grade F (&lt;50%)</option>
              </select>
            </div>

            {/* Export CSV button */}
            <button
              id="btn-export-csv"
              type="button"
              onClick={exportToCSV}
              title="Export displayed records to CSV"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Clear filters pill */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Status summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredAndSortedStudents.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{students.length}</strong> students
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Tip: Click column headers to sort &bull; Click row to edit
          </span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table id="students-data-table" className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              {/* Full Name */}
              <th scope="col" className="py-3.5 px-4 cursor-pointer select-none" onClick={() => handleSort('fullName')}>
                <div className="flex items-center">
                  <span>Full Name</span>
                  {renderSortIndicator('fullName')}
                </div>
              </th>

              {/* Roll Number */}
              <th scope="col" className="py-3.5 px-4 cursor-pointer select-none" onClick={() => handleSort('rollNumber')}>
                <div className="flex items-center">
                  <span>Roll Number</span>
                  {renderSortIndicator('rollNumber')}
                </div>
              </th>

              {/* Course / Department */}
              <th scope="col" className="py-3.5 px-4 cursor-pointer select-none" onClick={() => handleSort('course')}>
                <div className="flex items-center">
                  <span>Course / Department</span>
                  {renderSortIndicator('course')}
                </div>
              </th>

              {/* Marks / Grade */}
              <th scope="col" className="py-3.5 px-4 cursor-pointer select-none" onClick={() => handleSort('marks')}>
                <div className="flex items-center">
                  <span>Marks / Grade</span>
                  {renderSortIndicator('marks')}
                </div>
              </th>

              {/* Email */}
              <th scope="col" className="py-3.5 px-4 cursor-pointer select-none" onClick={() => handleSort('email')}>
                <div className="flex items-center">
                  <span>Email</span>
                  {renderSortIndicator('email')}
                </div>
              </th>

              {/* Phone Number */}
              <th scope="col" className="py-3.5 px-4">
                <span>Phone</span>
              </th>

              {/* Actions Column */}
              <th scope="col" className="py-3.5 px-4 text-right">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {filteredAndSortedStudents.map((student) => {
              const badgeStyle = getGradeBadgeClasses(student.grade);

              return (
                <tr
                  key={student.id}
                  id={`student-row-${student.id}`}
                  onClick={() => onEditStudent(student)}
                  className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  {/* Full Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800/60">
                        {student.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {student.fullName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Roll Number */}
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {student.rollNumber}
                    </span>
                  </td>

                  {/* Course / Department */}
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                    <span className="truncate max-w-[200px] block" title={student.course}>
                      {student.course}
                    </span>
                  </td>

                  {/* Marks / Grade */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{student.marks}%</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                      >
                        {student.grade}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                    <a
                      href={`mailto:${student.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-blue-600 dark:hover:text-blue-400 truncate max-w-[170px] block hover:underline"
                    >
                      {student.email}
                    </a>
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs font-medium">
                    {student.phone}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        id={`btn-view-${student.id}`}
                        type="button"
                        onClick={() => onViewStudent(student)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                        title="View profile details"
                        aria-label={`View ${student.fullName}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        id={`btn-edit-${student.id}`}
                        type="button"
                        onClick={() => onEditStudent(student)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                        title="Edit student"
                        aria-label={`Edit ${student.fullName}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        id={`btn-delete-${student.id}`}
                        type="button"
                        onClick={() => onDeleteStudent(student)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete student record"
                        aria-label={`Delete ${student.fullName}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {filteredAndSortedStudents.map((student) => {
          const badgeStyle = getGradeBadgeClasses(student.grade);

          return (
            <div
              key={student.id}
              id={`mobile-student-card-${student.id}`}
              onClick={() => onEditStudent(student)}
              className="p-4 hover:bg-blue-50/30 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800/60 mt-0.5">
                    {student.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {student.fullName}
                    </h4>
                    <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      {student.rollNumber}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                >
                  {student.grade} ({student.marks}%)
                </span>
              </div>

              <div className="mt-2.5 pl-13 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{student.course}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{student.phone}</span>
                </div>
              </div>

              {/* Mobile Actions */}
              <div
                className="mt-3 pl-13 flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onViewStudent(student)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  type="button"
                  onClick={() => onEditStudent(student)}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteStudent(student)}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAndSortedStudents.length === 0 && (
        <div id="table-empty-state" className="py-14 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No students found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'No student matches your active search filters. Try adjusting your query or resetting filters.'
              : 'There are currently no students in the system. Add your first student to get started.'}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                Clear all filters
              </button>
            ) : (
              <button
                type="button"
                onClick={onAddStudent}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
              >
                Add First Student
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
