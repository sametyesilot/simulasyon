"use client";
import { useState, useEffect, useRef } from 'react';
import { getRun, getRunLogs, getRunMetrics } from '../../lib/api';
import Link from 'next/link';

export default function RunPage({ params }: { params: { id: string } }) {
    const [run, setRun] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>({});
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const r = await getRun(params.id);
                setRun(r);
                const l = await getRunLogs(params.id);
                setLogs(l);
                const m = await getRunMetrics(params.id);
                setMetrics(m);
            } catch (e) {
                console.error("Polling failed", e);
            }
        }, 2000); // Poll every 2s

        return () => clearInterval(interval);
    }, [params.id]);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    if (!run) return <div className="p-8">Loading Simulation...</div>;

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto bg-gray-50 flex flex-col h-screen">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Link href="/" className="text-blue-600 hover:underline">← Back to Catalog</Link>
                    <h1 className="text-2xl font-bold mt-2">Simulation Run: {run.scenarioId}</h1>
                    <p className="text-sm text-gray-500">Status: <span className={run.status === 'RUNNING' ? 'text-green-600 font-bold' : 'text-gray-600'}>{run.status}</span> | ID: {run.runId}</p>
                </div>
                <button onClick={() => window.location.reload()} className="px-4 py-2 border rounded bg-white">Refresh</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                {/* Metrics Panel */}
                <div className="col-span-1 bg-white p-4 rounded shadow overflow-y-auto">
                    <h3 className="font-semibold mb-4 border-b pb-2">Live Metrics</h3>
                    {Object.keys(metrics).length === 0 && <p className="text-gray-400">No metrics yet...</p>}
                    <div className="space-y-4">
                        {Object.entries(metrics).map(([key, vals]: [string, any]) => {
                            const latest = vals[vals.length - 1];
                            return (
                                <div key={key} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                    <span className="font-mono text-sm">{key}</span>
                                    <span className="text-xl font-bold text-indigo-600">{Number(latest.value).toFixed(2)}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Logs Panel */}
                <div className="col-span-2 bg-black text-green-400 p-4 rounded shadow font-mono text-sm overflow-y-auto flex flex-col">
                    <h3 className="text-gray-400 border-b border-gray-700 pb-2 mb-2">System Logs</h3>
                    <div className="flex-1 overflow-y-auto">
                        {logs.length === 0 && <p className="opacity-50">Initializing...</p>}
                        {logs.map((log, i) => (
                            <div key={i} className="mb-1">
                                <span className="opacity-50">[{new Date(log.timestamp * 1000).toLocaleTimeString()}]</span>
                                <span className={`ml-2 ${log.level === 'ERROR' ? 'text-red-500' : log.level === 'WARN' ? 'text-yellow-500' : 'text-green-400'}`}>
                                    [{log.level}]
                                </span>
                                <span className="ml-2">{log.message}</span>
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}
