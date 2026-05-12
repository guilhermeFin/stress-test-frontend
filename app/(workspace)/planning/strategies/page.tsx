'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Copy, ChevronRight } from 'lucide-react'
import {
  type Strategy, type AllocationMap, type AssetClass,
  BUILTIN_STRATEGIES, ASSET_CLASS_LABELS, ASSET_CLASS_COLORS,
} from '@/lib/planning'

const ASSET_CLASSES: AssetClass[] = ['us_equity', 'intl_equity', 'fixed_income', 'alternatives', 'cash']

const RISK_BADGE: Record<string, string> = {
  conservative: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  moderate:     'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  growth:       'text-amber-400 bg-amber-400/10 border-amber-400/20',
  aggressive:   'text-red-400 bg-red-400/10 border-red-400/20',
}

const RISK_LABEL: Record<string, string> = {
  conservative: 'Conservative',
  moderate:     'Moderate',
  growth:       'Growth',
  aggressive:   'Aggressive',
}

const REBALANCE_LABEL: Record<string, string> = {
  threshold:   'Threshold-based',
  quarterly:   'Quarterly',
  semi_annual: 'Semi-annual',
  annual:      'Annual',
}

// ── Mini horizontal bar chart ────────────────────────────────────────────────

function AllocationBar({ allocation }: { allocation: AllocationMap }) {
  return (
    <div className='h-2 rounded-full overflow-hidden flex w-full'>
      {ASSET_CLASSES.map(ac => {
        const pct = allocation[ac] ?? 0
        if (pct === 0) return null
        return (
          <div
            key={ac}
            style={{ width: `${pct}%`, background: ASSET_CLASS_COLORS[ac] }}
          />
        )
      })}
    </div>
  )
}

// ── Strategy card ─────────────────────────────────────────────────────────────

function StrategyCard({
  strategy, onApply, onFork,
}: {
  strategy: Strategy
  onApply: (s: Strategy) => void
  onFork: (s: Strategy) => void
}) {
  const [applied, setApplied] = useState(false)

  const handleApply = () => {
    onApply(strategy)
    setApplied(true)
    setTimeout(() => setApplied(false), 2000)
  }

  return (
    <div className='bg-white/[0.025] border border-white/[0.06] hover:border-white/10
      rounded-2xl overflow-hidden transition-all group'>

      {/* Header */}
      <div className='px-5 py-4 border-b border-white/[0.04]'>
        <div className='flex items-start justify-between gap-2 mb-1'>
          <h3 className='text-sm font-bold text-white'>{strategy.name}</h3>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0
            ${RISK_BADGE[strategy.risk_profile] ?? 'text-gray-400 bg-white/5 border-white/10'}`}>
            {RISK_LABEL[strategy.risk_profile] ?? strategy.risk_profile}
          </span>
        </div>
        <p className='text-xs text-gray-500 leading-relaxed'>{strategy.description}</p>
      </div>

      {/* Allocation bar */}
      <div className='px-5 py-4 border-b border-white/[0.04]'>
        <AllocationBar allocation={strategy.allocation} />
        <div className='flex flex-wrap gap-x-3 gap-y-1.5 mt-3'>
          {ASSET_CLASSES.map(ac => {
            const pct = strategy.allocation[ac] ?? 0
            if (pct === 0) return null
            return (
              <div key={ac} className='flex items-center gap-1.5 text-[11px]'>
                <span className='w-2 h-2 rounded-full shrink-0'
                  style={{ background: ASSET_CLASS_COLORS[ac] }} />
                <span className='text-gray-400'>{ASSET_CLASS_LABELS[ac]}</span>
                <span className='font-semibold text-white tabular-nums'>{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Commentary */}
      <div className='px-5 py-3 border-b border-white/[0.04]'>
        <p className='text-xs text-gray-500 leading-relaxed line-clamp-3'>{strategy.commentary}</p>
      </div>

      {/* Meta + actions */}
      <div className='px-5 py-3 flex items-center justify-between'>
        <p className='text-[10px] text-gray-600'>
          Rebalance: {REBALANCE_LABEL[strategy.rebalance_trigger] ?? strategy.rebalance_trigger}
        </p>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => onFork(strategy)}
            title='Fork & customize in IPS builder'
            className='flex items-center gap-1 text-xs text-gray-500 hover:text-white
              border border-white/[0.06] hover:border-white/12 rounded-lg px-2.5 py-1 transition-colors'
          >
            <Copy size={11} /> Fork
          </button>
          <button
            onClick={handleApply}
            className={`flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1 transition-colors
              ${applied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'}`}
          >
            {applied ? <><Check size={11} /> Applied</> : 'Apply to household'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'conservative' | 'moderate' | 'growth' | 'aggressive'

export default function StrategiesPage() {
  const [filter, setFilter] = useState<FilterKey>('all')
  const [forked, setForked] = useState<Strategy | null>(null)

  const visible = BUILTIN_STRATEGIES.filter(
    s => filter === 'all' || s.risk_profile === filter
  )

  const handleApply = (s: Strategy) => {
    // In production: POST /api/v1/planning/strategies/:id/apply with household_id
    console.log('apply strategy', s.id)
  }

  const handleFork = (s: Strategy) => {
    setForked(s)
    // In production: navigate to IPS builder pre-loaded with strategy allocation
    window.location.href = '/planning/ips'
  }

  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>

      <Link href='/planning'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Planning
      </Link>

      <div className='flex items-start justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight mb-1'>Strategy Templates</h1>
          <p className='text-sm text-gray-500 max-w-xl'>
            Five evidence-based allocation strategies. Apply directly to a client household
            or fork into the IPS builder to customize.
          </p>
        </div>
        <Link href='/planning/ips'
          className='flex items-center gap-1.5 text-xs text-gray-400 hover:text-white
            border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-colors'>
          Custom IPS <ChevronRight size={12} />
        </Link>
      </div>

      {/* Filter bar */}
      <div className='flex gap-1.5 mb-6 flex-wrap'>
        {([
          { key: 'all',          label: 'All' },
          { key: 'conservative', label: 'Conservative' },
          { key: 'moderate',     label: 'Moderate' },
          { key: 'growth',       label: 'Growth' },
          { key: 'aggressive',   label: 'Aggressive' },
        ] as { key: FilterKey; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors
              ${filter === key
                ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20'
                : 'text-gray-500 border border-white/[0.06] hover:text-white hover:border-white/10'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {visible.map(s => (
          <StrategyCard
            key={s.id}
            strategy={s}
            onApply={handleApply}
            onFork={handleFork}
          />
        ))}
      </div>

      {/* Legend */}
      <div className='mt-6 flex flex-wrap gap-x-4 gap-y-2'>
        {ASSET_CLASSES.map(ac => (
          <div key={ac} className='flex items-center gap-1.5 text-[11px] text-gray-500'>
            <span className='w-2.5 h-2.5 rounded-full' style={{ background: ASSET_CLASS_COLORS[ac] }} />
            {ASSET_CLASS_LABELS[ac]}
          </div>
        ))}
      </div>
    </div>
  )
}
