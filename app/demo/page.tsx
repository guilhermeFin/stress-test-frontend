'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingDown, ArrowLeft, ArrowRight, ChevronRight, Play } from 'lucide-react'

const DEMO_PORTFOLIO = [
  { ticker: 'AAPL', name: 'Apple Inc',        sector: 'Technology',       weight: 18, value: 90000  },
  { ticker: 'MSFT', name: 'Microsoft Corp',   sector: 'Technology',       weight: 15, value: 75000  },
  { ticker: 'JPM',  name: 'JPMorgan Chase',   sector: 'Financials',       weight: 12, value: 60000  },
  { ticker: 'AMZN', name: 'Amazon',           sector: 'Consumer',         weight: 10, value: 50000  },
  { ticker: 'TLT',  name: '20yr Treasury ETF',sector: 'Bonds',            weight: 15, value: 75000  },
  { ticker: 'GLD',  name: 'Gold ETF',         sector: 'Commodities',      weight: 10, value: 50000  },
  { ticker: 'XOM',  name: 'ExxonMobil',       sector: 'Energy',           weight: 8,  value: 40000  },
  { ticker: 'JNJ',  name: 'Johnson & Johnson',sector: 'Healthcare',       weight: 12, value: 60000  },
]
// AUM: $500,000

const SCENARIOS = [
  {
    key: '2008',
    label: '2008 GFC',
    desc: 'Global Financial Crisis',
    badge: 'bg-red-900/50 text-red-400',
    severity: 'Extreme',
    text: '2008 Global Financial Crisis: market crashes 57%, credit markets freeze, spreads widen 300bps, financials drop 80%, real estate collapses 65%',
  },
  {
    key: 'covid',
    label: 'COVID Crash',
    desc: 'Pandemic market shock',
    badge: 'bg-orange-900/50 text-orange-400',
    severity: 'Severe',
    text: 'COVID-19 crash: market drops 34% in 5 weeks, energy sector collapses 55%, consumer discretionary falls 40%, rates cut to zero, gold surges 15%',
  },
  {
    key: 'rate',
    label: '2022 Rate Shock',
    desc: 'Fed hikes 425bps',
    badge: 'bg-blue-900/50 text-blue-400',
    severity: 'Severe',
    text: '2022 rate shock: Fed raises rates 425bps, bonds crash 15%, tech drops 35%, inflation hits 9%, growth stocks fall 50%',
  },
]

const SECTOR_COLORS: Record<string, string> = {
  Technology:   'text-blue-400',
  Financials:   'text-green-400',
  Consumer:     'text-orange-400',
  Bonds:        'text-purple-400',
  Commodities:  'text-yellow-400',
  Energy:       'text-red-400',
  Healthcare:   'text-teal-400',
}

export default function DemoPage() {
  const router = useRouter()
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0])
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState('')

  const handleRun = async () => {
    setLoading(true)
    setError('')

    try {
      const rows = DEMO_PORTFOLIO.map(p => ({
        ticker:       p.ticker,
        weight:       p.weight,
        value:        p.value,
        cost_basis:   Math.round(p.value * 0.85),
        shares:       Math.round(p.value / 100),
        account_type: 'Taxable',
        geography:    'US',
      }))

      const headers = ['ticker', 'weight', 'value', 'cost_basis', 'shares', 'account_type', 'geography']
      const csv = [
        headers.join(','),
        ...rows.map(r => headers.map(h => (r as Record<string, unknown>)[h]).join(','))
      ].join('\n')

      const file = new File([csv], 'demo-portfolio.csv', { type: 'text/csv' })
      const formData = new FormData()
      formData.append('file', file)
      formData.append('scenario', activeScenario.text)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/stress-test`,
        { method: 'POST', body: formData }
      )
      if (!response.ok) throw new Error('API error')
      const results = await response.json()

      sessionStorage.setItem('stressResults', JSON.stringify(results))
      sessionStorage.setItem('isDemoMode', 'true')
      router.push('/results')
    } catch {
      setError('Something went wrong. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-[#0A0F1E] text-white'>

      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]
          bg-blue-950/25 rounded-full blur-3xl' />
      </div>

      <div className='relative max-w-3xl mx-auto px-6 py-12'>

        {/* Header */}
        <div className='flex items-center justify-between mb-14'>
          <div className='flex items-center gap-3'>
            <Link href='/' className='flex items-center gap-2 text-gray-400
              hover:text-white transition-colors'>
              <ArrowLeft size={14} />
            </Link>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
              <TrendingDown size={15} className='text-white' />
            </div>
            <span className='font-bold tracking-tight'>PortfolioStress</span>
          </div>
          <Link href='/upload'
            className='text-sm text-gray-400 hover:text-white transition-colors'>
            Have your own portfolio? Upload it →
          </Link>
        </div>

        {/* Hero text */}
        <div className='text-center mb-10'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs
            font-medium mb-6'>
            <Play size={11} className='fill-blue-400 text-blue-400' />
            Live demo — no account needed
          </div>
          <h1 className='text-4xl md:text-5xl font-bold tracking-tight mb-4
            bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent'>
            See a full stress test<br />in 10 seconds
          </h1>
          <p className='text-gray-400 max-w-md mx-auto leading-relaxed'>
            We've pre-loaded a sample portfolio. Pick a crisis scenario
            and see exactly what your clients would see.
          </p>
        </div>

        {/* Portfolio card */}
        <div className='bg-white/3 border border-white/8 rounded-2xl mb-4 overflow-hidden'>
          <div className='flex items-center justify-between px-5 py-3.5
            border-b border-white/8'>
            <div>
              <span className='text-sm font-semibold text-white'>Sample portfolio</span>
              <span className='ml-2 text-xs text-gray-500'>8 positions · $500,000 AUM</span>
            </div>
            <span className='text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20
              px-2.5 py-1 rounded-full'>Pre-loaded</span>
          </div>
          <div className='divide-y divide-white/5'>
            {DEMO_PORTFOLIO.map(p => (
              <div key={p.ticker}
                className='flex items-center gap-3 px-5 py-3 hover:bg-white/2 transition-colors'>
                <span className='text-sm font-bold text-white w-12 shrink-0 tabular-nums'>
                  {p.ticker}
                </span>
                <span className='text-xs text-gray-500 flex-1 truncate'>{p.name}</span>
                <span className={`text-xs shrink-0 ${SECTOR_COLORS[p.sector] ?? 'text-gray-400'}`}>
                  {p.sector}
                </span>
                <div className='w-20 shrink-0'>
                  <div className='flex items-center justify-between mb-0.5'>
                    <span className='text-xs text-gray-400 tabular-nums'>{p.weight}%</span>
                  </div>
                  <div className='h-1 bg-white/10 rounded-full'>
                    <div className='h-full bg-blue-500/60 rounded-full'
                      style={{ width: `${(p.weight / 18) * 100}%` }} />
                  </div>
                </div>
                <span className='text-xs text-gray-400 tabular-nums w-16 text-right shrink-0'>
                  ${(p.value / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scenario picker */}
        <div className='mb-6'>
          <p className='text-xs text-gray-500 font-medium mb-3 px-1'>
            Choose a crisis scenario to stress test against
          </p>
          <div className='grid grid-cols-3 gap-3'>
            {SCENARIOS.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveScenario(s)}
                className={`p-4 rounded-xl border text-left transition-all
                  ${activeScenario.key === s.key
                    ? 'bg-white/8 border-white/20 ring-1 ring-white/15'
                    : 'bg-white/3 border-white/8 hover:bg-white/5 hover:border-white/12'
                  }`}>
                <div className='flex items-start justify-between gap-2 mb-2'>
                  <span className='text-sm font-semibold text-white leading-tight'>
                    {s.label}
                  </span>
                  {activeScenario.key === s.key && (
                    <div className='w-4 h-4 bg-blue-600 rounded-full flex items-center
                      justify-center shrink-0 mt-0.5'>
                      <div className='w-1.5 h-1.5 bg-white rounded-full' />
                    </div>
                  )}
                </div>
                <p className='text-xs text-gray-500 mb-2 leading-snug'>{s.desc}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.badge}`}>
                  {s.severity}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className='mb-4 text-sm text-red-400 bg-red-500/10 border
            border-red-500/20 rounded-xl px-4 py-3'>
            {error}
          </div>
        )}

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={loading}
          className='w-full py-4 rounded-2xl font-semibold text-sm transition-all
            duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
            bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40'>
          {loading ? (
            <span className='flex items-center justify-center gap-2'>
              <span className='w-4 h-4 border-2 border-white/30 border-t-white
                rounded-full animate-spin' />
              Running analysis on {activeScenario.label}…
            </span>
          ) : (
            <span className='flex items-center justify-center gap-2'>
              Run Free Analysis
              <ChevronRight size={16} />
            </span>
          )}
        </button>

        {/* Trust signals */}
        <p className='text-center text-xs text-gray-600 mt-4'>
          No account needed · Sample data only · Takes ~10 seconds
        </p>

        {/* What you'll see */}
        <div className='mt-8 bg-white/2 border border-white/6 rounded-2xl p-5'>
          <p className='text-xs text-gray-500 font-medium mb-3'>
            Full analysis includes 12 sections — unlock by plan:
          </p>
          <div className='space-y-3'>
            {/* Starter unlocks */}
            <div>
              <p className='text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5'>
                Starter — $99/mo
              </p>
              <div className='grid grid-cols-2 gap-x-6 gap-y-1.5'>
                {[
                  'Smart Risk Summary',
                  'Charts & breakdown',
                  'Factor risk model',
                  'Correlation analysis',
                  'Liquidity stress',
                  'Monte Carlo simulation',
                  'Benchmark comparison',
                  'PDF export',
                ].map(label => (
                  <div key={label} className='flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full shrink-0 bg-blue-400/60' />
                    <span className='text-xs text-gray-500'>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Professional unlocks */}
            <div className='pt-3 border-t border-white/6'>
              <p className='text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5'>
                Professional — $299/mo
              </p>
              <div className='grid grid-cols-2 gap-x-6 gap-y-1.5'>
                {[
                  'Tax impact analysis',
                  'Rebalancing guide',
                  'AI analyst memo',
                  'Client Presentation Mode',
                  'Household view',
                  'Annual review tracking',
                ].map(label => (
                  <div key={label} className='flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full shrink-0 bg-purple-400/60' />
                    <span className='text-xs text-gray-600'>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='mt-4 pt-4 border-t border-white/6 flex items-center
            justify-between gap-4'>
            <p className='text-xs text-gray-500'>
              Start with Starter from $99/mo
            </p>
            <Link href='/#pricing'
              className='flex items-center gap-1.5 text-xs text-blue-400
                hover:text-blue-300 transition-colors shrink-0 font-medium'>
              See pricing
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
