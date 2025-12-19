"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [employeeCode, setEmployeeCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // In real implementation:
        // const res = await fetch('http://localhost:8000/api/v1/auth/login', ...)
        // if ok, store token and redirect

        // Mock Logic
        if (employeeCode && password) {
            // Assume success
            alert("Login Successful! (Token stored)");
            router.push('/');
        } else {
            setError("Please enter all fields");
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <div className="h-12 w-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">R</div>
                    <h1 className="text-2xl font-bold text-white">Employee Login</h1>
                    <p className="text-slate-400">Ranoson Springs LMS</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Employee Code</label>
                        <input
                            type="text"
                            value={employeeCode}
                            onChange={(e) => setEmployeeCode(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="e.g. EMP001"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    First time here? <Link href="/register" className="text-blue-400 hover:underline">Activate Account</Link>
                </div>
            </div>
        </main>
    );
}
