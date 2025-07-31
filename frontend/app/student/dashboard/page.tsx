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
  // Check if the user exists but the class name hasn't been fetched yet
  if (currentUser && !currentUser.class) {
    try {
      // 1. Get the token from sessionStorage
      const token = sessionStorage.getItem('authToken');

      // If there's no token, we can't proceed.
      if (!token) {
        console.error("Auth token not found in session storage.");
        // Optional: redirect to login
        // router.push('/login'); 
        return;
      }

      // 2. Make the fetch call WITH the Authorization header
      const response = await fetch(`http://localhost:8000/api/student/class`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // THIS IS THE CRITICAL LINE
          'Authorization': `Bearer ${token}` 
        },
      });
      
      if (!response.ok) {
        // This is where your 401 error is being caught
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      selectClass(data.name);
      
    } catch (error) {
      console.error("Error fetching user class:", error);
    }
  }
}

  useEffect(() => {
    console.log(currentUser);
    
    if (!currentUser) router.push('/login');
    else if (currentUser.role === 'student' && !currentUser.class) fetchUserClass();
    
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