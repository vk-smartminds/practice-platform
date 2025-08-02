// FILE: app/student/subjects/[subjectId]/[chapterId]/[topicId]/page.tsx
// import QuestionsDisplay from '../../../../../components/student/QuestionsDisplay'; // Import the client component

// // This is a Server Component (no "use client")
// // It can be async and can access params directly

// interface Params {
//   subjectId: string;
//   chapterId: string;
//   topicId: string;
// }

// export default async function QuestionsPage({ params }: { params: Params }) {
//   // Destructure the params on the server
//   const { subjectId, chapterId, topicId } = params;

//   // Pass the values down as regular props to the client component
//   return (
//     <QuestionsDisplay
//     // @ts-ignore
//       subjectId={subjectId}
//       chapterId={chapterId}
//       topicId={topicId}
//     />
//   );
// }

'use client';

import { useState, useEffect } from "react";
import { Question } from "@/lib/types"; // Ensure this type matches your new schema
import QuestionCard from "../../../../../components/student/QuestionCard";
import Breadcrumbs from "../../../../../components/shared/Breadcrumbs";

type Props = {
  params: {
    subjectId: string;
    chapterId: string;
    topicId: string;
  };
};

// Define interfaces for the data we'll fetch
interface Subject { _id: string; name: string; }
interface Chapter { _id: string; chapterName: string; }
interface Topic { _id: string; title: string; }
interface PageData {
  subjectName: string;
  chapterName: string;
  topicName: string;
  questions: Question[];
}

interface QuestionsDisplayProps {
  subjectId: string;
  chapterId: string;
  topicId: string;
}

export default function QuestionsPage({ params }: Props) {
  const { subjectId, chapterId, topicId } = params;

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestionPageData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [subjectsRes, chaptersRes, topicsRes, questionsRes] = await Promise.all([
          fetch(`http://localhost:8000/api/student/subjects`, { credentials: "include" }),
          fetch(`http://localhost:8000/api/student/chapters/${subjectId}`, { credentials: "include" }),
          fetch(`http://localhost:8000/api/student/topics/${chapterId}`, { credentials: "include" }),
          fetch(`http://localhost:8000/api/student/questions/${topicId}`, { credentials: "include" })
        ]);

        if (!subjectsRes.ok || !chaptersRes.ok || !topicsRes.ok || !questionsRes.ok) {
          throw new Error("One or more API requests failed.");
        }

        const allSubjects: Subject[] = await subjectsRes.json();
        const allChapters: Chapter[] = await chaptersRes.json();
        const allTopics: Topic[] = await topicsRes.json();
        const questions: Question[] = await questionsRes.json();

        const subject = allSubjects.find(s => s._id === subjectId);
        const chapter = allChapters.find(c => c._id === chapterId);
        const topic = allTopics.find(t => t._id === topicId);

        if (!subject || !chapter || !topic) {
          throw new Error("Could not find subject, chapter, or topic from fetched data.");
        }

        setPageData({
          subjectName: subject.name,
          chapterName: chapter.chapterName,
          topicName: topic.title,
          questions: questions,
        });

      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
        console.error("Error fetching question page data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionPageData();
  }, [subjectId, chapterId, topicId]);

  if (loading) return <div className="text-center p-12">Loading questions...</div>;
  if (error) return <div className="text-center p-12 text-red-500">Error: {error}</div>;
  if (!pageData) return <div className="text-center p-12">Could not load page data.</div>;
  
  const createKeyFromName = (name: string): string => {
      if (typeof name !== 'string' || !name) return '';
      return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  const breadcrumbLinks = [
    { href: "/student/dashboard", label: "Dashboard" },
    { href: `/student/subject/${subjectId}`, label: pageData.subjectName },
    { href: `/student/subject/${subjectId}/${chapterId}`, label: pageData.chapterName },
    { label: pageData.topicName },
  ];

  return (
    <div>
      <Breadcrumbs links={breadcrumbLinks} />
      <h1 className="text-3xl font-bold mt-4 mb-6">{pageData.topicName} - Practice Questions</h1>
      {pageData.questions.length > 0 ? (
        <div className="space-y-4">
          {pageData.questions.map((q, index) => (
            <QuestionCard key={q._id} question={q} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700">No Questions Yet</h3>
          <p className="mt-2 text-gray-500">Practice questions for this topic will be added soon.</p>
        </div>
      )}
    </div>
  );
}