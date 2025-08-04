// app/admin/edit/page.tsx
import React from 'react';
import { cookies } from 'next/headers';
import { EditLayout } from '../../components/admin/EditLayout';

const getClasses = async () => {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (tokenCookie) {
        headers['Cookie'] = `token=${tokenCookie.value}`;
    }
    try {
        const res = await fetch('http://localhost:8000/api/admin/classes', { headers, cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch classes.');
        return res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default async function EditContentPage() {
    let initialClasses = [];
    let error = null;

    try {
        initialClasses = await getClasses();
    } catch (e: any) {
        error = e.message;
    }

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            {error ? (
                <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
                    <p className="font-bold">Could not load initial data.</p>
                    <p>{error}</p>
                </div>
            ) : (
                <EditLayout initialClasses={initialClasses} />
            )}
        </div>
    );
}