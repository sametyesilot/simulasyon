# Render Deployment Guide (Backend)

## 1. Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Select the `evcs-anomaly-platform` repository (or monorepo root).

## 2. Configuration
- **Name:** `evcs-anomaly-backend`
- **Region:** Frankfurt (EU Central) - recommended.
- **Root Directory:** `backend`  <-- IMPORTANT
- **Runtime:** Python 3
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## 3. Environment Variables
Add the following under "Environment":
- `PYTHON_VERSION`: `3.11.0`
- `ALLOWED_ORIGINS`: `*` (or your Vercel URL)

## 4. Deploy
Click **Create Web Service**. Wait for the green checkmark.
Copy the URL (e.g., `https://evcs-backend.onrender.com`). You will need this for the Frontend.

> **Note:** Render Free tier spins down after inactivity. The first request might take 30-60 seconds.
