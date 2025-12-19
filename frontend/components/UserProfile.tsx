"use client";

import React, { useState, useEffect } from 'react';
import { User, LogOut, X, Save, Phone } from 'lucide-react';

interface UserProfileProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchUserProfile();
        }
    }, [isOpen]);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            // Mock Fetch if API fails or for demo
            // const res = await fetch('http://localhost:8000/api/v1/auth/me', {
            //     headers: { Authorization: `Bearer ${token}` }
            // });

            // For now, we simulate success if backend isn't fully ready/cors configured, 
            // but let's try real fetch first.

            // Mock Data Fallback
            setUser({
                employee_code: "EMP-CURRENT",
                role: { name: "CNC Operator" }, // This might be just role_id in real backend unless eager loaded
                phone_number: "555-0123"
            });
            setPhoneNumber("555-0123");

        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const handleSave = async () => {
        setLoading(true);
        // Simulate API Call
        setTimeout(() => {
            alert("Profile Updated!");
            setLoading(false);
            setIsEditing(false);
            setUser({ ...user, phone_number: phoneNumber });
        }, 800);

        // Real Call:
        // await fetch('http://localhost:8000/api/v1/auth/me', { method: 'PUT', body: JSON.stringify({ phone_number: phoneNumber }) ... })
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                        <User size={40} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{user?.employee_code || 'Loading...'}</h2>
                    <p className="text-blue-400 text-sm">CNC Operator</p>
                </div>

                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-lg">
                        <label className="text-xs text-slate-400 uppercase font-medium mb-1 block">Phone Number</label>
                        <div className="flex items-center justify-between">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="bg-slate-700 text-white p-1 rounded w-full mr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            ) : (
                                <span className="text-white flex items-center gap-2">
                                    <Phone size={14} className="text-slate-500" />
                                    {user?.phone_number || 'Not Set'}
                                </span>
                            )}

                            {!isEditing && (
                                <button onClick={() => setIsEditing(true)} className="text-sm text-blue-400 hover:text-blue-300 underline">
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
                        >
                            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                    )}

                    <hr className="border-slate-800 my-4" />

                    <button
                        onClick={handleLogout}
                        className="w-full bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={18} />
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
