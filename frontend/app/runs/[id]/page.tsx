"use client";
import { useState, useEffect, useRef } from 'react';
import { getRun, getRunLogs, getRunMetrics } from '../../lib/api';
import Link from 'next/link';

export default function RunPage({ params }: { params: { id: string } }) {
    const [run, setRun] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>({});
    const logsEndRef = useRef<HTMLDivElement>(null);
    const [isHacked, setIsHacked] = useState(false);
    const [attackType, setAttackType] = useState("");

    // Tehlikeli kelimeler listesi
    const DANGER_KEYWORDS = [
        "CRITICAL", "ATTACK", "VULNERABILITY", "INJECTION",
        "MALICIOUS", "THEFT", "MANIPULATION", "BYPASS",
        "UNKNOWN", "UNAUTHORIZED", "BACKDOOR"
    ];

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const r = await getRun(params.id);
                setRun(r);
                const l = await getRunLogs(params.id);
                setLogs(l);
                const m = await getRunMetrics(params.id);
                setMetrics(m);

                // Saldırı tespiti
                const lastLogs = l.slice(-5); // Son 5 logu kontrol et
                for (const log of lastLogs) {
                    if (DANGER_KEYWORDS.some(kw => log.message.toUpperCase().includes(kw))) {
                        setIsHacked(true);
                        // Attack tipini bulmaya çalış
                        if (log.message.includes("SQL")) setAttackType("SQL INJECTION");
                        else if (log.message.includes("DDoS")) setAttackType("DDoS ATTACK");
                        else if (log.message.includes("command")) setAttackType("COMMAND INJECTION");
                        else setAttackType("SYSTEM BREACH");
                    }
                }
            } catch (e) {
                console.error("Polling failed", e);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [params.id]);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    if (!run) return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-green-400 font-mono">
            <div className="text-center">
                <div className="animate-spin text-4xl mb-4">⚙️</div>
                <p>INITIALIZING SIMULATION ENVIRONMENT...</p>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen p-4 md:p-8 flex flex-col h-screen transition-colors duration-500 ${isHacked ? 'bg-red-950' : 'bg-gray-100 dark:bg-gray-900'
            }`}>
            {/* Alarm Overlay */}
            {isHacked && (
                <div className="fixed top-0 left-0 w-full h-2 bg-red-600 animate-pulse z-50"></div>
            )}

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/" className="text-blue-500 hover:text-blue-400 font-mono text-sm transition-colors">
                        ← RETURN TO COMMAND CENTER
                    </Link>
                    <div className="flex items-center gap-3 mt-2">
                        <h1 className={`text-3xl font-bold font-mono ${isHacked ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
                            {isHacked ? `⚠️ ${attackType} DETECTED` : `RUN: ${run.scenarioId}`}
                        </h1>
                        <span className={`px-3 py-1 rounded text-xs font-bold tracking-wider ${run.status === 'RUNNING'
                            ? (isHacked ? 'bg-red-600 text-white animate-pulse' : 'bg-green-600 text-white')
                            : 'bg-gray-600 text-white'
                            }`}>
                            {run.status}
                        </span>
                    </div>
                </div>

                {isHacked && (
                    <div className="bg-red-900 border border-red-500 text-red-100 px-6 py-3 rounded animate-bounce shadow-lg shadow-red-900/50">
                        <p className="font-bold text-lg">🚨 SECURITY ALERT</p>
                        <p className="text-sm">Unauthorized activity detected!</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden min-h-0">
                {/* Metrics Panel */}
                <div className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            📊 Live Telemetry
                        </h3>
                    </div>
                    <div className="p-4 overflow-y-auto space-y-6 flex-1">
                        {Object.keys(metrics).length === 0 && (
                            <div className="text-center text-gray-400 py-10">Waiting for telemetry...</div>
                        )}
                        {Object.entries(metrics).map(([key, vals]: [string, any]) => {
                            const latest = vals[vals.length - 1];
                            const value = Number(latest.value);
                            // Simple bar calculation (normalize roughly 0-100 for demo)
                            const percent = Math.min(Math.max(value, 0), 100);

                            return (
                                <div key={key} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-mono text-gray-500 dark:text-gray-400 uppercase text-xs">{key}</span>
                                        <span className={`font-mono font-bold ${isHacked ? 'text-red-500' : 'text-indigo-600 dark:text-indigo-400'
                                            }`}>
                                            {value.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${isHacked ? 'bg-red-500' : 'bg-indigo-500'
                                                }`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Logs Panel */}
                <div className={`col-span-1 lg:col-span-2 rounded-xl shadow-lg border overflow-hidden flex flex-col transition-all duration-300 ${isHacked
                        ? 'bg-black border-red-500 shadow-red-900/20'
                        : 'bg-black border-gray-800'
                    }`}>
                    <div className={`p-3 border-b flex justify-between items-center ${isHacked ? 'bg-red-900/20 border-red-900' : 'bg-gray-900 border-gray-800'
                        }`}>
                        <h3 className="text-gray-400 font-mono text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            SYSTEM LOGS
                        </h3>
                        <span className="text-xs text-gray-600 font-mono">
                            {logs.length} EVENTS
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
                        {logs.length === 0 && (
                            <div className="text-green-900 p-4">_waiting_for_stream...</div>
                        )}
                        {logs.map((log, i) => (
                            <div key={i} className={`flex gap-3 hover:bg-white/5 p-0.5 rounded ${log.message.includes("CRITICAL") ? 'bg-red-900/30' : ''
                                }`}>
                                <span className="text-gray-600 text-xs shrink-0 select-none">
                                    {new Date(log.timestamp * 1000).toLocaleTimeString()}
                                </span>
                                <span className={`text-xs font-bold shrink-0 w-16 ${log.level === 'ERROR' || log.level === 'CRITICAL' ? 'text-red-500' :
                                        log.level === 'WARN' ? 'text-yellow-500' :
                                            'text-green-500'
                                    }`}>
                                    {log.level}
                                </span>
                                <span className={`break-all ${log.message.includes("CRITICAL") || log.message.includes("ATTACK")
                                        ? 'text-red-400 font-bold'
                                        : 'text-gray-300'
                                    }`}>
                                    {log.message}
                                </span>
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}
