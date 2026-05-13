import Link from 'next/link'
import { Source_Serif_4, JetBrains_Mono, Audiowide } from 'next/font/google'
import { Search, Upload, Shield, Brain } from 'lucide-react'

// ── Fonts (scoped to this page via CSS variables) ─────────────────────────────

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--vantage-serif',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--vantage-mono',
})

const audiowide = Audiowide({
  subsets: ['latin'],
  weight: '400',
  variable: '--vantage-wordmark',
})

// ── Static data ───────────────────────────────────────────────────────────────

const NAV_ITEMS = ['Stress Test', 'Methodology', 'Customers', 'Resources', 'About'] as const

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

// ── Helpers ───────────────────────────────────────────────────────────────────

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
    <div
      className={`bg-white text-[#0B1B2E] ${sourceSerif4.variable} ${jetbrainsMono.variable} ${audiowide.variable}`}
    >
      {/* pt-16 clears the fixed SiteNav (h-16) */}
      <div className="pt-16">

        {/* ── Bloomberg header layer 1: utility strip ─────────────────── */}
        <div className="h-8 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <div className="flex items-center gap-0.5 text-xs text-slate-500">
              <Link href="#" className="px-1.5 py-0.5 hover:text-[#0B1B2E] transition-colors duration-150">
                Product
              </Link>
              <span className="text-slate-300 select-none px-0.5">·</span>
              <Link href="#pricing" className="px-1.5 py-0.5 hover:text-[#0B1B2E] transition-colors duration-150">
                Pricing
              </Link>
              <span className="text-slate-300 select-none px-0.5">·</span>
              <Link href="#how-it-works" className="px-1.5 py-0.5 hover:text-[#0B1B2E] transition-colors duration-150">
                How it works
              </Link>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <Link
                href="/auth/sign-in"
                className="text-slate-500 hover:text-[#0B1B2E] transition-colors duration-150"
              >
                Sign in
              </Link>
              <Link
                href="/demo"
                className="text-[#2563EB] font-semibold hover:text-[#1D4ED8] transition-colors duration-150"
              >
                Start free trial
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bloomberg header layer 2: brand bar ─────────────────────── */}
        <div className="h-[72px] bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <Link href="/" aria-label="Vantage home">
              <span
                className="text-[#0B1B2E] tracking-[0.12em]"
                style={{ ...WORDMARK, fontSize: '20px' }}
              >
                VANTAGE
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <button
                aria-label="Search"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-[#0B1B2E] transition-colors duration-150"
              >
                <Search size={15} />
              </button>
              <Link
                href="/auth/sign-in"
                className="text-sm text-slate-600 hover:text-[#0B1B2E] transition-colors duration-150"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bloomberg header layer 3: primary nav ───────────────────── */}
        <div className="h-12 bg-[#0B1B2E]">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <nav className="flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-sm text-white/70 hover:text-white transition-colors duration-150"
                >
                  {item}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
              <span className="text-xs text-white/50 tracking-wide">
                Live · Stress Engine Active
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
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

      {/* ── "What You Get" — Bloomberg index card row ─────────────────── */}
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

      {/* ── How Vantage Works (§3.9 section wrap) ─────────────────────── */}
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

      {/* ── Comparison row ────────────────────────────────────────────── */}
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

      {/* ── Pricing module ────────────────────────────────────────────── */}
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

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-[#0B1B2E] text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="lg:col-span-1">
              <span
                className="text-white tracking-[0.12em] block mb-4"
                style={{ ...WORDMARK, fontSize: '18px' }}
              >
                VANTAGE
              </span>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                Institutional-grade portfolio stress testing for independent wealth managers and RIAs.
                Clarity in uncertainty. Confidence in every decision.
              </p>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:col-span-3 gap-8">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-4">
                  Product
                </p>
                <ul className="space-y-2.5">
                  {[
                    { text: 'Historical Scenarios', href: '/product/scenarios' },
                    { text: 'Custom Scenarios',     href: '/product/custom-scenarios' },
                    { text: 'Monte Carlo',          href: '/product/monte-carlo' },
                    { text: 'Factor Risk Model',    href: '/product/factor-model' },
                    { text: 'Branded PDF Export',   href: '/product/pdf' },
                  ].map(({ text, href }) => (
                    <li key={text}>
                      <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors duration-150">
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-4">
                  Methodology
                </p>
                <ul className="space-y-2.5">
                  {[
                    { text: 'Independent RIAs',    href: '/solutions/rias' },
                    { text: 'Solo Advisors',        href: '/solutions/solo' },
                    { text: 'Multi-Family Offices', href: '/solutions/mfo' },
                    { text: 'Client Panic Mode',    href: '/solutions/panic-mode' },
                    { text: 'Quarterly Reviews',    href: '/solutions/qbr' },
                  ].map(({ text, href }) => (
                    <li key={text}>
                      <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors duration-150">
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-4">
                    Company
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      { text: 'Pricing',  href: '/pricing'   },
                      { text: 'Roadmap',  href: '/roadmap'   },
                      { text: 'Try Demo', href: '/demo'       },
                      { text: 'Sign in',  href: '/auth/sign-in' },
                    ].map(({ text, href }) => (
                      <li key={text}>
                        <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors duration-150">
                          {text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-4">
                    Legal
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      { text: 'Privacy Policy', href: '#' },
                      { text: 'Terms of Service', href: '#' },
                    ].map(({ text, href }) => (
                      <li key={text}>
                        <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors duration-150">
                          {text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
            <p>© 2026 Vantage. All rights reserved.</p>
            <p>Built for independent wealth managers &amp; RIAs.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
