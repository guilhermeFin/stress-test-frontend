'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Target, Trash2, Play, AlertCircle,
  TrendingUp, Shield, Clock,
} from 'lucide-react'
import {
  type Goal, type GoalType, type MonteCarloResult,
  GOAL_TYPE_LABELS, runClientMonteCarlo,
} from '@/lib/planning'

const GOAL_TYPES: GoalType[] = ['retirement', 'college', 'home', 'legacy', 'other']

const GOAL_COLORS: Record<GoalType, string> = {
  retirement: '#3B82F6',
  college:    '#8B5CF6',
  home:       '#10B981',
  legacy:     '#F59E08',
  other:      '#6B7280',
}

function fmt(n: number) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

function fmtPct(n: number) { return (n * 100).toFixed(1) + '%' }

function yearsTo(date: string) {
  return Math.max(0, (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 365))
}

// ── Monte Carlo chart (simple SVG area bands) ─────────────────────────────────

function MonteCarloChart({ result, target }: { result: MonteCarloResult; target: number }) {
  const W = 520
  const H = 180
  const PAD = { top: 12, right: 16, bottom: 28, left: 56 }

  const bands = result.percentile_bands
  if (bands.length === 0) return null

  const maxY = Math.max(result.p90_outcome, target) * 1.05
  const scaleX = (yr: number) => PAD.left + ((yr - 1) / Math.max(1, bands.length - 1)) * (W - PAD.left - PAD.right)
  const scaleY = (v: number) => H - PAD.bottom - (v / maxY) * (H - PAD.top - PAD.bottom)

  const path = (getter: (b: typeof bands[0]) => number) =>
    bands.map((b, i) => `${i === 0 ? 'M' : 'L'}${scaleX(b.year).toFixed(1)},${scaleY(getter(b)).toFixed(1)}`).join(' ')

  const area = (top: (b: typeof bands[0]) => number, bot: (b: typeof bands[0]) => number) =>
    `${path(top)} L${scaleX(bands[bands.length - 1].year).toFixed(1)},${scaleY(bot(bands[bands.length - 1])).toFixed(1)} ` +
    bands.slice().reverse().map((b, i) => `${i === 0 ? 'L' : 'L'}${scaleX(b.year).toFixed(1)},${scaleY(bot(b)).toFixed(1)}`).join(' ') + ' Z'

  const targetY = scaleY(target)

  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    v: maxY * f,
    y: H - PAD.bottom - f * (H - PAD.top - PAD.bottom),
  }))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className='w-full'>
      {/* Y grid + labels */}
      {ticks.map(({ v, y }) => (
        <g key={v}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke='#ffffff08' />
          <text x={PAD.left - 6} y={y + 4} textAnchor='end' fontSize={9} fill='#6b7280'>{fmt(v)}</text>
        </g>
      ))}

      {/* X labels */}
      {bands.filter((_, i) => i % 2 === 0).map(b => (
        <text key={b.year} x={scaleX(b.year)} y={H - 6} textAnchor='middle' fontSize={9} fill='#6b7280'>
          Yr {b.year}
        </text>
      ))}

      {/* P10–P90 band */}
      <path d={area(b => b.p90, b => b.p10)} fill='#3B82F6' opacity='0.08' />
      {/* P25–P75 band */}
      <path d={area(b => b.p75, b => b.p25)} fill='#3B82F6' opacity='0.14' />
      {/* Median */}
      <path d={path(b => b.p50)} stroke='#3B82F6' strokeWidth='1.5' fill='none' />

      {/* Target line */}
      {targetY > PAD.top && targetY < H - PAD.bottom && (
        <>
          <line x1={PAD.left} x2={W - PAD.right} y1={targetY} y2={targetY}
            stroke='#F59E08' strokeWidth='1' strokeDasharray='4 3' />
          <text x={W - PAD.right + 4} y={targetY + 4} fontSize={9} fill='#F59E08'>Target</text>
        </>
      )}
    </svg>
  )
}

// ── Goal form ────────────────────────────────────────────────────────────────

const BLANK: Omit<Goal, 'id' | 'household_id' | 'created_at' | 'funded_ratio' | 'success_rate'> = {
  type:                 'retirement',
  label:                '',
  target_amount:        2_000_000,
  target_date:          new Date(Date.now() + 15 * 365 * 86400 * 1000).toISOString().slice(0, 10),
  current_savings:      500_000,
  monthly_contribution: 5_000,
  expected_return:      0.07,
}

function GoalForm({ onAdd }: { onAdd: (g: Goal) => void }) {
  const [form, setForm] = useState({ ...BLANK })
  const [open, setOpen] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const v = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    setForm(f => ({ ...f, [k]: v }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const goal: Goal = {
      ...form,
      id: crypto.randomUUID(),
      household_id: 'demo',
      created_at: new Date().toISOString(),
    }
    onAdd(goal)
    setForm({ ...BLANK })
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className='w-full flex items-center justify-center gap-2 border border-dashed
          border-white/10 hover:border-white/20 rounded-2xl py-4 text-sm text-gray-500
          hover:text-gray-300 transition-colors'
      >
        <Plus size={14} /> Add goal
      </button>
    )
  }

  return (
    <form onSubmit={submit}
      className='bg-white/[0.02] border border-[#3B82F6]/20 rounded-2xl p-5'>
      <h3 className='text-sm font-semibold mb-4'>New goal</h3>
      <div className='grid grid-cols-2 gap-3 mb-3'>

        <div className='col-span-2'>
          <label className='text-xs text-gray-500 mb-1 block'>Goal type</label>
          <select value={form.type} onChange={set('type')}
            className='w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2
              text-sm text-white focus:outline-none focus:border-white/20'>
            {GOAL_TYPES.map(t => (
              <option key={t} value={t}>{GOAL_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        <div className='col-span-2'>
          <label className='text-xs text-gray-500 mb-1 block'>Label</label>
          <input value={form.label} onChange={set('label')} placeholder='e.g. Retire at 65'
            required
            className='w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2
              text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20' />
        </div>

        {[
          { key: 'target_amount',        label: 'Target amount ($)',         step: 10000  },
          { key: 'current_savings',      label: 'Current savings ($)',       step: 1000   },
          { key: 'monthly_contribution', label: 'Monthly contribution ($)',  step: 100    },
          { key: 'expected_return',      label: 'Expected return (e.g. 0.07)', step: 0.005 },
        ].map(({ key, label, step }) => (
          <div key={key}>
            <label className='text-xs text-gray-500 mb-1 block'>{label}</label>
            <input
              type='number' step={step} min={0}
              value={(form as Record<string, number | string>)[key] as number}
              onChange={set(key as keyof typeof form)}
              className='w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2
                text-sm text-white focus:outline-none focus:border-white/20'
            />
          </div>
        ))}

        <div>
          <label className='text-xs text-gray-500 mb-1 block'>Target date</label>
          <input type='date' value={form.target_date} onChange={set('target_date')}
            className='w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2
              text-sm text-white focus:outline-none focus:border-white/20' />
        </div>
      </div>

      <div className='flex gap-2'>
        <button type='submit'
          className='flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold
            rounded-lg py-2 transition-colors'>
          Add goal
        </button>
        <button type='button' onClick={() => setOpen(false)}
          className='px-4 text-sm text-gray-500 hover:text-white border border-white/10
            hover:border-white/20 rounded-lg transition-colors'>
          Cancel
        </button>
      </div>
    </form>
  )
}

// ── Goal card ────────────────────────────────────────────────────────────────

function GoalCard({ goal, onDelete }: { goal: Goal; onDelete: () => void }) {
  const [result, setResult] = useState<MonteCarloResult | null>(null)
  const [running, setRunning] = useState(false)

  const run = useCallback(() => {
    setRunning(true)
    setTimeout(() => {
      setResult(runClientMonteCarlo(goal, 1000))
      setRunning(false)
    }, 400)
  }, [goal])

  const color = GOAL_COLORS[goal.type]
  const yrs   = yearsTo(goal.target_date)

  return (
    <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl overflow-hidden'>
      {/* Card header */}
      <div className='px-5 py-4 border-b border-white/[0.04] flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-xl flex items-center justify-center'
            style={{ background: `${color}18` }}>
            <Target size={15} style={{ color }} />
          </div>
          <div>
            <p className='text-sm font-semibold'>{goal.label || GOAL_TYPE_LABELS[goal.type]}</p>
            <p className='text-[10px] text-gray-500 mt-0.5'>
              {GOAL_TYPE_LABELS[goal.type]} · {yrs.toFixed(1)} yrs to target
            </p>
          </div>
        </div>
        <button onClick={onDelete} className='text-gray-600 hover:text-red-400 transition-colors'>
          <Trash2 size={13} />
        </button>
      </div>

      {/* Stats row */}
      <div className='grid grid-cols-3 divide-x divide-white/[0.04] border-b border-white/[0.04]'>
        {[
          { label: 'Target', value: fmt(goal.target_amount), icon: TrendingUp },
          { label: 'Current', value: fmt(goal.current_savings), icon: Shield },
          { label: 'Monthly', value: fmt(goal.monthly_contribution) + '/mo', icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className='px-4 py-3'>
            <p className='text-[10px] text-gray-600 mb-0.5'>{label}</p>
            <p className='text-sm font-semibold tabular-nums'>{value}</p>
          </div>
        ))}
      </div>

      {/* Monte Carlo section */}
      <div className='px-5 py-4'>
        {!result ? (
          <button
            onClick={run}
            disabled={running}
            className='w-full flex items-center justify-center gap-2 border border-dashed
              border-white/10 hover:border-[#3B82F6]/40 rounded-xl py-3 text-sm
              text-gray-500 hover:text-[#3B82F6] transition-colors'
          >
            {running
              ? <><span className='w-3.5 h-3.5 border border-white/20 border-t-[#3B82F6] rounded-full animate-spin' /> Running 1,000 paths…</>
              : <><Play size={13} /> Run Monte Carlo (1,000 paths)</>}
          </button>
        ) : (
          <div>
            {/* Result cards */}
            <div className='grid grid-cols-3 gap-2 mb-4'>
              {[
                {
                  label: 'Success rate',
                  value: fmtPct(result.success_rate),
                  color: result.success_rate >= 0.85 ? 'text-emerald-400' : result.success_rate >= 0.7 ? 'text-amber-400' : 'text-red-400',
                },
                {
                  label: 'Median outcome',
                  value: fmt(result.median_outcome),
                  color: 'text-white',
                },
                {
                  label: 'Funded ratio',
                  value: fmtPct(result.funded_ratio),
                  color: result.funded_ratio >= 1 ? 'text-emerald-400' : 'text-amber-400',
                },
              ].map(({ label, value, color: c }) => (
                <div key={label} className='bg-white/[0.03] rounded-xl p-3 text-center'>
                  <p className='text-[10px] text-gray-500 mb-1'>{label}</p>
                  <p className={`text-sm font-bold tabular-nums ${c}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className='bg-white/[0.02] rounded-xl px-3 pt-3 pb-1 mb-3'>
              <MonteCarloChart result={result} target={goal.target_amount} />
            </div>

            <div className='flex items-center justify-between'>
              <p className='text-[10px] text-gray-600'>
                P10 {fmt(result.p10_outcome)} · Median {fmt(result.median_outcome)} · P90 {fmt(result.p90_outcome)}
              </p>
              <button onClick={run}
                className='text-[10px] text-[#3B82F6] hover:underline flex items-center gap-1'>
                <Play size={9} /> Re-run
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI badge */}
      <div className='px-5 pb-3'>
        <div className='flex items-center gap-1.5 text-[10px] text-amber-300/70'>
          <AlertCircle size={10} />
          AI-assisted — verify before client delivery.
        </div>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

const DEMO_GOALS: Goal[] = [
  {
    id: 'g1',
    household_id: 'demo',
    type: 'retirement',
    label: 'Retire at 65',
    target_amount: 4_000_000,
    target_date: new Date(Date.now() + 18 * 365 * 86400 * 1000).toISOString().slice(0, 10),
    current_savings: 1_200_000,
    monthly_contribution: 8_000,
    expected_return: 0.07,
    created_at: new Date().toISOString(),
  },
  {
    id: 'g2',
    household_id: 'demo',
    type: 'college',
    label: 'Emma college fund',
    target_amount: 400_000,
    target_date: new Date(Date.now() + 6 * 365 * 86400 * 1000).toISOString().slice(0, 10),
    current_savings: 220_000,
    monthly_contribution: 2_000,
    expected_return: 0.06,
    created_at: new Date().toISOString(),
  },
]

export default function GoalPlanningPage() {
  const [goals, setGoals] = useState<Goal[]>(DEMO_GOALS)

  const addGoal = (g: Goal) => setGoals(gs => [g, ...gs])
  const deleteGoal = (id: string) => setGoals(gs => gs.filter(g => g.id !== id))

  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>

      <Link href='/planning'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Planning
      </Link>

      <div className='flex items-start justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight mb-1'>Goal Planning</h1>
          <p className='text-sm text-gray-500'>
            Model financial goals and run 1,000-path Monte Carlo projections to show
            funded ratio and ruin probability.
          </p>
        </div>
      </div>

      <div className='space-y-4'>
        {goals.map(g => (
          <GoalCard key={g.id} goal={g} onDelete={() => deleteGoal(g.id)} />
        ))}
        <GoalForm onAdd={addGoal} />
      </div>
    </div>
  )
}
