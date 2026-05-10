import Link from 'next/link'
import { Fragment } from 'react'
import {
  ArrowRight, CheckCircle2,
  Upload, Shield, Brain, Activity,
  BarChart3, Target, Scissors, RefreshCw, FileText,
  Search, Zap,
} from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'
import { Button } from '@/components/ui/neon-button'
import Logo from '@/components/Logo'
import GlobalBackground from '@/components/GlobalBackground'

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
    color: 'text-[#3B82F6]',
    bg: 'bg-[#3B82F6]/20',
    wide: true,
  },
  {
    icon: Target,
    title: 'Goal Impact',
    desc: 'Map stress to client outcomes — retirement age, monthly income, and financial goals.',
    color: 'text-green-400',
    bg: 'bg-green-600/20',
    wide: false,
  },
  {
    icon: RefreshCw,
    title: 'Rebalancing',
    desc: 'Position-level guidance with specific reduce/increase targets based on the scenario.',
    color: 'text-orange-400',
    bg: 'bg-orange-600/20',
    wide: false,
  },
  {
    icon: Scissors,
    title: 'Tax Impact Layer',
    desc: 'Harvest losses, estimate rebalancing costs, and calculate withdrawal drag — one click.',
    color: 'text-purple-400',
    bg: 'bg-purple-600/20',
    wide: false,
  },
  {
    icon: Activity,
    title: 'Monte Carlo',
    desc: '1,000 path simulation with ruin probability and depletion charts for any time horizon.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-600/20',
    wide: false,
  },
  {
    icon: FileText,
    title: 'Client-Ready Reports',
    desc: 'One-click branded PDF with plain-English explanations your clients can actually understand — no quant jargon required.',
    color: 'text-red-400',
    bg: 'bg-red-600/20',
    wide: true,
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

const BENTO_DELAYS = ['', '100', '150', '200', '250', '300'] as const

export default function HomePage() {
  return (
    <main className='relative min-h-screen text-white'>
      <GlobalBackground />
      <ScrollReveal />

      {/* ── Ambient mesh orbs ─────────────────────────────────────────── */}
      <div className='fixed inset-0 z-0 pointer-events-none overflow-hidden' aria-hidden>
        <div className='absolute top-[-18%] left-[-8%] w-[55vw] h-[55vw] rounded-full opacity-[0.06]'
          style={{ background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 68%)' }} />
        <div className='absolute bottom-[5%] right-[-6%] w-[38vw] h-[38vw] rounded-full opacity-[0.04]'
          style={{ background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 68%)' }} />
        <div className='absolute top-[55%] left-[40%] w-[28vw] h-[28vw] rounded-full opacity-[0.03]'
          style={{ background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 68%)' }} />
      </div>

      <div className='relative z-10'>

        {/* ── 1. Island Nav ───────────────────────────────────────────────── */}
        <header className='fixed top-0 left-0 right-0 z-50 pointer-events-none'>
          <div className='px-4 pt-4'>
            <div className='max-w-6xl mx-auto flex items-center justify-between
              pointer-events-auto bg-[#0A0F1E]/90 backdrop-blur-xl
              ring-1 ring-white/10 rounded-full px-5 py-2.5'>

              <div className='flex items-center gap-3'>
                <Logo height={22} />
              </div>

              <div className='hidden md:flex items-center gap-8'>
                {NAV_LINKS.map(({ label, href }) => (
                  <a key={label} href={href}
                    className='text-sm text-gray-400 hover:text-white
                      transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]'>
                    {label}
                  </a>
                ))}
              </div>

              <Link href='/demo'>
                <Button variant='solid' className='flex items-center gap-2 text-sm font-semibold'>
                  Try Free <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* ── 2. Hero ─────────────────────────────────────────────────────── */}
        <div className='relative'>

        <section className='relative max-w-6xl mx-auto px-6 pt-40 pb-6 text-center'>

          <div data-reveal
            className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs
              font-medium mb-10'>
            <span className='w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse' />
            Built for Wealth Managers &amp; RIAs
          </div>

          <h1 data-reveal data-delay='100'
            className='font-black tracking-tight mb-6
              bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent'
            style={{
              fontSize: 'clamp(52px, 7vw, 88px)',
              lineHeight: '1.0',
            }}>
            Stress test.<br />Build confidence.
          </h1>

          <p data-reveal data-delay='150'
            className='text-lg font-medium text-gray-300 max-w-xl mx-auto mb-4'>
            Institutional-grade portfolio risk analysis in 60 seconds.
          </p>

          <p data-reveal data-delay='200'
            className='text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12'>
            Vantage transforms complex market data into clear, actionable insights
            so you can lead with confidence when your clients need it most.
          </p>

          <div data-reveal data-delay='300'
            className='flex flex-wrap items-center justify-center gap-4 mb-24'>

            <Link href='/upload'>
              <Button variant='solid' size='lg' className='flex items-center gap-3 text-sm font-semibold'>
                Start Stress Test <ArrowRight size={14} />
              </Button>
            </Link>

            <a href='#how-it-works'
              className='inline-flex items-center gap-2 px-8 py-3.5 rounded-full
                border border-white/20 text-sm font-medium text-white/80 bg-white/5
                hover:bg-white/8 hover:border-white/30
                transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]'>
              See How It Works
            </a>
          </div>

          {/* Dashboard preview — double-bezel */}
          <div data-reveal data-delay='400' className='relative mx-auto max-w-4xl'>
            <div className='p-2 rounded-[2.5rem] bg-white/5 ring-1 ring-white/8
              transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]
              hover:ring-white/[0.14]'>
              <div className='rounded-[1.9rem] overflow-hidden
                shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] bg-[#0d1117]'>

                <div className='border-b border-white/8 px-4 py-2 flex items-center
                  gap-2 bg-[#0d1117]'>
                  <Logo height={14} />
                  <span className='w-px h-3 bg-white/10 shrink-0 mr-1' />
                  <div className='w-px h-3 bg-white/10 shrink-0' />
                  <div className='flex items-center gap-0.5 overflow-hidden'>
                    {['Summary', 'Charts', 'Factors', 'Liquidity', 'Monte Carlo', 'Tax impact', 'AI Analysis'].map((s, i) => (
                      <span key={s}
                        className={`relative text-xs px-2 py-1 rounded-md whitespace-nowrap
                          ${i === 0 ? 'text-white' : 'text-gray-600'}`}>
                        {s}
                        {i === 0 && (
                          <span className='absolute bottom-0 left-1.5 right-1.5 h-0.5
                            bg-[#3B82F6] rounded-full' />
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='border-b border-white/6 px-4 py-2 flex items-center
                  gap-5 bg-white/[0.02]'>
                  <div className='flex items-center gap-1 bg-white/5 rounded-lg p-0.5
                    border border-white/8 shrink-0'>
                    <span className='text-xs px-2 py-0.5 bg-white/10 rounded text-white'>Advisor</span>
                    <span className='text-xs px-2 py-0.5 text-gray-500'>Client</span>
                  </div>
                  <div className='flex items-center gap-5 text-xs overflow-hidden'>
                    {[
                      { l: 'Health',      v: '6.2/10',  c: 'text-yellow-400' },
                      { l: 'Stress loss', v: '−23.4%',  c: 'text-red-400'    },
                      { l: 'Recovery',    v: '3.1 yrs', c: 'text-[#3B82F6]'  },
                      { l: 'Goals',       v: 'At risk',  c: 'text-yellow-400' },
                    ].map(m => (
                      <span key={m.l} className='text-gray-500 shrink-0'>
                        {m.l} <span className={`font-medium tabular-nums ${m.c}`}>{m.v}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className='p-4 space-y-3'>
                  <div className='bg-white/[0.03] rounded-2xl border border-white/8 p-3'>
                    <div className='flex items-center justify-between mb-3'>
                      <span className='text-xs font-medium text-white'>Summary</span>
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
                        <div key={m.l} className='bg-white/5 rounded-xl p-2'>
                          <p className='text-xs text-gray-500 mb-0.5'>{m.l}</p>
                          <p className={`text-sm font-medium tabular-nums ${m.c}`}>{m.v}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-3'>
                    <div className='bg-white/[0.03] rounded-2xl border border-white/8 p-3'>
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
                    <div className='bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-2xl p-3'>
                      <div className='flex items-center gap-1.5 mb-2'>
                        <Brain size={11} className='text-[#3B82F6]' />
                        <span className='text-xs text-[#3B82F6] font-medium'>AI Analyst Memo</span>
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

            <div className='absolute bottom-0 left-0 right-0 h-28
              bg-gradient-to-t from-[#0A0F1E] to-transparent rounded-b-[2.5rem]
              pointer-events-none' />
          </div>
        </section>
        </div>{/* end hero wrapper */}

        {/* ── 3. How It Works ─────────────────────────────────────────────── */}
        <section id='how-it-works' className='max-w-6xl mx-auto px-6 py-32'>
          <div data-reveal className='text-center mb-20'>
            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs
              font-medium mb-5'>
              Simple by design
            </div>
            <h2 className='font-bold tracking-tight text-white mb-5'
              style={{ fontSize: '48px', lineHeight: '1.21' }}>
              How it works
            </h2>
            <p className='text-gray-400 max-w-md mx-auto'>
              Three steps. Under 60 seconds. Full institutional output.
            </p>
          </div>

          <div className='flex flex-col md:flex-row items-stretch gap-3'>
            {STEPS.map((step, i) => (
              <Fragment key={step.num}>
                <div data-reveal data-delay={i === 0 ? '' : i === 1 ? '150' : '300'}
                  className='flex-1 p-1.5 rounded-[1.75rem] bg-white/4 ring-1 ring-white/8
                    hover:ring-white/[0.16] group
                    transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]'>
                  <div className='h-full rounded-[1.25rem] bg-[#0A0F1E] p-7
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'>
                    <div className='flex items-center gap-4 mb-5'>
                      <div className='w-10 h-10 bg-[#3B82F6]/20 rounded-xl flex items-center
                        justify-center group-hover:bg-[#3B82F6]/30 shrink-0
                        transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]'>
                        <step.icon size={18} className='text-[#3B82F6]' />
                      </div>
                      <span className='text-4xl font-bold text-white/8 tabular-nums leading-none'>
                        {step.num}
                      </span>
                    </div>
                    <h3 className='font-semibold text-white mb-2 text-lg'>{step.title}</h3>
                    <p className='text-sm text-gray-400 leading-relaxed'>{step.desc}</p>
                  </div>
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

        {/* ── 4. Features bento ───────────────────────────────────────────── */}
        <section id='features' className='max-w-6xl mx-auto px-6 py-32'>
          <div data-reveal className='text-center mb-20'>
            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs
              font-medium mb-5'>
              Full institutional stack
            </div>
            <h2 className='font-bold tracking-tight text-white mb-5'
              style={{ fontSize: '48px', lineHeight: '1.21' }}>
              Everything your clients expect
            </h2>
            <p className='text-gray-400 max-w-lg mx-auto'>
              Every section of the analysis is built for speed, clarity,
              and client communication — not just internal modeling.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-6 gap-3 auto-rows-fr'>
            {FEATURES.map((f, i) => (
              <div key={f.title}
                data-reveal
                {...(BENTO_DELAYS[i] ? { 'data-delay': BENTO_DELAYS[i] } : {})}
                className={`group ${
                  i === 0 ? 'md:col-span-4' :
                  i === 5 ? 'md:col-span-6' :
                  'md:col-span-2'
                }`}>
                <div className='h-full p-1.5 rounded-[1.75rem] bg-white/4 ring-1 ring-white/8
                  hover:ring-white/[0.16]
                  transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]'>
                  <div className={`h-full rounded-[1.25rem] bg-[#0A0F1E] p-7
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                    ${i === 5 ? 'flex flex-col md:flex-row items-start md:items-center gap-8' : ''}`}>
                    <div className={i === 5 ? 'shrink-0' : 'mb-5'}>
                      <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center
                        justify-center group-hover:scale-105
                        transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]`}>
                        <f.icon size={18} className={f.color} />
                      </div>
                    </div>
                    <div>
                      <h3 className='font-semibold text-white mb-2 text-lg'>{f.title}</h3>
                      <p className='text-sm text-gray-400 leading-relaxed'>{f.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. Pricing ──────────────────────────────────────────────────── */}
        <section id='pricing' className='max-w-6xl mx-auto px-6 py-32'>
          <div data-reveal className='text-center mb-20'>
            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs
              font-medium mb-5'>
              Transparent pricing
            </div>
            <h2 className='font-bold tracking-tight text-white mb-5'
              style={{ fontSize: '48px', lineHeight: '1.21' }}>
              Simple, flat pricing
            </h2>
            <p className='text-gray-400 max-w-md mx-auto'>
              No per-seat fees. No usage surprises. Cancel anytime.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-start'>
            {TIERS.map((tier, i) => (
              <div key={tier.name}
                data-reveal
                {...(i > 0 ? { 'data-delay': i === 1 ? '150' : '300' } : {})}
                className='relative'>
                {tier.popular ? (
                  <div className='p-[2px] rounded-[1.75rem] bg-gradient-to-b
                    from-[#3B82F6]/60 to-[#3B82F6]/20'>
                    <div className='rounded-[calc(1.75rem-2px)] bg-[#0A0F1E] p-7 flex flex-col
                      shadow-[inset_0_1px_0_rgba(59,130,246,0.2)]'>
                      <PricingCardContent tier={tier} />
                    </div>
                  </div>
                ) : (
                  <div className='p-1.5 rounded-[1.75rem] bg-white/4 ring-1 ring-white/8
                    hover:ring-white/[0.14]
                    transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]'>
                    <div className='rounded-[1.25rem] bg-[#0A0F1E] p-7 flex flex-col
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'>
                      <PricingCardContent tier={tier} />
                    </div>
                  </div>
                )}

                {tier.popular && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                    <span className='px-4 py-1.5 bg-[#3B82F6] text-white text-xs
                      font-semibold rounded-full shadow-lg shadow-[#3B82F6]/20'>
                      Most Popular
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. Final CTA ────────────────────────────────────────────────── */}
        <section data-reveal className='max-w-6xl mx-auto px-6 py-16 pb-32'>
          <div className='p-1.5 rounded-[2rem] bg-white/4 ring-1 ring-white/8'>
            <div className='rounded-[1.6rem] bg-[#0A0F1E] p-16 text-center
              shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'>
              <h2 className='font-bold tracking-tight text-white mb-5'
                style={{ fontSize: '48px', lineHeight: '1.21' }}>
                Ready to run your first stress test?
              </h2>
              <p className='text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed'>
                Upload a portfolio and see your risk in 60 seconds.
                No setup required. No contract.
              </p>
              <Link href='/demo' className='inline-block mb-6'>
                <Button variant='solid' size='lg' className='flex items-center gap-3 text-sm font-semibold'>
                  Try It Free — No Upload Needed <ArrowRight size={14} />
                </Button>
              </Link>
              <p className='text-xs text-gray-600 block'>
                No credit card required · Takes 60 seconds · Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* ── 7. Brand Pillars ────────────────────────────────────────────── */}
        <section data-reveal className='max-w-6xl mx-auto px-6 pb-20'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[
              { icon: Search, label: 'Clarity' },
              { icon: Zap,    label: 'Speed'   },
              { icon: Shield, label: 'Trust'   },
              { icon: Target, label: 'Precision'},
            ].map(({ icon: Icon, label }) => (
              <div key={label}
                className='flex flex-col items-center gap-3 p-6 rounded-2xl
                  bg-white/[0.03] border border-white/8'>
                <div className='w-10 h-10 bg-[#3B82F6]/10 rounded-xl
                  flex items-center justify-center'>
                  <Icon size={18} className='text-[#3B82F6]' />
                </div>
                <span className='text-xs font-medium uppercase tracking-widest text-gray-400'>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. Footer ───────────────────────────────────────────────────── */}
        <footer className='border-t border-white/8'>
          <div className='max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row
            items-center justify-between gap-4'>

            <Logo height={20} />

            <p className='text-xs text-gray-600 text-center'>
              © 2026 Vantage · Built for independent wealth managers &amp; RIAs
            </p>

            <div className='flex items-center gap-6'>
              <Link href='/upload'
                className='text-xs text-gray-400 hover:text-white
                  transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]'>
                Run a Test
              </Link>
              <Link href='/compare'
                className='text-xs text-gray-400 hover:text-white
                  transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]'>
                Compare
              </Link>
              <Link href='/intelligence'
                className='text-xs text-gray-400 hover:text-white
                  transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]'>
                Intelligence
              </Link>
            </div>
          </div>
        </footer>

      </div>
    </main>
  )
}

function PricingCardContent({ tier }: { tier: typeof TIERS[number] }) {
  return (
    <>
      <div className='mb-7'>
        <h3 className='font-semibold text-white mb-1 text-lg'>{tier.name}</h3>
        <div className='flex items-baseline gap-1 mb-3'>
          <span className='font-bold text-white'
            style={{ fontSize: '40px', letterSpacing: '-0.4px' }}>
            {tier.price}
          </span>
          <span className='text-gray-400 text-sm'>/mo</span>
        </div>
        <p className='text-sm text-gray-400 leading-relaxed'>{tier.desc}</p>
      </div>

      <ul className='space-y-3 flex-1 mb-7'>
        {tier.features.map(feat => (
          <li key={feat} className='flex items-start gap-2.5'>
            <CheckCircle2 size={14}
              className={`shrink-0 mt-0.5 ${tier.popular ? 'text-[#3B82F6]' : 'text-green-400'}`} />
            <span className='text-sm text-gray-400'>{feat}</span>
          </li>
        ))}
      </ul>

      <Link href={tier.href} className='block'>
        <Button
          variant='solid'
          size='lg'
          className='w-full text-sm font-semibold tracking-wide'
        >
          {tier.cta}
        </Button>
      </Link>
    </>
  )
}
