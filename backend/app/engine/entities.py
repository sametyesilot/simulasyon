# from backend.app.core.pydantic.v1 import BaseModel - REMOVED

# Note using Pydantic V2 is standard now, but let's stick to simple classes or Pydantic models.
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
import time

class EventType(str, Enum):
    AUTHORIZE = "AUTHORIZE"
    START_SESSION = "START_SESSION"
    STOP_SESSION = "STOP_SESSION"
    METER_VALUES = "METER_VALUES"
    STATUS_NOTIFICATION = "STATUS_NOTIFICATION"
    FIRMWARE_DOWNLOAD = "FIRMWARE_DOWNLOAD"
    HEARTBEAT = "HEARTBEAT"
    GRID_MEASUREMENT = "GRID_MEASUREMENT"
    BLOCK_COMMIT = "BLOCK_COMMIT"
    LOG = "LOG"

class SimulationEvent(BaseModel):
    timestamp: float
    type: EventType
    source: str
    payload: Dict[str, Any]

class AnomalyRunPlan(BaseModel):
    scenarioId: str
    durationSeconds: int
    intensity: int  # 1-10
    params: Dict[str, Any] = {}
    customPlanEvents: Optional[List[Dict[str, Any]]] = None

class RunState(BaseModel):
    runId: str
    scenarioId: str
    startTime: float
    status: str = "RUNNING" # RUNNING, COMPLETED, STOPPED
    logs: List[Dict[str, Any]] = []
    metrics: Dict[str, List[Dict[str, Any]]] = {}
    artifacts: List[str] = []

    def add_log(self, message: str, level: str = "INFO"):
        self.logs.append({
            "timestamp": time.time(),
            "level": level,
            "message": message
        })

    def add_metric(self, name: str, value: float):
        if name not in self.metrics:
            self.metrics[name] = []
        self.metrics[name].append({
            "timestamp": time.time(),
            "value": value
        })
