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

function serial(day: number): string {
  return `No. ${String(day).padStart(2, "0")}`;
}

const PHASES: ("All" | Phase)[] = ["All", "Python + SQL", "Backend Core", "Cloud + Job Ready"];
const CHAPTER: Record<Phase, string> = {
  "Python + SQL": "I",
  "Backend Core": "II",
  "Cloud + Job Ready": "III",
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
  const focus = [...overdue, ...enriched.filter((t) => t.isToday && !t.done)];

  const currentDayNo = useMemo(() => {
    let n = 0;
    for (const t of enriched) {
      if (t.date <= viewDate) n = t.day;
      else break;
    }
    return n;
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
    if (confirm("Saara hisaab mita dein? 90 din zero se shuru honge.")) setCompleted({});
  }

  const startDate = dateForDay(1);
  const endDate = dateForDay(90);
  const daysToStart = Math.round((startOfDay(startDate).getTime() - todayReal.getTime()) / 86400000);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-20 sm:px-8">
      {/* Dateline bar */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-ink)] py-2 font-ledger text-[11px] tracking-[0.14em] uppercase">
        <span>Vol. 1 · Nabbe din ka hisaab</span>
        <nav className="hidden items-center gap-4 sm:flex" aria-label="Sections">
          <a href="#panna" className="underline-offset-4 hover:underline">Aaj ka panna</a>
          <a href="#naksha" className="underline-offset-4 hover:underline">Naksha</a>
          <a href="#adhyay" className="underline-offset-4 hover:underline">Adhyay</a>
        </nav>
        <span className="hidden md:inline">4 Oct 2026 → 1 Jan 2027</span>
      </div>

      {/* Masthead */}
      <header className="pt-8 sm:pt-12">
        <p className="inline-block border border-[var(--color-ink)] px-3 py-1 font-ledger text-[11px] font-bold tracking-[0.18em] uppercase">
          Backend + Cloud · Option A · FastAPI + Postgres
        </p>
        <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[0.95] font-black tracking-tight text-balance sm:text-7xl">
          Nabbe din,
          <br />
          ek register.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--color-inksoft)] sm:text-base">
          Roz ka kaam karo, mohar lagao. Jo chhoot jaye woh udhaar ki tarah agle din
          khud aa jayega — jab tak poora na ho, peecha nahi chhodega.
        </p>

        {/* Progress ledger */}
        <div className="rule-double mt-8 pt-5">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-6xl font-black tabular-nums sm:text-7xl">
                {doneCount}
              </span>
              <span className="font-display text-2xl font-bold text-[var(--color-inksoft)] tabular-nums">
                / 90
              </span>
            </div>
            <div className="pb-2 text-right font-ledger text-xs tracking-[0.14em] uppercase">
              <p>Day {currentDayNo} of 90 · {pct}% poora</p>
              <p className="mt-1 text-[var(--color-seal)]">
                {overdue.length === 0 ? "koi udhaar nahi" : `${overdue.length} udhaar baaki`}
              </p>
            </div>
          </div>
          <div className="ruler mt-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress">
            <div
              className="h-[10px] bg-[var(--color-ink)] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between font-ledger text-[11px] text-[var(--color-inksoft)]">
            <span>{formatDate(startDate)}</span>
            {daysToStart > 0 ? (
              <span className="font-bold text-[var(--color-seal)]">
                Shuru hone me {daysToStart} din
              </span>
            ) : (
              <span>Roz mohar lagao, silsila na todo</span>
            )}
            <span>{formatDate(endDate)}</span>
          </div>
        </div>
      </header>

      {/* Aaj ka panna */}
      <section id="panna" className="mt-10 scroll-mt-6 border-2 border-[var(--color-ink)] bg-[var(--color-parchment)] p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-ledger text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--color-seal)]">
              Aaj ka panna · Today&apos;s page
            </p>
            <h2 className="font-display mt-2 text-3xl font-black sm:text-4xl">
              {formatDate(viewDate)} <span className="text-[var(--color-inksoft)]">({formatDayLabel(viewDate)})</span>
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--color-inksoft)]">
              Neeche wahi kaam hain jo aaj ke hain ya pichhle dino se udhaar chale aa rahe hain.
              Pehle udhaar niptao.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={viewDateISO}
              onChange={(e) => e.target.value && setViewDateISO(e.target.value)}
              aria-label="Dekhne ki tareekh"
              className="border border-[var(--color-ink)] bg-[var(--color-paper)] px-3 py-2 font-ledger text-sm outline-none focus:border-[var(--color-seal)]"
            />
            <button
              onClick={() => setViewDateISO(toISODate(new Date()))}
              className="border border-[var(--color-ink)] bg-[var(--color-ink)] px-3 py-2 text-sm font-bold text-[var(--color-paper)] hover:bg-[var(--color-sealdeep)] hover:border-[var(--color-sealdeep)]"
            >
              Aaj
            </button>
          </div>
        </div>

        {focus.length === 0 ? (
          <div className="mt-6 border border-dashed border-[var(--color-inksoft)] p-6 text-center">
            <p className="font-display text-2xl font-black">Sab clear.</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-[var(--color-inksoft)]">
              Aaj koi udhaar nahi. Kal ka panna dekh lo, ya revise karke aaram karo.
            </p>
          </div>
        ) : (
          <ol className="mt-6">
            {focus.map((t, i) => (
              <li key={t.day} className="ledger-row row-in flex items-start gap-3 py-4 sm:gap-4" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggle(t.day)}
                  aria-label={`Day ${t.day} poora hua`}
                  data-done={t.done}
                  data-late={t.isOverdue && !t.done}
                  className="mohar mt-0.5"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-ledger text-xs font-bold">{serial(t.day)}</span>
                    {t.isOverdue ? (
                      <span className="stamp stamp-seal">Udhaar +{t.diffDays} din</span>
                    ) : (
                      <span className="stamp stamp-ink">Aaj ka</span>
                    )}
                  </div>
                  <p className={`font-display mt-1 text-lg leading-snug font-bold ${t.done ? "line-through opacity-50" : ""}`}>
                    {t.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-[var(--color-inksoft)]">{t.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex-1 border-b-2 border-[var(--color-ink)] pb-1">
            <span className="sr-only">Vishay dhoondho</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Dhoondho… jaise docker, sql, jwt"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--color-inksoft)]/70"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm whitespace-nowrap">
            <input
              type="checkbox"
              checked={hideDone}
              onChange={(e) => setHideDone(e.target.checked)}
              className="h-4 w-4 accent-[#b3351f]"
            />
            Poore chhupao
          </label>
          <button
            onClick={resetAll}
            className="text-sm text-[var(--color-inksoft)] underline underline-offset-4 hover:text-[var(--color-seal)] sm:ml-2"
          >
            Register reset karo
          </button>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Adhyay chuno">
          {PHASES.map((p) => (
            <button
              key={p}
              onClick={() => setPhaseFilter(p)}
              aria-pressed={phaseFilter === p}
              className={`shrink-0 border px-4 py-2 font-ledger text-xs font-bold tracking-[0.1em] uppercase transition ${
                phaseFilter === p
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                  : "border-[var(--color-ink)]/40 bg-transparent text-[var(--color-ink)] hover:border-[var(--color-ink)]"
              }`}
            >
              {p === "All" ? "Sab" : p}
            </button>
          ))}
        </div>
      </div>

      {/* Naksha */}
      <section id="naksha" className="mt-10 scroll-mt-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl font-black sm:text-4xl">Naksha.</h2>
          <p className="text-right font-ledger text-[11px] tracking-[0.14em] uppercase text-[var(--color-inksoft)]">
            Uplabdh register — dabao, mohar lagegi
          </p>
        </div>
        <div className="rule-single mt-3 pt-5">
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-9 lg:grid-cols-10">
            {enriched.map((t) => (
              <button
                key={t.day}
                title={`Day ${t.day}: ${t.title}`}
                onClick={() => toggle(t.day)}
                aria-label={`Day ${t.day} ${t.done ? "poora" : "baaki"}`}
                aria-pressed={t.done}
                className={`flex aspect-square flex-col items-center justify-center border font-ledger text-xs font-bold transition hover:-translate-y-0.5 ${
                  t.done
                    ? "border-[var(--color-leaf)] bg-[var(--color-leaf)] text-[var(--color-paper)]"
                    : t.isOverdue
                      ? "border-2 border-[var(--color-seal)] bg-transparent text-[var(--color-seal)]"
                      : toISODate(t.date) === toISODate(viewDate)
                        ? "border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                        : "border-[var(--color-ink)]/25 bg-transparent text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                }`}
              >
                {t.done ? "✓" : t.day}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-ledger text-[11px] tracking-wide text-[var(--color-inksoft)] uppercase">
            <span><span className="mr-1 inline-block h-2.5 w-2.5 bg-[var(--color-leaf)] align-middle" /> poora</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 border-2 border-[var(--color-seal)] align-middle" /> udhaar</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 bg-[var(--color-ink)] align-middle" /> dekh rahe ho</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 border border-[var(--color-ink)]/40 align-middle" /> aane wala</span>
          </div>
        </div>
      </section>

      {/* Adhyay */}
      <div id="adhyay" className="scroll-mt-6">
        {grouped.map(([phase, items]) => {
          const doneIn = items.filter((i) => i.done).length;
          const allDone = doneIn === items.length && items.length > 0;
          return (
            <section key={phase} className="mt-12">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-5xl font-black text-[var(--color-seal)]" aria-hidden>
                    {CHAPTER[phase]}
                  </span>
                  <div>
                    <h2 className="font-display text-3xl font-black sm:text-4xl">{phase}</h2>
                    <p className="mt-1 font-ledger text-xs tracking-[0.14em] uppercase text-[var(--color-inksoft)]">
                      {doneIn}/{items.length} poore {allDone && "· adhyay samapt"}
                    </p>
                  </div>
                </div>
                {allDone && <span className="stamp stamp-leaf">Samapt ✓</span>}
              </div>
              <ol className="mt-4">
                {items.map((t) => (
                  <li key={t.day} className="ledger-row flex items-start gap-3 py-4 sm:gap-4">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggle(t.day)}
                      aria-label={`Day ${t.day} poora hua`}
                      data-done={t.done}
                      data-late={t.isOverdue && !t.done}
                      className="mohar mt-1"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-ledger text-[11px] tracking-[0.12em] text-[var(--color-inksoft)] uppercase">
                        {serial(t.day)} · {formatDayLabel(t.date)} {formatDate(t.date)} · {t.minutes} min · #{t.tag}
                      </p>
                      <p className={`font-display mt-1 text-xl leading-snug font-bold ${t.done ? "line-through opacity-50" : ""}`}>
                        {t.title}
                      </p>
                      <p className="mt-0.5 max-w-2xl text-sm leading-relaxed text-[var(--color-inksoft)]">
                        {t.detail}
                      </p>
                      {t.isOverdue && !t.done && (
                        <p className="mt-2">
                          <span className="stamp stamp-seal">
                            Tick nahi hua → {formatDate(viewDate)} ko aa gaya
                          </span>
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
        {grouped.length === 0 && (
          <div className="mt-12 border border-dashed border-[var(--color-inksoft)] p-8 text-center">
            <p className="font-display text-2xl font-black">Kuch nahi mila.</p>
            <p className="mt-1 text-sm text-[var(--color-inksoft)]">Khoj ya filter badal ke dekho.</p>
          </div>
        )}
      </div>

      {/* Colophon */}
      <footer className="rule-double mt-16 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 font-ledger text-[11px] tracking-[0.12em] uppercase text-[var(--color-inksoft)]">
          <span>Option A · FastAPI + Postgres</span>
          <span>{formatDate(startDate)} → {formatDate(endDate)}</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-inksoft)]">
          Roz register kholo, imaandaari se mohar lagao. Jo chhoda, woh kal milega —
          isiliye aaj ka kaam aaj niptao.
        </p>
      </footer>
    </div>
  );
}
