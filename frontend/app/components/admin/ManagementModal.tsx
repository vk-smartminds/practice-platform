
"use client";
import React, { useState, useEffect } from 'react';
import { CustomInput } from '../ui/CustomInput';
import { LoaderIcon } from '../ui/Icons';

export const ManagementModal = ({ isOpen, onClose, onSave, item, itemType }: any) => {
    if (!isOpen) return null;

    type FormDataType = {
        name?: string;
        chapterName?: string;
        chapterNumber?: string | number;
        title?: string;
        topicNumber?: string | number;
        questionText?: string;
        answerText?: string;
        explanation?: string;
        [key: string]: any;
    };
    const [formData, setFormData] = useState<FormDataType>({});
    const [loading, setLoading] = useState(false);

    const isEditing = !!item;
    const currentItemType = isEditing ? (item.name ? 'Class' : item.chapterName ? 'Chapter' : item.title ? 'Topic' : 'Question') : itemType;

    useEffect(() => { setFormData(isEditing ? item : {}); }, [item, isEditing, isOpen]);
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSave = async () => {
        setLoading(true);
        await onSave(formData, isEditing);
        setLoading(false);
    };

    const renderFields = () => {
        switch (currentItemType) {
            case 'Class': return <CustomInput label="Class Name" name="name" value={formData.name || ''} onChange={handleChange} />;
            case 'Subject': return <CustomInput label="Subject Name" name="name" value={formData.name || ''} onChange={handleChange} />;
            case 'Chapter': return <><CustomInput label="Chapter Name" name="chapterName" value={formData.chapterName || ''} onChange={handleChange} /><CustomInput label="Chapter Number" name="chapterNumber" type="number" value={formData.chapterNumber || ''} onChange={handleChange} /></>;
            case 'Topic': return <><CustomInput label="Topic Title" name="title" value={formData.title || ''} onChange={handleChange} /><CustomInput label="Topic Number" name="topicNumber" value={formData.topicNumber || ''} onChange={handleChange} /></>;
            case 'Question': return <><CustomInput as="textarea" label="Question" name="questionText" value={formData.questionText || ''} onChange={handleChange} /><CustomInput as="textarea" label="Answer" name="answerText" value={formData.answerText || ''} onChange={handleChange} /><CustomInput as="textarea" label="Explanation" name="explanation" value={formData.explanation || ''} onChange={handleChange} required={false} /></>;
            default: return <p>Cannot determine item type.</p>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{isEditing ? `Edit ${currentItemType}` : `Add New ${currentItemType}`}</h3>
                <div className="space-y-4">{renderFields()}</div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center">
                        {loading && <LoaderIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />} Save </button>
                </div>
            </div>
        </div>
    );
};