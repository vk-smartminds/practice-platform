// app/(student)/subjects/[subjectKey]/[chapterKey]/page.tsx
import { use } from 'react'; // 1. Import the 'use' hook
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { appData } from '@/lib/data';
import Breadcrumbs from '../../../../components/shared/Breadcrumbs';

type Props = {
  // Note: The type for params is now a Promise
  params: Promise<{ 
    subjectKey: string;
    chapterKey: string;
  }>;
};

export default function TopicsPage({ params }: Props) {
  // 2. Call use(params) to unwrap the promise
  const { subjectKey, chapterKey } = use(params); 
  
  const subject = appData.subjects[subjectKey];
  const chapter = subject?.chapters[chapterKey];

  if (!subject || !chapter) {
    notFound();
  }

  const breadcrumbLinks = [
    { href: '/student/dashboard', label: 'Dashboard' },
    { href: `/student/subjects/${subjectKey}`, label: subject.name },
    { label: chapter.name },
  ];
  
  const topics = Object.entries(chapter.topics);

  return (
    <div>
      <Breadcrumbs links={breadcrumbLinks} />
      <h1 className="text-3xl font-bold mt-2 mb-6">
        {chapter.name} - Topics
      </h1>
      
      {topics.length > 0 ? (
        <div className="space-y-4">
          {topics.map(([topicKey, topic]) => (
            <Link 
              key={topicKey}
              href={`/student/subjects/${subjectKey}/${chapterKey}/${topicKey}`}
              className="group block p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-500 hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
                  {topic.name}
                </h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {topic.questions.length} questions
                  </span>
                  <svg 
                    className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">No Topics Found</h3>
            <p className="mt-2 text-gray-500">Topics for this chapter will be added soon.</p>
        </div>
      )}
    </div>
  );
}