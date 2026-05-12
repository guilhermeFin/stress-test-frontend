'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Users, Target, BarChart3, Zap, TrendingUp, TrendingDown,
  ChevronRight, Shield, Calendar, AlertTriangle, BookOpen,
  CheckCircle2, Clock, MessageSquare, ArrowUpDown,
} from 'lucide-react'
import { getHousehold, type Household } from '@/lib/households'

function fmt(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// ── MOCK for the household (pre-backend) ─────────────────────────────────────

function mockHousehold(id: string): Household {
  return {
    id,
    firm_id: 'f1',
    name: 'Harrison Family',
    risk_profile: 'growth',
    aum: 3_420_000,
    portfolio_count: 2,
    members: [
      { id: 'm1', name: 'James Harrison', role: 'primary', dob: '1968-04-12' },
      { id: 'm2', name: 'Susan Harrison', role: 'spouse',  dob: '1971-07-30' },
      { id: 'm3', name: 'Emma Harrison',  role: 'dependent', dob: '2003-11-05' },
    ],
    goals: [
      { id: 'g1', type: 'retirement', label: 'Retirement by 62', target_amount: 5_000_000, target_date: '2030-04-01', funded_ratio: 0.68 },
      { id: 'g2', type: 'college',    label: 'Emma college fund', target_amount: 400_000,   target_date: '2025-09-01', funded_ratio: 0.91 },
    ],
    created_at: '2024-03-10T00:00:00Z',
    last_activity_at: new Date(Date.now() - 18 * 60000).toISOString(),
    ytd_return: 0.084,
    alert_count: 0,
  }
}

// ── Meeting prep data (mock, pre-backend) ─────────────────────────────────────

const PERF_TABLE = [
  { period: 'QTD',   portfolio: 2.1,  benchmark: 1.8,  alpha: 0.3  },
  { period: 'YTD',   portfolio: 8.4,  benchmark: 7.9,  alpha: 0.5  },
  { period: '1-Year', portfolio: 14.2, benchmark: 12.6, alpha: 1.6  },
  { period: '3-Year', portfolio: 9.8,  benchmark: 9.1,  alpha: 0.7  },
]

const DRIFT_FLAGS = [
  { asset_class: 'US Large Cap',     target: 40, current: 48, flag: true  },
  { asset_class: 'International',    target: 20, current: 14, flag: true  },
  { asset_class: 'Fixed Income',     target: 20, current: 22, flag: false },
  { asset_class: 'Emerging Markets', target: 10, current: 8,  flag: false },
  { asset_class: 'Alternatives',     target: 5,  current: 3,  flag: true  },
  { asset_class: 'Cash',             target: 5,  current: 5,  flag: false },
]

const TALKING_POINTS = [
  {
    topic: 'Portfolio performance',
    point: 'Your portfolio is up 8.4% YTD — ahead of the benchmark by half a point. The standout contributor was US equity, which benefited from the tech rally in Q1.',
    followup: 'Any sectors or names you\'d like me to walk you through?',
  },
  {
    topic: 'Allocation drift',
    point: 'US equity has drifted 8 points above target — that\'s our main action item today. International is the mirror image, running light. We\'ll trim one to fund the other, preferably inside the IRA to keep it tax-free.',
    followup: 'Any concerns about reducing US exposure at this point in the cycle?',
  },
  {
    topic: 'Emma\'s college fund',
    point: 'The 529 is 91% funded with four months to the start date — essentially fully there. We can shift it to a more conservative allocation now to lock in gains.',
    followup: 'Have you confirmed the school\'s billing schedule? Some bill in July.',
  },
  {
    topic: 'Retirement goal',
    point: 'At 68% funded with James at 57, you\'re on a strong trajectory — but we have room to push the savings rate slightly to close the gap. A Roth conversion this year while you\'re still in the 24% bracket could also help.',
    followup: 'How does James feel about the 62 retirement target — is that still the plan?',
  },
]

const ACTION_ITEMS = [
  { text: 'Execute rebalance — trim SPY, add VXUS (IRA first)', owner: 'Advisor', due: 'This week' },
  { text: 'Shift Emma\'s 529 to conservative allocation', owner: 'Advisor', due: 'Before July billing' },
  { text: 'Model Roth conversion — 24% bracket headroom', owner: 'Advisor', due: 'Before year-end' },
  { text: 'Confirm beneficiary designations are current', owner: 'James + Susan', due: 'Next meeting' },
]

// ── Meeting prep panel ────────────────────────────────────────────────────────

function MeetingPrepPanel({ h }: { h: Household }) {
  return (
    <div className='space-y-6'>

      {/* Performance vs benchmark */}
      <section>
        <h2 className='text-sm font-semibold mb-3 flex items-center gap-2'>
          <BarChart3 size={14} className='text-[#3B82F6]' /> Performance vs benchmark
        </h2>
        <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden'>
          <div className='grid grid-cols-4 px-4 py-2.5 text-[10px] font-semibold uppercase
            tracking-wider text-gray-600 border-b border-white/[0.06]'>
            <span>Period</span>
            <span className='text-right'>Portfolio</span>
            <span className='text-right'>Benchmark</span>
            <span className='text-right'>Alpha</span>
          </div>
          {PERF_TABLE.map((row, i) => (
            <div key={row.period}
              className={`grid grid-cols-4 px-4 py-3 text-sm items-center
                ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}>
              <span className='text-xs text-gray-400'>{row.period}</span>
              <span className={`text-right text-sm font-semibold tabular-nums
                ${row.portfolio >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {row.portfolio >= 0 ? '+' : ''}{row.portfolio.toFixed(1)}%
              </span>
              <span className='text-right text-xs text-gray-400 tabular-nums'>
                {row.benchmark >= 0 ? '+' : ''}{row.benchmark.toFixed(1)}%
              </span>
              <span className={`text-right text-xs font-semibold tabular-nums
                ${row.alpha >= 0 ? 'text-[#3B82F6]' : 'text-red-400'}`}>
                {row.alpha >= 0 ? '+' : ''}{row.alpha.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
        <p className='text-[10px] text-gray-600 mt-1.5'>Benchmark: 60/40 (S&P 500 + AGG)</p>
      </section>

      {/* Allocation drift */}
      <section>
        <h2 className='text-sm font-semibold mb-3 flex items-center gap-2'>
          <ArrowUpDown size={14} className='text-[#3B82F6]' /> Allocation check
          <span className='text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20
            px-2 py-0.5 rounded-full font-normal'>
            {DRIFT_FLAGS.filter(d => d.flag).length} flags
          </span>
        </h2>
        <div className='space-y-2'>
          {DRIFT_FLAGS.map(row => {
            const drift = row.current - row.target
            return (
              <div key={row.asset_class}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs
                  ${row.flag
                    ? 'bg-amber-400/[0.03] border-amber-400/15'
                    : 'bg-white/[0.02] border-white/[0.06]'}`}>
                <span className='flex-1 text-gray-300'>{row.asset_class}</span>
                <span className='text-gray-500 tabular-nums w-14 text-right'>target {row.target}%</span>
                <span className='text-white font-medium tabular-nums w-14 text-right'>now {row.current}%</span>
                <span className={`font-semibold tabular-nums w-12 text-right
                  ${drift > 3 ? 'text-red-400' : drift < -3 ? 'text-blue-400' : 'text-gray-500'}`}>
                  {drift > 0 ? '+' : ''}{drift}%
                </span>
                {row.flag
                  ? <AlertTriangle size={11} className='text-amber-400 shrink-0' />
                  : <CheckCircle2 size={11} className='text-gray-700 shrink-0' />}
              </div>
            )
          })}
        </div>
      </section>

      {/* Talking points */}
      <section>
        <h2 className='text-sm font-semibold mb-3 flex items-center gap-2'>
          <MessageSquare size={14} className='text-[#3B82F6]' /> Talking points
        </h2>
        <div className='space-y-3'>
          {TALKING_POINTS.map((tp, i) => (
            <div key={i} className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4'>
              <p className='text-[10px] font-bold uppercase tracking-wider text-[#3B82F6] mb-2'>
                {tp.topic}
              </p>
              <p className='text-sm text-gray-200 leading-relaxed mb-2'>{tp.point}</p>
              <p className='text-xs text-gray-500 italic'>
                Ask: "{tp.followup}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Action items */}
      <section>
        <h2 className='text-sm font-semibold mb-3 flex items-center gap-2'>
          <CheckCircle2 size={14} className='text-[#3B82F6]' /> Action items for this meeting
        </h2>
        <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden'>
          {ACTION_ITEMS.map((a, i) => (
            <div key={i}
              className={`flex items-start gap-3 px-4 py-3 text-sm
                ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}>
              <div className='w-1.5 h-1.5 rounded-full bg-[#3B82F6] shrink-0 mt-2' />
              <p className='flex-1 text-gray-200 text-xs leading-relaxed'>{a.text}</p>
              <div className='text-right shrink-0 space-y-0.5'>
                <p className='text-[10px] text-gray-500'>{a.owner}</p>
                <p className='text-[10px] text-gray-600 flex items-center gap-1 justify-end'>
                  <Clock size={9} /> {a.due}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className='text-[10px] text-gray-700 mt-3'>
          AI-assisted — verify before client delivery · Skill: client-review (wealth-management)
        </p>
      </section>
    </div>
  )
}

// ── Styling helpers ───────────────────────────────────────────────────────────

const RISK_COLOR: Record<string, string> = {
  conservative: 'text-blue-400 bg-blue-400/10',
  moderate:     'text-emerald-400 bg-emerald-400/10',
  growth:       'text-amber-400 bg-amber-400/10',
  aggressive:   'text-red-400 bg-red-400/10',
}

const ROLE_LABEL: Record<string, string> = {
  primary:     'Primary',
  spouse:      'Spouse',
  dependent:   'Dependent',
  beneficiary: 'Beneficiary',
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HouseholdDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params)
  const [household, setHousehold] = useState<Household | null>(null)
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState<'overview' | 'portfolios' | 'goals' | 'meeting'>('overview')

  useEffect(() => {
    getHousehold(id)
      .then(setHousehold)
      .catch(() => setHousehold(mockHousehold(id)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className='max-w-5xl mx-auto px-6 py-10'>
        <div className='h-8 w-48 bg-white/5 rounded-lg animate-pulse mb-4' />
        <div className='h-40 bg-white/[0.02] border border-white/[0.06] rounded-2xl animate-pulse' />
      </div>
    )
  }

  const h = household!

  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>

      <Link href='/households'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Clients
      </Link>

      {/* Hero card */}
      <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 mb-6'>
        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
          <div className='flex items-start gap-4'>
            <div className='w-14 h-14 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center shrink-0'>
              <Users size={22} className='text-[#3B82F6]' />
            </div>
            <div>
              <div className='flex items-center gap-2 mb-1 flex-wrap'>
                <h1 className='text-xl font-bold'>{h.name}</h1>
                {h.alert_count != null && h.alert_count > 0 && (
                  <span className='flex items-center gap-1 text-[10px] font-bold text-amber-400
                    bg-amber-400/10 px-2 py-1 rounded-full'>
                    <AlertTriangle size={9} /> {h.alert_count} alert{h.alert_count !== 1 ? 's' : ''}
                  </span>
                )}
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full capitalize
                  ${RISK_COLOR[h.risk_profile] ?? 'text-gray-400 bg-white/5'}`}>
                  {h.risk_profile}
                </span>
              </div>
              <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500'>
                <span>{h.members.length} member{h.members.length !== 1 ? 's' : ''}</span>
                <span>{h.portfolio_count} portfolio{h.portfolio_count !== 1 ? 's' : ''}</span>
                <span>Client since {fmtDate(h.created_at)}</span>
              </div>
            </div>
          </div>

          <div className='text-right sm:text-left'>
            <p className='text-2xl font-bold tracking-tight'>{fmt(h.aum ?? 0)}</p>
            <div className='flex items-center gap-1 text-sm mt-1 sm:justify-start justify-end'>
              {h.ytd_return != null && (
                <>
                  {h.ytd_return >= 0
                    ? <TrendingUp size={13} className='text-emerald-400' />
                    : <TrendingDown size={13} className='text-red-400' />}
                  <span className={h.ytd_return >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {h.ytd_return >= 0 ? '+' : ''}{(h.ytd_return * 100).toFixed(1)}%
                  </span>
                  <span className='text-gray-500 text-xs'>YTD</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className='flex flex-wrap gap-2 mt-5 pt-5 border-t border-white/[0.05]'>
          <Link href='/'
            className='flex items-center gap-1.5 text-xs font-semibold text-white
              bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg px-3 py-1.5 transition-colors'>
            <Zap size={12} /> New stress test
          </Link>
          <button onClick={() => setTab('meeting')}
            className='flex items-center gap-1.5 text-xs font-semibold text-emerald-400
              border border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20
              rounded-lg px-3 py-1.5 transition-colors'>
            <BookOpen size={12} /> Prep meeting
          </button>
          <button className='flex items-center gap-1.5 text-xs text-gray-400 hover:text-white
            border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-colors'>
            <BarChart3 size={12} /> View all runs
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 mb-6 w-fit'>
        {([
          ['overview',  'Overview'],
          ['portfolios','Portfolios'],
          ['goals',     'Goals'],
          ['meeting',   'Meeting prep'],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${tab === key ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            {label}
            {key === 'meeting' && (
              <span className='ml-1.5 text-[9px] font-bold text-emerald-400
                bg-emerald-400/10 px-1.5 py-0.5 rounded-full'>NEW</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === 'overview' && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <section className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5'>
            <h2 className='text-sm font-semibold mb-4 flex items-center gap-2'>
              <Users size={14} className='text-[#3B82F6]' /> Household members
            </h2>
            <div className='space-y-3'>
              {h.members.map(m => (
                <div key={m.id} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-white/5 flex items-center justify-center
                      text-xs font-bold text-gray-300'>
                      {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className='text-sm font-medium'>{m.name}</p>
                      {m.dob && (
                        <p className='text-xs text-gray-600'>
                          b. {new Date(m.dob).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className='text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full'>
                    {ROLE_LABEL[m.role] ?? m.role}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5'>
            <h2 className='text-sm font-semibold mb-4 flex items-center gap-2'>
              <Target size={14} className='text-[#3B82F6]' /> Financial goals
            </h2>
            {h.goals.length === 0 ? (
              <p className='text-xs text-gray-600'>No goals defined yet.</p>
            ) : (
              <div className='space-y-4'>
                {h.goals.map(g => (
                  <div key={g.id}>
                    <div className='flex items-center justify-between mb-1.5'>
                      <p className='text-sm font-medium'>{g.label}</p>
                      <p className='text-xs text-gray-400'>{fmt(g.target_amount)}</p>
                    </div>
                    <div className='h-1.5 bg-white/5 rounded-full overflow-hidden'>
                      <div
                        className={`h-full rounded-full transition-all ${
                          (g.funded_ratio ?? 0) >= 0.8 ? 'bg-emerald-500' :
                          (g.funded_ratio ?? 0) >= 0.5 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (g.funded_ratio ?? 0) * 100)}%` }}
                      />
                    </div>
                    <div className='flex items-center justify-between mt-1'>
                      <p className='text-[10px] text-gray-600 flex items-center gap-1'>
                        <Calendar size={9} /> Target {fmtDate(g.target_date)}
                      </p>
                      <p className='text-[10px] font-semibold text-gray-400'>
                        {Math.round((g.funded_ratio ?? 0) * 100)}% funded
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Tab: Portfolios */}
      {tab === 'portfolios' && (
        <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-sm font-semibold flex items-center gap-2'>
              <BarChart3 size={14} className='text-[#3B82F6]' /> Portfolios
            </h2>
            <Link href='/portfolios' className='text-xs text-[#3B82F6] hover:underline flex items-center gap-1'>
              All portfolios <ChevronRight size={12} />
            </Link>
          </div>
          <p className='text-sm text-gray-500'>Portfolio list will appear once the backend endpoint is wired.</p>
        </div>
      )}

      {/* Tab: Goals */}
      {tab === 'goals' && (
        <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-sm font-semibold flex items-center gap-2'>
              <Shield size={14} className='text-[#3B82F6]' /> Goal detail
            </h2>
          </div>
          {h.goals.length === 0 ? (
            <p className='text-sm text-gray-500'>No goals defined.</p>
          ) : (
            <div className='space-y-4'>
              {h.goals.map(g => (
                <div key={g.id} className='border border-white/[0.06] rounded-xl p-4'>
                  <div className='flex items-start justify-between mb-3'>
                    <div>
                      <p className='font-semibold'>{g.label}</p>
                      <p className='text-xs text-gray-500 capitalize mt-0.5'>{g.type}</p>
                    </div>
                    <span className={`text-sm font-bold ${
                      (g.funded_ratio ?? 0) >= 0.8 ? 'text-emerald-400' :
                      (g.funded_ratio ?? 0) >= 0.5 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {Math.round((g.funded_ratio ?? 0) * 100)}%
                    </span>
                  </div>
                  <div className='grid grid-cols-2 gap-3 text-xs text-gray-500'>
                    <div><p className='text-gray-600 mb-0.5'>Target amount</p><p className='text-white font-medium'>{fmt(g.target_amount)}</p></div>
                    <div><p className='text-gray-600 mb-0.5'>Target date</p><p className='text-white font-medium'>{fmtDate(g.target_date)}</p></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Meeting prep */}
      {tab === 'meeting' && <MeetingPrepPanel h={h} />}
    </div>
  )
}
