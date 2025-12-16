export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function fetchScenarios() {
    const res = await fetch(`${API_BASE_URL}/scenarios`);
    if (!res.ok) throw new Error("Failed to fetch scenarios");
    return res.json();
}

export async function createRun(scenarioId: string, params: any) {
    const res = await fetch(`${API_BASE_URL}/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            scenarioId,
            durationSeconds: 60, // Default 60s
            intensity: 5,
            params
        })
    });
    if (!res.ok) throw new Error("Failed to start run");
    return res.json();
}

export async function getRun(runId: string) {
    const res = await fetch(`${API_BASE_URL}/runs/${runId}`);
    return res.json();
}

export async function getRunLogs(runId: string) {
    const res = await fetch(`${API_BASE_URL}/runs/${runId}/logs`);
    return res.json();
}

export async function getRunMetrics(runId: string) {
    const res = await fetch(`${API_BASE_URL}/runs/${runId}/metrics`);
    return res.json();
}
