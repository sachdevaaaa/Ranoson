"use client";

import React, { useState, useEffect } from 'react';
import { Upload, Users, BarChart3, CheckCircle, Clock, User } from 'lucide-react';
import UserProfile from '@/components/UserProfile';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'upload' | 'progress' | 'users'>('upload');
    const [modules, setModules] = useState<any[]>([]);
    const [usersProgress, setUsersProgress] = useState<any[]>([]);
    const [showProfile, setShowProfile] = useState(false);
    const [users, setUsers] = useState<any[]>([
        { id: 1, employee_code: "EMP001", role: "CNC Operator", status: "Active" },
        { id: 2, employee_code: "EMP005", role: "Quality Inspector", status: "Pending Registration" },
    ]);

    // Mock data fetching triggers
    useEffect(() => {
        if (activeTab === 'progress') {
            fetchUsersProgress();
        }
    }, [activeTab]);

    const fetchUsersProgress = async () => {
        // In real implementation: 
        // const res = await fetch('http://localhost:8000/api/v1/admin/progress');
        // const data = await res.json();

        // Mock Data for Demo
        setUsersProgress([
            {
                id: 1,
                employee_code: "EMP001",
                role_id: 1,
                progress: [
                    { module_id: 1, status: "Completed" },
                    { module_id: 2, status: "In Progress" }
                ]
            },
            {
                id: 2,
                employee_code: "EMP002",
                role_id: 1,
                progress: []
            }
        ]);
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Module Created (Mock)");
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        alert("User Whitelisted! (Mock)");
        // Add to users list
        setUsers([...users, { id: 3, employee_code: "EMP999", role: "CNC Operator", status: "Pending Registration" }]);
    };

    const handleRemoveUser = (id: number) => {
        if (confirm("Revoke access for this user?")) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Users className="text-blue-500" />
                        Admin Portal
                    </h1>
                    <button
                        onClick={() => setShowProfile(true)}
                        className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 hover:bg-slate-700 transition-colors ml-4"
                    >
                        <User size={20} className="text-slate-300" />
                    </button>
                </div>
                <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'upload' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        Upload Content
                    </button>
                    <button
                        onClick={() => setActiveTab('progress')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'progress' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        Progress
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'users' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        Manage Users
                    </button>
                </div>
            </header>

            {activeTab === 'upload' && (
                <section className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Upload size={20} className="text-orange-500" />
                        Publish New Training Module
                    </h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Module Title</label>
                            <input type="text" placeholder="e.g., Advanced Coiling Techniques" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Video Endpoint URL</label>
                            <input type="url" placeholder="https://storage.ranoson.com/..." className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Assign to Role</label>
                            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500">
                                <option>CNC Operator</option>
                                <option>Quality Inspector</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition-colors mt-4">
                            Publish Module
                        </button>
                    </form>
                </section>
            )}

            {activeTab === 'progress' && (
                <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-slate-800">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <BarChart3 size={20} className="text-green-500" />
                            Employee Performance Overview
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-950 text-slate-200 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Employee ID</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Modules Completed</th>
                                    <th className="px-6 py-4">Recent Activity</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {usersProgress.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{user.employee_code}</td>
                                        <td className="px-6 py-4">CNC Operator</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-slate-700 rounded-full h-2 max-w-[100px]">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full"
                                                        style={{ width: `${(user.progress.filter((p: any) => p.status === 'Completed').length / 2) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span>{user.progress.filter((p: any) => p.status === 'Completed').length}/2</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {user.progress.length > 0 ? 'Accessed recently' : 'No activity'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.progress.some((p: any) => p.status === 'Completed') ?
                                                <span className="flex items-center gap-1 text-green-400"><CheckCircle size={14} /> Active</span> :
                                                <span className="flex items-center gap-1 text-slate-500"><Clock size={14} /> Pending</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {activeTab === 'users' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <section className="md:col-span-1 bg-slate-900 p-6 rounded-xl border border-slate-800 h-fit">
                        <h2 className="text-lg font-bold mb-4">Whitelist New Employee</h2>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <input type="text" placeholder="Employee ID (e.g. EMP005)" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" />
                            <select className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white">
                                <option>CNC Operator</option>
                                <option>Quality Inspector</option>
                                <option>Admin</option>
                            </select>
                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded">
                                Add to Whitelist
                            </button>
                        </form>
                    </section>

                    <section className="md:col-span-2 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-lg font-bold">Authorized Personnel</h2>
                        </div>
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-950 text-slate-200 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-mono text-white">{u.employee_code}</td>
                                        <td className="px-6 py-4">{u.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs border ${u.status === 'Active' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-amber-500/10 border-amber-500/50 text-amber-400'}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleRemoveUser(u.id)} className="text-red-400 hover:text-red-300 hover:underline">Revoke</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            )}
        </main>
    );
}
