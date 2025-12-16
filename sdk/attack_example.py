from evcs_attack import EvcsAttackClient
import time

# 1. Connect to Platform
# If deploying to Vercel/Render, use the Render Backend URL here! 
# e.g. client = EvcsAttackClient("https://evcs-backend.onrender.com")
client = EvcsAttackClient("http://localhost:8000")

if not client.check_connection():
    exit(1)

# 2. Select Your Anomaly
# Check anomalies_catalog.json for your ID (e.g. 'ahmet-ddos', 'gokdeniz-firmware')
SCENARIO_ID = "ahmet-ddos" 

# 3. Define Parameters
params = {
    "botnet_size": 5000,
    "rps_multiplier": 10
}

# 4. Launch Attack
print(f"\n>>> Starting Attack: {SCENARIO_ID} <<<")
run_id = client.start_attack(SCENARIO_ID, duration=30, intensity=9, params=params)

if run_id:
    # 5. Monitor Results
    client.monitor_live(run_id)
else:
    print("Attack failed to start.")
