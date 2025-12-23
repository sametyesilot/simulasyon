"use client";
import { useState, useEffect } from 'react';
import { fetchScenarios, createRun } from './lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HelpButton, HelpModal, VulnerabilityBadge, Tooltip } from './components/HelpSystem';

export default function Home() {
    const [scenarios, setScenarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPerson, setSelectedPerson] = useState<string>('All');
    const [showHelp, setShowHelp] = useState(false);
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
        <>
            <main className="min-h-screen p-8 max-w-7xl mx-auto">
                {/* Header with Welcome Banner */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                            🔒 EVCS Anomaly Platform
                        </h1>
                        <div className="flex gap-4">
                            <Link
                                href="/developer"
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                            >
                                💻 Developer Mode
                            </Link>
                        </div>
                    </div>

                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 dark:bg-opacity-20 border-l-4 border-blue-600 p-4 rounded-lg">
                        <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
                            👋 Hoş Geldiniz!
                        </h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Bu platform, elektrikli araç şarj istasyonlarına yönelik siber saldırıları <strong>eğitim amaçlı</strong> simüle eder.
                            Her senaryo kasıtlı güvenlik zayıflıkları içerir. İlk kez mi kullanıyorsunuz?
                            Sağ alttaki <strong className="text-blue-600 dark:text-blue-400">?</strong> butonuna tıklayın!
                        </p>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 dark:text-gray-300">👤 Takım Üyesi:</label>
                        <select
                            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={selectedPerson}
                            onChange={(e) => setSelectedPerson(e.target.value)}
                        >
                            {people.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div className="flex-1"></div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        📊 Toplam Senaryo: <strong className="text-blue-600 dark:text-blue-400">{filtered.length}</strong>
                    </div>
                </div>

                {/* Scenarios Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Senaryolar yükleniyor...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(s => (
                            <div
                                key={s.id}
                                className="group border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 hover:scale-105"
                            >
                                {/* Header with badges */}
                                <div className="flex justify-between items-start mb-3 gap-2">
                                    <Tooltip content={`Kategori: ${s.category}`}>
                                        <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-md">
                                            {s.category}
                                        </span>
                                    </Tooltip>
                                    <Tooltip content={`Sorumlu: ${s.personName}`}>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                            👤 {s.personName}
                                        </span>
                                    </Tooltip>
                                </div>

                                {/* Title */}
                                <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                    {s.anomalyTitle}
                                </h2>

                                {/* Description */}
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 h-20 overflow-y-auto leading-relaxed">
                                    {s.description}
                                </p>

                                {/* Vulnerability Badge */}
                                <div className="mb-4">
                                    <VulnerabilityBadge scenarioId={s.id} />
                                </div>

                                {/* Indicators */}
                                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        <strong>🔍 Tespit Göstergeleri:</strong>
                                    </p>
                                    <p className="text-xs text-gray-700 dark:text-gray-300">{s.indicator}</p>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => handleStartRun(s.id)}
                                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    ▶️ Simülasyonu Başlat
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Info */}
                <div className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <h3 className="font-bold text-lg mb-2 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                        ⚠️ Önemli Hatırlatma
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Bu platform <strong>sadece eğitim amaçlıdır</strong>. Tüm zayıflıklar kasıtlı olarak eklenmiştir.
                        Öğrendiğiniz teknikleri <strong className="underline">asla</strong> gerçek sistemlerde kullanmayın!
                    </p>
                </div>
            </main>

            {/* Help System */}
            <HelpButton onClick={() => setShowHelp(true)} />
            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
        </>
    );
}
