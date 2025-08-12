// app/components/shared/Header.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { UserIcon } from '../ui/Icons';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to close the dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="bg-[#F7FAFC]/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo and Brand Name */}
        <Link href="/" className="flex items-center space-x-3">
          <Image 
            src="/logo.png" // Corrected logo path
            alt="Shivarth Logo" 
            width={50} 
            height={50} 
          />
          <span className="text-2xl font-bold text-[#553C9A]">SHIVARTH</span>
        </Link>

        {/* Navigation Links and User Status */}
        <div className="flex items-center space-x-6">
          {currentUser ? (
            // --- VIEW WHEN LOGGED IN ---
            <>
              {currentUser.role === 'student' && (
                <>
                  <Link href="/student/dashboard" className="text-sm font-medium text-[#2D3748]/80 hover:text-[#2D3748] transition-colors">
                    Dashboard
                  </Link>
                  <span className="hidden sm:block text-sm text-[#2D3748]">
                    Welcome, {currentUser.name}
                  </span>
                </>
              )}
              {currentUser.role === 'admin' && (
                <>
                  <Link href="/admin/dashboard" className="text-sm font-medium text-[#2D3748]/80 hover:text-[#2D3748] transition-colors">
                    Admin Dashboard
                  </Link>
                  <span className="hidden sm:block text-sm font-medium bg-[#553C9A]/10 text-[#553C9A] px-3 py-1 rounded-full">
                    Admin Mode
                  </span>
                </>
              )}
              {/* <button 
                onClick={logout} 
                className="bg-gray-200 text-[#2D3748] px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm"
              >
                Logout
              </button> */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#553C9A] transition-all"
                >
                  <UserIcon className="w-6 h-6 text-[#2D3748]" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm text-[#2D3748]">Signed in as</p>
                      <p className="text-sm font-medium text-[#2D3748] truncate">{currentUser.email}</p>
                    </div>
                    
                    {currentUser.role === 'student' && (
                      <>
                        <Link href="/student/profile" className="block w-full text-left px-4 py-2 text-sm text-[#2D3748] hover:bg-gray-100">
                          Profile
                        </Link>
                      </>
                    )}
                    <Link href="/settings" className="block w-full text-left px-4 py-2 text-sm text-[#2D3748] hover:bg-gray-100">
                      Settings
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // --- VIEW WHEN LOGGED OUT ---
            <>
              <nav className="hidden md:flex space-x-8 items-center">
                <a href="/#features" className="text-[#2D3748]/80 hover:text-[#2D3748] transition-colors">Features</a>
                <a href="/#about" className="text-[#2D3748]/80 hover:text-[#2D3748] transition-colors">About</a>
              </nav>
              <Link 
                href="/login" 
                className="bg-[#38B2AC] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#319795] transition-all shadow-sm hover:shadow-md"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}