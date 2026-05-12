'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Clock, TrendingDown, CheckCircle2,
  Circle, XCircle, Minus, AlertCircle, BarChart3,
} from 'lucide-react'
import { type StressRun, type RecommendedAction, listRuns, patchAction } from '@/lib/portfolios'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return d === 1 ? 'yesterday' : `${d}d ago`
}

const ACTION_LABELS: Record<RecommendedAction['kind'], string> = {
  rebalance:   'Rebalance',
  harvest:     'Tax harvest',
  hedge:       'Add hedge',
  raise_cash:  'Raise cash',
  client_call: 'Client call',
}

const STATUS_ICONS = {
  todo:      Circle,
  done:      CheckCircle2,
  dismissed: XCircle,
}

const STATUS_COLORS = {
  todo:      'text-gray-500',
  done:      'text-green-400',
  dismissed: 'text-gray-600',
}

function RunCard({
  run,
  isFirst,
  prev,
}: {
  run: StressRun
  isFirst: boolean
  prev: StressRun | null
}) {
  const [actions, setActions] = useState<RecommendedAction[]>(run.recommended_actions ?? [])
  const [updating, setUpdating] = useState<string | null>(null)

  const hs       = run.health_score
  const hsColor  = hs >= 7 ? 'text-green-400' : hs >= 5 ? 'text-yellow-400' : 'text-red-400'
  const lossColor = run.total_loss_pct < -20 ? 'text-red-400' : run.total_loss_pct < -10 ? 'text-orange-400' : 'text-yellow-400'

  const diffPct = prev ? run.total_loss_pct - prev.total_loss_pct : null

  const cycleStatus = async (action: RecommendedAction) => {
    const next: RecommendedAction['status'] =
      action.status === 'todo' ? 'done' : action.status === 'done' ? 'dismissed' : 'todo'
    setUpdating(action.id)
    try {
      const updated = await patchAction(run.id, action.id, next)
      setActions(a => a.map(x => x.id === action.id ? updated : x))
    } catch {
      setActions(a => a.map(x => x.id === action.id ? { ...x, status: next } : x)) // optimistic fallback
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className={`rounded-2xl border overflow-hidden
      ${isFirst ? 'border-[#3B82F6]/30 bg-[#3B82F6]/5' : 'border-white/8 bg-white/[0.02]'}`}>
      {/* Run header */}
      <div className='px-5 py-4 border-b border-white/6 flex items-center justify-between'>
        <div className='min-w-0'>
          <p className='text-sm font-medium text-gray-200 truncate'>{run.scenario}</p>
          <p className='text-xs text-gray-600 mt-0.5 flex items-center gap-1'>
            <Clock size={10} />
            {timeAgo(run.created_at)}
            {isFirst && <span className='text-[#3B82F6] font-medium ml-1'>· Latest</span>}
          </p>
        </div>
        <div className='flex items-center gap-4 shrink-0 ml-4'>
          <div className='text-right'>
            <p className='text-xs text-gray-600'>Health</p>
            <p className={`text-sm font-bold tabular-nums ${hsColor}`}>
              {hs.toFixed(1)}/10
            </p>
          </div>
          <div className='text-right'>
            <p className='text-xs text-gray-600'>Stress loss</p>
            <p className={`text-sm font-bold tabular-nums ${lossColor}`}>
              {run.total_loss_pct.toFixed(1)}%
            </p>
          </div>
          {diffPct !== null && (
            <div className='text-right'>
              <p className='text-xs text-gray-600'>vs prior</p>
              <p className={`text-sm font-bold tabular-nums flex items-center gap-0.5
                ${diffPct < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {diffPct > 0 ? '+' : ''}{diffPct.toFixed(1)}%
                <TrendingDown size={11} className={diffPct > 0 ? 'rotate-180' : ''} />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Values row */}
      <div className='px-5 py-3 grid grid-cols-3 gap-4 text-xs border-b border-white/4'>
        <div>
          <p className='text-gray-600 mb-0.5'>Portfolio value</p>
          <p className='text-white font-medium tabular-nums'>{fmt(run.portfolio_value)}</p>
        </div>
        <div>
          <p className='text-gray-600 mb-0.5'>Stressed value</p>
          <p className='text-red-400 font-medium tabular-nums'>{fmt(run.stressed_value)}</p>
        </div>
        <div>
          <p className='text-gray-600 mb-0.5'>Latency</p>
          <p className='text-gray-400 font-medium tabular-nums'>{run.latency_ms}ms</p>
        </div>
      </div>

      {/* Action plan */}
      {actions.length > 0 && (
        <div className='px-5 py-3'>
          <p className='text-[10px] uppercase tracking-wider text-gray-600 mb-2'>Action plan</p>
          <div className='space-y-1.5'>
            {actions.map(a => {
              const Icon = STATUS_ICONS[a.status]
              return (
                <button
                  key={a.id}
                  onClick={() => cycleStatus(a)}
                  disabled={updating === a.id}
                  className='w-full flex items-start gap-2.5 text-left group
                    hover:bg-white/3 rounded-lg px-2 py-1.5 -mx-2 transition-colors'>
                  {updating === a.id
                    ? <span className='w-3.5 h-3.5 mt-0.5 border border-white/30 border-t-white rounded-full animate-spin shrink-0' />
                    : <Icon size={14} className={`shrink-0 mt-0.5 ${STATUS_COLORS[a.status]}`} />}
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2'>
                      <span className={`text-xs font-medium
                        ${a.status === 'dismissed' ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
                        {a.title}
                      </span>
                      <span className='text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded'>
                        {ACTION_LABELS[a.kind]}
                      </span>
                    </div>
                    {a.detail && (
                      <p className='text-xs text-gray-600 leading-relaxed mt-0.5 truncate'>
                        {a.detail}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          <p className='text-[10px] text-gray-700 mt-2'>Click to cycle: to-do → done → dismissed</p>
        </div>
      )}
    </div>
  )
}

export default function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [runs, setRuns]     = useState<StressRun[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    listRuns(id)
      .then(setRuns)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load runs'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>

        <Link href='/portfolios'
          className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
            transition-colors mb-6'>
          <ArrowLeft size={14} /> Portfolios
        </Link>

        <div className='mb-8'>
          <h1 className='text-2xl font-bold tracking-tight mb-1'>Run history</h1>
          <p className='text-sm text-gray-500'>
            Each run shows stress loss vs the previous one. Click any action to update its status.
          </p>
        </div>

        {error && (
          <div className='flex items-center gap-2 bg-red-950/40 border border-red-700/30
            rounded-xl px-4 py-3 mb-6 text-red-300 text-sm'>
            <AlertCircle size={14} className='shrink-0' />
            {error}
          </div>
        )}

        {loading ? (
          <div className='space-y-3'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-28 rounded-2xl bg-white/[0.03] border border-white/6 animate-pulse' />
            ))}
          </div>
        ) : runs.length === 0 ? (
          <div className='text-center py-20 border border-dashed border-white/10 rounded-2xl'>
            <BarChart3 size={22} className='text-gray-600 mx-auto mb-3' />
            <p className='text-gray-500 text-sm mb-4'>No stress runs for this portfolio yet.</p>
            <Link href='/upload' className='text-[#3B82F6] hover:text-[#3B82F6]/80 text-sm transition-colors'>
              Run a stress test →
            </Link>
          </div>
        ) : (
          <div className='space-y-3'>
            {runs.map((run, i) => (
              <RunCard
                key={run.id}
                run={run}
                isFirst={i === 0}
                prev={runs[i + 1] ?? null}
              />
            ))}
          </div>
        )}
    </div>
  )
}
