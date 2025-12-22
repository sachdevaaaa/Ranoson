"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Plus, Search, Shield, Trash2 } from 'lucide-react';

interface UserData {
    id: number;
    employee_code: string;
    role_id: number;
    is_active: boolean;
}

export default function UserManagement() {
    const { token } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [newEmployeeCode, setNewEmployeeCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRoleId, setNewRoleId] = useState(3); // Default to Operator

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            // In a real app, this would be a dedicated endpoint
            // For MVP, we might need to add this endpoint or mock it if not available
            // Let's assume GET /api/v1/users exists for admins
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
            const res = await fetch(`${apiUrl}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
            const res = await fetch(`${apiUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    employee_code: newEmployeeCode,
                    password: newPassword,
                    role_id: newRoleId
                })
            });

            if (res.ok) {
                setShowAddModal(false);
                setNewEmployeeCode("");
                setNewPassword("");
                fetchUsers();
            } else {
                alert("Failed to create user");
            }
        } catch (error) {
            console.error("Error creating user", error);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 p-6 pb-24">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
                    <p className="text-slate-500">Add and manage system users.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-blue-200"
                >
                    <Plus size={20} /> Add User
                </button>
            </header>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search users..."
                    className="flex-1 outline-none text-slate-700 placeholder:text-slate-400"
                />
            </div>

            {/* Users List */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Employee</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                                            <User size={20} />
                                        </div>
                                        <span className="font-medium text-slate-900">{user.employee_code}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Shield size={16} className="text-blue-500" />
                                        <span className="text-slate-600 text-sm">
                                            {user.role_id === 1 ? 'Admin' : user.role_id === 2 ? 'Quality Check' : 'Operator'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-slate-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && !loading && (
                    <div className="p-8 text-center text-slate-500">No users found.</div>
                )}
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Add New User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Employee Code</label>
                                <input
                                    type="text"
                                    value={newEmployeeCode}
                                    onChange={(e) => setNewEmployeeCode(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select
                                    value={newRoleId}
                                    onChange={(e) => setNewRoleId(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value={1}>Admin</option>
                                    <option value={2}>Quality Check</option>
                                    <option value={3}>CNC Operator</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-slate-100 text-slate-600 font-medium py-3 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
