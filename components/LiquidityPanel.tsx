'use client'

import { useMemo } from 'react'

// Liquidity profiles by asset class / ticker
const LIQUIDITY_PROFILES: Record<string, {
  score: number       // 1-10 (10 = most liquid)
  daysToExit: number  // estimated days to fully exit under stress
  stressMultiplier: number // how much harder to exit under stress
  type: string
}> = {
  AAPL: { score: 9, daysToExit: 1, stressMultiplier: 1.5, type: 'Large Cap Equity' },
  MSFT: { score: 9, daysToExit: 1, stressMultiplier: 1.5, type: 'Large Cap Equity' },
  AMZN: { score: 9, daysToExit: 1, stressMultiplier: 1.5, type: 'Large Cap Equity' },
  JPM:  { score: 9, daysToExit: 1, stressMultiplier: 1.8, type: 'Large Cap Equity' },
  XOM:  { score: 8, daysToExit: 1, stressMultiplier: 1.6, type: 'Large Cap Equity' },
  JNJ:  { score: 8, daysToExit: 1, stressMultiplier: 1.5, type: 'Large Cap Equity' },
  NEE:  { score: 7, daysToExit: 2, stressMultiplier: 2.0, type: 'Mid Cap Equity' },
  GLD:  { score: 9, daysToExit: 1, stressMultiplier: 1.2, type: 'Commodity ETF' },
  TLT:  { score: 8, daysToExit: 1, stressMultiplier: 1.8, type: 'Treasury ETF' },
  LQD:  { score: 6, daysToExit: 3, stressMultiplier: 3.5, type: 'Corporate Bond ETF' },
  BTC:  { score: 7, daysToExit: 1, stressMultiplier: 2.5, type: 'Cryptocurrency' },
  VNQ:  { score: 5, daysToExit: 5, stressMultiplier: 4.0, type: 'REIT ETF' },
}

const DEFAULT_PROFILE = { score: 6, daysToExit: 2, stressMultiplier: 2.0, type: 'Equity' }

function scoreColor(score: number) {
  if (score >= 8) return 'text-green-400'
  if (score >= 6) return 'text-yellow-400'
  if (score >= 4) return 'text-orange-400'
  return 'text-red-400'
}

function scoreBarColor(score: number) {
  if (score >= 8) return 'bg-green-500'
  if (score >= 6) return 'bg-yellow-500'
  if (score >= 4) return 'bg-orange-500'
  return 'bg-red-500'
}

function scoreBadge(score: number) {
  if (score >= 8) return { label: 'High', cls: 'bg-green-900/50 text-green-400 border-green-800' }
  if (score >= 6) return { label: 'Medium', cls: 'bg-yellow-900/50 text-yellow-400 border-yellow-800' }
  if (score >= 4) return { label: 'Low', cls: 'bg-orange-900/50 text-orange-400 border-orange-800' }
  return { label: 'Illiquid', cls: 'bg-red-900/50 text-red-400 border-red-800' }
}

export default function LiquidityPanel({ positions }: { positions: any[] }) {
  const totalValue = positions.reduce((s: number, p: any) => s + p.value, 0)

  const enriched = useMemo(() => positions.map((p: any) => {
    const profile = LIQUIDITY_PROFILES[p.ticker] ?? DEFAULT_PROFILE
    const stressDays = Math.ceil(profile.daysToExit * profile.stressMultiplier)
    const weight = p.value / totalValue * 100
    return { ...p, ...profile, stressDays, weight }
  }), [positions, totalValue])

  const sorted = [...enriched].sort((a, b) => a.score - b.score)

  // Portfolio-level metrics
  const weightedScore = enriched.reduce((s: number, p: any) =>
    s + (p.score * p.weight / 100), 0)

  const illiquidPct = enriched
    .filter((p: any) => p.score < 6)
    .reduce((s: number, p: any) => s + p.weight, 0)

  const stressIlliquidPct = enriched
    .filter((p: any) => p.stressDays > 3)
    .reduce((s: number, p: any) => s + p.weight, 0)

  const avgStressDays = enriched.reduce((s: number, p: any) =>
    s + (p.stressDays * p.weight / 100), 0)

  const portfolioLabel = weightedScore >= 8 ? 'Highly Liquid'
    : weightedScore >= 6 ? 'Moderately Liquid'
    : weightedScore >= 4 ? 'Low Liquidity'
    : 'Illiquid'

  const portfolioColor = weightedScore >= 8 ? 'text-green-400'
    : weightedScore >= 6 ? 'text-yellow-400'
    : weightedScore >= 4 ? 'text-orange-400'
    : 'text-red-400'

  return (
    <div className='space-y-4'>

      {/* Portfolio summary */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {[
          {
            label: 'Portfolio Liquidity Score',
            value: weightedScore.toFixed(1) + ' / 10',
            sub: portfolioLabel,
            color: portfolioColor,
          },
          {
            label: 'Currently Illiquid',
            value: illiquidPct.toFixed(1) + '%',
            sub: 'Score < 6 positions',
            color: illiquidPct > 20 ? 'text-red-400' : 'text-yellow-400',
          },
          {
            label: 'Illiquid Under Stress',
            value: stressIlliquidPct.toFixed(1) + '%',
            sub: 'Takes > 3 days to exit',
            color: stressIlliquidPct > 30 ? 'text-red-400' : 'text-orange-400',
          },
          {
            label: 'Avg Time to Exit',
            value: avgStressDays.toFixed(1) + ' days',
            sub: 'Weighted under stress',
            color: avgStressDays > 3 ? 'text-red-400' : 'text-green-400',
          },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className='bg-gray-900 rounded-2xl p-5 border border-gray-800'>
            <div className='text-xs text-gray-400 mb-2'>{label}</div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className='text-xs text-gray-500 mt-1'>{sub}</div>
          </div>
        ))}
      </div>

      {/* Liquidity bar */}
      <div className='bg-gray-900 rounded-2xl p-5 border border-gray-800'>
        <div className='flex justify-between text-xs text-gray-400 mb-2'>
          <span>Portfolio liquidity spectrum</span>
          <span>Weighted score: <strong className={portfolioColor}>{weightedScore.toFixed(1)}</strong></span>
        </div>
        <div className='w-full h-4 bg-gray-700 rounded-full overflow-hidden'>
          <div
            className='h-full rounded-full transition-all'
            style={{
              width: `${weightedScore * 10}%`,
              background: weightedScore >= 8 ? '#10B981'
                : weightedScore >= 6 ? '#F59E0B'
                : weightedScore >= 4 ? '#F97316'
                : '#EF4444'
            }}
          />
        </div>
        <div className='flex justify-between text-xs text-gray-600 mt-1'>
          <span>Illiquid</span>
          <span>Highly Liquid</span>
        </div>
      </div>

      {/* Position table */}
      <div className='bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden'>
        <div className='p-5 pb-3'>
          <h3 className='font-semibold text-gray-200'>Position Liquidity Detail</h3>
          <p className='text-xs text-gray-500 mt-1'>
            Stress conditions assume bid-ask spreads widen 2–5x and volume drops 60–80%
          </p>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-800 text-gray-400 text-xs'>
              <tr>
                <th className='px-4 py-3 text-left'>Position</th>
                <th className='px-4 py-3 text-left'>Type</th>
                <th className='px-4 py-3 text-right'>Weight</th>
                <th className='px-4 py-3 text-center'>Liquidity Score</th>
                <th className='px-4 py-3 text-center'>Normal Exit</th>
                <th className='px-4 py-3 text-center'>Stress Exit</th>
                <th className='px-4 py-3 text-center'>Rating</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p: any, i: number) => {
                const badge = scoreBadge(p.score)
                return (
                  <tr key={p.ticker}
                    className={`border-t border-gray-800 hover:bg-gray-800/50
                      ${i % 2 === 0 ? '' : 'bg-gray-900/50'}`}>
                    <td className='px-4 py-3'>
                      <div className='font-medium text-white'>{p.ticker}</div>
                      <div className='text-xs text-gray-500'>{p.name?.substring(0, 22)}</div>
                    </td>
                    <td className='px-4 py-3 text-xs text-gray-400'>{p.type}</td>
                    <td className='px-4 py-3 text-right text-gray-300'>
                      {p.weight.toFixed(1)}%
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <div className='flex-1 h-2 bg-gray-700 rounded-full overflow-hidden'>
                          <div
                            className={`h-full rounded-full ${scoreBarColor(p.score)}`}
                            style={{ width: `${p.score * 10}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold w-6 text-right ${scoreColor(p.score)}`}>
                          {p.score}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-center text-gray-300 text-xs'>
                      {p.daysToExit === 1 ? 'Same day' : `${p.daysToExit} days`}
                    </td>
                    <td className={`px-4 py-3 text-center text-xs font-medium
                      ${p.stressDays > 5 ? 'text-red-400'
                        : p.stressDays > 3 ? 'text-orange-400'
                        : 'text-yellow-400'}`}>
                      {p.stressDays === 1 ? '1–2 days' : `${p.stressDays}+ days`}
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <span className={`px-2 py-1 rounded-full text-xs
                        font-medium border ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warning for illiquid positions */}
      {stressIlliquidPct > 15 && (
        <div className='bg-orange-950/40 border border-orange-800 rounded-xl p-4'>
          <p className='text-orange-300 font-medium text-sm mb-1'>
            ⚠ Liquidity risk detected
          </p>
          <p className='text-orange-400/80 text-xs leading-relaxed'>
            {stressIlliquidPct.toFixed(1)}% of your portfolio could take more than
            3 days to exit under stress conditions. During a market crisis,
            forced selling of illiquid positions (VNQ, LQD) may result in
            significant slippage beyond modeled losses. Consider maintaining
            a cash buffer of at least 10% for rebalancing needs.
          </p>
        </div>
      )}

    </div>
  )
}