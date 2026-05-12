'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Users, Target, BarChart3, Zap, TrendingUp, TrendingDown,
  ChevronRight, Shield, Calendar, AlertTriangle,
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
      { id: 'm2', name: 'Susan Harrison', role: 'spouse', dob: '1971-07-30' },
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
  const [tab, setTab]             = useState<'overview' | 'portfolios' | 'goals'>('overview')

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

      {/* Back */}
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

          {/* AUM block */}
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
          <button className='flex items-center gap-1.5 text-xs text-gray-400 hover:text-white
            border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-colors'>
            <BarChart3 size={12} /> View all runs
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 mb-6 w-fit'>
        {(['overview', 'portfolios', 'goals'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors
              ${tab === t ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

          {/* Members */}
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

          {/* Goals summary */}
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
                        <Calendar size={9} />
                        Target {fmtDate(g.target_date)}
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
          <p className='text-sm text-gray-500'>
            Portfolio list will appear here once the backend endpoint is wired.
          </p>
        </div>
      )}

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
    </div>
  )
}
