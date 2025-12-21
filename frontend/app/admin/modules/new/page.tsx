"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Trash2, Save, Video, List, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateModule() {
    const { token } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [steps, setSteps] = useState<any[]>([]);

    const addStep = () => {
        setSteps([...steps, {
            title: "",
            content: "",
            step_type: "instruction",
            order_index: steps.length + 1,
            assignment: null
        }]);
    };

    const updateStep = (index: number, field: string, value: any) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const removeStep = (index: number) => {
        const newSteps = steps.filter((_, i) => i !== index);
        // Reorder
        newSteps.forEach((step, i) => step.order_index = i + 1);
        setSteps(newSteps);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                title,
                description,
                video_url: videoUrl,
                steps: steps
            };

            const res = await fetch('http://localhost:4800/api/v1/modules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/admin');
            } else {
                alert("Failed to create module");
            }
        } catch (error) {
            console.error("Error creating module", error);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 p-6 pb-24">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Module</h1>
                <p className="text-slate-500">Design a training module with video and interactive steps.</p>
            </header>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                {/* Basic Info */}
                <section className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Video className="text-blue-500" /> Module Details
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Module Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g. Spring Manufacturing Basics"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors h-24 resize-none"
                                placeholder="Brief overview of the module..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Video URL (MP4)</label>
                            <input
                                type="url"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                placeholder="https://example.com/video.mp4"
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Steps Builder */}
                <section className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <List className="text-purple-500" /> Interactive Steps
                        </h2>
                        <button
                            type="button"
                            onClick={addStep}
                            className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                        >
                            + Add Step
                        </button>
                    </div>

                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                                <button
                                    type="button"
                                    onClick={() => removeStep(index)}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Step Title</label>
                                        <input
                                            type="text"
                                            value={step.title}
                                            onChange={(e) => updateStep(index, 'title', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
                                            placeholder="Step Title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                                        <select
                                            value={step.step_type}
                                            onChange={(e) => updateStep(index, 'step_type', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
                                        >
                                            <option value="instruction">Instruction</option>
                                            <option value="action">Action</option>
                                            <option value="question">Question</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Content (Markdown)</label>
                                    <textarea
                                        value={step.content}
                                        onChange={(e) => updateStep(index, 'content', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 h-20 resize-none"
                                        placeholder="Step instructions..."
                                    />
                                </div>
                            </div>
                        ))}

                        {steps.length === 0 && (
                            <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                                No steps added yet. Click "Add Step" to begin.
                            </div>
                        )}
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all transform active:scale-[0.98]"
                    >
                        <Save size={20} /> Save Module
                    </button>
                </div>
            </form>
        </main>
    );
}
