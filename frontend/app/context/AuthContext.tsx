// app/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, Question } from '@/lib/types';
import { appData } from '@/lib/data';

interface AuthContextType {
  currentUser: User | null;
  adminQuestions: Question[];
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  selectClass: (selectedClass: string) => void;
  addAdminQuestion: (question: Question) => void;
  deleteAdminQuestion: (questionId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminQuestions, setAdminQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('currentUser');
      const storedQuestions = sessionStorage.getItem('adminQuestions');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      if (storedQuestions) {
        setAdminQuestions(JSON.parse(storedQuestions));
      }
    } catch (error) {
      console.error("Failed to parse session storage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: pass }),
        credentials: 'include', 
      });

      if (!response.ok) {
        return false;
      }

      // Expect the backend to send back an object with both the user and the token
      const user = await response.json();

      if (!user) {
        console.error("Login response missing user data.");
        return false;
      }

      sessionStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);

      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };
  
  const logout = () => {
    // Clear both the user and the token on logout
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken'); // Remove the token
    setCurrentUser(null);
    router.push('/login');
  };

  const selectClass = (selectedClass: string) => {
    if (currentUser && currentUser.role === 'student') {
      const updatedUser = { ...currentUser, class: selectedClass };
      setCurrentUser(updatedUser);
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const addAdminQuestion = (question: Question) => {
    const newQuestions = [...adminQuestions, question];
    setAdminQuestions(newQuestions);
    sessionStorage.setItem('adminQuestions', JSON.stringify(newQuestions));
  };
  
  const deleteAdminQuestion = (questionId: string) => {
    const newQuestions = adminQuestions.filter(q => q.id !== questionId);
    setAdminQuestions(newQuestions);
    sessionStorage.setItem('adminQuestions', JSON.stringify(newQuestions));
  };

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, selectClass, adminQuestions, addAdminQuestion, deleteAdminQuestion }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};