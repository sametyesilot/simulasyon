import asyncio
import time
import uuid
import random
from typing import Dict
from .entities import RunState, AnomalyRunPlan, EventType
from .catalog_loader import get_scenario_by_id

class SimulationEngine:
    def __init__(self):
        self.active_runs: Dict[str, RunState] = {}
        self.running = False

    async def start_engine(self):
        self.running = True
        while self.running:
            await self.tick()
            await asyncio.sleep(1.0) # 1 sec tick

    async def tick(self):
        # Current time
        now = time.time()
        
        # Snapshot of keys to avoid modification errors
        active_ids = list(self.active_runs.keys())

        for run_id in active_ids:
            run = self.active_runs[run_id]
            
            # Check duration
            scenario = get_scenario_by_id(run.scenarioId)
            # Duration default 60s if not set
            # For this MVP, we store duration in the run object? 
            # We didn't add duration to RunState, let's assume 60s default or get from somewhere.
            # I will hack it: we'll stop after 60s for now or 300s max.
            
            elapsed = now - run.startTime
            if elapsed > 300: # hard limit 5 mins
                run.status = "COMPLETED"
                run.add_log("Simulation ended (Time limit reached).", "SYSTEM")
                # Move to archived runs if implementing persistence, for now keep in memory
                continue

            if run.status != "RUNNING":
                continue

            # Generate Synthetic Data based on Scenario
            self.generate_scenario_traffic(run, scenario, elapsed)

    def start_run(self, plan: AnomalyRunPlan) -> str:
        run_id = str(uuid.uuid4())
        run = RunState(
            runId=run_id,
            scenarioId=plan.scenarioId,
            startTime=time.time()
        )
        self.active_runs[run_id] = run
        run.add_log(f"Starting simulation for {plan.scenarioId}...", "system")
        return run_id

    def get_run(self, run_id: str):
        return self.active_runs.get(run_id)

    def generate_scenario_traffic(self, run: RunState, scenario: Dict, elapsed: float):
        # Generic logic + Scenario specific deviation
        
        # Base heartbeats
        if int(elapsed) % 5 == 0:
            run.add_log("CSMS received Heartbeat from EVSE-001", "INFO")
            run.add_log("CSMS received Heartbeat from EVSE-002", "INFO")

        sid = scenario["id"] if scenario else "unknown"

        # Logic for specific anomalies
        if "ddos" in sid:
            # High load simulation
            rps = random.randint(50, 500)
            run.add_metric("rps", rps)
            run.add_metric("latency_ms", random.uniform(100, 2000))
            if random.random() < 0.3:
                run.add_log("WARNING: High traffic detected from IP 192.168.1.X", "WARN")
            if rps > 400:
                run.add_log("CRITICAL: Service unavailable (503)", "ERROR")

        elif "auth" in sid or "access" in sid:
            if random.random() < 0.2:
                run.add_log("Authentication failed: Invalid Signature", "WARN")
            if random.random() < 0.1:
                run.add_log("Duplicate RFID Tag usage detected", "ERROR")
            run.add_metric("failed_auth_count", random.randint(0, 5))

        elif "voltage" in sid:
            voltage = 400 + random.randint(-50, 1000)
            run.add_metric("dc_bus_voltage", voltage)
            if voltage > 800:
                 run.add_log("CRITICAL: DC Bus Overvoltage! Protection trip imminent.", "ERROR")
            if random.random() < 0.2:
                run.add_log("Dump Load status mismatch.", "WARN")

        elif "firmware" in sid:
            if int(elapsed) == 10:
                run.add_log("FirmwareUpdate initiated...", "INFO")
            if int(elapsed) == 15:
                 run.add_log("Verifying signature...", "INFO")
            if int(elapsed) == 16:
                 run.add_log("Signature verification FAILED.", "ERROR")
                 run.add_log("Rebooting...", "WARN")

        elif "blockchain" in sid:
             block_time = random.randint(10, 600) # seconds
             run.add_metric("block_confirmation_time_s", block_time)
             if block_time > 120:
                 run.add_log("Consensus delay detected. Block orphaned.", "WARN")

        else:
            # Random generic noise
            run.add_metric("load_load_%", random.randint(20, 80))

engine = SimulationEngine()
