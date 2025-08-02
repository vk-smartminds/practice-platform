// app/(student)/dashboard/page.tsx
'use client';
import { useAuth } from '../../context/AuthContext';
import SubjectCard from '../../components/student/SubjectCard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define a type for the subject objects fetched from the API
interface Subject {
  _id: string;
  name: string;
  classId: string;
}

export default function StudentDashboard() {
  const { currentUser, selectClass } = useAuth();
  const router = useRouter();
  const [subjectsForClass, setSubjectsForClass] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const fetchInitialData = async () => {
      if (currentUser.classId) {
        try {
          // Fetch both class and subject data concurrently for speed
          const [classRes, subjectsRes] = await Promise.all([
            fetch(`http://localhost:8000/api/student/class/${currentUser.classId}`, { credentials: 'include' }),
            fetch(`http://localhost:8000/api/student/subjects`, { credentials: 'include' })
          ]);

          if (!classRes.ok || !subjectsRes.ok) {
            throw new Error('Failed to fetch initial dashboard data.');
          }

          const classData = await classRes.json();
          const subjects = await subjectsRes.json();
          
          selectClass(classData.name + 'th');
          setSubjectsForClass(subjects);

        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [currentUser, router, selectClass]);
  
  if (loading || !currentUser?.class) {
    return <div>Loading or redirecting...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Subjects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjectsForClass && subjectsForClass.map((sub) => (
          // THE FIX: Pass the unique `_id` and `name` to the updated SubjectCard.
          <SubjectCard 
            key={sub._id} 
            subjectId={sub._id} 
            subjectName={sub.name} 
          />
        ))}
      </div>
    </div>
  );
}
