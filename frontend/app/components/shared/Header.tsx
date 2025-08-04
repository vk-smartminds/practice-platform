// app/components/shared/Header.tsx
'use client';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-[#58cc02] font-bold uppercase text-2xl">
        {/* bg-[#58cc02] text-white border-b-4 border-[#48a302] font-bold uppercase px-10 py-4 rounded-2xl inline-block text-lg transition-all hover:bg-[#62d602] hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 */}
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
              <button onClick={logout} className="bg-white text-[#58cc02] border-2 border-[#e5e5e5] border-b-4 font-bold uppercase px-6 py-3 rounded-2xl text-sm transition-all hover:bg-[#f7f7f7]">
                Logout
              </button>
            </>
          ) : (
             <Link href="/login" className="bg-white text-[#58cc02] border-2 border-[#e5e5e5] border-b-4 font-bold uppercase px-6 py-3 rounded-2xl text-sm transition-all hover:bg-[#f7f7f7]">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}