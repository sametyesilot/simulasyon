"use client";
import { useState, useEffect } from 'react';
import { fetchScenarios, createRun } from './lib/api';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [scenarios, setScenarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPerson, setSelectedPerson] = useState<string>('All');
    const router = useRouter();

    useEffect(() => {
        fetchScenarios().then(data => {
            setScenarios(data);
            setLoading(false);
        }).catch(err => console.error(err));
    }, []);

    const people = ['All', ...Array.from(new Set(scenarios.map(s => s.personName)))];

    const handleStartRun = async (scenarioId: string) => {
        try {
            const run = await createRun(scenarioId, {});
            router.push(`/runs/${run.runId}`);
        } catch (e) {
            alert("Failed to start run");
        }
    };

    const filtered = selectedPerson === 'All' ? scenarios : scenarios.filter(s => s.personName === selectedPerson);

    return (
        <main className="min-h-screen p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                    EVCS Anomaly Platform
                </h1>
                <div className="flex gap-4">
                    <Link href="/developer" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
                        Developer Mode
                    </Link>
                </div>
            </div>

            <div className="mb-6">
                <label className="mr-2 font-semibold">Filter by Person:</label>
                <select
                    className="p-2 border rounded"
                    value={selectedPerson}
                    onChange={(e) => setSelectedPerson(e.target.value)}
                >
                    {people.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            {loading ? <p>Loading catalog...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(s => (
                        <div key={s.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
                                    {s.category}
                                </span>
                                <span className="text-xs text-gray-500">{s.personName}</span>
                            </div>
                            <h2 className="text-xl font-semibold mb-2">{s.anomalyTitle}</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 h-20 overflow-y-auto">
                                {s.description}
                            </p>

                            <div className="mb-4 text-xs text-gray-500">
                                <strong>Indicators:</strong> {s.indicator}
                            </div>

                            <button
                                onClick={() => handleStartRun(s.id)}
                                className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                            >
                                Start Simulation
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

import Link from 'next/link';
