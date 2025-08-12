'use client';

import { Question } from '@/lib/types';
import Breadcrumbs from '../shared/Breadcrumbs'; // Assuming you have this component
import { useState } from 'react';

// Simple SVG Icons for actions
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);
const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

interface Breadcrumb {
    name: string;
    href: string;
}

interface Props {
    question: Question;
    breadcrumbs: Breadcrumb[];
}

export default function QuestionDetail({ question, breadcrumbs }: Props) {
    const [error, setError] = useState('');

    const handleEdit = () => {
        // Placeholder for your edit modal logic
        alert(`Editing question: ${question._id}`);
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        
        try {
            const res = await fetch(`/api/admin/questions/${question._id}`, { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to delete question');
            }
            // On success, redirect back to the topic's question list
            window.location.href = breadcrumbs[breadcrumbs.length - 2].href;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            {/* <Breadcrumbs items={breadcrumbs} /> */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                {/* Header with Title and Actions */}
                <div className="flex justify-between items-center pb-4 border-b">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Question Details</h1>
                        <p className="text-sm text-gray-500">View, edit, or delete this question.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600 transition-colors">
                            <EditIcon />
                            <span>Edit</span>
                        </button>
                        <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 transition-colors">
                            <DeleteIcon />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>

                {error && <div className="mt-4 text-center p-3 text-red-700 bg-red-100 rounded-md">{error}</div>}

                {/* Question and Answer Boxes */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Question Box */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h3 className="font-semibold text-lg text-gray-700 mb-2">Question</h3>
                        <p className="text-gray-800">{question.questionText}</p>
                    </div>
                    {/* Answer Box */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-semibold text-lg text-green-800 mb-2">Answer</h3>
                        <p className="text-green-900">{question.answerText}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
