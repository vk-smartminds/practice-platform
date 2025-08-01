// lib/types.ts
export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  subject?: string;
  chapter?: string;
  topic?: string;
}

export interface Topic {
  name: string;
  questions: Question[];
}

export interface Chapter {
  name: string;
  topics: Record<string, Topic>;
}

export interface Subject {
  name: string;
  class: string;
  icon: string;
  description: string;
  chapters: Record<string, Chapter>;
}

export interface User {
  name: string;
  email: string;
  password?: string; // Password should not be stored in currentUser state long-term
  role: 'student' | 'admin';
  class?: string | null;
  classId?: string | null;
}

export interface AppData {
  subjects: Record<string, Subject>;
}