"use client";
import React from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="cursor-help"
            >
                {children}
            </div>

            {isVisible && (
                <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap">
                    {content}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            )}
        </div>
    );
}

interface HelpButtonProps {
    onClick: () => void;
}

export function HelpButton({ onClick }: HelpButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center text-2xl font-bold z-50"
            aria-label="Yardım"
        >
            ?
        </button>
    );
}

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">📚 Kullanım Kılavuzu</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center text-xl"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Quick Start */}
                    <section>
                        <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">🚀 Hızlı Başlangıç</h3>
                        <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 p-4 rounded-lg">
                            <ol className="list-decimal list-inside space-y-2">
                                <li>Aşağıdaki anomali kartlarından birini seçin</li>
                                <li>"Start Simulation" butonuna tıklayın</li>
                                <li>Simülasyon sayfasında canlı logları ve grafikleri izleyin</li>
                                <li>Anomali tespit sonuçlarını inceleyin</li>
                            </ol>
                        </div>
                    </section>

                    {/* Scenario Cards Explained */}
                    <section>
                        <h3 className="text-xl font-bold mb-3 text-purple-600 dark:text-purple-400">🎯 Senaryo Kartları</h3>
                        <div className="grid gap-3">
                            <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
                                <p className="font-semibold text-sm mb-1">📌 Kategori Rozeti (Mavi)</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Anomalinin türünü gösterir (Network/DoS, Identity, vb.)</p>
                            </div>
                            <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
                                <p className="font-semibold text-sm mb-1">👤 Kişi Adı (Sağ Üst)</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Bu senaryodan sorumlu takım üyesi</p>
                            </div>
                            <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
                                <p className="font-semibold text-sm mb-1">🎯 Anomali Başlığı</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Senaryonun ana konusu</p>
                            </div>
                            <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
                                <p className="font-semibold text-sm mb-1">📊 Göstergeler (Indicators)</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Bu anomaliyi nasıl tespit edeceğinize dair ipuçları</p>
                            </div>
                        </div>
                    </section>

                    {/* Attack Guide */}
                    <section>
                        <h3 className="text-xl font-bold mb-3 text-red-600 dark:text-red-400">⚔️ Saldırı Testi Nasıl Yapılır?</h3>
                        <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 p-4 rounded-lg space-y-3">
                            <p className="text-sm font-semibold">1️⃣ SDK'yı İndirin:</p>
                            <code className="block bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                                curl -o evcs_attack.py https://github.com/sametyesilot/simulasyon/blob/main/sdk/evcs_attack.py
                            </code>

                            <p className="text-sm font-semibold mt-3">2️⃣ Python Scripti Oluşturun:</p>
                            <code className="block bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                                {`from evcs_attack import EvcsAttackClient
client = EvcsAttackClient(
    api_url="https://evcs-backend-samet.onrender.com",
    api_key="YOUR_API_KEY"
)
client.start_attack("ahmet-ddos", duration=60, intensity=8)`}
                            </code>

                            <p className="text-sm font-semibold mt-3">3️⃣ Detaylı Rehber:</p>
                            <a
                                href="/docs/ATTACK_GUIDE_DETAILED.md"
                                target="_blank"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                            >
                                📖 Tüm saldırı senaryoları için detaylı kılavuzu açın
                            </a>
                        </div>
                    </section>

                    {/* Filter Feature */}
                    <section>
                        <h3 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">🔍 Filtreleme</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Üstteki "Filter by Person" menüsünden istediğiniz takım üyesinin senaryolarını görebilirsiniz.
                            "All" seçeneği tüm senaryoları gösterir.
                        </p>
                    </section>

                    {/* Vulnerabilities */}
                    <section>
                        <h3 className="text-xl font-bold mb-3 text-orange-600 dark:text-orange-400">🔓 Kasıtlı Zayıflıklar</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            Bu sistem EĞİTİM AMAÇLI olarak aşağıdaki zayıflıkları içerir:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div className="bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 p-2 rounded">✗ SQL Injection</div>
                            <div className="bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 p-2 rounded">✗ Command Injection</div>
                            <div className="bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 p-2 rounded">✗ Path Traversal</div>
                            <div className="bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 p-2 rounded">✗ IDOR (Insecure Direct Object Reference)</div>
                            <div className="bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 p-2 rounded">✗ No Rate Limiting</div>
                            <div className="bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 p-2 rounded">✗ No Signature Verification</div>
                            <div className="bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 p-2 rounded">✗ Parameter Tampering</div>
                            <div className="bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 p-2 rounded">✗ Business Logic Flaws</div>
                        </div>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-3 font-semibold">
                            ⚠️ Bu zayıflıkları SADECE bu platformda test edin!
                        </p>
                    </section>

                    {/* FAQ */}
                    <section>
                        <h3 className="text-xl font-bold mb-3 text-indigo-600 dark:text-indigo-400">❓ Sık Sorulan Sorular</h3>
                        <div className="space-y-3">
                            <details className="border border-gray-200 dark:border-gray-700 rounded p-3">
                                <summary className="font-semibold cursor-pointer">Simülasyon ne kadar sürer?</summary>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                    Varsayılan olarak 60 saniye, maksimum 300 saniye (5 dakika) sürebilir.
                                </p>
                            </details>

                            <details className="border border-gray-200 dark:border-gray-700 rounded p-3">
                                <summary className="font-semibold cursor-pointer">API Key nasıl alabilirim?</summary>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                    Proje yöneticinizden (Samet) size özel bir API anahtarı talep edin.
                                </p>
                            </details>

                            <details className="border border-gray-200 dark:border-gray-700 rounded p-3">
                                <summary className="font-semibold cursor-pointer">Loglar nerede görünüyor?</summary>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                    Simülasyonu başlattıktan sonra açılan sayfada "Real-time Logs" bölümünde canlı olarak görünür.
                                </p>
                            </details>

                            <details className="border border-gray-200 dark:border-gray-700 rounded p-3">
                                <summary className="font-semibold cursor-pointer">Birden fazla simülasyon çalıştırabilir miyim?</summary>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                    Evet! Her simülasyon bağımsız bir Run ID ile çalışır ve aynı anda birden çok aktif olabilir.
                                </p>
                            </details>
                        </div>
                    </section>

                    {/* Links */}
                    <section>
                        <h3 className="text-xl font-bold mb-3 text-cyan-600 dark:text-cyan-400">🔗 Faydalı Bağlantılar</h3>
                        <div className="space-y-2">
                            <a href="https://github.com/sametyesilot/simulasyon" target="_blank" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                📦 GitHub Repository
                            </a>
                            <a href="/docs/python_attack_guide.md" target="_blank" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                🐍 Python Saldırı Rehberi (Basit)
                            </a>
                            <a href="/docs/ATTACK_GUIDE_DETAILED.md" target="_blank" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                📖 Detaylı Saldırı Kılavuzu
                            </a>
                            <a href="https://evcs-backend-samet.onrender.com/docs" target="_blank" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                🔧 Backend API Dokümantasyonu
                            </a>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-100 dark:bg-gray-900 p-4 rounded-b-lg text-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        Anladım, Kapat
                    </button>
                </div>
            </div>
        </div>
    );
}

interface VulnerabilityBadgeProps {
    scenarioId: string;
}

export function VulnerabilityBadge({ scenarioId }: VulnerabilityBadgeProps) {
    const vulnerabilities: Record<string, string> = {
        "ahmet-ddos": "No Rate Limiting",
        "atahan-auth-bypass": "SQL Injection",
        "samet-energy-theft": "Parameter Tampering",
        "yusuf-mitm-ocpp": "No Signature Verification",
        "gokdeniz-firmware": "Path Traversal",
        "yunus-offgrid-voltage": "Command Injection",
        "beyza-blockchain-delay": "Timestamp Manipulation",
        "mirac-supply-chain": "Unsigned Updates",
        "omer-fake-fault": "IDOR",
        "merve-billing": "Business Logic Flaw",
        "feyza-ddos-net": "No Timeout (Slowloris)",
        "muhammet-general": "Multiple"
    };

    const vulnerability = vulnerabilities[scenarioId] || "Unknown";

    return (
        <Tooltip content={`Zayıflık: ${vulnerability}`}>
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                🔓 {vulnerability}
            </span>
        </Tooltip>
    );
}
