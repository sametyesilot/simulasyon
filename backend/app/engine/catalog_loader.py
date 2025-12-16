import json
import os
from typing import List, Dict, Any

CATALOG_PATH = os.path.join(os.path.dirname(__file__), "../../../seed/anomalies_catalog.json")

def load_catalog() -> List[Dict[str, Any]]:
    if not os.path.exists(CATALOG_PATH):
        return []
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def get_scenario_by_id(scenario_id: str) -> Dict[str, Any]:
    catalog = load_catalog()
    for item in catalog:
        if item["id"] == scenario_id:
            return item
    return None
