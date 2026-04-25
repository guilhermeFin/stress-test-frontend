'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { runStressTest } from '@/lib/api'
import ShockBuilder from '@/components/ShockBuilder'
import {
  Upload, AlertCircle, Download, Clock, ChevronRight, ChevronDown,
  BarChart3, Brain, Activity, Target, Scissors, RefreshCw,
  FileText, Shield, CheckCircle2,
} from 'lucide-react'

const HISTORICAL_SCENARIOS = [
  {
    label: '2008 GFC',
    year: '2008',
    severity: 'Extreme',
    borderColor: 'border-red-200 hover:border-red-400',
    severityClass: 'bg-red-50 text-red-700 border border-red-100',
    text: '2008 Global Financial Crisis: market crashes 57%, credit markets freeze, spreads widen 300bps, financials drop 80%, real estate collapses 65%',
  },
  {
    label: 'COVID Crash',
    year: '2020',
    severity: 'Severe',
    borderColor: 'border-orange-200 hover:border-orange-400',
    severityClass: 'bg-orange-50 text-orange-700 border border-orange-100',
    text: 'COVID-19 crash: market drops 34% in 5 weeks, energy sector collapses 55%, consumer discretionary falls 40%, rates cut to zero, gold surges 15%',
  },
  {
    label: 'Dot-Com Bust',
    year: '2000',
    severity: 'Extreme',
    borderColor: 'border-purple-200 hover:border-purple-400',
    severityClass: 'bg-purple-50 text-purple-700 border border-purple-100',
    text: 'Dot-com bust: tech sector crashes 78%, communication services drops 65%, market falls 49% over 2 years, rates fall 2.5%',
  },
  {
    label: 'Black Monday',
    year: '1987',
    severity: 'Extreme',
    borderColor: 'border-amber-200 hover:border-amber-400',
    severityClass: 'bg-amber-50 text-amber-700 border border-amber-100',
    text: 'Black Monday 1987: market crashes 22% in a single day, volatility spikes 300%, liquidity evaporates, portfolio insurance fails',
  },
  {
    label: '2022 Rate Shock',
    year: '2022',
    severity: 'Severe',
    borderColor: 'border-blue-200 hover:border-blue-400',
    severityClass: 'bg-blue-50 text-blue-700 border border-blue-100',
    text: '2022 rate shock: Fed raises rates 425bps, bonds crash 15%, tech drops 35%, inflation hits 9%, growth stocks fall 50%',
  },
  {
    label: 'Stagflation',
    year: '1970s',
    severity: 'Severe',
    borderColor: 'border-green-200 hover:border-green-400',
    severityClass: 'bg-green-50 text-green-700 border border-green-100',
    text: 'Stagflation scenario: inflation surges to 8%, GDP contracts 3%, unemployment rises to 8%, oil prices surge 40%, rates rise 3%',
  },
]

const TOOL_CARDS = [
  { icon: Shield,    title: 'Stress Testing',       desc: 'Run crisis simulations against your portfolio' },
  { icon: BarChart3, title: 'Factor Risk Model',     desc: '5-factor exposure breakdown' },
  { icon: Activity,  title: 'Monte Carlo',           desc: '1,000 path retirement simulation' },
  { icon: Target,    title: 'Correlation Analysis',  desc: 'Normal vs stress correlation breakdown' },
  { icon: Target,    title: 'Client Impact',         desc: 'Goal-based retirement analysis' },
  { icon: Scissors,  title: 'Tax Impact',            desc: 'Harvest losses, optimize withdrawals' },
  { icon: RefreshCw, title: 'Rebalancing',           desc: 'AI-driven allocation recommendations' },
  { icon: Brain,     title: 'AI Analyst Memo',       desc: 'Plain-English institutional report' },
  { icon: FileText,  title: 'PDF Export',            desc: '3-page branded client report' },
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
      'Correlation breakdown',
      'Liquidity stress analysis',
      'Monte Carlo simulation (1,000 paths)',
      'Benchmark comparison',
      'PDF export',
      'Email support',
    ],
    cta: 'Get Started',
    href: '#upload',
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
      'Client Presentation Mode',
      'Portfolio comparison tool',
      'Custom ticker portfolios (no Excel needed)',
      'Household / multi-account view',
      'Annual review tracking',
      'Branded PDF reports',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    href: '#upload',
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

const SAMPLE_SCENARIOS = [
  'Market crashes 25%, interest rates rise 2%, tech drops 40%',
  '2008-style crisis: equities fall 50%, credit markets freeze',
  'Stagflation: inflation at 8%, GDP contracts 3%, rates at 7%',
  'China conflict: Asian markets crash 35%, commodities surge 20%',
]

const NAV_ANALYSIS = [
  {
    category: 'Stress Testing',
    items: ['Run Stress Test', 'Historical Scenarios', 'Custom Shock Builder'],
  },
  {
    category: 'Portfolio Analysis',
    items: ['Factor Risk Model', 'Correlation Breakdown', 'Liquidity Analysis'],
  },
  {
    category: 'Simulation',
    items: ['Monte Carlo', 'Benchmark Comparison'],
  },
  {
    category: 'Reports',
    items: ['AI Analyst Memo', 'PDF Export', 'Portfolio Comparison'],
  },
]

export default function HomePage() {
  const router = useRouter()
  const [file, setFile]                     = useState<File | null>(null)
  const [scenario, setScenario]             = useState('')
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState('')
  const [activeHistorical, setActiveHistorical] = useState<string | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    onDrop: (files) => setFile(files[0]),
    maxFiles: 1,
  })

  const handleSubmit = async () => {
    if (!file || !scenario) {
      setError('Please upload a portfolio file and describe a scenario.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const results = await runStressTest(file, scenario)
      sessionStorage.setItem('stressResults', JSON.stringify(results))
      router.push('/results')
    } catch {
      setError('Analysis failed. Please check your file format and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTemplate = () =>
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/download-template`,
      '_blank'
    )

  const handleHistorical = (s: typeof HISTORICAL_SCENARIOS[0]) => {
    setScenario(s.text)
    setActiveHistorical(s.label)
  }

  return (
    <main className='min-h-screen bg-white text-gray-900'>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className='sticky top-0 z-50 bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>

          <span className='font-black text-xl tracking-tight text-gray-900'>
            PortfolioStress
          </span>

          <div className='hidden md:flex items-center gap-8'>

            {/* Analysis dropdown */}
            <div className='group relative'>
              <button className='flex items-center gap-1 text-sm text-gray-600
                hover:text-gray-900 transition-colors font-medium'>
                Analysis <ChevronDown size={13} />
              </button>
              <div className='absolute hidden group-hover:block top-full left-0 pt-3 z-50'>
                <div className='bg-white border border-gray-200 rounded-xl
                  shadow-xl shadow-gray-100/80 p-5 w-72'>
                  <div className='grid grid-cols-2 gap-5'>
                    {NAV_ANALYSIS.map(group => (
                      <div key={group.category}>
                        <p className='text-xs font-semibold uppercase tracking-widest
                          text-gray-400 mb-2'>
                          {group.category}
                        </p>
                        <ul className='space-y-1.5'>
                          {group.items.map(item => (
                            <li key={item}>
                              <a href='#upload'
                                className='text-sm text-gray-600 hover:text-blue-600
                                  transition-colors block'>
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <a href='#scenarios'
              className='text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium'>
              Scenarios
            </a>
            <Link href='/compare'
              className='text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium'>
              Compare
            </Link>
            <Link href='/intelligence'
              className='text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium'>
              Intelligence
            </Link>
          </div>

          <div className='flex items-center gap-5'>
            <button className='text-sm text-gray-600 hover:text-gray-900 transition-colors'>
              Sign Up
            </button>
            <button className='text-sm text-gray-600 hover:text-gray-900 transition-colors'>
              Log In
            </button>
            <a href='#upload'
              className='flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white
                text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors'>
              Get Started →
            </a>
          </div>

        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className='max-w-7xl mx-auto px-6 pt-20 pb-24'>
        <div className='grid md:grid-cols-2 gap-16 items-center'>

          {/* Left */}
          <div>
            <h1 className='text-8xl font-black tracking-tight leading-[0.92] text-gray-900 mb-8'>
              Stress<span className='text-blue-600'>.</span><br />
              Analyze<span className='text-blue-600'>.</span><br />
              Protect<span className='text-blue-600'>.</span>
            </h1>
            <div className='flex items-center gap-3 text-teal-500'>
              <svg width='48' height='36' viewBox='0 0 48 36' fill='none'>
                <path d='M4 8 C12 2 28 2 40 20'
                  stroke='currentColor' strokeWidth='2' strokeLinecap='round' fill='none' />
                <path d='M34 15 L40 20 L32 22'
                  stroke='currentColor' strokeWidth='2'
                  strokeLinecap='round' strokeLinejoin='round' fill='none' />
              </svg>
              <span className='text-sm font-medium italic text-teal-600'>
                Institutional-grade risk analysis
              </span>
            </div>
          </div>

          {/* Right */}
          <div className='pl-8 border-l border-gray-100'>
            <h2 className='text-4xl font-black tracking-tight text-gray-900 mb-8 leading-tight'>
              Know your{' '}
              <span className='text-blue-600'>Risk Before It Hits</span>
            </h2>

            <div className='grid grid-cols-2 gap-6 mb-10'>
              {[
                { value: '60s',  label: 'Full analysis time'    },
                { value: '6',    label: 'Historical scenarios'  },
                { value: '12',   label: 'Sections per report'   },
                { value: '$99',  label: 'Starting price / mo'   },
              ].map(stat => (
                <div key={stat.label}>
                  <p className='text-5xl font-black text-gray-900 leading-none mb-1.5'>
                    {stat.value}
                  </p>
                  <p className='text-sm text-gray-500'>{stat.label}</p>
                </div>
              ))}
            </div>

            <a href='#upload'
              className='inline-flex items-center gap-2 px-7 py-3.5 border-2 border-gray-900
                text-gray-900 font-semibold rounded-xl text-sm
                hover:bg-gray-900 hover:text-white transition-all duration-150'>
              Get Started →
            </a>
          </div>

        </div>
      </section>

      {/* ── Tools Section ───────────────────────────────────────────────── */}
      <section className='border-t border-gray-100 bg-gray-50/50'>
        <div className='max-w-7xl mx-auto px-6 py-20'>

          <div className='flex items-center gap-3 text-teal-500 mb-5'>
            <svg width='40' height='30' viewBox='0 0 40 30' fill='none'>
              <path d='M4 8 C12 2 24 2 34 16'
                stroke='currentColor' strokeWidth='2' strokeLinecap='round' fill='none' />
              <path d='M28 12 L34 16 L27 19'
                stroke='currentColor' strokeWidth='2'
                strokeLinecap='round' strokeLinejoin='round' fill='none' />
            </svg>
            <span className='text-sm font-medium italic text-teal-600'>
              Understand your portfolio better
            </span>
          </div>

          <h2 className='text-5xl font-black tracking-tight text-gray-900 mb-12 leading-tight'>
            Most Powerful{' '}
            <span className='text-blue-600'>Stress Testing Tools</span>
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {TOOL_CARDS.map(card => (
              <div key={card.title}
                className='bg-white border border-gray-200 rounded-xl p-5
                  hover:shadow-md hover:border-gray-300 transition-all cursor-default group'>
                <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center
                  justify-center mb-3 group-hover:bg-blue-50 transition-colors'>
                  <card.icon size={16}
                    className='text-gray-500 group-hover:text-blue-600 transition-colors' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-1'>{card.title}</h3>
                <p className='text-sm text-gray-500'>{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Upload Section ──────────────────────────────────────────────── */}
      <section id='upload' className='border-t border-gray-100'>
        <div className='max-w-7xl mx-auto px-6 py-20'>

          <p className='text-xs font-medium uppercase tracking-widest text-gray-400 mb-6'>
            RUN YOUR ANALYSIS
          </p>

          <div className='bg-white border border-gray-200 rounded-2xl p-8'>

            <div className='flex items-center gap-3 mb-6'>
              <div className='flex-1 h-px bg-gray-100' />
              <span className='text-xs text-gray-400'>upload your portfolio</span>
              <div className='flex-1 h-px bg-gray-100' />
            </div>

            {/* Template download */}
            <button
              onClick={handleDownloadTemplate}
              className='w-full mb-5 flex items-center justify-center gap-2 py-2.5
                rounded-xl border border-gray-200 hover:border-gray-400
                text-gray-600 hover:text-gray-900 text-sm transition-all'>
              <Download size={15} />
              Download Portfolio Template (.xlsx)
            </button>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center
                cursor-pointer transition-all mb-5
                ${isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : file
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                }`}>
              <input {...getInputProps()} />
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center
                mx-auto mb-3 ${file ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Upload size={22} className={file ? 'text-green-600' : 'text-gray-500'} />
              </div>
              {file ? (
                <div>
                  <p className='text-green-700 font-medium text-sm'>{file.name}</p>
                  <p className='text-gray-500 text-xs mt-1'>Ready to analyze</p>
                </div>
              ) : (
                <div>
                  <p className='text-gray-700 text-sm font-medium'>Drop your portfolio here</p>
                  <p className='text-gray-400 text-xs mt-1'>.xlsx file · up to any size</p>
                </div>
              )}
            </div>

            {/* Scenario textarea */}
            <div className='mb-3'>
              <div className='flex items-center justify-between mb-2'>
                <label className='text-xs text-gray-500 font-medium'>
                  Describe the stress scenario
                </label>
                {activeHistorical && (
                  <span className='text-xs text-blue-600 flex items-center gap-1'>
                    <Clock size={10} />
                    {activeHistorical} loaded
                  </span>
                )}
              </div>
              <textarea
                value={scenario}
                onChange={(e) => { setScenario(e.target.value); setActiveHistorical(null) }}
                className='w-full bg-white border border-gray-200 rounded-xl p-4
                  text-gray-900 placeholder-gray-400 resize-none focus:outline-none
                  focus:border-blue-400 text-sm transition-all'
                rows={3}
                placeholder='e.g. Market crashes 30%, rates rise 2%, tech sector drops 50%'
              />
            </div>

            {/* Sample scenario pills */}
            <div className='flex flex-wrap gap-2 mb-5'>
              {SAMPLE_SCENARIOS.map((s) => (
                <button key={s}
                  onClick={() => { setScenario(s); setActiveHistorical(null) }}
                  className='text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200
                    hover:border-gray-300 text-gray-600 hover:text-gray-900
                    px-3 py-1.5 rounded-lg transition-all'>
                  {s.split(':')[0].split(',')[0]}
                </button>
              ))}
            </div>

            {/* Historical scenarios */}
            <div id='scenarios' className='mb-5'>
              <div className='flex items-center gap-2 mb-3'>
                <Clock size={13} className='text-gray-400' />
                <span className='text-xs text-gray-500 font-medium'>
                  Historical crisis scenarios
                </span>
              </div>
              <div className='grid grid-cols-3 md:grid-cols-6 gap-2'>
                {HISTORICAL_SCENARIOS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleHistorical(s)}
                    className={`p-2.5 rounded-xl border bg-white text-left transition-all
                      ${s.borderColor}
                      ${activeHistorical === s.label
                        ? 'ring-2 ring-blue-400 ring-offset-1'
                        : ''}`}>
                    <div className='text-xs font-bold text-gray-900 mb-0.5'>{s.label}</div>
                    <div className='text-xs text-gray-500 mb-1.5'>{s.year}</div>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium
                      ${s.severityClass}`}>
                      {s.severity}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shock builder */}
            <div className='mb-5'>
              <ShockBuilder onApply={(s) => { setScenario(s); setActiveHistorical(null) }} />
            </div>

            {/* Error */}
            {error && (
              <div className='mb-4 flex items-center gap-2 text-red-600 text-sm
                bg-red-50 border border-red-200 rounded-xl px-4 py-3'>
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className='w-full py-4 rounded-2xl font-semibold text-sm transition-all
                duration-150 active:scale-[0.98] disabled:opacity-50
                disabled:cursor-not-allowed bg-gray-900 hover:bg-gray-700 text-white'>
              {loading ? (
                <span className='flex items-center justify-center gap-2'>
                  <span className='w-4 h-4 border-2 border-white/30 border-t-white
                    rounded-full animate-spin' />
                  Running analysis...
                </span>
              ) : (
                <span className='flex items-center justify-center gap-2'>
                  Run Stress Test
                  <ChevronRight size={16} />
                </span>
              )}
            </button>

          </div>

          <p className='mt-6 text-center text-xs text-gray-400'>
            Powered by Claude AI · Live FRED & SEC data · Institutional stress scenarios
          </p>

        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id='pricing' className='border-t border-gray-100 bg-gray-50/50'>
        <div className='max-w-7xl mx-auto px-6 py-20'>

          <div className='text-center mb-14'>
            <p className='text-xs font-medium uppercase tracking-widest text-gray-400 mb-4'>
              TRANSPARENT PRICING
            </p>
            <h2 className='text-4xl font-black tracking-tight text-gray-900 mb-4'>
              Simple, flat pricing
            </h2>
            <p className='text-gray-500 max-w-md mx-auto'>
              No per-seat fees. No usage surprises. Cancel anytime.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-5 items-start'>
            {TIERS.map(tier => (
              <div key={tier.name}
                className={`relative rounded-2xl p-6 flex flex-col bg-white transition-all
                  ${tier.popular
                    ? 'border-2 border-blue-600 shadow-lg shadow-blue-50'
                    : 'border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}>

                {tier.popular && (
                  <div className='absolute -top-3.5 left-1/2 -translate-x-1/2'>
                    <span className='px-3 py-1 bg-blue-600 text-white text-xs
                      font-semibold rounded-full'>
                      Most Popular
                    </span>
                  </div>
                )}

                <div className='mb-6'>
                  <h3 className='font-bold text-gray-900 mb-1'>{tier.name}</h3>
                  <div className='flex items-baseline gap-1 mb-3'>
                    <span className='text-4xl font-black text-gray-900'>{tier.price}</span>
                    <span className='text-gray-400 text-sm'>/mo</span>
                  </div>
                  <p className='text-xs text-gray-500 leading-relaxed'>{tier.desc}</p>
                </div>

                <ul className='space-y-2.5 flex-1 mb-6'>
                  {tier.features.map(feat => (
                    <li key={feat} className='flex items-start gap-2'>
                      <CheckCircle2 size={14}
                        className={`shrink-0 mt-0.5
                          ${tier.popular ? 'text-blue-600' : 'text-green-600'}`} />
                      <span className='text-sm text-gray-600'>{feat}</span>
                    </li>
                  ))}
                </ul>

                <a href={tier.href}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center
                    transition-all block
                    ${tier.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-700 text-white'
                    }`}>
                  {tier.cta}
                </a>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className='border-t border-gray-200 bg-white'>
        <div className='max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row
          items-center justify-between gap-4'>

          <span className='font-black text-lg text-gray-900'>PortfolioStress</span>

          <p className='text-xs text-gray-400 text-center'>
            © 2025 PortfolioStress · Built for independent wealth managers & RIAs
          </p>

          <div className='flex items-center gap-5'>
            <a href='#upload'
              className='text-xs text-gray-500 hover:text-gray-900 transition-colors'>
              Run a Test
            </a>
            <Link href='/compare'
              className='text-xs text-gray-500 hover:text-gray-900 transition-colors'>
              Compare
            </Link>
            <Link href='/intelligence'
              className='text-xs text-gray-500 hover:text-gray-900 transition-colors'>
              Intelligence
            </Link>
          </div>

        </div>
      </footer>

    </main>
  )
}
