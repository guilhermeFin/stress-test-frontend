'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Users, Search, Plus, AlertTriangle, TrendingUp, TrendingDown,
  ChevronRight, Shield, AlertCircle,
} from 'lucide-react'
import { listHouseholds, type Household, type RiskProfile } from '@/lib/households'

const RISK_LABEL: Record<RiskProfile, string> = {
  conservative: 'Conservative',
  moderate:     'Moderate',
  growth:       'Growth',
  aggressive:   'Aggressive',
}

const RISK_COLOR: Record<RiskProfile, string> = {
  conservative: 'text-blue-400 bg-blue-400/10',
  moderate:     'text-emerald-400 bg-emerald-400/10',
  growth:       'text-amber-400 bg-amber-400/10',
  aggressive:   'text-red-400 bg-red-400/10',
}

function fmt(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n}`
}

// ── MOCK households for preview before backend is wired ──────────────────────

const MOCK: Household[] = [
  {
    id: '1', firm_id: 'f1', name: 'Harrison Family', risk_profile: 'growth',
    aum: 3_420_000, portfolio_count: 2, members: [
      { id: 'm1', name: 'James Harrison', role: 'primary' },
      { id: 'm2', name: 'Susan Harrison', role: 'spouse' },
    ],
    goals: [{ id: 'g1', type: 'retirement', label: 'Retirement', target_amount: 5_000_000, target_date: '2034-01-01', funded_ratio: 0.68 }],
    created_at: '2024-03-10T00:00:00Z', last_activity_at: new Date(Date.now() - 18 * 60000).toISOString(),
    alert_count: 0, ytd_return: 0.084,
  },
  {
    id: '2', firm_id: 'f1', name: 'Patel Trust', risk_profile: 'moderate',
    aum: 7_150_000, portfolio_count: 3, members: [
      { id: 'm3', name: 'Raj Patel', role: 'primary' },
    ],
    goals: [
      { id: 'g2', type: 'retirement', label: 'Retirement', target_amount: 12_000_000, target_date: '2030-01-01', funded_ratio: 0.59 },
      { id: 'g3', type: 'legacy', label: 'Estate transfer', target_amount: 3_000_000, target_date: '2040-01-01', funded_ratio: 0.41 },
    ],
    created_at: '2023-06-01T00:00:00Z', last_activity_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    alert_count: 2, ytd_return: -0.021,
  },
  {
    id: '3', firm_id: 'f1', name: 'Chen Portfolio', risk_profile: 'aggressive',
    aum: 1_880_000, portfolio_count: 1, members: [
      { id: 'm4', name: 'Li Chen', role: 'primary' },
      { id: 'm5', name: 'Wei Chen', role: 'spouse' },
    ],
    goals: [
      { id: 'g4', type: 'college', label: 'College fund', target_amount: 400_000, target_date: '2031-09-01', funded_ratio: 0.55 },
    ],
    created_at: '2024-11-15T00:00:00Z', last_activity_at: new Date(Date.now() - 86400000).toISOString(),
    alert_count: 1, ytd_return: 0.142,
  },
  {
    id: '4', firm_id: 'f1', name: 'Reyes IRA', risk_profile: 'conservative',
    aum: 940_000, portfolio_count: 1, members: [
      { id: 'm6', name: 'Maria Reyes', role: 'primary' },
    ],
    goals: [],
    created_at: '2025-01-20T00:00:00Z', last_activity_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    alert_count: 0, ytd_return: 0.028,
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HouseholdsPage() {
  const [households, setHouseholds] = useState<Household[]>(MOCK)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listHouseholds()
      setHouseholds(data)
    } catch {
      // backend not wired — keep mock
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = households.filter(h =>
    h.name.toLowerCase().includes(query.toLowerCase()) ||
    h.members.some(m => m.name.toLowerCase().includes(query.toLowerCase()))
  )

  const totalAum = households.reduce((s, h) => s + (h.aum ?? 0), 0)

  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>

      {/* Header */}
      <div className='flex items-start justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight mb-1'>Clients</h1>
          <p className='text-sm text-gray-500'>
            {households.length} household{households.length !== 1 ? 's' : ''} · {fmt(totalAum)} AUM
          </p>
        </div>
        <button
          className='flex items-center gap-1.5 text-sm font-semibold text-white
            bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg px-4 py-2 transition-colors'
        >
          <Plus size={14} />
          Add household
        </button>
      </div>

      {/* Search */}
      <div className='relative mb-6'>
        <Search size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500' />
        <input
          type='text'
          placeholder='Search by name or member…'
          value={query}
          onChange={e => setQuery(e.target.value)}
          className='w-full bg-white/[0.03] border border-white/[0.08] rounded-xl
            pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600
            focus:outline-none focus:border-[#3B82F6]/50 transition-colors'
        />
      </div>

      {error && (
        <div className='flex items-center gap-2 bg-red-950/40 border border-red-700/30
          rounded-xl px-4 py-3 mb-6 text-red-300 text-sm'>
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* List */}
      <div className='space-y-2'>
        {filtered.length === 0 ? (
          <div className='text-center py-20 border border-dashed border-white/10 rounded-2xl'>
            <Users size={28} className='text-gray-600 mx-auto mb-3' />
            <p className='text-gray-500 text-sm'>No households found.</p>
          </div>
        ) : (
          filtered.map(h => (
            <Link key={h.id} href={`/households/${h.id}`}
              className='block bg-white/[0.025] border border-white/[0.06]
                hover:border-white/12 rounded-2xl px-5 py-4 transition-all group'>
              <div className='flex items-center justify-between'>

                {/* Left: name + members */}
                <div className='flex items-center gap-4 min-w-0'>
                  <div className='w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center shrink-0'>
                    <Users size={16} className='text-[#3B82F6]' />
                  </div>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2 mb-0.5'>
                      <p className='font-semibold text-white group-hover:text-[#3B82F6] transition-colors'>
                        {h.name}
                      </p>
                      {h.alert_count != null && h.alert_count > 0 && (
                        <span className='flex items-center gap-1 text-[10px] font-bold text-amber-400
                          bg-amber-400/10 px-1.5 py-0.5 rounded-full'>
                          <AlertTriangle size={9} /> {h.alert_count}
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                        ${RISK_COLOR[h.risk_profile]}`}>
                        {RISK_LABEL[h.risk_profile]}
                      </span>
                    </div>
                    <p className='text-xs text-gray-500 truncate'>
                      {h.members.map(m => m.name).join(' · ')}
                    </p>
                  </div>
                </div>

                {/* Right: AUM + return */}
                <div className='flex items-center gap-8 shrink-0'>
                  <div className='text-right hidden sm:block'>
                    <p className='text-sm font-semibold'>{fmt(h.aum ?? 0)}</p>
                    <p className='text-xs text-gray-500'>{h.portfolio_count} portfolio{h.portfolio_count !== 1 ? 's' : ''}</p>
                  </div>
                  {h.ytd_return != null && (
                    <div className='flex items-center gap-1 text-sm font-semibold'>
                      {h.ytd_return >= 0
                        ? <TrendingUp size={13} className='text-emerald-400' />
                        : <TrendingDown size={13} className='text-red-400' />}
                      <span className={h.ytd_return >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {h.ytd_return >= 0 ? '+' : ''}{(h.ytd_return * 100).toFixed(1)}%
                      </span>
                      <span className='text-xs text-gray-600 font-normal ml-0.5'>YTD</span>
                    </div>
                  )}
                  {h.goals.length > 0 && (
                    <div className='hidden lg:flex items-center gap-1 text-xs text-gray-500'>
                      <Shield size={11} />
                      {Math.round((h.goals[0].funded_ratio ?? 0) * 100)}% funded
                    </div>
                  )}
                  <ChevronRight size={16} className='text-gray-600 group-hover:text-gray-400 transition-colors' />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
