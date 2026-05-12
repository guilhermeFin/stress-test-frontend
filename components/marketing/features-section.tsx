'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { BarChart3, Target, RefreshCw, Scissors, Activity, FileText } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'

const FEATURES = [
  {
    id: 'factor',
    icon: BarChart3,
    label: 'Factor Risk',
    title: 'Factor Risk Model',
    desc: '5-factor attribution across beta, rates, inflation, credit, and growth. See exactly where concentration risk lives — before a client calls.',
    bullets: [
      'Decompose any portfolio into 5 systematic risk drivers',
      'Compare factor exposures across normal and stress regimes',
      'Spot hidden concentration before it becomes a call',
    ],
    accent: '#3B82F6',
    preview: <FactorPreview />,
  },
  {
    id: 'goals',
    icon: Target,
    label: 'Client Impact',
    title: 'Goal-Based Impact',
    desc: 'Map every drawdown to what it means in plain English: retirement age, monthly income, and years of plan erosion.',
    bullets: [
      'Translate loss percentages into dollars and years',
      'Ruin probability with Monte Carlo at any time horizon',
      'Retirement impact shown at a glance for client meetings',
    ],
    accent: '#10B981',
    preview: <GoalsPreview />,
  },
  {
    id: 'rebalancing',
    icon: RefreshCw,
    label: 'Rebalancing',
    title: 'Rebalancing Recommendations',
    desc: 'Position-level reduce/increase targets based on the scenario, with estimated transaction costs.',
    bullets: [
      'Ticker-level guidance: which positions to trim or add',
      'Transaction cost estimation to protect tax efficiency',
      'One-click action plan with assignable tasks',
    ],
    accent: '#F59E0B',
    preview: <RebalancingPreview />,
  },
  {
    id: 'tax',
    icon: Scissors,
    label: 'Tax Layer',
    title: 'Tax Impact Analysis',
    desc: 'Harvest losses, estimate rebalancing drag, and calculate withdrawal impact — all in one pass.',
    bullets: [
      'TLH opportunities identified across all positions',
      'Wash-sale-aware across linked household accounts',
      'Withdrawal drag and cap-gain projection built in',
    ],
    accent: '#8B5CF6',
    preview: <TaxPreview />,
  },
  {
    id: 'montecarlo',
    icon: Activity,
    label: 'Monte Carlo',
    title: 'Monte Carlo Simulation',
    desc: '1,000-path simulation with ruin probability, percentile fan, and portfolio depletion curves for any scenario.',
    bullets: [
      '1,000 simulated paths for Professional, 10,000 for Enterprise',
      'P10/P50/P90 outcome bands visualized clearly',
      'Depletion date distribution for retirement planning',
    ],
    accent: '#F59E0B',
    preview: <MonteCarloPreview />,
  },
  {
    id: 'reports',
    icon: FileText,
    label: 'Reports',
    title: 'Client-Ready Reports',
    desc: 'Branded PDF with plain-English explanations, compliance footer, and an AI-written client letter — ready to send in one click.',
    bullets: [
      '3-page institutional PDF with your firm branding',
      'AI client letter written in plain, reassuring language',
      'Compliance footer configured per advisor',
    ],
    accent: '#EF4444',
    preview: <ReportsPreview />,
  },
]

export default function FeaturesSection() {
  return (
    <section id='features' className='max-w-6xl mx-auto px-6 py-32'>
      <div data-reveal className='text-center mb-16'>
        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
          bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs
          font-medium mb-5'>
          Full institutional stack
        </div>
        <h2 className='font-bold tracking-tight text-white mb-5'
          style={{ fontSize: '48px', lineHeight: '1.21' }}>
          Everything your clients expect
        </h2>
        <p className='text-gray-400 max-w-lg mx-auto'>
          Every section is built for speed, clarity, and client communication —
          not just internal modeling.
        </p>
      </div>

      <Tabs.Root defaultValue='factor' className='flex flex-col gap-6'>
        {/* Tab list */}
        <Tabs.List
          className='flex flex-wrap justify-center gap-2'
          aria-label='Feature categories'
        >
          {FEATURES.map(f => {
            const Icon = f.icon
            return (
              <Tabs.Trigger
                key={f.id}
                value={f.id}
                className='group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                  text-gray-400 border border-white/[0.06] bg-white/[0.02]
                  transition-all duration-300
                  hover:text-white hover:border-white/15 hover:bg-white/[0.05]
                  data-[state=active]:text-white data-[state=active]:border-[#3B82F6]/40
                  data-[state=active]:bg-[#3B82F6]/10 data-[state=active]:shadow-[0_0_16px_rgba(59,130,246,0.15)]'
              >
                <Icon size={14} className='shrink-0 transition-colors
                  group-data-[state=active]:text-[#3B82F6]' />
                {f.label}
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>

        {/* Tab panels */}
        {FEATURES.map(f => (
          <Tabs.Content
            key={f.id}
            value={f.id}
            className='outline-none animate-fade-in'
          >
            {/* Card with border beam */}
            <div className='relative rounded-2xl p-[1px] overflow-hidden'>
              <BorderBeam duration={10} colorFrom={f.accent} colorTo='#0A0F1E' />

              <div className='relative rounded-[calc(1rem-1px)] bg-[#0A0F1E]
                border border-white/[0.06] overflow-hidden'>
                <div className='grid grid-cols-1 lg:grid-cols-2'>

                  {/* Left: description */}
                  <div className='p-8 md:p-10 flex flex-col justify-center'>
                    <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-6'
                      style={{ background: `${f.accent}18` }}>
                      <f.icon size={18} style={{ color: f.accent }} />
                    </div>
                    <h3 className='text-2xl font-bold text-white mb-3'>{f.title}</h3>
                    <p className='text-gray-400 leading-relaxed mb-7'>{f.desc}</p>
                    <ul className='space-y-3'>
                      {f.bullets.map(b => (
                        <li key={b} className='flex items-start gap-3 text-sm text-gray-400'>
                          <span className='mt-1.5 w-1.5 h-1.5 rounded-full shrink-0'
                            style={{ background: f.accent }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: visual preview */}
                  <div className='relative lg:border-l border-white/[0.06]
                    bg-white/[0.01] flex items-center justify-center p-8 min-h-[320px]'>
                    {f.preview}
                  </div>

                </div>
              </div>
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </section>
  )
}

// ── Previews ─────────────────────────────────────────────────────────────────

function FactorPreview() {
  const factors = [
    { label: 'Market beta',   v: '−14.2%', w: 82, c: '#EF4444' },
    { label: 'Rate risk',     v: '−5.1%',  w: 55, c: '#F59E0B' },
    { label: 'Credit spread', v: '−2.8%',  w: 34, c: '#F59E0B' },
    { label: 'Inflation',     v: '−1.9%',  w: 22, c: '#8B5CF6' },
    { label: 'Growth factor', v: '−0.6%',  w: 10, c: '#6B7280' },
  ]
  return (
    <div className='w-full max-w-sm'>
      <p className='text-xs font-medium text-gray-500 uppercase tracking-widest mb-4'>
        Factor attribution — 2008 GFC
      </p>
      <div className='space-y-3'>
        {factors.map(f => (
          <div key={f.label} className='flex items-center gap-3'>
            <span className='text-xs text-gray-500 w-28 shrink-0'>{f.label}</span>
            <div className='flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden'>
              <div className='h-full rounded-full transition-all duration-700'
                style={{ width: `${f.w}%`, background: f.c }} />
            </div>
            <span className='text-xs tabular-nums text-red-400 w-10 text-right'>{f.v}</span>
          </div>
        ))}
      </div>
      <div className='mt-5 p-3 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20'>
        <p className='text-xs text-[#3B82F6] font-medium mb-1'>Top risk driver</p>
        <p className='text-xs text-gray-400'>
          Market beta accounts for <span className='text-white font-medium'>61%</span> of total stress loss.
          Consider reducing AAPL and MSFT to lower concentration.
        </p>
      </div>
    </div>
  )
}

function GoalsPreview() {
  return (
    <div className='w-full max-w-sm space-y-3'>
      <p className='text-xs font-medium text-gray-500 uppercase tracking-widest mb-4'>
        Goal impact — retirement scenario
      </p>
      {[
        { label: 'Retirement age',  before: '65',        after: '68',        bad: true },
        { label: 'Monthly income',  before: '$9,400',    after: '$7,100',    bad: true },
        { label: 'Ruin probability',before: '8%',        after: '23%',       bad: true },
        { label: 'Recovery time',   before: '—',         after: '3.1 yrs',   bad: false },
      ].map(r => (
        <div key={r.label} className='flex items-center justify-between
          bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3'>
          <span className='text-xs text-gray-500'>{r.label}</span>
          <div className='flex items-center gap-2 text-xs tabular-nums'>
            <span className='text-gray-600 line-through'>{r.before}</span>
            <span className='text-xs text-gray-600'>→</span>
            <span className={r.bad ? 'text-red-400 font-medium' : 'text-yellow-400 font-medium'}>
              {r.after}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function RebalancingPreview() {
  const actions = [
    { ticker: 'AAPL', action: 'Reduce', from: '18%', to: '12%', color: '#EF4444' },
    { ticker: 'MSFT', action: 'Reduce', from: '14%', to: '10%', color: '#EF4444' },
    { ticker: 'AGG',  action: 'Increase', from: '8%', to: '14%', color: '#10B981' },
    { ticker: 'GLD',  action: 'Increase', from: '3%', to: '7%',  color: '#10B981' },
  ]
  return (
    <div className='w-full max-w-sm'>
      <p className='text-xs font-medium text-gray-500 uppercase tracking-widest mb-4'>
        Suggested trades
      </p>
      <div className='space-y-2'>
        {actions.map(a => (
          <div key={a.ticker} className='flex items-center gap-3
            bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5'>
            <span className='text-sm font-semibold text-white w-10'>{a.ticker}</span>
            <span className='text-xs font-medium w-14'
              style={{ color: a.color }}>{a.action}</span>
            <div className='flex items-center gap-1.5 text-xs tabular-nums ml-auto'>
              <span className='text-gray-600'>{a.from}</span>
              <span className='text-gray-700'>→</span>
              <span className='text-white font-medium'>{a.to}</span>
            </div>
          </div>
        ))}
      </div>
      <p className='text-xs text-gray-600 mt-3 text-center'>
        Est. transaction cost: <span className='text-gray-400'>$1,240</span>
      </p>
    </div>
  )
}

function TaxPreview() {
  return (
    <div className='w-full max-w-sm space-y-3'>
      <p className='text-xs font-medium text-gray-500 uppercase tracking-widest mb-4'>
        Tax opportunities
      </p>
      {[
        { label: 'Harvestable losses',   value: '$38,400',  color: '#10B981' },
        { label: 'Est. tax savings',     value: '$11,200',  color: '#10B981' },
        { label: 'Withdrawal drag',      value: '−$4,800',  color: '#EF4444' },
        { label: 'Net rebalance cost',   value: '$6,400',   color: '#F59E0B' },
      ].map(r => (
        <div key={r.label} className='flex items-center justify-between
          bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3'>
          <span className='text-xs text-gray-400'>{r.label}</span>
          <span className='text-sm font-semibold tabular-nums'
            style={{ color: r.color }}>{r.value}</span>
        </div>
      ))}
      <div className='p-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20'>
        <p className='text-xs text-[#8B5CF6] font-medium mb-1'>TLH opportunities: 4 positions</p>
        <p className='text-xs text-gray-500'>INTC, F, VWO, HYG eligible — no wash-sale conflicts detected.</p>
      </div>
    </div>
  )
}

function MonteCarloPreview() {
  const bars = [4, 7, 13, 22, 31, 42, 38, 28, 19, 11, 6, 3]
  const max = Math.max(...bars)
  return (
    <div className='w-full max-w-sm'>
      <p className='text-xs font-medium text-gray-500 uppercase tracking-widest mb-4'>
        1,000-path simulation
      </p>
      <div className='flex items-end gap-1 h-20 mb-3'>
        {bars.map((h, i) => (
          <div key={i} className='flex-1 rounded-sm transition-all duration-500'
            style={{
              height: `${(h / max) * 100}%`,
              background: i < 3 ? '#EF4444' : i > 8 ? '#10B981' : '#3B82F6',
              opacity: 0.6 + (i / bars.length) * 0.4,
            }} />
        ))}
      </div>
      <div className='grid grid-cols-3 gap-2'>
        {[
          { l: 'P10 outcome', v: '$1.2M', c: '#EF4444' },
          { l: 'P50 outcome', v: '$2.1M', c: '#3B82F6' },
          { l: 'P90 outcome', v: '$3.4M', c: '#10B981' },
        ].map(s => (
          <div key={s.l} className='bg-white/[0.03] border border-white/[0.06]
            rounded-xl p-2.5 text-center'>
            <p className='text-xs text-gray-600 mb-1'>{s.l}</p>
            <p className='text-sm font-semibold tabular-nums' style={{ color: s.c }}>{s.v}</p>
          </div>
        ))}
      </div>
      <p className='text-xs text-center text-gray-600 mt-3'>
        Ruin probability: <span className='text-red-400 font-medium'>12%</span> at 30-year horizon
      </p>
    </div>
  )
}

function ReportsPreview() {
  return (
    <div className='w-full max-w-sm'>
      <p className='text-xs font-medium text-gray-500 uppercase tracking-widest mb-4'>
        Generated report
      </p>
      <div className='rounded-xl border border-white/10 overflow-hidden bg-[#0d1117]'>
        {/* PDF header mock */}
        <div className='bg-[#3B82F6]/10 border-b border-white/[0.06] px-4 py-3 flex
          items-center justify-between'>
          <div>
            <p className='text-xs font-semibold text-white'>Portfolio Stress Analysis</p>
            <p className='text-[10px] text-gray-500'>2008 Global Financial Crisis · May 2026</p>
          </div>
          <div className='text-right'>
            <p className='text-xs text-[#3B82F6] font-medium'>ACME Wealth Mgmt</p>
            <p className='text-[10px] text-gray-600'>Confidential</p>
          </div>
        </div>
        <div className='p-4 space-y-2'>
          {[
            'Executive Summary',
            'Factor Risk Attribution',
            'Monte Carlo & Goal Impact',
            'Tax Harvest Opportunities',
            'Rebalancing Action Plan',
            'AI Analyst Letter',
          ].map((s, i) => (
            <div key={s} className='flex items-center gap-2'>
              <div className='w-4 h-4 rounded-sm bg-[#3B82F6]/20 flex items-center
                justify-center shrink-0'>
                <span className='text-[9px] text-[#3B82F6] font-bold'>{i + 1}</span>
              </div>
              <span className='text-xs text-gray-400'>{s}</span>
              <div className='ml-auto text-[10px] text-gray-700'>p.{i + 1}</div>
            </div>
          ))}
        </div>
        <div className='border-t border-white/[0.06] px-4 py-2'>
          <p className='text-[10px] text-gray-700'>
            This report is AI-assisted. Verify before client delivery.
          </p>
        </div>
      </div>
    </div>
  )
}
