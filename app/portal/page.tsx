'use client'

import { useState } from 'react'
import {
  TrendingUp, TrendingDown, Target, FileText,
  MessageSquare, ShieldCheck, ChevronRight,
} from 'lucide-react'
import Logo from '@/components/Logo'

// Mock client data — in production, fetched server-side for the authenticated client session
const CLIENT = {
  name: 'Jordan Davidson',
  firm: 'Apex Wealth Advisors',
  advisor: 'Sarah Chen, CFP',
  last_updated: 'May 11, 2026',
}

const PORTFOLIO = {
  total_value: 1_842_300,
  ytd_return: 6.8,
  one_year_return: 12.4,
  as_of: 'May 11, 2026',
  allocation: [
    { label: 'US Equity',         pct: 42, color: '#3B82F6' },
    { label: 'International',     pct: 18, color: '#10B981' },
    { label: 'Fixed Income',      pct: 28, color: '#8B5CF6' },
    { label: 'Alternatives',      pct: 8,  color: '#F59E08' },
    { label: 'Cash',              pct: 4,  color: '#6B7280' },
  ],
}

const GOALS = [
  { label: 'Retirement at 62',    funded: 74, target: '$3.2M by 2034', on_track: true },
  { label: 'College Fund (Emma)', funded: 62, target: '$180K by 2028',  on_track: true },
  { label: 'Lake House',          funded: 38, target: '$450K by 2030',  on_track: false },
]

const DOCUMENTS = [
  { name: 'Q1 2026 Portfolio Review', date: 'Apr 15, 2026', type: 'PDF' },
  { name: 'Investment Policy Statement', date: 'Jan 5, 2026', type: 'PDF' },
  { name: 'Annual Tax Summary 2025', date: 'Mar 1, 2026', type: 'PDF' },
]

function AllocationBar({ allocation }: { allocation: typeof PORTFOLIO.allocation }) {
  return (
    <div className='space-y-2'>
      {allocation.map(a => (
        <div key={a.label} className='flex items-center gap-3'>
          <div className='w-24 shrink-0 text-xs text-gray-400'>{a.label}</div>
          <div className='flex-1 bg-white/[0.06] rounded-full h-2 overflow-hidden'>
            <div className='h-full rounded-full' style={{ width: `${a.pct}%`, background: a.color }} />
          </div>
          <div className='w-8 text-right text-xs tabular-nums text-gray-300'>{a.pct}%</div>
        </div>
      ))}
    </div>
  )
}

function GoalBar({ funded, on_track }: { funded: number; on_track: boolean }) {
  const color = on_track ? '#10B981' : '#F59E08'
  return (
    <div className='flex-1 bg-white/[0.06] rounded-full h-1.5 overflow-hidden'>
      <div className='h-full rounded-full transition-all' style={{ width: `${funded}%`, background: color }} />
    </div>
  )
}

export default function ClientPortalPage() {
  const [tab, setTab] = useState<'overview' | 'goals' | 'documents' | 'messages'>('overview')
  const positive = PORTFOLIO.ytd_return >= 0

  const TABS = [
    { id: 'overview',   label: 'Portfolio' },
    { id: 'goals',      label: 'Goals' },
    { id: 'documents',  label: 'Documents' },
    { id: 'messages',   label: 'Messages' },
  ] as const

  return (
    <div className='min-h-screen'>
      {/* Header */}
      <header className='border-b border-white/[0.06] px-6 h-14 flex items-center justify-between'>
        <Logo size={16} />
        <div className='text-right'>
          <p className='text-xs font-medium text-white'>{CLIENT.name}</p>
          <p className='text-[10px] text-gray-500'>{CLIENT.firm}</p>
        </div>
      </header>

      <main className='max-w-3xl mx-auto px-6 py-8'>

        {/* Hero balance */}
        <div className='mb-8'>
          <p className='text-sm text-gray-500 mb-1'>Total portfolio value</p>
          <div className='flex items-end gap-4'>
            <p className='text-4xl font-bold tabular-nums tracking-tight'>
              ${PORTFOLIO.total_value.toLocaleString()}
            </p>
            <div className={`flex items-center gap-1 mb-1 ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
              {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className='text-sm font-semibold'>
                {positive ? '+' : ''}{PORTFOLIO.ytd_return}% YTD
              </span>
            </div>
          </div>
          <p className='text-xs text-gray-600 mt-1'>As of {PORTFOLIO.as_of} · 1Y: {positive ? '+' : ''}{PORTFOLIO.one_year_return}%</p>
        </div>

        {/* Tab bar */}
        <div className='flex gap-1 bg-white/[0.03] rounded-xl p-1 mb-6'>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-all ${
                tab === t.id
                  ? 'bg-white/[0.08] text-white'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Portfolio tab */}
        {tab === 'overview' && (
          <div className='space-y-4'>
            <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5'>
              <h2 className='text-sm font-semibold mb-4'>Asset Allocation</h2>
              <AllocationBar allocation={PORTFOLIO.allocation} />
            </div>
            <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5'>
              <div className='flex items-start gap-3'>
                <ShieldCheck size={16} className='text-[#3B82F6] mt-0.5 shrink-0' />
                <div>
                  <p className='text-sm font-semibold mb-1'>Advisor note</p>
                  <p className='text-xs text-gray-400 leading-relaxed'>
                    Your portfolio is positioned conservatively relative to your long-term targets, reflecting
                    the current elevated rate environment. We&apos;ve maintained a short-duration tilt in fixed
                    income and added to international equities which trade at a significant valuation discount
                    to the US. Your next quarterly review is scheduled for August 2026.
                  </p>
                  <p className='text-[10px] text-gray-600 mt-2'>— {CLIENT.advisor}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals tab */}
        {tab === 'goals' && (
          <div className='space-y-3'>
            {GOALS.map(g => (
              <div key={g.label}
                className='bg-white/[0.025] border border-white/[0.06] rounded-2xl p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <Target size={14} className={g.on_track ? 'text-emerald-400' : 'text-amber-400'} />
                    <p className='text-sm font-semibold text-white'>{g.label}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    g.on_track
                      ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                      : 'text-amber-400 bg-amber-400/10 border-amber-400/20'}`}>
                    {g.on_track ? 'On track' : 'Needs attention'}
                  </span>
                </div>
                <div className='flex items-center gap-3 mb-2'>
                  <GoalBar funded={g.funded} on_track={g.on_track} />
                  <span className='text-xs font-bold tabular-nums text-white w-8 text-right'>{g.funded}%</span>
                </div>
                <p className='text-[11px] text-gray-500'>Target: {g.target}</p>
              </div>
            ))}
          </div>
        )}

        {/* Documents tab */}
        {tab === 'documents' && (
          <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl overflow-hidden'>
            {DOCUMENTS.map((doc, i) => (
              <div key={doc.name}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer
                  ${i < DOCUMENTS.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
                <FileText size={16} className='text-[#3B82F6] shrink-0' />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm text-white'>{doc.name}</p>
                  <p className='text-[11px] text-gray-500'>{doc.date}</p>
                </div>
                <span className='text-[10px] text-gray-600'>{doc.type}</span>
                <ChevronRight size={14} className='text-gray-700' />
              </div>
            ))}
          </div>
        )}

        {/* Messages tab */}
        {tab === 'messages' && (
          <div className='text-center py-16'>
            <MessageSquare size={32} className='mx-auto mb-3 text-gray-700' />
            <p className='text-sm text-gray-500'>Secure messaging coming soon.</p>
            <p className='text-xs text-gray-600 mt-1'>
              For now, contact your advisor at{' '}
              <span className='text-[#3B82F6]'>schen@apexwealth.com</span>
            </p>
          </div>
        )}

      </main>

      <footer className='border-t border-white/[0.04] px-6 py-4 text-center'>
        <p className='text-[10px] text-gray-700'>
          Powered by Vantage · This portal is read-only. All investment decisions are made by your advisor.
          Past performance does not guarantee future results.
        </p>
      </footer>
    </div>
  )
}
