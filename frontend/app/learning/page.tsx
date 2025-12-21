"use client";

import React, { useEffect, useState } from 'react';
import ResourceCard from '@/components/ResourceCard';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Mock fetcher
const fetchResources = async () => {
    // In real app: fetch('/api/v1/resources')
    return [
        {
            id: 1,
            title: "What is a Spring?",
            description: "Understanding the physics and basic definition of a spring.",
            resource_type: "article",
            content: "# What is a Spring?\nA spring is an elastic object that stores mechanical energy...",
            image_url: "https://placehold.co/600x400/2563eb/FFF?text=Spring+Physics"
        },
        {
            id: 2,
            title: "Types of Springs",
            description: "Overview of Compression, Extension, and Torsion springs.",
            resource_type: "article",
            content: "# Types of Springs\n## Compression Springs\n...",
            image_url: "https://placehold.co/600x400/16a34a/FFF?text=Spring+Types"
        },
        {
            id: 3,
            title: "Ranoson Official Website",
            description: "Visit our official website for more product details.",
            resource_type: "link",
            content: "https://ranoson.in",
            image_url: "https://placehold.co/600x400/ea580c/FFF?text=Ranoson+Website"
        }
    ];
};

export default function LearningPage() {
    const [resources, setResources] = useState<any[]>([]);
    const [selectedResource, setSelectedResource] = useState<any>(null);

    useEffect(() => {
        fetchResources().then(setResources);
    }, []);

    const handleResourceClick = (resource: any) => {
        if (resource.resource_type === 'link') {
            window.open(resource.content, '_blank');
        } else {
            setSelectedResource(resource);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 p-6 pb-24">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Learning Center</h1>
                <p className="text-slate-500">Explore articles, guides, and external resources.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((res) => (
                    <ResourceCard key={res.id} resource={res} onClick={handleResourceClick} />
                ))}
            </div>

            {/* Article Modal */}
            {selectedResource && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl border border-slate-200 flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">{selectedResource.title}</h2>
                            <button
                                onClick={() => setSelectedResource(null)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto prose prose-slate max-w-none">
                            {/* In a real app, use a proper Markdown renderer like react-markdown */}
                            <div className="whitespace-pre-wrap font-sans text-slate-600">
                                {selectedResource.content}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
