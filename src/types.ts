export interface Student {
  id: string;
  fullName: string;
  rollNumber: string;
  email: string;
  course: string;
  marks: number;
  grade: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export type StudentFormData = {
  fullName: string;
  rollNumber: string;
  email: string;
  course: string;
  marks: string; // string in form input, converted to number
  grade?: string;
  phone: string;
};

export type FormErrors = Partial<Record<keyof StudentFormData, string>>;

export type SortField = 'fullName' | 'rollNumber' | 'email' | 'course' | 'marks';
export type SortDirection = 'asc' | 'desc';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

export const COMMON_COURSES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Data Science & Analytics',
  'Biotechnology',
] as const;
