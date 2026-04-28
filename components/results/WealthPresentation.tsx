"use client";
/**
 * WealthPresentation.tsx
 * ----------------------
 * Client presentation component for PortfolioStress.
 * Drop into: stress-test-frontend/src/components/results/
 *
 * Usage:
 *   <WealthPresentation portfolioData={data} advisorMode={false} />
 *
 * Stack: Next.js · TypeScript · Tailwind CSS · Recharts
 * Theme: deep navy (#0A1628) + gold (#C9A84C) — private banking
 */

import React, { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface Allocation {
  name: string;
  pct:  number;   // 0-100
  color: string;
}

interface Performance {
  oneMonth: number;  // % e.g. 2.1
  ytd:      number;
  oneYear:  number;
  benchmark: { oneMonth: number; ytd: number; oneYear: number };
  benchmarkName: string;
}

interface ScenarioResult {
  id:              string;
  name:            string;
  year:            number;
  narrative:       string;
  severity:        number;   // 1-5
  impactUsd:       number;   // dollar amount (negative = loss)
  impactPct:       number;   // %
  impactBrl:       number;
  recoveryMonths:  number;
  recoveryNote:    string;
}

interface Goal {
  id:           string;
  name:         string;
  targetUsd:    number;
  targetDate:   string;   // ISO date
  currentUsd:   number;   // current portfolio value towards this goal
  annualReturn: number;   // assumed % p.a.
  atRisk?:      boolean;  // true when stressed
}

interface IlliquidAsset {
  label:       string;
  valueBrl:    number;
  haircut:     number;   // fraction e.g. 0.20
}

export interface PortfolioData {
  clientName:    string;
  advisorName:   string;
  date:          string;
  totalUsd:      number;
  brlPerUsd:     number;
  allocation:    Allocation[];
  performance:   Performance;
  scenarios:     ScenarioResult[];
  goals:         Goal[];
  illiquidAssets: IlliquidAsset[];
  recommendedAction?: string;
}

interface Props {
  portfolioData: PortfolioData;
  advisorMode?:  boolean;  // reveals compliance audit section
}

// ─────────────────────────────────────────────
// Sample data — renders without a backend
// ─────────────────────────────────────────────

export const SAMPLE_DATA: PortfolioData = {
  clientName:  "Família Silva",
  advisorName: "Rodrigo Mendes",
  date:        new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  totalUsd:    3_050_000,
  brlPerUsd:   5.18,
  allocation: [
    { name: "US Equities",      pct: 38, color: "#C9A84C" },
    { name: "Fixed Income",     pct: 28, color: "#4A7FC1" },
    { name: "International EQ", pct: 18, color: "#6DB87A" },
    { name: "Cash & Equiv.",    pct: 10, color: "#8888AA" },
    { name: "Alternatives",     pct:  6, color: "#E07070" },
  ],
  performance: {
    oneMonth:  1.4,
    ytd:       6.8,
    oneYear:   11.2,
    benchmark: { oneMonth: 0.9, ytd: 5.1, oneYear: 9.4 },
    benchmarkName: "60/40 Blend",
  },
  scenarios: [
    {
      id: "2015_brazil_crisis",
      name: "2015 — Brazil Fiscal Crisis",
      year: 2015,
      narrative:
        "This is the scenario that shows why offshore USD diversification matters. While Brazilian assets collapsed, USD portfolios held their value — and in BRL terms, a flat USD portfolio looked like a 47% gain.",
      severity: 4,
      impactUsd:  -183_000,
      impactPct:  -6.0,
      impactBrl:   672_000,
      recoveryMonths: 36,
      recoveryNote: "Ibovespa in USD terms took until 2019 to fully recover",
    },
    {
      id: "2008_global_crisis",
      name: "2008 — Global Financial Crisis",
      year: 2008,
      narrative:
        "The 2008 crisis hit hard but briefly. Brazil recovered within 14 months, faster than the US or Europe. Clients who held through the panic came out whole.",
      severity: 5,
      impactUsd:  -977_000,
      impactPct:  -32.0,
      impactBrl:  -3_870_000,
      recoveryMonths: 14,
      recoveryNote: "Ibovespa recovered to pre-crisis levels by early 2010",
    },
    {
      id: "2018_election_shock",
      name: "2018 — Election Uncertainty",
      year: 2018,
      narrative:
        "A sharp but brief shock. Well-diversified offshore portfolios barely noticed. This is a good example of political risk that looks scary but doesn't last.",
      severity: 2,
      impactUsd:  -122_000,
      impactPct:  -4.0,
      impactBrl:  -318_000,
      recoveryMonths: 6,
      recoveryNote: "Ibovespa rallied strongly post-election on reform optimism",
    },
    {
      id: "2020_covid",
      name: "2020 — COVID-19 Pandemic",
      year: 2020,
      narrative:
        "The fastest crash and recovery in history. Portfolios were back to pre-crisis levels within 6 months. Clients who panicked and sold locked in permanent losses.",
      severity: 4,
      impactUsd:  -793_000,
      impactPct:  -26.0,
      impactBrl:  -2_612_000,
      recoveryMonths: 6,
      recoveryNote: "Global stimulus drove fastest equity market recovery in history",
    },
  ],
  goals: [
    {
      id: "1",
      name: "Harvard Education Fund — 2030",
      targetUsd: 400_000,
      targetDate: "2030-09-01",
      currentUsd: 280_000,
      annualReturn: 7,
    },
    {
      id: "2",
      name: "Retirement Target",
      targetUsd: 5_000_000,
      targetDate: "2038-01-01",
      currentUsd: 3_050_000,
      annualReturn: 6.5,
    },
  ],
  illiquidAssets: [
    { label: "São Paulo Real Estate",   valueBrl: 4_200_000, haircut: 0.20 },
    { label: "Family Business Stake",   valueBrl: 8_500_000, haircut: 0.35 },
    { label: "Tesouro Direto (Brazil)", valueBrl: 1_100_000, haircut: 0.05 },
  ],
  recommendedAction:
    "Reduce US equity concentration from 38% to 30%. Rotate $240K into short-duration investment-grade bonds to improve resilience in a 2008-style scenario.",
};

// ─────────────────────────────────────────────
// Formatting helpers
// ─────────────────────────────────────────────

const fmtUsd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtBrl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

const fmtPct = (n: number, showSign = true) =>
  `${showSign && n > 0 ? "+" : ""}${n.toFixed(1)}%`;

const yearsUntil = (isoDate: string) => {
  const diff = new Date(isoDate).getTime() - Date.now();
  return Math.max(0, diff / (1000 * 60 * 60 * 24 * 365.25));
};

const projectValue = (current: number, annualReturn: number, years: number) =>
  current * Math.pow(1 + annualReturn / 100, years);

const severityLabel = (s: number) =>
  ["", "Mild", "Moderate", "Significant", "Severe", "Extreme"][s] ?? "";

const severityColor = (s: number) =>
  ["", "text-green-400", "text-yellow-300", "text-orange-400", "text-red-400", "text-red-600"][s] ?? "";

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide ${className}`}>
    {children}
  </span>
);

const Section = ({ title, children, printHide = false }: {
  title: string; children: React.ReactNode; printHide?: boolean;
}) => (
  <div className={`mb-8 ${printHide ? "print:hidden" : ""}`}>
    <h2 className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-4 border-b border-white/10 pb-2">
      {title}
    </h2>
    {children}
  </div>
);

// ── 1. Header ──────────────────────────────────────────────────────────────

const Header = ({ data, brl, onBrlChange }: {
  data: PortfolioData; brl: number; onBrlChange: (v: number) => void;
}) => {
  const totalBrl = data.totalUsd * brl;
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 print:flex-row">
      <div>
        <p className="text-xs text-yellow-500 uppercase tracking-widest mb-1">Portfolio Review</p>
        <h1 className="text-3xl font-serif text-white font-bold">{data.clientName}</h1>
        <p className="text-slate-400 text-sm mt-1">{data.date} · Advisor: {data.advisorName}</p>
      </div>
      <div className="text-right">
        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Portfolio Value</p>
        <p className="text-4xl font-bold text-white">{fmtUsd(data.totalUsd)}</p>
        <p className="text-yellow-400 text-lg">{fmtBrl(totalBrl)}</p>
        <div className="mt-2 flex items-center gap-2 justify-end print:hidden">
          <label className="text-xs text-slate-400">R$/USD</label>
          <input
            type="number"
            step="0.01"
            value={brl}
            onChange={(e) => onBrlChange(parseFloat(e.target.value) || 5.2)}
            className="w-20 text-xs text-right bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
          />
        </div>
      </div>
    </div>
  );
};

// ── 2. Performance bar ─────────────────────────────────────────────────────

const PerformanceBar = ({ perf }: { perf: Performance }) => {
  const rows = [
    { label: "1 Month",  port: perf.oneMonth,  bench: perf.benchmark.oneMonth },
    { label: "YTD",      port: perf.ytd,        bench: perf.benchmark.ytd },
    { label: "1 Year",   port: perf.oneYear,    bench: perf.benchmark.oneYear },
  ];
  return (
    <Section title="Performance">
      <div className="grid grid-cols-3 gap-4">
        {rows.map((r) => (
          <div key={r.label} className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">{r.label}</p>
            <p className={`text-2xl font-bold ${r.port >= r.bench ? "text-green-400" : "text-red-400"}`}>
              {fmtPct(r.port)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Benchmark {fmtPct(r.bench)} ({perf.benchmarkName})
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

// ── 3. Allocation donut ────────────────────────────────────────────────────

const AllocationDonut = ({ allocation }: { allocation: Allocation[] }) => (
  <Section title="Allocation">
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="w-48 h-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={allocation} dataKey="pct" cx="50%" cy="50%" innerRadius={52} outerRadius={72} strokeWidth={0}>
              {allocation.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => [`${v}%`, ""]}
              contentStyle={{ background: "#0A1628", border: "1px solid #C9A84C33", color: "#fff", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 grid grid-cols-1 gap-2 w-full">
        {allocation.map((a) => (
          <div key={a.name} className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: a.color }} />
            <span className="text-sm text-slate-300 flex-1">{a.name}</span>
            <span className="text-sm font-bold text-white">{a.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

// ── 4. Stress scenarios ────────────────────────────────────────────────────

const ScenarioCard = ({
  s, totalUsd, brl, expanded, onToggle,
}: {
  s: ScenarioResult; totalUsd: number; brl: number; expanded: boolean; onToggle: () => void;
}) => {
  const stressed = totalUsd + s.impactUsd;
  const stressedBrl = stressed * brl;
  const brlImpactPositive = s.impactBrl > 0;

  return (
    <div
      className="bg-white/5 rounded-xl p-5 cursor-pointer hover:bg-white/[0.08] transition-colors border border-white/10 hover:border-yellow-500/30"
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-white font-semibold text-sm">{s.name}</span>
            <Badge className={`${severityColor(s.severity)} bg-white/10`}>
              {severityLabel(s.severity)}
            </Badge>
          </div>
          <div className="flex gap-6 flex-wrap mt-2">
            <div>
              <p className="text-xs text-slate-400">Impact USD</p>
              <p className={`text-xl font-bold ${s.impactPct < -15 ? "text-red-400" : s.impactPct < -5 ? "text-orange-400" : "text-yellow-300"}`}>
                {fmtPct(s.impactPct)} · {fmtUsd(s.impactUsd)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Impact BRL</p>
              <p className={`text-xl font-bold ${brlImpactPositive ? "text-green-400" : "text-red-400"}`}>
                {fmtBrl(s.impactBrl)}
              </p>
              {brlImpactPositive && (
                <p className="text-xs text-green-500 mt-0.5">↑ BRL depreciation offset</p>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-400">Recovery</p>
              <p className="text-xl font-bold text-slate-300">{s.recoveryMonths} months</p>
            </div>
          </div>
        </div>
        <span className="text-slate-500 text-lg mt-1">{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          <p className="text-slate-300 text-sm leading-relaxed italic">"{s.narrative}"</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Stressed Portfolio (USD)</p>
              <p className="font-bold text-white">{fmtUsd(stressed)}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Stressed Portfolio (BRL)</p>
              <p className="font-bold text-yellow-300">{fmtBrl(stressedBrl)}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">{s.recoveryNote}</p>
        </div>
      )}
    </div>
  );
};

const StressScenarios = ({ scenarios, totalUsd, brl }: {
  scenarios: ScenarioResult[]; totalUsd: number; brl: number;
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  return (
    <Section title="Stress Scenarios — What If?">
      <div className="space-y-3">
        {scenarios.map((s) => (
          <ScenarioCard
            key={s.id} s={s} totalUsd={totalUsd} brl={brl}
            expanded={expandedId === s.id}
            onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
          />
        ))}
      </div>
    </Section>
  );
};

// ── 5. Iceberg — total wealth view ─────────────────────────────────────────

const IcebergView = ({ totalUsd, brl, illiquidAssets, activeScenarioHaircut }: {
  totalUsd: number; brl: number;
  illiquidAssets: IlliquidAsset[];
  activeScenarioHaircut: number;
}) => {
  const [showStressed, setShowStressed] = useState(false);

  const illiquidTotalBrl = illiquidAssets.reduce((s, a) => s + a.valueBrl, 0);
  const illiquidTotalUsd = illiquidTotalBrl / brl;

  const total = totalUsd + illiquidTotalUsd;
  const liquidPct = (totalUsd / total) * 100;

  const barData = illiquidAssets.map((a) => ({
    name: a.label,
    original: a.valueBrl / 1_000_000,
    stressed: a.valueBrl * (1 - a.haircut) * (1 - activeScenarioHaircut) / 1_000_000,
  }));

  return (
    <Section title="Total Wealth — The Full Picture">
      <p className="text-xs text-slate-400 mb-4">
        Your managed portfolio is only part of the picture. Including estimated illiquid assets:
      </p>

      <div className="flex flex-col items-center mb-6">
        <div className="w-full max-w-md">
          <div
            className="bg-yellow-500/80 rounded-t-2xl flex items-center justify-center p-4 text-center"
            style={{ height: `${Math.max(liquidPct * 1.2, 80)}px` }}
          >
            <div>
              <p className="text-xs font-bold text-yellow-900 uppercase tracking-wide">Managed Portfolio</p>
              <p className="text-2xl font-bold text-yellow-900">{fmtUsd(totalUsd)}</p>
              <p className="text-xs text-yellow-800">{fmtBrl(totalUsd * brl)}</p>
            </div>
          </div>
          <div className="h-1 bg-blue-400/60 relative">
            <span className="absolute right-2 -top-3 text-xs text-blue-300">waterline</span>
          </div>
          <div className="bg-blue-900/60 rounded-b-2xl flex items-center justify-center p-4 text-center border border-blue-400/20"
               style={{ height: `${Math.max((100 - liquidPct) * 1.2, 80)}px` }}>
            <div>
              <p className="text-xs font-bold text-blue-200 uppercase tracking-wide">Illiquid Assets (estimated)</p>
              <p className="text-2xl font-bold text-blue-200">{fmtBrl(illiquidTotalBrl)}</p>
              <p className="text-xs text-blue-300">≈ {fmtUsd(illiquidTotalUsd)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-slate-400">Show stressed values</span>
        <button
          onClick={() => setShowStressed(!showStressed)}
          className={`w-10 h-5 rounded-full transition-colors ${showStressed ? "bg-yellow-500" : "bg-white/20"}`}
        >
          <span className={`block w-4 h-4 bg-white rounded-full ml-0.5 transition-transform ${showStressed ? "translate-x-5" : ""}`} />
        </button>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
          <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => `R$${v}M`} />
          <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} width={140} />
          <Tooltip
            contentStyle={{ background: "#0A1628", border: "1px solid #C9A84C33", color: "#fff", fontSize: 11 }}
            formatter={(v) => [`R$ ${Number(v).toFixed(2)}M`, ""]}
          />
          <Bar dataKey="original" name="Current" fill="#C9A84C" radius={[0, 4, 4, 0]} />
          {showStressed && <Bar dataKey="stressed" name="Stressed" fill="#4A7FC1" radius={[0, 4, 4, 0]} />}
        </BarChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-500 mt-3">
        * Stressed values apply standard haircuts: real estate -20%, business stake -35%.
        These are estimates and should not be relied upon for accounting purposes.
      </p>
    </Section>
  );
};

// ── 6. Goal tracker ────────────────────────────────────────────────────────

const GoalTracker = ({ goals, scenarios }: {
  goals: Goal[]; scenarios: ScenarioResult[]; totalUsd: number;
}) => {
  const worstScenario = scenarios.reduce(
    (w, s) => s.impactPct < w.impactPct ? s : w,
    scenarios[0]
  );

  return (
    <Section title="Your Goals — Are You on Track?">
      <div className="space-y-5">
        {goals.map((g) => {
          const years = yearsUntil(g.targetDate);
          const projected = projectValue(g.currentUsd, g.annualReturn, years);
          const onTrack = projected >= g.targetUsd;
          const progressPct = Math.min((g.currentUsd / g.targetUsd) * 100, 100);

          const stressedCurrent = g.currentUsd * (1 + worstScenario.impactPct / 100);
          const stressedProjected = projectValue(stressedCurrent, g.annualReturn, years);
          const stressedOnTrack = stressedProjected >= g.targetUsd;

          const targetYear = new Date(g.targetDate).getFullYear();

          return (
            <div key={g.id} className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-white">{g.name}</p>
                  <p className="text-xs text-slate-400">Target: {fmtUsd(g.targetUsd)} by {targetYear}</p>
                </div>
                <Badge className={onTrack ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                  {onTrack ? "On Track" : "At Risk"}
                </Badge>
              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${onTrack ? "bg-green-500" : "bg-orange-500"}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Today</p>
                  <p className="font-bold text-white">{fmtUsd(g.currentUsd)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Projected ({g.annualReturn}% p.a.)</p>
                  <p className={`font-bold ${onTrack ? "text-green-400" : "text-orange-400"}`}>
                    {fmtUsd(projected)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">After Worst Scenario</p>
                  <p className={`font-bold ${stressedOnTrack ? "text-yellow-300" : "text-red-400"}`}>
                    {fmtUsd(stressedProjected)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Years to Goal</p>
                  <p className="font-bold text-slate-300">{years.toFixed(1)} yrs</p>
                </div>
              </div>

              {!stressedOnTrack && (
                <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-xs text-red-300">
                  ⚠ In a {worstScenario.name} scenario, this goal may be at risk. Consider reviewing contributions or timeline.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
};

// ── 7. PDF summary panel ───────────────────────────────────────────────────

const PdfSummary = ({
  data, brl, recommendedAction,
}: {
  data: PortfolioData; brl: number; recommendedAction: string;
}) => {
  const worstScenario = data.scenarios.reduce(
    (w, s) => s.impactPct < w.impactPct ? s : w,
    data.scenarios[0]
  );

  return (
    <Section title="One-Page Summary">
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Export PDF
        </button>
      </div>

      <div id="pdf-summary" className="bg-white/5 rounded-2xl p-6 border border-white/10 print:bg-white print:text-black print:border-0 print:p-8">
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10 print:border-gray-200">
          <div>
            <p className="text-xs text-yellow-500 print:text-gray-500 uppercase tracking-widest">Bradesco BAC Florida</p>
            <h2 className="text-xl font-serif font-bold text-white print:text-black">{data.clientName}</h2>
            <p className="text-xs text-slate-400 print:text-gray-500">{data.date} · {data.advisorName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white print:text-black">{fmtUsd(data.totalUsd)}</p>
            <p className="text-yellow-400 print:text-gray-600 text-sm">{fmtBrl(data.totalUsd * brl)}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "YTD Return",    value: fmtPct(data.performance.ytd),    ok: data.performance.ytd >= data.performance.benchmark.ytd },
            { label: "1-Year Return", value: fmtPct(data.performance.oneYear), ok: data.performance.oneYear >= data.performance.benchmark.oneYear },
            { label: "vs Benchmark",  value: fmtPct(data.performance.oneYear - data.performance.benchmark.oneYear, true), ok: data.performance.oneYear >= data.performance.benchmark.oneYear },
          ].map((k) => (
            <div key={k.label} className="bg-white/5 print:bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-400 print:text-gray-500">{k.label}</p>
              <p className={`text-lg font-bold ${k.ok ? "text-green-400 print:text-green-700" : "text-red-400 print:text-red-700"}`}>
                {k.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-orange-500/10 print:bg-orange-50 border border-orange-500/20 print:border-orange-200 rounded-lg p-3 mb-5">
          <p className="text-xs font-bold text-orange-300 print:text-orange-700 uppercase tracking-wide mb-1">
            Worst-Case Scenario — {worstScenario.name}
          </p>
          <p className="text-sm text-slate-200 print:text-gray-700">
            Portfolio impact: <strong>{fmtPct(worstScenario.impactPct)}</strong> ({fmtUsd(worstScenario.impactUsd)}) ·
            Recovery: ~{worstScenario.recoveryMonths} months
          </p>
        </div>

        <div className="bg-yellow-500/10 print:bg-yellow-50 border border-yellow-500/20 print:border-yellow-200 rounded-lg p-3 mb-5">
          <p className="text-xs font-bold text-yellow-400 print:text-yellow-700 uppercase tracking-wide mb-1">
            Recommended Action
          </p>
          <p className="text-sm text-slate-200 print:text-gray-700">{recommendedAction}</p>
        </div>

        <p className="text-xs text-slate-500 print:text-gray-400 mt-4 leading-relaxed">
          This document is prepared for informational purposes only and does not constitute investment advice.
          Past performance is not indicative of future results. Stress scenario results are hypothetical
          and based on historical market data. All investments carry risk including the possible loss of principal.
          Bradesco BAC Florida Bank · Coral Gables, FL · FINRA/SIPC member.
        </p>
      </div>
    </Section>
  );
};

// ── 8. Compliance audit trail (advisor-only) ───────────────────────────────

const AuditTrail = ({ data, brl }: { data: PortfolioData; brl: number }) => {
  const [riskNote, setRiskNote]         = useState("");
  const [instructions, setInstructions] = useState("");
  const [copied, setCopied]             = useState(false);

  const summary = `
MEETING SUMMARY — ${data.date}
Client: ${data.clientName}
Advisor: ${data.advisorName}
Portfolio Value: ${fmtUsd(data.totalUsd)} / ${fmtBrl(data.totalUsd * brl)}
BRL/USD Rate Used: ${brl.toFixed(4)}

SCENARIOS REVIEWED:
${data.scenarios.map((s) => `  • ${s.name}: ${fmtPct(s.impactPct)} impact`).join("\n")}

GOALS DISCUSSED:
${data.goals.map((g) => `  • ${g.name} (target ${fmtUsd(g.targetUsd)} by ${new Date(g.targetDate).getFullYear()})`).join("\n")}

CLIENT RISK TOLERANCE NOTE:
${riskNote || "(not recorded)"}

INSTRUCTIONS / DECISIONS:
${instructions || "(not recorded)"}

Generated: ${new Date().toISOString()}
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Section title="Compliance Audit Trail" printHide>
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5 space-y-4">
        <p className="text-xs text-yellow-400 uppercase tracking-wide font-bold">Advisor Only — Not Shown to Client</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Client's Stated Risk Tolerance</label>
            <textarea
              value={riskNote}
              onChange={(e) => setRiskNote(e.target.value)}
              placeholder="e.g. Conservative — client expressed concern about 2015-style BRL devaluation..."
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-sm text-white placeholder-slate-600 resize-none h-24"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Instructions / Decisions Made</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Client approved rebalancing to reduce equity from 38% to 30%..."
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-sm text-white placeholder-slate-600 resize-none h-24"
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-2">Auto-generated meeting summary (copy to CRM):</p>
          <pre className="bg-black/30 rounded-lg p-4 text-xs text-slate-300 overflow-auto max-h-48 whitespace-pre-wrap">
            {summary}
          </pre>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-sm font-semibold px-4 py-2 rounded-lg transition-colors border border-yellow-500/30"
        >
          {copied ? "✓ Copied!" : "Copy to Clipboard"}
        </button>

        <p className="text-xs text-slate-500">
          Timestamp: {new Date().toISOString()} · All fields are saved in-session only.
        </p>
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export default function WealthPresentation({
  portfolioData = SAMPLE_DATA,
  advisorMode   = false,
}: Props) {
  const [brl, setBrl] = useState(portfolioData.brlPerUsd);
  const [action, setAction] = useState(portfolioData.recommendedAction ?? "");

  const worstScenario = portfolioData.scenarios.reduce(
    (w, s) => s.impactPct < w.impactPct ? s : w,
    portfolioData.scenarios[0]
  );

  return (
    <>
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          #pdf-summary { page-break-inside: avoid; }
        }
      `}</style>

      <div className="min-h-screen bg-[#0A1628] text-white font-sans">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">

          <Header data={portfolioData} brl={brl} onBrlChange={setBrl} />

          <PerformanceBar perf={portfolioData.performance} />

          <AllocationDonut allocation={portfolioData.allocation} />

          <StressScenarios
            scenarios={portfolioData.scenarios}
            totalUsd={portfolioData.totalUsd}
            brl={brl}
          />

          <IcebergView
            totalUsd={portfolioData.totalUsd}
            brl={brl}
            illiquidAssets={portfolioData.illiquidAssets}
            activeScenarioHaircut={Math.abs(worstScenario.impactPct) / 100 * 0.5}
          />

          <GoalTracker
            goals={portfolioData.goals}
            scenarios={portfolioData.scenarios}
            totalUsd={portfolioData.totalUsd}
          />

          {advisorMode && (
            <Section title="Recommended Action">
              <textarea
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-sm text-white placeholder-slate-600 resize-none h-20"
                placeholder="Enter your recommendation for this client..."
              />
            </Section>
          )}

          <PdfSummary
            data={portfolioData}
            brl={brl}
            recommendedAction={action || portfolioData.recommendedAction || ""}
          />

          {advisorMode && <AuditTrail data={portfolioData} brl={brl} />}

        </div>
      </div>
    </>
  );
}
