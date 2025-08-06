// app/components/student/SubjectCard.tsx
import Link from 'next/link';

type Props = {
  // The component now accepts the unique ID and name of the subject.
  subjectId: string;
  subjectName: string;
};

export default function SubjectCard({ subjectId, subjectName }: Props) {
  // A helper function to assign an icon based on the subject name.
  const getSubjectIcon = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("mathematics")) return "📐";
    if (lowerName.includes("physics")) return "⚛️";
    if (lowerName.includes("chemistry")) return "🧪";
    if (lowerName.includes("biology")) return "🧬";
    return "📚"; // Default icon
  };

  return (
    <Link 
      // THE FIX: The link now points to the new ID-based route.
      // Note the plural "subjects" to match your new folder structure.
      href={`/student/subject/${subjectId}`}
      className="group block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center mb-3 gap-4">
        <span className="text-2xl">{getSubjectIcon(subjectName)}</span>
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#e95672] transition-colors">
          {subjectName}
        </h3>
      </div>
      <p className="text-gray-600">
        Explore chapters and practice questions for {subjectName}.
      </p>
    </Link>
  );
}