// app/components/student/QuestionCard.tsx
'use client';

import { useState } from 'react';
import { Question } from '@/lib/types'; // Ensure this type includes 'answerText'

type Props = {
  question: Question;
  index: number;
};

export default function QuestionCard({ question, index }: Props) {
  // State to manage only the visibility of the answer
  const [showAnswer, setShowAnswer] = useState(false);

  // This function simply toggles the state
  const handleToggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const typeColorMap: { [key: string]: string } = {
    'Short Answer': 'bg-sky-100 text-sky-800 border-sky-300',
    'Long Answer': 'bg-purple-100 text-purple-800 border-purple-300',
    'Problem-Solving': 'bg-amber-100 text-amber-800 border-amber-300',
    'Definition': 'bg-teal-100 text-teal-800 border-teal-300',
    'Fill-in-the-Blank': 'bg-rose-100 text-rose-800 border-rose-300',
  };
  const badgeClass = typeColorMap[question.questionType] || 'bg-gray-100 text-gray-800 border-gray-300';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300">
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 bg-indigo-500 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center">
          {index + 1}
        </span>
        <div className="w-full">
          <p className="font-semibold text-lg text-gray-800">{question.questionText}</p>
          <div className="mt-3 flex justify-end">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${badgeClass}`}>
              {question.questionType}
            </span>
          </div>
        </div>
      </div>

      {/* Button to toggle the answer visibility */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleToggleAnswer}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition-colors"
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
      </div>

      {/* Conditionally render the answer section based on state */}
      {showAnswer && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg animate-fade-in">
          <h4 className="font-bold text-green-800">Answer:</h4>
          {/* Display the answerText directly from the question prop */}
          <p className="text-gray-700">{question.answerText || "No answer provided."}</p>
        </div>
      )}
    </div>
  );
}