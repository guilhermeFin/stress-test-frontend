import Link from 'next/link'
import { Fragment } from 'react'
import {
  TrendingDown, ArrowRight, CheckCircle2,
  Upload, Shield, Brain, Activity,
  BarChart3, Target, Scissors, RefreshCw, FileText,
} from 'lucide-react'

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features',     href: '#features'     },
  { label: 'Pricing',      href: '#pricing'      },
]

const STEPS = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload Your Portfolio',
    desc: 'Drop in an Excel file with your positions, or type tickers and weights directly. Any size, any mix.',
  },
  {
    num: '02',
    icon: Shield,
    title: 'Choose a Scenario',
    desc: 'Pick from 6 historical crises — 2008 GFC, COVID, Dot-Com, and more — or describe your own in plain English.',
  },
  {
    num: '03',
    icon: Brain,
    title: 'Get Your Full Analysis',
    desc: '12-section institutional report in under 60 seconds: factor risk, liquidity, Monte Carlo, tax impact, AI memo, and more.',
  },
]

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Factor Risk Model',
    desc: '5-factor attribution across beta, rates, inflation, credit, and growth. See exactly where your risk is concentrated.',
    color: 'text-blue-400',
    bg: 'bg-blue-600/20',
  },
  {
    icon: Target,
    title: 'Goal Impact Analysis',
    desc: 'Map portfolio stress to client outcomes — retirement age, monthly income, and long-term financial goals.',
    color: 'text-green-400',
    bg: 'bg-green-600/20',
  },
  {
    icon: RefreshCw,
    title: 'Rebalancing Recommendations',
    desc: 'Actionable position-level guidance with specific reduce/increase targets based on the stress scenario.',
    color: 'text-orange-400',
    bg: 'bg-orange-600/20',
  },
  {
    icon: Scissors,
    title: 'Tax Impact Layer',
    desc: 'Harvest losses, estimate rebalancing tax costs, and calculate withdrawal drag across account types — all in one click.',
    color: 'text-purple-400',
    bg: 'bg-purple-600/20',
  },
  {
    icon: Activity,
    title: 'Monte Carlo Simulation',
    desc: '1,000 path simulation with ruin probability, recovery curves, and depletion charts for any time horizon.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-600/20',
  },
  {
    icon: FileText,
    title: 'Client-Ready Reports',
    desc: 'One-click branded PDF with plain-English explanations your clients can actually understand — no quant jargon.',
    color: 'text-red-400',
    bg: 'bg-red-600/20',
  },
]

const TIERS = [
  {
    name: 'Starter',
    price: '$99',
    desc: 'For individual advisors getting started with institutional stress testing.',
    popular: false,
    features: [
      '10 stress tests per month',
      '6 historical crisis scenarios',
      'Factor risk model',
      'Monte Carlo simulation (1,000 paths)',
      'Position detail table',
      'PDF export',
      'Email support',
    ],
    cta: 'Get Started',
    href: '/upload',
  },
  {
    name: 'Professional',
    price: '$299',
    desc: 'For growing RIA practices that need the full institutional-grade stack.',
    popular: true,
    features: [
      'Unlimited stress tests',
      'Everything in Starter',
      'Custom scenario builder',
      'Tax impact analysis',
      'Goal & retirement impact',
      'Portfolio comparison tool',
      'Custom ticker portfolios',
      'Benchmark comparison',
      'Branded PDF reports',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    href: '/upload',
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
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    href: 'mailto:hello@portfoliostress.com',
  },
]

export default function HomePage() {
  return (
    <main className='min-h-screen bg-[#0A0F1E] text-white'>

      {/* Background glow */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]
          bg-blue-950/25 rounded-full blur-3xl' />
      </div>

      {/* ── 1. Nav ─────────────────────────────────────────────────────── */}
      <nav className='relative border-b border-white/8'>
        <div className='max-w-6xl mx-auto px-6 py-4 flex items-center justify-between'>

          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
              <TrendingDown size={16} className='text-white' />
            </div>
            <span className='font-bold text-base tracking-tight'>PortfolioStress</span>
          </div>

          <div className='hidden md:flex items-center gap-6'>
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href}
                className='text-sm text-gray-400 hover:text-white transition-colors'>
                {label}
              </a>
            ))}
            <Link href='/household'
              className='text-sm text-gray-400 hover:text-white transition-colors'>
              Household
            </Link>
            <Link href='/clients'
              className='text-sm text-gray-400 hover:text-white transition-colors'>
              Annual Review
            </Link>
          </div>

          <Link href='/demo'
            className='flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600
              hover:bg-blue-500 text-sm font-semibold text-white transition-all
              shadow-lg shadow-blue-900/30 active:scale-[0.98]'>
            Try Free
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── 2. Hero ────────────────────────────────────────────────────── */}
      <section className='relative max-w-6xl mx-auto px-6 pt-24 pb-4 text-center'>

        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
          bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs
          font-medium mb-8'>
          <span className='w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse' />
          Built for Wealth Managers & RIAs
        </div>

        <h1 className='text-5xl md:text-6xl font-bold tracking-tight mb-6
          bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent
          leading-[1.1]'>
          Run a full portfolio<br />stress test in 60 seconds
        </h1>

        <p className='text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10'>
          Upload any portfolio, pick a crisis scenario, and get an institutional-grade
          risk analysis your clients can actually understand.
        </p>

        <div className='flex flex-wrap items-center justify-center gap-3 mb-16'>
          <Link href='/upload'
            className='flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600
              hover:bg-blue-500 text-sm font-semibold text-white transition-all
              shadow-lg shadow-blue-900/40 active:scale-[0.98]'>
            Upload Your Portfolio
            <ArrowRight size={15} />
          </Link>
          <a href='#how-it-works'
            className='flex items-center gap-2 px-6 py-3 rounded-xl
              bg-white/5 hover:bg-white/10 border border-white/10
              text-sm font-medium text-gray-300 transition-all'>
            See How It Works
          </a>
        </div>

        {/* Dashboard preview */}
        <div className='relative mx-auto max-w-4xl'>
          <div className='bg-white/3 border border-white/10 rounded-3xl p-1
            shadow-2xl shadow-black/60'>
            <div className='bg-[#0D1426] rounded-[20px] overflow-hidden'>

              {/* Nav bar mock */}
              <div className='border-b border-white/8 px-4 py-2 flex items-center
                gap-2 bg-[#0A0F1E]/95'>
                <div className='w-4 h-4 bg-blue-600 rounded flex items-center justify-center'>
                  <TrendingDown size={8} className='text-white' />
                </div>
                <span className='text-xs font-semibold text-white mr-2'>PortfolioStress</span>
                <div className='w-px h-3 bg-white/10 shrink-0' />
                <div className='flex items-center gap-0.5 overflow-hidden'>
                  {['Summary', 'Charts', 'Factors', 'Liquidity', 'Monte Carlo', 'Tax impact', 'AI Analysis'].map((s, i) => (
                    <span key={s}
                      className={`relative text-xs px-2 py-1 rounded-md whitespace-nowrap
                        ${i === 0 ? 'text-white' : 'text-gray-600'}`}>
                      {s}
                      {i === 0 && (
                        <span className='absolute bottom-0 left-1.5 right-1.5 h-0.5 bg-blue-400 rounded-full' />
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggle + summary bar mock */}
              <div className='border-b border-white/6 px-4 py-2 flex items-center gap-5 bg-white/2'>
                <div className='flex items-center gap-1 bg-white/5 rounded-lg p-0.5
                  border border-white/8 shrink-0'>
                  <span className='text-xs px-2 py-0.5 bg-white/10 rounded text-white'>Advisor</span>
                  <span className='text-xs px-2 py-0.5 text-gray-500'>Client</span>
                </div>
                <div className='flex items-center gap-5 text-xs overflow-hidden'>
                  {[
                    { l: 'Health', v: '6.2/10', c: 'text-yellow-400' },
                    { l: 'Stress loss', v: '-23.4%', c: 'text-red-400' },
                    { l: 'Recovery', v: '3.1 yrs', c: 'text-blue-400' },
                    { l: 'Goals', v: 'At risk', c: 'text-yellow-400' },
                  ].map(m => (
                    <span key={m.l} className='text-gray-500 shrink-0'>
                      {m.l} <span className={`font-semibold tabular-nums ${m.c}`}>{m.v}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Content area */}
              <div className='p-4 space-y-3'>

                {/* Summary card */}
                <div className='bg-white/3 rounded-xl border border-white/8 p-3'>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-xs font-semibold text-white'>Summary</span>
                    <span className='text-xs text-yellow-400 bg-yellow-900/20
                      border border-yellow-800/30 px-2 py-0.5 rounded-full'>
                      6.2/10 health
                    </span>
                  </div>
                  <div className='grid grid-cols-4 gap-2'>
                    {[
                      { l: 'Portfolio Value', v: '$2,400,000', c: 'text-white'     },
                      { l: 'Stressed Value',  v: '$1,838,240', c: 'text-red-400'   },
                      { l: 'Total Loss',      v: '−$561,760',  c: 'text-red-400'   },
                      { l: 'Tax Savings',     v: '+$14,200',   c: 'text-green-400' },
                    ].map(m => (
                      <div key={m.l} className='bg-white/5 rounded-lg p-2'>
                        <p className='text-xs text-gray-500 mb-0.5'>{m.l}</p>
                        <p className={`text-sm font-bold tabular-nums ${m.c}`}>{m.v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Two side-by-side mini cards */}
                <div className='grid grid-cols-2 gap-3'>
                  <div className='bg-white/3 rounded-xl border border-white/8 p-3'>
                    <p className='text-xs text-gray-500 mb-2'>Factor attribution</p>
                    <div className='space-y-1.5'>
                      {[
                        { l: 'Market beta',   v: '−14.2%', w: 82 },
                        { l: 'Rate risk',     v: '−5.1%',  w: 55 },
                        { l: 'Credit spread', v: '−2.8%',  w: 34 },
                        { l: 'Growth factor', v: '−1.3%',  w: 18 },
                      ].map(f => (
                        <div key={f.l} className='flex items-center gap-2'>
                          <span className='text-xs text-gray-500 w-20 shrink-0'>{f.l}</span>
                          <div className='flex-1 h-1 bg-white/10 rounded-full'>
                            <div className='h-full bg-red-500/60 rounded-full'
                              style={{ width: `${f.w}%` }} />
                          </div>
                          <span className='text-xs text-red-400 tabular-nums w-9 text-right'>{f.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='bg-blue-950/30 border border-blue-800/30 rounded-xl p-3'>
                    <div className='flex items-center gap-1.5 mb-2'>
                      <Brain size={11} className='text-blue-400' />
                      <span className='text-xs text-blue-400 font-medium'>AI Analyst Memo</span>
                    </div>
                    <p className='text-xs text-gray-400 leading-relaxed'>
                      Under a 2008-style scenario, this portfolio faces a{' '}
                      <span className='text-white font-medium'>23.4% drawdown</span>, driven
                      primarily by market beta (61%) and rate sensitivity. Priority action:
                      trim AAPL and MSFT, which account for 67% of total stress loss...
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Gradient fade */}
          <div className='absolute bottom-0 left-0 right-0 h-28
            bg-gradient-to-t from-[#0A0F1E] to-transparent rounded-b-3xl
            pointer-events-none' />
        </div>
      </section>

      {/* ── 3. How It Works ────────────────────────────────────────────── */}
      <section id='how-it-works' className='relative max-w-6xl mx-auto px-6 py-24'>
        <div className='text-center mb-14'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-white/5 border border-white/10 text-gray-400 text-xs font-medium mb-4'>
            Simple by design
          </div>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight mb-4'>
            How it works
          </h2>
          <p className='text-gray-400 max-w-md mx-auto'>
            Three steps. Under 60 seconds. Full institutional output.
          </p>
        </div>

        <div className='flex flex-col md:flex-row items-stretch gap-3'>
          {STEPS.map((step, i) => (
            <Fragment key={step.num}>
              <div className='flex-1 bg-white/3 hover:bg-white/5 border border-white/8
                rounded-2xl p-6 transition-all group'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-blue-600/20 rounded-xl flex items-center
                    justify-center group-hover:bg-blue-600/30 transition-all shrink-0'>
                    <step.icon size={18} className='text-blue-400' />
                  </div>
                  <span className='text-3xl font-bold text-white/10 tabular-nums leading-none'>
                    {step.num}
                  </span>
                </div>
                <h3 className='font-semibold text-white mb-2'>{step.title}</h3>
                <p className='text-sm text-gray-400 leading-relaxed'>{step.desc}</p>
              </div>

              {i < STEPS.length - 1 && (
                <div className='hidden md:flex items-center justify-center shrink-0 w-8'>
                  <ArrowRight size={16} className='text-white/20' />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </section>

      {/* ── 4. Features ────────────────────────────────────────────────── */}
      <section id='features' className='relative max-w-6xl mx-auto px-6 py-24'>
        <div className='text-center mb-14'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-white/5 border border-white/10 text-gray-400 text-xs font-medium mb-4'>
            Full institutional stack
          </div>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight mb-4'>
            Everything your clients expect
          </h2>
          <p className='text-gray-400 max-w-lg mx-auto'>
            Every section of the analysis is built for speed, clarity,
            and client communication — not just internal modeling.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {FEATURES.map(f => (
            <div key={f.title}
              className='bg-white/3 hover:bg-white/5 border border-white/8
                rounded-2xl p-5 transition-all group'>
              <div className={`w-9 h-9 ${f.bg} rounded-xl flex items-center
                justify-center mb-4 group-hover:scale-105 transition-transform`}>
                <f.icon size={17} className={f.color} />
              </div>
              <h3 className='font-semibold text-white mb-1.5'>{f.title}</h3>
              <p className='text-sm text-gray-400 leading-relaxed'>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Pricing ─────────────────────────────────────────────────── */}
      <section id='pricing' className='relative max-w-6xl mx-auto px-6 py-24'>
        <div className='text-center mb-14'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-white/5 border border-white/10 text-gray-400 text-xs font-medium mb-4'>
            Transparent pricing
          </div>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight mb-4'>
            Simple, flat pricing
          </h2>
          <p className='text-gray-400 max-w-md mx-auto'>
            No per-seat fees. No usage surprises. Cancel anytime.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 items-start'>
          {TIERS.map(tier => (
            <div key={tier.name}
              className={`relative rounded-2xl p-6 flex flex-col transition-all
                ${tier.popular
                  ? 'bg-blue-600/10 border-2 border-blue-500/40 hover:border-blue-500/60'
                  : 'bg-white/3 border border-white/8 hover:bg-white/5'
                }`}>

              {tier.popular && (
                <div className='absolute -top-3.5 left-1/2 -translate-x-1/2'>
                  <span className='px-3 py-1 bg-blue-600 text-white text-xs
                    font-semibold rounded-full shadow-lg shadow-blue-900/40'>
                    Most Popular
                  </span>
                </div>
              )}

              <div className='mb-6'>
                <h3 className='font-semibold text-white mb-1'>{tier.name}</h3>
                <div className='flex items-baseline gap-1 mb-3'>
                  <span className='text-4xl font-bold text-white'>{tier.price}</span>
                  <span className='text-gray-500 text-sm'>/mo</span>
                </div>
                <p className='text-xs text-gray-400 leading-relaxed'>{tier.desc}</p>
              </div>

              <ul className='space-y-2.5 flex-1 mb-6'>
                {tier.features.map(feat => (
                  <li key={feat} className='flex items-start gap-2'>
                    <CheckCircle2 size={14}
                      className={`shrink-0 mt-0.5 ${tier.popular ? 'text-blue-400' : 'text-green-400'}`} />
                    <span className='text-sm text-gray-300'>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link href={tier.href}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center
                  transition-all block active:scale-[0.98]
                  ${tier.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30'
                    : 'bg-white/8 hover:bg-white/12 border border-white/10 text-gray-200'
                  }`}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Final CTA ───────────────────────────────────────────────── */}
      <section className='relative max-w-6xl mx-auto px-6 py-16'>
        <div className='bg-white/3 border border-white/8 rounded-3xl p-12 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight mb-4'>
            Ready to run your first stress test?
          </h2>
          <p className='text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed'>
            Upload a portfolio and see your risk in 60 seconds.
            No setup required. No contract.
          </p>
          <Link href='/demo'
            className='inline-flex items-center gap-2 px-8 py-3.5 rounded-xl
              bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white
              transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98] mb-5'>
            Try It Free — No Upload Needed
            <ArrowRight size={15} />
          </Link>
          <p className='text-xs text-gray-500'>
            No credit card required · Takes 60 seconds · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── 7. Footer ──────────────────────────────────────────────────── */}
      <footer className='border-t border-white/8'>
        <div className='max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row
          items-center justify-between gap-4'>

          <div className='flex items-center gap-2.5'>
            <div className='w-6 h-6 bg-blue-600 rounded flex items-center justify-center'>
              <TrendingDown size={12} className='text-white' />
            </div>
            <span className='text-sm font-semibold'>PortfolioStress</span>
          </div>

          <p className='text-xs text-gray-600 text-center'>
            © 2025 PortfolioStress · Built for independent wealth managers & RIAs
          </p>

          <div className='flex items-center gap-5'>
            <Link href='/upload'
              className='text-xs text-gray-500 hover:text-gray-300 transition-colors'>
              Run a Test
            </Link>
            <Link href='/compare'
              className='text-xs text-gray-500 hover:text-gray-300 transition-colors'>
              Compare
            </Link>
            <Link href='/intelligence'
              className='text-xs text-gray-500 hover:text-gray-300 transition-colors'>
              Intelligence
            </Link>
          </div>
        </div>
      </footer>

    </main>
  )
}
