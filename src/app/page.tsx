"use client";

import { useEffect, useMemo, useState } from "react";
import { TASKS, dateForDay, formatDate, formatDayLabel, type Phase } from "@/data/tasks";

const STORAGE_KEY = "backend-calendar-progress-v1";

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const PHASES: ("All" | Phase)[] = ["All", "Python + SQL", "Backend Core", "Cloud + Job Ready"];

const PHASE_COLOR: Record<Phase, string> = {
  "Python + SQL": "text-sky-300 border-sky-400/30 bg-sky-400/10",
  "Backend Core": "text-violet-300 border-violet-400/30 bg-violet-400/10",
  "Cloud + Job Ready": "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
};

export default function Home() {
  const [completed, setCompleted] = useState<Record<number, boolean>>(() => {
    try {
      if (typeof window === "undefined") return {};
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as { completed?: Record<number, boolean> };
      return parsed.completed ?? {};
    } catch {
      return {};
    }
  });
  const [query, setQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<"All" | Phase>("All");
  const [hideDone, setHideDone] = useState(false);
  const [viewDateISO, setViewDateISO] = useState(() => toISODate(new Date()));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed }));
    } catch {
      // ignore
    }
  }, [completed]);

  const viewDate = useMemo(() => startOfDay(parseISODate(viewDateISO)), [viewDateISO]);
  const todayReal = useMemo(() => startOfDay(new Date()), []);

  const enriched = useMemo(() => {
    return TASKS.map((t) => {
      const date = startOfDay(dateForDay(t.day));
      const done = !!completed[t.day];
      const diffDays = Math.round((startOfDay(viewDate).getTime() - date.getTime()) / 86400000);
      const isOverdue = !done && date < startOfDay(viewDate);
      const isToday = toISODate(date) === toISODate(viewDate);
      return { ...t, date, done, diffDays, isOverdue, isToday };
    });
  }, [completed, viewDate]);

  const doneCount = enriched.filter((t) => t.done).length;
  const pct = Math.round((doneCount / TASKS.length) * 100);
  const overdue = enriched.filter((t) => t.isOverdue).sort((a, b) => a.day - b.day);
  const todayTasks = enriched.filter((t) => t.isToday);
  const focus = [...overdue, ...todayTasks.filter((t) => !t.done)];

  const streak = useMemo(() => {
    let s = 0;
    const sorted = [...enriched].sort((a, b) => a.day - b.day);
    for (const t of sorted) {
      if (t.date > viewDate) break;
      if (t.done) s += 1;
      else if (t.date < viewDate) {
        // missed day breaks streak only if it was scheduled before view date
        // keep counting only consecutive done from start
        continue;
      }
    }
    // simpler streak: consecutive done days ending at latest done
    let consec = 0;
    for (let i = sorted.length - 1; i >= 0; i--) {
      const t = sorted[i];
      if (t.date > viewDate) continue;
      if (t.done) consec += 1;
      else break;
    }
    return { total: s, consec };
  }, [enriched, viewDate]);

  const filtered = useMemo(() => {
    return enriched.filter((t) => {
      if (phaseFilter !== "All" && t.phase !== phaseFilter) return false;
      if (hideDone && t.done) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${t.day} ${t.title} ${t.detail} ${t.tag}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [enriched, phaseFilter, hideDone, query]);

  const grouped = useMemo(() => {
    const map = new Map<Phase, typeof enriched>();
    for (const t of filtered) {
      if (!map.has(t.phase)) map.set(t.phase, []);
      map.get(t.phase)!.push(t);
    }
    return [...map.entries()];
  }, [filtered]);

  function toggle(day: number) {
    setCompleted((prev) => ({ ...prev, [day]: !prev[day] }));
  }

  function resetAll() {
    if (confirm("Reset all 90 days progress?")) setCompleted({});
  }

  const startDate = dateForDay(1);
  const endDate = dateForDay(90);
  const daysToStart = Math.round((startOfDay(startDate).getTime() - todayReal.getTime()) / 86400000);

  return (
    <div className="relative min-h-screen">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-6 sm:px-8">
        {/* NAV */}
        <nav className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-xl font-black text-black shadow-lg shadow-orange-500/30">
              ⌁
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide">BACKEND + CLOUD</p>
              <p className="text-xs text-white/50">90-day tracker • Option A</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="glass rounded-full px-3 py-1.5 font-semibold text-amber-200">
              FastAPI + Postgres
            </span>
            <span className="glass hidden rounded-full px-3 py-1.5 text-white/60 sm:inline">
              Starts {formatDate(startDate)}
            </span>
          </div>
        </nav>

        {/* HERO */}
        <header className="mt-6 text-center sm:mt-10">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-amber-200 uppercase">
            ✦ Starts 4 Oct 2026 • auto carry-over on
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl leading-[1.05] font-black tracking-tight sm:text-6xl">
            <span className="gold-text">Backend + Cloud</span>
            <br />
            <span className="text-white">in 90 days.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
            Tick a topic when done. <span className="text-amber-200 font-semibold">Missed topics automatically carry to the next day</span> and
            sit in your Today Focus until you finish them. Progress saves in your browser.
          </p>

          {/* STATS */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="glass rounded-2xl p-4">
              <p className="text-2xl font-black text-white">{pct}%</p>
              <p className="text-xs text-white/50">{doneCount}/90 done</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-2xl font-black text-amber-300">{overdue.length}</p>
              <p className="text-xs text-white/50">carried over</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-2xl font-black text-emerald-300">{streak.consec}</p>
              <p className="text-xs text-white/50">day streak</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-2xl font-black text-violet-300">{90 - doneCount}</p>
              <p className="text-xs text-white/50">to go</p>
            </div>
          </div>

          <div className="mx-auto mt-4 max-w-3xl">
            <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-white/45">
              <span>{formatDate(startDate)} → {formatDate(endDate)}</span>
              {daysToStart > 0 ? (
                <span className="font-semibold text-amber-200">Starts in {daysToStart} day{daysToStart === 1 ? "" : "s"}</span>
              ) : (
                <span>Keep the chain going 🔥</span>
              )}
            </div>
          </div>
        </header>

        {/* TODAY FOCUS */}
        <section className="gold-border mt-10 rounded-3xl bg-gradient-to-b from-amber-300/[0.08] to-transparent p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-white sm:text-2xl">◉ Today Focus</h2>
              <p className="mt-1 text-sm text-white/55">
                Viewing <span className="font-bold text-white">{formatDate(viewDate)} ({formatDayLabel(viewDate)})</span>
                {" • "}missed topics carried here automatically
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={viewDateISO}
                onChange={(e) => e.target.value && setViewDateISO(e.target.value)}
                className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/60"
              />
              <button
                onClick={() => setViewDateISO(toISODate(new Date()))}
                className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/20"
              >
                Today
              </button>
            </div>
          </div>

          {focus.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5 text-center">
              <p className="text-lg font-black text-emerald-200">All clear ✨</p>
              <p className="mt-1 text-sm text-emerald-100/70">Nothing carried over and nothing scheduled. You are ahead — revise or rest.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-3">
              {focus.map((t) => (
                <div
                  key={t.day}
                  className="task-card glass flex items-start gap-4 rounded-2xl p-4"
                >
                  <button
                    onClick={() => toggle(t.day)}
                    aria-label={`tick day ${t.day}`}
                    className={`checkbox-tick mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 font-black ${
                      t.done
                        ? "border-emerald-300 bg-emerald-300 text-black"
                        : t.isOverdue
                          ? "border-rose-300/70 bg-rose-400/10 text-rose-200"
                          : "border-amber-300/70 bg-amber-300/10 text-amber-200"
                    }`}
                  >
                    {t.done ? "✓" : ""}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-black tracking-wider text-white/70">
                        DAY {t.day} • {formatDate(t.date)}
                      </span>
                      {t.isOverdue && (
                        <span className="rounded-full border border-rose-300/40 bg-rose-400/15 px-2.5 py-0.5 text-[11px] font-black text-rose-200">
                          ⏳ carried +{t.diffDays}d — finish me first
                        </span>
                      )}
                      {t.isToday && !t.isOverdue && (
                        <span className="rounded-full border border-amber-300/40 bg-amber-300/15 px-2.5 py-0.5 text-[11px] font-black text-amber-200">
                          ● scheduled today
                        </span>
                      )}
                    </div>
                    <p className={`mt-1.5 font-bold text-white ${t.done ? "line-through opacity-50" : ""}`}>
                      {t.title}
                    </p>
                    <p className="mt-0.5 text-sm text-white/55">{t.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CONTROLS */}
        <section className="mt-8 flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics… e.g. docker, sql, jwt"
              className="glass flex-1 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-amber-300/50"
            />
            <label className="glass flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-3 text-sm text-white/70">
              <input
                type="checkbox"
                checked={hideDone}
                onChange={(e) => setHideDone(e.target.checked)}
                className="h-4 w-4 accent-amber-400"
              />
              Hide completed
            </label>
            <button
              onClick={resetAll}
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white"
            >
              Reset
            </button>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {PHASES.map((p) => (
              <button
                key={p}
                onClick={() => setPhaseFilter(p)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black tracking-wide uppercase transition ${
                  phaseFilter === p
                    ? "border-amber-300 bg-amber-300 text-black shadow-lg shadow-amber-500/30"
                    : "border-white/12 bg-white/5 text-white/55 hover:border-white/25 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        {/* 90-DAY GRID */}
        <section className="glass mt-6 rounded-3xl p-5 sm:p-6">
          <h3 className="text-sm font-black tracking-widest text-white/60 uppercase">90-day map • click a day to tick</h3>
          <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-9 lg:grid-cols-10">
            {enriched.map((t) => (
              <button
                key={t.day}
                title={`Day ${t.day}: ${t.title}`}
                onClick={() => toggle(t.day)}
                className={`flex aspect-square flex-col items-center justify-center rounded-xl border text-[11px] font-black transition hover:scale-105 ${
                  t.done
                    ? "border-emerald-300/60 bg-emerald-300 text-black"
                    : t.isOverdue
                      ? "border-rose-300/50 bg-rose-400/15 text-rose-200"
                      : toISODate(t.date) === toISODate(viewDate)
                        ? "border-amber-300 bg-amber-300 text-black"
                        : "border-white/10 bg-white/5 text-white/55 hover:border-amber-300/40"
                }`}
              >
                {t.done ? "✓" : t.day}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-white/50">
            <span>🟩 done</span>
            <span>🟥 carried over (missed)</span>
            <span>🟨 viewing date</span>
            <span>⬜ upcoming</span>
          </div>
        </section>

        {/* FULL TIMELINE */}
        {grouped.map(([phase, items]) => (
          <section key={phase} className="mt-10">
            <div className="flex items-center gap-3">
              <span className={`rounded-full border px-3 py-1 text-[11px] font-black tracking-widest uppercase ${PHASE_COLOR[phase]}`}>
                {phase}
              </span>
              <span className="text-xs text-white/40">
                {items.filter((i) => i.done).length}/{items.length} done
              </span>
              <div className="h-px flex-1 bg-white/8" />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {items.map((t) => (
                <div
                  key={t.day}
                  className={`task-card glass rounded-2xl p-4 ${t.done ? "opacity-60" : ""} ${
                    t.isOverdue ? "border-rose-300/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggle(t.day)}
                      aria-label={`tick day ${t.day}`}
                      className={`checkbox-tick flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black ${
                        t.done
                          ? "border-emerald-300 bg-emerald-300 text-black"
                          : "border-white/25 bg-white/5 text-transparent hover:border-emerald-300"
                      }`}
                    >
                      ✓
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold tracking-wider text-white/40">
                        DAY {t.day} • {formatDayLabel(t.date)} {formatDate(t.date)} • {t.minutes} min • #{t.tag}
                      </p>
                      <p className={`mt-1 font-bold text-white ${t.done ? "line-through" : ""}`}>{t.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/55">{t.detail}</p>
                      {t.isOverdue && !t.done && (
                        <p className="mt-2 inline-block rounded-full bg-rose-400/15 px-2.5 py-1 text-[11px] font-bold text-rose-200">
                          Not ticked → auto-moved to {formatDate(viewDate)}. Tick to clear.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <footer className="mt-14 text-center text-xs leading-relaxed text-white/35">
          <p>Built for Option A • FastAPI + Postgres • Starts 4 Oct 2026 • Ends {formatDate(dateForDay(90))}</p>
          <p className="mt-1">Tip: open this daily, tick honestly. What you skip today will wait for you tomorrow.</p>
        </footer>
      </div>
    </div>
  );
}
