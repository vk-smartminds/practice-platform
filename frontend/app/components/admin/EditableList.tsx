// app/admin/edit/components/EditableList.tsx
"use client";
import React from 'react';
import { LoaderIcon } from '../ui/Icons'; // Reusing

// @ts-ignore
export const EditableList = ({ title, data, onSelectItem, onEdit, onDelete, selectedId, loading }) => {
    return (
        <div className="border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold p-4 border-b bg-gray-50 rounded-t-lg">{title}</h3>
            {loading ? (
                <div className="flex justify-center items-center p-8">
                    <LoaderIcon className="h-6 w-6 animate-spin text-indigo-600" />
                </div>
            ) : (
                <ul className="divide-y">
                    {/* @ts-ignore */}
                    {data.length > 0 ? data.map(item => (
                        <li 
                            key={item._id}
                            className={`flex items-center justify-between p-4 cursor-pointer hover:bg-indigo-50 ${selectedId === item._id ? 'bg-indigo-100' : ''}`}
                            onClick={() => onSelectItem(item._id)}
                        >
                            <span className="flex-grow text-gray-800">{item.name || item.chapterName || item.title || item.questionText}</span>
                            <div className="flex-shrink-0 space-x-2">
                                <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                                <button onClick={(e) => { e.stopPropagation(); onDelete(item); }} className="text-sm text-red-600 hover:text-red-900 font-medium">Delete</button>
                            </div>
                        </li>
                    )) : (
                        <li className="p-4 text-center text-gray-500">No items found.</li>
                    )}
                </ul>
            )}
        </div>
    );
};