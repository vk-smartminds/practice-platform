// app/(student)/class-selection/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function ClassSelectionPage() {
  const { currentUser, selectClass } = useAuth();
  const router = useRouter();

  // Redirect if user is not logged in or has already selected a class
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role === 'student' && currentUser.class) {
      router.push('/student/dashboard');
    }
  }, [currentUser, router]);

  // Prevent rendering if currentUser is not yet available
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  
  const handleSelectClass = (selectedClass: string) => {
    selectClass(selectedClass);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-lg p-8 text-center bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {currentUser.name}!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Please select your class to continue.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSelectClass('9th')}
            // disabled
            className="p-6 text-2xl font-bold text-white bg-indigo-400 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
          >
            9th
          </button>
          
          <button
            onClick={() => handleSelectClass('10th')}
            className="p-6 text-2xl font-bold text-white bg-indigo-400 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
          >
            10th
          </button>
          
          <button
            onClick={() => handleSelectClass('11th')}
            // disabled
            className="p-6 text-2xl font-bold text-white bg-indigo-400 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
          >
            11th
          </button>

          <button
            onClick={() => handleSelectClass('12th')}
            // disabled
            className="p-6 text-2xl font-bold text-white bg-indigo-400 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
          >
            12th
          </button>
        </div>
      </div>
    </div>
  );
}