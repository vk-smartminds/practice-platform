// FILE: app/student/subjects/[subjectId]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "../../../components/shared/Breadcrumbs";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ subjectId: string }>;
};

// Define interfaces for the data shapes
interface Subject { _id: string; name: string; }
interface Chapter { _id: string; chapterName: string; topicCount?: number; }

const getSubjectIcon = (subjectName: string): string => {
  const lowerName = subjectName.toLowerCase();
  if (lowerName.includes("mathematics")) return "📐";
  if (lowerName.includes("physics")) return "⚛️";
  if (lowerName.includes("chemistry")) return "🧪";
  if (lowerName.includes("biology")) return "🧬";
  return "📚";
};

async function getSubjectAndChapters(subjectId: string) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  if (!tokenCookie) throw new Error("Authentication failed: Token not found.");

  const headers = { "Content-Type": "application/json", Cookie: `token=${tokenCookie.value}` };

  try {
    const [subjectsRes, chaptersRes] = await Promise.all([
      fetch(`http://localhost:8000/api/student/subjects`, { headers }),
      fetch(`http://localhost:8000/api/student/chapters/${subjectId}`, { headers })
    ]);

    if (!subjectsRes.ok) throw new Error("Failed to fetch subjects for breadcrumbs.");
    
    const allSubjects: Subject[] = await subjectsRes.json();
    const subject = allSubjects.find(s => s._id === subjectId);
    if (!subject) return null;

    const chapters: Chapter[] = chaptersRes.ok ? await chaptersRes.json() : [];

    // Concurrently fetch topic counts for each chapter
    const chaptersWithTopicCount = await Promise.all(
      chapters.map(async (chapter) => {
        const topicsRes = await fetch(`http://localhost:8000/api/student/topics/${chapter._id}`, { headers });
        const topics = topicsRes.ok ? await topicsRes.json() : [];
        return { ...chapter, topicCount: topics.length };
      })
    );

    return { subject, chapters: chaptersWithTopicCount };
  } catch (error) {
    console.error("Error fetching data for chapters page:", error);
    return null;
  }
}

export default async function ChaptersPage({ params }: Props) {
  const { subjectId } = await params;
  const data = await getSubjectAndChapters(subjectId);

  if (!data) {
    notFound();
  }

  const { subject, chapters } = data;
  const breadcrumbLinks = [{ href: "/student/dashboard", label: "Dashboard" }, { label: subject.name }];

  return (
    <div>
      <Breadcrumbs links={breadcrumbLinks} />
      <h1 className="text-3xl font-bold mt-2 mb-6 flex items-center">
        <span className="text-4xl mr-4">{getSubjectIcon(subject.name)}</span>
        Chapters
      </h1>
      {chapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <Link
              key={chapter._id}
              href={`/student/subject/${subjectId}/${chapter._id}`}
              className="group block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-500 hover:shadow-lg transition-all duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">{chapter.chapterName}</h3>
              <p className="mt-2 text-sm text-gray-500">{chapter.topicCount} topics available</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700">No Chapters Yet</h3>
          <p className="mt-2 text-gray-500">Chapters for this subject will be added soon.</p>
        </div>
      )}
    </div>
  );
}
