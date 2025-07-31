// app/(admin)/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import AdminQuestionForm from '../../components/admin/AdminQuestionForm';
import AdminQuestionList from '../../components/admin/AdminQuestionList';

type AdminTab = 'create' | 'manage';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('create');
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This is an authorization guard.
    // It ensures that only logged-in admins can see this page.
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Render nothing or a loading spinner while we wait for the auth check.
  if (!currentUser) {
    return null;
  }

  const tabClass = (tabName: AdminTab) =>
    `px-6 py-3 font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none ${
      activeTab === tabName
        ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
        : 'bg-transparent text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Admin Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-300 mb-6">
        <nav className="-mb-px flex space-x-2" aria-label="Tabs">
          <button onClick={() => setActiveTab('create')} className={tabClass('create')}>
            Create Question
          </button>
          <button onClick={() => setActiveTab('manage')} className={tabClass('manage')}>
            Manage Questions
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'create' ? <AdminQuestionForm /> : <AdminQuestionList />}
      </div>
    </div>
  );
}