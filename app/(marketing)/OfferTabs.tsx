'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'

const MONO: CSSProperties = { fontFamily: 'var(--vantage-mono), "SF Mono", Menlo, monospace' }
const SERIF: CSSProperties = { fontFamily: 'var(--vantage-serif), Georgia, "Times New Roman", serif' }

// ── Visuals ───────────────────────────────────────────────────────────────────

function StressVisual() {
  const scenarios = [
    { name: '2008 GFC',   pct: 87, loss: '−32.4%' },
    { name: 'COVID-19',   pct: 52, loss: '−19.8%' },
    { name: 'Dot-Com',    pct: 73, loss: '−27.1%' },
    { name: 'Rate Shock', pct: 44, loss: '−16.3%' },
    { name: 'Custom',     pct: 31, loss: '−11.5%' },
  ]
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-4">
        Scenario Drawdown · Portfolio $2.4M
      </p>
      <div className="space-y-2.5">
        {scenarios.map((s) => (
          <div key={s.name} className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 w-20 shrink-0">{s.name}</span>
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#B91C1C] rounded-full" style={{ width: `${s.pct}%` }} />
            </div>
            <span className="text-[11px] tabular-nums text-[#B91C1C] w-12 text-right shrink-0" style={MONO}>
              {s.loss}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">Worst case (2008 GFC)</span>
        <span className="text-sm font-semibold tabular-nums text-[#B91C1C]" style={MONO}>−$561,600</span>
      </div>
    </div>
  )
}

function FactorVisual() {
  const factors = [
    { name: 'Market Beta', pct: 82, value: '−14.2%' },
    { name: 'Rate Risk',   pct: 55, value: '−5.1%'  },
    { name: 'Credit',      pct: 34, value: '−2.8%'  },
    { name: 'Inflation',   pct: 22, value: '−1.9%'  },
    { name: 'Growth',      pct: 16, value: '−1.4%'  },
  ]
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-4">
        Factor Attribution · 5-Factor Model
      </p>
      <div className="space-y-3">
        {factors.map((f) => (
          <div key={f.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-600">{f.name}</span>
              <span className="text-[11px] tabular-nums text-[#B91C1C]" style={MONO}>{f.value}</span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${f.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-slate-200">
        <span className="text-[10px] text-slate-400">Beta explains 82% of total portfolio risk</span>
      </div>
    </div>
  )
}

function MonteCarloVisual() {
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-4">
        Monte Carlo · 1,000 Paths · 12 Months
      </p>
      <svg viewBox="0 0 220 90" className="w-full h-20 mb-3" preserveAspectRatio="none">
        <polygon points="0,45 220,15 220,75 0,45" fill="#2563EB" fillOpacity="0.06" />
        <polygon points="0,45 220,25 220,65 0,45" fill="#2563EB" fillOpacity="0.08" />
        <polyline
          points="0,45 55,41 110,38 165,36 220,34"
          fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round"
        />
        <polyline
          points="0,45 55,56 110,68 165,76 220,82"
          fill="none" stroke="#B91C1C" strokeWidth="1" strokeDasharray="3,2" strokeLinejoin="round"
        />
      </svg>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'P50 (median)', value: '+8.4%',  color: '#2563EB' },
          { label: 'P95 upside',   value: '+24.1%', color: '#15803D' },
          { label: 'P5 tail',      value: '−31.2%', color: '#B91C1C' },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <p className="text-[10px] text-slate-400 mb-0.5">{m.label}</p>
            <p className="text-xs font-semibold tabular-nums" style={{ ...MONO, color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TaxVisual() {
  const rows = [
    { ticker: 'TSLA', unrealized: '−$38,200', harvest: '$14,400', loss: true },
    { ticker: 'ARKK', unrealized: '−$22,100', harvest: '$8,360',  loss: true },
    { ticker: 'META', unrealized: '+$91,400', harvest: '—',        loss: false },
    { ticker: 'VTI',  unrealized: '+$44,200', harvest: '—',        loss: false },
  ]
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Tax Harvest · FY 2024
      </p>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-slate-400 border-b border-slate-200">
            <th className="pb-2 text-left font-medium">Ticker</th>
            <th className="pb-2 text-right font-medium">Unrealized</th>
            <th className="pb-2 text-right font-medium">Harvest</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.ticker}>
              <td className="py-1.5 font-semibold text-[#0B1B2E]">{r.ticker}</td>
              <td className={`py-1.5 text-right tabular-nums ${r.loss ? 'text-[#B91C1C]' : 'text-[#15803D]'}`} style={MONO}>
                {r.unrealized}
              </td>
              <td className="py-1.5 text-right tabular-nums text-[#0B1B2E] font-medium" style={MONO}>
                {r.harvest}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">Total harvest opportunity</span>
        <span className="text-sm font-semibold tabular-nums text-[#15803D]" style={MONO}>$22,760</span>
      </div>
    </div>
  )
}

function RebalancingVisual() {
  const actions = [
    { action: 'REDUCE', ticker: 'TSLA', amount: '−$28,000', reason: 'Beta concentration' },
    { action: 'ADD',    ticker: 'TLT',  amount: '+$15,000', reason: 'Duration hedge'     },
    { action: 'ADD',    ticker: 'GLD',  amount: '+$12,000', reason: 'Inflation buffer'   },
    { action: 'REDUCE', ticker: 'ARKK', amount: '−$8,000',  reason: 'Illiquidity risk'   },
  ]
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Rebalancing Actions · Post-Stress
      </p>
      <div className="space-y-2">
        {actions.map((a) => (
          <div key={a.ticker} className="flex items-center gap-2 bg-white rounded-md border border-slate-100 px-3 py-2">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              a.action === 'ADD' ? 'bg-[#15803D]/10 text-[#15803D]' : 'bg-[#B91C1C]/10 text-[#B91C1C]'
            }`}>
              {a.action}
            </span>
            <span className="text-xs font-semibold text-[#0B1B2E] w-10 shrink-0">{a.ticker}</span>
            <span className="text-[11px] tabular-nums text-slate-600 flex-1" style={MONO}>{a.amount}</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline shrink-0">{a.reason}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ClientImpactVisual() {
  const metrics = [
    { label: 'Pre-stress probability',  value: '94%',   color: '#15803D' },
    { label: 'Post-stress probability', value: '67%',   color: '#B91C1C' },
    { label: 'Shortfall risk',          value: '+27pp', color: '#F59E08' },
  ]
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-4">
        Client Impact · Retirement Goal
      </p>
      <div className="flex items-center gap-5 mb-4">
        <div className="shrink-0 w-20 h-14">
          <svg viewBox="0 0 100 58" className="w-full h-full">
            <path d="M10,54 A44,44 0 0,1 90,54" fill="none" stroke="#E2E8F0" strokeWidth="9" strokeLinecap="round" />
            <path d="M10,54 A44,44 0 0,1 90,54" fill="none" stroke="#B91C1C" strokeWidth="9" strokeLinecap="round"
              strokeDasharray="110" strokeDashoffset="38" />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums text-[#B91C1C]" style={MONO}>67%</p>
          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">Goal probability<br />post-stress</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">{m.label}</span>
            <span className="text-[11px] font-semibold tabular-nums" style={{ ...MONO, color: m.color }}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AIMemoVisual() {
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-[#0B1B2E] flex items-center justify-center shrink-0">
          <span className="text-white text-[8px] font-bold">V</span>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          AI Analyst Memo · Vantage
        </p>
      </div>
      <div className="space-y-2.5 text-[11px] text-slate-600 leading-relaxed">
        <p>
          <span className="font-semibold text-[#0B1B2E]">Assessment: </span>
          Portfolio is heavily exposed to market beta (82% contribution). In a 2008-style shock, drawdown reaches{' '}
          <span className="font-mono text-[#B91C1C]">−23.4%</span>.
        </p>
        <p>
          <span className="font-semibold text-[#0B1B2E]">Key risk: </span>
          TSLA and ARKK drive correlated left-tail exposure. Stress correlation spikes to{' '}
          <span className="font-mono text-[#0B1B2E]">0.91</span>.
        </p>
        <p>
          <span className="font-semibold text-[#0B1B2E]">Action: </span>
          Reduce TSLA 12%, add TLT/GLD as hedge. Harvest ARKK for{' '}
          <span className="font-mono text-[#15803D]">$8.4K</span> in tax savings.
        </p>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-200">
        <span className="text-[10px] text-slate-400">92% confidence · 3 actionable trade ideas</span>
      </div>
    </div>
  )
}

function CompareVisual() {
  const portfolios = [
    { name: 'Current',  drawdown: '−23.4%', score: '6.2', color: '#B91C1C' },
    { name: 'Proposed', drawdown: '−14.1%', score: '8.1', color: '#15803D' },
  ]
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-4">
        Portfolio Comparison · 2008 GFC
      </p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {portfolios.map((p) => (
          <div key={p.name} className="bg-white rounded-md border border-slate-200 p-3">
            <p className="text-[11px] font-semibold text-[#0B1B2E] mb-2">{p.name}</p>
            <p className="text-lg font-semibold tabular-nums" style={{ ...MONO, color: p.color }}>{p.drawdown}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Max drawdown</p>
            <div className="mt-2 pt-2 border-t border-slate-100">
              <p className="text-[11px] text-slate-500">Health <span className="font-semibold text-[#0B1B2E]">{p.score}/10</span></p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-md px-3 py-2 text-center" style={{ background: 'rgba(21,128,61,0.08)' }}>
        <p className="text-[11px] font-semibold text-[#15803D]">Proposed reduces tail risk by 9.3pp</p>
      </div>
    </div>
  )
}

function PDFVisual() {
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-4">
        PDF Export · 3-Page Institutional Report
      </p>
      <div className="bg-white border border-slate-300 rounded-md p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <span className="text-xs font-bold tracking-[0.12em] text-[#0B1B2E]">VANTAGE</span>
          <span className="text-[10px] text-slate-400">Portfolio Risk Report</span>
        </div>
        <div className="space-y-1.5 mb-3">
          <div className="h-2 bg-slate-100 rounded w-3/4" />
          <div className="h-2 bg-slate-100 rounded w-1/2" />
          <div className="h-2 bg-slate-100 rounded w-5/6" />
          <div className="h-2 bg-slate-100 rounded w-2/3" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 bg-slate-50 rounded border border-slate-100" />
          <div className="h-12 bg-slate-50 rounded border border-slate-100" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500">
        <span>3-page branded PDF</span>
        <span className="text-slate-300">·</span>
        <span>Client-ready in 1 click</span>
      </div>
    </div>
  )
}

function CustodianVisual() {
  const accounts = [
    { name: 'Schwab',    status: 'connected', detail: '12 portfolios' },
    { name: 'Fidelity', status: 'connected', detail: '7 portfolios'  },
    { name: 'IB',       status: 'pending',   detail: 'Connecting...' },
    { name: 'Redtail',  status: 'coming',    detail: 'Coming soon'   },
  ]
  const dotColor: Record<string, string> = {
    connected: '#15803D',
    pending:   '#F59E08',
    coming:    '#CBD5E1',
  }
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Custodian Sync · Enterprise
      </p>
      <div className="space-y-2">
        {accounts.map((a) => (
          <div key={a.name} className="flex items-center gap-3 bg-white rounded-md border border-slate-100 px-3 py-2">
            <span className="block w-2 h-2 rounded-full shrink-0" style={{ background: dotColor[a.status] }} />
            <span className="text-xs font-semibold text-[#0B1B2E] flex-1">{a.name}</span>
            <span className="text-[10px] text-slate-400">{a.detail}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-200">
        <span className="text-[10px] text-slate-400">Auto-sync every 24 hours · Enterprise plan</span>
      </div>
    </div>
  )
}

function TabVisual({ id }: { id: string }) {
  switch (id) {
    case 'stress-testing': return <StressVisual />
    case 'factor-model':   return <FactorVisual />
    case 'monte-carlo':    return <MonteCarloVisual />
    case 'tax-impact':     return <TaxVisual />
    case 'rebalancing':    return <RebalancingVisual />
    case 'client-impact':  return <ClientImpactVisual />
    case 'ai-memo':        return <AIMemoVisual />
    case 'compare':        return <CompareVisual />
    case 'pdf-export':     return <PDFVisual />
    case 'custodian-sync': return <CustodianVisual />
    default:               return <StressVisual />
  }
}

// ── Tab data ───────────────────────────────────────────────────────────────────

type TabData = {
  id: string
  label: string
  headline: string
  bullets: string[]
  link: string
}

const TABS: TabData[] = [
  {
    id: 'stress-testing',
    label: 'Stress Testing',
    headline: 'Historical crises and custom scenarios, rendered in seconds',
    bullets: [
      '6 pre-built crises: 2008 GFC, COVID-19, Dot-Com, Black Monday, 2022 Rate Shock, Stagflation',
      'Plain-English custom scenario builder — describe any macro environment you fear',
      '6 factor sliders to fine-tune equity, rates, credit, commodities, FX, and volatility',
      'Drawdown, max loss, and recovery-time projections rendered in under 60 seconds',
    ],
    link: '/upload',
  },
  {
    id: 'factor-model',
    label: 'Factor Model',
    headline: 'Five-factor decomposition of every risk in your book',
    bullets: [
      'Decomposes portfolio risk into: market beta, rate sensitivity, inflation exposure, credit spread, and growth risk',
      'Visual attribution bars show which factor drives the most stress loss',
      'Stress correlations by factor — see how they spike in a crisis environment',
      'Updates dynamically for any scenario or custom shock input',
    ],
    link: '/results',
  },
  {
    id: 'monte-carlo',
    label: 'Monte Carlo',
    headline: 'One thousand paths. Every tail captured.',
    bullets: [
      '1,000 simulation paths over a 12-month horizon using historical covariance',
      'P5, P25, P50, P75, P95 outcomes displayed as a clean fan chart',
      'Tail-risk focus: P5 worst-case expressed in dollar terms, not just percentages',
      'Confidence bands let you show clients the full distribution of outcomes',
    ],
    link: '/results',
  },
  {
    id: 'tax-impact',
    label: 'Tax Impact',
    headline: 'Every stressed position, screened for harvest opportunity',
    bullets: [
      'Identifies positions with unrealized losses eligible for tax-loss harvesting',
      "Calculates estimated tax savings at your client's marginal rate",
      'Flags wash-sale risk and suggests equivalent replacement securities',
      'Integrates with rebalancing for a single, tax-aware action list',
    ],
    link: '/results',
  },
  {
    id: 'rebalancing',
    label: 'Rebalancing',
    headline: 'From analysis to action in one page',
    bullets: [
      'Post-stress rebalancing recommendations generated automatically from factor analysis',
      'Each trade ranked by risk-reduction impact per dollar transacted',
      'Tax-aware ordering: harvest losses first, defer gains where possible',
      'One-click copy for direct integration into your order management system',
    ],
    link: '/results',
  },
  {
    id: 'client-impact',
    label: 'Client Impact',
    headline: 'Translate risk into the language of goals',
    bullets: [
      'Shows how each stress scenario affects goal probability — retirement, education, liquidity',
      'Pre-stress vs post-stress comparison in plain percentage terms',
      'Shortfall risk expressed in dollar amounts and timeline shifts',
      'Designed to be shown directly to clients — no jargon, just clarity',
    ],
    link: '/results',
  },
  {
    id: 'ai-memo',
    label: 'AI Memo',
    headline: "An analyst's summary, written in seconds",
    bullets: [
      'Plain-English risk assessment generated from the full 12-section analysis',
      'Identifies the top three risk factors and their dollar contribution to loss',
      'Specific, actionable trade recommendations with rationale',
      'Exportable as a client-ready attachment or embedded in the PDF report',
    ],
    link: '/results',
  },
  {
    id: 'compare',
    label: 'Compare',
    headline: 'Stress-test two portfolios side by side',
    bullets: [
      'Upload or describe a second portfolio to compare against the current one',
      'Side-by-side drawdown, health score, factor exposure, and Monte Carlo outcomes',
      'Winner badge: shows which portfolio survives each scenario better',
      'Radar chart overlay for a single visual that captures the full comparison',
    ],
    link: '/compare',
  },
  {
    id: 'pdf-export',
    label: 'PDF Export',
    headline: 'A branded, client-ready report in one click',
    bullets: [
      '3-page institutional PDF with your firm name and the Vantage wordmark',
      'Includes smart risk summary, factor chart, AI memo, and key metrics',
      'Print-ready typography — built to be handed across a conference table',
      'Generated in under 10 seconds from any completed analysis',
    ],
    link: '/results',
  },
  {
    id: 'custodian-sync',
    label: 'Custodian Sync',
    headline: 'Your book, always up to date',
    bullets: [
      'Direct integration with Schwab, Fidelity, and Interactive Brokers (Enterprise)',
      'Automatic 24-hour position sync — no more manual Excel uploads',
      'Multi-client portfolio management from a single dashboard',
      'CRM integration with Salesforce and Redtail for seamless client records',
    ],
    link: '/intelligence',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function OfferTabs() {
  const [active, setActive] = useState('stress-testing')
  const tab = TABS.find((t) => t.id === active) ?? TABS[0]

  return (
    <section className="py-20 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-3">
            WHAT WE OFFER
          </p>
          <h2 style={{ ...SERIF, fontSize: '36px', fontWeight: 600, lineHeight: 1.15, color: '#0B1B2E' }}>
            Every angle of risk, one workspace
          </h2>
        </div>

        {/* Tab chips */}
        <div className="flex flex-wrap gap-1 mb-10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors duration-150 ${
                active === t.id
                  ? 'font-semibold text-[#2563EB] bg-[#EFF6FF]'
                  : 'font-normal text-slate-500 hover:text-[#0B1B2E] hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 60/40 content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-3">
            <h3 className="mb-5" style={{ ...SERIF, fontSize: '22px', fontWeight: 600, lineHeight: 1.25, color: '#0B1B2E' }}>
              {tab.headline}
            </h3>
            <ul className="space-y-3 mb-7">
              {tab.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                  <span className="text-[#2563EB] shrink-0 mt-0.5">▪</span>
                  {b}
                </li>
              ))}
            </ul>
            <a
              href={tab.link}
              className="inline-flex items-center text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors duration-150"
            >
              Learn more →
            </a>
          </div>
          <div className="lg:col-span-2">
            <TabVisual id={active} />
          </div>
        </div>
      </div>
    </section>
  )
}
