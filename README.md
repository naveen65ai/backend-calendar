# Backend + Cloud — 90 Day Tracker

Premium dark + gold tracker for the Backend + Cloud roadmap.
**Option A: FastAPI + Postgres • Starts 4 Oct 2026 • Ends 1 Jan 2027**

Rule: **if a topic is not ticked, it automatically carries to the next day** and sits in Today Focus until done.

## UI (deploys to Vercel)

Next.js 16 + React 19 + Tailwind v4. Progress persists in `localStorage`.

```bash
cd backend-calendar
npm install
npm run dev
```

Open http://localhost:3000

## Backend — Option A (FastAPI + Postgres)

For learning +portfolio. The UI works without it; connect later via `NEXT_PUBLIC_API_URL`.

```bash
cd backend
pip install -r requirements.txt
docker compose up -d
copy .env.example .env
uvicorn main:app --reload
```

- `GET /health`
- `GET /progress`
- `POST /progress` `{ "day": 5, "done": true }`

## Deploy to Vercel

```bash
vercel --prod
```

## GitHub

```bash
git init
git add .
git commit -m "feat: 90-day backend+cloud tracker with carry-over"
gh repo create backend-calendar --private --source=. --push
```
