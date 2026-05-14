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
  conservative: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  moderate:     'text-amber-700 bg-amber-50 border-amber-200',
  growth:       'text-orange-700 bg-orange-50 border-orange-200',
  aggressive:   'text-red-700 bg-red-50 border-red-200',
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
    <div className='h-2.5 rounded-full overflow-hidden flex w-full'>
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
    <div className='bg-white border border-slate-200 hover:border-slate-300
      rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all'>

      {/* Header */}
      <div className='px-5 py-4 border-b border-slate-200'>
        <div className='flex items-start justify-between gap-2 mb-2'>
          <h3 className='text-lg font-bold text-[#0B1B2E]'>{strategy.name}</h3>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0
            ${RISK_BADGE[strategy.risk_profile] ?? 'text-slate-600 bg-slate-50 border-slate-200'}`}>
            {RISK_LABEL[strategy.risk_profile] ?? strategy.risk_profile}
          </span>
        </div>
        <p className='text-sm text-slate-600 leading-relaxed'>{strategy.description}</p>
      </div>

      {/* Allocation bar */}
      <div className='px-5 py-4 border-b border-slate-200'>
        <AllocationBar allocation={strategy.allocation} />
        <div className='flex flex-wrap gap-x-3 gap-y-1.5 mt-3'>
          {ASSET_CLASSES.map(ac => {
            const pct = strategy.allocation[ac] ?? 0
            if (pct === 0) return null
            return (
              <div key={ac} className='flex items-center gap-1.5 text-xs'>
                <span className='w-2 h-2 rounded-full shrink-0'
                  style={{ background: ASSET_CLASS_COLORS[ac] }} />
                <span className='text-slate-600'>{ASSET_CLASS_LABELS[ac]}</span>
                <span className='font-semibold font-mono tabular-nums text-[#0B1B2E]'>{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Commentary */}
      <div className='px-5 py-3 border-b border-slate-200'>
        <p className='text-sm text-slate-600 leading-relaxed line-clamp-3'>{strategy.commentary}</p>
      </div>

      {/* Meta + actions */}
      <div className='px-5 py-3 flex items-center justify-between'>
        <p className='text-xs text-slate-500'>
          Rebalance: {REBALANCE_LABEL[strategy.rebalance_trigger] ?? strategy.rebalance_trigger}
        </p>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => onFork(strategy)}
            title='Fork & customize in IPS builder'
            className='flex items-center gap-1.5 text-sm text-[#0B1B2E] hover:bg-slate-50
              border border-slate-300 rounded-md px-3 py-1.5 transition-colors'
          >
            <Copy size={11} /> Customize
          </button>
          <button
            onClick={handleApply}
            className={`flex items-center gap-1.5 text-sm font-semibold rounded-md px-4 py-1.5 transition-colors
              ${applied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'}`}
          >
            {applied ? <><Check size={13} /> Applied</> : 'Apply to household'}
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

  const visible = BUILTIN_STRATEGIES.filter(
    s => filter === 'all' || s.risk_profile === filter
  )

  const handleApply = (s: Strategy) => {
    console.log('apply strategy', s.id)
  }

  const handleFork = (s: Strategy) => {
    window.location.href = '/planning/ips'
  }

  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>

      {/* Back link */}
      <Link href='/planning'
        className='flex items-center gap-2 text-sm text-slate-600 hover:text-[#0B1B2E]
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Planning
      </Link>

      {/* Page header */}
      <div className='border-b border-slate-200 pb-6 mb-8 flex items-start justify-between gap-4'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-2'>PLANNING</p>
          <h1 className='text-3xl font-bold text-[#0B1B2E] mb-1'>Strategy Templates</h1>
          <p className='text-base text-slate-600 max-w-xl'>
            Five evidence-based allocation strategies. Apply directly to a client household
            or fork into the IPS builder to customize.
          </p>
        </div>
        <Link href='/planning/ips'
          className='flex items-center gap-1.5 text-sm text-slate-600 hover:text-[#0B1B2E]
            border border-slate-300 hover:border-slate-400 rounded-md px-3 py-2 transition-colors shrink-0 mt-1'>
          Custom IPS <ChevronRight size={14} />
        </Link>
      </div>

      {/* Filter bar */}
      <div className='flex gap-2 mb-6 flex-wrap'>
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
            className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors
              ${filter === key
                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
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
      <div className='mt-6 pt-4 border-t border-slate-200 flex flex-wrap gap-x-5 gap-y-2'>
        {ASSET_CLASSES.map(ac => (
          <div key={ac} className='flex items-center gap-1.5 text-xs text-slate-500'>
            <span className='w-2.5 h-2.5 rounded-full' style={{ background: ASSET_CLASS_COLORS[ac] }} />
            {ASSET_CLASS_LABELS[ac]}
          </div>
        ))}
      </div>
    </div>
  )
}
