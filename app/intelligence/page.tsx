'use client'

import { useState } from 'react'
import { runStressTest } from '@/lib/api'
import {
  TrendingDown, Zap, ArrowLeft, Plus, X,
  BarChart2, Brain, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TickerRow {
  ticker: string
  weight: string
}

const PRESETS = [
  {
    label: 'Tech Heavy',
    tickers: [
      { ticker: 'AAPL', weight: '20' },
      { ticker: 'MSFT', weight: '20' },
      { ticker: 'GOOGL', weight: '20' },
      { ticker: 'NVDA', weight: '20' },
      { ticker: 'META', weight: '20' },
    ]
  },
  {
    label: 'Balanced',
    tickers: [
      { ticker: 'AAPL', weight: '15' },
      { ticker: 'JPM', weight: '15' },
      { ticker: 'JNJ', weight: '15' },
      { ticker: 'TLT', weight: '20' },
      { ticker: 'GLD', weight: '15' },
      { ticker: 'XOM', weight: '20' },
    ]
  },
  {
    label: 'Conservative',
    tickers: [
      { ticker: 'TLT', weight: '30' },
      { ticker: 'LQD', weight: '25' },
      { ticker: 'GLD', weight: '20' },
      { ticker: 'JNJ', weight: '15' },
      { ticker: 'VNQ', weight: '10' },
    ]
  },
]

const HISTORICAL_SCENARIOS = [
  { label: '2008 GFC',         text: '2008 Global Financial Crisis: market crashes 57%, credit markets freeze, spreads widen 300bps, financials drop 80%, real estate collapses 65%' },
  { label: 'COVID Crash',      text: 'COVID-19 crash: market drops 34% in 5 weeks, energy sector collapses 55%, consumer discretionary falls 40%, rates cut to zero, gold surges 15%' },
  { label: '2022 Rate Shock',  text: '2022 rate shock: Fed raises rates 425bps, bonds crash 15%, tech drops 35%, inflation hits 9%, growth stocks fall 50%' },
  { label: 'Stagflation',      text: 'Stagflation scenario: inflation surges to 8%, GDP contracts 3%, unemployment rises to 8%, oil prices surge 40%, rates rise 3%' },
  { label: 'Market crashes 25%', text: 'Market crashes 25%, interest rates rise 2%, tech drops 40%' },
]

export default function IntelligencePage() {
  const router = useRouter()
  const [tickers, setTickers] = useState<TickerRow[]>([
    { ticker: '', weight: '' },
    { ticker: '', weight: '' },
    { ticker: '', weight: '' },
  ])
  const [scenario, setScenario]     = useState('')
  const [totalAum, setTotalAum]     = useState('500000')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [activeScenario, setActiveScenario] = useState<string | null>(null)

  const addRow = () => setTickers([...tickers, { ticker: '', weight: '' }])

  const removeRow = (i: number) =>
    setTickers(tickers.filter((_, idx) => idx !== i))

  const updateRow = (i: number, field: 'ticker' | 'weight', value: string) => {
    const updated = [...tickers]
    updated[i][field] = field === 'ticker' ? value.toUpperCase() : value
    setTickers(updated)
  }

  const totalWeight = tickers.reduce(
    (sum, r) => sum + (parseFloat(r.weight) || 0), 0)

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTickers(preset.tickers)
  }

  const equalizeWeights = () => {
    const filled = tickers.filter(r => r.ticker.trim())
    if (!filled.length) return
    const w = (100 / filled.length).toFixed(1)
    setTickers(tickers.map(r =>
      r.ticker.trim() ? { ...r, weight: w } : r
    ))
  }

  const handleRun = async () => {
    const valid = tickers.filter(r => r.ticker.trim() && r.weight.trim())
    if (valid.length < 2) {
      setError('Please add at least 2 tickers with weights.')
      return
    }
    if (!scenario.trim()) {
      setError('Please describe a stress scenario.')
      return
    }
    if (Math.abs(totalWeight - 100) > 1) {
      setError(`Weights must sum to 100%. Currently: ${totalWeight.toFixed(1)}%`)
      return
    }

    setLoading(true)
    setError('')

    try {
      const aum = parseFloat(totalAum) || 500000
      const rows = valid.map(r => ({
        ticker: r.ticker,
        weight: parseFloat(r.weight),
        value: (parseFloat(r.weight) / 100) * aum,
        cost_basis: (parseFloat(r.weight) / 100) * aum * 0.85,
        shares: Math.round(((parseFloat(r.weight) / 100) * aum) / 100),
        account_type: 'Taxable',
        geography: 'US',
      }))

      const headers = ['ticker', 'weight', 'value', 'cost_basis',
                       'shares', 'account_type', 'geography']
      const csv = [
        headers.join(','),
        ...rows.map(r => headers.map(h => (r as any)[h]).join(','))
      ].join('\n')

      const file = new File([csv], 'portfolio.csv', { type: 'text/csv' })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('scenario', scenario)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/stress-test`,
        { method: 'POST', body: formData }
      )
      const results = await response.json()
      sessionStorage.setItem('stressResults', JSON.stringify(results))
      router.push('/results')
    } catch (err) {
      setError('Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-[#191c1f] text-white'>
      <div className='max-w-4xl mx-auto px-6 py-10'>

        {/* Header */}
        <div className='flex items-center justify-between mb-10'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 bg-[#494fdf] rounded-xl flex items-center justify-center'>
              <TrendingDown size={18} className='text-white' />
            </div>
            <span className='font-medium text-lg'>PortfolioStress</span>
          </div>
          <Link href='/' className='flex items-center gap-2 text-sm
            text-[#8d969e] hover:text-white transition-colors'>
            <ArrowLeft size={14} />
            Back to home
          </Link>
        </div>

        {/* Title */}
        <div className='mb-8'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-[#494fdf]/10 border border-[#494fdf]/20 text-[#494fdf]
            text-xs font-medium mb-4'>
            <Brain size={12} />
            Live Portfolio Analysis
          </div>
          <h1 className='font-medium text-white mb-3'
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: '1.1', letterSpacing: '-0.8px' }}>
            Build your portfolio,<br />stress test it live
          </h1>
          <p className='text-[#8d969e] text-base max-w-lg' style={{ letterSpacing: '0.16px' }}>
            Enter your stocks and weights, pick a scenario, and get the same
            institutional analysis — factor risk, correlation breakdown,
            liquidity, Monte Carlo, and AI memo.
          </p>
        </div>

        {/* Main card */}
        <div className='bg-white/4 border border-white/10 rounded-3xl p-8 space-y-6'>

          {/* Presets */}
          <div>
            <p className='text-xs text-[#8d969e] font-medium mb-3'>Quick presets</p>
            <div className='flex gap-2 flex-wrap'>
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => applyPreset(p)}
                  className='px-3 py-1.5 rounded-full text-xs border
                    border-white/10 bg-white/3 hover:bg-white/8
                    text-gray-300 transition-all'>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* AUM */}
          <div>
            <label className='text-xs text-[#8d969e] font-medium mb-2 block'>
              Total Portfolio Value (AUM)
            </label>
            <div className='relative w-48'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2
                text-gray-500 text-sm'>$</span>
              <input
                type='number'
                value={totalAum}
                onChange={e => setTotalAum(e.target.value)}
                className='w-full bg-white/3 border border-white/10 rounded-xl
                  pl-7 pr-4 py-2.5 text-white text-sm focus:outline-none
                  focus:border-[#494fdf]/50 transition-all'
              />
            </div>
          </div>

          {/* Ticker table */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <label className='text-xs text-[#8d969e] font-medium'>
                Portfolio positions
              </label>
              <div className='flex items-center gap-2'>
                <span className={`text-xs font-medium ${
                  Math.abs(totalWeight - 100) < 1 ? 'text-[#00a87e]'
                  : totalWeight > 100 ? 'text-[#e23b4a]' : 'text-[#ec7e00]'
                }`}>
                  {totalWeight.toFixed(1)}% / 100%
                </span>
                <button onClick={equalizeWeights}
                  className='text-xs text-[#494fdf] hover:opacity-80
                    border border-[#494fdf]/30 px-2 py-1 rounded-full
                    transition-opacity'>
                  Equal weights
                </button>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='grid grid-cols-12 gap-2 px-2'>
                <div className='col-span-5 text-xs text-[#505a63]'>Ticker</div>
                <div className='col-span-5 text-xs text-[#505a63]'>Weight %</div>
                <div className='col-span-2' />
              </div>

              {tickers.map((row, i) => (
                <div key={i} className='grid grid-cols-12 gap-2 items-center'>
                  <input
                    value={row.ticker}
                    onChange={e => updateRow(i, 'ticker', e.target.value)}
                    placeholder='AAPL'
                    className='col-span-5 bg-white/3 border border-white/10
                      rounded-xl px-3 py-2.5 text-white text-sm
                      placeholder-gray-600 focus:outline-none
                      focus:border-[#494fdf]/50 transition-all uppercase'
                  />
                  <div className='col-span-5 relative'>
                    <input
                      type='number'
                      value={row.weight}
                      onChange={e => updateRow(i, 'weight', e.target.value)}
                      placeholder='10'
                      className='w-full bg-white/3 border border-white/10
                        rounded-xl px-3 py-2.5 text-white text-sm
                        placeholder-gray-600 focus:outline-none
                        focus:border-[#494fdf]/50 transition-all pr-7'
                    />
                    <span className='absolute right-3 top-1/2 -translate-y-1/2
                      text-gray-500 text-sm'>%</span>
                  </div>
                  <button onClick={() => removeRow(i)}
                    className='col-span-2 flex items-center justify-center
                      text-gray-600 hover:text-[#e23b4a] transition-colors'>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={addRow}
              className='mt-3 flex items-center gap-1.5 text-xs text-[#8d969e]
                hover:text-gray-200 transition-colors'>
              <Plus size={13} />
              Add position
            </button>
          </div>

          {/* Scenario */}
          <div>
            <div className='flex items-center justify-between mb-2'>
              <label className='text-xs text-[#8d969e] font-medium'>
                Stress scenario
              </label>
              {activeScenario && (
                <span className='text-xs text-[#494fdf]'>{activeScenario} loaded</span>
              )}
            </div>
            <textarea
              value={scenario}
              onChange={e => {
                setScenario(e.target.value)
                setActiveScenario(null)
              }}
              rows={2}
              placeholder='e.g. Market crashes 30%, rates rise 2%, tech drops 50%'
              className='w-full bg-white/3 border border-white/10 rounded-xl
                p-4 text-white placeholder-gray-600 resize-none
                focus:outline-none focus:border-[#494fdf]/50 text-sm
                transition-all mb-3'
            />
            <div className='flex flex-wrap gap-2'>
              {HISTORICAL_SCENARIOS.map(s => (
                <button key={s.label}
                  onClick={() => {
                    setScenario(s.text)
                    setActiveScenario(s.label)
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border
                    transition-all
                    ${activeScenario === s.label
                      ? 'border-[#494fdf]/50 bg-[#494fdf]/10 text-[#494fdf]'
                      : 'border-white/8 bg-white/3 text-[#8d969e] hover:text-gray-200 hover:border-white/15'
                    }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className='flex items-center gap-2 text-[#e23b4a] text-sm
              bg-[#e23b4a]/10 border border-[#e23b4a]/20 rounded-xl px-4 py-3'>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button
            onClick={handleRun}
            disabled={loading}
            className='w-full py-4 rounded-full font-medium text-sm
              transition-opacity duration-150 active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
              bg-[#494fdf] hover:opacity-85'>
            {loading ? (
              <span className='flex items-center justify-center gap-2'>
                <span className='w-4 h-4 border-2 border-white/30
                  border-t-white rounded-full animate-spin' />
                Running analysis...
              </span>
            ) : (
              <span className='flex items-center justify-center gap-2'>
                <Zap size={16} />
                Run Live Stress Test
              </span>
            )}
          </button>

          <p className='text-center text-xs text-[#505a63]'>
            Results include factor model, correlation breakdown, liquidity
            analysis, Monte Carlo simulation, and AI analyst memo
          </p>
        </div>
      </div>
    </main>
  )
}
