// lib/types.ts
export interface Question {
  _id: string;
  questionText: string;
  options: string[];
  correct: number;
  answerText: string;
  subject?: string;
  chapter?: string;
  topic?: string;
  questionType: 'Short Answer' | 'Long Answer' | 'Problem-Solving' | 'Definition' | 'Fill-in-the-Blank'
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
  id: string;
  name: string;
  class: string;
  icon: string;
  description: string;
  chapters: Record<string, Chapter>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Password should not be stored in currentUser state long-term
  role: 'student' | 'admin';
  className?: string | null;
  classId?: string | null;
  address?: {
    city: string;
    state: string;
    pincode: string;
  } | null;
  school?: string | null;
  guardianName?: string | null;
  guardianMobileNumber?: string | null;
}

export interface AppData {
  subjects: Record<string, Subject>;
}

export interface Class {
  _id: string;
  name: string;
}