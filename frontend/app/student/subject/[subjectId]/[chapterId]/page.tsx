// FILE: app/student/subjects/[subjectId]/[chapterId]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "../../../../components/shared/Breadcrumbs";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ subjectId: string; chapterId: string; }>;
};

// Define interfaces for the data shapes
interface Subject { _id: string; name: string; }
interface Chapter { _id: string; chapterName: string; }
interface Topic { _id: string; title: string; }

async function getPageData(subjectId: string, chapterId: string) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  if (!tokenCookie) throw new Error("Authentication failed: Token not found.");

  const headers = { "Content-Type": "application/json", Cookie: `token=${tokenCookie.value}` };

  try {
    const [subjectsRes, chaptersRes, topicsRes] = await Promise.all([
      fetch(`http://localhost:8000/api/student/subjects`, { headers }),
      fetch(`http://localhost:8000/api/student/chapters/${subjectId}`, { headers }),
      fetch(`http://localhost:8000/api/student/topics/${chapterId}`, { headers }),
    ]);

    if (!subjectsRes.ok || !chaptersRes.ok) throw new Error("Failed to fetch breadcrumb data.");
    
    const allSubjects: Subject[] = await subjectsRes.json();
    const subject = allSubjects.find(s => s._id === subjectId);

    const allChapters: Chapter[] = await chaptersRes.json();
    const chapter = allChapters.find(c => c._id === chapterId);
    
    if (!subject || !chapter) return null;

    const topics: Topic[] = topicsRes.ok ? await topicsRes.json() : [];

    return { subject, chapter, topics };
  } catch (error) {
    console.error("Error fetching data for topics page:", error);
    return null;
  }
}

export default async function TopicsPage({ params }: Props) {
  const { subjectId, chapterId } = await params;
  const data = await getPageData(subjectId, chapterId);

  if (!data) {
    notFound();
  }

  const { subject, chapter, topics } = data;
  
  // Helper to create keys for linking backwards to the old [subjectKey] route
  const createKeyFromName = (name: string): string => {
      if (typeof name !== 'string' || !name) return '';
      return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  
  const breadcrumbLinks = [
    { href: "/student/dashboard", label: "Dashboard" },
    { href: `/student/subject/${subjectId}`, label: subject.name },
    { label: chapter.chapterName },
  ];

  return (
    <div>
      <Breadcrumbs links={breadcrumbLinks} />
      <h1 className="text-3xl font-bold mt-2 mb-6">Topics in <span className="text-indigo-600">{chapter.chapterName}</span></h1>
      {topics.length > 0 ? (
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <Link
              key={topic._id}
              href={`/student/subject/${subjectId}/${chapterId}/${topic._id}`}
              className="group block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-500 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center">
                <span className="text-lg font-bold text-indigo-600 mr-4 bg-indigo-50 rounded-full h-8 w-8 flex items-center justify-center">{index + 1}</span>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">{topic.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700">No Topics Yet</h3>
          <p className="mt-2 text-gray-500">Topics for this chapter will be added soon.</p>
        </div>
      )}
    </div>
  );
}
