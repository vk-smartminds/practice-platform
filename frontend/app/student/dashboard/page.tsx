// app/(student)/dashboard/page.tsx
'use client';
import { useAuth } from '../../context/AuthContext';
import { appData } from '@/lib/data';
import SubjectCard from '../../components/student/SubjectCard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StudentDashboard() {
  const { currentUser, selectClass } = useAuth();
  const router = useRouter();

  // This function needs to send the token
  async function fetchUserClass() {
    if (currentUser && currentUser.classId) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/student/class/${currentUser.classId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Crucial for sending the auth cookie
          }
        );

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        // The backend returns the full class object, e.g., { _id: '...', name: '10th' }
        const classData = await response.json();
        
        // Update the user state with the fetched class name
        selectClass(classData.name + 'th'); 

      } catch (error) {
        console.error("Error fetching user class:", error);
      }
    }
  }

  useEffect(() => {
    if (!currentUser) router.push('/login');
    else if (currentUser.role === 'student') fetchUserClass();
  }, [currentUser, router]);
  
  if (!currentUser || !currentUser.class) {
    return <div>Loading or redirecting...</div>;
  }

  const subjectsForClass = Object.entries(appData.subjects).filter(
    ([_, subject]) => subject.class === currentUser?.class
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Subjects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjectsForClass.map(([key, subject]) => (
          <SubjectCard key={key} subjectKey={key} subject={subject} />
        ))}
      </div>
    </div>
  );
}