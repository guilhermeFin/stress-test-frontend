'use client'

import { useState } from 'react'
import { runPipeline, getStressResults, getMemo, PipelineResult, StressResults, MemoResult } from '@/lib/api'
import { TrendingDown, Zap, FileText, AlertTriangle, CheckCircle, Clock, ArrowLeft, BarChart2 } from 'lucide-react'

type Step = 'idle' | 'running_pipeline' | 'running_stress' | 'running_memo' | 'done' | 'error'

const PORTFOLIO = [
  { ticker: 'AAPL', name: 'Apple Inc.',                        sector: 'Technology',             weight: '10%', value: '$50,000',  beta: 1.28,  risk: 'Medium', type: 'Equity' },
  { ticker: 'MSFT', name: 'Microsoft Corporation',             sector: 'Technology',             weight: '8%',  value: '$40,000',  beta: 0.93,  risk: 'Low',    type: 'Equity' },
  { ticker: 'JPM',  name: 'JPMorgan Chase',                    sector: 'Financials',             weight: '8%',  value: '$40,000',  beta: 1.15,  risk: 'Medium', type: 'Equity' },
  { ticker: 'XOM',  name: 'Exxon Mobil',                       sector: 'Energy',                 weight: '7%',  value: '$35,000',  beta: 0.87,  risk: 'Medium', type: 'Equity' },
  { ticker: 'JNJ',  name: 'Johnson & Johnson',                  sector: 'Healthcare',             weight: '7%',  value: '$35,000',  beta: 0.54,  risk: 'Low',    type: 'Equity' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.',                   sector: 'Consumer Discretionary', weight: '8%',  value: '$40,000',  beta: 1.42,  risk: 'High',   type: 'Equity' },
  { ticker: 'NEE',  name: 'NextEra Energy',                    sector: 'Utilities',              weight: '5%',  value: '$25,000',  beta: 0.41,  risk: 'Medium', type: 'Equity' },
  { ticker: 'GLD',  name: 'SPDR Gold ETF',                     sector: 'Commodities',            weight: '7%',  value: '$35,000',  beta: 0.12,  risk: 'Low',    type: 'Equity' },
  { ticker: 'TLT',  name: 'iShares 20Y Treasury ETF',          sector: 'Government Bonds',       weight: '10%', value: '$50,000',  beta: -0.21, risk: 'Medium', type: 'Fixed Income' },
  { ticker: 'LQD',  name: 'iShares Corp Bond ETF',             sector: 'Corporate Bonds',        weight: '10%', value: '$50,000',  beta: 0.18,  risk: 'Medium', type: 'Fixed Income' },
  { ticker: 'BTC',  name: 'Bitcoin (spot)',                     sector: 'Crypto',                 weight: '5%',  value: '$25,000',  beta: 1.95,  risk: 'High',   type: 'Alternative' },
  { ticker: 'VNQ',  name: 'Vanguard Real Estate ETF',          sector: 'REITs',                  weight: '10%', value: '$50,000',  beta: 0.76,  risk: 'Medium', type: 'Real Estate' },
]

const COST_BASIS: Record<string, number> = {
  AAPL: 42000, MSFT: 28000, JPM: 35000, XOM: 30000,
  JNJ: 33000, AMZN: 32000, NEE: 27000, GLD: 30000,
  TLT: 55000, LQD: 52000, BTC: 15000, VNQ: 48000,
}

export default function IntelligencePage() {
  const [step, setStep]         = useState<Step>('idle')
  const [pipeline, setPipeline] = useState<PipelineResult | null>(null)
  const [stress, setStress]     = useState<StressResults | null>(null)
  const [memo, setMemo]         = useState<MemoResult | null>(null)
  const [error, setError]       = useState('')

  const handleRun = async () => {
    setStep('running_pipeline')
    setError('')
    setPipeline(null)
    setStress(null)
    setMemo(null)

    try {
      const p = await runPipeline()
      setPipeline(p)
      setStep('running_stress')
      const s = await getStressResults()
      setStress(s)
      setStep('running_memo')
      const m = await getMemo()
      setMemo(m)
      setStep('done')
    } catch (err) {
      setError('Pipeline failed. Is the backend running on port 8000?')
      setStep('error')
    }
  }

  const sentimentColor = (s: string) => {
    if (s === 'bullish') return 'text-green-400'
    if (s === 'bearish') return 'text-red-400'
    if (s === 'mixed')   return 'text-yellow-400'
    return 'text-gray-400'
  }

  const urgencyBadge = (u: string) => {
    if (u === 'immediate') return 'bg-red-900/50 text-red-300 border border-red-700'
    if (u === 'this_week') return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
    return 'bg-gray-800 text-gray-400 border border-gray-700'
  }

  const riskColor = (r: string) => {
    if (r === 'High')   return 'text-red-400'
    if (r === 'Medium') return 'text-yellow-400'
    return 'text-green-400'
  }

  const typeColor = (t: string) => {
    if (t === 'Equity')       return 'bg-blue-900/50 text-blue-300'
    if (t === 'Fixed Income') return 'bg-green-900/50 text-green-300'
    if (t === 'Alternative')  return 'bg-purple-900/50 text-purple-300'
    if (t === 'Real Estate')  return 'bg-orange-900/50 text-orange-300'
    return 'bg-gray-800 text-gray-300'
  }

  const meta = stress?.results?.meta

  return (
    <main className='min-h-screen bg-gray-950 text-white p-6'>
      <div className='max-w-6xl mx-auto space-y-8'>

        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <TrendingDown className='text-blue-400' size={28} />
            <div>
              <h1 className='text-2xl font-bold'>Live Market Intelligence</h1>
              <p className='text-gray-400 text-sm mt-0.5'>
                Portfolio Alpha-1 · $500,000 AUM · 12 positions
              </p>
            </div>
          </div>
          <a href='/' className='flex items-center gap-1 text-sm text-blue-400 hover:underline'>
            <ArrowLeft size={14} /> Back
          </a>
        </div>

        {/* Portfolio table — always visible */}
        <div className='bg-gray-900 border border-gray-800 rounded-2xl p-6'>
          <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
            <BarChart2 size={18} className='text-blue-400' />
            Portfolio Alpha-1 — Positions Being Stress Tested
          </h2>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='text-gray-400 text-xs border-b border-gray-800'>
                  <th className='text-left py-2 pr-4'>Ticker</th>
                  <th className='text-left py-2 pr-4'>Name</th>
                  <th className='text-left py-2 pr-4'>Type</th>
                  <th className='text-left py-2 pr-4'>Sector</th>
                  <th className='text-right py-2 pr-4'>Weight</th>
                  <th className='text-right py-2 pr-4'>Value</th>
                  <th className='text-right py-2 pr-4'>Cost Basis</th>
                  <th className='text-right py-2 pr-4'>Beta</th>
                  <th className='text-right py-2'>Risk</th>
                </tr>
              </thead>
              <tbody>
                {PORTFOLIO.map((pos) => {
                  const ugl = parseInt(pos.value.replace(/[$,]/g, '')) - COST_BASIS[pos.ticker]
                  return (
                    <tr key={pos.ticker}
                      className='border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors'>
                      <td className='py-2.5 pr-4'>
                        <span className='font-bold text-white'>{pos.ticker}</span>
                      </td>
                      <td className='py-2.5 pr-4 text-gray-300'>{pos.name}</td>
                      <td className='py-2.5 pr-4'>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor(pos.type)}`}>
                          {pos.type}
                        </span>
                      </td>
                      <td className='py-2.5 pr-4 text-gray-400'>{pos.sector}</td>
                      <td className='py-2.5 pr-4 text-right text-gray-300'>{pos.weight}</td>
                      <td className='py-2.5 pr-4 text-right text-white font-medium'>{pos.value}</td>
                      <td className='py-2.5 pr-4 text-right text-gray-400'>
                        ${COST_BASIS[pos.ticker].toLocaleString()}
                      </td>
                      <td className='py-2.5 pr-4 text-right text-gray-300'>{pos.beta}</td>
                      <td className={`py-2.5 text-right font-medium ${riskColor(pos.risk)}`}>
                        {pos.risk}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className='border-t border-gray-700'>
                  <td colSpan={4} className='py-2.5 text-gray-400 text-xs'>
                    12 positions · Weighted beta ~0.82
                  </td>
                  <td className='py-2.5 text-right font-bold text-white'>100%</td>
                  <td className='py-2.5 text-right font-bold text-white'>$500,000</td>
                  <td className='py-2.5 text-right font-bold text-gray-400'>$427,000</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Run button */}
        {step === 'idle' && (
          <div className='bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center'>
            <Zap className='mx-auto mb-4 text-blue-400' size={48} />
            <h2 className='text-xl font-semibold mb-2'>Run Full Intelligence Pipeline</h2>
            <p className='text-gray-400 mb-6 max-w-md mx-auto'>
              Pulls live macro data, SEC filings, and news — then stress tests
              the portfolio above and generates an analyst memo automatically.
            </p>
            <button
              onClick={handleRun}
              className='bg-blue-600 hover:bg-blue-500 text-white font-semibold
                px-8 py-3 rounded-xl transition-colors text-lg'>
              Run Pipeline
            </button>
          </div>
        )}

        {/* Progress */}
        {['running_pipeline', 'running_stress', 'running_memo'].includes(step) && (
          <div className='bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center'>
            <div className='flex justify-center mb-6'>
              <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent
                rounded-full animate-spin' />
            </div>
            <h2 className='text-xl font-semibold mb-4'>Running Pipeline...</h2>
            <div className='flex justify-center gap-8 text-sm'>
              {[
                { key: 'running_pipeline', label: 'Phase 1: Data + Signals' },
                { key: 'running_stress',   label: 'Phase 2: Stress Test' },
                { key: 'running_memo',     label: 'Phase 3: Analyst Memo' },
              ].map(({ key, label }) => {
                const steps   = ['running_pipeline', 'running_stress', 'running_memo', 'done']
                const current = steps.indexOf(step)
                const mine    = steps.indexOf(key)
                const done    = current > mine
                const active  = current === mine
                return (
                  <div key={key} className={`flex items-center gap-2
                    ${active ? 'text-blue-400' : done ? 'text-green-400' : 'text-gray-600'}`}>
                    {done
                      ? <CheckCircle size={16} />
                      : active
                      ? <Clock size={16} className='animate-pulse' />
                      : <div className='w-4 h-4 rounded-full border border-gray-600' />
                    }
                    {label}
                  </div>
                )
              })}
            </div>
            <p className='text-gray-500 text-sm mt-6'>This takes 4-5 minutes...</p>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className='bg-red-950 border border-red-800 rounded-2xl p-6 flex items-center gap-3'>
            <AlertTriangle className='text-red-400 shrink-0' size={24} />
            <div>
              <p className='text-red-300 font-medium'>{error}</p>
              <button onClick={() => setStep('idle')}
                className='text-sm text-red-400 hover:underline mt-1'>
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {step === 'done' && pipeline && stress && memo && (
          <div className='space-y-8'>

            {/* Run summary */}
            <div className='grid grid-cols-4 gap-4'>
              {[
                { label: 'Macro Series',  value: pipeline.summary.macro_series_pulled },
                { label: 'SEC Filings',   value: pipeline.summary.filings_found },
                { label: 'News Stories',  value: pipeline.summary.news_stories },
                { label: 'AI Signals',    value: pipeline.summary.signals_generated },
              ].map(({ label, value }) => (
                <div key={label} className='bg-gray-900 border border-gray-800
                  rounded-xl p-4 text-center'>
                  <div className='text-2xl font-bold text-blue-400'>{value}</div>
                  <div className='text-gray-400 text-sm mt-1'>{label}</div>
                </div>
              ))}
            </div>

            {/* Stress test summary */}
            {meta && (
              <div className='bg-gray-900 border border-gray-800 rounded-2xl p-6'>
                <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                  <TrendingDown size={18} className='text-red-400' />
                  Stress Test Results
                </h2>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                  {[
                    { label: 'Cost Basis',     value: `$${meta.total_cost_basis.toLocaleString()}` },
                    { label: 'Unrealized G/L', value: `$${meta.total_unrealized_gl.toLocaleString()}`,
                      color: meta.total_unrealized_gl >= 0 ? 'text-green-400' : 'text-red-400' },
                    { label: 'Expected Loss',  value: `$${meta.expected_weighted_loss.toLocaleString()}`,
                      color: 'text-red-400' },
                    { label: 'Worst Case',     value: `${meta.worst_case_pct}%`,
                      color: 'text-red-400' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className='bg-gray-800 rounded-xl p-4'>
                      <div className='text-gray-400 text-xs mb-1'>{label}</div>
                      <div className={`text-xl font-bold ${color || 'text-white'}`}>{value}</div>
                    </div>
                  ))}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  {Object.values(stress.results.scenarios).map((scenario) => (
                    <div key={scenario.scenario_key}
                      className='bg-gray-800 rounded-xl p-4 border border-gray-700'>
                      <div className='flex justify-between items-start mb-2'>
                        <span className='font-medium'>{scenario.scenario_name}</span>
                        <span className='text-xs text-gray-400'>
                          {scenario.probability * 100}% prob.
                        </span>
                      </div>
                      <div className='text-red-400 text-2xl font-bold'>
                        {scenario.summary.pct_impact}%
                      </div>
                      <div className='text-gray-400 text-sm'>
                        ${scenario.summary.total_pnl.toLocaleString()}
                      </div>
                      <div className='text-gray-500 text-xs mt-2'>
                        Worst: {scenario.summary.biggest_loss.ticker} (
                        {scenario.summary.biggest_loss.shock_pct}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top signals */}
            <div className='bg-gray-900 border border-gray-800 rounded-2xl p-6'>
              <h2 className='text-lg font-semibold mb-4'>Top Signals</h2>
              <div className='space-y-3'>
                {pipeline.signals.slice(0, 8).map((signal, i) => (
                  <div key={i}
                    className='bg-gray-800 rounded-xl p-4 flex items-start gap-4'>
                    <span className={`text-sm font-bold uppercase shrink-0
                      ${sentimentColor(signal.market_sentiment)}`}>
                      {signal.market_sentiment}
                    </span>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm text-gray-200 leading-snug'>{signal.summary}</p>
                      {signal.action_flags.length > 0 && (
                        <div className='flex flex-wrap gap-1 mt-2'>
                          {signal.action_flags.map((flag, j) => (
                            <span key={j}
                              className='text-xs bg-gray-700 text-gray-300
                                px-2 py-0.5 rounded-full'>
                              {flag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full shrink-0
                      ${urgencyBadge(signal.urgency)}`}>
                      {signal.urgency.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Analyst memo */}
            <div className='bg-gray-900 border border-gray-800 rounded-2xl p-6'>
              <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <FileText size={18} className='text-blue-400' />
                Analyst Memo
              </h2>
              <div className='bg-gray-950 rounded-xl p-6 border border-gray-700
                max-h-[600px] overflow-y-auto'>
                {(memo.memo|| '').split('\n').map((line, i) => {
                  const isHeader = line.trim().length > 0 &&
                    line === line.toUpperCase() &&
                    !line.startsWith('-') &&
                    !line.startsWith('•')
                  return (
                    <p key={i} className={`
                      ${isHeader
                        ? 'text-blue-400 font-semibold mt-4 mb-1 text-sm tracking-wide'
                        : 'text-gray-200 text-sm leading-relaxed'}
                      ${line.trim() === '' ? 'h-2' : ''}
                    `}>
                      {line}
                    </p>
                  )
                })}
              </div>
            </div>

            {/* Run again */}
            <div className='text-center'>
              <button onClick={() => setStep('idle')}
                className='bg-gray-800 hover:bg-gray-700 text-white
                  px-6 py-2 rounded-xl transition-colors text-sm'>
                Run Again
              </button>
            </div>

          </div>
        )}
      </div>
    </main>
  )
}