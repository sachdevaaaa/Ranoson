"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PlayCircle, Award, AlertCircle, User } from 'lucide-react';
import UserProfile from '@/components/UserProfile';

// Dynamically import the 3D component to avoid SSR issues with Canvas
const MachineExplorer = dynamic(() => import('@/components/MachineExplorer'), { ssr: false });

export default function Dashboard() {
  const [role, setRole] = useState("CNC Operator"); // Mock role
  const [modules, setModules] = useState<any[]>([]);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // In a real app, fetch from API
    // fetch('http://localhost:8000/api/v1/my-training')
    //   .then(res => res.json())
    //   .then(data => setModules(data))

    setModules([
      { id: 1, title: "Machine Safety Basics", status: "In Progress" },
      { id: 2, title: "Coiling Point Calibration", status: "Pending" },
    ]);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 pb-20">
      <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />

      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Hi, Ashok</h1>
          <span className="text-sm text-blue-400 font-medium bg-blue-400/10 px-2 py-1 rounded inline-block mt-1">
            {role}
          </span>
        </div>
        <button
          onClick={() => setShowProfile(true)}
          className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          <User size={20} className="text-slate-300" />
        </button>
      </header>

      <section className="mb-8">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Interactive Setup</h2>
        <MachineExplorer />
      </section>

      <section>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Assigned Training</h2>
        <div className="space-y-3">
          {modules.map((mod) => (
            <div key={mod.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 active:scale-95 transition-transform">
              <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500">
                <PlayCircle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{mod.title}</h3>
                <p className={`text-xs ${mod.status === 'In Progress' ? 'text-amber-400' : 'text-slate-500'}`}>
                  {mod.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Bottom Nav mock */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur border-t border-slate-800 p-4 flex justify-around text-slate-400">
        <div className="flex flex-col items-center text-blue-500">
          <PlayCircle size={24} />
          <span className="text-[10px] mt-1 font-medium">Learn</span>
        </div>
        <div className="flex flex-col items-center">
          <Award size={24} />
          <span className="text-[10px] mt-1 font-medium">Certificates</span>
        </div>
      </nav>
    </main>
  );
}
