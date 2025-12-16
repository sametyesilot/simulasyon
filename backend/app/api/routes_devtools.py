from fastapi import APIRouter, Header, HTTPException
from backend.app.engine.entities import AnomalyRunPlan
from backend.app.core.config import settings

router = APIRouter()

def verify_key(x_api_key: str = Header(None)):
    if x_api_key != settings.DEV_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")

@router.post("/dev/validate-plan", dependencies=[])
def validate_plan(plan: AnomalyRunPlan, x_api_key: str = Header(None)):
    # Manual check since dependencies sometimes tricky with simple setups
    if x_api_key != settings.DEV_API_KEY:
         return {"valid": False, "error": "Unauthorized: Invalid API Key"}
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
