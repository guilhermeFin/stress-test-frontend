'use client'

import { useState } from 'react'
import { LumaSpin } from '@/components/ui/luma-spin'
import {
  Zap, Plus, X,
  Brain, AlertCircle
} from 'lucide-react'
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
    } catch {
      setError('Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen text-[#0B1B2E] relative'>
      {loading && (
        <div className='absolute inset-0 z-50 flex flex-col items-center justify-center
          bg-white/95 backdrop-blur-sm'>
          <LumaSpin size={65} />
          <p className='mt-6 text-sm text-slate-600 font-medium'>Running analysis…</p>
          <p className='mt-1 text-xs text-slate-400'>This usually takes 15–45 seconds</p>
        </div>
      )}
      <div className='max-w-4xl mx-auto px-6 py-10'>

        {/* Title */}
        <div className='mb-8'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-[#2563EB]/8 border border-[#2563EB]/20 text-[#2563EB]
            text-xs font-medium mb-4'>
            <Brain size={12} />
            Live Portfolio Analysis
          </div>
          <h1 className='font-semibold text-[#0B1B2E] mb-3'
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: '1.1', letterSpacing: '-0.8px' }}>
            Build your portfolio,<br />stress test it live
          </h1>
          <p className='text-slate-500 text-base max-w-lg'>
            Enter your stocks and weights, pick a scenario, and get the same
            institutional analysis — factor risk, correlation breakdown,
            liquidity, Monte Carlo, and AI memo.
          </p>
        </div>

        {/* Main card */}
        <div className='bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6'>

          {/* Presets */}
          <div>
            <p className='text-sm font-semibold text-[#0B1B2E] mb-3'>Quick presets</p>
            <div className='flex gap-2 flex-wrap'>
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => applyPreset(p)}
                  className='px-3 py-1.5 rounded-full text-sm font-medium text-slate-700
                    border border-slate-300 bg-white hover:border-[#2563EB] hover:bg-[#2563EB]/5
                    hover:text-[#2563EB] transition-colors'>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* AUM */}
          <div>
            <label className='text-sm font-semibold text-[#0B1B2E] mb-2 block'>
              Total Portfolio Value (AUM)
            </label>
            <div className='relative w-48'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium'>$</span>
              <input
                type='number'
                value={totalAum}
                onChange={e => setTotalAum(e.target.value)}
                className='w-full bg-slate-50 border border-slate-300 rounded-md
                  pl-7 pr-4 py-3 text-[#0B1B2E] text-sm focus:outline-none
                  focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white
                  transition-all tabular-nums text-right'
              />
            </div>
          </div>

          {/* Ticker table */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <label className='text-sm font-semibold text-[#0B1B2E]'>
                Portfolio positions
              </label>
              <div className='flex items-center gap-2'>
                <span className={`text-xs font-medium tabular-nums ${
                  Math.abs(totalWeight - 100) < 1 ? 'text-[#15803D]'
                  : totalWeight > 100 ? 'text-[#B91C1C]' : 'text-orange-600'
                }`}>
                  {totalWeight.toFixed(1)}% / 100%
                </span>
                <button onClick={equalizeWeights}
                  className='text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] border border-[#2563EB]
                    hover:bg-[#2563EB]/5 px-3 py-1 rounded-full transition-colors'>
                  Equal weights
                </button>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='grid grid-cols-12 gap-2 px-2'>
                <div className='col-span-5 text-xs font-semibold text-slate-500 uppercase tracking-wide'>Ticker</div>
                <div className='col-span-5 text-xs font-semibold text-slate-500 uppercase tracking-wide'>Weight %</div>
                <div className='col-span-2' />
              </div>

              {tickers.map((row, i) => (
                <div key={i} className='grid grid-cols-12 gap-2 items-center bg-slate-50 rounded-md p-2'>
                  <input
                    value={row.ticker}
                    onChange={e => updateRow(i, 'ticker', e.target.value)}
                    placeholder='AAPL'
                    className='col-span-5 bg-white border border-slate-300
                      rounded-md px-3 py-2.5 text-[#0B1B2E] text-sm font-medium
                      placeholder-slate-400 focus:outline-none
                      focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20
                      transition-all uppercase'
                  />
                  <div className='col-span-5 relative'>
                    <input
                      type='number'
                      value={row.weight}
                      onChange={e => updateRow(i, 'weight', e.target.value)}
                      placeholder='10'
                      className='w-full bg-white border border-slate-300
                        rounded-md px-3 py-2.5 text-[#0B1B2E] text-sm
                        placeholder-slate-400 focus:outline-none
                        focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20
                        transition-all pr-7 tabular-nums'
                    />
                    <span className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium'>%</span>
                  </div>
                  <button onClick={() => removeRow(i)}
                    className='col-span-2 flex items-center justify-center
                      text-slate-400 hover:text-[#B91C1C] transition-colors'>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={addRow}
              className='mt-3 flex items-center gap-1.5 text-xs text-slate-500
                hover:text-[#0B1B2E] transition-colors'>
              <Plus size={13} />
              Add position
            </button>
          </div>

          {/* Scenario */}
          <div>
            <div className='flex items-center justify-between mb-2'>
              <label className='text-sm font-semibold text-[#0B1B2E]'>
                Stress scenario
              </label>
              {activeScenario && (
                <span className='text-xs font-medium text-[#2563EB]'>{activeScenario} loaded</span>
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
              className='w-full bg-slate-50 border border-slate-300 rounded-md
                px-4 py-3 text-[#0B1B2E] placeholder-slate-400 resize-none
                focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20
                focus:bg-white text-sm transition-all mb-3'
            />
            <div className='flex flex-wrap gap-2'>
              {HISTORICAL_SCENARIOS.map(s => (
                <button key={s.label}
                  onClick={() => {
                    setScenario(s.text)
                    setActiveScenario(s.label)
                  }}
                  className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all border
                    ${activeScenario === s.label
                      ? 'border-[#2563EB] bg-[#2563EB] text-white'
                      : 'border-slate-300 text-slate-700 hover:text-[#2563EB] hover:border-[#2563EB] hover:bg-[#2563EB]/5 bg-white'
                    }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className='flex items-center gap-2 text-[#B91C1C] text-sm
              bg-red-50 border border-red-200 rounded-lg px-4 py-3'>
              <AlertCircle size={14} className='shrink-0' />
              {error}
            </div>
          )}

          <button
            onClick={handleRun}
            disabled={loading}
            className='w-full py-4 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white
              font-bold text-base shadow-md transition-colors active:scale-[0.98] disabled:opacity-50
              disabled:cursor-not-allowed flex items-center justify-center gap-2'>
            {loading ? (
              <>
                <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                Running analysis...
              </>
            ) : (
              <>
                <Zap size={16} />
                Run Live Stress Test
              </>
            )}
          </button>

          <p className='text-center text-xs text-slate-400'>
            Results include factor model, correlation breakdown, liquidity
            analysis, Monte Carlo simulation, and AI analyst memo
          </p>
        </div>
      </div>
    </main>
  )
}
