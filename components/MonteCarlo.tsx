'use client'

import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'

const TOOLTIP_STYLE = {
  background: '#1F2937',
  border: '1px solid #374151',
  borderRadius: 8,
  color: '#F9FAFB'
}

interface SimConfig {
  years: number
  simulations: number
  annualReturn: number
  volatility: number
  monthlyContribution: number
}

const DEFAULT_CONFIG: SimConfig = {
  years: 20,
  simulations: 1000,
  annualReturn: 0.07,
  volatility: 0.15,
  monthlyContribution: 2000,
}

function runMonteCarlo(
  startValue: number,
  config: SimConfig
): number[][] {
  const { years, simulations, annualReturn, volatility, monthlyContribution } = config
  const annualContrib = monthlyContribution * 12
  const results: number[][] = []

  for (let s = 0; s < simulations; s++) {
    const path: number[] = [startValue]
    let val = startValue
    for (let y = 0; y < years; y++) {
      // Random return using Box-Muller transform
      const u1 = Math.random()
      const u2 = Math.random()
      const z  = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
      const r  = annualReturn + volatility * z
      val = val * (1 + r) + annualContrib
      val = Math.max(0, val)
      path.push(Math.round(val))
    }
    results.push(path)
  }
  return results
}

function getPercentiles(results: number[][], year: number) {
  const vals = results.map(r => r[year]).sort((a, b) => a - b)
  const n = vals.length
  return {
    p5:     vals[Math.floor(n * 0.05)],
    p25:    vals[Math.floor(n * 0.25)],
    p50:    vals[Math.floor(n * 0.50)],
    p75:    vals[Math.floor(n * 0.75)],
    p95:    vals[Math.floor(n * 0.95)],
  }
}

function buildChartData(
  normalResults: number[][],
  stressResults: number[][],
  years: number
) {
  return Array.from({ length: years + 1 }, (_, y) => {
    const n = getPercentiles(normalResults, y)
    const s = getPercentiles(stressResults, y)
    return {
      year: y,
      // Normal paths
      n_p95:  n.p95,
      n_p75:  n.p75,
      n_p50:  n.p50,
      n_p25:  n.p25,
      n_p5:   n.p5,
      // Stress paths
      s_p95:  s.p95,
      s_p75:  s.p75,
      s_p50:  s.p50,
      s_p25:  s.p25,
      s_p5:   s.p5,
    }
  })
}

function StatCard({ label, value, sub, color }: any) {
  return (
    <div className='bg-white/5 rounded-xl p-4'>
      <div className='text-xs text-gray-400 mb-1'>{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      {sub && <div className='text-xs text-gray-500 mt-0.5'>{sub}</div>}
    </div>
  )
}

export default function MonteCarlo({
  portfolioValue,
  stressedValue,
}: {
  portfolioValue: number
  stressedValue: number
}) {
  const [config, setConfig] = useState<SimConfig>(DEFAULT_CONFIG)
  const [showStress, setShowStress] = useState(true)
  const [running, setRunning] = useState(false)
  const [ran, setRan] = useState(false)

  const set = (key: keyof SimConfig) => (val: number) =>
    setConfig(prev => ({ ...prev, [key]: val }))

  const { normalResults, stressResults, chartData } = useMemo(() => {
    if (!ran) return { normalResults: [], stressResults: [], chartData: [] }
    const normal = runMonteCarlo(portfolioValue, config)
    const stress = runMonteCarlo(stressedValue, config)
    const data   = buildChartData(normal, stress, config.years)
    return { normalResults: normal, stressResults: stress, chartData: data }
  }, [ran, portfolioValue, stressedValue, config])

  const handleRun = () => {
    setRunning(true)
    setTimeout(() => {
      setRan(true)
      setRunning(false)
    }, 100)
  }

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
    return `$${n}`
  }

  const fmtFull = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(n)

  // Final year stats
  const normalFinal = ran ? getPercentiles(normalResults, config.years) : null
  const stressFinal = ran ? getPercentiles(stressResults, config.years) : null

  const probBelowGoal = ran
    ? Math.round(
        stressResults.filter(r => r[config.years] < portfolioValue).length
        / stressResults.length * 100
      )
    : null

  return (
    <div className='space-y-4'>

      {/* Config panel */}
      <div className='bg-white/3 rounded-2xl p-5 border border-white/8'>
        <h3 className='font-semibold text-gray-200 mb-4'>Simulation Parameters</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
          {[
            { label: 'Time Horizon', key: 'years', min: 5, max: 40, step: 5, suffix: 'yrs' },
            { label: 'Annual Return', key: 'annualReturn', min: 0.03, max: 0.12, step: 0.01, suffix: '%', scale: 100 },
            { label: 'Volatility', key: 'volatility', min: 0.05, max: 0.35, step: 0.01, suffix: '%', scale: 100 },
            { label: 'Monthly Contribution', key: 'monthlyContribution', min: 0, max: 10000, step: 500, prefix: '$' },
          ].map(({ label, key, min, max, step, suffix, prefix, scale }) => (
            <div key={key}>
              <label className='block text-xs text-gray-400 mb-1'>{label}</label>
              <div className='flex items-center bg-white/5 border border-white/10
                rounded-lg overflow-hidden'>
                {prefix && (
                  <span className='px-2 py-2 text-gray-400 text-sm border-r border-white/10'>
                    {prefix}
                  </span>
                )}
                <input
                  type='number'
                  value={scale ? Math.round(config[key as keyof SimConfig] as number * scale) : config[key as keyof SimConfig] as number}
                  onChange={e => set(key as keyof SimConfig)(
                    scale ? Number(e.target.value) / scale : Number(e.target.value)
                  )}
                  min={scale ? min * scale : min}
                  max={scale ? max * scale : max}
                  step={scale ? step * scale : step}
                  className='flex-1 bg-transparent px-2 py-2 text-white text-sm
                    focus:outline-none w-full'
                />
                {suffix && (
                  <span className='px-2 py-2 text-gray-400 text-sm border-l border-white/10'>
                    {suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className='flex items-center gap-4'>
          <button
            onClick={handleRun}
            disabled={running}
            className='bg-blue-600 hover:opacity-85 active:scale-[0.98]
              disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-full
              transition-opacity duration-150 text-sm'>
            {running ? 'Running 1,000 simulations...' : ran ? 'Re-run Simulation' : 'Run Monte Carlo (1,000 paths)'}
          </button>
          {ran && (
            <label className='flex items-center gap-2 text-sm text-gray-400 cursor-pointer'>
              <input
                type='checkbox'
                checked={showStress}
                onChange={e => setShowStress(e.target.checked)}
                className='accent-blue-500'
              />
              Show stressed paths
            </label>
          )}
        </div>
      </div>

      {ran && normalFinal && stressFinal && (
        <>
          {/* Summary stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <StatCard
              label={`Median outcome (normal) — yr ${config.years}`}
              value={fmt(normalFinal.p50)}
              sub='50th percentile'
              color='text-blue-400'
            />
            <StatCard
              label={`Median outcome (stressed) — yr ${config.years}`}
              value={fmt(stressFinal.p50)}
              sub='50th percentile'
              color='text-red-400'
            />
            <StatCard
              label='Best case (95th pct, stressed)'
              value={fmt(stressFinal.p95)}
              sub='Top 5% of outcomes'
              color='text-green-400'
            />
            <StatCard
              label='Worst case (5th pct, stressed)'
              value={fmt(stressFinal.p5)}
              sub='Bottom 5% of outcomes'
              color='text-red-500'
            />
          </div>

          {/* Probability of loss */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-white/3 rounded-2xl p-5 border border-white/8 text-center'>
              <p className='text-xs text-gray-400 mb-1'>Prob. below starting value (stressed)</p>
              <p className='text-3xl font-bold text-red-400'>{probBelowGoal}%</p>
              <p className='text-xs text-gray-500 mt-1'>of paths end below {fmtFull(portfolioValue)}</p>
            </div>
            <div className='bg-white/3 rounded-2xl p-5 border border-white/8 text-center'>
              <p className='text-xs text-gray-400 mb-1'>Median gap (normal vs stressed)</p>
              <p className='text-3xl font-bold text-orange-400'>
                {fmt(normalFinal.p50 - stressFinal.p50)}
              </p>
              <p className='text-xs text-gray-500 mt-1'>lost at median over {config.years} years</p>
            </div>
            <div className='bg-white/3 rounded-2xl p-5 border border-white/8 text-center'>
              <p className='text-xs text-gray-400 mb-1'>Upside preserved (stressed p75)</p>
              <p className='text-3xl font-bold text-green-400'>
                {Math.round(stressFinal.p75 / normalFinal.p75 * 100)}%
              </p>
              <p className='text-xs text-gray-500 mt-1'>of normal upside retained</p>
            </div>
          </div>

          {/* Fan chart */}
          <div className='bg-white/3 rounded-2xl p-6 border border-white/8'>
            <h3 className='font-semibold text-gray-200 mb-1'>
              Monte Carlo Fan Chart — {config.simulations.toLocaleString()} Simulations
            </h3>
            <p className='text-xs text-gray-500 mb-4'>
              Shaded bands show 5th–95th percentile range of outcomes
            </p>
            <ResponsiveContainer width='100%' height={340}>
              <LineChart data={chartData}>
                <XAxis dataKey='year' tick={{ fill: '#6B7280', fontSize: 11 }}
                  label={{ value: 'Years', position: 'insideBottom', offset: -2, fill: '#6B7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }}
                  tickFormatter={fmt} width={70} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: '#F9FAFB' }}
                  itemStyle={{ color: '#F9FAFB' }}
                  formatter={(v: any, name: string | number | undefined) => [fmtFull(v), String(name ?? '')]}
                />
                <ReferenceLine y={portfolioValue} stroke='#374151'
                  strokeDasharray='4 4' label={{ value: 'Start', fill: '#6B7280', fontSize: 10 }} />

                {/* Normal paths */}
                <Line dataKey='n_p95' name='Normal P95' stroke='#3B82F6'
                  strokeWidth={1} dot={false} strokeDasharray='4 2' />
                <Line dataKey='n_p75' name='Normal P75' stroke='#3B82F6'
                  strokeWidth={1.5} dot={false} />
                <Line dataKey='n_p50' name='Normal Median' stroke='#3B82F6'
                  strokeWidth={2.5} dot={false} />
                <Line dataKey='n_p25' name='Normal P25' stroke='#3B82F6'
                  strokeWidth={1.5} dot={false} />
                <Line dataKey='n_p5' name='Normal P5' stroke='#3B82F6'
                  strokeWidth={1} dot={false} strokeDasharray='4 2' />

                {/* Stress paths */}
                {showStress && <>
                  <Line dataKey='s_p95' name='Stress P95' stroke='#EF4444'
                    strokeWidth={1} dot={false} strokeDasharray='4 2' />
                  <Line dataKey='s_p75' name='Stress P75' stroke='#EF4444'
                    strokeWidth={1.5} dot={false} />
                  <Line dataKey='s_p50' name='Stress Median' stroke='#EF4444'
                    strokeWidth={2.5} dot={false} />
                  <Line dataKey='s_p25' name='Stress P25' stroke='#EF4444'
                    strokeWidth={1.5} dot={false} />
                  <Line dataKey='s_p5' name='Stress P5' stroke='#EF4444'
                    strokeWidth={1} dot={false} strokeDasharray='4 2' />
                </>}
              </LineChart>
            </ResponsiveContainer>

            <div className='flex items-center gap-6 mt-3 justify-center'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-0.5 bg-blue-500' />
                <span className='text-xs text-gray-400'>Normal paths (P5/P25/P50/P75/P95)</span>
              </div>
              {showStress && (
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-0.5 bg-red-500' />
                  <span className='text-xs text-gray-400'>Stressed paths (P5/P25/P50/P75/P95)</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!ran && (
        <div className='bg-white/3 rounded-2xl p-10 border border-white/8
          text-center text-gray-500'>
          <p className='text-lg mb-2'>🎲 Monte Carlo Simulation</p>
          <p className='text-sm'>
            Click "Run Monte Carlo" to simulate 1,000 possible portfolio paths
            over {config.years} years, showing the range of outcomes under
            normal and stressed starting conditions.
          </p>
        </div>
      )}
    </div>
  )
}
