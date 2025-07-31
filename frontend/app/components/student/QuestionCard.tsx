// app/components/student/QuestionCard.tsx
'use client';
import { useState } from 'react';
import { Question } from '@/lib/types';

type Props = {
  question: Question;
  index: number;
};

export default function QuestionCard({ question, index }: Props) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
  };

  const getOptionClass = (optionIndex: number) => {
    if (!isAnswered) {
      return 'hover:bg-gray-100';
    }
    if (optionIndex === question.correct) {
      return 'bg-green-100 border-green-500 text-green-800';
    }
    if (optionIndex === selectedOption) {
      return 'bg-red-100 border-red-500 text-red-800';
    }
    return 'bg-white';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-start gap-4 mb-4">
        <span className="flex-shrink-0 bg-indigo-500 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center">
          {index + 1}
        </span>
        <p className="font-semibold text-lg">{question.question}</p>
      </div>
      <div className="space-y-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={isAnswered}
            className={`w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-4 ${getOptionClass(i)}`}
          >
            <span className="font-bold text-gray-500">{String.fromCharCode(65 + i)}</span>
            <span>{option}</span>
          </button>
        ))}
      </div>
      {isAnswered && (
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <h4 className="font-bold">Explanation:</h4>
          <p className="text-gray-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}