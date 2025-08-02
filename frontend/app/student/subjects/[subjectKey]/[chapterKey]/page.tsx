// app/(student)/subjects/[subjectKey]/[chapterKey]/page.tsx

import { notFound } from "next/navigation";

import Link from "next/link";

import Breadcrumbs from "../../../../components/shared/Breadcrumbs";

import { cookies } from "next/headers";



type Props = {

  // The params object itself might be a promise that needs to be resolved

  params: Promise<{

    subjectKey: string;

    chapterKey: string;

  }>;

};



// Define the interfaces for the data shapes from your API

interface Subject {

  _id: string;

  name: string;

}



interface Chapter {

  _id: string;

  chapterName: string;

}



interface Topic {

  _id: string;

  title: string;

}



/**

 * A more robust helper function to create a URL-friendly key from a name.

 */

const createKeyFromName = (name: string): string => {

  if (typeof name !== "string" || !name) {

    return "";

  }

  return name

    .toLowerCase()

    .replace(/&/g, "and")

    .replace(/[^a-z0-9]+/g, "-")

    .replace(/^-+|-+$/g, "");

};



/**

 * Server-side data fetching function.

 */

async function getChapterAndTopics(subjectKey: string, chapterKey: string) {

  // FIX: Await the cookies() function before accessing its methods.

  const cookieStore = await cookies();

  const tokenCookie = cookieStore.get("token");



  if (!tokenCookie) {

    throw new Error("Authentication failed: Token not found.");

  }



  const headers = {

    "Content-Type": "application/json",

    Cookie: `token=${tokenCookie.value}`,

  };



  try {

    // Step 1: Fetch subjects to find the matching subject._id

    const subjectsRes = await fetch(

      `http://localhost:8000/api/student/subjects`,

      { headers }

    );

    if (!subjectsRes.ok) throw new Error("Failed to fetch subjects.");

    const allSubjects: Subject[] = await subjectsRes.json();

    const subject = allSubjects.find(

      (s) => createKeyFromName(s.name) === subjectKey

    );



    if (!subject) return null;



    // Step 2: Fetch chapters for that subject

    const chaptersRes = await fetch(

      `http://localhost:8000/api/student/chapters/${subject._id}`,

      { headers }

    );

    const allChapters: Chapter[] = chaptersRes.ok

      ? await chaptersRes.json()

      : [];



    // Step 3: Find the chapter that matches the chapterKey

    const chapter = allChapters.find(

      (c) => createKeyFromName(c.chapterName) === chapterKey

    );



    if (!chapter) return null;



    // Step 4: Fetch topics for that chapter

    const topicsRes = await fetch(

      `http://localhost:8000/api/student/topics/${chapter._id}`,

      { headers }

    );



    if (!topicsRes.ok) {

      throw new Error(`Failed to fetch topics: ${topicsRes.statusText}`);

    }

    const topics: Topic[] = await topicsRes.json();



    return { subject, chapter, topics };

  } catch (error) {

    console.error("Error fetching data for topics page:", error);

    return null;

  }

}



// This is a Next.js Server Component.

export default async function TopicsPage({ params }: Props) {

  // FIX: Await the params object to resolve it before destructuring.

  const { subjectKey, chapterKey } = await params;



  const data = await getChapterAndTopics(subjectKey, chapterKey);



  if (!data) {

    notFound();

  }



  const { subject, chapter, topics } = data;



  const breadcrumbLinks = [

    { href: "/student/dashboard", label: "Dashboard" },

    { href: `/student/subjects/${subjectKey}`, label: subject.name },

    { label: chapter.chapterName },

  ];



  return (

    <div>

      <Breadcrumbs links={breadcrumbLinks} />

      <h1 className="text-3xl font-bold mt-2 mb-6">

        Topics in <span className="text-indigo-600">{chapter.chapterName}</span>

      </h1>



      {topics.length > 0 ? (

        <div className="space-y-4">

          {topics.map((topic, index) => (

            <Link

              key={topic._id}

              href={`/student/subjects/${subjectKey}/${chapterKey}/${topic._id}`}

              className="group block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-500 hover:shadow-lg transition-all duration-200"

            >

              <div className="flex items-center">

                <span className="text-lg font-bold text-indigo-600 mr-4 bg-indigo-50 rounded-full h-8 w-8 flex items-center justify-center">

                  {index + 1}

                </span>

                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">

                  {topic.title}

                </h3>

              </div>

            </Link>

          ))}

        </div>

      ) : (

        <div className="text-center py-12 px-6 bg-white rounded-lg shadow-sm">

          <h3 className="text-xl font-semibold text-gray-700">No Topics Yet</h3>

          <p className="mt-2 text-gray-500">

            Topics for this chapter will be added soon. Please check back later.

          </p>

        </div>

      )}

    </div>

  );

}