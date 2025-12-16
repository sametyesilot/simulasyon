import os

class Settings:
    PROJECT_NAME = "EVCS Anomaly Platform"
    
    # Security
    DEV_API_KEY = os.getenv("DEV_API_KEY", "secret-dev-key")
    
    # CORS
    # Parse comma separated origins
    ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

settings = Settings()
