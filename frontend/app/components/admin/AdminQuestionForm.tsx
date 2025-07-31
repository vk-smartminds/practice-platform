// app/components/admin/AdminQuestionForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appData } from '@/lib/data';
import { Question } from '@/lib/types';

export default function AdminQuestionForm() {
  const { addAdminQuestion } = useAuth();

  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [topic, setTopic] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('0');
  const [explanation, setExplanation] = useState('');
  
  const [availableChapters, setAvailableChapters] = useState<[string, { name: string }][]>([]);
  const [availableTopics, setAvailableTopics] = useState<[string, { name: string }][]>([]);

  useEffect(() => {
    if (subject) {
      setChapter('');
      setTopic('');
      const chapters = Object.entries(appData.subjects[subject]?.chapters || {});
      setAvailableChapters(chapters as [string, { name: string }][]);
    } else {
      setAvailableChapters([]);
    }
  }, [subject]);

  useEffect(() => {
    if (chapter) {
      setTopic('');
      const topics = Object.entries(appData.subjects[subject]?.chapters[chapter]?.topics || {});
      setAvailableTopics(topics as [string, { name: string }][]);
    } else {
      setAvailableTopics([]);
    }
  }, [chapter, subject]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !chapter || !topic || !questionText || options.some(opt => !opt) || !explanation) {
      alert('Please fill out all fields.');
      return;
    }

    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      subject,
      chapter,
      topic,
      question: questionText,
      options,
      correct: parseInt(correctAnswer, 10),
      explanation,
    };

    addAdminQuestion(newQuestion);
    alert('Question created successfully!');
    
    // Reset form
    setSubject('');
    setChapter('');
    setTopic('');
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('0');
    setExplanation('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      {/* Subject Dropdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="question-subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <select id="question-subject" value={subject} onChange={e => setSubject(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option value="">Select Subject</option>
            {Object.entries(appData.subjects).map(([key, sub]) => (
              <option key={key} value={key}>{sub.name}</option>
            ))}
          </select>
        </div>
        {/* Chapter and Topic Dropdowns (similar structure) */}
        <div>
          <label htmlFor="question-chapter">Chapter</label>
          <select id="question-chapter" value={chapter} onChange={e => setChapter(e.target.value)} required disabled={!subject}>
            <option value="">Select Chapter</option>
            {availableChapters.map(([key, chap]) => <option key={key} value={key}>{chap.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="question-topic">Topic</label>
          <select id="question-topic" value={topic} onChange={e => setTopic(e.target.value)} required disabled={!chapter}>
            <option value="">Select Topic</option>
            {availableTopics.map(([key, top]) => <option key={key} value={key}>{top.name}</option>)}
          </select>
        </div>
      </div>

      {/* Question Text */}
      <div>
        <label htmlFor="question-text">Question</label>
        <textarea id="question-text" value={questionText} onChange={e => setQuestionText(e.target.value)} required rows={3} />
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <div key={index}>
            <label htmlFor={`option-${index}`}>Option {String.fromCharCode(65 + index)}</label>
            <input type="text" id={`option-${index}`} value={option} onChange={e => handleOptionChange(index, e.target.value)} required />
          </div>
        ))}
      </div>
      
      {/* Correct Answer */}
      <div>
        <label htmlFor="correct-answer">Correct Answer</label>
        <select id="correct-answer" value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} required>
          {options.map((opt, index) => (
            <option key={index} value={index}>Option {String.fromCharCode(65 + index)}</option>
          ))}
        </select>
      </div>

       {/* Explanation */}
      <div>
        <label htmlFor="explanation">Explanation</label>
        <textarea id="explanation" value={explanation} onChange={e => setExplanation(e.target.value)} required rows={3}/>
      </div>

      <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700">Create Question</button>
    </form>
  );
}