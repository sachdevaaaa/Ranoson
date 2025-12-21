"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ModulePlayer from '@/components/ModulePlayer';
import CommentSection from '@/components/CommentSection';

// Mock data fetcher (replace with API calls)
const fetchModule = async (id: string) => {
    // In real app: fetch(`/api/v1/modules/${id}`)
    return {
        id: parseInt(id),
        title: "Spring Measurement Basics",
        description: "Learn how to accurately measure spring length using digital calipers.",
        steps: [
            {
                id: 1,
                title: "Prepare the Caliper",
                content: "Ensure the digital caliper is zeroed out before starting. Close the jaws completely and press the 'Zero' button.",
                step_type: "instruction",
                media_url: "https://placehold.co/600x400/000000/FFF?text=Zero+Caliper"
            },
            {
                id: 2,
                title: "Measure Free Length",
                content: "Place the spring between the jaws. Gently close the jaws until they touch the spring ends. Do not compress the spring.",
                step_type: "action",
                media_url: "https://placehold.co/600x400/000000/FFF?text=Measure+Spring"
            },
            {
                id: 3,
                title: "Record Measurement",
                content: "Read the value on the display. The expected length is 15.0 cm.",
                step_type: "question",
                assignment: {
                    question_text: "Enter the measured length:",
                    correct_value: "15.0",
                    tolerance: 0.2,
                    unit: "cm"
                }
            }
        ]
    };
};

export default function ModulePage() {
    const params = useParams();
    const [module, setModule] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);

    useEffect(() => {
        if (params.id) {
            fetchModule(params.id as string).then(setModule);
        }
    }, [params.id]);

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

            <ModulePlayer steps={module.steps} onStepSubmit={handleStepSubmit} />

            <CommentSection moduleId={module.id} comments={comments} onAddComment={handleAddComment} />
        </main>
    );
}
