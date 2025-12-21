"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, BookOpen, Activity, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalModules: 0,
        activeUsers: 0
    });

    useEffect(() => {
        // Mock stats for now, replace with API call later
        setStats({
            totalUsers: 12,
            totalModules: 5,
            activeUsers: 8
        });
    }, []);

    if (user?.role_id !== 1) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
                    <p className="text-slate-500">You do not have permission to view this page.</p>
                    <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 p-6 pb-24">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
                <p className="text-slate-500">Manage users, modules, and system settings.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Total Users</h3>
                    <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                            <BookOpen size={24} />
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">New</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Total Modules</h3>
                    <p className="text-3xl font-bold text-slate-900">{stats.totalModules}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                            <Activity size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">Now</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Active Users</h3>
                    <p className="text-3xl font-bold text-slate-900">{stats.activeUsers}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/admin/modules/new" className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <Plus size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Create New Module</h3>
                            <p className="text-sm text-slate-500">Add video content and interactive steps</p>
                        </div>
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                </Link>

                <Link href="/admin/users" className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 text-white p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Manage Users</h3>
                            <p className="text-sm text-slate-500">Add users and assign roles</p>
                        </div>
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                </Link>
            </div>
        </main>
    );
}
