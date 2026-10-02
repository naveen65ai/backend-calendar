"""Option A backend: FastAPI + Postgres progress API.

Run locally:
  cd backend
  pip install -r requirements.txt
  docker compose up -d        # starts postgres:16
  uvicorn main:app --reload

The Vercel-deployed UI works standalone (localStorage) and can point
to this API later via NEXT_PUBLIC_API_URL.
"""
import os
from datetime import date

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Column, Date, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tracker.db")

# Render/Railway provide postgres:// — SQLAlchemy needs postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()


class Progress(Base):
    __tablename__ = "progress"
    day = Column(Integer, primary_key=True)
    done = Column(Integer, default=0)
    completed_on = Column(Date, nullable=True)
    note = Column(String(500), default="")


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Backend Calendar Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ToggleIn(BaseModel):
    day: int
    done: bool


@app.get("/health")
def health():
    return {"ok": True, "db": DATABASE_URL.split("://")[0]}


@app.get("/progress")
def get_progress():
    db = SessionLocal()
    try:
        rows = db.query(Progress).all()
        return {r.day: bool(r.done) for r in rows}
    finally:
        db.close()


@app.post("/progress")
def set_progress(body: ToggleIn):
    db = SessionLocal()
    try:
        row = db.query(Progress).filter(Progress.day == body.day).first()
        if not row:
            row = Progress(day=body.day)
            db.add(row)
        row.done = 1 if body.done else 0
        row.completed_on = date.today() if body.done else None
        db.commit()
        return {"day": body.day, "done": body.done}
    finally:
        db.close()
