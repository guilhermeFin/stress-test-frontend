'use client'

import { useMemo } from 'react'

const TICKERS_ORDER = ['AAPL','MSFT','AMZN','JPM','XOM','JNJ','NEE','GLD','TLT','LQD','BTC','VNQ']

// Normal market correlations (pre-stress)
const NORMAL_CORR: Record<string, Record<string, number>> = {
  AAPL: { AAPL:1.00, MSFT:0.82, AMZN:0.74, JPM:0.45, XOM:0.21, JNJ:0.18, NEE:0.15, GLD:-0.05, TLT:-0.12, LQD:0.08, BTC:0.38, VNQ:0.22 },
  MSFT: { AAPL:0.82, MSFT:1.00, AMZN:0.78, JPM:0.42, XOM:0.18, JNJ:0.15, NEE:0.12, GLD:-0.08, TLT:-0.15, LQD:0.05, BTC:0.35, VNQ:0.19 },
  AMZN: { AAPL:0.74, MSFT:0.78, AMZN:1.00, JPM:0.38, XOM:0.15, JNJ:0.12, NEE:0.10, GLD:-0.10, TLT:-0.18, LQD:0.02, BTC:0.32, VNQ:0.16 },
  JPM:  { AAPL:0.45, MSFT:0.42, AMZN:0.38, JPM:1.00, XOM:0.35, JNJ:0.28, NEE:0.22, GLD:-0.15, TLT:-0.25, LQD:0.42, BTC:0.18, VNQ:0.45 },
  XOM:  { AAPL:0.21, MSFT:0.18, AMZN:0.15, JPM:0.35, XOM:1.00, JNJ:0.25, NEE:0.30, GLD:0.22,  TLT:-0.18, LQD:0.18, BTC:0.08, VNQ:0.28 },
  JNJ:  { AAPL:0.18, MSFT:0.15, AMZN:0.12, JPM:0.28, XOM:0.25, JNJ:1.00, NEE:0.35, GLD:0.12,  TLT:0.05,  LQD:0.22, BTC:0.05, VNQ:0.30 },
  NEE:  { AAPL:0.15, MSFT:0.12, AMZN:0.10, JPM:0.22, XOM:0.30, JNJ:0.35, NEE:1.00, GLD:0.08,  TLT:0.18,  LQD:0.28, BTC:0.02, VNQ:0.42 },
  GLD:  { AAPL:-0.05,MSFT:-0.08,AMZN:-0.10,JPM:-0.15,XOM:0.22, JNJ:0.12, NEE:0.08, GLD:1.00,  TLT:0.35,  LQD:0.18, BTC:0.12, VNQ:0.05 },
  TLT:  { AAPL:-0.12,MSFT:-0.15,AMZN:-0.18,JPM:-0.25,XOM:-0.18,JNJ:0.05, NEE:0.18, GLD:0.35,  TLT:1.00,  LQD:0.65, BTC:-0.05,VNQ:0.25 },
  LQD:  { AAPL:0.08, MSFT:0.05, AMZN:0.02, JPM:0.42, XOM:0.18, JNJ:0.22, NEE:0.28, GLD:0.18,  TLT:0.65,  LQD:1.00, BTC:0.05, VNQ:0.35 },
  BTC:  { AAPL:0.38, MSFT:0.35, AMZN:0.32, JPM:0.18, XOM:0.08, JNJ:0.05, NEE:0.02, GLD:0.12,  TLT:-0.05, LQD:0.05, BTC:1.00, VNQ:0.12 },
  VNQ:  { AAPL:0.22, MSFT:0.19, AMZN:0.16, JPM:0.45, XOM:0.28, JNJ:0.30, NEE:0.42, GLD:0.05,  TLT:0.25,  LQD:0.35, BTC:0.12, VNQ:1.00 },
}

// Stress correlations — everything converges toward 1 (diversification fails)
const STRESS_CORR: Record<string, Record<string, number>> = {
  AAPL: { AAPL:1.00, MSFT:0.95, AMZN:0.92, JPM:0.78, XOM:0.55, JNJ:0.45, NEE:0.42, GLD:-0.15, TLT:-0.35, LQD:0.35, BTC:0.72, VNQ:0.65 },
  MSFT: { AAPL:0.95, MSFT:1.00, AMZN:0.90, JPM:0.75, XOM:0.52, JNJ:0.42, NEE:0.38, GLD:-0.18, TLT:-0.38, LQD:0.32, BTC:0.68, VNQ:0.62 },
  AMZN: { AAPL:0.92, MSFT:0.90, AMZN:1.00, JPM:0.72, XOM:0.48, JNJ:0.38, NEE:0.35, GLD:-0.20, TLT:-0.40, LQD:0.28, BTC:0.65, VNQ:0.58 },
  JPM:  { AAPL:0.78, MSFT:0.75, AMZN:0.72, JPM:1.00, XOM:0.68, JNJ:0.55, NEE:0.50, GLD:-0.28, TLT:-0.52, LQD:0.72, BTC:0.55, VNQ:0.78 },
  XOM:  { AAPL:0.55, MSFT:0.52, AMZN:0.48, JPM:0.68, XOM:1.00, JNJ:0.48, NEE:0.58, GLD:0.15,  TLT:-0.42, LQD:0.48, BTC:0.38, VNQ:0.62 },
  JNJ:  { AAPL:0.45, MSFT:0.42, AMZN:0.38, JPM:0.55, XOM:0.48, JNJ:1.00, NEE:0.55, GLD:0.05,  TLT:-0.15, LQD:0.45, BTC:0.28, VNQ:0.52 },
  NEE:  { AAPL:0.42, MSFT:0.38, AMZN:0.35, JPM:0.50, XOM:0.58, JNJ:0.55, NEE:1.00, GLD:0.02,  TLT:-0.10, LQD:0.48, BTC:0.22, VNQ:0.68 },
  GLD:  { AAPL:-0.15,MSFT:-0.18,AMZN:-0.20,JPM:-0.28,XOM:0.15, JNJ:0.05, NEE:0.02, GLD:1.00,  TLT:0.55,  LQD:0.28, BTC:0.08, VNQ:-0.12 },
  TLT:  { AAPL:-0.35,MSFT:-0.38,AMZN:-0.40,JPM:-0.52,XOM:-0.42,JNJ:-0.15,NEE:-0.10,GLD:0.55,  TLT:1.00,  LQD:0.72, BTC:-0.22,VNQ:-0.18 },
  LQD:  { AAPL:0.35, MSFT:0.32, AMZN:0.28, JPM:0.72, XOM:0.48, JNJ:0.45, NEE:0.48, GLD:0.28,  TLT:0.72,  LQD:1.00, BTC:0.28, VNQ:0.58 },
  BTC:  { AAPL:0.72, MSFT:0.68, AMZN:0.65, JPM:0.55, XOM:0.38, JNJ:0.28, NEE:0.22, GLD:0.08,  TLT:-0.22, LQD:0.28, BTC:1.00, VNQ:0.45 },
  VNQ:  { AAPL:0.65, MSFT:0.62, AMZN:0.58, JPM:0.78, XOM:0.62, JNJ:0.52, NEE:0.68, GLD:-0.12, TLT:-0.18, LQD:0.58, BTC:0.45, VNQ:1.00 },
}

function corrColor(v: number): string {
  if (v >= 0.8)  return 'bg-red-600 text-white'
  if (v >= 0.6)  return 'bg-red-400 text-white'
  if (v >= 0.4)  return 'bg-orange-400 text-white'
  if (v >= 0.2)  return 'bg-yellow-400 text-gray-900'
  if (v >= 0)    return 'bg-gray-700 text-gray-300'
  if (v >= -0.2) return 'bg-green-800 text-green-200'
  return 'bg-green-600 text-white'
}

function Matrix({ data, tickers, title, subtitle }: {
  data: Record<string, Record<string, number>>
  tickers: string[]
  title: string
  subtitle: string
}) {
  return (
    <div className='bg-white/3 rounded-2xl p-6 border border-white/8'>
      <h3 className='font-semibold text-gray-200 mb-1'>{title}</h3>
      <p className='text-xs text-gray-500 mb-4'>{subtitle}</p>
      <div className='overflow-x-auto'>
        <table className='text-xs border-collapse'>
          <thead>
            <tr>
              <th className='w-10'></th>
              {tickers.map(t => (
                <th key={t} className='w-10 h-10 text-gray-400 font-medium
                  text-center pb-1 rotate-0'>
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickers.map(row => (
              <tr key={row}>
                <td className='pr-2 text-gray-400 font-medium text-right
                  whitespace-nowrap py-0.5'>
                  {row}
                </td>
                {tickers.map(col => {
                  const v = data[row]?.[col] ?? 0
                  const isDiag = row === col
                  return (
                    <td key={col} className='p-0.5'>
                      <div className={`w-9 h-9 rounded flex items-center
                        justify-center text-xs font-medium
                        ${isDiag ? 'bg-gray-600 text-white' : corrColor(v)}`}>
                        {isDiag ? '—' : v.toFixed(2)}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className='flex items-center gap-2 mt-4 flex-wrap'>
        <span className='text-xs text-gray-500'>Correlation:</span>
        {[
          { label: '> 0.8', cls: 'bg-red-600' },
          { label: '0.6–0.8', cls: 'bg-red-400' },
          { label: '0.4–0.6', cls: 'bg-orange-400' },
          { label: '0.2–0.4', cls: 'bg-yellow-400' },
          { label: '0–0.2', cls: 'bg-gray-700' },
          { label: 'Negative', cls: 'bg-green-600' },
        ].map(({ label, cls }) => (
          <div key={label} className='flex items-center gap-1'>
            <div className={`w-3 h-3 rounded ${cls}`} />
            <span className='text-xs text-gray-400'>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CorrelationMatrix({ positions }: { positions: any[] }) {
  const tickers = useMemo(() => {
    const present = new Set(positions.map((p: any) => p.ticker))
    return TICKERS_ORDER.filter(t => present.has(t))
  }, [positions])

  // Calculate correlation change (stress - normal)
  const avgNormalOffDiag = useMemo(() => {
    let sum = 0, count = 0
    tickers.forEach(r => tickers.forEach(c => {
      if (r !== c) { sum += NORMAL_CORR[r]?.[c] ?? 0; count++ }
    }))
    return count > 0 ? sum / count : 0
  }, [tickers])

  const avgStressOffDiag = useMemo(() => {
    let sum = 0, count = 0
    tickers.forEach(r => tickers.forEach(c => {
      if (r !== c) { sum += STRESS_CORR[r]?.[c] ?? 0; count++ }
    }))
    return count > 0 ? sum / count : 0
  }, [tickers])

  const corrIncrease = ((avgStressOffDiag - avgNormalOffDiag) * 100).toFixed(0)

  return (
    <div className='space-y-4'>

      {/* Warning banner */}
      <div className='bg-orange-950/50 border border-orange-800 rounded-xl p-4
        flex items-start gap-3'>
        <div className='text-orange-400 text-xl mt-0.5'>⚠</div>
        <div>
          <p className='text-orange-300 font-medium text-sm'>
            Diversification breakdown detected
          </p>
          <p className='text-orange-400/80 text-xs mt-1'>
            Average portfolio correlation rises from{' '}
            <strong>{avgNormalOffDiag.toFixed(2)}</strong> in normal markets to{' '}
            <strong>{avgStressOffDiag.toFixed(2)}</strong> under stress —
            a <strong>+{corrIncrease}%</strong> increase.
            Assets that normally diversify each other start moving together.
          </p>
        </div>
      </div>

      {/* Two matrices side by side */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        <Matrix
          data={NORMAL_CORR}
          tickers={tickers}
          title='Normal Market Correlations'
          subtitle='How assets relate in calm conditions'
        />
        <Matrix
          data={STRESS_CORR}
          tickers={tickers}
          title='Stress Correlations'
          subtitle='How assets move together during crisis — diversification fails'
        />
      </div>

      {/* Key insights */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {[
          {
            title: 'Tech concentration risk',
            body: 'AAPL, MSFT, AMZN correlations jump from ~0.78 to ~0.92 under stress. A 26% portfolio in tech becomes effectively one position.',
            color: 'border-red-800 bg-red-950/30',
            badge: 'High Risk',
            badgeColor: 'bg-red-800 text-red-200',
          },
          {
            title: 'Bond hedge weakens',
            body: 'TLT correlation to equities stays negative under stress, but its hedging power diminishes as credit risk overrides duration benefits.',
            color: 'border-yellow-800 bg-yellow-950/30',
            badge: 'Monitor',
            badgeColor: 'bg-yellow-800 text-yellow-200',
          },
          {
            title: 'Gold holds its ground',
            body: 'GLD maintains low or negative correlation in stress, validating its role as a safe-haven hedge. Consider increasing allocation.',
            color: 'border-green-800 bg-green-950/30',
            badge: 'Diversifier',
            badgeColor: 'bg-green-800 text-green-200',
          },
        ].map(({ title, body, color, badge, badgeColor }) => (
          <div key={title} className={`rounded-xl p-4 border ${color}`}>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium text-gray-200'>{title}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>
                {badge}
              </span>
            </div>
            <p className='text-xs text-gray-400 leading-relaxed'>{body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}