"use client";
import { useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../lib/api';

const DEFAULT_PLAN = {
    scenarioId: "custom-dev-test",
    durationSeconds: 60,
    intensity: 5,
    params: {},
    customPlanEvents: []
};

const SDK_CODE = `import requests
import time
import json

class EvcsAttackClient:
    def __init__(self, api_url="http://localhost:8000"):
        self.api_url = api_url.rstrip("/")
        print(f"[*] Initialized Attack Client targeting: {self.api_url}")

    def check_connection(self):
        try:
            r = requests.get(f"{self.api_url}/health")
            if r.status_code == 200:
                print("[+] Connection Successful!")
                return True
            else:
                print(f"[-] Connection Failed: Status {r.status_code}")
                return False
        except Exception as e:
            print(f"[-] Connection Error: {e}")
            return False

    def start_attack(self, scenario_id, duration=60, intensity=5, params=None):
        if params is None:
            params = {}
        
        payload = {
            "scenarioId": scenario_id,
            "durationSeconds": duration,
            "intensity": intensity,
            "params": params
        }

        print(f"[*] Launching Attack Scenario: {scenario_id}...")
        try:
            r = requests.post(f"{self.api_url}/runs", json=payload)
            if r.status_code == 200:
                data = r.json()
                print(f"[+] Attack Started! Run ID: {data['runId']}")
                return data['runId']
            else:
                print(f"[-] Failed to start: {r.text}")
                return None
        except Exception as e:
            print(f"[-] Error starting attack: {e}")
            return None

    def monitor_live(self, run_id):
        print(f"[*] Monitoring Run {run_id} (Ctrl+C to stop)...")
        last_log_idx = 0
        try:
            while True:
                # Get Logs
                r_log = requests.get(f"{self.api_url}/runs/{run_id}/logs")
                if r_log.status_code == 200:
                    logs = r_log.json()
                    new_logs = logs[last_log_idx:]
                    for l in new_logs:
                        print(f"   [{l['level']}] {l['message']}")
                    last_log_idx = len(logs)
                
                # Check status
                r_run = requests.get(f"{self.api_url}/runs/{run_id}")
                if r_run.status_code == 200 and r_run.json()['status'] != 'RUNNING':
                    print("[!] Attack Finished.")
                    break
                
                time.sleep(2)
        except KeyboardInterrupt:
            print("[!] Monitoring stopped.")
`;

export default function DeveloperPage() {
    const [activeTab, setActiveTab] = useState<'json' | 'python'>('python');
    const [planJson, setPlanJson] = useState(JSON.stringify(DEFAULT_PLAN, null, 2));
    const [validationResult, setValidationResult] = useState<any>(null);
    const [safetyLog, setSafetyLog] = useState<string[]>([]);

    const validatePlan = async () => {
        try {
            const parsed = JSON.parse(planJson);
            const res = await fetch(`${API_BASE_URL}/dev/validate-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed)
            });
            const data = await res.json();
            setValidationResult(data);
        } catch (e) {
            setValidationResult({ valid: false, error: "Invalid JSON format" });
        }
    };

    const runSafetyTest = async (testName: string) => {
        setSafetyLog(prev => [...prev, `Running ${testName}...`]);
        // Safety test logic same as before...
        if (testName === 'oversized_payload') {
            try {
                const res = await fetch(`${API_BASE_URL}/dev/validate-plan`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...DEFAULT_PLAN, params: { junk: "A".repeat(25000) } })
                });
                const data = await res.json();
                setSafetyLog(prev => [...prev, `Result: ${JSON.stringify(data)}`]);
            } catch (e) {
                setSafetyLog(prev => [...prev, `Network Error: ${e}`]);
            }
        } else if (testName === 'rate_limit') {
            setSafetyLog(prev => [...prev, `Simulating 10 requests in 100ms...`]);
            for (let i = 0; i < 10; i++) {
                fetch(`${API_BASE_URL}/health`);
            }
            setSafetyLog(prev => [...prev, `Check backend logs for 429 (Simulated)`]);
        } else {
            setSafetyLog(prev => [...prev, `Test ${testName} passed (Mock).`]);
        }
    };

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto bg-gray-900 text-gray-100">
            <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                <h1 className="text-2xl font-bold font-mono text-green-400">Developer Console</h1>
                <Link href="/" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Exit Developer Mode</Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('python')}
                    className={`px-4 py-2 rounded ${activeTab === 'python' ? 'bg-blue-600' : 'bg-gray-800'}`}
                >
                    Python Attack SDK
                </button>
                <button
                    onClick={() => setActiveTab('json')}
                    className={`px-4 py-2 rounded ${activeTab === 'json' ? 'bg-blue-600' : 'bg-gray-800'}`}
                >
                    JSON Plan Editor
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Content Section */}
                <div>
                    {activeTab === 'json' ? (
                        <>
                            <h2 className="text-xl font-semibold mb-4">Plan Editor (JSON)</h2>
                            <textarea
                                className="w-full h-96 bg-gray-800 font-mono text-sm p-4 rounded border border-gray-700 focus:outline-none focus:border-green-500"
                                value={planJson}
                                onChange={(e) => setPlanJson(e.target.value)}
                            />
                            <div className="mt-4 flex gap-4">
                                <button onClick={validatePlan} className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-500">Validate Plan</button>
                                <button onClick={() => setPlanJson(JSON.stringify(DEFAULT_PLAN, null, 2))} className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700">Reset</button>
                            </div>

                            {validationResult && (
                                <div className={`mt-4 p-4 rounded ${validationResult.valid ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'}`}>
                                    <p className="font-bold">{validationResult.valid ? "VALID PLAN" : "INVALID PLAN"}</p>
                                    <p className="text-sm opacity-80">{validationResult.message || validationResult.error}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-gray-800 p-6 rounded border border-gray-700">
                            <h2 className="text-xl font-semibold mb-2">Python Attack SDK</h2>
                            <p className="mb-4 text-gray-400 text-sm">
                                Download this SDK to write attack scripts on your local machine.
                                <br />
                                1. Install python: <code>pip install requests</code><br />
                                2. Create <code>evcs_attack.py</code> with the code below.<br />
                                3. Write your script invoking <code>client.start_attack(...)</code>.
                            </p>
                            <textarea
                                className="w-full h-80 bg-black text-green-500 font-mono text-xs p-2 rounded"
                                readOnly
                                value={SDK_CODE}
                            />
                            <button
                                onClick={() => navigator.clipboard.writeText(SDK_CODE)}
                                className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                            >
                                Copy Code
                            </button>
                        </div>
                    )}
                </div>

                {/* Safety Tests Panel */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-orange-400">Safety & Security Tests</h2>
                    <div className="bg-gray-800 p-6 rounded border border-gray-700">
                        {/* Same Safety Panel Content */}
                        <div className="space-y-4">
                            <button onClick={() => runSafetyTest('oversized_payload')} className="flex items-center w-full p-3 bg-gray-700 rounded hover:bg-gray-600">
                                <span className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-4 text-xs font-bold">L</span>
                                <div className="text-left">
                                    <div className="font-bold">Oversized Payload Test</div>
                                    <div className="text-xs text-gray-400">Tries to send a 25KB+ plan. Should be rejected.</div>
                                </div>
                            </button>
                            {/* ... other buttons ... */}
                        </div>
                        <div className="mt-6 bg-black p-2 rounded h-40 overflow-y-auto font-mono text-xs text-green-500">
                            {safetyLog.map((line, i) => <div key={i}>{'> ' + line}</div>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
