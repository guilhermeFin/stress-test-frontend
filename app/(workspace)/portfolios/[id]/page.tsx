'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Clock, TrendingDown, CheckCircle2,
  Circle, XCircle, AlertCircle, BarChart3,
  ArrowUpDown, ArrowUp, ArrowDown, RefreshCw,
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

const STATUS_ICONS = { todo: Circle, done: CheckCircle2, dismissed: XCircle }
const STATUS_COLORS = { todo: 'text-gray-500', done: 'text-green-400', dismissed: 'text-gray-600' }

// ── Mock rebalance data (pre-backend) ─────────────────────────────────────────

const MOCK_DRIFT = [
  { asset_class: 'US Large Cap Equity',       target: 40, current: 48, portfolio_value: 3_420_000 },
  { asset_class: 'International Developed',   target: 20, current: 14, portfolio_value: 3_420_000 },
  { asset_class: 'Emerging Markets',          target: 10, current: 8,  portfolio_value: 3_420_000 },
  { asset_class: 'Investment Grade Bonds',    target: 20, current: 22, portfolio_value: 3_420_000 },
  { asset_class: 'Alternatives',              target: 5,  current: 3,  portfolio_value: 3_420_000 },
  { asset_class: 'Cash',                      target: 5,  current: 5,  portfolio_value: 3_420_000 },
]

const MOCK_TRADES = [
  { id: 1, account: 'IRA',     action: 'Sell' as const, security: 'VTI',  name: 'Vanguard Total Market',    shares: 45,  est_proceeds: 18_450, reason: 'Trim US equity overweight',     tax_impact: 'None (tax-deferred)' },
  { id: 2, account: 'IRA',     action: 'Buy'  as const, security: 'VXUS', name: 'Vanguard Total Intl',      shares: 62,  est_proceeds: 18_044, reason: 'Bring international to target',  tax_impact: 'None (tax-deferred)' },
  { id: 3, account: 'Roth',    action: 'Buy'  as const, security: 'IEMG', name: 'iShares Core MSCI EM',     shares: 18,  est_proceeds: 1_008,  reason: 'Bring emerging markets to target', tax_impact: 'None (Roth)' },
  { id: 4, account: 'Taxable', action: 'Sell' as const, security: 'SPY',  name: 'SPDR S&P 500 ETF',         shares: 8,   est_proceeds: 4_384,  reason: 'Reduce US equity — consider IVV replacement for TLH', tax_impact: 'LT gain ~$890' },
  { id: 5, account: 'Taxable', action: 'Buy'  as const, security: 'VNQI', name: 'Vanguard Intl RE',         shares: 30,  est_proceeds: 1_920,  reason: 'Alts underweight — low correlation, income', tax_impact: 'None (buy)' },
]

// ── Rebalance panel ───────────────────────────────────────────────────────────

function RebalancePanel() {
  const BAND = 3 // rebalance threshold %

  return (
    <div className='space-y-6'>

      {/* Drift table */}
      <section>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-sm font-semibold flex items-center gap-2'>
            <ArrowUpDown size={14} className='text-[#3B82F6]' /> Allocation drift
          </h2>
          <span className='text-[10px] text-gray-600'>Rebalance band ±{BAND}%</span>
        </div>

        <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden'>
          <div className='grid grid-cols-[1fr_60px_60px_60px_80px] gap-0 px-4 py-2.5
            text-[10px] font-semibold uppercase tracking-wider text-gray-600
            border-b border-white/[0.06]'>
            <span>Asset class</span>
            <span className='text-right'>Target</span>
            <span className='text-right'>Current</span>
            <span className='text-right'>Drift</span>
            <span className='text-right'>Action</span>
          </div>

          {MOCK_DRIFT.map((row, i) => {
            const drift = row.current - row.target
            const needsAction = Math.abs(drift) >= BAND
            const dollarDrift = (drift / 100) * row.portfolio_value

            return (
              <div key={row.asset_class}
                className={`grid grid-cols-[1fr_60px_60px_60px_80px] gap-0 px-4 py-3
                  text-sm items-center
                  ${i > 0 ? 'border-t border-white/[0.04]' : ''}
                  ${needsAction ? 'bg-amber-400/[0.03]' : ''}`}>
                <span className='text-gray-200 text-xs font-medium'>{row.asset_class}</span>
                <span className='text-right text-gray-400 tabular-nums text-xs'>{row.target}%</span>
                <span className='text-right text-white tabular-nums text-xs font-medium'>{row.current}%</span>
                <span className={`text-right tabular-nums text-xs font-semibold flex items-center justify-end gap-0.5
                  ${drift > BAND ? 'text-red-400' : drift < -BAND ? 'text-blue-400' : 'text-gray-500'}`}>
                  {drift > 0
                    ? <ArrowUp size={10} />
                    : drift < 0
                    ? <ArrowDown size={10} />
                    : null}
                  {drift > 0 ? '+' : ''}{drift}%
                </span>
                <span className='text-right text-[10px]'>
                  {needsAction ? (
                    <span className={`font-semibold ${drift > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                      {drift > 0 ? 'Trim' : 'Add'} {fmt(Math.abs(dollarDrift))}
                    </span>
                  ) : (
                    <span className='text-gray-600'>Within band</span>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Trade list */}
      <section>
        <h2 className='text-sm font-semibold mb-3 flex items-center gap-2'>
          <RefreshCw size={14} className='text-[#3B82F6]' /> Tax-aware trade list
        </h2>

        <div className='space-y-2'>
          {MOCK_TRADES.map(t => (
            <div key={t.id}
              className='bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3
                flex items-start gap-4'>
              <span className={`shrink-0 mt-0.5 text-[10px] font-bold px-2 py-1 rounded-lg
                border leading-none
                ${t.action === 'Sell'
                  ? 'text-red-400 bg-red-400/10 border-red-400/20'
                  : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'}`}>
                {t.action}
              </span>

              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-0.5 flex-wrap'>
                  <span className='text-sm font-semibold text-white'>{t.security}</span>
                  <span className='text-xs text-gray-500'>{t.name}</span>
                  <span className='text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded'>
                    {t.account}
                  </span>
                </div>
                <p className='text-xs text-gray-400'>{t.reason}</p>
              </div>

              <div className='text-right shrink-0'>
                <p className='text-sm font-semibold text-white tabular-nums'>{fmt(t.est_proceeds)}</p>
                <p className={`text-[10px] mt-0.5 ${t.tax_impact.startsWith('None') ? 'text-gray-600' : 'text-amber-400'}`}>
                  {t.tax_impact}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary bar */}
        <div className='mt-4 bg-[#3B82F6]/5 border border-[#3B82F6]/15 rounded-xl px-4 py-3
          flex flex-wrap gap-4 text-xs'>
          <div>
            <p className='text-gray-500 mb-0.5'>Trades</p>
            <p className='text-white font-semibold'>{MOCK_TRADES.length} orders</p>
          </div>
          <div>
            <p className='text-gray-500 mb-0.5'>Realized gains (taxable)</p>
            <p className='text-amber-400 font-semibold'>~$890 LT</p>
          </div>
          <div>
            <p className='text-gray-500 mb-0.5'>Portfolio impact</p>
            <p className='text-emerald-400 font-semibold'>Minimal — in-kind swaps</p>
          </div>
          <div className='ml-auto text-right'>
            <p className='text-[10px] text-gray-600 leading-relaxed max-w-xs'>
              IRA/Roth trades first to avoid tax drag. Taxable trades kept minimal — consider
              TLH opportunities before executing.
            </p>
          </div>
        </div>

        <p className='text-[10px] text-gray-700 mt-3'>
          AI-assisted — verify before client delivery · Skill: portfolio-rebalance (wealth-management)
        </p>
      </section>
    </div>
  )
}

// ── Run card ──────────────────────────────────────────────────────────────────

function RunCard({ run, isFirst, prev }: { run: StressRun; isFirst: boolean; prev: StressRun | null }) {
  const [actions, setActions]   = useState<RecommendedAction[]>(run.recommended_actions ?? [])
  const [updating, setUpdating] = useState<string | null>(null)

  const hs        = run.health_score
  const hsColor   = hs >= 7 ? 'text-green-400' : hs >= 5 ? 'text-yellow-400' : 'text-red-400'
  const lossColor = run.total_loss_pct < -20 ? 'text-red-400' : run.total_loss_pct < -10 ? 'text-orange-400' : 'text-yellow-400'
  const diffPct   = prev ? run.total_loss_pct - prev.total_loss_pct : null

  const cycleStatus = async (action: RecommendedAction) => {
    const next: RecommendedAction['status'] =
      action.status === 'todo' ? 'done' : action.status === 'done' ? 'dismissed' : 'todo'
    setUpdating(action.id)
    try {
      const updated = await patchAction(run.id, action.id, next)
      setActions(a => a.map(x => x.id === action.id ? updated : x))
    } catch {
      setActions(a => a.map(x => x.id === action.id ? { ...x, status: next } : x))
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className={`rounded-2xl border overflow-hidden
      ${isFirst ? 'border-[#3B82F6]/30 bg-[#3B82F6]/5' : 'border-white/[0.08] bg-white/[0.02]'}`}>

      <div className='px-5 py-4 border-b border-white/[0.06] flex items-center justify-between'>
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
            <p className={`text-sm font-bold tabular-nums ${hsColor}`}>{hs.toFixed(1)}/10</p>
          </div>
          <div className='text-right'>
            <p className='text-xs text-gray-600'>Stress loss</p>
            <p className={`text-sm font-bold tabular-nums ${lossColor}`}>{run.total_loss_pct.toFixed(1)}%</p>
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

      <div className='px-5 py-3 grid grid-cols-3 gap-4 text-xs border-b border-white/[0.04]'>
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

      {actions.length > 0 && (
        <div className='px-5 py-3'>
          <p className='text-[10px] uppercase tracking-wider text-gray-600 mb-2'>Action plan</p>
          <div className='space-y-1.5'>
            {actions.map(a => {
              const Icon = STATUS_ICONS[a.status]
              return (
                <button key={a.id} onClick={() => cycleStatus(a)} disabled={updating === a.id}
                  className='w-full flex items-start gap-2.5 text-left
                    hover:bg-white/[0.03] rounded-lg px-2 py-1.5 -mx-2 transition-colors'>
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
                      <p className='text-xs text-gray-600 leading-relaxed mt-0.5 truncate'>{a.detail}</p>
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }              = use(params)
  const [runs, setRuns]     = useState<StressRun[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const [tab, setTab]       = useState<'runs' | 'rebalance'>('runs')

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

      <div className='flex items-start justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight mb-1'>Portfolio detail</h1>
          <p className='text-sm text-gray-500'>Stress run history and rebalance recommendations.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 mb-6 w-fit'>
        {([['runs', 'Run history'], ['rebalance', 'Rebalance']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${tab === key ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'rebalance' && <RebalancePanel />}

      {tab === 'runs' && (
        <>
          {error && (
            <div className='flex items-center gap-2 bg-red-950/40 border border-red-700/30
              rounded-xl px-4 py-3 mb-6 text-red-300 text-sm'>
              <AlertCircle size={14} className='shrink-0' /> {error}
            </div>
          )}

          {loading ? (
            <div className='space-y-3'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='h-28 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse' />
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
                <RunCard key={run.id} run={run} isFirst={i === 0} prev={runs[i + 1] ?? null} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
