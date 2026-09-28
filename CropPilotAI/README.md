# 🌱 CropPilotAI - Enterprise AI-Powered Agriculture Crop Advisory Assistant

An end-to-end full-stack Agritech intelligence platform delivering real-time crop disease diagnosis, pathogen mitigation plans, and farm parcel management powered by **Google Gemini AI (via `@google/genai` / `@google/generative-ai`)**, **Supabase Cloud PostgreSQL & Auth**, **Express.js**, and **React + Vite + Tailwind CSS**.

---

## 🚀 Quick Start Guide

### 1. Database Setup & Supabase Migrations
- Migration file location: `supabase/migrations/001_initial_schema.sql`
- **Option A (Automated)**:
  Run the migration script:
  ```bash
  cd server
  npm run migrate
  ```
- **Option B (Supabase Console)**:
  1. Open [Supabase Dashboard](https://supabase.com/dashboard) -> Select Project -> **SQL Editor**.
  2. Paste contents of `supabase/migrations/001_initial_schema.sql`.
  3. Click **Run**.

### 2. Configure Environment Variables
- In `server/.env`:
  ```env
  PORT=5000
  NODE_ENV=development
  CLIENT_URL=http://localhost:5173
  GEMINI_API_KEY=your_gemini_api_key_here
  SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
  SUPABASE_ANON_KEY=your_anon_key_here
  ```
- In `client/.env`:
  ```env
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your_anon_key_here
  VITE_API_BASE_URL=http://localhost:5000
  ```

### 3. Run Locally
- **Start Backend**:
  ```bash
  cd server
  npm install
  npm run dev
  ```
- **Start Frontend**:
  ```bash
  cd client
  npm install
  npm run dev
  ```
- Open browser at `http://localhost:5173`.

---

## 🛡️ Production Deployment (Step 8 Guide)

### Backend on Render:
1. Web Service -> Connect GitHub repo.
2. Root Directory: `CropPilotAI/server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Inject Environment variables: `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CLIENT_URL`.

### Frontend on Vercel:
1. Import GitHub repo.
2. Root Directory: `CropPilotAI/client`
3. Framework Preset: `Vite`
4. Inject Environment variables: `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
