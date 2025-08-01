// app/components/student/SubjectCard.tsx
import Link from 'next/link';
import { Subject } from '@/lib/types';

type Props = {
  subjectKey: string;
  subject: string;
};

export default function SubjectCard({ subjectKey, subject }: Props) {
  return (
    <Link 
      href={`/student/subjects/${subjectKey}`}
      className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center mb-3">
        <h3 className="text-xl font-bold text-gray-800">{subject}</h3>
      </div>
      <p className="text-gray-600">
        Master the concepts in {subject}
      </p>
    </Link>
  );
}