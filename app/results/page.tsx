'use client'

import { useEffect, useState } from 'react'
import { StressTestResult, exportPdf } from '@/lib/api'
import SummaryCards from '@/components/SummaryCards'
import StressCharts from '@/components/StressCharts'
import PositionTable from '@/components/PositionTable'
import ExplanationPanel from '@/components/ExplanationPanel'
import CorrelationMatrix from '@/components/CorrelationMatrix'
import LiquidityPanel from '@/components/LiquidityPanel'
import ClientImpact from '@/components/ClientImpact'
import MonteCarlo from '@/components/MonteCarlo'
import FactorModel from '@/components/FactorModel'
import ResultsNav from '@/components/ResultsNav'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from 'recharts'

const TOOLTIP_STYLE = {
  background: '#1F2937',
  border: '1px solid #374151',
  borderRadius: 8,
  color: '#F9FAFB'
}

function getBenchmarkLosses(scenarioText: string) {
  const text = scenarioText.toLowerCase()

  if (text.includes('2008') || text.includes('financial crisis') || text.includes('credit markets freeze')) {
    return [
      { name: 'S&P 500',        loss: -56.8, color: '#EF4444' },
      { name: '60/40 Portfolio', loss: -33.2, color: '#F59E0B' },
      { name: 'All-Weather',     loss: -19.4, color: '#10B981' },
      { name: 'Global Bonds',    loss: -4.2,  color: '#3B82F6' },
    ]
  }
  if (text.includes('covid') || text.includes('2020')) {
    return [
      { name: 'S&P 500',        loss: -33.9, color: '#EF4444' },
      { name: '60/40 Portfolio', loss: -20.1, color: '#F59E0B' },
      { name: 'All-Weather',     loss: -14.2, color: '#10B981' },
      { name: 'Global Bonds',    loss: -1.8,  color: '#3B82F6' },
    ]
  }
  if (text.includes('dot-com') || (text.includes('tech') && text.includes('2000'))) {
    return [
      { name: 'S&P 500',        loss: -49.1, color: '#EF4444' },
      { name: '60/40 Portfolio', loss: -22.4, color: '#F59E0B' },
      { name: 'All-Weather',     loss: -8.1,  color: '#10B981' },
      { name: 'Global Bonds',    loss: 8.2,   color: '#3B82F6' },
    ]
  }
  if (text.includes('stagflat') || (text.includes('inflation') && text.includes('8%'))) {
    return [
      { name: 'S&P 500',        loss: -42.6, color: '#EF4444' },
      { name: '60/40 Portfolio', loss: -31.8, color: '#F59E0B' },
      { name: 'All-Weather',     loss: -21.4, color: '#10B981' },
      { name: 'Global Bonds',    loss: -18.2, color: '#6B7280' },
    ]
  }
  if (text.includes('rate') || text.includes('2022')) {
    return [
      { name: 'S&P 500',        loss: -19.4, color: '#EF4444' },
      { name: '60/40 Portfolio', loss: -16.8, color: '#F59E0B' },
      { name: 'All-Weather',     loss: -12.1, color: '#10B981' },
      { name: 'Global Bonds',    loss: -14.9, color: '#3B82F6' },
    ]
  }
  return [
    { name: 'S&P 500',        loss: -25.0, color: '#EF4444' },
    { name: '60/40 Portfolio', loss: -14.5, color: '#F59E0B' },
    { name: 'All-Weather',     loss: -9.8,  color: '#10B981' },
    { name: 'Global Bonds',    loss: -3.2,  color: '#3B82F6' },
  ]
}

function BenchmarkComparison({ summary }: { summary: any }) {
  const benchmarks    = getBenchmarkLosses(summary.scenario_text)
  const portfolioLoss = summary.total_loss_pct

  // Sort descending — less negative = better = ranked higher
  const allData = [
    { name: 'Your Portfolio', loss: portfolioLoss, color: '#6366F1', isPortfolio: true },
    ...benchmarks,
  ].sort((a, b) => b.loss - a.loss)

  const portfolioRank = allData.findIndex(d => d.isPortfolio) + 1
  const totalItems    = allData.length
  const betterThan    = benchmarks.filter(b => b.loss < portfolioLoss).length
  const worseThan     = benchmarks.filter(b => b.loss > portfolioLoss).length

  const rankLabel = portfolioRank === 1 ? 'Most Resilient'
    : portfolioRank === totalItems ? 'Least Resilient'
    : portfolioRank <= Math.ceil(totalItems / 2) ? 'Above Average'
    : 'Below Average'

  const rankColor = portfolioRank === 1 ? 'text-green-400'
    : portfolioRank === totalItems ? 'text-red-400'
    : portfolioRank <= Math.ceil(totalItems / 2) ? 'text-green-400'
    : 'text-orange-400'

  const fmt = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(n)

  return (
    <div className='space-y-4'>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-gray-900 rounded-2xl p-5 border border-gray-800 text-center'>
          <p className='text-xs text-gray-500 mb-1'>Benchmark Rank</p>
          <p className='text-3xl font-bold text-white'>
            #{portfolioRank}<span className='text-gray-500 text-lg'>/{totalItems}</span>
          </p>
          <p className={`text-sm font-medium mt-1 ${rankColor}`}>{rankLabel}</p>
        </div>
        <div className='bg-gray-900 rounded-2xl p-5 border border-gray-800 text-center'>
          <p className='text-xs text-gray-500 mb-1'>Better Than</p>
          <p className='text-3xl font-bold text-green-400'>{betterThan}</p>
          <p className='text-sm text-gray-500 mt-1'>
            benchmark{betterThan !== 1 ? 's' : ''}
          </p>
        </div>
        <div className='bg-gray-900 rounded-2xl p-5 border border-gray-800 text-center'>
          <p className='text-xs text-gray-500 mb-1'>Worse Than</p>
          <p className='text-3xl font-bold text-red-400'>{worseThan}</p>
          <p className='text-sm text-gray-500 mt-1'>
            benchmark{worseThan !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
        <h3 className='font-semibold text-gray-200 mb-1'>
          Portfolio vs Benchmarks
        </h3>
        <p className='text-xs text-gray-500 mb-4'>
          Stress loss comparison — your portfolio (indigo) vs standard benchmarks
        </p>
        <ResponsiveContainer width='100%' height={260}>
          <BarChart data={allData} layout='vertical'>
            <XAxis type='number' tick={{ fill: '#6B7280', fontSize: 11 }}
              tickFormatter={v => `${v}%`} />
            <YAxis dataKey='name' type='category'
              tick={{ fill: '#9CA3AF', fontSize: 11 }} width={120} />
            <Tooltip
              formatter={(v: any) => [`${Number(v).toFixed(1)}%`, 'Loss']}
              contentStyle={TOOLTIP_STYLE}
              labelStyle={{ color: '#F9FAFB' }}
              itemStyle={{ color: '#F9FAFB' }} />
            <ReferenceLine x={0} stroke='#374151' />
            <Bar dataKey='loss' radius={[0, 4, 4, 0]}>
              {allData.map((entry, i) => (
                <Cell key={i} fill={entry.color}
                  opacity={entry.isPortfolio ? 1 : 0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        {benchmarks.map(({ name, loss, color }) => {
          const diff            = portfolioLoss - loss
          const portfolioBetter = portfolioLoss > loss
          return (
            <div key={name} className='bg-gray-900 rounded-xl p-4
              border border-gray-800'>
              <p className='text-xs text-gray-500 mb-2'>{name}</p>
              <p className='text-xl font-bold' style={{ color }}>
                {loss.toFixed(1)}%
              </p>
              <div className={`mt-2 text-xs font-medium ${
                portfolioBetter ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolioBetter
                  ? `✓ You outperform by ${Math.abs(diff).toFixed(1)}%`
                  : `✗ You underperform by ${Math.abs(diff).toFixed(1)}%`
                }
              </div>
            </div>
          )
        })}
      </div>

      <div className='bg-gray-800/50 rounded-xl p-4 border border-gray-700'>
        <p className='text-xs text-gray-400 leading-relaxed'>
          <span className='text-gray-300 font-medium'>Note: </span>
          Benchmark losses are based on historical data for comparable stress
          scenarios. S&P 500 = broad US equity market. 60/40 = 60% equities,
          40% bonds. All-Weather = Ray Dalio risk-parity strategy.
          Global Bonds = Bloomberg Global Aggregate Bond Index.
        </p>
      </div>
    </div>
  )
}

function SmartSummary({ results }: { results: StressTestResult }) {
  const { summary, positions } = results
  const totalValue   = summary.total_value
  const totalLossPct = summary.total_loss_pct
  const severity     = summary.severity_label

  const healthScore = Math.max(1, Math.min(10, 10 + totalLossPct / 5))
  const healthColor = healthScore >= 7 ? 'text-green-400'
    : healthScore >= 5 ? 'text-yellow-400'
    : healthScore >= 3 ? 'text-orange-400'
    : 'text-red-400'
  const healthLabel = healthScore >= 7 ? 'Healthy'
    : healthScore >= 5 ? 'At Risk'
    : healthScore >= 3 ? 'Vulnerable'
    : 'Critical'

  const sortedLosers  = [...positions].sort((a, b) => a.loss_pct - b.loss_pct)
  const sortedGainers = [...positions].sort((a, b) => b.loss_pct - a.loss_pct)
  const worstPosition = sortedLosers[0]
  const bestPosition  = sortedGainers[0]

  const worstSector = (() => {
    const sectorLoss: Record<string, number> = {}
    positions.forEach(p => {
      const s = (p as any).sector || 'Unknown'
      sectorLoss[s] = (sectorLoss[s] || 0) + p.loss
    })
    return Object.entries(sectorLoss).sort((a, b) => a[1] - b[1])[0]
  })()

  const highBetaPositions = positions.filter(p => p.beta > 1.2)
  const rateSensitive     = positions.filter((p: any) =>
    ['Fixed Income', 'Government Bonds', 'Corporate Bonds', 'REITs', 'Utilities']
      .includes(p.sector))
  const rateSensitivePct  = rateSensitive.reduce(
    (s, p) => s + (p.value / totalValue * 100), 0)

  const risks = [
    {
      icon: '📉',
      title: `${worstPosition?.ticker} is your biggest drag`,
      detail: `${worstPosition?.ticker} loses ${worstPosition?.loss_pct.toFixed(1)}% under this scenario, contributing the most to portfolio drawdown.`,
      color: 'border-red-800 bg-red-950/30',
    },
    {
      icon: '🏦',
      title: `${worstSector?.[0]} sector concentration`,
      detail: `${worstSector?.[0]} is your largest loss driver by sector. Consider reducing concentration or adding a hedge.`,
      color: 'border-orange-800 bg-orange-950/30',
    },
    {
      icon: '📊',
      title: rateSensitivePct > 25
        ? `${rateSensitivePct.toFixed(0)}% in rate-sensitive assets`
        : highBetaPositions.length > 3
        ? `${highBetaPositions.length} high-beta positions amplify losses`
        : 'Diversification reduces but does not eliminate risk',
      detail: rateSensitivePct > 25
        ? `Bonds and REITs at ${rateSensitivePct.toFixed(0)}% of portfolio are vulnerable to rate and credit shocks simultaneously.`
        : highBetaPositions.length > 3
        ? `${highBetaPositions.map(p => p.ticker).join(', ')} all have beta above 1.2, amplifying market moves.`
        : 'While diversified across sectors, correlation spikes under stress reduce the benefit of diversification.',
      color: 'border-yellow-800 bg-yellow-950/30',
    },
  ]

  const recommendation = totalLossPct < -20
    ? `Reduce equity beta by trimming ${worstPosition?.ticker} and adding short-duration bonds or gold as a hedge.`
    : totalLossPct < -10
    ? `Consider trimming ${worstSector?.[0]} exposure and increasing cash or defensive positions by 5–10%.`
    : `Portfolio shows moderate resilience. Monitor ${worstPosition?.ticker} closely and maintain current diversification.`

  const fmt = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(n)

  const bestGainStr = bestPosition?.loss_pct > 0
    ? `+${bestPosition?.loss_pct.toFixed(1)}% in scenario`
    : `${bestPosition?.loss_pct.toFixed(1)}% in scenario`

  return (
    <div className='bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden'>
      <div className='bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4
        border-b border-gray-700 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='text-2xl'>🧠</div>
          <div>
            <h2 className='font-bold text-white'>Smart Risk Summary</h2>
            <p className='text-xs text-gray-400'>
              AI-generated analysis of your stress test results
            </p>
          </div>
        </div>
        <div className='text-right'>
          <div className='text-xs text-gray-400 mb-0.5'>Portfolio Health Score</div>
          <div className={`text-3xl font-bold ${healthColor}`}>
            {healthScore.toFixed(1)}
            <span className='text-lg text-gray-500'>/10</span>
          </div>
          <div className={`text-xs font-medium ${healthColor}`}>{healthLabel}</div>
        </div>
      </div>

      <div className='p-6 space-y-5'>
        <div className='flex items-center gap-4 bg-gray-800 rounded-xl p-4'>
          <div className={`text-4xl font-black ${
            severity === 'Extreme' ? 'text-red-500'
            : severity === 'Severe' ? 'text-orange-400'
            : 'text-yellow-400'
          }`}>
            {totalLossPct.toFixed(1)}%
          </div>
          <div>
            <p className='text-white font-semibold'>
              {severity} scenario — {fmt(Math.abs(summary.total_loss))} at risk
            </p>
            <p className='text-gray-400 text-sm mt-0.5'>
              Portfolio drops from{' '}
              <span className='text-white'>{fmt(totalValue)}</span> to{' '}
              <span className='text-red-400'>{fmt(summary.stressed_value)}</span>
            </p>
          </div>
        </div>

        <div>
          <p className='text-xs text-gray-500 uppercase tracking-wide mb-3'>
            3 Key Risks Identified
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {risks.map(({ icon, title, detail, color }, i) => (
              <div key={i} className={`rounded-xl p-4 border ${color}`}>
                <div className='flex items-start gap-2 mb-2'>
                  <span className='text-lg'>{icon}</span>
                  <span className='text-sm font-medium text-gray-200'>{title}</span>
                </div>
                <p className='text-xs text-gray-400 leading-relaxed'>{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-blue-950/50 border border-blue-700 rounded-xl p-4
          flex items-start gap-3'>
          <span className='text-xl mt-0.5'>💡</span>
          <div>
            <p className='text-blue-300 font-medium text-sm mb-1'>
              Top Recommendation
            </p>
            <p className='text-blue-200/80 text-sm leading-relaxed'>
              {recommendation}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          {[
            {
              label: 'Worst position',
              value: worstPosition?.ticker,
              sub: `${worstPosition?.loss_pct.toFixed(1)}% loss`,
              color: 'text-red-400',
            },
            {
              label: 'Positions at risk',
              value: `${positions.filter(p => p.loss_pct < -10).length}/${positions.length}`,
              sub: 'Loss > 10%',
              color: 'text-orange-400',
            },
            {
              label: 'Best performer',
              value: bestPosition?.ticker,
              sub: bestGainStr,
              color: 'text-green-400',
            },
            {
              label: 'Scenario severity',
              value: severity,
              sub: summary.scenario_text.split(',')[0],
              color: severity === 'Extreme' ? 'text-red-400'
                : severity === 'Severe' ? 'text-orange-400' : 'text-yellow-400',
            },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className='bg-gray-800 rounded-xl p-3'>
              <div className='text-xs text-gray-500 mb-1'>{label}</div>
              <div className={`text-lg font-bold ${color}`}>{value}</div>
              <div className='text-xs text-gray-500'>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const [results, setResults]     = useState<StressTestResult | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('stressResults')
    if (raw) setResults(JSON.parse(raw))
  }, [])

  const handleExportPdf = async () => {
    if (!results) return
    setExporting(true)
    try {
      await exportPdf(results)
    } finally {
      setExporting(false)
    }
  }

  if (!results) return (
    <main className='min-h-screen bg-gray-950 text-white flex items-center
      justify-center'>
      <p>No results found.{' '}
        <a href='/' className='text-blue-400'>Run a stress test</a>
      </p>
    </main>
  )

  return (
    <main className='min-h-screen bg-[#0A0F1E] text-white'>
      <ResultsNav />
      <div className='max-w-7xl mx-auto p-6 space-y-8'>

        <div className='flex justify-between items-start'>
          <div>
            <h1 className='text-2xl font-bold'>Stress Test Results</h1>
            <p className='text-gray-400 mt-1'>{results.summary.scenario_text}</p>
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={handleExportPdf}
              disabled={exporting}
              className='flex items-center gap-2 px-4 py-2 rounded-xl
                bg-white/5 hover:bg-white/10 border border-white/10
                text-sm text-gray-300 transition-all disabled:opacity-50'>
              {exporting ? (
                <span className='w-3 h-3 border border-white/30 border-t-white
                  rounded-full animate-spin' />
              ) : (
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none'
                  stroke='currentColor' strokeWidth='2'>
                  <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/>
                  <polyline points='7 10 12 15 17 10'/>
                  <line x1='12' y1='15' x2='12' y2='3'/>
                </svg>
              )}
              {exporting ? 'Generating...' : 'Export PDF'}
            </button>
            <a href='/' className='text-sm text-blue-400 hover:underline'>
              Run new test
            </a>
          </div>
        </div>

        <div id='summary'>
          <SmartSummary results={results} />
        </div>

        <div id='charts'>
          <SummaryCards summary={results.summary} />
          <div className='mt-8'>
            <StressCharts charts={results.charts} positions={results.positions} />
          </div>
        </div>

        <div id='factors'>
          <h2 className='text-lg font-semibold mb-4'>Factor Risk Model</h2>
          <FactorModel
            positions={results.positions}
            scenarioText={results.summary.scenario_text}
          />
        </div>

        <div id='correlation'>
          <h2 className='text-lg font-semibold mb-4'>Correlation Breakdown</h2>
          <CorrelationMatrix positions={results.positions} />
        </div>

        <div id='benchmark'>
          <h2 className='text-lg font-semibold mb-4'>Benchmark Comparison</h2>
          <BenchmarkComparison summary={results.summary} />
        </div>

        <div id='liquidity'>
          <h2 className='text-lg font-semibold mb-4'>Liquidity Stress Analysis</h2>
          <LiquidityPanel positions={results.positions} />
        </div>

        <div id='client'>
          <h2 className='text-lg font-semibold mb-4'>Client Impact Analysis</h2>
          <ClientImpact
            portfolioValue={results.summary.total_value}
            stressedValue={results.summary.stressed_value}
          />
        </div>

        <div id='monte-carlo'>
          <h2 className='text-lg font-semibold mb-4'>Monte Carlo Simulation</h2>
          <MonteCarlo
            portfolioValue={results.summary.total_value}
            stressedValue={results.summary.stressed_value}
          />
        </div>

        <div id='positions'>
          <PositionTable positions={results.positions} />
        </div>

        <div id='explanation'>
          <ExplanationPanel explanation={results.explanation} />
        </div>

      </div>
    </main>
  )
}