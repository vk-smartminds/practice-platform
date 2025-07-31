// app/(student)/dashboard/page.tsx
'use client';
import { useAuth } from '../../context/AuthContext';
import { appData } from '@/lib/data';
import SubjectCard from '../../components/student/SubjectCard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.push('/login');
    else if (currentUser.role === 'student' && !currentUser.class) router.push('/student/class-selection');
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