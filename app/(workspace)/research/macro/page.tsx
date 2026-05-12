'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import { MOCK_MACRO } from '@/lib/research'

function MetricCard({ metric }: { metric: typeof MOCK_MACRO.metrics[0] }) {
  const up   = metric.direction === 'up'
  const down = metric.direction === 'down'
  const Icon = up ? TrendingUp : down ? TrendingDown : Minus
  const changeColor = up ? 'text-emerald-400' : down ? 'text-red-400' : 'text-gray-400'

  const valueStr = metric.unit === '$'
    ? `$${metric.value.toLocaleString()}`
    : metric.unit === '%'
    ? `${metric.value.toFixed(2)}%`
    : metric.value.toLocaleString()

  const changeStr = metric.unit === '$'
    ? `${metric.change >= 0 ? '+' : ''}$${metric.change.toFixed(0)}`
    : `${metric.change >= 0 ? '+' : ''}${metric.change.toFixed(2)}${metric.change_unit}`

  return (
    <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl p-4'>
      <div className='flex items-start justify-between mb-2'>
        <p className='text-xs text-gray-500 font-medium'>{metric.label}</p>
        <Icon size={13} className={`${changeColor} shrink-0`} />
      </div>
      <p className='text-xl font-bold tabular-nums mb-0.5'>{valueStr}</p>
      <div className='flex items-center gap-1.5'>
        <span className={`text-[11px] font-semibold tabular-nums ${changeColor}`}>
          {changeStr}
        </span>
        <span className='text-[10px] text-gray-600'>{metric.description}</span>
      </div>
    </div>
  )
}

function YieldCurveChart({ points }: { points: typeof MOCK_MACRO.yield_curve }) {
  const W = 520; const H = 160
  const PAD = { t: 12, r: 20, b: 28, l: 44 }
  const minR = Math.min(...points.map(p => p.rate)) - 0.1
  const maxR = Math.max(...points.map(p => p.rate)) + 0.1

  const sx = (i: number) => PAD.l + (i / (points.length - 1)) * (W - PAD.l - PAD.r)
  const sy = (r: number) => H - PAD.b - ((r - minR) / (maxR - minR)) * (H - PAD.t - PAD.b)

  const d    = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(p.rate).toFixed(1)}`).join(' ')
  const area = `${d} L${sx(points.length - 1).toFixed(1)},${(H - PAD.b)} L${PAD.l},${(H - PAD.b)} Z`

  const ticks = [minR, (minR + maxR) / 2, maxR].map(r => ({
    r, y: sy(r),
  }))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className='w-full'>
      <defs>
        <linearGradient id='ycGrad' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#3B82F6' stopOpacity='0.2' />
          <stop offset='100%' stopColor='#3B82F6' stopOpacity='0' />
        </linearGradient>
      </defs>
      {ticks.map(({ r, y }) => (
        <g key={r}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke='#ffffff08' />
          <text x={PAD.l - 4} y={y + 4} textAnchor='end' fontSize={9} fill='#6b7280'>{r.toFixed(1)}%</text>
        </g>
      ))}
      {points.map((p, i) => (
        <text key={p.maturity} x={sx(i)} y={H - 6} textAnchor='middle' fontSize={8} fill='#6b7280'>{p.maturity}</text>
      ))}
      <path d={area} fill='url(#ycGrad)' />
      <path d={d} stroke='#3B82F6' strokeWidth='2' fill='none' strokeLinecap='round' strokeLinejoin='round' />
      {points.map((p, i) => (
        <circle key={p.maturity} cx={sx(i)} cy={sy(p.rate)} r={3} fill='#3B82F6' />
      ))}
    </svg>
  )
}

const SPREAD_2Y_10Y = MOCK_MACRO.yield_curve.find(p => p.maturity === '10Y')!.rate -
  MOCK_MACRO.yield_curve.find(p => p.maturity === '2Y')!.rate

export default function MacroDashboardPage() {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 800)
  }

  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>

      <Link href='/research'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Research
      </Link>

      <div className='flex items-start justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight mb-1'>Macro Dashboard</h1>
          <p className='text-sm text-gray-500'>As of {MOCK_MACRO.as_of}. Live data via FRED + yfinance when backend is wired.</p>
        </div>
        <button onClick={handleRefresh}
          className='flex items-center gap-1.5 text-xs text-gray-500 hover:text-white
            border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-colors'>
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Yield curve */}
      <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h2 className='text-sm font-semibold'>US Treasury Yield Curve</h2>
            <p className='text-xs text-gray-500 mt-0.5'>
              2Y–10Y spread:
              <span className={`ml-1 font-bold ${SPREAD_2Y_10Y >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {SPREAD_2Y_10Y >= 0 ? '+' : ''}{SPREAD_2Y_10Y.toFixed(2)}%
              </span>
              <span className='text-gray-600 ml-1'>{SPREAD_2Y_10Y >= 0 ? '(normal — steepening)' : '(inverted — recession signal)'}</span>
            </p>
          </div>
          <div className='flex gap-3 text-[10px] text-gray-500'>
            <span className='flex items-center gap-1'><span className='w-3 h-px bg-[#3B82F6] inline-block' /> Current</span>
          </div>
        </div>
        <div className='bg-white/[0.02] rounded-xl px-3 pt-3 pb-1'>
          <YieldCurveChart points={MOCK_MACRO.yield_curve} />
        </div>
        <div className='grid grid-cols-4 gap-2 mt-3'>
          {['2Y', '5Y', '10Y', '30Y'].map(mat => {
            const pt = MOCK_MACRO.yield_curve.find(p => p.maturity === mat)
            return pt ? (
              <div key={mat} className='text-center'>
                <p className='text-xs text-gray-500'>{mat}</p>
                <p className='text-sm font-bold tabular-nums'>{pt.rate.toFixed(2)}%</p>
              </div>
            ) : null
          })}
        </div>
      </div>

      {/* Metrics grid */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
        {MOCK_MACRO.metrics.map(m => (
          <MetricCard key={m.label} metric={m} />
        ))}
      </div>

      <p className='text-[10px] text-gray-600 mt-4'>
        Mock data for demonstration. Wire backend to FRED API and yfinance for live updates. AI-assisted — verify before client use.
      </p>
    </div>
  )
}
