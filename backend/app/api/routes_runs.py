from fastapi import APIRouter, HTTPException
from backend.app.engine.simulator import engine
from backend.app.engine.entities import AnomalyRunPlan

router = APIRouter()

@router.post("/runs")
def create_run(plan: AnomalyRunPlan):
    # Validate scenario exists? 
    # For now just start
    run_id = engine.start_run(plan)
    return {"runId": run_id, "status": "started"}

@router.get("/runs/{run_id}")
def get_run(run_id: str):
    run = engine.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

@router.get("/runs/{run_id}/logs")
def get_run_logs(run_id: str):
    run = engine.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run.logs

@router.get("/runs/{run_id}/metrics")
def get_run_metrics(run_id: str):
    run = engine.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run.metrics
