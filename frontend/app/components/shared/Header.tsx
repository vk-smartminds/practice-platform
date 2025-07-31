// app/components/shared/Header.tsx
'use client';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          ShivArth
        </Link>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              {currentUser.role === 'student' && (
                <>
                  <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    👨‍🎓 {currentUser.name} (Class {currentUser.class})
                  </span>
                  <Link href="/student/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
                </>
              )}
               {currentUser.role === 'admin' && (
                <>
                  <span className="text-sm font-medium bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    👨‍💼 {currentUser.name} (Admin)
                  </span>
                   <Link href="/admin/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
                </>
              )}
              <button onClick={logout} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm">
                Logout
              </button>
            </>
          ) : (
             <Link href="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}