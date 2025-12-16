import requests
import time
import json

class EvcsAttackClient:
    def __init__(self, api_url="http://localhost:8000", api_key="secret-dev-key"):
        self.api_url = api_url.rstrip("/")
        self.api_key = api_key
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
            print("\n[!] Monitoring stopped.")

# Quick test if run directly
if __name__ == "__main__":
    client = EvcsAttackClient()
    if client.check_connection():
        print("Ready to attack.")
