import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Hash,
  Mail,
  BookOpen,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Student, StudentFormData, FormErrors, COMMON_COURSES } from '../types';
import { calculateGrade, getGradeBadgeClasses } from '../utils/grade';
import { validateStudentForm } from '../utils/validation';

interface StudentFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData, studentId?: string) => void;
  editingStudent: Student | null;
  existingStudents: Student[];
}

export const StudentFormDrawer: React.FC<StudentFormDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingStudent,
  existingStudents,
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: '',
    rollNumber: '',
    email: '',
    course: COMMON_COURSES[0],
    marks: '',
    phone: '',
  });

  const [customCourse, setCustomCourse] = useState('');
  const [isCustomCourse, setIsCustomCourse] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Populate or reset form whenever editingStudent or isOpen changes
  useEffect(() => {
    if (isOpen) {
      if (editingStudent) {
        const isStandard = (COMMON_COURSES as readonly string[]).includes(editingStudent.course);
        setFormData({
          fullName: editingStudent.fullName,
          rollNumber: editingStudent.rollNumber,
          email: editingStudent.email,
          course: isStandard ? editingStudent.course : 'Other',
          marks: String(editingStudent.marks),
          phone: editingStudent.phone,
        });
        if (!isStandard) {
          setIsCustomCourse(true);
          setCustomCourse(editingStudent.course);
        } else {
          setIsCustomCourse(false);
          setCustomCourse('');
        }
      } else {
        setFormData({
          fullName: '',
          rollNumber: '',
          email: '',
          course: COMMON_COURSES[0],
          marks: '',
          phone: '',
        });
        setIsCustomCourse(false);
        setCustomCourse('');
      }
      setErrors({});
      setTouched({});
    }
  }, [editingStudent, isOpen]);

  // Real-time calculated grade
  const marksNumber = Number(formData.marks);
  const hasValidMarks = !isNaN(marksNumber) && formData.marks.trim() !== '' && marksNumber >= 0 && marksNumber <= 100;
  const currentGrade = hasValidMarks ? calculateGrade(marksNumber) : null;
  const gradeBadges = currentGrade ? getGradeBadgeClasses(currentGrade) : null;

  const handleChange = (field: keyof StudentFormData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // Live validation if touched
    if (touched[field]) {
      const activeCourse = isCustomCourse ? customCourse : (field === 'course' ? value : formData.course);
      const { errors: newErrors } = validateStudentForm(
        { ...updated, course: activeCourse },
        existingStudents,
        editingStudent ? editingStudent.id : null
      );
      setErrors((prev) => ({
        ...prev,
        [field]: newErrors[field],
      }));
    }
  };

  const handleBlur = (field: keyof StudentFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const activeCourse = isCustomCourse ? customCourse : formData.course;
    const { errors: newErrors } = validateStudentForm(
      { ...formData, course: activeCourse },
      existingStudents,
      editingStudent ? editingStudent.id : null
    );
    setErrors((prev) => ({
      ...prev,
      [field]: newErrors[field],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const activeCourse = isCustomCourse ? customCourse.trim() : formData.course.trim();
    const submissionData: StudentFormData = {
      ...formData,
      course: activeCourse,
    };

    // Mark all as touched
    setTouched({
      fullName: true,
      rollNumber: true,
      email: true,
      course: true,
      marks: true,
      phone: true,
    });

    const { isValid, errors: validationErrors } = validateStudentForm(
      submissionData,
      existingStudents,
      editingStudent ? editingStudent.id : null
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(submissionData, editingStudent ? editingStudent.id : undefined);
  };

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Slide-over panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="drawer-title"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2
                    id="drawer-title"
                    className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"
                  >
                    <span>{editingStudent ? 'Edit Student Details' : 'Add New Student'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {editingStudent
                      ? `Updating records for roll #${editingStudent.rollNumber}`
                      : 'Fill in the information below to enroll a new student'}
                  </p>
                </div>
                <button
                  id="btn-close-drawer"
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="student-fullName"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="student-fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      onBlur={() => handleBlur('fullName')}
                      placeholder="e.g. Maya Lin Harrison"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 ${
                        errors.fullName && touched.fullName
                          ? 'border-rose-300 dark:border-rose-700 bg-rose-50/30 dark:bg-rose-950/20 focus:ring-rose-500/20 focus:border-rose-500 text-rose-900 dark:text-rose-200'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 dark:text-white'
                      }`}
                    />
                  </div>
                  {errors.fullName && touched.fullName && (
                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Roll Number (Unique) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="student-rollNumber"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                    >
                      Roll Number <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Must be unique</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      id="student-rollNumber"
                      type="text"
                      value={formData.rollNumber}
                      onChange={(e) => handleChange('rollNumber', e.target.value.toUpperCase())}
                      onBlur={() => handleBlur('rollNumber')}
                      placeholder="e.g. CS-2024-055"
                      className={`w-full pl-10 pr-4 py-2.5 font-mono rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 ${
                        errors.rollNumber && touched.rollNumber
                          ? 'border-rose-300 dark:border-rose-700 bg-rose-50/30 dark:bg-rose-950/20 focus:ring-rose-500/20 focus:border-rose-500 text-rose-900 dark:text-rose-200'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 dark:text-white'
                      }`}
                    />
                  </div>
                  {errors.rollNumber && touched.rollNumber && (
                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.rollNumber}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="student-email"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="student-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      placeholder="student@campus.edu"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 ${
                        errors.email && touched.email
                          ? 'border-rose-300 dark:border-rose-700 bg-rose-50/30 dark:bg-rose-950/20 focus:ring-rose-500/20 focus:border-rose-500 text-rose-900 dark:text-rose-200'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 dark:text-white'
                      }`}
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Course / Department */}
                <div>
                  <label
                    htmlFor="student-course"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Course / Department <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <select
                      id="student-course"
                      value={isCustomCourse ? 'Other' : formData.course}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Other') {
                          setIsCustomCourse(true);
                        } else {
                          setIsCustomCourse(false);
                          handleChange('course', val);
                        }
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white text-sm transition-colors appearance-none cursor-pointer"
                    >
                      {COMMON_COURSES.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                      <option value="Other">Other (Type custom department)...</option>
                    </select>
                  </div>

                  {isCustomCourse && (
                    <div className="mt-2.5">
                      <input
                        id="student-custom-course"
                        type="text"
                        value={customCourse}
                        onChange={(e) => {
                          setCustomCourse(e.target.value);
                          handleChange('course', e.target.value);
                        }}
                        placeholder="Enter custom department name"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  {errors.course && touched.course && (
                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.course}
                    </p>
                  )}
                </div>

                {/* Marks / Grade */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="student-marks"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                    >
                      Marks / Score (0 - 100) <span className="text-rose-500">*</span>
                    </label>
                    {currentGrade && gradeBadges && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${gradeBadges.bg} ${gradeBadges.text} ${gradeBadges.border}`}
                      >
                        <Sparkles className="w-3 h-3" />
                        Grade: {currentGrade}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="student-marks"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={formData.marks}
                      onChange={(e) => handleChange('marks', e.target.value)}
                      onBlur={() => handleBlur('marks')}
                      placeholder="e.g. 88"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 ${
                        errors.marks && touched.marks
                          ? 'border-rose-300 dark:border-rose-700 bg-rose-50/30 dark:bg-rose-950/20 focus:ring-rose-500/20 focus:border-rose-500 text-rose-900 dark:text-rose-200'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 dark:text-white'
                      }`}
                    />
                  </div>
                  {errors.marks && touched.marks && (
                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.marks}
                    </p>
                  )}
                  {!errors.marks && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      Grading scale: 90+ (A+), 80+ (A), 70+ (B), 60+ (C), 50+ (D), &lt;50 (F)
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="student-phone"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="student-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      placeholder="+1 (555) 012-3456"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 ${
                        errors.phone && touched.phone
                          ? 'border-rose-300 dark:border-rose-700 bg-rose-50/30 dark:bg-rose-950/20 focus:ring-rose-500/20 focus:border-rose-500 text-rose-900 dark:text-rose-200'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 dark:text-white'
                      }`}
                    />
                  </div>
                  {errors.phone && touched.phone && (
                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </form>

              {/* Drawer Footer Actions */}
              <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-end gap-3">
                <button
                  id="btn-cancel-student-form"
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-student-form"
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold flex items-center gap-2 shadow-sm shadow-blue-500/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingStudent ? 'Save Changes' : 'Create Student'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
