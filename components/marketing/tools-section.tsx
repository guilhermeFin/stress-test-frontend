'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { FlaskConical, Brain, Presentation, GitCompare, Gauge, Sliders } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'

const TOOLS = [
  {
    id: 'scenarios',
    icon: FlaskConical,
    label: 'Scenarios',
    title: 'Scenario Builder',
    desc: 'Choose from 6 historical crises or describe any scenario in plain English — Vantage converts it into a precise shock vector instantly.',
    bullets: [
      '6 pre-built crises: 2008 GFC, COVID, Dot-Com, Black Monday, 2022 Rate Shock, Stagflation',
      'Plain-English custom scenarios — type "Fed hikes 300bps" and run it',
      '6-axis shock sliders for precise manual control',
    ],
    accent: '#3B82F6',
    preview: <ScenariosPreview />,
  },
  {
    id: 'ai-memo',
    icon: Brain,
    label: 'AI Memo',
    title: 'AI Analyst Memo',
    desc: 'Claude reads your full 12-section analysis and writes an advisor note, a plain-English client letter, and a prioritized action list — in seconds.',
    bullets: [
      'Advisor-facing note with specific trade recommendations',
      'Client letter in plain English — no quant jargon',
      'Prioritized action plan with assignable tasks',
    ],
    accent: '#8B5CF6',
    preview: <AiMemoPreview />,
  },
  {
    id: 'presentation',
    icon: Presentation,
    label: 'Presentation Mode',
    title: 'Client Presentation Mode',
    desc: 'One click turns your analysis into a clean slide deck you can run live in a client meeting — advisor view and client view, side by side.',
    bullets: [
      'Slide-by-slide flow built from your actual results',
      'Separate advisor and client views on the same screen',
      'Export as PDF or present directly from the browser',
    ],
    accent: '#10B981',
    preview: <PresentationPreview />,
  },
  {
    id: 'compare',
    icon: GitCompare,
    label: 'Portfolio Compare',
    title: 'Portfolio Comparison',
    desc: 'Upload two portfolios and stress-test them side by side. See which one holds up better — with a radar chart, loss breakdown, and a clear winner badge.',
    bullets: [
      'Head-to-head stress results across all 12 sections',
      'Radar chart comparing factor exposures',
      'Position-level loss diff to pinpoint divergence',
    ],
    accent: '#F59E0B',
    preview: <ComparePreview />,
  },
  {
    id: 'health',
    icon: Gauge,
    label: 'Health Score',
    title: 'Smart Risk Summary',
    desc: 'Every analysis opens with a 1–10 health score and a plain-English summary — so you know the verdict before reading a single chart.',
    bullets: [
      'Health score based on drawdown, liquidity, and goal impact',
      'Color-coded severity across all risk dimensions',
      'Summary written for advisors, translatable for clients',
    ],
    accent: '#EF4444',
    preview: <HealthPreview />,
  },
  {
    id: 'shocks',
    icon: Sliders,
    label: 'Shock Builder',
    title: 'Custom Shock Sliders',
    desc: 'Six independent macro dials — equity, rates, credit, FX, vol, and liquidity — so you can model any scenario with surgical precision.',
    bullets: [
      'Equity, rates, credit spreads, FX, volatility, liquidity',
      'Save custom shocks as named scenarios for reuse',
      'Combine with historical presets as a starting point',
    ],
    accent: '#06B6D4',
    preview: <ShocksPreview />,
  },
]

export default function ToolsSection() {
  return (
    <section className='max-w-6xl mx-auto px-6 py-32'>
      <div data-reveal className='text-center mb-16'>
        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
          bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs
          font-medium mb-5'>
          Built for advisors
        </div>
        <h2 className='font-bold tracking-tight text-white mb-5'
          style={{ fontSize: '48px', lineHeight: '1.21' }}>
          What we offer you
        </h2>
        <p className='text-gray-400 max-w-lg mx-auto'>
          Every tool is purpose-built for the moment a client calls in a panic —
          fast answers, clear language, and output you can put in front of anyone.
        </p>
      </div>

      <Tabs.Root defaultValue='scenarios' className='flex flex-col gap-6'>
        <Tabs.List className='flex flex-wrap justify-center gap-2' aria-label='Tools'>
          {TOOLS.map(t => {
            const Icon = t.icon
            return (
              <Tabs.Trigger
                key={t.id}
                value={t.id}
                className='group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                  text-gray-400 border border-white/[0.06] bg-white/[0.02]
                  transition-all duration-300
                  hover:text-white hover:border-white/15 hover:bg-white/[0.05]
                  data-[state=active]:text-white data-[state=active]:border-[#3B82F6]/40
                  data-[state=active]:bg-[#3B82F6]/10 data-[state=active]:shadow-[0_0_16px_rgba(59,130,246,0.15)]'
              >
                <Icon size={14} className='shrink-0 transition-colors
                  group-data-[state=active]:text-[#3B82F6]' />
                {t.label}
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>

        {TOOLS.map(t => (
          <Tabs.Content key={t.id} value={t.id} className='outline-none animate-fade-in'>
            <div className='relative rounded-2xl p-[1px] overflow-hidden'>
              <BorderBeam duration={10} colorFrom={t.accent} colorTo='#0A0F1E' />

              <div className='relative rounded-[calc(1rem-1px)] bg-[#0A0F1E]
                border border-white/[0.06] overflow-hidden'>
                <div className='grid grid-cols-1 lg:grid-cols-2'>

                  {/* Left: description */}
                  <div className='p-8 md:p-10 flex flex-col justify-center'>
                    <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-6'
                      style={{ background: `${t.accent}18` }}>
                      <t.icon size={18} style={{ color: t.accent }} />
                    </div>
                    <h3 className='text-2xl font-bold text-white mb-3'>{t.title}</h3>
                    <p className='text-gray-400 leading-relaxed mb-7'>{t.desc}</p>
                    <ul className='space-y-3'>
                      {t.bullets.map(b => (
                        <li key={b} className='flex items-start gap-3 text-sm text-gray-400'>
                          <span className='mt-1.5 w-1.5 h-1.5 rounded-full shrink-0'
                            style={{ background: t.accent }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: visual preview */}
                  <div className='relative lg:border-l border-white/[0.06]
                    bg-white/[0.01] flex items-center justify-center p-8 min-h-[320px]'>
                    {t.preview}
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

function ScenariosPreview() {
  const scenarios = [
    { label: '2008 GFC',        loss: '−23.4%', active: true  },
    { label: 'COVID Crash',     loss: '−18.7%', active: false },
    { label: 'Dot-Com Bust',    loss: '−31.2%', active: false },
    { label: 'Black Monday',    loss: '−12.8%', active: false },
    { label: '2022 Rate Shock', loss: '−16.1%', active: false },
    { label: 'Stagflation',     loss: '−20.5%', active: false },
  ]
  return (
    <div className='w-full max-w-sm'>
      <p className='text-xs font-medium text-gray-500 uppercase tracking-widest mb-4'>
        Historical scenarios
      </p>
      <div className='space-y-1.5'>
        {scenarios.map(s => (
          <div key={s.label}
            className={`flex items-center justify-between px-4 py-2.5 rounded-xl
              border transition-all duration-200 ${
              s.active
                ? 'bg-[#3B82F6]/10 border-[#3B82F6]/30 text-white'
                : 'bg-white/[0.02] border-white/[0.05] text-gray-500'
            }`}>
            <div className='flex items-center gap-2'>
              {s.active && <span className='w-1.5 h-1.5 rounded-full bg-[#3B82F6]' />}
              <span className='text-sm font-medium'>{s.label}</span>
            </div>
            <span className={`text-sm tabular-nums font-semibold ${s.active ? 'text-red-400' : 'text-gray-600'}`}>
              {s.loss}
            </span>
          </div>
        ))}
      </div>
      <div className='mt-3 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-dashed
        border-white/10 text-center'>
        <p className='text-xs text-gray-600'>
          + describe your own: <span className='text-gray-400'>"Fed hikes 300bps in 6 months"</span>
        </p>
      </div>
    </div>
  )
}

function AiMemoPreview() {
  return (
    <div className='w-full max-w-sm'>
      <p className='text-xs font-medium text-gray-500 uppercase tracking-widest mb-4'>
        AI analyst output
      </p>
      <div className='rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 p-4 mb-3'>
        <p className='text-[10px] font-semibold text-[#8B5CF6] uppercase tracking-widest mb-2'>
          Advisor Note
        </p>
        <p className='text-xs text-gray-300 leading-relaxed'>
          Under a 2008-style scenario, this portfolio faces a{' '}
          <span className='text-white font-medium'>23.4% drawdown</span>, driven by market
          beta (61%). Priority: trim AAPL and MSFT — they account for 67% of total stress loss.
          Harvest $38K in losses before year-end.
        </p>
      </div>
      <div className='rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 mb-3'>
        <p className='text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2'>
          Client Letter
        </p>
        <p className='text-xs text-gray-400 leading-relaxed'>
          If markets fell as sharply as 2008, your portfolio would be down about $561K temporarily.
          Your retirement plan remains on track — we have a plan in place and will act on it together.
        </p>
      </div>
      <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02]
        border border-white/[0.05]'>
        <span className='w-1.5 h-1.5 rounded-full bg-[#8B5CF6]' />
        <p className='text-[10px] text-gray-500'>
          AI-assisted — verify before client delivery
        </p>
      </div>
    </div>
  )
}

function PresentationPreview() {
  const slides = ['Executive Summary', 'Risk Snapshot', 'Factor Attribution', 'Client Impact', 'Action Plan']
  return (
    <div className='w-full max-w-sm'>
      <p className='text-xs font-medium text-gray-500 uppercase tracking-widest mb-4'>
        Presentation slides
      </p>
      <div className='rounded-xl border border-white/10 overflow-hidden'>
        {/* Slide preview */}
        <div className='bg-[#0d1117] px-5 py-6 border-b border-white/[0.06]'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <div className='w-1 h-4 bg-[#10B981] rounded-full' />
              <span className='text-xs font-semibold text-white'>Executive Summary</span>
            </div>
            <div className='flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1 text-[10px] text-gray-500 border border-white/[0.06]'>
              <span className='w-1.5 h-1.5 rounded-full bg-[#10B981]' />
              Advisor view
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            {[
              { l: 'Health score', v: '6.2/10', c: 'text-yellow-400' },
              { l: 'Stress loss',  v: '−23.4%', c: 'text-red-400' },
              { l: 'Recovery',     v: '3.1 yrs', c: 'text-[#3B82F6]' },
              { l: 'Goals',        v: 'At risk',  c: 'text-yellow-400' },
            ].map(m => (
              <div key={m.l} className='bg-white/[0.04] rounded-lg p-2'>
                <p className='text-[10px] text-gray-600 mb-0.5'>{m.l}</p>
                <p className={`text-sm font-semibold tabular-nums ${m.c}`}>{m.v}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Slide list */}
        <div className='bg-[#070a10]'>
          {slides.map((s, i) => (
            <div key={s}
              className={`flex items-center gap-3 px-4 py-2.5 text-xs border-b border-white/[0.04]
                last:border-0 ${i === 0 ? 'bg-[#10B981]/5 text-white' : 'text-gray-600'}`}>
              <span className='w-4 text-right tabular-nums text-gray-700'>{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ComparePreview() {
  const positions = [
    { ticker: 'AAPL', a: '−$84K', b: '−$51K', winner: 'b' },
    { ticker: 'MSFT', a: '−$61K', b: '−$38K', winner: 'b' },
    { ticker: 'AGG',  a: '−$12K', b: '−$8K',  winner: 'b' },
    { ticker: 'GLD',  a: '+$4K',  b: '+$7K',  winner: 'b' },
  ]
  return (
    <div className='w-full max-w-sm'>
      <div className='flex items-center justify-between mb-4'>
        <p className='text-xs font-medium text-gray-500 uppercase tracking-widest'>
          Head-to-head
        </p>
        <span className='text-[10px] font-semibold text-[#10B981] bg-[#10B981]/10
          border border-[#10B981]/20 rounded-full px-2 py-0.5'>
          Portfolio B wins
        </span>
      </div>
      <div className='grid grid-cols-3 gap-2 mb-3'>
        {[
          { l: 'Portfolio A loss', v: '−23.4%', c: 'text-red-400' },
          { l: 'Portfolio B loss', v: '−15.8%', c: 'text-yellow-400' },
          { l: 'Difference',       v: '−7.6%',  c: 'text-[#10B981]' },
        ].map(m => (
          <div key={m.l} className='bg-white/[0.03] border border-white/[0.06]
            rounded-xl p-2.5 text-center'>
            <p className='text-[10px] text-gray-600 mb-1'>{m.l}</p>
            <p className={`text-sm font-semibold tabular-nums ${m.c}`}>{m.v}</p>
          </div>
        ))}
      </div>
      <div className='rounded-xl border border-white/[0.06] overflow-hidden'>
        <div className='grid grid-cols-3 px-4 py-2 bg-white/[0.02] border-b border-white/[0.06]
          text-[10px] font-medium text-gray-600 uppercase tracking-wider'>
          <span>Ticker</span><span className='text-center'>A</span><span className='text-center'>B</span>
        </div>
        {positions.map(p => (
          <div key={p.ticker} className='grid grid-cols-3 px-4 py-2.5 border-b border-white/[0.04]
            last:border-0 text-xs'>
            <span className='font-semibold text-white'>{p.ticker}</span>
            <span className='text-center text-red-400 tabular-nums'>{p.a}</span>
            <span className={`text-center tabular-nums font-medium ${p.ticker === 'GLD' ? 'text-[#10B981]' : 'text-yellow-400'}`}>
              {p.b}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HealthPreview() {
  const dims = [
    { label: 'Drawdown severity', score: 4, max: 10 },
    { label: 'Liquidity risk',    score: 7, max: 10 },
    { label: 'Goal impact',       score: 5, max: 10 },
    { label: 'Diversification',   score: 8, max: 10 },
    { label: 'Recovery time',     score: 6, max: 10 },
  ]
  return (
    <div className='w-full max-w-sm'>
      <p className='text-xs font-medium text-gray-500 uppercase tracking-widest mb-4'>
        Portfolio health score
      </p>
      <div className='flex items-center gap-5 mb-6'>
        <div className='relative w-20 h-20 shrink-0'>
          <svg viewBox='0 0 36 36' className='w-full h-full -rotate-90'>
            <circle cx='18' cy='18' r='15.9' fill='none' stroke='rgba(255,255,255,0.06)' strokeWidth='3' />
            <circle cx='18' cy='18' r='15.9' fill='none' stroke='#F59E0B' strokeWidth='3'
              strokeDasharray={`${(6.2 / 10) * 100} 100`} strokeLinecap='round' />
          </svg>
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <span className='text-xl font-bold text-white leading-none'>6.2</span>
            <span className='text-[10px] text-gray-600'>/10</span>
          </div>
        </div>
        <div>
          <p className='text-sm font-semibold text-yellow-400 mb-1'>Moderate Risk</p>
          <p className='text-xs text-gray-500 leading-relaxed'>
            Portfolio shows elevated concentration in tech — action recommended before a rate shock.
          </p>
        </div>
      </div>
      <div className='space-y-2.5'>
        {dims.map(d => (
          <div key={d.label} className='flex items-center gap-3'>
            <span className='text-xs text-gray-500 w-32 shrink-0'>{d.label}</span>
            <div className='flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden'>
              <div className='h-full rounded-full'
                style={{
                  width: `${(d.score / d.max) * 100}%`,
                  background: d.score >= 7 ? '#10B981' : d.score >= 5 ? '#F59E0B' : '#EF4444',
                }} />
            </div>
            <span className='text-xs tabular-nums text-gray-500 w-8 text-right'>{d.score}/10</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ShocksPreview() {
  const sliders = [
    { label: 'Equity markets',  value: -35, min: -80, max: 0,  color: '#EF4444' },
    { label: 'Interest rates',  value: 300, min: 0,   max: 500, color: '#F59E0B' },
    { label: 'Credit spreads',  value: 400, min: 0,   max: 600, color: '#F59E0B' },
    { label: 'FX shock (USD+)', value: 15,  min: 0,   max: 30,  color: '#8B5CF6' },
    { label: 'Volatility (VIX)',value: 45,  min: 0,   max: 80,  color: '#06B6D4' },
    { label: 'Liquidity',       value: -40, min: -80, max: 0,  color: '#EF4444' },
  ]
  return (
    <div className='w-full max-w-sm'>
      <p className='text-xs font-medium text-gray-500 uppercase tracking-widest mb-4'>
        Custom shock sliders
      </p>
      <div className='space-y-3.5'>
        {sliders.map(s => {
          const pct = s.min < 0
            ? ((s.value - s.min) / (s.max - s.min)) * 100
            : (s.value / s.max) * 100
          const display = s.min < 0
            ? `${s.value}%`
            : `+${s.value}bps`
          return (
            <div key={s.label}>
              <div className='flex justify-between mb-1'>
                <span className='text-xs text-gray-500'>{s.label}</span>
                <span className='text-xs tabular-nums font-medium' style={{ color: s.color }}>
                  {display}
                </span>
              </div>
              <div className='h-1.5 rounded-full bg-white/[0.06] overflow-hidden'>
                <div className='h-full rounded-full transition-all duration-500'
                  style={{ width: `${pct}%`, background: s.color, opacity: 0.75 }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
