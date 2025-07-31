// app/(student)/subjects/[subjectKey]/[chapterKey]/[topicKey]/page.tsx
'use client';
import { useAuth } from '../../../../../context/AuthContext';
import { appData } from '@/lib/data';
import { Question } from '@/lib/types';
import QuestionCard from '../../../../../components/student/QuestionCard';
import Breadcrumbs from '../../../../../components/shared/Breadcrumbs';

type Props = {
  params: { subjectKey: string; chapterKey: string; topicKey: string };
};

export default function QuestionsPage({ params }: Props) {
  const { subjectKey, chapterKey, topicKey } = params;
  const { adminQuestions } = useAuth();

  const subject = appData.subjects[subjectKey];
  const chapter = subject?.chapters[chapterKey];
  const topic = chapter?.topics[topicKey];

  if (!topic) {
    return <div>Topic not found.</div>;
  }
  
  const topicAdminQuestions = adminQuestions.filter(
    q => q.subject === subjectKey && q.chapter === chapterKey && q.topic === topicKey
  );
  
  const allQuestions: Question[] = [...topic.questions, ...topicAdminQuestions];

  const breadcrumbLinks = [
    { href: '/student/dashboard', label: 'Dashboard' },
    { href: `/student/subjects/${subjectKey}`, label: subject.name },
    { href: `/student/subjects/${subjectKey}/${chapterKey}`, label: chapter.name },
    { label: topic.name },
  ];

  return (
    <div>
      <Breadcrumbs links={breadcrumbLinks} />
      <h1 className="text-3xl font-bold mt-4 mb-6">{topic.name} - Practice Questions</h1>
      <div className="space-y-8">
        {allQuestions.map((q, index) => (
          <QuestionCard key={q.id} question={q} index={index} />
        ))}
      </div>
    </div>
  );
}