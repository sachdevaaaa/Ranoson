"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Home, BookOpen, User, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const { user } = useAuth();
    const pathname = usePathname();

    // Hide navigation on login page
    if (pathname === '/login') return null;

    // Assuming role_id 1 is Admin
    const isAdmin = user?.role_id === 1;

    const isActive = (path: string) => pathname === path ? "text-blue-600" : "text-slate-500 hover:text-blue-500";

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 flex justify-around items-center z-50 safe-area-bottom shadow-lg shadow-slate-200/50">
            <Link href="/" className={`flex flex-col items-center transition-colors ${isActive('/')}`}>
                <Home size={24} />
                <span className="text-[10px] font-medium mt-1">Home</span>
            </Link>

            <Link href="/learning" className={`flex flex-col items-center transition-colors ${isActive('/learning')}`}>
                <BookOpen size={24} />
                <span className="text-[10px] font-medium mt-1">Learning</span>
            </Link>

            {isAdmin && (
                <Link href="/admin" className={`flex flex-col items-center transition-colors ${isActive('/admin')}`}>
                    <Settings size={24} />
                    <span className="text-[10px] font-medium mt-1">Admin</span>
                </Link>
            )}

            <Link href="#" className={`flex flex-col items-center transition-colors ${isActive('/profile')}`}>
                <User size={24} />
                <span className="text-[10px] font-medium mt-1">Profile</span>
            </Link>
        </nav>
    );
}
