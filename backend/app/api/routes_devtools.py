from fastapi import APIRouter
from backend.app.engine.entities import AnomalyRunPlan

router = APIRouter()

@router.post("/dev/validate-plan")
def validate_plan(plan: AnomalyRunPlan):
    # Basic validation
    if plan.durationSeconds > 300:
        return {"valid": False, "error": "Duration exceeds 300s limit"}
    if plan.intensity < 1 or plan.intensity > 10:
         return {"valid": False, "error": "Intensity must be 1-10"}
    
    # Payload size check (simulated)
    import json
    if len(json.dumps(plan.dict())) > 20000:
         return {"valid": False, "error": "Plan size too large (>20KB)"}
    
    return {"valid": True, "message": "Plan is valid & safe."}

@router.get("/dev/catalog")
def get_full_catalog():
    from backend.app.engine.catalog_loader import load_catalog
    return load_catalog()
