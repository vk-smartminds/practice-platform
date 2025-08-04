// app/admin/edit/components/EditLayout.tsx
// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { EditableList } from './EditableList';
import { EditModal } from './EditModal';
import { Notification } from '../ui/Notification'; // Reusing

const API_BASE_URL = 'http://localhost:8000/api/admin';

// Helper function for API calls
const apiCall = async (url: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    };
    const res = await fetch(url, { ...defaultOptions, ...options });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }
    return res.json();
};

export const EditLayout = ({ initialClasses }) => {
    // State for data lists
    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState([]);

    // State for selections
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [selectedChapterId, setSelectedChapterId] = useState(null);
    const [selectedTopicId, setSelectedTopicId] = useState(null);

    // State for UI
    const [loading, setLoading] = useState({ subjects: false, chapters: false, topics: false, questions: false });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    // --- Data Fetching Effects ---
    useEffect(() => {
        if (!selectedClassId) { setSubjects([]); return; }
        setLoading(prev => ({ ...prev, subjects: true }));
        apiCall(`${API_BASE_URL}/subjects/class/${selectedClassId}`)
            .then(setSubjects).catch(err => setNotification({ message: err.message, type: 'error' }))
            .finally(() => setLoading(prev => ({ ...prev, subjects: false })));
    }, [selectedClassId]);

    useEffect(() => {
        if (!selectedSubjectId) { setChapters([]); return; }
        setLoading(prev => ({ ...prev, chapters: true }));
        apiCall(`${API_BASE_URL}/chapters/subject/${selectedSubjectId}`)
            .then(setChapters).catch(err => setNotification({ message: err.message, type: 'error' }))
            .finally(() => setLoading(prev => ({ ...prev, chapters: false })));
    }, [selectedSubjectId]);

     useEffect(() => {
        if (!selectedChapterId) { setTopics([]); return; }
        setLoading(prev => ({ ...prev, topics: true }));
        apiCall(`${API_BASE_URL}/topics/chapter/${selectedChapterId}`)
            .then(setTopics).catch(err => setNotification({ message: err.message, type: 'error' }))
            .finally(() => setLoading(prev => ({ ...prev, topics: false })));
    }, [selectedChapterId]);

    useEffect(() => {
        if (!selectedTopicId) { setQuestions([]); return; }
        setLoading(prev => ({ ...prev, questions: true }));
        apiCall(`${API_BASE_URL}/questions/topic/${selectedTopicId}`)
            .then(setQuestions).catch(err => setNotification({ message: err.message, type: 'error' }))
            .finally(() => setLoading(prev => ({ ...prev, questions: false })));
    }, [selectedTopicId]);

    // --- Handlers ---
    const handleSelectClass = (id) => {
        setSelectedClassId(id);
        setSelectedSubjectId(null);
        setSelectedChapterId(null);
        setSelectedTopicId(null);
    };
    const handleSelectSubject = (id) => {
        setSelectedSubjectId(id);
        setSelectedChapterId(null);
        setSelectedTopicId(null);
    };
    const handleSelectChapter = (id) => {
        setSelectedChapterId(id);
        setSelectedTopicId(null);
    };
    const handleSelectTopic = (id) => setSelectedTopicId(id);

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        const itemType = item.name ? 'subjects' : item.chapterName ? 'chapters' : item.title ? 'topics' : 'questions';
        if (!window.confirm(`Are you sure you want to delete this ${itemType.slice(0, -1)}? This may also delete its children.`)) return;

        try {
            await apiCall(`${API_BASE_URL}/${itemType}/${item._id}`, { method: 'DELETE' });
            setNotification({ message: 'Item deleted successfully', type: 'success' });
            // Refresh the relevant list
            if (itemType === 'subjects') setSelectedClassId(prev => `${prev}`); // Trick to re-trigger useEffect
            if (itemType === 'chapters') setSelectedSubjectId(prev => `${prev}`);
            if (itemType === 'topics') setSelectedChapterId(prev => `${prev}`);
            if (itemType === 'questions') setSelectedTopicId(prev => `${prev}`);
        } catch (error) {
            setNotification({ message: error.message, type: 'error' });
        }
    };

    const handleSave = async (updatedItem) => {
        const itemType = updatedItem.name ? 'subjects' : updatedItem.chapterName ? 'chapters' : updatedItem.title ? 'topics' : 'questions';
        try {
            await apiCall(`${API_BASE_URL}/${itemType}/${updatedItem._id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedItem),
            });
            setNotification({ message: 'Item updated successfully', type: 'success' });
             // Refresh the relevant list
            if (itemType === 'subjects') setSelectedClassId(prev => `${prev}`);
            if (itemType === 'chapters') setSelectedSubjectId(prev => `${prev}`);
            if (itemType === 'topics') setSelectedChapterId(prev => `${prev}`);
            if (itemType === 'questions') setSelectedTopicId(prev => `${prev}`);
        } catch (error) {
            setNotification({ message: error.message, type: 'error' });
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
                <p className="mt-1 text-sm text-gray-500">Select an item to view, edit, or delete its contents.</p>
            </header>
            <Notification {...notification} onDismiss={() => setNotification({ message: '', type: '' })} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <EditableList title="Classes" data={initialClasses} onSelectItem={handleSelectClass} selectedId={selectedClassId} onEdit={handleEdit} onDelete={handleDelete} />
                <EditableList title="Subjects" data={subjects} onSelectItem={handleSelectSubject} selectedId={selectedSubjectId} loading={loading.subjects} onEdit={handleEdit} onDelete={handleDelete} />
                <EditableList title="Chapters" data={chapters} onSelectItem={handleSelectChapter} selectedId={selectedChapterId} loading={loading.chapters} onEdit={handleEdit} onDelete={handleDelete} />
                <EditableList title="Topics" data={topics} onSelectItem={handleSelectTopic} selectedId={selectedTopicId} loading={loading.topics} onEdit={handleEdit} onDelete={handleDelete} />
            </div>

            {selectedTopicId && (
                <div className="mt-6">
                     <EditableList title="Questions" data={questions} onSelectItem={() => {}} selectedId={null} loading={loading.questions} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
            )}

            <EditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={editingItem} onSave={handleSave} />
        </div>
    );
};