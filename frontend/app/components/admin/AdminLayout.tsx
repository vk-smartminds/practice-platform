"use client";
import React, { useState } from 'react';
import Link from 'next/link'; // Import the Link component
import { CreateSubjectForm } from './CreateSubjectForm';
import { CreateChapterForm } from './CreateChapterForm';
import { CreateTopicForm } from './CreateTopicForm';
import { CreateQuestionForm } from './CreateQuestionForm';
// import { EditIcon } from '../ui/Icons'; // Assuming you have an EditIcon or similar

// A simple EditIcon if you don't have one
const PencilIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);


export const AdminLayout = ({ classes }: any) => {
    const [activeTab, setActiveTab] = useState('subject');

    const tabs = [
        { id: 'subject', label: 'Create Subject' },
        { id: 'chapter', label: 'Create Chapter' },
        { id: 'topic', label: 'Create Topic' },
        { id: 'question', label: 'Create Question' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'subject':
                return <CreateSubjectForm classes={classes} />;
            case 'chapter':
                return <CreateChapterForm classes={classes} />;
            case 'topic':
                return <CreateTopicForm classes={classes} />;
            case 'question':
                return <CreateQuestionForm classes={classes} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                {/* --- UPDATED: Header with Edit Button --- */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create Content</h1>
                        <p className="mt-1 text-sm text-gray-500">Create new subjects, chapters, topics, and questions.</p>
                    </div>
                    <Link href="/admin/edit" className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md hover:bg-gray-50 shadow-sm font-medium text-sm transition-colors">
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit Content
                        </span>
                    </Link>
                </div>
            </header>

            {/* --- Existing Tab Navigation --- */}
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">Select a tab</label>
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    onChange={(e) => setActiveTab(e.target.value)}
                    value={activeTab}
                >
                    {tabs.map((tab) => <option key={tab.id} value={tab.id}>{tab.label}</option>)}
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <main className="mt-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};