// app/(student)/subjects/[subjectKey]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { appData } from '@/lib/data';
import Breadcrumbs from '../../../components/shared/Breadcrumbs';

type Props = {
  params: { subjectKey: string };
};

// This is a Server Component, so we can fetch data directly.
export default function ChaptersPage({ params }: Props) {
  const { subjectKey } = params;
  const subject = appData.subjects[subjectKey];

  // If the subject key from the URL is invalid, show a 404 page.
  if (!subject) {
    notFound();
  }

  const breadcrumbLinks = [
    { href: '/student/dashboard', label: 'Dashboard' },
    { label: subject.name },
  ];
  
  const chapters = Object.entries(subject.chapters);

  return (
    <div>
      <Breadcrumbs links={breadcrumbLinks} />
      <h1 className="text-3xl font-bold mt-2 mb-6 flex items-center">
        <span className="text-4xl mr-4">{subject.icon}</span>
        {subject.name} Chapters
      </h1>
      
      {chapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map(([chapterKey, chapter]) => (
            <Link 
              key={chapterKey}
              href={`/student/subjects/${subjectKey}/${chapterKey}`}
              className="group block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-500 hover:shadow-lg transition-all duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                {chapter.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {Object.keys(chapter.topics).length} topics available
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">No Chapters Yet</h3>
            <p className="mt-2 text-gray-500">Chapters for this subject will be added soon. Please check back later.</p>
        </div>
      )}
    </div>
  );
}