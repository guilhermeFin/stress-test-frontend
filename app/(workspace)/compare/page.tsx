'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { comparePortfolios, StressTestResult } from '@/lib/api'
import { LumaSpin } from '@/components/ui/luma-spin'
import {
  Upload, ChevronRight, AlertCircle,
  Trophy, Shield, Zap
} from 'lucide-react'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
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
      className={`border-2 border-dashed rounded-xl p-6 text-center
        cursor-pointer transition-all
        ${isDragActive ? 'border-[#2563EB] bg-[#2563EB]/10'
          : file ? 'border-[#15803D]/60 bg-[#15803D]/5'
          : 'border-slate-300 bg-slate-50 hover:border-[#2563EB] hover:bg-[#2563EB]/5'}`}>
      <input {...getInputProps()} />
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center
        mx-auto mb-2 border shadow-sm
        ${file ? 'bg-[#15803D]/10 border-[#15803D]/20' : 'bg-white border-slate-200'}`}>
        <Upload size={18} className={file ? 'text-[#15803D]' : 'text-slate-500'} />
      </div>
      <p className='text-base font-semibold text-[#0B1B2E] mb-1'>{label}</p>
      {file
        ? <p className='text-[#15803D] text-xs font-semibold'>{file.name}</p>
        : <p className='text-slate-500 text-sm'>Drop .xlsx here</p>
      }
    </div>
  )
}

function MetricCompare({ label, a, b, format = (v: number) => v.toFixed(1) + '%', lowerIsBetter = true }: any) {
  const aWins = lowerIsBetter ? a >= b : a <= b
  const diff  = Math.abs(a - b)

  return (
    <div className='bg-white rounded-lg p-4 border border-slate-200 shadow-sm'>
      <p className='text-xs text-slate-500 mb-3'>{label}</p>
      <div className='grid grid-cols-2 gap-3'>
        <div className={`rounded-lg p-3 text-center ${!aWins ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-100'}`}>
          <div className={`text-xl font-bold tabular-nums ${!aWins ? 'text-[#15803D]' : 'text-[#B91C1C]'}`}>
            {format(a)}
          </div>
          <div className='text-xs text-slate-400 mt-1'>Portfolio A</div>
          {!aWins && <div className='text-xs text-[#15803D] mt-1'>✓ Better</div>}
        </div>
        <div className={`rounded-lg p-3 text-center ${aWins ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-100'}`}>
          <div className={`text-xl font-bold tabular-nums ${aWins ? 'text-[#15803D]' : 'text-[#B91C1C]'}`}>
            {format(b)}
          </div>
          <div className='text-xs text-slate-400 mt-1'>Portfolio B</div>
          {aWins && <div className='text-xs text-[#15803D] mt-1'>✓ Better</div>}
        </div>
      </div>
      <div className='mt-2 text-center text-xs text-slate-400'>
        Difference: {format(diff)}
      </div>
    </div>
  )
}

function WinnerBadge({ results }: { results: { a: StressTestResult; b: StressTestResult } }) {
  const aLoss = results.a.summary.total_loss_pct
  const bLoss = results.b.summary.total_loss_pct
  const aWins = aLoss > bLoss

  const fmt = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(n)

  return (
    <div className='bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center shadow-sm'>
      <Trophy size={32} className='text-amber-500 mx-auto mb-3' />
      <p className='text-sm text-slate-500 mb-1'>More Resilient Portfolio</p>
      <p className='text-3xl font-semibold text-[#0B1B2E] mb-2'>
        Portfolio {aWins ? 'A' : 'B'}
      </p>
      <p className='text-[#15803D] text-sm font-medium'>
        {Math.abs(aLoss - bLoss).toFixed(1)}% less loss under stress
      </p>
      <p className='text-slate-400 text-xs mt-2'>
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
      setError('Comparison failed. Please check both files and try again.')
    } finally {
      setLoading(false)
    }
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(n)

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
    <main className='min-h-screen text-[#0B1B2E] relative'>
      {loading && (
        <div className='absolute inset-0 z-50 flex flex-col items-center justify-center
          bg-white/95 backdrop-blur-sm'>
          <LumaSpin size={65} />
          <p className='mt-6 text-sm text-slate-600 font-medium'>Comparing portfolios…</p>
          <p className='mt-1 text-xs text-slate-400'>Running both stress tests in parallel</p>
        </div>
      )}
      <div className='max-w-6xl mx-auto px-6 py-10'>

        {/* Title */}
        <div className='mb-10'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-[#2563EB]/8 border border-[#2563EB]/20 text-[#2563EB]
            text-xs font-medium mb-4'>
            <Shield size={12} />
            Portfolio Comparison
          </div>
          <h1 className='font-semibold text-[#0B1B2E] mb-3'
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: '1.1', letterSpacing: '-0.8px' }}>
            Which portfolio<br />survives the storm?
          </h1>
          <p className='text-slate-500 text-base max-w-lg'>
            Upload two portfolios, run the same stress scenario, and see
            side-by-side which one is more resilient.
          </p>
        </div>

        {/* Input card */}
        <div className='bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm'>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-5'>
            <DropZone label='Portfolio A' file={fileA} onDrop={setFileA} />
            <DropZone label='Portfolio B' file={fileB} onDrop={setFileB} />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-semibold text-[#0B1B2E] mb-2'>
              Stress scenario (same for both)
            </label>
            <textarea
              value={scenario}
              onChange={e => setScenario(e.target.value)}
              className='w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-3
                text-[#0B1B2E] placeholder-slate-400 resize-none focus:outline-none
                focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white
                text-sm transition-all'
              rows={2}
              placeholder='e.g. Market crashes 30%, rates rise 2%, tech sector drops 50%'
            />
          </div>

          <div className='flex flex-wrap gap-2 mb-5'>
            {SAMPLE_SCENARIOS.map(s => (
              <button key={s} onClick={() => setScenario(s)}
                className='text-sm font-medium text-slate-700 hover:text-[#2563EB] px-3 py-1.5 rounded-full
                  border border-slate-300 bg-white hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-colors'>
                {s.split(':')[0].split(',')[0]}
              </button>
            ))}
          </div>

          {error && (
            <div className='mb-4 flex items-center gap-2 text-[#B91C1C] text-sm
              bg-red-50 border border-red-200 rounded-lg px-4 py-3'>
              <AlertCircle size={14} className='shrink-0' />
              {error}
            </div>
          )}

          <button
            onClick={handleCompare}
            disabled={loading}
            className='w-full py-4 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white
              font-bold text-base shadow-md transition-colors active:scale-[0.98] disabled:opacity-50
              disabled:cursor-not-allowed flex items-center justify-center gap-2'>
            {loading ? (
              <>
                <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                Comparing portfolios...
              </>
            ) : (
              <>
                <Zap size={16} />
                Compare Portfolios
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className='space-y-6'>

            <WinnerBadge results={results} />

            <div>
              <h2 className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4'>Key metrics</h2>
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

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

              <div className='bg-white rounded-lg p-6 border border-slate-200 shadow-sm'>
                <h3 className='font-medium text-[#0B1B2E] mb-1'>Portfolio Value Comparison</h3>
                <p className='text-xs text-slate-500 mb-4'>Before and after stress</p>
                <ResponsiveContainer width='100%' height={220}>
                  <BarChart data={barData}>
                    <XAxis dataKey='name' tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }}
                      tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(v: any) => [fmt(v), '']}
                      contentStyle={TOOLTIP_STYLE}
                      labelStyle={{ color: '#F9FAFB' }}
                      itemStyle={{ color: '#F9FAFB' }} />
                    <Bar dataKey='A' name='Portfolio A' fill='#2563EB' radius={[4,4,0,0]} />
                    <Bar dataKey='B' name='Portfolio B' fill='#8B5CF6' radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className='bg-white rounded-lg p-6 border border-slate-200 shadow-sm'>
                <h3 className='font-medium text-[#0B1B2E] mb-1'>Loss by Position (%)</h3>
                <p className='text-xs text-slate-500 mb-4'>Top 8 positions compared</p>
                <ResponsiveContainer width='100%' height={220}>
                  <BarChart data={lossBarData} layout='vertical'>
                    <XAxis type='number' tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis dataKey='ticker' type='category'
                      tick={{ fill: '#64748B', fontSize: 11 }} width={45} />
                    <Tooltip
                      formatter={(v: any) => [`-${Number(v).toFixed(1)}%`, '']}
                      contentStyle={TOOLTIP_STYLE}
                      labelStyle={{ color: '#F9FAFB' }}
                      itemStyle={{ color: '#F9FAFB' }} />
                    <Bar dataKey='A' name='Portfolio A' fill='#2563EB' radius={[0,4,4,0]} />
                    <Bar dataKey='B' name='Portfolio B' fill='#8B5CF6' radius={[0,4,4,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className='bg-white rounded-lg p-6 border border-slate-200 shadow-sm'>
              <h3 className='font-medium text-[#0B1B2E] mb-1'>Risk Profile Radar</h3>
              <p className='text-xs text-slate-500 mb-4'>Multi-dimensional risk comparison — smaller area = less risk</p>
              <ResponsiveContainer width='100%' height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke='#E2E8F0' />
                  <PolarAngleAxis dataKey='metric' tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Radar name='Portfolio A' dataKey='A'
                    stroke='#2563EB' fill='#2563EB' fillOpacity={0.15} />
                  <Radar name='Portfolio B' dataKey='B'
                    stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
              <div className='flex items-center gap-6 justify-center mt-2'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-[#2563EB]' />
                  <span className='text-xs text-slate-500'>Portfolio A</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-purple-500' />
                  <span className='text-xs text-slate-500'>Portfolio B</span>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm'>
              <div className='p-5 pb-3 border-b border-slate-100'>
                <h3 className='font-medium text-[#0B1B2E]'>Position-by-Position Comparison</h3>
                <p className='text-xs text-slate-500 mt-1'>Common positions across both portfolios</p>
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead className='bg-slate-50 text-slate-500 text-xs'>
                    <tr>
                      <th className='px-4 py-3 text-left'>Ticker</th>
                      <th className='px-4 py-3 text-right text-[#2563EB]'>A Loss %</th>
                      <th className='px-4 py-3 text-right text-purple-600'>B Loss %</th>
                      <th className='px-4 py-3 text-right'>Difference</th>
                      <th className='px-4 py-3 text-center'>Winner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.a.positions
                      .sort((a, b) => a.loss_pct - b.loss_pct)
                      .map((posA, i) => {
                        const posB = results.b.positions.find(p => p.ticker === posA.ticker)
                        if (!posB) return null
                        const diff = posA.loss_pct - posB.loss_pct
                        const aWins = posA.loss_pct > posB.loss_pct
                        return (
                          <tr key={posA.ticker}
                            className={`border-t border-slate-100 hover:bg-slate-50
                              ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                            <td className='px-4 py-3 font-medium text-[#0B1B2E]'>{posA.ticker}</td>
                            <td className='px-4 py-3 text-right text-[#2563EB] tabular-nums'>
                              {posA.loss_pct.toFixed(1)}%
                            </td>
                            <td className='px-4 py-3 text-right text-purple-600 tabular-nums'>
                              {posB.loss_pct.toFixed(1)}%
                            </td>
                            <td className={`px-4 py-3 text-right text-xs font-medium tabular-nums
                              ${Math.abs(diff) < 0.5 ? 'text-slate-400'
                                : diff > 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'}`}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                            </td>
                            <td className='px-4 py-3 text-center'>
                              {Math.abs(diff) < 0.5
                                ? <span className='text-xs text-slate-400'>Tied</span>
                                : <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                                    ${aWins
                                      ? 'bg-[#2563EB]/10 text-[#2563EB]'
                                      : 'bg-purple-50 text-purple-700'
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

            <div className='bg-blue-50 border border-blue-200 rounded-xl
              p-5 flex items-center justify-between'>
              <div>
                <p className='text-[#2563EB] font-medium text-sm'>Want the full analysis?</p>
                <p className='text-blue-600/70 text-xs mt-0.5'>
                  Run a complete stress test with factor model, correlation
                  breakdown, and AI memo on the winning portfolio.
                </p>
              </div>
              <Link href='/upload'
                className='flex items-center gap-2 px-5 py-2.5 rounded-lg
                  bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm
                  font-semibold transition-colors whitespace-nowrap ml-4'>
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
