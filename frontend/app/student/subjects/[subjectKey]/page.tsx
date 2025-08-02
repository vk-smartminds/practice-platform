// app/(student)/subjects/[subjectKey]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "../../../components/shared/Breadcrumbs";
import { cookies } from "next/headers";

type Props = {
  params: { subjectKey: string };
};

// Define interfaces for the data shapes we expect from your API
interface Subject {
  _id: string;
  name: string;
  classId: string;
}

interface Chapter {
  _id: string;
  chapterName: string; // Corrected from chapterName to match API
  subjectId: string;
  topicCount?: number;
}

/**
 * A helper function to create a URL-friendly key from a name.
 * This ensures the links we generate match the expected URL structure of the next page.
 * @param name - The string to convert (e.g., "Real Numbers").
 * @returns A URL-friendly key (e.g., "real-numbers").
 */
const createKeyFromName = (name: string): string => {
    return name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
}

/**
 * A helper function to assign an icon based on the subject name.
 */
const getSubjectIcon = (subjectName: string): string => {
  const lowerName = subjectName.toLowerCase();
  if (lowerName.includes("mathematics")) return "📐";
  if (lowerName.includes("physics")) return "⚛️";
  if (lowerName.includes("chemistry")) return "🧪";
  if (lowerName.includes("biology")) return "🧬";
  return "📚"; // A default icon
};

/**
 * Server-side data fetching function.
 */
async function getSubjectAndChapters(subjectKey: string) {
  const cookieStore = cookies();
  // @ts-ignore
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) {
    throw new Error("Authentication failed: Token not found.");
  }

  const headers = {
    "Content-Type": "application/json",
    Cookie: `token=${tokenCookie.value}`,
  };

  try {
    const subjectsRes = await fetch(`http://localhost:8000/api/student/subjects`, { headers });
    if (!subjectsRes.ok) {
        if (subjectsRes.status === 404) return null;
        throw new Error(`Failed to fetch subjects: ${subjectsRes.statusText}`);
    }
    const allSubjects: Subject[] = await subjectsRes.json();
    const subject = allSubjects.find(s => createKeyFromName(s.name) === subjectKey);

    if (!subject) {
      return null;
    }

    const chaptersRes = await fetch(`http://localhost:8000/api/student/chapters/${subject._id}`, { headers });
     if (!chaptersRes.ok) {
        if (chaptersRes.status === 404) {
            return { subject, chapters: [] };
        }
        throw new Error(`Failed to fetch chapters: ${chaptersRes.statusText}`);
    }
    const chapters: Chapter[] = await chaptersRes.json();

    const chaptersWithTopicCount = await Promise.all(
      chapters.map(async (chapter) => {
        const topicsRes = await fetch(`http://localhost:8000/api/student/topics/${chapter._id}`, { headers });
        if (!topicsRes.ok) {
          return { ...chapter, topicCount: 0 };
        }
        const topics = await topicsRes.json();
        return { ...chapter, topicCount: Array.isArray(topics) ? topics.length : 0 };
      })
    );

    return { subject, chapters: chaptersWithTopicCount };

  } catch (error) {
    console.error("Error fetching data for chapters page:", error);
    return null;
  }
}

export default async function ChaptersPage({ params }: Props) {
  const { subjectKey } = params;

  const data = await getSubjectAndChapters(subjectKey);

  if (!data) {
    notFound();
  }

  const { subject, chapters } = data;

  const breadcrumbLinks = [
    { href: "/student/dashboard", label: "Dashboard" },
    { label: subject.name },
  ];

  return (
    <div>
      <Breadcrumbs links={breadcrumbLinks} />
      <h1 className="text-3xl font-bold mt-2 mb-6 flex items-center">
        <span className="text-4xl mr-4">{getSubjectIcon(subject.name)}</span>
        {subject.name} Chapters
      </h1>

      {chapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <Link
              key={chapter._id}
              // CORRECTED: This now generates a URL with the human-readable chapterKey,
              // matching the file path of the next page.
              href={`/student/subjects/${subjectKey}/${createKeyFromName(chapter.chapterName)}`}
              className="group block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-500 hover:shadow-lg transition-all duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                {chapter.chapterName}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {chapter.topicCount} topics available
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700">
            No Chapters Yet
          </h3>
          <p className="mt-2 text-gray-500">
            Chapters for this subject will be added soon. Please check back
            later.
          </p>
        </div>
      )}
    </div>
  );
}
