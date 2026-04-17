'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { comparePortfolios, StressTestResult } from '@/lib/api'
import {
  Upload, TrendingDown, ChevronRight, AlertCircle,
  ArrowLeft, Trophy, Shield, Zap
} from 'lucide-react'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell
} from 'recharts'

const TOOLTIP_STYLE = {
  background: '#1F2937',
  border: '1px solid #374151',
  borderRadius: 8,
  color: '#F9FAFB'
}

function DropZone({ label, file, onDrop }: {
  label: string
  file: File | null
  onDrop: (f: File) => void
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    onDrop: (files) => onDrop(files[0]),
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-6 text-center
        cursor-pointer transition-all
        ${isDragActive ? 'border-blue-500 bg-blue-500/10'
          : file ? 'border-green-500/50 bg-green-500/5'
          : 'border-white/10 hover:border-white/20'}`}>
      <input {...getInputProps()} />
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center
        mx-auto mb-2 ${file ? 'bg-green-500/20' : 'bg-white/5'}`}>
        <Upload size={18} className={file ? 'text-green-400' : 'text-gray-500'} />
      </div>
      <p className='text-xs text-gray-400 font-medium mb-1'>{label}</p>
      {file
        ? <p className='text-green-400 text-xs font-medium'>{file.name}</p>
        : <p className='text-gray-600 text-xs'>Drop .xlsx here</p>
      }
    </div>
  )
}

function MetricCompare({ label, a, b, format = (v: number) => v.toFixed(1) + '%', lowerIsBetter = true }: any) {
  const aWins = lowerIsBetter ? a >= b : a <= b
  const diff  = Math.abs(a - b)

  return (
    <div className='bg-gray-900 rounded-xl p-4 border border-gray-800'>
      <p className='text-xs text-gray-500 mb-3'>{label}</p>
      <div className='grid grid-cols-2 gap-3'>
        <div className={`rounded-lg p-3 text-center ${!aWins ? 'bg-green-950/50 border border-green-800' : 'bg-gray-800'}`}>
          <div className={`text-xl font-bold ${!aWins ? 'text-green-400' : 'text-red-400'}`}>
            {format(a)}
          </div>
          <div className='text-xs text-gray-500 mt-1'>Portfolio A</div>
          {!aWins && <div className='text-xs text-green-400 mt-1'>✓ Better</div>}
        </div>
        <div className={`rounded-lg p-3 text-center ${aWins ? 'bg-green-950/50 border border-green-800' : 'bg-gray-800'}`}>
          <div className={`text-xl font-bold ${aWins ? 'text-green-400' : 'text-red-400'}`}>
            {format(b)}
          </div>
          <div className='text-xs text-gray-500 mt-1'>Portfolio B</div>
          {aWins && <div className='text-xs text-green-400 mt-1'>✓ Better</div>}
        </div>
      </div>
      <div className='mt-2 text-center text-xs text-gray-600'>
        Difference: {format(diff)}
      </div>
    </div>
  )
}

function WinnerBadge({ results }: { results: { a: StressTestResult; b: StressTestResult } }) {
  const aLoss = results.a.summary.total_loss_pct
  const bLoss = results.b.summary.total_loss_pct
  const aWins = aLoss > bLoss // less negative = better

  const fmt = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(n)

  return (
    <div className='bg-gradient-to-r from-green-950/50 to-blue-950/50
      border border-green-800/50 rounded-2xl p-6 text-center'>
      <Trophy size={32} className='text-yellow-400 mx-auto mb-3' />
      <p className='text-sm text-gray-400 mb-1'>More Resilient Portfolio</p>
      <p className='text-3xl font-bold text-white mb-2'>
        Portfolio {aWins ? 'A' : 'B'}
      </p>
      <p className='text-green-400 text-sm'>
        {Math.abs(aLoss - bLoss).toFixed(1)}% less loss under stress
      </p>
      <p className='text-gray-500 text-xs mt-2'>
        Saves {fmt(Math.abs(
          results.a.summary.stressed_value - results.b.summary.stressed_value
        ))} in stressed value
      </p>
    </div>
  )
}

export default function ComparePage() {
  const [fileA, setFileA] = useState<File | null>(null)
  const [fileB, setFileB] = useState<File | null>(null)
  const [scenario, setScenario] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [results, setResults]   = useState<{ a: StressTestResult; b: StressTestResult } | null>(null)

  const SAMPLE_SCENARIOS = [
    'Market crashes 25%, interest rates rise 2%, tech drops 40%',
    '2008-style crisis: equities fall 50%, credit markets freeze',
    'Stagflation: inflation at 8%, GDP contracts 3%, rates at 7%',
  ]

  const handleCompare = async () => {
    if (!fileA || !fileB || !scenario) {
      setError('Please upload both portfolios and describe a scenario.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await comparePortfolios(fileA, fileB, scenario)
      setResults(res)
    } catch {
      setError('Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(n)

  // Chart data
  const barData = results ? [
    {
      name: 'Portfolio Value',
      A: results.a.summary.total_value,
      B: results.b.summary.total_value,
    },
    {
      name: 'Stressed Value',
      A: results.a.summary.stressed_value,
      B: results.b.summary.stressed_value,
    },
  ] : []

  const lossBarData = results
    ? [...results.a.positions]
        .sort((a, b) => a.loss_pct - b.loss_pct)
        .slice(0, 8)
        .map(p => {
          const bPos = results.b.positions.find(x => x.ticker === p.ticker)
          return {
            ticker: p.ticker,
            A: Math.abs(p.loss_pct),
            B: bPos ? Math.abs(bPos.loss_pct) : 0,
          }
        })
    : []

  const radarData = results ? [
    {
      metric: 'Loss %',
      A: Math.abs(results.a.summary.total_loss_pct),
      B: Math.abs(results.b.summary.total_loss_pct),
    },
    {
      metric: 'High Risk Pos',
      A: results.a.positions.filter(p => p.risk_level === 'High').length * 8,
      B: results.b.positions.filter(p => p.risk_level === 'High').length * 8,
    },
    {
      metric: 'Avg Beta',
      A: results.a.positions.reduce((s, p) => s + p.beta, 0) /
         results.a.positions.length * 30,
      B: results.b.positions.reduce((s, p) => s + p.beta, 0) /
         results.b.positions.length * 30,
    },
    {
      metric: 'VaR 95',
      A: Math.abs(results.a.positions.reduce((s, p) => s + p.var_95, 0) /
         results.a.positions.length) * 10,
      B: Math.abs(results.b.positions.reduce((s, p) => s + p.var_95, 0) /
         results.b.positions.length) * 10,
    },
    {
      metric: 'Concentration',
      A: Math.max(...results.a.positions.map(p => p.weight)),
      B: Math.max(...results.b.positions.map(p => p.weight)),
    },
  ] : []

  return (
    <main className='min-h-screen bg-[#0A0F1E] text-white'>
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10
          rounded-full blur-3xl' />
        <div className='absolute top-1/2 -left-40 w-80 h-80 bg-indigo-600/10
          rounded-full blur-3xl' />
      </div>

      <div className='relative max-w-6xl mx-auto px-6 py-10'>

        {/* Header */}
        <div className='flex items-center justify-between mb-10'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 bg-blue-600 rounded-xl flex items-center
              justify-center'>
              <TrendingDown size={18} className='text-white' />
            </div>
            <span className='font-bold text-lg tracking-tight'>PortfolioStress</span>
          </div>
          <Link href='/' className='flex items-center gap-2 text-sm text-gray-400
            hover:text-white transition-colors'>
            <ArrowLeft size={14} />
            Back to home
          </Link>
        </div>

        {/* Title */}
        <div className='mb-10'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-purple-500/10 border border-purple-500/20 text-purple-400
            text-xs font-medium mb-4'>
            <Shield size={12} />
            Portfolio Comparison
          </div>
          <h1 className='text-4xl font-bold tracking-tight mb-3
            bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent'>
            Which portfolio<br />survives the storm?
          </h1>
          <p className='text-gray-400 text-base max-w-lg'>
            Upload two portfolios, run the same stress scenario, and see
            side-by-side which one is more resilient.
          </p>
        </div>

        {/* Input card */}
        <div className='bg-white/3 border border-white/8 rounded-3xl p-6
          backdrop-blur-sm mb-8'>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-5'>
            <DropZone label='Portfolio A' file={fileA} onDrop={setFileA} />
            <DropZone label='Portfolio B' file={fileB} onDrop={setFileB} />
          </div>

          <div className='mb-4'>
            <label className='block text-xs text-gray-400 font-medium mb-2'>
              Stress scenario (same for both)
            </label>
            <textarea
              value={scenario}
              onChange={e => setScenario(e.target.value)}
              className='w-full bg-white/3 border border-white/10 rounded-xl p-4
                text-white placeholder-gray-600 resize-none focus:outline-none
                focus:border-blue-500/50 text-sm transition-all'
              rows={2}
              placeholder='e.g. Market crashes 30%, rates rise 2%, tech sector drops 50%'
            />
          </div>

          <div className='flex flex-wrap gap-2 mb-5'>
            {SAMPLE_SCENARIOS.map(s => (
              <button key={s} onClick={() => setScenario(s)}
                className='text-xs bg-white/3 hover:bg-white/8 border border-white/8
                  hover:border-white/15 text-gray-400 hover:text-gray-200
                  px-3 py-1.5 rounded-lg transition-all'>
                {s.split(':')[0].split(',')[0]}
              </button>
            ))}
          </div>

          {error && (
            <div className='mb-4 flex items-center gap-2 text-red-400 text-sm
              bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3'>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button
            onClick={handleCompare}
            disabled={loading}
            className='w-full py-3.5 rounded-2xl font-semibold text-sm
              transition-all disabled:opacity-50
              bg-gradient-to-r from-purple-600 to-blue-600
              hover:from-purple-500 hover:to-blue-500
              shadow-lg shadow-purple-600/20'>
            {loading ? (
              <span className='flex items-center justify-center gap-2'>
                <span className='w-4 h-4 border-2 border-white/30 border-t-white
                  rounded-full animate-spin' />
                Comparing portfolios...
              </span>
            ) : (
              <span className='flex items-center justify-center gap-2'>
                <Zap size={16} />
                Compare Portfolios
              </span>
            )}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className='space-y-6'>

            {/* Winner */}
            <WinnerBadge results={results} />

            {/* Key metrics comparison */}
            <div>
              <h2 className='text-lg font-semibold mb-4'>Key Metrics</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <MetricCompare
                  label='Total Loss %'
                  a={results.a.summary.total_loss_pct}
                  b={results.b.summary.total_loss_pct}
                  format={(v: number) => `${v.toFixed(1)}%`}
                  lowerIsBetter={false}
                />
                <MetricCompare
                  label='Stressed Value'
                  a={results.a.summary.stressed_value}
                  b={results.b.summary.stressed_value}
                  format={(v: number) => fmt(v)}
                  lowerIsBetter={false}
                />
                <MetricCompare
                  label='Sharpe After Stress'
                  a={results.a.summary.sharpe_after}
                  b={results.b.summary.sharpe_after}
                  format={(v: number) => v.toFixed(2)}
                  lowerIsBetter={false}
                />
                <MetricCompare
                  label='Severity'
                  a={results.a.summary.severity_label === 'Extreme' ? 4
                    : results.a.summary.severity_label === 'Severe' ? 3
                    : results.a.summary.severity_label === 'Moderate' ? 2 : 1}
                  b={results.b.summary.severity_label === 'Extreme' ? 4
                    : results.b.summary.severity_label === 'Severe' ? 3
                    : results.b.summary.severity_label === 'Moderate' ? 2 : 1}
                  format={(_: number) =>
                    _ === 4 ? 'Extreme' : _ === 3 ? 'Severe'
                    : _ === 2 ? 'Moderate' : 'Mild'}
                  lowerIsBetter={false}
                />
              </div>
            </div>

            {/* Charts */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

              {/* Value comparison */}
              <div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
                <h3 className='font-semibold text-gray-200 mb-1'>
                  Portfolio Value Comparison
                </h3>
                <p className='text-xs text-gray-500 mb-4'>
                  Before and after stress
                </p>
                <ResponsiveContainer width='100%' height={220}>
                  <BarChart data={barData}>
                    <XAxis dataKey='name' tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 11 }}
                      tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(v: any) => [fmt(v), '']}
                      contentStyle={TOOLTIP_STYLE}
                      labelStyle={{ color: '#F9FAFB' }}
                      itemStyle={{ color: '#F9FAFB' }} />
                    <Bar dataKey='A' name='Portfolio A' fill='#3B82F6'
                      radius={[4,4,0,0]} />
                    <Bar dataKey='B' name='Portfolio B' fill='#8B5CF6'
                      radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Loss by position */}
              <div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
                <h3 className='font-semibold text-gray-200 mb-1'>
                  Loss by Position (%)
                </h3>
                <p className='text-xs text-gray-500 mb-4'>
                  Top 8 positions compared
                </p>
                <ResponsiveContainer width='100%' height={220}>
                  <BarChart data={lossBarData} layout='vertical'>
                    <XAxis type='number' tick={{ fill: '#6B7280', fontSize: 11 }} />
                    <YAxis dataKey='ticker' type='category'
                      tick={{ fill: '#9CA3AF', fontSize: 11 }} width={45} />
                    <Tooltip
                      formatter={(v: any) => [`-${Number(v).toFixed(1)}%`, '']}
                      contentStyle={TOOLTIP_STYLE}
                      labelStyle={{ color: '#F9FAFB' }}
                      itemStyle={{ color: '#F9FAFB' }} />
                    <Bar dataKey='A' name='Portfolio A' fill='#3B82F6'
                      radius={[0,4,4,0]} />
                    <Bar dataKey='B' name='Portfolio B' fill='#8B5CF6'
                      radius={[0,4,4,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar comparison */}
            <div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
              <h3 className='font-semibold text-gray-200 mb-1'>
                Risk Profile Radar
              </h3>
              <p className='text-xs text-gray-500 mb-4'>
                Multi-dimensional risk comparison — smaller area = less risk
              </p>
              <ResponsiveContainer width='100%' height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke='#374151' />
                  <PolarAngleAxis dataKey='metric'
                    tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <Radar name='Portfolio A' dataKey='A'
                    stroke='#3B82F6' fill='#3B82F6' fillOpacity={0.25} />
                  <Radar name='Portfolio B' dataKey='B'
                    stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
              <div className='flex items-center gap-6 justify-center mt-2'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-blue-500' />
                  <span className='text-xs text-gray-400'>Portfolio A</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-purple-500' />
                  <span className='text-xs text-gray-400'>Portfolio B</span>
                </div>
              </div>
            </div>

            {/* Position comparison table */}
            <div className='bg-gray-900 rounded-2xl border border-gray-800
              overflow-hidden'>
              <div className='p-5 pb-3'>
                <h3 className='font-semibold text-gray-200'>
                  Position-by-Position Comparison
                </h3>
                <p className='text-xs text-gray-500 mt-1'>
                  Common positions across both portfolios
                </p>
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead className='bg-gray-800 text-gray-400 text-xs'>
                    <tr>
                      <th className='px-4 py-3 text-left'>Ticker</th>
                      <th className='px-4 py-3 text-right text-blue-400'>
                        A Loss %
                      </th>
                      <th className='px-4 py-3 text-right text-purple-400'>
                        B Loss %
                      </th>
                      <th className='px-4 py-3 text-right'>Difference</th>
                      <th className='px-4 py-3 text-center'>Winner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.a.positions
                      .sort((a, b) => a.loss_pct - b.loss_pct)
                      .map((posA, i) => {
                        const posB = results.b.positions.find(
                          p => p.ticker === posA.ticker
                        )
                        if (!posB) return null
                        const diff = posA.loss_pct - posB.loss_pct
                        const aWins = posA.loss_pct > posB.loss_pct
                        return (
                          <tr key={posA.ticker}
                            className={`border-t border-gray-800
                              hover:bg-gray-800/50
                              ${i % 2 === 0 ? '' : 'bg-gray-900/50'}`}>
                            <td className='px-4 py-3 font-medium text-white'>
                              {posA.ticker}
                            </td>
                            <td className='px-4 py-3 text-right text-blue-400'>
                              {posA.loss_pct.toFixed(1)}%
                            </td>
                            <td className='px-4 py-3 text-right text-purple-400'>
                              {posB.loss_pct.toFixed(1)}%
                            </td>
                            <td className={`px-4 py-3 text-right text-xs font-medium
                              ${Math.abs(diff) < 0.5 ? 'text-gray-500'
                                : diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                            </td>
                            <td className='px-4 py-3 text-center'>
                              {Math.abs(diff) < 0.5
                                ? <span className='text-xs text-gray-500'>Tied</span>
                                : <span className={`text-xs font-bold px-2 py-0.5
                                    rounded-full
                                    ${aWins
                                      ? 'bg-blue-900/50 text-blue-400'
                                      : 'bg-purple-900/50 text-purple-400'
                                    }`}>
                                    {aWins ? 'A' : 'B'}
                                  </span>
                              }
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA to run full analysis */}
            <div className='bg-blue-950/40 border border-blue-800 rounded-2xl
              p-5 flex items-center justify-between'>
              <div>
                <p className='text-blue-300 font-medium text-sm'>
                  Want the full analysis?
                </p>
                <p className='text-blue-400/70 text-xs mt-0.5'>
                  Run a complete stress test with factor model, correlation
                  breakdown, and AI memo on the winning portfolio.
                </p>
              </div>
              <Link href='/'
                className='flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-blue-600 hover:bg-blue-500 text-white text-sm
                  font-medium transition-all whitespace-nowrap ml-4'>
                Full Analysis
                <ChevronRight size={14} />
              </Link>
            </div>

          </div>
        )}
      </div>
    </main>
  )
}