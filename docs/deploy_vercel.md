# Vercel Deployment Guide (Frontend)

## 1. Create Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.

## 2. Configuration
- **Framework Preset:** Next.js
- **Root Directory:** Edit -> Select `frontend` folder.
- **Build Command:** `next build` (default)
- **Output Directory:** `.next` (default)

## 3. Environment Variables
Add the following:
- `NEXT_PUBLIC_API_BASE_URL`: The URL of your Render Backend (e.g., `https://evcs-backend.onrender.com`) - **No trailing slash**.

## 4. Deploy
Click **Deploy**.
Once finished, Vercel will give you a domain (e.g., `evcs-platform.vercel.app`).

## 5. Final Check
1. Open the Vercel URL.
2. The homepage should load the "Anomalies Catalog" (fetched from Render).
3. If it says "Loading..." forever, check the Console (F12) for CORS errors or 503 errors (Render might be waking up).
