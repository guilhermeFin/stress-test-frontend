import Link from 'next/link'
import { Upload, Shield, Brain, Eye, Zap, Target } from 'lucide-react'
import OfferTabs from './OfferTabs'

// ── Static data ───────────────────────────────────────────────────────────────

const INDEX_CARDS = [
  {
    name: 'Summary',
    value: '−23.4',
    unit: '%',
    gain: false,
    direction: '▼ 23.4% max drawdown',
    sparkline: '0,20 10,18 20,22 30,14 40,17 50,10 60,14 70,8 80,12',
  },
  {
    name: 'Factor Risk',
    value: '82',
    unit: '%',
    gain: false,
    direction: '▼ beta concentrated',
    sparkline: '0,8 10,10 20,14 30,16 40,18 50,20 60,21 70,22 80,22',
  },
  {
    name: 'Correlation',
    value: '0.91',
    unit: '',
    gain: false,
    direction: '▼ stress spike +0.31',
    sparkline: '0,10 10,12 20,10 30,16 40,12 50,18 60,16 70,20 80,22',
  },
  {
    name: 'Liquidity',
    value: '14',
    unit: ' days',
    gain: false,
    direction: '▼ 3.2× longer exit',
    sparkline: '0,6 10,8 20,10 30,14 40,16 50,18 60,20 70,20 80,22',
  },
  {
    name: 'Monte Carlo',
    value: '−31.2',
    unit: '%',
    gain: false,
    direction: '▼ P95 scenario',
    sparkline: '0,18 10,16 20,20 30,14 40,18 50,12 60,16 70,10 80,12',
  },
  {
    name: 'Benchmark',
    value: '−4.8',
    unit: 'pp',
    gain: false,
    direction: '▼ vs S&P 500',
    sparkline: '0,10 10,12 20,10 30,14 40,12 50,16 60,14 70,18 80,16',
  },
  {
    name: 'Client Impact',
    value: '67',
    unit: '%',
    gain: false,
    direction: '▼ goal at risk',
    sparkline: '0,8 10,10 20,12 30,16 40,14 50,18 60,20 70,22 80,22',
  },
  {
    name: 'Rebalancing',
    value: '8.3',
    unit: '/10',
    gain: true,
    direction: '▲ clear actions ready',
    sparkline: '0,22 10,20 20,18 30,16 40,14 50,12 60,10 70,8 80,6',
  },
  {
    name: 'Tax Impact',
    value: '$14.2',
    unit: 'K',
    gain: true,
    direction: '▲ harvest opportunity',
    sparkline: '0,22 10,20 20,16 30,14 40,12 50,10 60,8 70,6 80,4',
  },
  {
    name: 'AI Memo',
    value: '92',
    unit: '%',
    gain: true,
    direction: '▲ high confidence',
    sparkline: '0,20 10,18 20,16 30,14 40,12 50,10 60,8 70,6 80,4',
  },
]

const HOW_STEPS = [
  {
    Icon: Upload,
    title: 'Upload your portfolio',
    desc: 'Drop in an Excel file with your positions, or type tickers directly. Any size, any asset mix — Vantage handles it.',
  },
  {
    Icon: Shield,
    title: 'Choose a scenario',
    desc: 'Pick from 6 historical crises or describe your own in plain English. Custom shock sliders let you fine-tune every factor.',
  },
  {
    Icon: Brain,
    title: 'Get full analysis in 60s',
    desc: '12-section institutional report: factor risk, liquidity, Monte Carlo, tax impact, AI memo — ready to put in front of a client.',
  },
]

const COMPARISON = [
  {
    name: 'Riskalyze',
    price: '$4–10K/yr',
    featured: false,
    features: [
      'Risk score (single number)',
      'Basic scenario analysis',
      'Limited customization',
      'Annual contract required',
    ],
  },
  {
    name: 'Vantage',
    price: '$99–799/mo',
    featured: true,
    features: [
      '12-section institutional report',
      'Custom scenarios & shock builder',
      'AI analyst memo with trade ideas',
      'Month-to-month billing',
      'Cancel anytime',
    ],
  },
  {
    name: 'eMoney',
    price: '$5–15K/yr',
    featured: false,
    features: [
      'Financial planning suite',
      'Basic stress testing only',
      'Complex onboarding required',
      'Long-term contract',
    ],
  },
]

const TIERS = [
  {
    name: 'Starter',
    price: '$99',
    desc: 'For individual advisors who need fast, credible risk analysis.',
    popular: false,
    features: [
      '25 stress tests per month',
      'Excel upload + template',
      '6 historical crisis scenarios',
      'Smart Risk Summary (health score)',
      'Factor risk model (5 factors)',
      'Benchmark comparison',
      'PDF export',
    ],
    cta: 'Get Started',
    href: '/upload',
  },
  {
    name: 'Professional',
    price: '$299',
    desc: 'For advisors who run client meetings and communicate risk clearly.',
    popular: true,
    features: [
      'Unlimited stress tests',
      'Everything in Starter',
      'Custom scenario builder + sliders',
      'AI analyst memo',
      'Client Presentation Mode',
      'Portfolio comparison tool',
      'Annual review tracking',
    ],
    cta: 'Start Free Trial',
    href: '/demo',
  },
  {
    name: 'Enterprise',
    price: '$799',
    desc: 'For larger firms and teams with advanced compliance needs.',
    popular: false,
    features: [
      'Everything in Professional',
      'Unlimited team seats',
      'White-labeled client portal',
      'CRM integration (Salesforce, Redtail)',
      'Custodian sync (Schwab, Fidelity)',
      'Compliance audit trail',
    ],
    cta: 'Contact Sales',
    href: 'mailto:hello@vantage.app',
  },
]

const PILLARS = [
  {
    Icon: Eye,
    title: 'Clarity',
    desc: 'Plain-English output any client can understand.',
  },
  {
    Icon: Zap,
    title: 'Speed',
    desc: 'Sixty seconds from upload to full institutional report.',
  },
  {
    Icon: Shield,
    title: 'Trust',
    desc: 'Methodology that survives any compliance review.',
  },
  {
    Icon: Target,
    title: 'Precision',
    desc: 'Decimal-precise math you can stake your reputation on.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'When the call came at 4pm on a down day, I had Vantage open before my client finished the sentence.',
    name: 'Maria Hernandez, CFP®',
    title: 'Founder',
    firm: 'Hernandez Wealth · $20M AUM',
  },
  {
    quote: 'My clients walk out understanding what just happened. That is the entire job.',
    name: 'David Chen, CFA',
    title: 'Senior Advisor',
    firm: 'Sterling Partners',
  },
  {
    quote: 'Riskalyze gave me a number. Vantage gives me an answer.',
    name: 'Sarah Okonkwo, CFP®',
    title: 'Lead Advisor',
    firm: 'Okonkwo Capital · $5M AUM',
  },
]

// ── Style helpers ─────────────────────────────────────────────────────────────

const SERIF: React.CSSProperties = {
  fontFamily: 'var(--vantage-serif), Georgia, "Times New Roman", serif',
}

const MONO: React.CSSProperties = {
  fontFamily: 'var(--vantage-mono), "SF Mono", Menlo, monospace',
}

const WORDMARK: React.CSSProperties = {
  fontFamily: 'var(--vantage-wordmark), sans-serif',
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="bg-white text-[#0B1B2E]">

      {/* ── 1. Hero ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Copy */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-4">
            INSTITUTIONAL PORTFOLIO RISK
          </p>
          <h1
            className="mb-5"
            style={{
              ...SERIF,
              fontSize: 'clamp(52px, 5.5vw, 76px)',
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#0B1B2E',
            }}
          >
            Stress test.<br />Build confidence.
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-md">
            Institutional-grade portfolio risk analysis in 60 seconds.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]
                text-white px-4 py-2.5 rounded-md text-sm font-semibold transition-colors duration-150"
            >
              Start free trial
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center border border-slate-300 hover:bg-slate-50
                text-[#0B1B2E] px-4 py-2.5 rounded-md text-sm font-semibold transition-colors duration-150"
            >
              Watch 60-second demo
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-6">
            No credit card required · Takes 60 seconds · Cancel anytime
          </p>
        </div>

        {/* Mock dashboard preview */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-[0_4px_12px_rgba(15,23,42,0.08)]">

          {/* Chrome bar */}
          <div className="bg-[#0B1B2E] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white text-xs tracking-[0.12em]" style={WORDMARK}>
                VANTAGE
              </span>
              <span className="text-white/20 select-none">|</span>
              <span className="text-white/60 text-xs">2008 GFC · Advisor view</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="block w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
              <span className="text-[10px] text-white/50">Live</span>
            </div>
          </div>

          <div className="p-4">
            {/* Key metrics grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(
                [
                  { label: 'Portfolio Value', value: '$2,400,000', color: '#0B1B2E' },
                  { label: 'Stressed Value',  value: '$1,838,240', color: '#B91C1C' },
                  { label: 'Total Drawdown',  value: '▼ 23.4%',   color: '#B91C1C' },
                  { label: 'Health Score',    value: '6.2 / 10',  color: '#0B1B2E' },
                ] as const
              ).map((m) => (
                <div key={m.label} className="bg-slate-50 rounded-md p-3">
                  <p className="text-[10px] text-slate-500 mb-1">{m.label}</p>
                  <p
                    className="text-sm font-medium tabular-nums"
                    style={{ ...MONO, color: m.color }}
                  >
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Factor attribution bars */}
            <div className="mb-4">
              <p className="text-[10px] text-slate-500 mb-2">Factor Attribution</p>
              <div className="space-y-1.5">
                {(
                  [
                    { label: 'Market beta',   pct: 82, value: '−14.2%' },
                    { label: 'Rate risk',     pct: 55, value: '−5.1%'  },
                    { label: 'Credit spread', pct: 34, value: '−2.8%'  },
                  ] as const
                ).map((f) => (
                  <div key={f.label} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-20 shrink-0">{f.label}</span>
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#B91C1C] rounded-full"
                        style={{ width: `${f.pct}%` }}
                      />
                    </div>
                    <span
                      className="text-[10px] tabular-nums text-[#B91C1C] w-10 text-right shrink-0"
                      style={MONO}
                    >
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stress sparkline */}
            <svg viewBox="0 0 280 48" className="w-full h-12" preserveAspectRatio="none">
              <defs>
                <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B91C1C" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#B91C1C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points="0,34 40,30 80,38 120,22 160,32 200,16 240,24 280,12 280,48 0,48"
                fill="url(#heroGrad)"
              />
              <polyline
                points="0,34 40,30 80,38 120,22 160,32 200,16 240,24 280,12"
                fill="none"
                stroke="#B91C1C"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ── 2. Dashboard Preview ──────────────────────────────────────── */}
      <section className="border-t border-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-3">
              THE DASHBOARD
            </p>
            <h2
              style={{ ...SERIF, fontSize: '36px', fontWeight: 600, lineHeight: 1.15, color: '#0B1B2E' }}
            >
              See your portfolio under fire
            </h2>
            <p className="text-lg text-slate-600 mt-3 max-w-2xl leading-relaxed">
              A 12-section institutional risk report rendered in 60 seconds. Built for the room, not the office.
            </p>
          </div>

          {/* Large mockup card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(15,23,42,0.10)]">
            {/* Chrome */}
            <div className="bg-[#0B1B2E] px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-white text-xs tracking-[0.12em]" style={WORDMARK}>VANTAGE</span>
                <span className="text-white/20 select-none">|</span>
                <span className="text-white/60 text-xs">Portfolio Risk Analysis · 2008 GFC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="block w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span className="text-[10px] text-white/50">Analysis complete</span>
              </div>
            </div>

            {/* Tab bar */}
            <div className="border-b border-slate-200 bg-white px-5 flex items-center overflow-x-auto">
              {['Summary', 'Factor Risk', 'Monte Carlo', 'Tax Impact', '+ 8 more'].map((tab, i) => (
                <div
                  key={tab}
                  className={`px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    i === 0
                      ? 'border-[#2563EB] text-[#2563EB]'
                      : i === 4
                      ? 'border-transparent text-slate-300 italic'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </div>
              ))}
            </div>

            {/* Dashboard content */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column: metrics + factors */}
              <div className="lg:col-span-2 space-y-5">
                {/* Metric tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(
                    [
                      { label: 'Portfolio Value', value: '$2,400,000', sub: 'Pre-stress',    color: '#0B1B2E' },
                      { label: 'Stressed Value',  value: '$1,838,240', sub: '2008 GFC',      color: '#B91C1C' },
                      { label: 'Max Drawdown',    value: '−23.4%',     sub: 'Total loss',    color: '#B91C1C' },
                      { label: 'Health Score',    value: '6.2 / 10',   sub: 'Risk-adjusted', color: '#0B1B2E' },
                    ] as const
                  ).map((m) => (
                    <div key={m.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <p className="text-[10px] text-slate-400 mb-1">{m.label}</p>
                      <p className="text-sm font-semibold tabular-nums" style={{ ...MONO, color: m.color }}>
                        {m.value}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{m.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Factor attribution */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Factor Attribution
                  </p>
                  <div className="space-y-2">
                    {(
                      [
                        { label: 'Market Beta',   pct: 82, value: '−14.2%', desc: '82% of total risk' },
                        { label: 'Rate Risk',     pct: 55, value: '−5.1%',  desc: 'duration exposure' },
                        { label: 'Credit Spread', pct: 34, value: '−2.8%',  desc: 'HY spread widening' },
                        { label: 'Inflation',     pct: 22, value: '−1.9%',  desc: 'real rate impact'  },
                        { label: 'Growth',        pct: 16, value: '−1.4%',  desc: 'earnings sensitivity' },
                      ] as const
                    ).map((f) => (
                      <div key={f.label} className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-600 w-24 shrink-0">{f.label}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${f.pct}%` }} />
                        </div>
                        <span className="text-[11px] tabular-nums text-[#B91C1C] w-12 text-right shrink-0" style={MONO}>
                          {f.value}
                        </span>
                        <span className="text-[10px] text-slate-400 hidden md:inline w-28 shrink-0">{f.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column: sparkline + summary */}
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Portfolio Stress Path
                  </p>
                  <svg viewBox="0 0 200 80" className="w-full h-20" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#B91C1C" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#B91C1C" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="0,40 30,36 60,44 90,28 120,38 150,20 180,28 200,16 200,80 0,80"
                      fill="url(#dashGrad)"
                    />
                    <polyline
                      points="0,40 30,36 60,44 90,28 120,38 150,20 180,28 200,16"
                      fill="none" stroke="#B91C1C" strokeWidth="1.5"
                      strokeLinejoin="round" strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-100 p-4 space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Smart Risk Summary
                  </p>
                  {[
                    { label: 'Drawdown',   value: '−23.4%', color: '#B91C1C' },
                    { label: 'Recovery',   value: '14 mo',  color: '#0B1B2E' },
                    { label: 'Liquidity',  value: '14 days', color: '#F59E08' },
                    { label: 'Tail (P5)',  value: '−31.2%', color: '#B91C1C' },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">{r.label}</span>
                      <span className="text-[11px] font-semibold tabular-nums" style={{ ...MONO, color: r.color }}>
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Brand Pillars ──────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-3">
              WHAT WE STAND FOR
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PILLARS.map(({ Icon, title, desc }) => (
              <div key={title}>
                <div className="w-10 h-10 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[#2563EB]" />
                </div>
                <p className="font-semibold text-[#0B1B2E] mb-1.5">{title}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Inside the 12-section dashboard (index cards) ─────────── */}
      <section className="border-t border-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-3">
              WHAT YOU GET
            </p>
            <h2
              style={{
                ...SERIF,
                fontSize: '36px',
                fontWeight: 600,
                lineHeight: 1.15,
                color: '#0B1B2E',
              }}
            >
              Inside the 12-section dashboard
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {INDEX_CARDS.map((card) => (
              <div
                key={card.name}
                className="bg-white border border-slate-200 rounded-lg shadow-sm p-4
                  hover:shadow-md transition-shadow duration-150 cursor-default"
              >
                <p className="text-sm font-semibold text-[#0B1B2E] mb-2 truncate">{card.name}</p>
                <div className="flex items-baseline gap-0.5 mb-1">
                  <span
                    className="text-2xl font-medium tabular-nums text-[#0B1B2E]"
                    style={MONO}
                  >
                    {card.value}
                  </span>
                  {card.unit && (
                    <span className="text-xs text-slate-500 ml-0.5">{card.unit}</span>
                  )}
                </div>
                <p
                  className={`text-xs tabular-nums mb-2 ${
                    card.gain ? 'text-[#15803D]' : 'text-[#B91C1C]'
                  }`}
                >
                  {card.direction}
                </p>
                <svg viewBox="0 0 80 24" className="w-full h-6" preserveAspectRatio="none">
                  <polyline
                    points={card.sparkline}
                    fill="none"
                    stroke={card.gain ? '#15803D' : '#B91C1C'}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. What We Offer (tabbed) ─────────────────────────────────── */}
      <OfferTabs />

      {/* ── 6. How Vantage Works ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-50 rounded-xl p-8 md:p-12">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-3">
                HOW IT WORKS
              </p>
              <h2
                style={{
                  ...SERIF,
                  fontSize: '36px',
                  fontWeight: 600,
                  lineHeight: 1.15,
                  color: '#0B1B2E',
                }}
              >
                Three steps. 60 seconds. Full analysis.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {HOW_STEPS.map(({ Icon, title, desc }) => (
                <div key={title}>
                  <div className="w-10 h-10 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={18} className="text-[#2563EB]" />
                  </div>
                  <p className="font-semibold text-[#0B1B2E] mb-2">{title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Comparison row ─────────────────────────────────────────── */}
      <section className="border-t border-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-3">
              COMPETITIVE LANDSCAPE
            </p>
            <h2
              style={{
                ...SERIF,
                fontSize: '36px',
                fontWeight: 600,
                color: '#0B1B2E',
              }}
            >
              How Vantage compares
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMPARISON.map((comp) => (
              <div
                key={comp.name}
                className={`bg-white rounded-lg p-6 ${
                  comp.featured
                    ? 'border-2 border-[#2563EB]'
                    : 'border border-slate-200'
                }`}
              >
                {comp.featured && (
                  <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider mb-3">
                    Recommended
                  </p>
                )}
                <p className="text-sm font-semibold text-[#0B1B2E] mb-2">{comp.name}</p>
                <p
                  className="text-3xl font-medium tabular-nums text-[#0B1B2E] mb-4"
                  style={MONO}
                >
                  {comp.price}
                </p>
                <ul className="space-y-2">
                  {comp.features.map((f) => (
                    <li key={f} className="text-sm text-slate-600 flex items-start gap-2">
                      <span
                        className={comp.featured ? 'text-[#2563EB]' : 'text-slate-400'}
                        aria-hidden="true"
                      >
                        ▪
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Testimonials ───────────────────────────────────────────── */}
      <section className="border-t border-slate-100 py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-3">
              TRUSTED BY ADVISORS
            </p>
            <h2
              style={{ ...SERIF, fontSize: '36px', fontWeight: 600, lineHeight: 1.15, color: '#0B1B2E' }}
            >
              Built for the moment a client calls
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex flex-col"
              >
                <p
                  className="text-lg text-[#0B1B2E] leading-relaxed mb-6 flex-1"
                  style={{ ...SERIF, fontStyle: 'italic' }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-[#0B1B2E] text-sm">{t.name}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{t.title}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{t.firm}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Pricing module ─────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-3">
              TRANSPARENT PRICING
            </p>
            <h2
              style={{
                ...SERIF,
                fontSize: '36px',
                fontWeight: 600,
                color: '#0B1B2E',
              }}
            >
              Simple, flat pricing
            </h2>
            <p className="text-slate-500 mt-3">
              No per-seat fees. No usage surprises. Cancel anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`bg-white rounded-lg p-7 flex flex-col ${
                  tier.popular
                    ? 'border-2 border-[#2563EB] shadow-[0_4px_12px_rgba(37,99,235,0.12)] md:scale-105'
                    : 'border border-slate-200'
                }`}
              >
                {tier.popular && (
                  <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider mb-3">
                    Most Popular
                  </p>
                )}
                <h3 className="font-semibold text-[#0B1B2E] text-base mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className="tabular-nums text-[#0B1B2E]"
                    style={{
                      ...MONO,
                      fontSize: '40px',
                      fontWeight: 500,
                      lineHeight: 1,
                    }}
                  >
                    {tier.price}
                  </span>
                  <span className="text-sm text-slate-500">/mo</span>
                </div>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">{tier.desc}</p>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-[#2563EB] shrink-0 mt-px" aria-hidden="true">
                        ▪
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`block text-center px-4 py-2.5 rounded-md text-sm font-semibold
                    transition-colors duration-150 ${
                      tier.popular
                        ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                        : 'border border-slate-300 hover:bg-slate-50 text-[#0B1B2E]'
                    }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Final CTA ─────────────────────────────────────────────── */}
      <section className="border-t border-slate-100 py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-4">
            GET STARTED
          </p>
          <h2
            className="mb-4"
            style={{
              ...SERIF,
              fontSize: 'clamp(36px, 4vw, 52px)',
              fontWeight: 600,
              lineHeight: 1.1,
              color: '#0B1B2E',
            }}
          >
            Run your first stress test<br />in 60 seconds.
          </h2>
          <p className="text-slate-500 text-lg mb-10">
            No credit card required. Cancel anytime.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]
                text-white px-6 py-3 rounded-md text-sm font-semibold transition-colors duration-150"
            >
              Start free trial
            </Link>
            <Link
              href="mailto:hello@vantage.app"
              className="inline-flex items-center border border-slate-300 hover:bg-slate-50
                text-[#0B1B2E] px-6 py-3 rounded-md text-sm font-semibold transition-colors duration-150"
            >
              Talk to founder
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
