from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from backend.app.api import routes_scenarios, routes_runs, routes_devtools, routes_vulnerable
from backend.app.engine.simulator import engine

from backend.app.core.config import settings

app = FastAPI(title="EVCS Anomaly Platform", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(routes_scenarios.router)
app.include_router(routes_runs.router)
app.include_router(routes_devtools.router)
app.include_router(routes_vulnerable.router)

@app.on_event("startup")
async def startup_event():
    # Start the simulation loop in background
    asyncio.create_task(engine.start_engine())

@app.get("/health")
def health_check():
    return {"status": "ok", "engine_running": engine.running}

@app.get("/")
def read_root():
    return {"message": "Welcome to EVCS Anomaly Platform API. Go to /docs for Swagger UI."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
