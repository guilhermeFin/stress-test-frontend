import Link from 'next/link'
import { Fragment } from 'react'
import {
  TrendingDown, ArrowRight, CheckCircle2,
  Upload, Shield, Brain, Activity,
  BarChart3, Target, Scissors, RefreshCw, FileText,
} from 'lucide-react'
import { Outfit } from 'next/font/google'

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500'] })

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
    color: 'text-[#494fdf]',
    bg: 'bg-[#494fdf]/15',
  },
  {
    icon: Target,
    title: 'Goal Impact Analysis',
    desc: 'Map portfolio stress to client outcomes — retirement age, monthly income, and long-term financial goals.',
    color: 'text-[#00a87e]',
    bg: 'bg-[#00a87e]/15',
  },
  {
    icon: RefreshCw,
    title: 'Rebalancing Recommendations',
    desc: 'Actionable position-level guidance with specific reduce/increase targets based on the stress scenario.',
    color: 'text-[#ec7e00]',
    bg: 'bg-[#ec7e00]/15',
  },
  {
    icon: Scissors,
    title: 'Tax Impact Layer',
    desc: 'Harvest losses, estimate rebalancing tax costs, and calculate withdrawal drag across account types — all in one click.',
    color: 'text-[#b09000]',
    bg: 'bg-[#b09000]/15',
  },
  {
    icon: Activity,
    title: 'Monte Carlo Simulation',
    desc: '1,000 path simulation with ruin probability, recovery curves, and depletion charts for any time horizon.',
    color: 'text-[#494fdf]',
    bg: 'bg-[#494fdf]/15',
  },
  {
    icon: FileText,
    title: 'Client-Ready Reports',
    desc: 'One-click branded PDF with plain-English explanations your clients can actually understand — no quant jargon.',
    color: 'text-[#e23b4a]',
    bg: 'bg-[#e23b4a]/15',
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
      'Charts & position breakdown',
      'Factor risk model (5 factors)',
      'Correlation breakdown',
      'Liquidity stress analysis',
      'Monte Carlo simulation (1,000 paths)',
      'Benchmark comparison',
      'PDF export',
      'Email support',
    ],
    cta: 'Get Started',
    href: '/upload',
  },
  {
    name: 'Professional',
    price: '$299',
    desc: 'For advisors who need to communicate risk clearly and run client meetings confidently.',
    popular: true,
    features: [
      'Unlimited stress tests',
      'Everything in Starter',
      'Custom scenario builder + shock sliders',
      'Tax impact analysis',
      'Client impact & retirement goals',
      'Rebalancing recommendations',
      'AI analyst memo',
      'Client Presentation Mode (slide deck)',
      'Portfolio comparison tool',
      'Custom ticker portfolios (no Excel needed)',
      'Household / multi-account view',
      'Annual review tracking',
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
    <main className={`${outfit.className} min-h-screen bg-[#191c1f] text-white`}>

      {/* ── 1. Nav ─────────────────────────────────────────────────────── */}
      <nav className='border-b border-white/10'>
        <div className='max-w-6xl mx-auto px-6 py-5 flex items-center justify-between'>

          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-[#494fdf] rounded-xl flex items-center justify-center'>
              <TrendingDown size={16} className='text-white' />
            </div>
            <span className='font-medium text-base text-white'>PortfolioStress</span>
          </div>

          <div className='hidden md:flex items-center gap-8'>
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href}
                className='text-sm text-[#8d969e] hover:text-white transition-colors'
                style={{ letterSpacing: '0.16px' }}>
                {label}
              </a>
            ))}
          </div>

          <Link href='/demo'
            className='flex items-center gap-2 px-7 py-3 rounded-full
              bg-white text-[#191c1f] text-sm font-medium
              hover:opacity-85 transition-opacity active:scale-[0.98]'>
            Try Free
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── 2. Hero ────────────────────────────────────────────────────── */}
      <section className='max-w-6xl mx-auto px-6 pt-28 pb-4 text-center'>

        <div className='inline-flex items-center gap-2 px-5 py-2 rounded-full
          bg-white/8 border border-white/15 text-[#8d969e] text-xs font-medium mb-10'
          style={{ letterSpacing: '0.24px' }}>
          <span className='w-1.5 h-1.5 bg-[#00a87e] rounded-full' />
          Built for Wealth Managers &amp; RIAs
        </div>

        <h1 className='font-medium text-white mb-8'
          style={{
            fontSize: 'clamp(48px, 6vw, 80px)',
            lineHeight: '1.0',
            letterSpacing: '-0.8px',
          }}>
          Run a full portfolio<br />stress test in 60 seconds
        </h1>

        <p className='text-[#8d969e] text-lg max-w-2xl mx-auto leading-relaxed mb-12'
          style={{ letterSpacing: '0.16px' }}>
          Upload any portfolio, pick a crisis scenario, and get an institutional-grade
          risk analysis your clients can actually understand.
        </p>

        <div className='flex flex-wrap items-center justify-center gap-4 mb-20'>
          <Link href='/upload'
            className='flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#494fdf]
              text-white text-sm font-medium hover:opacity-85 transition-opacity active:scale-[0.98]'>
            Upload Your Portfolio
            <ArrowRight size={15} />
          </Link>
          <a href='#how-it-works'
            className='flex items-center gap-2 px-8 py-3.5 rounded-full
              border-2 border-white/25 text-sm font-medium text-white/80
              hover:opacity-85 transition-opacity'
            style={{ background: 'rgba(244,244,244,0.08)' }}>
            See How It Works
          </a>
        </div>

        {/* Dashboard preview */}
        <div className='relative mx-auto max-w-4xl'>
          <div className='bg-white/5 border border-white/10 rounded-3xl p-1'>
            <div className='bg-[#0d1117] rounded-[20px] overflow-hidden'>

              {/* Nav bar mock */}
              <div className='border-b border-white/8 px-4 py-2 flex items-center
                gap-2 bg-[#0d1117]'>
                <div className='w-4 h-4 bg-[#494fdf] rounded flex items-center justify-center'>
                  <TrendingDown size={8} className='text-white' />
                </div>
                <span className='text-xs font-medium text-white mr-2'>PortfolioStress</span>
                <div className='w-px h-3 bg-white/10 shrink-0' />
                <div className='flex items-center gap-0.5 overflow-hidden'>
                  {['Summary', 'Charts', 'Factors', 'Liquidity', 'Monte Carlo', 'Tax impact', 'AI Analysis'].map((s, i) => (
                    <span key={s}
                      className={`relative text-xs px-2 py-1 rounded-md whitespace-nowrap
                        ${i === 0 ? 'text-white' : 'text-gray-600'}`}>
                      {s}
                      {i === 0 && (
                        <span className='absolute bottom-0 left-1.5 right-1.5 h-0.5 bg-[#494fdf] rounded-full' />
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
                    { l: 'Health',     v: '6.2/10',  c: 'text-[#b09000]' },
                    { l: 'Stress loss', v: '-23.4%',  c: 'text-[#e23b4a]' },
                    { l: 'Recovery',   v: '3.1 yrs', c: 'text-[#494fdf]' },
                    { l: 'Goals',      v: 'At risk',  c: 'text-[#b09000]' },
                  ].map(m => (
                    <span key={m.l} className='text-gray-500 shrink-0'>
                      {m.l} <span className={`font-medium tabular-nums ${m.c}`}>{m.v}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Content area */}
              <div className='p-4 space-y-3'>

                {/* Summary card */}
                <div className='bg-white/3 rounded-2xl border border-white/8 p-3'>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-xs font-medium text-white'>Summary</span>
                    <span className='text-xs text-[#b09000] bg-[#b09000]/10
                      border border-[#b09000]/20 px-2 py-0.5 rounded-full'>
                      6.2/10 health
                    </span>
                  </div>
                  <div className='grid grid-cols-4 gap-2'>
                    {[
                      { l: 'Portfolio Value', v: '$2,400,000', c: 'text-white'     },
                      { l: 'Stressed Value',  v: '$1,838,240', c: 'text-[#e23b4a]' },
                      { l: 'Total Loss',      v: '−$561,760',  c: 'text-[#e23b4a]' },
                      { l: 'Tax Savings',     v: '+$14,200',   c: 'text-[#00a87e]' },
                    ].map(m => (
                      <div key={m.l} className='bg-white/5 rounded-xl p-2'>
                        <p className='text-xs text-gray-500 mb-0.5'>{m.l}</p>
                        <p className={`text-sm font-medium tabular-nums ${m.c}`}>{m.v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Two side-by-side mini cards */}
                <div className='grid grid-cols-2 gap-3'>
                  <div className='bg-white/3 rounded-2xl border border-white/8 p-3'>
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
                            <div className='h-full bg-[#e23b4a]/60 rounded-full'
                              style={{ width: `${f.w}%` }} />
                          </div>
                          <span className='text-xs text-[#e23b4a] tabular-nums w-9 text-right'>{f.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='bg-[#494fdf]/10 border border-[#494fdf]/20 rounded-2xl p-3'>
                    <div className='flex items-center gap-1.5 mb-2'>
                      <Brain size={11} className='text-[#494fdf]' />
                      <span className='text-xs text-[#494fdf] font-medium'>AI Analyst Memo</span>
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
            bg-gradient-to-t from-[#191c1f] to-transparent rounded-b-3xl
            pointer-events-none' />
        </div>
      </section>

      {/* ── 3. How It Works ────────────────────────────────────────────── */}
      <section id='how-it-works' className='max-w-6xl mx-auto px-6 py-28'>
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-5 py-2 rounded-full
            bg-white/8 border border-white/15 text-[#8d969e] text-xs font-medium mb-5'
            style={{ letterSpacing: '0.24px' }}>
            Simple by design
          </div>
          <h2 className='font-medium text-white mb-5'
            style={{ fontSize: '48px', lineHeight: '1.21', letterSpacing: '-0.48px' }}>
            How it works
          </h2>
          <p className='text-[#8d969e] max-w-md mx-auto' style={{ letterSpacing: '0.16px' }}>
            Three steps. Under 60 seconds. Full institutional output.
          </p>
        </div>

        <div className='flex flex-col md:flex-row items-stretch gap-3'>
          {STEPS.map((step, i) => (
            <Fragment key={step.num}>
              <div className='flex-1 bg-white/4 hover:bg-white/6 border border-white/10
                rounded-2xl p-7 transition-all group'>
                <div className='flex items-center gap-4 mb-5'>
                  <div className='w-10 h-10 bg-[#494fdf]/20 rounded-xl flex items-center
                    justify-center group-hover:bg-[#494fdf]/30 transition-all shrink-0'>
                    <step.icon size={18} className='text-[#494fdf]' />
                  </div>
                  <span className='text-4xl font-medium text-white/8 tabular-nums leading-none'>
                    {step.num}
                  </span>
                </div>
                <h3 className='font-medium text-white mb-2 text-lg'>{step.title}</h3>
                <p className='text-sm text-[#8d969e] leading-relaxed'
                  style={{ letterSpacing: '0.16px' }}>{step.desc}</p>
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
      <section id='features' className='max-w-6xl mx-auto px-6 py-28'>
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-5 py-2 rounded-full
            bg-white/8 border border-white/15 text-[#8d969e] text-xs font-medium mb-5'
            style={{ letterSpacing: '0.24px' }}>
            Full institutional stack
          </div>
          <h2 className='font-medium text-white mb-5'
            style={{ fontSize: '48px', lineHeight: '1.21', letterSpacing: '-0.48px' }}>
            Everything your clients expect
          </h2>
          <p className='text-[#8d969e] max-w-lg mx-auto' style={{ letterSpacing: '0.16px' }}>
            Every section of the analysis is built for speed, clarity,
            and client communication — not just internal modeling.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {FEATURES.map(f => (
            <div key={f.title}
              className='bg-white/4 hover:bg-white/6 border border-white/10
                rounded-2xl p-6 transition-all group'>
              <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center
                justify-center mb-5 group-hover:scale-105 transition-transform`}>
                <f.icon size={18} className={f.color} />
              </div>
              <h3 className='font-medium text-white mb-2 text-lg'>{f.title}</h3>
              <p className='text-sm text-[#8d969e] leading-relaxed'
                style={{ letterSpacing: '0.16px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Pricing ─────────────────────────────────────────────────── */}
      <section id='pricing' className='max-w-6xl mx-auto px-6 py-28'>
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-5 py-2 rounded-full
            bg-white/8 border border-white/15 text-[#8d969e] text-xs font-medium mb-5'
            style={{ letterSpacing: '0.24px' }}>
            Transparent pricing
          </div>
          <h2 className='font-medium text-white mb-5'
            style={{ fontSize: '48px', lineHeight: '1.21', letterSpacing: '-0.48px' }}>
            Simple, flat pricing
          </h2>
          <p className='text-[#8d969e] max-w-md mx-auto' style={{ letterSpacing: '0.16px' }}>
            No per-seat fees. No usage surprises. Cancel anytime.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 items-start'>
          {TIERS.map(tier => (
            <div key={tier.name}
              className={`relative rounded-2xl p-7 flex flex-col transition-all
                ${tier.popular
                  ? 'bg-[#494fdf]/10 border-2 border-[#494fdf]/40 hover:border-[#494fdf]/60'
                  : 'bg-white/4 border border-white/10 hover:bg-white/6'
                }`}>

              {tier.popular && (
                <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                  <span className='px-4 py-1.5 bg-[#494fdf] text-white text-xs
                    font-medium rounded-full'>
                    Most Popular
                  </span>
                </div>
              )}

              <div className='mb-7'>
                <h3 className='font-medium text-white mb-1 text-lg'>{tier.name}</h3>
                <div className='flex items-baseline gap-1 mb-3'>
                  <span className='font-medium text-white'
                    style={{ fontSize: '40px', letterSpacing: '-0.4px' }}>
                    {tier.price}
                  </span>
                  <span className='text-[#8d969e] text-sm'>/mo</span>
                </div>
                <p className='text-sm text-[#8d969e] leading-relaxed'
                  style={{ letterSpacing: '0.16px' }}>{tier.desc}</p>
              </div>

              <ul className='space-y-3 flex-1 mb-7'>
                {tier.features.map(feat => (
                  <li key={feat} className='flex items-start gap-2.5'>
                    <CheckCircle2 size={14}
                      className={`shrink-0 mt-0.5 ${tier.popular ? 'text-[#494fdf]' : 'text-[#00a87e]'}`} />
                    <span className='text-sm text-[#8d969e]'
                      style={{ letterSpacing: '0.16px' }}>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link href={tier.href}
                className={`w-full py-3.5 rounded-full text-sm font-medium text-center
                  transition-opacity block active:scale-[0.98] hover:opacity-85
                  ${tier.popular
                    ? 'bg-[#494fdf] text-white'
                    : 'bg-white/8 border border-white/15 text-white'
                  }`}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Final CTA ───────────────────────────────────────────────── */}
      <section className='max-w-6xl mx-auto px-6 py-16 pb-28'>
        <div className='bg-white/4 border border-white/10 rounded-3xl p-14 text-center'>
          <h2 className='font-medium text-white mb-5'
            style={{ fontSize: '48px', lineHeight: '1.21', letterSpacing: '-0.48px' }}>
            Ready to run your first stress test?
          </h2>
          <p className='text-[#8d969e] mb-10 max-w-lg mx-auto leading-relaxed'
            style={{ letterSpacing: '0.16px' }}>
            Upload a portfolio and see your risk in 60 seconds.
            No setup required. No contract.
          </p>
          <Link href='/demo'
            className='inline-flex items-center gap-2 px-10 py-4 rounded-full
              bg-white text-[#191c1f] text-sm font-medium
              hover:opacity-85 transition-opacity active:scale-[0.98] mb-6'>
            Try It Free — No Upload Needed
            <ArrowRight size={15} />
          </Link>
          <p className='text-xs text-[#505a63]' style={{ letterSpacing: '0.16px' }}>
            No credit card required · Takes 60 seconds · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── 7. Footer ──────────────────────────────────────────────────── */}
      <footer className='border-t border-white/10'>
        <div className='max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row
          items-center justify-between gap-4'>

          <div className='flex items-center gap-3'>
            <div className='w-6 h-6 bg-[#494fdf] rounded flex items-center justify-center'>
              <TrendingDown size={12} className='text-white' />
            </div>
            <span className='text-sm font-medium text-white'>PortfolioStress</span>
          </div>

          <p className='text-xs text-[#505a63] text-center' style={{ letterSpacing: '0.16px' }}>
            © 2025 PortfolioStress · Built for independent wealth managers &amp; RIAs
          </p>

          <div className='flex items-center gap-6'>
            <Link href='/upload'
              className='text-xs text-[#8d969e] hover:text-white transition-colors'>
              Run a Test
            </Link>
            <Link href='/compare'
              className='text-xs text-[#8d969e] hover:text-white transition-colors'>
              Compare
            </Link>
            <Link href='/intelligence'
              className='text-xs text-[#8d969e] hover:text-white transition-colors'>
              Intelligence
            </Link>
          </div>
        </div>
      </footer>

    </main>
  )
}
