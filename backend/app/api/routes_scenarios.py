from fastapi import APIRouter
from backend.app.engine.catalog_loader import load_catalog

router = APIRouter()

@router.get("/scenarios")
def get_scenarios():
    return load_catalog()
