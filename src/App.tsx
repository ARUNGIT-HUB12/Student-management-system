import { useState, useEffect, useCallback } from 'react';
import { Student, StudentFormData, ToastMessage } from './types';
import {
  loadStudentsFromStorage,
  saveStudentsToStorage,
  resetStudentsToDefault,
  getStoredTheme,
  saveStoredTheme,
} from './utils/storage';
import { calculateGrade } from './utils/grade';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { StudentTable } from './components/StudentTable';
import { StudentFormDrawer } from './components/StudentFormDrawer';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { ToastContainer } from './components/Toast';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => getStoredTheme() === 'dark');

  // Student list state
  const [students, setStudents] = useState<Student[]>(() => loadStudentsFromStorage());

  // Modal / Drawer states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveStoredTheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Toast notification helper
  const addToast = useCallback(
    (type: 'success' | 'error' | 'info', title: string, message?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Open Add Student form
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  // Open Edit Student form
  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  // Submit Add / Edit Form
  const handleFormSubmit = (formData: StudentFormData, studentId?: string) => {
    const marksNum = Number(formData.marks);
    const calculatedGrade = calculateGrade(marksNum);
    const now = new Date().toISOString();

    if (studentId) {
      // Edit Existing Student
      const updatedList = students.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            fullName: formData.fullName.trim(),
            rollNumber: formData.rollNumber.trim().toUpperCase(),
            email: formData.email.trim(),
            course: formData.course.trim(),
            marks: marksNum,
            grade: calculatedGrade,
            phone: formData.phone.trim(),
            updatedAt: now,
          };
        }
        return s;
      });

      setStudents(updatedList);
      saveStudentsToStorage(updatedList);
      setIsFormOpen(false);
      setEditingStudent(null);

      // If this student was open in the view modal, update it as well
      if (viewingStudent && viewingStudent.id === studentId) {
        const updatedStudent = updatedList.find((s) => s.id === studentId);
        if (updatedStudent) setViewingStudent(updatedStudent);
      }

      addToast(
        'success',
        'Student Updated Successfully',
        `Changes saved for ${formData.fullName} (Roll #${formData.rollNumber.toUpperCase()}).`
      );
    } else {
      // Create New Student
      const newStudent: Student = {
        id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        fullName: formData.fullName.trim(),
        rollNumber: formData.rollNumber.trim().toUpperCase(),
        email: formData.email.trim(),
        course: formData.course.trim(),
        marks: marksNum,
        grade: calculatedGrade,
        phone: formData.phone.trim(),
        createdAt: now,
        updatedAt: now,
      };

      const updatedList = [newStudent, ...students];
      setStudents(updatedList);
      saveStudentsToStorage(updatedList);
      setIsFormOpen(false);

      addToast(
        'success',
        'Student Added Successfully',
        `${newStudent.fullName} has been enrolled in ${newStudent.course}.`
      );
    }
  };

  // Delete Student
  const handlePromptDelete = (student: Student) => {
    setStudentToDelete(student);
  };

  const handleConfirmDelete = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    const updatedList = students.filter((s) => s.id !== studentId);
    setStudents(updatedList);
    saveStudentsToStorage(updatedList);
    setStudentToDelete(null);

    // Close detail modal if the deleted student was currently viewed
    if (viewingStudent && viewingStudent.id === studentId) {
      setViewingStudent(null);
    }

    addToast(
      'success',
      'Student Record Removed',
      student
        ? `${student.fullName} (Roll #${student.rollNumber}) has been deleted.`
        : 'Student record removed successfully.'
    );
  };

  // Reset to default sample students
  const handleResetDemoData = () => {
    const defaultList = resetStudentsToDefault();
    setStudents(defaultList);
    setIsResetModalOpen(false);
    addToast(
      'info',
      'Demo Dataset Restored',
      'Loaded original student roster into local storage.'
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        studentCount={students.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenAddModal={handleOpenAddModal}
        onResetData={() => setIsResetModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Quick Analytics & Performance Overview */}
        <StatsCards students={students} />

        {/* Core CRUD Student Table with Search, Sort, Filters, and Actions */}
        <StudentTable
          students={students}
          onEditStudent={handleOpenEditModal}
          onDeleteStudent={handlePromptDelete}
          onViewStudent={(student) => setViewingStudent(student)}
          onAddStudent={handleOpenAddModal}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-5 bg-white/50 dark:bg-slate-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p>
            Student Management System &bull; Academic Year 2024–2025
          </p>
          <p className="flex items-center gap-1.5">
            <span>Stored in Local Storage</span>
            <span>&bull;</span>
            <span>All changes saved instantly</span>
          </p>
        </div>
      </footer>

      {/* Slide-over Side Panel / Modal for Add & Edit Student */}
      <StudentFormDrawer
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleFormSubmit}
        editingStudent={editingStudent}
        existingStudents={students}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!studentToDelete}
        student={studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Student Profile Quick View Modal */}
      <StudentDetailModal
        isOpen={!!viewingStudent}
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        onEdit={(student) => {
          setViewingStudent(null);
          handleOpenEditModal(student);
        }}
        onDelete={(student) => {
          setViewingStudent(null);
          handlePromptDelete(student);
        }}
      />

      {/* Reset Demo Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetDemoData}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
