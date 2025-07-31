// app/components/admin/AdminQuestionList.tsx
'use client';
import { useAuth } from '../../context/AuthContext';
import { appData } from '@/lib/data';

export default function AdminQuestionList() {
  const { adminQuestions, deleteAdminQuestion } = useAuth();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteAdminQuestion(id);
    }
  };

  if (adminQuestions.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700">No Questions Created Yet</h3>
        <p className="mt-2 text-gray-500">Use the 'Create Question' tab to add new questions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {adminQuestions.map(q => {
        const subject = appData.subjects[q.subject!];
        const chapter = subject?.chapters[q.chapter!];
        const topic = chapter?.topics[q.topic!];
        
        return (
          <div key={q.id} className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-start">
              <p className="font-semibold text-gray-800 flex-1 pr-4">{q.question}</p>
              <button onClick={() => handleDelete(q.id)} className="bg-red-500 text-white text-sm font-bold py-1 px-3 rounded-md hover:bg-red-600">
                Delete
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {subject?.name} &gt; {chapter?.name} &gt; {topic?.name}
            </div>
            <div className="text-sm text-green-700 mt-1">
              Correct Answer: {q.options[q.correct]}
            </div>
          </div>
        );
      })}
    </div>
  );
}