"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ModulePlayer from '@/components/ModulePlayer';
import CommentSection from '@/components/CommentSection';

import { useAuth } from '@/context/AuthContext';

export default function ModulePage() {
    const params = useParams();
    const { token } = useAuth();
    const [module, setModule] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);

    useEffect(() => {
        const fetchModuleData = async () => {
            if (!params.id || !token) return;
            try {
                const res = await fetch(`http://localhost:8000/api/v1/modules/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setModule(data);
                } else {
                    console.error("Failed to load module");
                }
            } catch (err) {
                console.error("Error loading module:", err);
            }
        };
        fetchModuleData();
    }, [params.id, token]);

    const handleStepSubmit = async (stepId: number, value: string) => {
        // Mock API call
        console.log(`Submitting step ${stepId}: ${value}`);

        // Simulate backend validation logic
        const step = module.steps.find((s: any) => s.id === stepId);
        if (step && step.assignment) {
            const correct = parseFloat(step.assignment.correct_value);
            const userVal = parseFloat(value);
            const tolerance = step.assignment.tolerance;

            const passed = Math.abs(userVal - correct) <= tolerance;
            return {
                passed,
                message: passed ? "Correct! Good job." : `Incorrect. Expected ${correct} ± ${tolerance}`
            };
        }
        return { passed: true, message: "Done" };
    };

    const handleAddComment = async (text: string) => {
        const newComment = {
            id: Date.now(),
            text,
            user_id: 123,
            created_at: new Date().toISOString()
        };
        setComments([...comments, newComment]);
    };

    if (!module) return <div className="text-white p-8">Loading module...</div>;

    return (
        <main className="min-h-screen bg-slate-950 p-6 pb-20">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">{module.title}</h1>
                <p className="text-slate-400">{module.description}</p>
            </header>

            <ModulePlayer steps={module.steps} videoUrl={module.video_url} onStepSubmit={handleStepSubmit} />

            <CommentSection moduleId={module.id} comments={comments} onAddComment={handleAddComment} />
        </main>
    );
}
