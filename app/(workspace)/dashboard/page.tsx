'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  TrendingUp, TrendingDown, AlertTriangle, BarChart3,
  Users, Zap, Clock, ChevronRight, RefreshCw,
} from 'lucide-react'
import { getDashboard, type DashboardData, type TopMover, type DriftAlert, type RecentRun } from '@/lib/households'

function fmt(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function fmtPct(n: number, plus = false) {
  const s = n.toFixed(2) + '%'
  return plus && n > 0 ? '+' + s : s
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function healthColor(score: number) {
  if (score >= 7) return 'text-emerald-400'
  if (score >= 4) return 'text-amber-400'
  return 'text-red-400'
}

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, accent = false,
}: { label: string; value: string; sub?: string; icon: React.ElementType; accent?: boolean }) {
  return (
    <div className={`bg-white/[0.03] border rounded-2xl p-5
      ${accent ? 'border-[#3B82F6]/30' : 'border-white/[0.06]'}`}>
      <div className='flex items-center justify-between mb-3'>
        <p className='text-xs text-gray-500 font-medium uppercase tracking-wide'>{label}</p>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center
          ${accent ? 'bg-[#3B82F6]/10' : 'bg-white/[0.04]'}`}>
          <Icon size={14} className={accent ? 'text-[#3B82F6]' : 'text-gray-400'} />
        </div>
      </div>
      <p className='text-2xl font-bold tracking-tight'>{value}</p>
      {sub && <p className='text-xs text-gray-500 mt-1'>{sub}</p>}
    </div>
  )
}

// ── MOCK data (renders while API is wired) ───────────────────────────────────

const MOCK: DashboardData = {
  total_aum: 48_700_000,
  aum_change_1d: 0.0031,
  household_count: 12,
  active_alerts: 3,
  top_movers: [
    { ticker: 'NVDA', name: 'NVIDIA Corp',      change_pct:  4.21, household_name: 'Harrison Family', household_id: '1' },
    { ticker: 'TSLA', name: 'Tesla Inc',         change_pct: -3.18, household_name: 'Patel Trust',    household_id: '2' },
    { ticker: 'MSFT', name: 'Microsoft Corp',    change_pct:  1.94, household_name: 'Chen Portfolio', household_id: '3' },
    { ticker: 'GLD',  name: 'SPDR Gold Shares',  change_pct: -0.87, household_name: 'Reyes IRA',      household_id: '4' },
  ],
  drift_alerts: [
    { household_id: '2', household_name: 'Patel Trust',    portfolio_id: 'p1', asset_class: 'US Equity', current_weight: 72, target_weight: 60, drift_pct: 12 },
    { household_id: '5', household_name: 'Nguyen Family',  portfolio_id: 'p2', asset_class: 'Fixed Income', current_weight: 14, target_weight: 25, drift_pct: -11 },
  ],
  recent_runs: [
    { run_id: 'r1', portfolio_name: 'Growth Core',  household_name: 'Harrison Family', scenario: '2008 GFC',      health_score: 4.2, created_at: new Date(Date.now() - 18 * 60000).toISOString() },
    { run_id: 'r2', portfolio_name: 'Balanced IRA', household_name: 'Patel Trust',     scenario: '2022 Rate Shock', health_score: 6.1, created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
    { run_id: 'r3', portfolio_name: 'Conservative', household_name: 'Reyes IRA',       scenario: 'COVID Crash',   health_score: 7.8, created_at: new Date(Date.now() - 86400000).toISOString() },
  ],
  inbox_preview: [],
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData>(MOCK)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const d = await getDashboard()
      setData(d)
    } catch {
      // backend not wired yet — keep mock
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const d1Positive = data.aum_change_1d >= 0
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className='max-w-6xl mx-auto px-6 py-10'>

      {/* Page header */}
      <div className='flex items-start justify-between mb-8'>
        <div>
          <p className='text-xs text-gray-500 mb-1'>{today}</p>
          <h1 className='text-2xl font-bold tracking-tight'>
            Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},&nbsp;
            {session?.user?.name?.split(' ')[0] ?? 'Advisor'}
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Here&rsquo;s what needs your attention today.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={load}
            disabled={loading}
            className='flex items-center gap-1.5 text-xs text-gray-500 hover:text-white
              border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-colors'
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link
            href='/'
            className='flex items-center gap-1.5 text-xs font-semibold text-white
              bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg px-3 py-1.5 transition-colors'
          >
            <Zap size={12} />
            New stress test
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8'>
        <StatCard
          label='Total AUM'
          value={fmt(data.total_aum)}
          sub={`${d1Positive ? '+' : ''}${fmtPct(data.aum_change_1d * 100)} today`}
          icon={d1Positive ? TrendingUp : TrendingDown}
          accent
        />
        <StatCard
          label='Households'
          value={String(data.household_count)}
          sub='Active clients'
          icon={Users}
        />
        <StatCard
          label='Active alerts'
          value={String(data.active_alerts)}
          sub='Requires review'
          icon={AlertTriangle}
        />
        <StatCard
          label='Stress tests'
          value={String(data.recent_runs.length)}
          sub='This week'
          icon={BarChart3}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

        {/* Left column */}
        <div className='lg:col-span-2 space-y-6'>

          {/* Top movers */}
          <section>
            <div className='flex items-center justify-between mb-3'>
              <h2 className='text-sm font-semibold text-white'>Top movers today</h2>
              <Link href='/intelligence' className='text-xs text-[#3B82F6] hover:underline flex items-center gap-1'>
                Open intelligence <ChevronRight size={12} />
              </Link>
            </div>
            <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden'>
              {(data.top_movers as TopMover[]).map((m, i) => (
                <div key={m.ticker}
                  className={`flex items-center justify-between px-4 py-3
                    ${i < data.top_movers.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center
                      text-[10px] font-bold text-gray-300'>
                      {m.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <p className='text-sm font-medium'>{m.ticker}</p>
                      <p className='text-xs text-gray-500'>{m.household_name}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className={`text-sm font-semibold ${m.change_pct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {fmtPct(m.change_pct, true)}
                    </p>
                    <p className='text-[10px] text-gray-600'>1D</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Drift alerts */}
          {data.drift_alerts.length > 0 && (
            <section>
              <div className='flex items-center justify-between mb-3'>
                <h2 className='text-sm font-semibold text-white'>Allocation drift</h2>
                <Link href='/households' className='text-xs text-[#3B82F6] hover:underline flex items-center gap-1'>
                  View clients <ChevronRight size={12} />
                </Link>
              </div>
              <div className='space-y-2'>
                {(data.drift_alerts as DriftAlert[]).map(a => (
                  <Link key={a.portfolio_id} href={`/households/${a.household_id}`}
                    className='block bg-amber-950/20 border border-amber-700/20 rounded-xl px-4 py-3
                      hover:border-amber-700/40 transition-colors'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium'>{a.household_name}</p>
                        <p className='text-xs text-gray-500'>{a.asset_class}</p>
                      </div>
                      <div className='text-right'>
                        <p className='text-xs text-amber-400 font-semibold'>
                          {a.drift_pct > 0 ? '+' : ''}{a.drift_pct.toFixed(1)}% drift
                        </p>
                        <p className='text-[10px] text-gray-600'>
                          {a.current_weight}% actual · {a.target_weight}% target
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column — recent runs */}
        <div className='space-y-6'>
          <section>
            <div className='flex items-center justify-between mb-3'>
              <h2 className='text-sm font-semibold text-white'>Recent stress tests</h2>
              <Link href='/portfolios' className='text-xs text-[#3B82F6] hover:underline flex items-center gap-1'>
                All runs <ChevronRight size={12} />
              </Link>
            </div>
            <div className='space-y-2'>
              {(data.recent_runs as RecentRun[]).map(r => (
                <Link key={r.run_id} href={`/results?run=${r.run_id}`}
                  className='block bg-white/[0.02] border border-white/[0.06]
                    hover:border-white/10 rounded-xl px-4 py-3 transition-colors group'>
                  <div className='flex items-start justify-between mb-1'>
                    <p className='text-sm font-medium group-hover:text-[#3B82F6] transition-colors'>
                      {r.portfolio_name}
                    </p>
                    <span className={`text-xs font-bold ${healthColor(r.health_score)}`}>
                      {r.health_score.toFixed(1)}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500'>{r.scenario}</p>
                  <p className='text-[10px] text-gray-600 mt-1 flex items-center gap-1'>
                    <Clock size={9} /> {timeAgo(r.created_at)}
                    {r.household_name && ` · ${r.household_name}`}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick actions */}
          <section>
            <h2 className='text-sm font-semibold text-white mb-3'>Quick actions</h2>
            <div className='space-y-2'>
              {[
                { href: '/',             label: 'Run a stress test',     icon: Zap },
                { href: '/households',   label: 'Add a client household', icon: Users },
                { href: '/compare',      label: 'Compare portfolios',    icon: BarChart3 },
                { href: '/inbox',        label: 'Review inbox',          icon: AlertTriangle },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}
                  className='flex items-center gap-2 text-sm text-gray-400 hover:text-white
                    border border-white/[0.05] hover:border-white/10 rounded-xl px-3 py-2.5
                    transition-colors group'>
                  <Icon size={14} className='text-gray-600 group-hover:text-[#3B82F6] transition-colors shrink-0' />
                  {label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
