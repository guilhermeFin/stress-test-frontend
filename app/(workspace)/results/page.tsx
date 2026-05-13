'use client'

import { useEffect, useState, useMemo, useCallback, memo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/neon-button'
import { StressTestResult, exportPdf } from '@/lib/api'
import SummaryCards from '@/components/SummaryCards'
import StressCharts from '@/components/StressCharts'
import PositionTable from '@/components/PositionTable'
import ExplanationPanel from '@/components/ExplanationPanel'
import CorrelationMatrix from '@/components/CorrelationMatrix'
import LiquidityPanel from '@/components/LiquidityPanel'
import ClientImpact, { ClientProfile, DEFAULT_PROFILE } from '@/components/ClientImpact'
import RebalancingPanel from '@/components/RebalancingPanel'
import TaxImpact from '@/components/TaxImpact'
import MonteCarlo from '@/components/MonteCarlo'
import FactorModel from '@/components/FactorModel'
import ResultsNav from '@/components/ResultsNav'
import PresentationMode from '@/components/PresentationMode'
import WealthPresentation, { PortfolioData } from '@/components/results/WealthPresentation'
import {
  TrendingDown, Landmark, BarChart3, Lightbulb, Brain,
  Users, Briefcase, CheckCircle, AlertTriangle, XCircle,
  ArrowRight, ChevronDown, BookmarkPlus, Layers, FileText,
  Circle, CheckCircle2, XCircle as XCircleIcon, ListChecks,
} from 'lucide-react'
import ComplianceFooter from '@/components/compliance/ComplianceFooter'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'

const TOOLTIP_STYLE = {
  background: '#1F2937',
  border: '1px solid #374151',
  borderRadius: 8,
  color: '#F9FAFB',
}

function getBenchmarkLosses(scenarioText: string) {
  const text = scenarioText.toLowerCase()
  if (text.includes('2008') || text.includes('financial crisis') || text.includes('credit markets freeze')) {
    return [
      { name: 'S&P 500',        loss: -56.8, color: '#EF4444' },
      { name: '60/40 Portfolio', loss: -33.2, color: '#F59E08' },
      { name: 'All-Weather',     loss: -19.4, color: '#10B981' },
      { name: 'Global Bonds',    loss: -4.2,  color: '#3B82F6' },
    ]
  }
  if (text.includes('covid') || text.includes('2020')) {
    return [
      { name: 'S&P 500',        loss: -33.9, color: '#EF4444' },
      { name: '60/40 Portfolio', loss: -20.1, color: '#F59E08' },
      { name: 'All-Weather',     loss: -14.2, color: '#10B981' },
      { name: 'Global Bonds',    loss: -1.8,  color: '#3B82F6' },
    ]
  }
  if (text.includes('dot-com') || (text.includes('tech') && text.includes('2000'))) {
    return [
      { name: 'S&P 500',        loss: -49.1, color: '#EF4444' },
      { name: '60/40 Portfolio', loss: -22.4, color: '#F59E08' },
      { name: 'All-Weather',     loss: -8.1,  color: '#10B981' },
      { name: 'Global Bonds',    loss: 8.2,   color: '#3B82F6' },
    ]
  }
  if (text.includes('stagflat') || (text.includes('inflation') && text.includes('8%'))) {
    return [
      { name: 'S&P 500',        loss: -42.6, color: '#EF4444' },
      { name: '60/40 Portfolio', loss: -31.8, color: '#F59E08' },
      { name: 'All-Weather',     loss: -21.4, color: '#10B981' },
      { name: 'Global Bonds',    loss: -18.2, color: '#6B7280' },
    ]
  }
  if (text.includes('rate') || text.includes('2022')) {
    return [
      { name: 'S&P 500',        loss: -19.4, color: '#EF4444' },
      { name: '60/40 Portfolio', loss: -16.8, color: '#F59E08' },
      { name: 'All-Weather',     loss: -12.1, color: '#10B981' },
      { name: 'Global Bonds',    loss: -14.9, color: '#3B82F6' },
    ]
  }
  return [
    { name: 'S&P 500',        loss: -25.0, color: '#EF4444' },
    { name: '60/40 Portfolio', loss: -14.5, color: '#F59E08' },
    { name: 'All-Weather',     loss: -9.8,  color: '#10B981' },
    { name: 'Global Bonds',    loss: -3.2,  color: '#3B82F6' },
  ]
}

// ── Shared tab pill ──────────────────────────────────────────────────────────
function TabPills<T extends string>({
  tabs, active, onChange,
}: { tabs: { id: T; label: string }[]; active: T; onChange: (t: T) => void }) {
  return (
    <div className='flex gap-1 bg-slate-100 rounded-lg p-1 w-fit overflow-x-auto'>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`px-3 py-1 rounded text-xs font-medium transition-all duration-150 whitespace-nowrap
            ${active === t.id ? 'bg-white text-[#0B1B2E] shadow-sm' : 'text-slate-500 hover:text-[#0B1B2E]'}`}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ── Section group divider ────────────────────────────────────────────────────
const SectionGroup = memo(function SectionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-3 px-1 pt-2'>
        <span className='text-[11px] font-semibold text-slate-400 uppercase tracking-[0.12em]'>
          {label}
        </span>
        <div className='flex-1 h-px bg-slate-200' />
      </div>
      {children}
    </div>
  )
})

// ── Charts section ───────────────────────────────────────────────────────────
const ChartsTabs = memo(function ChartsTabs({ results }: { results: StressTestResult }) {
  const [tab, setTab] = useState<'overview' | 'breakdown'>('overview')
  return (
    <div className='space-y-4'>
      <TabPills
        tabs={[{ id: 'overview', label: 'Key metrics' }, { id: 'breakdown', label: 'Position breakdown' }]}
        active={tab} onChange={setTab}
      />
      {tab === 'overview'
        ? <SummaryCards summary={results.summary} />
        : <StressCharts charts={results.charts} positions={results.positions} />}
    </div>
  )
})

// ── Benchmark comparison ─────────────────────────────────────────────────────
const BenchmarkComparison = memo(function BenchmarkComparison({ summary }: { summary: any }) {
  const [tab, setTab] = useState<'chart' | 'detail'>('chart')

  const { benchmarks, allData, portfolioLoss, portfolioRank, totalItems, betterThan, worseThan, rankLabel, rankColor } =
    useMemo(() => {
      const benchmarks    = getBenchmarkLosses(summary.scenario_text)
      const portfolioLoss = summary.total_loss_pct as number
      const allData = [
        { name: 'Your Portfolio', loss: portfolioLoss, color: '#6366F1', isPortfolio: true },
        ...benchmarks.map(b => ({ ...b, isPortfolio: false })),
      ].sort((a, b) => b.loss - a.loss)
      const portfolioRank = allData.findIndex(d => d.isPortfolio) + 1
      const totalItems    = allData.length
      const betterThan    = benchmarks.filter(b => b.loss > portfolioLoss).length  // losses are negative; higher = smaller loss = better
      const worseThan     = benchmarks.filter(b => b.loss < portfolioLoss).length
      const rankLabel = portfolioRank === 1 ? 'Most Resilient'
        : portfolioRank === totalItems ? 'Least Resilient'
        : portfolioRank <= Math.ceil(totalItems / 2) ? 'Above Average'
        : 'Below Average'
      const rankColor = portfolioRank === 1 ? 'text-[#15803D]'
        : portfolioRank === totalItems ? 'text-[#B91C1C]'
        : portfolioRank <= Math.ceil(totalItems / 2) ? 'text-[#15803D]'
        : 'text-orange-600'
      return { benchmarks, allData, portfolioLoss, portfolioRank, totalItems, betterThan, worseThan, rankLabel, rankColor }
    }, [summary.scenario_text, summary.total_loss_pct])

  return (
    <div className='space-y-4'>
      <TabPills
        tabs={[{ id: 'chart', label: 'Comparison chart' }, { id: 'detail', label: 'Benchmark detail' }]}
        active={tab} onChange={setTab}
      />

      {tab === 'chart' && (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-white rounded-lg p-5 border border-slate-200 shadow-sm text-center'>
              <p className='text-xs text-slate-500 mb-1'>Benchmark rank</p>
              <p className='text-3xl font-bold text-[#0B1B2E] font-mono tabular-nums'>
                #{portfolioRank}<span className='text-slate-400 text-lg'>/{totalItems}</span>
              </p>
              <p className={`text-sm font-medium mt-1 ${rankColor}`}>{rankLabel}</p>
            </div>
            <div className='bg-white rounded-lg p-5 border border-slate-200 shadow-sm text-center'>
              <p className='text-xs text-slate-500 mb-1'>Better than</p>
              <p className='text-3xl font-bold text-[#15803D] font-mono tabular-nums'>{betterThan}</p>
              <p className='text-sm text-slate-500 mt-1'>benchmark{betterThan !== 1 ? 's' : ''}</p>
            </div>
            <div className='bg-white rounded-lg p-5 border border-slate-200 shadow-sm text-center'>
              <p className='text-xs text-slate-500 mb-1'>Worse than</p>
              <p className='text-3xl font-bold text-[#B91C1C] font-mono tabular-nums'>{worseThan}</p>
              <p className='text-sm text-slate-500 mt-1'>benchmark{worseThan !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className='bg-white rounded-lg p-6 border border-slate-200 shadow-sm'>
            <h3 className='font-semibold text-[#0B1B2E] mb-1'>Portfolio vs benchmarks</h3>
            <p className='text-xs text-slate-500 mb-4'>
              Stress loss comparison — your portfolio (indigo) vs standard benchmarks
            </p>
            <ResponsiveContainer width='100%' height={240}>
              <BarChart data={allData} layout='vertical'>
                <XAxis type='number' tick={{ fill: '#6B7280', fontSize: 11 }}
                  tickFormatter={v => `${v}%`} />
                <YAxis dataKey='name' type='category'
                  tick={{ fill: '#9CA3AF', fontSize: 11 }} width={120} />
                <Tooltip formatter={(v: any) => [`${Number(v).toFixed(1)}%`, 'Loss']}
                  contentStyle={TOOLTIP_STYLE} labelStyle={{ color: '#F9FAFB' }}
                  itemStyle={{ color: '#F9FAFB' }} />
                <ReferenceLine x={0} stroke='#374151' />
                <Bar dataKey='loss' radius={[0, 4, 4, 0]}>
                  {allData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={entry.isPortfolio ? 1 : 0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'detail' && (
        <div className='space-y-3'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            {benchmarks.map(({ name, loss, color }) => {
              const diff   = portfolioLoss - loss
              const better = portfolioLoss > loss
              return (
                <div key={name} className='bg-white rounded-lg p-4 border border-slate-200 shadow-sm'>
                  <p className='text-xs text-slate-500 mb-2'>{name}</p>
                  <p className='text-xl font-bold font-mono tabular-nums' style={{ color }}>{loss.toFixed(1)}%</p>
                  <div className={`mt-2 text-xs font-medium font-mono tabular-nums ${better ? 'text-[#15803D]' : 'text-[#B91C1C]'}`}>
                    {better
                      ? `✓ Outperform by ${Math.abs(diff).toFixed(1)}%`
                      : `✗ Underperform by ${Math.abs(diff).toFixed(1)}%`}
                  </div>
                </div>
              )
            })}
          </div>
          <div className='bg-slate-50 rounded-lg p-4 border border-slate-200'>
            <p className='text-xs text-slate-500 leading-relaxed'>
              <span className='text-slate-700 font-medium'>Note: </span>
              Losses based on historical data for comparable stress scenarios.
              S&P 500 = broad US equity. 60/40 = 60% equities / 40% bonds.
              All-Weather = Ray Dalio risk-parity. Global Bonds = Bloomberg Global Aggregate.
            </p>
          </div>
        </div>
      )}
    </div>
  )
})

// ── Smart Summary ────────────────────────────────────────────────────────────
const SmartSummary = memo(function SmartSummary({ results }: { results: StressTestResult }) {
  const { summary, positions } = results
  const totalValue   = summary.total_value
  const totalLossPct = summary.total_loss_pct
  const severity     = summary.severity_label

  const healthScore = Math.max(1, Math.min(10, 10 + totalLossPct / 5))
  const healthColor = healthScore >= 7 ? 'text-[#15803D]'
    : healthScore >= 5 ? 'text-amber-600'
    : healthScore >= 3 ? 'text-orange-600'
    : 'text-[#B91C1C]'
  const healthLabel = healthScore >= 7 ? 'Healthy'
    : healthScore >= 5 ? 'At Risk'
    : healthScore >= 3 ? 'Vulnerable'
    : 'Critical'

  const { sortedLosers, sortedGainers } = useMemo(() => ({
    sortedLosers:  [...positions].sort((a, b) => a.loss_pct - b.loss_pct),
    sortedGainers: [...positions].sort((a, b) => b.loss_pct - a.loss_pct),
  }), [positions])

  const worstPosition = sortedLosers[0]
  const bestPosition  = sortedGainers[0]

  const worstSector = useMemo(() => {
    const sectorLoss: Record<string, number> = {}
    positions.forEach(p => {
      const s = (p as any).sector || 'Unknown'
      sectorLoss[s] = (sectorLoss[s] || 0) + p.loss
    })
    return Object.entries(sectorLoss).sort((a, b) => a[1] - b[1])[0]
  }, [positions])

  const { highBetaPositions, rateSensitivePct } = useMemo(() => {
    const highBeta = positions.filter(p => p.beta > 1.2)
    const rateSens = positions.filter((p: any) =>
      ['Fixed Income', 'Government Bonds', 'Corporate Bonds', 'REITs', 'Utilities'].includes(p.sector))
    const ratePct  = rateSens.reduce((s, p) => s + (p.value / totalValue * 100), 0)
    return { highBetaPositions: highBeta, rateSensitivePct: ratePct }
  }, [positions, totalValue])

  const risks = useMemo(() => [
    {
      Icon: TrendingDown,
      iconColor: 'text-[#B91C1C]',
      title: `${worstPosition?.ticker} is your biggest drag`,
      detail: `${worstPosition?.ticker} loses ${worstPosition?.loss_pct.toFixed(1)}% under this scenario, contributing the most to portfolio drawdown.`,
      color: 'border-red-200 bg-red-50',
    },
    {
      Icon: Landmark,
      iconColor: 'text-orange-600',
      title: `${worstSector?.[0]} sector concentration`,
      detail: `${worstSector?.[0]} is your largest loss driver by sector. Consider reducing concentration or adding a hedge.`,
      color: 'border-orange-200 bg-orange-50',
    },
    {
      Icon: BarChart3,
      iconColor: 'text-amber-600',
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
      color: 'border-amber-200 bg-amber-50',
    },
  ], [worstPosition, worstSector, highBetaPositions, rateSensitivePct])

  const recommendation = totalLossPct < -20
    ? `Reduce equity beta by trimming ${worstPosition?.ticker} and adding short-duration bonds or gold as a hedge.`
    : totalLossPct < -10
    ? `Consider trimming ${worstSector?.[0]} exposure and increasing cash or defensive positions by 5–10%.`
    : `Portfolio shows moderate resilience. Monitor ${worstPosition?.ticker} closely and maintain current diversification.`

  const fmt = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(n)

  const bestGainStr = bestPosition?.loss_pct > 0
    ? `+${bestPosition?.loss_pct.toFixed(1)}% in scenario`
    : `${bestPosition?.loss_pct.toFixed(1)}% in scenario`

  return (
    <div className='bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm'>
      <div className='bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-[#2563EB]/10 rounded-lg flex items-center justify-center'>
            <Brain size={16} className='text-[#2563EB]' />
          </div>
          <div>
            <h2 className='font-semibold text-[#0B1B2E] tracking-tight'>Smart Risk Summary</h2>
            <p className='text-xs text-slate-500'>AI-generated analysis of your stress test results</p>
          </div>
        </div>
        <div className='text-right shrink-0'>
          <div className='text-xs text-slate-400 mb-0.5'>Portfolio Health Score</div>
          <div className={`text-3xl font-bold font-mono tabular-nums ${healthColor}`}>
            {healthScore.toFixed(1)}<span className='text-lg text-slate-400'>/10</span>
          </div>
          <div className={`text-xs font-medium ${healthColor}`}>{healthLabel}</div>
        </div>
      </div>

      <div className='p-4 md:p-6 space-y-4 md:space-y-5'>
        <div className='flex items-center gap-4 bg-slate-50 rounded-lg p-4 border border-slate-200'>
          <div className={`text-4xl font-black font-mono tabular-nums ${
            severity === 'Extreme' ? 'text-[#B91C1C]'
            : severity === 'Severe' ? 'text-orange-600'
            : 'text-amber-600'
          }`}>
            {totalLossPct.toFixed(1)}%
          </div>
          <div>
            <p className='text-[#0B1B2E] font-semibold'>
              {severity} scenario — <span className='font-mono tabular-nums'>{fmt(Math.abs(summary.total_loss))}</span> at risk
            </p>
            <p className='text-slate-500 text-sm mt-0.5'>
              Portfolio drops from{' '}
              <span className='text-[#0B1B2E] font-mono tabular-nums'>{fmt(totalValue)}</span> to{' '}
              <span className='text-[#B91C1C] font-mono tabular-nums'>{fmt(summary.stressed_value)}</span>
            </p>
          </div>
        </div>

        <div>
          <p className='text-xs text-slate-500 uppercase tracking-wider mb-3'>3 key risks identified</p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {risks.map(({ Icon, iconColor, title, detail, color }, i) => (
              <div key={i} className={`rounded-lg p-4 border ${color}`}>
                <div className='flex items-start gap-2 mb-2'>
                  <Icon size={15} className={`${iconColor} shrink-0 mt-0.5`} />
                  <span className='text-sm font-medium text-[#0B1B2E] leading-snug'>{title}</span>
                </div>
                <p className='text-xs text-slate-600 leading-relaxed'>{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3'>
          <Lightbulb size={15} className='text-[#2563EB] shrink-0 mt-0.5' />
          <div>
            <p className='text-[#2563EB] font-medium text-sm mb-1'>Top recommendation</p>
            <p className='text-blue-700 text-sm leading-relaxed'>{recommendation}</p>
          </div>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          {[
            { label: 'Worst position',    value: worstPosition?.ticker, sub: `${worstPosition?.loss_pct.toFixed(1)}% loss`, color: 'text-[#B91C1C]' },
            { label: 'Positions at risk', value: `${positions.filter(p => p.loss_pct < -10).length}/${positions.length}`, sub: 'Loss > 10%', color: 'text-orange-600' },
            { label: 'Best performer',    value: bestPosition?.ticker,  sub: bestGainStr, color: 'text-[#15803D]' },
            { label: 'Scenario severity', value: severity, sub: summary.scenario_text.split(',')[0],
              color: severity === 'Extreme' ? 'text-[#B91C1C]' : severity === 'Severe' ? 'text-orange-600' : 'text-amber-600' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className='bg-slate-50 rounded-lg p-3 border border-slate-100'>
              <div className='text-xs text-slate-500 mb-1'>{label}</div>
              <div className={`text-lg font-bold font-mono tabular-nums ${color}`}>{value}</div>
              <div className='text-xs text-slate-500 font-mono tabular-nums'>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

// ── Collapsible section ──────────────────────────────────────────────────────
type SectionStatus = 'green' | 'yellow' | 'red' | 'blue' | 'gray'

function CollapsibleSection({
  id, title, metric, status, defaultExpanded, children,
}: {
  id: string
  title: string
  metric: string
  status: SectionStatus
  defaultExpanded: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultExpanded)

  const dot = {
    green:  'bg-[#15803D]',
    yellow: 'bg-amber-500',
    red:    'bg-[#B91C1C]',
    blue:   'bg-[#2563EB]',
    gray:   'bg-slate-400',
  }[status]

  const badge = {
    green:  'bg-emerald-50 border-emerald-200 text-emerald-700',
    yellow: 'bg-amber-50 border-amber-200 text-amber-700',
    red:    'bg-red-50 border-red-200 text-red-700',
    blue:   'bg-blue-50 border-blue-200 text-[#2563EB]',
    gray:   'bg-slate-50 border-slate-200 text-slate-500',
  }[status]

  return (
    <div id={id} className='rounded-lg border border-slate-200 overflow-hidden shadow-sm'>
      <button
        onClick={() => setOpen(o => !o)}
        className='w-full flex items-center justify-between px-4 md:px-6 py-4 bg-white
          hover:bg-slate-50 transition-colors text-left'>
        <div className='flex items-center gap-2 md:gap-3 min-w-0'>
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
          <span className='font-semibold text-sm md:text-[1.0625rem] tracking-tight text-[#0B1B2E] truncate'>
            {title}
          </span>
          <span className={`text-xs px-2 md:px-2.5 py-0.5 rounded-full border shrink-0 hidden sm:inline-block ${badge}`}>
            {metric}
          </span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 shrink-0 ml-2 transition-transform duration-200
          ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out
        ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className='overflow-hidden'>
          <div className='p-4 space-y-4 border-t border-slate-100'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Client view ──────────────────────────────────────────────────────────────
const ClientView = memo(function ClientView({ results }: { results: StressTestResult }) {
  const { summary, positions, explanation } = results

  const fmt = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(n)

  const healthScore   = Math.max(1, Math.min(10, 10 + summary.total_loss_pct / 5))
  const healthColor   = healthScore >= 7 ? '#15803D' : healthScore >= 5 ? '#B45309' : healthScore >= 3 ? '#EA580C' : '#B91C1C'
  const healthLabel   = healthScore >= 7 ? 'Healthy' : healthScore >= 5 ? 'At Risk' : healthScore >= 3 ? 'Vulnerable' : 'Critical'
  const healthSentence = healthScore >= 7
    ? 'Your portfolio is holding up well under this scenario.'
    : healthScore >= 5
    ? 'Your portfolio faces some pressure — manageable with adjustments.'
    : healthScore >= 3
    ? 'This scenario puts meaningful strain on your portfolio.'
    : 'This scenario has a significant impact on your portfolio.'

  const onTrack  = summary.total_loss_pct > -15
  const atRisk   = summary.total_loss_pct <= -15 && summary.total_loss_pct > -30
  const GoalIcon  = onTrack ? CheckCircle : atRisk ? AlertTriangle : XCircle
  const goalColor = onTrack ? 'text-[#15803D]' : atRisk ? 'text-amber-700' : 'text-[#B91C1C]'
  const goalBg    = onTrack ? 'bg-emerald-50 border-emerald-200' : atRisk ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
  const goalText  = onTrack
    ? 'Based on this scenario, your retirement timeline remains on track.'
    : atRisk
    ? 'This scenario may push your retirement timeline back by 1–2 years.'
    : 'This scenario could significantly delay your retirement goals.'

  const lossAmount = Math.abs(summary.total_loss)
  const lossPct    = Math.abs(summary.total_loss_pct)

  const { recoveryYears, recoveryYear, noRecovery } = useMemo(() => {
    const annualReturn   = 0.07
    const annualContrib  = 2000 * 12
    let rv  = 0
    let val = summary.stressed_value
    while (val < summary.total_value && rv < 30) {
      val = val * (1 + annualReturn) + annualContrib
      rv++
    }
    return {
      recoveryYears: rv,
      recoveryYear:  new Date().getFullYear() + rv,
      noRecovery:    rv >= 30,
    }
  }, [summary.stressed_value, summary.total_value])

  return (
    <div className='max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-5 md:space-y-6'>

      <div className='bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-8
        flex flex-col sm:flex-row items-center gap-5 sm:gap-8'>
        <div className='shrink-0 w-28 h-28 rounded-full flex items-center justify-center'
          style={{ background: `conic-gradient(${healthColor} ${healthScore * 10}%, #E2E8F0 0)` }}>
          <div className='w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center'>
            <span className='text-2xl font-black text-[#0B1B2E] font-mono tabular-nums'>{healthScore.toFixed(1)}</span>
            <span className='text-xs text-slate-400'>/10</span>
          </div>
        </div>
        <div className='text-center sm:text-left'>
          <p className='text-xs text-slate-400 uppercase tracking-widest mb-1'>Portfolio health</p>
          <p className='text-3xl font-bold mb-2' style={{ color: healthColor }}>{healthLabel}</p>
          <p className='text-slate-700 text-lg leading-relaxed'>{healthSentence}</p>
        </div>
      </div>

      <div className={`rounded-xl border p-5 md:p-8 flex items-start gap-5 ${goalBg}`}>
        <GoalIcon size={32} className={`${goalColor} shrink-0 mt-1`} />
        <div>
          <p className='text-xs text-slate-400 uppercase tracking-widest mb-1'>Retirement goal</p>
          <p className={`text-2xl font-bold mb-2 ${goalColor}`}>
            {onTrack ? 'On track' : atRisk ? 'At risk' : 'Off track'}
          </p>
          <p className='text-slate-700 text-lg leading-relaxed'>{goalText}</p>
        </div>
      </div>

      <div className='bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-8'>
        <p className='text-xs text-slate-400 uppercase tracking-widest mb-3'>Worst case loss</p>
        <p className='text-4xl md:text-5xl font-black text-[#B91C1C] mb-3 font-mono tabular-nums'>{fmt(lossAmount)}</p>
        <p className='text-slate-700 text-lg leading-relaxed'>
          Under this scenario, your portfolio would drop from{' '}
          <span className='text-[#0B1B2E] font-semibold'>{fmt(summary.total_value)}</span> to{' '}
          <span className='text-[#B91C1C] font-semibold'>{fmt(summary.stressed_value)}</span> — a{' '}
          {lossPct.toFixed(0)}% decline based on the {summary.severity_label.toLowerCase()} stress applied.
        </p>
      </div>

      <div className='bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-8'>
        <p className='text-xs text-slate-400 uppercase tracking-widest mb-3'>Recovery timeline</p>
        {noRecovery ? (
          <>
            <p className='text-4xl font-black text-orange-600 mb-3'>Over 30 years</p>
            <p className='text-slate-700 text-lg leading-relaxed'>
              At current contribution rates and historical average returns, full recovery to pre-stress levels
              would take more than 30 years. A contribution increase or rebalancing may be needed.
            </p>
          </>
        ) : (
          <>
            <div className='flex items-baseline gap-3 mb-3'>
              <p className='text-4xl md:text-5xl font-black text-[#2563EB] font-mono tabular-nums'>{recoveryYears}</p>
              <p className='text-2xl text-slate-400 font-semibold'>{recoveryYears === 1 ? 'year' : 'years'}</p>
            </div>
            <p className='text-slate-700 text-lg leading-relaxed'>
              Continuing current contributions at historical average returns, your portfolio is estimated
              to recover by <span className='text-[#0B1B2E] font-semibold'>{recoveryYear}</span>.
            </p>
          </>
        )}
      </div>

      {explanation?.client_explanation && (
        <div className='bg-blue-50 border border-blue-200 rounded-xl p-5 md:p-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-8 bg-[#2563EB]/10 rounded-lg flex items-center justify-center'>
              <Brain size={16} className='text-[#2563EB]' />
            </div>
            <p className='text-[#2563EB] font-medium text-lg'>What this means for you</p>
          </div>
          <p className='text-slate-700 text-lg leading-relaxed whitespace-pre-line'>
            {explanation.client_explanation}
          </p>
          {explanation.suggestions && (
            <div className='mt-6 pt-6 border-t border-blue-200'>
              <p className='text-[#2563EB] font-medium mb-3'>Suggested next steps</p>
              <p className='text-slate-700 text-base leading-relaxed whitespace-pre-line'>
                {explanation.suggestions}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

// ── Action plan ──────────────────────────────────────────────────────────────
type ActionStatus = 'todo' | 'done' | 'dismissed'

interface LocalAction {
  id: string
  kind: string
  title: string
  detail: string
  status: ActionStatus
}

function deriveActions(results: StressTestResult): LocalAction[] {
  const { positions, summary, explanation } = results
  const actions: LocalAction[] = []

  const worstPositions = [...positions]
    .sort((a, b) => a.loss_pct - b.loss_pct)
    .slice(0, 2)
    .filter(p => p.loss_pct < -10)

  worstPositions.forEach(p => {
    actions.push({
      id: `rebalance-${p.ticker}`,
      kind: 'rebalance',
      title: `Trim ${p.ticker} position`,
      detail: `${p.ticker} loses ${p.loss_pct.toFixed(1)}% under this scenario. Consider reducing allocation.`,
      status: 'todo',
    })
  })

  const taxSavings = (summary as any).total_tax_impact
  if (taxSavings && taxSavings > 0) {
    actions.push({
      id: 'harvest-tlh',
      kind: 'harvest',
      title: 'Execute tax-loss harvest',
      detail: `Estimated ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(taxSavings)} in tax savings available.`,
      status: 'todo',
    })
  }

  if (summary.total_loss_pct < -20) {
    actions.push({
      id: 'raise-cash',
      kind: 'raise_cash',
      title: 'Raise cash buffer',
      detail: 'Severe drawdown risk. Increasing cash to 5–10% reduces sequence-of-returns exposure.',
      status: 'todo',
    })
  }

  if (summary.total_loss_pct < -15) {
    actions.push({
      id: 'client-call',
      kind: 'client_call',
      title: 'Schedule client review call',
      detail: 'Portfolio faces meaningful stress impact. Proactive communication builds trust during volatility.',
      status: 'todo',
    })
  }

  if ((explanation as any)?.advisor_summary) {
    actions.push({
      id: 'review-memo',
      kind: 'review',
      title: 'Review AI analyst memo',
      detail: 'Read the generated memo and verify trade recommendations before client delivery.',
      status: 'todo',
    })
  }

  return actions
}

const KIND_LABELS: Record<string, string> = {
  rebalance:   'Rebalance',
  harvest:     'Tax harvest',
  hedge:       'Hedge',
  raise_cash:  'Raise cash',
  client_call: 'Client call',
  review:      'Review',
}

const ActionPlan = memo(function ActionPlan({ results }: { results: StressTestResult }) {
  const [actions, setActions] = useState<LocalAction[]>(() => deriveActions(results))

  const cycle = (id: string) => {
    setActions(prev => prev.map(a => {
      if (a.id !== id) return a
      const next: ActionStatus = a.status === 'todo' ? 'done' : a.status === 'done' ? 'dismissed' : 'todo'
      return { ...a, status: next }
    }))
  }

  const todoCount = actions.filter(a => a.status === 'todo').length

  return (
    <div className='rounded-lg border border-slate-200 overflow-hidden shadow-sm'>
      <div className='flex items-center gap-3 px-4 md:px-6 py-4 bg-slate-50 border-b border-slate-200'>
        <div className='w-8 h-8 bg-[#2563EB]/10 rounded-lg flex items-center justify-center'>
          <ListChecks size={16} className='text-[#2563EB]' />
        </div>
        <div>
          <h2 className='font-semibold text-[#0B1B2E] tracking-tight text-sm'>Action plan</h2>
          <p className='text-xs text-slate-500'>{todoCount} item{todoCount !== 1 ? 's' : ''} to-do</p>
        </div>
      </div>
      <div className='divide-y divide-slate-100'>
        {actions.map(a => {
          const Icon = a.status === 'done' ? CheckCircle2 : a.status === 'dismissed' ? XCircleIcon : Circle
          const iconColor = a.status === 'done' ? 'text-[#15803D]' : a.status === 'dismissed' ? 'text-slate-300' : 'text-slate-400'
          return (
            <button
              key={a.id}
              onClick={() => cycle(a.id)}
              className='w-full flex items-start gap-3 px-4 md:px-6 py-3.5 hover:bg-slate-50 text-left transition-colors group'>
              <Icon size={15} className={`${iconColor} shrink-0 mt-0.5`} />
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <span className={`text-sm font-medium
                    ${a.status === 'dismissed' ? 'text-slate-400 line-through' : 'text-[#0B1B2E]'}`}>
                    {a.title}
                  </span>
                  <span className='text-[10px] text-slate-500 bg-slate-50 border border-slate-200
                    px-1.5 py-0.5 rounded font-medium'>
                    {KIND_LABELS[a.kind] ?? a.kind}
                  </span>
                </div>
                <p className='text-xs text-slate-500 leading-relaxed mt-0.5'>{a.detail}</p>
              </div>
            </button>
          )
        })}
      </div>
      <div className='px-4 md:px-6 py-2.5 bg-slate-50 border-t border-slate-100'>
        <p className='text-[10px] text-slate-400'>Click an action to cycle: to-do → done → dismissed</p>
      </div>
    </div>
  )
})

// ── Interfaces ───────────────────────────────────────────────────────────────
interface HouseholdAccount {
  name: string
  type: string
  aum: number
  positions: { ticker: string; weight: number }[]
}

interface SaveModal {
  open: boolean
  clientName: string
  saving: boolean
}

// ── Advisor view (extracted from IIFE so memo prevents re-renders on modal/export state changes) ──
interface AdvisorViewProps {
  results: StressTestResult
  household: HouseholdAccount[] | null
  profile: ClientProfile
  setProfile: (p: ClientProfile) => void
}

const AdvisorView = memo(function AdvisorView({ results, household, profile, setProfile }: AdvisorViewProps) {

  const metrics = useMemo(() => {
    const healthScore = Math.max(1, Math.min(10, 10 + results.summary.total_loss_pct / 5))
    const lossPct     = results.summary.total_loss_pct

    const summaryStatus: SectionStatus = healthScore >= 7 ? 'green' : healthScore >= 5 ? 'yellow' : 'red'
    const summaryMetric = `${healthScore.toFixed(1)}/10 health`

    const chartsStatus: SectionStatus = lossPct > -10 ? 'green' : lossPct > -25 ? 'yellow' : 'red'
    const chartsMetric = `${lossPct.toFixed(1)}% stress loss`

    const avgBeta = results.positions.length
      ? results.positions.reduce((s, p) => s + (p.beta || 1), 0) / results.positions.length
      : 1
    const factorStatus: SectionStatus = avgBeta < 1.0 ? 'green' : avgBeta < 1.3 ? 'yellow' : 'red'
    const factorMetric = `avg β ${avgBeta.toFixed(2)}`

    const highBetaCount = results.positions.filter(p => p.beta > 1.3).length
    const corrStatus: SectionStatus = highBetaCount === 0 ? 'green' : highBetaCount <= 2 ? 'yellow' : 'red'
    const corrMetric = `${highBetaCount} high-beta position${highBetaCount !== 1 ? 's' : ''}`

    const bmarks    = getBenchmarkLosses(results.summary.scenario_text)
    const allLosses = [lossPct, ...bmarks.map(b => b.loss)].sort((a, b) => b - a)
    const benchRank = allLosses.indexOf(lossPct) + 1
    const benchStatus: SectionStatus = benchRank <= 2 ? 'green' : benchRank === 3 ? 'yellow' : 'red'
    const benchMetric = `#${benchRank} of ${allLosses.length}`

    const maxWeight = results.positions.length ? Math.max(...results.positions.map(p => p.weight)) : 0
    const liquidityStatus: SectionStatus = maxWeight < 15 ? 'green' : maxWeight < 30 ? 'yellow' : 'red'
    const liquidityMetric = `${maxWeight.toFixed(0)}% largest position`

    const clientStatus: SectionStatus = lossPct > -15 ? 'green' : lossPct > -30 ? 'yellow' : 'red'
    const clientMetric = lossPct > -15 ? 'Goals on track' : lossPct > -30 ? 'Goals at risk' : 'Goals impacted'

    const flaggedCount = results.positions.filter(
      p => p.loss_pct < -15 || (p.beta > 1.4 && p.loss_pct < -10)
    ).length
    const rebalStatus: SectionStatus = flaggedCount === 0 ? 'green' : flaggedCount <= 2 ? 'yellow' : 'red'
    const rebalMetric = `${flaggedCount} position${flaggedCount !== 1 ? 's' : ''} flagged`

    const highRiskCount = results.positions.filter(p => p.risk_level === 'High').length
    const positionStatus: SectionStatus = highRiskCount === 0 ? 'green' : highRiskCount <= 2 ? 'yellow' : 'red'
    const positionMetric = `${highRiskCount} high-risk position${highRiskCount !== 1 ? 's' : ''}`

    const sevLabel  = results.summary.severity_label
    const aiStatus: SectionStatus = sevLabel === 'Mild' || sevLabel === 'Moderate' ? 'green' : sevLabel === 'Severe' ? 'yellow' : 'red'

    return {
      healthScore, lossPct,
      summaryStatus, summaryMetric,
      chartsStatus, chartsMetric,
      factorStatus, factorMetric,
      corrStatus, corrMetric,
      benchStatus, benchMetric,
      liquidityStatus, liquidityMetric,
      clientStatus, clientMetric,
      rebalStatus, rebalMetric,
      positionStatus, positionMetric,
      sevLabel, aiStatus,
    }
  }, [results])

  const fmtCurrency = useCallback((n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(n), [])

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-6 py-4 space-y-3'>

      <div className='mb-2 s-enter' style={{ '--s-delay': '0ms' } as React.CSSProperties}>
        <h1 className='text-3xl font-black tracking-[-0.03em] text-[#0B1B2E]'>Stress test results</h1>
        <p className='text-slate-500 mt-1 text-sm max-w-2xl leading-relaxed'>
          {results.summary.scenario_text}
        </p>
      </div>

      {/* Household breakdown */}
      {household && household.length > 0 && (() => {
        const totalAum  = household.reduce((s, a) => s + a.aum, 0)
        const totalLoss = results.summary.total_loss
        return (
          <div className='rounded-lg border border-[#2563EB]/20 bg-[#2563EB]/5 overflow-hidden mb-1 s-enter' style={{ '--s-delay': '80ms' } as React.CSSProperties}>
            <div className='flex items-center gap-3 px-5 py-4 border-b border-[#2563EB]/15'>
              <Layers size={16} className='text-[#2563EB] shrink-0' />
              <span className='font-semibold text-[#0B1B2E]'>Household breakdown</span>
              <span className='text-xs text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20
                px-2.5 py-0.5 rounded-full ml-auto'>
                {household.length} accounts
              </span>
            </div>
            <div className='p-4 grid grid-cols-1 md:grid-cols-2 gap-3'>
              {household.map((acct, i) => {
                const acctPct  = totalAum > 0 ? acct.aum / totalAum : 1 / household.length
                const acctLoss = totalLoss * acctPct
                return (
                  <div key={i} className='bg-white border border-slate-200 rounded-lg p-4 shadow-sm'>
                    <div className='flex items-center justify-between mb-3'>
                      <div>
                        <p className='font-semibold text-sm text-[#0B1B2E]'>{acct.name || acct.type}</p>
                        <p className='text-xs text-[#2563EB]'>{acct.type}</p>
                      </div>
                      <div className='text-right'>
                        <p className='text-sm font-bold text-[#0B1B2E]'>{fmtCurrency(acct.aum)}</p>
                        <p className='text-xs text-slate-400'>
                          {(acctPct * 100).toFixed(0)}% of household
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center justify-between text-xs'>
                      <span className='text-slate-500'>Estimated stress impact</span>
                      <span className='font-semibold text-[#B91C1C] tabular-nums'>
                        {fmtCurrency(acctLoss)}
                      </span>
                    </div>
                    <div className='mt-2 h-1 bg-slate-200 rounded-full overflow-hidden'>
                      <div className='h-full bg-[#2563EB]/60 rounded-full'
                        style={{ width: `${acctPct * 100}%` }} />
                    </div>
                    {acct.positions.length > 0 && (
                      <p className='text-xs text-slate-400 mt-2'>
                        {acct.positions.slice(0, 4).map(p => p.ticker).join(', ')}
                        {acct.positions.length > 4 && ` +${acct.positions.length - 4} more`}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* Summary */}
      <div className='s-enter' style={{ '--s-delay': '0ms' } as React.CSSProperties}>
        <CollapsibleSection id='summary' title='Summary' metric={metrics.summaryMetric}
          status={metrics.summaryStatus} defaultExpanded={metrics.summaryStatus !== 'green'}>
          <SmartSummary results={results} />
        </CollapsibleSection>
      </div>

      {/* Charts */}
      <div className='s-enter' style={{ '--s-delay': '80ms' } as React.CSSProperties}>
        <CollapsibleSection id='charts' title='Charts' metric={metrics.chartsMetric}
          status={metrics.chartsStatus} defaultExpanded={metrics.chartsStatus !== 'green'}>
          <ChartsTabs results={results} />
        </CollapsibleSection>
      </div>

      {/* Risk group */}
      <div className='s-enter' style={{ '--s-delay': '160ms' } as React.CSSProperties}>
        <SectionGroup label='Risk'>
          <CollapsibleSection id='factors' title='Factor risk model' metric={metrics.factorMetric}
            status={metrics.factorStatus} defaultExpanded={metrics.factorStatus !== 'green'}>
            <FactorModel positions={results.positions} scenarioText={results.summary.scenario_text} />
          </CollapsibleSection>

          <CollapsibleSection id='correlation' title='Correlation breakdown' metric={metrics.corrMetric}
            status={metrics.corrStatus} defaultExpanded={metrics.corrStatus !== 'green'}>
            <CorrelationMatrix positions={results.positions} />
          </CollapsibleSection>

          <CollapsibleSection id='liquidity' title='Liquidity stress analysis' metric={metrics.liquidityMetric}
            status={metrics.liquidityStatus} defaultExpanded={metrics.liquidityStatus !== 'green'}>
            <LiquidityPanel positions={results.positions} />
          </CollapsibleSection>

          <CollapsibleSection id='monte-carlo' title='Monte Carlo simulation' metric='1,000 simulation paths'
            status='gray' defaultExpanded={false}>
            <MonteCarlo
              portfolioValue={results.summary.total_value}
              stressedValue={results.summary.stressed_value}
            />
          </CollapsibleSection>
        </SectionGroup>
      </div>

      {/* Goals group */}
      <div className='s-enter' style={{ '--s-delay': '240ms' } as React.CSSProperties}>
        <SectionGroup label='Goals'>
          <CollapsibleSection id='client' title='Client impact & retirement' metric={metrics.clientMetric}
            status={metrics.clientStatus} defaultExpanded={metrics.clientStatus !== 'green'}>
            <ClientImpact
              portfolioValue={results.summary.total_value}
              stressedValue={results.summary.stressed_value}
              profile={profile}
              setProfile={setProfile}
            />
          </CollapsibleSection>

          <CollapsibleSection id='tax' title='Tax impact' metric='Opportunities available'
            status='blue' defaultExpanded={false}>
            <TaxImpact results={results} profile={profile} />
          </CollapsibleSection>
        </SectionGroup>
      </div>

      {/* Action group */}
      <div className='s-enter' style={{ '--s-delay': '320ms' } as React.CSSProperties}>
        <SectionGroup label='Action'>
          <CollapsibleSection id='rebalancing' title='Rebalancing recommendations' metric={metrics.rebalMetric}
            status={metrics.rebalStatus} defaultExpanded={metrics.rebalStatus !== 'green'}>
            <RebalancingPanel results={results} />
          </CollapsibleSection>

          <CollapsibleSection id='benchmark' title='Benchmark comparison' metric={metrics.benchMetric}
            status={metrics.benchStatus} defaultExpanded={metrics.benchStatus !== 'green'}>
            <BenchmarkComparison summary={results.summary} />
          </CollapsibleSection>

          <CollapsibleSection id='explanation' title='AI analysis' metric={`${metrics.sevLabel} scenario`}
            status={metrics.aiStatus} defaultExpanded={metrics.aiStatus !== 'green'}>
            <ExplanationPanel explanation={results.explanation} />
          </CollapsibleSection>
        </SectionGroup>
      </div>

      {/* Positions */}
      <div className='s-enter' style={{ '--s-delay': '400ms' } as React.CSSProperties}>
        <CollapsibleSection id='positions' title='Position detail' metric={metrics.positionMetric}
          status={metrics.positionStatus} defaultExpanded={metrics.positionStatus !== 'green'}>
          <PositionTable positions={results.positions} />
        </CollapsibleSection>
      </div>

      {/* Action plan */}
      <div className='s-enter' style={{ '--s-delay': '480ms' } as React.CSSProperties}>
        <ActionPlan results={results} />
      </div>

    </div>
  )
})

// ── StressTestResult → PortfolioData transformer ─────────────────────────────
const SECTOR_COLORS = ['#3B82F6','#4A7FC1','#6DB87A','#8888AA','#E07070','#5B7FE6','#E0A050']

function toPortfolioData(results: StressTestResult): PortfolioData {
  const { summary, positions, explanation } = results

  const sectorValues: Record<string, number> = {}
  for (const p of positions) {
    const s = (p as any).sector || 'Other'
    sectorValues[s] = (sectorValues[s] ?? 0) + p.value
  }
  const total = summary.total_value || 1
  const allocation = Object.entries(sectorValues)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, v], i) => ({ name, pct: Math.round(v / total * 100), color: SECTOR_COLORS[i] }))

  const sevMap: Record<string, number> = { Mild:1, Moderate:2, Significant:3, Severe:4, Extreme:5 }
  const recMap: Record<string, number> = { Mild:3, Moderate:6, Significant:9, Severe:14, Extreme:24 }
  const sev = summary.severity_label || 'Moderate'

  return {
    clientName:  'Your Portfolio',
    advisorName: 'Vantage',
    date: new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }),
    totalUsd:  summary.total_value,
    brlPerUsd: 5.20,
    allocation,
    performance: {
      oneMonth: 0, ytd: 0, oneYear: 0,
      benchmark: { oneMonth:0, ytd:0, oneYear:0 },
      benchmarkName: '60/40 Blend',
    },
    scenarios: [{
      id:       'current',
      name:     summary.scenario_text.length > 60
                  ? summary.scenario_text.slice(0, 60) + '…'
                  : summary.scenario_text,
      year:     new Date().getFullYear(),
      narrative: (explanation as any)?.client_explanation || summary.scenario_text,
      severity: sevMap[sev] ?? 3,
      impactUsd:      summary.total_loss,
      impactPct:      summary.total_loss_pct,
      impactBrl:      0,
      recoveryMonths: recMap[sev] ?? 9,
      recoveryNote:   `Based on historical ${sev.toLowerCase()} market scenarios`,
    }],
    goals:          [],
    illiquidAssets: [],
    recommendedAction: (explanation as any)?.advisor_summary || '',
  }
}

// ── Results page ─────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const [results, setResults]         = useState<StressTestResult | null>(null)
  const [exporting, setExporting]     = useState(false)
  const [view, setView]               = useState<'advisor' | 'client' | 'presentation'>('advisor')
  const [profile, setProfile]         = useState<ClientProfile>(DEFAULT_PROFILE)
  const [isPresenting, setPresenting] = useState(false)
  const [saveModal, setSaveModal]     = useState<SaveModal>({ open: false, clientName: '', saving: false })
  const [household, setHousehold]     = useState<HouseholdAccount[] | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('stressResults')
    if (raw) setResults(JSON.parse(raw))
    try {
      const hRaw = sessionStorage.getItem('householdData')
      if (hRaw) setHousehold(JSON.parse(hRaw))
    } catch {}
  }, [])

  const handleSaveReview = useCallback(() => {
    if (!results || !saveModal.clientName.trim()) return
    setSaveModal(m => ({ ...m, saving: true }))
    try {
      const existing = JSON.parse(localStorage.getItem('savedReviews') || '[]')
      const review = {
        id:             Math.random().toString(36).slice(2),
        clientName:     saveModal.clientName.trim(),
        date:           new Date().toISOString(),
        scenario:       results.summary.scenario_text,
        totalLossPct:   results.summary.total_loss_pct,
        healthScore:    Math.max(1, Math.min(10, 10 + results.summary.total_loss_pct / 5)),
        severityLabel:  results.summary.severity_label,
        portfolioValue: results.summary.total_value,
        stressedValue:  results.summary.stressed_value,
        results,
      }
      localStorage.setItem('savedReviews', JSON.stringify([review, ...existing]))
    } catch {}
    setSaveModal({ open: false, clientName: '', saving: false })
  }, [results, saveModal.clientName])

  const handleExportPdf = useCallback(async () => {
    if (!results) return
    setExporting(true)
    try {
      await exportPdf(results)
    } finally {
      setExporting(false)
    }
  }, [results])

  if (!results) return (
    <main className='min-h-screen text-[#0B1B2E] flex items-center justify-center'>
      <p className='text-slate-500 text-sm'>No results found.{' '}
        <Link href='/upload' className='text-[#2563EB] hover:underline'>Run a stress test</Link>
      </p>
    </main>
  )

  // Sticky summary bar values (advisor only)
  const hs      = Math.max(1, Math.min(10, 10 + results.summary.total_loss_pct / 5))
  const hsColor = hs >= 7 ? 'text-[#15803D]' : hs >= 5 ? 'text-amber-600' : 'text-[#B91C1C]'
  const hsDot   = hs >= 7 ? 'bg-[#15803D]'   : hs >= 5 ? 'bg-amber-500'   : 'bg-[#B91C1C]'
  let rv = 0, rvVal = results.summary.stressed_value
  while (rvVal < results.summary.total_value && rv < 30) { rvVal = rvVal * 1.07 + 24000; rv++ }
  const goalOk    = results.summary.total_loss_pct > -15
  const goalWarn  = results.summary.total_loss_pct <= -15 && results.summary.total_loss_pct > -30
  const goalDot   = goalOk ? 'bg-[#15803D]' : goalWarn ? 'bg-amber-500' : 'bg-[#B91C1C]'
  const goalText  = goalOk ? 'On track'     : goalWarn ? 'At risk'      : 'Off track'
  const goalColor = goalOk ? 'text-[#15803D]' : goalWarn ? 'text-amber-600' : 'text-[#B91C1C]'

  return (
    <main className='min-h-screen text-[#0B1B2E]'>

      {isPresenting && (
        <PresentationMode results={results} profile={profile} onClose={() => setPresenting(false)} />
      )}

      {saveModal.open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4
          bg-black/50 backdrop-blur-sm'>
          <div className='bg-white border border-slate-200 rounded-xl p-6 w-full max-w-sm shadow-xl'>
            <h3 className='text-lg font-semibold text-[#0B1B2E] mb-1'>Save review</h3>
            <p className='text-xs text-slate-500 mb-5'>
              Saved reviews appear in{' '}
              <Link href='/clients' className='text-[#2563EB] hover:underline'>Annual Review</Link>
              {' '}for year-over-year comparison.
            </p>
            <input
              autoFocus
              value={saveModal.clientName}
              onChange={e => setSaveModal(m => ({ ...m, clientName: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter') handleSaveReview() }}
              placeholder='Client name (e.g. John Smith)'
              className='w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3
                text-sm text-[#0B1B2E] placeholder-slate-400 focus:outline-none
                focus:border-[#2563EB] mb-4'
            />
            <div className='flex gap-3'>
              <button
                onClick={() => setSaveModal({ open: false, clientName: '', saving: false })}
                className='flex-1 py-2.5 rounded-lg border border-slate-200 bg-white
                  hover:bg-slate-50 text-sm text-slate-600 transition-colors'>
                Cancel
              </button>
              <button
                onClick={handleSaveReview}
                disabled={!saveModal.clientName.trim() || saveModal.saving}
                className='flex-1 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8]
                  text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'advisor' && <ResultsNav />}

      {/* Toggle bar + sticky summary */}
      <div className={`sticky top-0 z-40 bg-white border-b border-slate-200`}>
        <div className='max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between'>
          <div className='flex items-center gap-1 bg-slate-100 rounded-lg p-1'>
            <button
              onClick={() => setView('advisor')}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-md text-sm font-medium
                transition-all duration-200
                ${view === 'advisor' ? 'bg-white text-[#0B1B2E] shadow-sm' : 'text-slate-500 hover:text-[#0B1B2E]'}`}>
              <Briefcase size={14} />
              <span className='hidden sm:inline'>Advisor view</span>
            </button>
            <button
              onClick={() => setView('client')}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-md text-sm font-medium
                transition-all duration-200
                ${view === 'client' ? 'bg-[#2563EB] text-white font-semibold shadow-sm' : 'text-slate-500 hover:text-[#0B1B2E]'}`}>
              <Users size={14} />
              <span className='hidden sm:inline'>Client view</span>
            </button>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setSaveModal(m => ({ ...m, open: true }))}
              className='flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-200
                hover:bg-slate-50 text-sm text-slate-600 transition-colors'>
              <BookmarkPlus size={14} />
              <span className='hidden sm:inline'>Save</span>
            </button>
            <button
              onClick={() => setView('presentation')}
              className='flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-200
                hover:bg-slate-50 text-sm text-slate-600 transition-colors'>
              <FileText size={14} />
              <span className='hidden sm:inline'>Client Presentation</span>
            </button>
            <button
              onClick={handleExportPdf}
              disabled={exporting}
              className='flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-200
                hover:bg-slate-50 active:scale-[0.98]
                text-sm text-slate-600 transition-colors disabled:opacity-50'>
              {exporting ? (
                <span className='w-3 h-3 border border-slate-300 border-t-[#2563EB] rounded-full animate-spin' />
              ) : (
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/>
                  <polyline points='7 10 12 15 17 10'/>
                  <line x1='12' y1='15' x2='12' y2='3'/>
                </svg>
              )}
              <span className='hidden sm:inline'>{exporting ? 'Generating...' : 'Export PDF'}</span>
            </button>
            <Link href='/upload'
              className='text-sm text-[#2563EB] hover:text-[#1D4ED8] transition-colors hidden md:inline'>
              Run new test
            </Link>
          </div>
        </div>

        {/* Sticky summary bar — advisor only */}
        {view === 'advisor' && (
          <div className='border-t border-slate-100 bg-slate-50/50'>
            <div className='max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center gap-4 md:gap-6 overflow-x-auto'>
              <div className='flex items-center gap-2 shrink-0'>
                <div className={`w-1.5 h-1.5 rounded-full ${hsDot}`} />
                <span className='text-xs text-slate-500'>Health</span>
                <span className={`text-xs font-semibold font-mono tabular-nums ${hsColor}`}>{hs.toFixed(1)}/10</span>
              </div>
              <div className='w-px h-3 bg-slate-200 shrink-0' />
              <div className='flex items-center gap-2 shrink-0'>
                <span className='text-xs text-slate-500'>Stress loss</span>
                <span className='text-xs font-semibold font-mono tabular-nums text-[#B91C1C]'>
                  {results.summary.total_loss_pct.toFixed(1)}%
                </span>
              </div>
              <div className='w-px h-3 bg-slate-200 shrink-0' />
              <div className='flex items-center gap-2 shrink-0'>
                <span className='text-xs text-slate-500'>Recovery</span>
                <span className='text-xs font-semibold font-mono tabular-nums text-[#2563EB]'>
                  {rv >= 30 ? '>30 yrs' : `${rv} yr${rv !== 1 ? 's' : ''}`}
                </span>
              </div>
              <div className='w-px h-3 bg-slate-200 shrink-0' />
              <div className='flex items-center gap-2 shrink-0'>
                <div className={`w-1.5 h-1.5 rounded-full ${goalDot}`} />
                <span className='text-xs text-slate-500'>Goals</span>
                <span className={`text-xs font-semibold ${goalColor}`}>{goalText}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {view === 'client' && <ClientView results={results} />}

      {view === 'presentation' && (
        <WealthPresentation portfolioData={toPortfolioData(results)} advisorMode={true} />
      )}

      {view === 'advisor' && (
        <AdvisorView
          results={results}
          household={household}
          profile={profile}
          setProfile={setProfile}
        />
      )}

      {view !== 'presentation' && <ComplianceFooter />}

    </main>
  )
}

