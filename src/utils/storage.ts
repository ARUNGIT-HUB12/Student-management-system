import { Student } from '../types';
import { INITIAL_STUDENTS } from '../data/initialStudents';

const STORAGE_KEY = 'sms_students_data_v1';
const THEME_KEY = 'sms_theme_mode';

export function loadStudentsFromStorage(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_STUDENTS;
  } catch (err) {
    console.error('Failed to load students from localStorage:', err);
    return INITIAL_STUDENTS;
  }
}

export function saveStudentsToStorage(students: Student[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    return true;
  } catch (err) {
    console.error('Failed to save students to localStorage:', err);
    return false;
  }
}

export function resetStudentsToDefault(): Student[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
  } catch (err) {
    console.error('Failed to reset students in localStorage:', err);
  }
  return INITIAL_STUDENTS;
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // fallback
  }
  return 'dark';
}

export function saveStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error('Failed to save theme to localStorage:', err);
  }
}
