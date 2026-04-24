'use client'

import { useMemo } from 'react'
import { Lightbulb, TrendingDown, TrendingUp } from 'lucide-react'
import { StressTestResult, Position } from '@/lib/api'

interface ReduceRec {
  ticker: string
  sector: string
  currentWeight: number
  suggestedReduction: number
  reason: string
  lossPct: number
}

interface IncreaseRec {
  assetClass: string
  currentExposure: number
  targetIncrease: number
  whyResilient: string
  lossFactor: number
}

interface SectorAlloc {
  sector: string
  currentPct: number
  targetPct: number
  change: number
}

interface RebalancingData {
  reductions: ReduceRec[]
  increases: IncreaseRec[]
  sectorAlloc: SectorAlloc[]
  freedWeight: number
  currentWtdLoss: number
  projectedWtdLoss: number
  improvement: number
  narrative: string
}

function roundTo5(n: number): number {
  return Math.round(n / 5) * 5
}

function getIncreases(scenarioText: string, freedWeight: number): IncreaseRec[] {
  if (freedWeight <= 0) return []

  const text = scenarioText.toLowerCase()

  let candidates: { assetClass: string; whyResilient: string; lossFactor: number; weight: number }[]

  if (text.includes('rate') || text.includes('inflation')) {
    candidates = [
      { assetClass: 'Short-Duration Bonds', whyResilient: 'Short duration limits rate sensitivity', lossFactor: -5,  weight: 0.40 },
      { assetClass: 'Gold / Commodities',   whyResilient: 'Real assets hedge inflation',            lossFactor: -8,  weight: 0.35 },
      { assetClass: 'Cash',                 whyResilient: 'Zero duration, zero credit risk',        lossFactor: -2,  weight: 0.25 },
    ]
  } else if (text.includes('credit') || text.includes('2008') || text.includes('crisis')) {
    candidates = [
      { assetClass: 'US Treasuries',    whyResilient: 'Flight-to-safety demand drives prices up',     lossFactor: -3,  weight: 0.45 },
      { assetClass: 'Defensive Sectors', whyResilient: 'Utilities and staples hold up in downturns', lossFactor: -8,  weight: 0.35 },
      { assetClass: 'Cash',              whyResilient: 'Preserves capital during credit freeze',      lossFactor: -2,  weight: 0.20 },
    ]
  } else if (text.includes('tech') || text.includes('dot-com')) {
    candidates = [
      { assetClass: 'Value Stocks',          whyResilient: 'Low valuations buffer tech selloffs',              lossFactor: -8,  weight: 0.40 },
      { assetClass: 'Consumer Staples',      whyResilient: 'Defensive, minimal tech exposure',                lossFactor: -6,  weight: 0.35 },
      { assetClass: 'International Equities', whyResilient: 'Diversifies away from US tech concentration',    lossFactor: -10, weight: 0.25 },
    ]
  } else if (text.includes('covid') || text.includes('pandemic')) {
    candidates = [
      { assetClass: 'Healthcare',              whyResilient: 'Non-cyclical demand; crisis-resistant',        lossFactor: -5,  weight: 0.35 },
      { assetClass: 'Large-Cap Tech',          whyResilient: 'Remote-work demand accelerated growth',        lossFactor: -8,  weight: 0.40 },
      { assetClass: 'Investment Grade Bonds',  whyResilient: 'Fed backstop provided floor in 2020',          lossFactor: -5,  weight: 0.25 },
    ]
  } else {
    candidates = [
      { assetClass: 'Investment Grade Bonds',  whyResilient: 'Diversifies equity risk in most scenarios',        lossFactor: -5,  weight: 0.40 },
      { assetClass: 'International Equities',  whyResilient: 'Geographic diversification reduces concentration', lossFactor: -10, weight: 0.35 },
      { assetClass: 'Cash',                    whyResilient: 'Optionality and capital preservation',             lossFactor: -2,  weight: 0.25 },
    ]
  }

  let allocated = 0
  const increases: IncreaseRec[] = []

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i]
    const remaining = freedWeight - allocated
    if (remaining <= 0) break
    const isLast = i === candidates.length - 1
    const amount = isLast
      ? remaining
      : Math.min(remaining, Math.max(5, roundTo5(freedWeight * c.weight)))
    if (amount > 0) {
      increases.push({
        assetClass: c.assetClass,
        currentExposure: 0,
        targetIncrease: amount,
        whyResilient: c.whyResilient,
        lossFactor: c.lossFactor,
      })
      allocated += amount
    }
  }

  return increases
}

function computeRebalancing(results: StressTestResult): RebalancingData {
  const { positions, summary } = results
  const scenarioText = summary.scenario_text || ''

  const sorted = [...positions].sort((a, b) => a.loss_pct - b.loss_pct)

  const seen = new Set<string>()
  const flagged: (Position & { reason: string })[] = []
  for (const pos of sorted) {
    if (seen.has(pos.ticker)) continue
    if (pos.loss_pct < -15) {
      flagged.push({ ...pos, reason: 'Severe stress loss' })
      seen.add(pos.ticker)
    } else if (pos.beta > 1.4 && pos.loss_pct < -10) {
      flagged.push({ ...pos, reason: 'High beta + significant loss' })
      seen.add(pos.ticker)
    }
  }

  let totalReduction = 0
  const reductions: ReduceRec[] = []

  for (const pos of flagged) {
    if (totalReduction >= 30) break
    const rawReduction = Math.min(50, pos.loss_pct * -1.2)
    const rounded = Math.max(5, roundTo5(rawReduction))
    const capped = Math.min(rounded, 30 - totalReduction)
    if (capped >= 5) {
      reductions.push({
        ticker: pos.ticker,
        sector: pos.sector || 'Unknown',
        currentWeight: pos.weight,
        suggestedReduction: capped,
        reason: pos.reason,
        lossPct: pos.loss_pct,
      })
      totalReduction += capped
    }
  }

  const freedWeight = totalReduction
  const increases = getIncreases(scenarioText, freedWeight)

  const sectorMap: Record<string, { current: number; change: number }> = {}
  positions.forEach(p => {
    const s = p.sector || 'Unknown'
    if (!sectorMap[s]) sectorMap[s] = { current: 0, change: 0 }
    sectorMap[s].current += p.weight
  })

  reductions.forEach(r => {
    if (sectorMap[r.sector]) sectorMap[r.sector].change -= r.suggestedReduction
  })

  increases.forEach(inc => {
    if (!sectorMap[inc.assetClass]) sectorMap[inc.assetClass] = { current: 0, change: 0 }
    sectorMap[inc.assetClass].change += inc.targetIncrease
  })

  const sectorAlloc: SectorAlloc[] = Object.entries(sectorMap)
    .map(([sector, { current, change }]) => ({
      sector,
      currentPct: current,
      targetPct: Math.max(0, current + change),
      change,
    }))
    .filter(s => s.currentPct > 0 || s.change !== 0)
    .sort((a, b) => b.currentPct - a.currentPct)

  const totalWeight = positions.reduce((s, p) => s + p.weight, 0) || 100
  const currentWtdLoss = positions.reduce((s, p) => s + p.loss_pct * p.weight, 0) / totalWeight

  let projectedLoss = currentWtdLoss

  reductions.forEach(r => {
    const originalContrib = (r.lossPct * r.currentWeight) / totalWeight
    const newWeight = Math.max(0, r.currentWeight - r.suggestedReduction)
    const newContrib = (r.lossPct * newWeight) / totalWeight
    projectedLoss = projectedLoss - originalContrib + newContrib
  })

  increases.forEach(inc => {
    projectedLoss += (inc.lossFactor * inc.targetIncrease) / totalWeight
  })

  const improvement = projectedLoss - currentWtdLoss

  const text = scenarioText.toLowerCase()
  const biggestLosers = reductions.slice(0, 3).map(r => r.ticker).join(', ')
  const reducedSectors = [...new Set(reductions.map(r => r.sector))].slice(0, 2).join(' and ')
  const resilientAssets = increases.map(i => i.assetClass).slice(0, 3).join(', ')
  const scenarioReason = text.includes('rate') || text.includes('inflation')
    ? 'the rate-sensitive nature of this scenario'
    : text.includes('credit') || text.includes('2008') || text.includes('crisis')
    ? 'the broad equity de-risking seen in 2008-style credit crises'
    : text.includes('tech') || text.includes('dot-com')
    ? 'the tech-sector concentration risk highlighted by this scenario'
    : text.includes('covid') || text.includes('pandemic')
    ? 'the economic disruption pattern of pandemic-style shocks'
    : 'the broad market stress implied by this scenario'

  const narrative = reductions.length === 0
    ? 'This portfolio shows reasonable resilience under the current scenario — no positions exceed the stress thresholds that trigger a rebalancing recommendation. Continue to monitor factor exposures as conditions evolve.'
    : `This portfolio's ${biggestLosers} drove most of the stress loss. Reducing exposure to ${reducedSectors || 'high-risk positions'} and rotating into ${resilientAssets} is estimated to reduce stress losses by ${Math.abs(improvement).toFixed(1)}pp. These changes reflect ${scenarioReason}.`

  return {
    reductions,
    increases,
    sectorAlloc,
    freedWeight,
    currentWtdLoss,
    projectedWtdLoss: projectedLoss,
    improvement,
    narrative,
  }
}

export default function RebalancingPanel({ results }: { results: StressTestResult }) {
  const data = useMemo(() => computeRebalancing(results), [results])
  const { reductions, increases, sectorAlloc, currentWtdLoss, projectedWtdLoss, improvement, narrative, freedWeight } = data

  const improvementPP = Math.abs(improvement)
  const improved = improvement > 0.05

  const maxBarPct = Math.max(...sectorAlloc.map(r => Math.max(r.currentPct, r.targetPct)), 1)

  return (
    <div className='space-y-4'>

      {/* Card 1 — Positions to reduce */}
      <div className='bg-white/3 rounded-2xl border border-white/8 overflow-hidden'>
        <div className='px-5 py-4 border-b border-white/8 flex items-center gap-2'>
          <TrendingDown size={15} className='text-red-400' />
          <h3 className='font-semibold text-gray-200'>Positions to reduce</h3>
          <span className='ml-auto text-xs text-gray-500'>{reductions.length} flagged</span>
        </div>
        {reductions.length === 0 ? (
          <p className='px-5 py-5 text-sm text-gray-400'>
            No positions exceed stress thresholds — no reductions recommended.
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-white/6'>
                  <th className='text-left px-5 py-3 text-xs font-medium text-gray-500'>Ticker</th>
                  <th className='text-left px-5 py-3 text-xs font-medium text-gray-500'>Sector</th>
                  <th className='text-right px-5 py-3 text-xs font-medium text-gray-500'>Current Weight</th>
                  <th className='text-right px-5 py-3 text-xs font-medium text-gray-500'>Suggested Reduction</th>
                  <th className='text-left px-5 py-3 text-xs font-medium text-gray-500'>Reason</th>
                </tr>
              </thead>
              <tbody>
                {reductions.map(r => (
                  <tr key={r.ticker} className='border-b border-white/4 hover:bg-white/3 transition-colors'>
                    <td className='px-5 py-3'>
                      <span className='font-mono font-semibold text-white'>{r.ticker}</span>
                    </td>
                    <td className='px-5 py-3 text-gray-400 text-xs'>{r.sector}</td>
                    <td className='px-5 py-3 text-right text-gray-300'>{r.currentWeight.toFixed(1)}%</td>
                    <td className='px-5 py-3 text-right font-semibold text-red-400'>
                      -{r.suggestedReduction}%
                    </td>
                    <td className='px-5 py-3'>
                      <div className='flex items-center gap-2'>
                        <span className='text-gray-400 text-xs'>{r.reason}</span>
                        <span className='bg-red-900/50 text-red-400 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap'>
                          {r.lossPct.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Card 2 — Suggested increases */}
      <div className='bg-white/3 rounded-2xl border border-white/8 overflow-hidden'>
        <div className='px-5 py-4 border-b border-white/8 flex items-center gap-2'>
          <TrendingUp size={15} className='text-green-400' />
          <h3 className='font-semibold text-gray-200'>Suggested increases</h3>
          <span className='ml-auto text-xs text-gray-500'>{freedWeight.toFixed(0)}% to reallocate</span>
        </div>
        {increases.length === 0 ? (
          <p className='px-5 py-5 text-sm text-gray-400'>No reallocation needed.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-white/6'>
                  <th className='text-left px-5 py-3 text-xs font-medium text-gray-500'>Asset Class</th>
                  <th className='text-right px-5 py-3 text-xs font-medium text-gray-500'>Current Exposure</th>
                  <th className='text-right px-5 py-3 text-xs font-medium text-gray-500'>Target Increase</th>
                  <th className='text-left px-5 py-3 text-xs font-medium text-gray-500'>Why resilient</th>
                </tr>
              </thead>
              <tbody>
                {increases.map(inc => (
                  <tr key={inc.assetClass} className='border-b border-white/4 hover:bg-white/3 transition-colors'>
                    <td className='px-5 py-3 font-medium text-gray-200'>{inc.assetClass}</td>
                    <td className='px-5 py-3 text-right text-gray-400'>{inc.currentExposure.toFixed(0)}%</td>
                    <td className='px-5 py-3 text-right'>
                      <span className='bg-green-900/50 text-green-400 text-xs px-2 py-0.5 rounded-full font-medium'>
                        +{inc.targetIncrease.toFixed(0)}%
                      </span>
                    </td>
                    <td className='px-5 py-3 text-xs text-gray-400'>{inc.whyResilient}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Card 3 — Before / after allocation */}
      <div className='bg-white/3 rounded-2xl border border-white/8 overflow-hidden'>
        <div className='px-5 py-4 border-b border-white/8'>
          <h3 className='font-semibold text-gray-200'>Before / after allocation</h3>
          <p className='text-xs text-gray-500 mt-0.5'>Sector-level view of proposed changes</p>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-white/6'>
                <th className='text-left px-5 py-3 text-xs font-medium text-gray-500'>Sector / Asset Class</th>
                <th className='text-right px-5 py-3 text-xs font-medium text-gray-500'>Current %</th>
                <th className='text-right px-5 py-3 text-xs font-medium text-gray-500'>Target %</th>
                <th className='text-right px-5 py-3 text-xs font-medium text-gray-500'>Change</th>
                <th className='px-5 py-3 text-xs font-medium text-gray-500 min-w-[160px]'>Allocation</th>
              </tr>
            </thead>
            <tbody>
              {sectorAlloc.map(row => (
                <tr key={row.sector} className='border-b border-white/4 hover:bg-white/3 transition-colors'>
                  <td className='px-5 py-3 text-gray-200 text-xs'>{row.sector}</td>
                  <td className='px-5 py-3 text-right text-gray-400'>{row.currentPct.toFixed(1)}%</td>
                  <td className='px-5 py-3 text-right text-gray-300'>{row.targetPct.toFixed(1)}%</td>
                  <td className='px-5 py-3 text-right'>
                    <span className={`font-medium text-xs ${row.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {row.change >= 0 ? '+' : ''}{row.change.toFixed(1)}%
                    </span>
                  </td>
                  <td className='px-5 py-3'>
                    <div className='flex items-center gap-1'>
                      <div className='w-16 h-2 bg-white/10 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-blue-500/70 rounded-full'
                          style={{ width: `${(row.currentPct / maxBarPct) * 100}%` }}
                        />
                      </div>
                      <div className='w-16 h-2 bg-white/10 rounded-full overflow-hidden'>
                        <div
                          className={`h-full rounded-full ${row.change >= 0 ? 'bg-green-500/70' : 'bg-orange-500/70'}`}
                          style={{ width: `${(row.targetPct / maxBarPct) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='px-5 py-3 border-t border-white/6 flex items-center gap-4'>
          <div className='flex items-center gap-1.5'>
            <div className='w-3 h-2 bg-blue-500/70 rounded-sm' />
            <span className='text-xs text-gray-500'>Current</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <div className='w-3 h-2 bg-green-500/70 rounded-sm' />
            <span className='text-xs text-gray-500'>Target</span>
          </div>
        </div>
      </div>

      {/* Card 4 — Improvement estimate */}
      <div className='bg-white/3 rounded-2xl border border-white/8 p-6 text-center'>
        <h3 className='font-semibold text-gray-200 mb-5'>Estimated improvement</h3>
        {reductions.length === 0 ? (
          <p className='text-gray-400 text-sm'>No rebalancing changes — improvement not applicable.</p>
        ) : (
          <>
            <div className={`text-6xl font-black mb-3 ${improved ? 'text-green-400' : 'text-gray-400'}`}>
              {improved ? '+' : ''}{improvementPP.toFixed(1)}pp
            </div>
            <p className='text-gray-300 text-sm font-medium'>
              Estimated stress loss: {currentWtdLoss.toFixed(1)}% → {projectedWtdLoss.toFixed(1)}%
            </p>
            <p className='text-xs text-gray-600 mt-4 max-w-sm mx-auto leading-relaxed'>
              Estimate based on historical factor relationships. Not investment advice.
            </p>
          </>
        )}
      </div>

      {/* Card 5 — Plain-English explanation */}
      <div className='bg-blue-950/40 border border-blue-800 rounded-xl p-4'>
        <div className='flex items-center gap-2 mb-2'>
          <Lightbulb size={15} className='text-blue-400 shrink-0' />
          <p className='text-blue-300 font-medium text-sm'>Why these changes help</p>
        </div>
        <p className='text-blue-200/80 text-sm leading-relaxed'>{narrative}</p>
      </div>

    </div>
  )
}
