import { Student, StudentFormData, FormErrors } from '../types';

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

export function validateStudentForm(
  data: StudentFormData,
  existingStudents: Student[],
  currentStudentId?: string | null
): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};

  // Full Name validation
  const trimmedName = data.fullName.trim();
  if (!trimmedName) {
    errors.fullName = 'Full Name is required.';
  } else if (trimmedName.length < 2) {
    errors.fullName = 'Name must be at least 2 characters.';
  } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
    errors.fullName = 'Name can only contain letters, spaces, and hyphens.';
  }

  // Roll Number validation
  const trimmedRoll = data.rollNumber.trim().toUpperCase();
  if (!trimmedRoll) {
    errors.rollNumber = 'Roll Number is required.';
  } else if (trimmedRoll.length < 3) {
    errors.rollNumber = 'Roll Number must be at least 3 characters.';
  } else {
    // Unique check
    const isDuplicate = existingStudents.some(
      (s) =>
        s.rollNumber.trim().toUpperCase() === trimmedRoll &&
        s.id !== currentStudentId
    );
    if (isDuplicate) {
      errors.rollNumber = `Roll Number "${trimmedRoll}" is already assigned to another student.`;
    }
  }

  // Email validation
  const trimmedEmail = data.email.trim();
  if (!trimmedEmail) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address (e.g. student@university.edu).';
  }

  // Course validation
  const trimmedCourse = data.course.trim();
  if (!trimmedCourse) {
    errors.course = 'Please select or enter a course / department.';
  }

  // Marks validation
  const marksStr = data.marks.trim();
  if (!marksStr) {
    errors.marks = 'Marks / Grade score is required.';
  } else {
    const num = Number(marksStr);
    if (isNaN(num)) {
      errors.marks = 'Marks must be a valid number.';
    } else if (num < 0 || num > 100) {
      errors.marks = 'Marks must be between 0 and 100.';
    }
  }

  // Phone validation
  const trimmedPhone = data.phone.trim();
  if (!trimmedPhone) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_REGEX.test(trimmedPhone)) {
    errors.phone = 'Enter a valid phone number (at least 7 digits, e.g. +1 555-0192).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
