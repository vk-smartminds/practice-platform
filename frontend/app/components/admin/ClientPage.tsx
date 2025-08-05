// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { ContentCard } from './ContentCard';
import { AddItemCard } from './AddItemCard';
import { ManagementModal } from './ManagementModal';
import { Notification } from '../ui/Notification';

const API_BASE_URL = 'http://localhost:8000/api/admin';

const apiCall = async (url, options = {}) => {
    const defaultOptions = { credentials: 'include', headers: { 'Content-Type': 'application/json' } };
    const res = await fetch(url, { ...defaultOptions, ...options });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }
    return res.status === 204 || (res.status === 200 && res.headers.get('content-length') === '0') ? null : res.json();
};

export const ClientPage = ({ title, items: initialItems, breadcrumbs, itemType, parentIds }) => {
    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ item: null, type: '' });
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => { setItems(initialItems); }, [initialItems]);

    const handleOpenModal = (type, item = null) => {
        setModalConfig({ type, item });
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalConfig({ item: null, type: '' });
    };

    const handleDelete = async (itemToDelete) => {
        const typePlural = `${itemType.toLowerCase()}s`;
        if (!window.confirm(`Are you sure you want to delete this ${itemType.toLowerCase()}? This may delete all content within it.`)) return;
        try {
            await apiCall(`${API_BASE_URL}/${typePlural}/${itemToDelete._id}`, { method: 'DELETE' });
            setItems(prev => prev.filter(i => i._id !== itemToDelete._id));
            setNotification({ message: `${itemType} deleted successfully.`, type: 'success' });
        } catch (error) {
            setNotification({ message: error.message, type: 'error' });
        }
    };

    const handleSave = async (formData, isEditing) => {
        const typePlural = `${itemType.toLowerCase()}s`;
        const url = isEditing ? `${API_BASE_URL}/${typePlural}/${formData._id}` : `${API_BASE_URL}/${typePlural}`;
        const method = isEditing ? 'PUT' : 'POST';
        const body = { ...formData, ...parentIds };

        try {
            const savedItem = await apiCall(url, { method, body: JSON.stringify(body) });
            if (isEditing) {
                setItems(prev => prev.map(i => (i._id === savedItem._id ? savedItem : i)));
            } else {
                setItems(prev => [...prev, savedItem]);
            }
            setNotification({ message: `${itemType} ${isEditing ? 'updated' : 'created'} successfully.`, type: 'success' });
            handleCloseModal();
        } catch (error) {
            setNotification({ message: error.message, type: 'error' });
        }
    };

    // --- THIS IS THE FIX ---
    // Determine the current base path from the last breadcrumb, or use the root path if no breadcrumbs exist.
    const currentPath = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].href : '/admin/manage';

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
            <Notification {...notification} onDismiss={() => setNotification({ message: '', type: '' })} />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {items.map(item => (
                    <ContentCard
                        key={item._id}
                        item={item}
                        // The new href is now constructed correctly
                        href={`${currentPath}/${item._id}`}
                        onEdit={() => handleOpenModal(itemType, item)}
                        onDelete={() => handleDelete(item)}
                    />
                ))}
                <AddItemCard itemType={itemType} onClick={() => handleOpenModal(itemType)} />
            </div>

            <ManagementModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} item={modalConfig.item} itemType={modalConfig.type} />
        </>
    );
};