// app/admin/edit/components/EditModal.tsx
// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { CustomInput } from '../ui/CustomInput'; // Reusing from dashboard
import { LoaderIcon } from '../ui/Icons'; // Reusing from dashboard

export const EditModal = ({ item, isOpen, onClose, onSave }) => {
    if (!isOpen || !item) return null;

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    // When the modal opens, populate the form with the item's data
    useEffect(() => {
        setFormData(item);
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        await onSave(formData);
        setLoading(false);
        onClose();
    };

    const renderFormFields = () => {
        // Dynamically create form fields based on the item's properties
        if (item.name) return <CustomInput label="Subject Name" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Enter subject name" />;
        if (item.chapterName) return <CustomInput label="Chapter Name" name="chapterName" value={formData.chapterName || ''} onChange={handleChange} placeholder="Enter chapter name" />;
        if (item.title) return <CustomInput label="Topic Title" name="title" value={formData.title || ''} onChange={handleChange} placeholder="Enter topic title" />;
        if (item.questionText) return (
            <div className="space-y-4">
                <CustomInput as="textarea" label="Question" name="questionText" value={formData.questionText || ''} onChange={handleChange} placeholder="Enter question" />
                <CustomInput as="textarea" label="Answer" name="answerText" value={formData.answerText || ''} onChange={handleChange} placeholder="Enter answer" />
                <CustomInput as="textarea" label="Explanation" name="explanation" value={formData.explanation || ''} onChange={handleChange} placeholder="Enter explanation" required={false} />
            </div>
        );
        return <p>No editable fields found.</p>;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Content</h3>
                <div className="space-y-4">
                    {renderFormFields()}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center">
                        {loading && <LoaderIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};