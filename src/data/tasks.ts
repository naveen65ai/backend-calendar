export type Phase = "Python + SQL" | "Backend Core" | "Cloud + Job Ready";

export interface DayTask {
  day: number;
  title: string;
  detail: string;
  phase: Phase;
  minutes: number;
  tag: string;
}

export const START_DATE_ISO = "2026-10-04";

export const TASKS: DayTask[] = [
  // ---- DAYS 1-30 : Python + Git + SQL ----
  { day: 1, title: "Setup: Python, VS Code, Git + GitHub", detail: "Install Python 3.12, VS Code, Git. Create GitHub account. Push hello.py", phase: "Python + SQL", minutes: 90, tag: "setup" },
  { day: 2, title: "Python basics: variables, I/O, if-else", detail: "5 small programs: calculator, grade checker, odd/even, temp converter, login check", phase: "Python + SQL", minutes: 90, tag: "python" },
  { day: 3, title: "Loops: for / while", detail: "5 problems: patterns, sum, factorial, table, guessing game", phase: "Python + SQL", minutes: 90, tag: "python" },
  { day: 4, title: "Functions + scope", detail: "Write 5 reusable functions. Learn args, return, scope, modules", phase: "Python + SQL", minutes: 90, tag: "python" },
  { day: 5, title: "Lists, dicts, tuples", detail: "Todo list with dicts. Practice slicing, dict methods, looping", phase: "Python + SQL", minutes: 90, tag: "python" },
  { day: 6, title: "Strings + file handling", detail: "Read/write files. Build notes saver CLI", phase: "Python + SQL", minutes: 90, tag: "python" },
  { day: 7, title: "Weekly review + GitHub push", detail: "Revise week 1. Push all code with clean commits + README", phase: "Python + SQL", minutes: 60, tag: "review" },
  { day: 8, title: "OOP part 1: class, object, __init__", detail: "Build BankAccount + Student classes with methods", phase: "Python + SQL", minutes: 90, tag: "python" },
  { day: 9, title: "OOP part 2: inheritance + project", detail: "Extend classes. Mini project: library manager", phase: "Python + SQL", minutes: 90, tag: "python" },
  { day: 10, title: "Errors, pip, venv", detail: "try/except, custom errors. Create venv, install requests, freeze requirements", phase: "Python + SQL", minutes: 90, tag: "python" },
  { day: 11, title: "Git: branches, PRs", detail: "Clone, branch, commit, push, open a PR. Learn .gitignore", phase: "Python + SQL", minutes: 90, tag: "git" },
  { day: 12, title: "Linux terminal basics", detail: "cd, ls, cat, mkdir, chmod, run scripts, env vars", phase: "Python + SQL", minutes: 60, tag: "linux" },
  { day: 13, title: "Mini project: CLI todo / calculator", detail: "Full CLI app with files + functions + Git", phase: "Python + SQL", minutes: 120, tag: "project" },
  { day: 14, title: "Weekly review + README polish", detail: "Clean repos, write READMEs, record what you learned", phase: "Python + SQL", minutes: 60, tag: "review" },
  { day: 15, title: "SQL: SELECT, WHERE", detail: "Install Postgres/SQLite. 15 queries on sample tables", phase: "Python + SQL", minutes: 90, tag: "sql" },
  { day: 16, title: "SQL: ORDER, LIMIT, UPDATE, DELETE", detail: "Practice sorting, pagination, safe updates", phase: "Python + SQL", minutes: 90, tag: "sql" },
  { day: 17, title: "SQL: JOINs", detail: "INNER, LEFT, RIGHT JOIN with users + orders tables", phase: "Python + SQL", minutes: 90, tag: "sql" },
  { day: 18, title: "SQL: GROUP BY + aggregates", detail: "COUNT, SUM, AVG, HAVING. 10 reports queries", phase: "Python + SQL", minutes: 90, tag: "sql" },
  { day: 19, title: "SQL: keys + schema design", detail: "Primary/foreign keys. Design users, expenses, tasks schema", phase: "Python + SQL", minutes: 90, tag: "sql" },
  { day: 20, title: "Python + SQL together", detail: "Connect Python to DB with psycopg/sqlite3. Insert + fetch", phase: "Python + SQL", minutes: 90, tag: "sql" },
  { day: 21, title: "Weekly review: 20 SQL queries", detail: "Timed practice. Fix weak JOIN / GROUP BY topics", phase: "Python + SQL", minutes: 60, tag: "review" },
  { day: 22, title: "Project: expense tracker CLI + DB", detail: "Add expense, list, monthly total. Store in Postgres", phase: "Python + SQL", minutes: 120, tag: "project" },
  { day: 23, title: "Expense tracker: reports", detail: "Add category reports, CSV export, input validation", phase: "Python + SQL", minutes: 120, tag: "project" },
  { day: 24, title: "Error handling + polish", detail: "Handle bad input, DB errors. Add logging", phase: "Python + SQL", minutes: 90, tag: "project" },
  { day: 25, title: "Push project + README + demo", detail: "GitHub repo with screenshots, setup steps, demo video notes", phase: "Python + SQL", minutes: 90, tag: "project" },
  { day: 26, title: "Buffer: fix weak Python topics", detail: "Re-do 10 problems from days 2-10 you found hard", phase: "Python + SQL", minutes: 90, tag: "review" },
  { day: 27, title: "Buffer: fix weak SQL topics", detail: "Re-do JOINs + GROUP BY. 15 queries", phase: "Python + SQL", minutes: 90, tag: "review" },
  { day: 28, title: "FastAPI preview: first GET route", detail: "pip install fastapi uvicorn. Hello API + docs at /docs", phase: "Python + SQL", minutes: 90, tag: "fastapi" },
  { day: 29, title: "Catch-up day", detail: "Finish any unticked topic. It carries forward automatically", phase: "Python + SQL", minutes: 90, tag: "review" },
  { day: 30, title: "Phase 1 checkpoint", detail: "Self-test: Python quiz + 10 SQL queries + 1 CLI demo", phase: "Python + SQL", minutes: 60, tag: "review" },

  // ---- DAYS 31-60 : Backend Core (Option A: FastAPI + Postgres) ----
  { day: 31, title: "How web works: HTTP, JSON, REST", detail: "Methods, status codes, headers. Test APIs with curl / docs UI", phase: "Backend Core", minutes: 90, tag: "fastapi" },
  { day: 32, title: "FastAPI: first app + validation", detail: "GET/POST routes, Pydantic models, auto docs", phase: "Backend Core", minutes: 90, tag: "fastapi" },
  { day: 33, title: "CRUD: POST / PUT / DELETE", detail: "In-memory notes API with full CRUD + validation errors", phase: "Backend Core", minutes: 90, tag: "fastapi" },
  { day: 34, title: "Project structure + env vars", detail: "routers/, models/, .env, settings, logging setup", phase: "Backend Core", minutes: 90, tag: "fastapi" },
  { day: 35, title: "Postgres + SQLAlchemy connect", detail: "Docker postgres or local. First table + session + migrate", phase: "Backend Core", minutes: 120, tag: "postgres" },
  { day: 36, title: "CRUD with DB part 1", detail: "Create + Read endpoints backed by Postgres", phase: "Backend Core", minutes: 120, tag: "postgres" },
  { day: 37, title: "Weekly review", detail: "Re-test all routes in /docs. Fix bugs, add README", phase: "Backend Core", minutes: 60, tag: "review" },
  { day: 38, title: "CRUD with DB part 2", detail: "Update + Delete, pagination, filtering, sorting", phase: "Backend Core", minutes: 120, tag: "postgres" },
  { day: 39, title: "Auth 1: hashing passwords", detail: "passlib/bcrypt. Signup route storing hashed passwords", phase: "Backend Core", minutes: 90, tag: "auth" },
  { day: 40, title: "Auth 2: login + JWT", detail: "Login route, create + verify JWT, expiry handling", phase: "Backend Core", minutes: 90, tag: "auth" },
  { day: 41, title: "Auth 3: protected routes", detail: "Depends(get_current_user). Owner-only access checks", phase: "Backend Core", minutes: 90, tag: "auth" },
  { day: 42, title: "Uploads, errors, logging", detail: "File upload endpoint, global error handler, request logs", phase: "Backend Core", minutes: 90, tag: "fastapi" },
  { day: 43, title: "Testing with pytest", detail: "Test 5 endpoints: auth + CRUD happy + sad paths", phase: "Backend Core", minutes: 90, tag: "testing" },
  { day: 44, title: "Weekly review + bugfix", detail: "Coverage check. Fix failing tests, clean code", phase: "Backend Core", minutes: 60, tag: "review" },
  { day: 45, title: "Project: Job/Notes API start", detail: "Init repo: FastAPI + Postgres + JWT + docker-compose", phase: "Backend Core", minutes: 120, tag: "project" },
  { day: 46, title: "Project: core resources", detail: "Users + notes/jobs CRUD with ownership", phase: "Backend Core", minutes: 120, tag: "project" },
  { day: 47, title: "Project: polish + search", detail: "Search, filters, pagination, seed data", phase: "Backend Core", minutes: 120, tag: "project" },
  { day: 48, title: "Project: tests + docs", detail: "10 pytest tests. Write API README with endpoints table", phase: "Backend Core", minutes: 120, tag: "project" },
  { day: 49, title: "Push + demo", detail: "GitHub polish, architecture notes, loom-style demo script", phase: "Backend Core", minutes: 90, tag: "project" },
  { day: 50, title: "DSA: arrays + strings", detail: "15 problems: two-pointer, sliding window basics", phase: "Backend Core", minutes: 90, tag: "dsa" },
  { day: 51, title: "DSA: hashmap + sets", detail: "15 problems: frequency maps, dedupe, lookups", phase: "Backend Core", minutes: 90, tag: "dsa" },
  { day: 52, title: "DSA: SQL interview queries", detail: "Top 20 interview SQL: joins, rank, top-N per group", phase: "Backend Core", minutes: 90, tag: "dsa" },
  { day: 53, title: "Weekly review", detail: "Mock: explain your API design in 5 minutes", phase: "Backend Core", minutes: 60, tag: "review" },
  { day: 54, title: "CORS, rate limit, security basics", detail: "CORS, env secrets, SQL injection safety, password rules", phase: "Backend Core", minutes: 90, tag: "fastapi" },
  { day: 55, title: "Background tasks intro", detail: "FastAPI BackgroundTasks: welcome email / report job", phase: "Backend Core", minutes: 90, tag: "fastapi" },
  { day: 56, title: "Buffer / catch-up", detail: "Finish unticked backend topics. They auto-carry to today", phase: "Backend Core", minutes: 90, tag: "review" },
  { day: 57, title: "Buffer / catch-up 2", detail: "Extra API practice + tests", phase: "Backend Core", minutes: 90, tag: "review" },
  { day: 58, title: "Phase 2 checkpoint", detail: "Live demo to a friend: signup → login → CRUD → tests pass", phase: "Backend Core", minutes: 60, tag: "review" },
  { day: 59, title: "Docker preview", detail: "Install Docker. Run postgres + hello container", phase: "Backend Core", minutes: 90, tag: "docker" },
  { day: 60, title: "Rest + plan cloud phase", detail: "Light revision. List questions for cloud phase", phase: "Backend Core", minutes: 60, tag: "review" },

  // ---- DAYS 61-90 : Cloud + Job Ready ----
  { day: 61, title: "Docker: first container", detail: "Dockerfile concepts: image, container, volume, port", phase: "Cloud + Job Ready", minutes: 90, tag: "docker" },
  { day: 62, title: "Dockerize your FastAPI", detail: "Write Dockerfile for API. Build + run locally", phase: "Cloud + Job Ready", minutes: 120, tag: "docker" },
  { day: 63, title: "Compose: API + DB together", detail: "docker-compose.yml with api + postgres + volumes", phase: "Cloud + Job Ready", minutes: 120, tag: "docker" },
  { day: 64, title: "Weekly review", detail: "Teardown + rebuild from scratch to prove it works", phase: "Cloud + Job Ready", minutes: 60, tag: "review" },
  { day: 65, title: "AWS basics: IAM + EC2", detail: "IAM user, security groups, launch EC2, SSH", phase: "Cloud + Job Ready", minutes: 120, tag: "aws" },
  { day: 66, title: "S3: file uploads from API", detail: "Bucket + presigned URLs. Upload endpoint uses S3", phase: "Cloud + Job Ready", minutes: 120, tag: "aws" },
  { day: 67, title: "RDS: cloud Postgres", detail: "Create RDS Postgres. Connect API with DATABASE_URL", phase: "Cloud + Job Ready", minutes: 120, tag: "aws" },
  { day: 68, title: "Deploy API live", detail: "Deploy to Render/Railway/EC2. Live URL + /docs works", phase: "Cloud + Job Ready", minutes: 120, tag: "deploy" },
  { day: 69, title: "CI: GitHub Actions test on push", detail: "Workflow: install → pytest → build docker", phase: "Cloud + Job Ready", minutes: 90, tag: "deploy" },
  { day: 70, title: "Redis: cache 1 route", detail: "Redis container. Cache GET list endpoint, invalidate on write", phase: "Cloud + Job Ready", minutes: 90, tag: "redis" },
  { day: 71, title: "Weekly review: live URL must work", detail: "Test live API end-to-end. Fix env + CORS + DB URL", phase: "Cloud + Job Ready", minutes: 60, tag: "review" },
  { day: 72, title: "Project 2: extend API with S3", detail: "Add avatar/doc upload to S3 with DB reference", phase: "Cloud + Job Ready", minutes: 120, tag: "project" },
  { day: 73, title: "Project 2: Redis + jobs", detail: "Add caching + background report endpoint", phase: "Cloud + Job Ready", minutes: 120, tag: "project" },
  { day: 74, title: "Monitoring + logs", detail: "Health check /health, structured logs, uptime check", phase: "Cloud + Job Ready", minutes: 90, tag: "deploy" },
  { day: 75, title: "System design basics", detail: "API → DB → cache → S3 diagram. Explain scaling simply", phase: "Cloud + Job Ready", minutes: 90, tag: "design" },
  { day: 76, title: "Resume v1", detail: "1 page: skills, 2 projects with live + GitHub links", phase: "Cloud + Job Ready", minutes: 120, tag: "career" },
  { day: 77, title: "LinkedIn + GitHub polish", detail: "Pin 2 repos, write project posts, clean profile", phase: "Cloud + Job Ready", minutes: 90, tag: "career" },
  { day: 78, title: "Apply sprint start: 10/day", detail: "Startups + internships. Track in sheet. Tailor resume", phase: "Cloud + Job Ready", minutes: 120, tag: "career" },
  { day: 79, title: "Mock interviews 1", detail: "Intro + project walkthrough + 2 DSA + 5 SQL", phase: "Cloud + Job Ready", minutes: 120, tag: "career" },
  { day: 80, title: "Mock interviews 2", detail: "FastAPI + Postgres + Docker + AWS questions", phase: "Cloud + Job Ready", minutes: 120, tag: "career" },
  { day: 81, title: "DSA sprint: mixed set", detail: "20 mixed problems timed", phase: "Cloud + Job Ready", minutes: 90, tag: "dsa" },
  { day: 82, title: "SQL sprint: mixed set", detail: "20 queries timed. Window functions intro", phase: "Cloud + Job Ready", minutes: 90, tag: "dsa" },
  { day: 83, title: "Freelance / internship task", detail: "Do 1 free task for experience: small API for someone", phase: "Cloud + Job Ready", minutes: 120, tag: "career" },
  { day: 84, title: "Weekly review", detail: "Fix resume + projects from feedback", phase: "Cloud + Job Ready", minutes: 60, tag: "review" },
  { day: 85, title: "AI tools mastery", detail: "Use AI for tests, docs, debugging — but understand every line", phase: "Cloud + Job Ready", minutes: 90, tag: "career" },
  { day: 86, title: "Final polish: docs + demo", detail: "Record 3-min demo. Write deployment + architecture notes", phase: "Cloud + Job Ready", minutes: 120, tag: "project" },
  { day: 87, title: "Apply sprint: referrals", detail: "Message 10 devs with specific project question + ask referral", phase: "Cloud + Job Ready", minutes: 120, tag: "career" },
  { day: 88, title: "Checkpoint: 2 live projects?", detail: "Verify: live URL, tests pass, README, resume ready", phase: "Cloud + Job Ready", minutes: 60, tag: "review" },
  { day: 89, title: "USA path planning", detail: "1-2 yrs job → MS in CS (F1) → OPT → H1B, or L1 via multinational", phase: "Cloud + Job Ready", minutes: 60, tag: "career" },
  { day: 90, title: "Day 90: ship + celebrate + next 30", detail: "Post journey, set next goals: k8s basics, terraform, system design", phase: "Cloud + Job Ready", minutes: 60, tag: "review" },
];

export function dateForDay(day: number): Date {
  const start = new Date(START_DATE_ISO + "T00:00:00");
  const d = new Date(start);
  d.setDate(d.getDate() + (day - 1));
  return d;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDayLabel(d: Date): string {
  return d.toLocaleDateString("en-IN", { weekday: "short" });
}
