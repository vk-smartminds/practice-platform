// FILE: app/student/subjects/[subjectId]/[chapterId]/[topicId]/page.tsx
import QuestionsDisplay from '../../../../../components/student/QuestionsDisplay'; // Import the client component

// This is a Server Component (no "use client")
// It can be async and can access params directly

interface Params {
  subjectId: string;
  chapterId: string;
  topicId: string;
}

export default async function QuestionsPage({ params }: { params: Params }) {
  // Destructure the params on the server
  const { subjectId, chapterId, topicId } = params;

  // Pass the values down as regular props to the client component
  return (
    <QuestionsDisplay
    // @ts-ignore
      subjectId={subjectId}
      chapterId={chapterId}
      topicId={topicId}
    />
  );
}
