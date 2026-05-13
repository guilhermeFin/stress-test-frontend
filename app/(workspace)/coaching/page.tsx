'use client'

import { useState } from 'react'
import { TrendingDown, Calendar, MessageSquare, AlertTriangle, Copy, Check } from 'lucide-react'

// ── Tab definitions ───────────────────────────────────────────────────────────

const TABS = [
  { key: 'drawdown',  label: 'Drawdown Simulator', icon: TrendingDown },
  { key: 'timing',    label: 'Missed Best Days',   icon: Calendar },
  { key: 'scripts',   label: 'Advisor Scripts',    icon: MessageSquare },
  { key: 'premortem', label: 'Pre-Mortem',         icon: AlertTriangle },
] as const
type TabKey = typeof TABS[number]['key']

function fmt(n: number) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

// ── 1. Drawdown Simulator ─────────────────────────────────────────────────────

const SCENARIOS = [
  { label: '2008 GFC',           drawdown: -0.51, months_to_trough: 17, months_to_recovery: 42 },
  { label: 'COVID Crash (2020)', drawdown: -0.34, months_to_trough:  2, months_to_recovery:  6 },
  { label: 'Dot-Com Bust',       drawdown: -0.49, months_to_trough: 30, months_to_recovery: 86 },
  { label: '2022 Rate Shock',    drawdown: -0.25, months_to_trough: 12, months_to_recovery: 24 },
  { label: 'Black Monday (1987)',drawdown: -0.34, months_to_trough:  2, months_to_recovery: 24 },
  { label: 'Custom',             drawdown: -0.20, months_to_trough: 12, months_to_recovery: 24 },
]

function DrawdownSimulator() {
  const [portfolioValue, setPortfolioValue] = useState(2_000_000)
  const [scenarioIdx, setScenarioIdx]       = useState(0)
  const [customDrawdown, setCustomDrawdown]  = useState(20)

  const scenario = SCENARIOS[scenarioIdx]
  const drawdownPct = scenario.label === 'Custom' ? -customDrawdown / 100 : scenario.drawdown
  const trough   = portfolioValue * (1 + drawdownPct)
  const loss     = portfolioValue - trough
  const income4pct = portfolioValue * 0.04 / 12
  const troughIncome = trough * 0.04 / 12

  // Build simplified path: linear decline to trough, then recovery
  const totalMonths = scenario.months_to_trough + scenario.months_to_recovery
  const points: { m: number; v: number }[] = []
  for (let m = 0; m <= totalMonths; m++) {
    let v: number
    if (m <= scenario.months_to_trough) {
      v = portfolioValue + (trough - portfolioValue) * (m / scenario.months_to_trough)
    } else {
      const t = (m - scenario.months_to_trough) / scenario.months_to_recovery
      v = trough + (portfolioValue - trough) * t
    }
    points.push({ m, v })
  }

  const W = 480; const H = 160
  const PAD = { t: 12, r: 16, b: 28, l: 60 }
  const minV = Math.min(...points.map(p => p.v)) * 0.97
  const maxV = portfolioValue * 1.02
  const sx = (m: number) => PAD.l + (m / totalMonths) * (W - PAD.l - PAD.r)
  const sy = (v: number) => H - PAD.b - ((v - minV) / (maxV - minV)) * (H - PAD.t - PAD.b)
  const d  = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.m).toFixed(1)},${sy(p.v).toFixed(1)}`).join(' ')
  const area = `${d} L${sx(totalMonths).toFixed(1)},${(H - PAD.b).toFixed(1)} L${PAD.l},${(H - PAD.b).toFixed(1)} Z`
  const troughX = sx(scenario.months_to_trough)
  const troughY = sy(trough)

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Inputs */}
        <div className='space-y-4 bg-white border border-slate-200 rounded-lg p-5'>
          <h3 className='text-sm font-semibold text-[#0B1B2E]'>Inputs</h3>
          <div>
            <label className='text-xs text-slate-600 mb-1.5 block font-medium'>Portfolio value</label>
            <div className='flex items-center gap-2'>
              <span className='text-slate-400 text-sm'>$</span>
              <input
                type='number' step={100000} min={10000}
                value={portfolioValue}
                onChange={e => setPortfolioValue(Number(e.target.value))}
                className='flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2
                  text-sm text-[#0B1B2E] focus:outline-none focus:ring-1 focus:ring-[#2563EB]
                  focus:border-[#2563EB] transition-colors'
              />
            </div>
          </div>
          <div>
            <label className='text-xs text-slate-600 mb-1.5 block font-medium'>Crisis scenario</label>
            <select
              value={scenarioIdx}
              onChange={e => setScenarioIdx(Number(e.target.value))}
              className='w-full bg-white border border-slate-200 rounded-lg px-3 py-2
                text-sm text-[#0B1B2E] focus:outline-none focus:ring-1 focus:ring-[#2563EB]
                focus:border-[#2563EB] transition-colors'
            >
              {SCENARIOS.map((s, i) => <option key={s.label} value={i}>{s.label}</option>)}
            </select>
          </div>
          {scenario.label === 'Custom' && (
            <div>
              <div className='flex justify-between text-xs mb-1.5'>
                <span className='text-slate-600'>Drawdown</span>
                <span className='font-bold text-[#B91C1C]'>-{customDrawdown}%</span>
              </div>
              <input type='range' min={5} max={60} value={customDrawdown}
                onChange={e => setCustomDrawdown(Number(e.target.value))}
                className='w-full accent-red-500' />
            </div>
          )}
        </div>

        {/* Impact summary */}
        <div className='bg-red-50 border border-red-100 rounded-lg p-5 space-y-3'>
          <h3 className='text-sm font-semibold text-[#0B1B2E]'>Client impact in dollars</h3>
          {[
            { label: 'Portfolio before crisis',  value: fmt(portfolioValue), color: 'text-[#0B1B2E]' },
            { label: 'Value at trough',           value: fmt(trough),         color: 'text-[#B91C1C]' },
            { label: 'Dollar loss at bottom',     value: `-${fmt(loss)}`,     color: 'text-[#B91C1C]' },
            { label: 'Monthly income before (4%)',value: fmt(income4pct) + '/mo',  color: 'text-[#0B1B2E]' },
            { label: 'Monthly income at trough',  value: fmt(troughIncome) + '/mo', color: 'text-amber-600' },
            { label: 'Income shortfall',          value: `-${fmt(income4pct - troughIncome)}/mo`, color: 'text-[#B91C1C]' },
          ].map(({ label, value, color }) => (
            <div key={label} className='flex justify-between text-sm'>
              <span className='text-slate-600'>{label}</span>
              <span className={`font-semibold tabular-nums ${color}`}>{value}</span>
            </div>
          ))}
          <div className='border-t border-red-100 pt-2 text-xs text-slate-500'>
            Recovery: ~{scenario.months_to_recovery} months from trough (historical avg)
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className='bg-white border border-slate-200 rounded-lg p-4'>
        <p className='text-xs text-slate-500 mb-3'>Portfolio value over crisis &amp; recovery period</p>
        <svg viewBox={`0 0 ${W} ${H}`} className='w-full'>
          <defs>
            <linearGradient id='ddGrad' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#3B82F6' stopOpacity='0.15' />
              <stop offset='100%' stopColor='#3B82F6' stopOpacity='0.02' />
            </linearGradient>
          </defs>
          <clipPath id='ddClip'>
            <rect x={PAD.l} y={PAD.t} width={troughX - PAD.l} height={H - PAD.t - PAD.b} />
          </clipPath>
          <path d={area} fill='url(#ddGrad)' />
          <path d={area} fill='#EF4444' opacity='0.06' clipPath='url(#ddClip)' />
          <path d={d} stroke='#3B82F6' strokeWidth='1.5' fill='none' />
          {/* Trough marker */}
          <circle cx={troughX} cy={troughY} r={4} fill='#EF4444' />
          <line x1={troughX} y1={PAD.t} x2={troughX} y2={H - PAD.b}
            stroke='#EF4444' strokeWidth='1' strokeDasharray='3 2' opacity='0.4' />
          <text x={troughX + 4} y={troughY - 6} fontSize={9} fill='#B91C1C'>
            {(drawdownPct * 100).toFixed(0)}% loss
          </text>
          {/* Y ticks */}
          {[0, 0.5, 1].map(f => {
            const v = minV + f * (maxV - minV)
            const y = sy(v)
            return (
              <g key={f}>
                <text x={PAD.l - 4} y={y + 4} textAnchor='end' fontSize={9} fill='#94a3b8'>{fmt(v)}</text>
                <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke='#e2e8f0' strokeWidth='1' />
              </g>
            )
          })}
          {/* X labels */}
          <text x={PAD.l} y={H - 4} textAnchor='middle' fontSize={9} fill='#94a3b8'>Start</text>
          <text x={troughX} y={H - 4} textAnchor='middle' fontSize={9} fill='#94a3b8'>Trough</text>
          <text x={W - PAD.r} y={H - 4} textAnchor='end' fontSize={9} fill='#94a3b8'>Recovery</text>
        </svg>
      </div>
    </div>
  )
}

// ── 2. Missed Best Days ───────────────────────────────────────────────────────

const MISSED_DAYS_DATA = [
  { missed: 0,   value: 61_685, return: 9.7  },
  { missed: 10,  value: 28_260, return: 5.5  },
  { missed: 20,  value: 17_826, return: 2.9  },
  { missed: 30,  value: 11_950, return: 0.9  },
  { missed: 40,  value:  8_288, return: -0.9 },
  { missed: 50,  value:  5_943, return: -2.5 },
  { missed: 60,  value:  4_391, return: -4.0 },
]

function MissedBestDays() {
  const base = MISSED_DAYS_DATA[0].value
  return (
    <div className='space-y-4'>
      <div className='bg-white border border-slate-200 rounded-lg p-5'>
        <h3 className='text-sm font-semibold text-[#0B1B2E] mb-1'>The cost of missing the market&apos;s best days</h3>
        <p className='text-xs text-slate-500 mb-5'>
          $10,000 invested in the S&amp;P 500 (2003–2023). The majority of the best days occur
          within two weeks of the worst days — which is why staying invested matters.
        </p>
        <div className='space-y-2'>
          {MISSED_DAYS_DATA.map(row => (
            <div key={row.missed} className='flex items-center gap-3'>
              <div className='w-36 shrink-0'>
                <p className='text-xs text-[#0B1B2E] font-medium'>
                  {row.missed === 0 ? 'Fully invested' : `Miss ${row.missed} best days`}
                </p>
                <p className={`text-[10px] tabular-nums font-semibold ${row.return >= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'}`}>
                  {row.return >= 0 ? '+' : ''}{row.return.toFixed(1)}% / yr
                </p>
              </div>
              <div className='flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden'>
                <div
                  className='h-full rounded-lg transition-all'
                  style={{
                    width: `${(row.value / base) * 100}%`,
                    background: row.missed === 0 ? '#3B82F6' : row.return >= 0 ? '#10B981' : '#EF4444',
                    opacity: row.missed === 0 ? 1 : 0.7,
                  }}
                />
              </div>
              <p className='text-sm font-bold tabular-nums w-20 text-right text-[#0B1B2E]'>
                {fmt(row.value)}
              </p>
            </div>
          ))}
        </div>
        <p className='text-[10px] text-slate-400 mt-4'>
          Source: JPMorgan Asset Management. Past performance does not guarantee future results.
          AI-assisted — verify before client delivery.
        </p>
      </div>

      <div className='bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800 leading-relaxed'>
        <strong>Talking point:</strong> &ldquo;The ten best days of the last twenty years — the days your portfolio recovered the most — mostly happened within two weeks of the ten worst days. Missing them means missing the recovery. The risk of being out of the market is just as real as the risk of being in it.&rdquo;
      </div>
    </div>
  )
}

// ── 3. Advisor Script Library ─────────────────────────────────────────────────

const SCRIPTS: { scenario: string; trigger: string; points: string[] }[] = [
  {
    scenario: 'Market is down sharply',
    trigger:  'Client calls panicked after a 10%+ drop',
    points: [
      'Your plan was built for exactly this. We stress-tested a scenario like this before — the portfolio held up within your target range.',
      'Selling now locks in the loss permanently. Staying invested is how you participate in the recovery.',
      'The last three major crashes — 2008, 2020, 2022 — all recovered to new highs within 18–48 months. Patience has always been rewarded.',
      'Let\'s look at your actual dollar position, not a percentage. Your spending needs for the next two years are in cash and short-term bonds — those haven\'t moved.',
      'The advisors who helped clients the most during 2008 and 2020 were the ones who stayed on the phone, kept calm, and didn\'t make panic moves.',
    ],
  },
  {
    scenario: 'Rates are rising fast',
    trigger:  'Client worried about bond losses or mortgage rates',
    points: [
      'Rising rates hurt bonds in the short term, but your fixed income ladder was built to mature and reinvest at higher rates — that\'s actually good for long-term income.',
      'Short-duration bonds have minimal price sensitivity. Your exposure to long-duration bonds is limited specifically for this reason.',
      'Higher rates mean your cash earns more. Money market and short-term treasuries are paying the most in 15 years.',
      'If you hold a bond to maturity, you get your principal back regardless of what rates do in between.',
      'Rate shocks are temporary. The Fed has a 40-year history of cutting rates when the economy slows — this environment will change.',
    ],
  },
  {
    scenario: 'Inflation is eroding purchasing power',
    trigger:  'Client worried their savings won\'t keep up',
    points: [
      'Your equity holdings are one of the best long-term inflation hedges ever created. Businesses raise prices when inflation rises — their profits and stock values follow.',
      'TIPS and commodities in your portfolio are specifically designed to track inflation. They\'re doing their job.',
      'Real estate exposure through REITs provides a direct inflation hedge — rents and property values tend to rise with prices.',
      'The worst inflation hedge is cash. Staying invested is the answer, not moving to the sideline.',
      'Historically, a diversified portfolio has outpaced inflation over every 10-year rolling period since 1950.',
    ],
  },
  {
    scenario: 'Client wants to go to cash',
    trigger:  'Client says "I just want to get out until things calm down"',
    points: [
      'The challenge with that strategy: you have to be right twice — when to get out and when to get back in. Almost nobody is.',
      'Every major market bottom in history looked terrifying in the moment. The investors who got back in at the right time weren\'t brave — they were just still invested.',
      'If we went to cash today, what would have to happen for you to feel comfortable reinvesting? Let\'s talk about that signal specifically.',
      'Taxes: if this is a taxable account, selling now crystallizes a taxable gain. That\'s a real, immediate cost versus a paper loss that has always recovered.',
      'Your plan has a buffer — let\'s look at how long your liquid reserves last. You don\'t need the invested portion for [X] years.',
    ],
  },
  {
    scenario: 'Recession fears',
    trigger:  'Client worried economy is heading into recession',
    points: [
      'Markets lead the economy by 6–9 months. By the time a recession is officially declared, markets are often already recovering.',
      'Your portfolio has defensive exposure — dividend equities, short bonds, cash — that tend to hold up better in economic slowdowns.',
      'Recessions are normal. Since 1950 there have been 12 recessions — the average lasted 11 months and was followed by a multi-year expansion.',
      'If a recession hits, the Fed will likely cut rates. That benefits your bond holdings and lowers the hurdle rate for stocks.',
      'Your goal isn\'t to avoid recessions — it\'s to fund your retirement / [goal]. The plan accounts for multiple recessions between now and then.',
    ],
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className='p-1.5 rounded-md text-slate-400 hover:text-[#0B1B2E] hover:bg-slate-100 transition-colors shrink-0'
    >
      {copied ? <Check size={12} className='text-[#15803D]' /> : <Copy size={12} />}
    </button>
  )
}

function AdvisorScripts() {
  const [active, setActive] = useState(0)
  const script = SCRIPTS[active]
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {/* Scenario picker */}
      <div className='space-y-1'>
        {SCRIPTS.map((s, i) => (
          <button key={s.scenario} onClick={() => setActive(i)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors
              ${active === i
                ? 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 font-medium'
                : 'text-slate-600 hover:text-[#0B1B2E] hover:bg-slate-50'}`}>
            {s.scenario}
          </button>
        ))}
      </div>

      {/* Script content */}
      <div className='md:col-span-2 bg-white border border-slate-200 rounded-lg p-5'>
        <div className='mb-4'>
          <h3 className='text-sm font-semibold text-[#0B1B2E]'>{script.scenario}</h3>
          <p className='text-xs text-slate-500 mt-1 italic'>&ldquo;{script.trigger}&rdquo;</p>
        </div>
        <div className='space-y-3'>
          {script.points.map((point, i) => (
            <div key={i} className='flex items-start gap-3 group'>
              <span className='w-5 h-5 rounded-full bg-[#2563EB]/10 flex items-center justify-center
                text-[10px] font-bold text-[#2563EB] shrink-0 mt-0.5'>
                {i + 1}
              </span>
              <p className='text-sm text-slate-700 leading-relaxed flex-1'>{point}</p>
              <CopyButton text={point} />
            </div>
          ))}
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(script.points.join('\n\n'))}
          className='mt-4 flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0B1B2E]
            border border-slate-200 hover:border-slate-300 rounded-md px-3 py-1.5 transition-colors bg-white'
        >
          <Copy size={11} /> Copy all talking points
        </button>
      </div>
    </div>
  )
}

// ── 4. Pre-Mortem Template ────────────────────────────────────────────────────

const PREMORTEM_SECTIONS = [
  {
    heading: 'Scenario: Markets fall 30% over 12 months',
    prompt: 'How would your client likely respond? What would they say? What\'s your plan for that conversation?',
    placeholder: 'e.g., "Client would likely call demanding we go to cash. I\'d walk through the stress test results we ran together and remind them their cash buffer covers 2 years of spending..."',
  },
  {
    heading: 'Scenario: A concentrated position drops 50%',
    prompt: 'Which single holding poses the most risk? What\'s the plan if it collapses?',
    placeholder: 'e.g., "Largest single position is AAPL at 14% of the portfolio. If it dropped 50%, we\'d rebalance and use TLH to offset gains elsewhere..."',
  },
  {
    heading: 'What\'s the weakest part of this plan?',
    prompt: 'If this investment plan fails, what\'s most likely to cause it?',
    placeholder: 'e.g., "Sequence-of-returns risk in the first five years of retirement. Mitigated by two-year cash buffer and flexible withdrawal rate..."',
  },
  {
    heading: 'What would cause the client to fire us?',
    prompt: 'What failure of communication, performance, or service would break the relationship?',
    placeholder: 'e.g., "Underperforming their neighbor by more than 10% for two years in a row without us proactively explaining why..."',
  },
  {
    heading: 'What\'s the client\'s biggest behavioral risk?',
    prompt: 'What emotion or bias is most likely to cause them to sabotage their own plan?',
    placeholder: 'e.g., "Recency bias — they extrapolate recent returns. After a bad year they\'ll want to reduce equity. After a good year they\'ll want to add leverage..."',
  },
]

function PreMortem() {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  return (
    <div className='space-y-4'>
      <div className='bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800'>
        A pre-mortem imagines the plan has already failed and works backward to identify why. Complete this before every annual review — it surfaces risks before they become problems.
      </div>
      {PREMORTEM_SECTIONS.map((s, i) => (
        <div key={i} className='bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors'>
          <h3 className='text-sm font-semibold text-[#0B1B2E] mb-1'>{s.heading}</h3>
          <p className='text-xs text-slate-500 mb-3 italic'>{s.prompt}</p>
          <textarea
            value={answers[i] ?? ''}
            onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))}
            rows={3}
            placeholder={s.placeholder}
            className='w-full bg-slate-50 border border-slate-200 rounded-lg p-3
              text-sm text-[#0B1B2E] placeholder:text-slate-400 resize-none
              focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-colors'
          />
        </div>
      ))}
      <button
        onClick={() => {
          const text = PREMORTEM_SECTIONS.map((s, i) => `${s.heading}\n\n${answers[i] ?? '(not completed)'}`).join('\n\n---\n\n')
          navigator.clipboard.writeText(text)
        }}
        className='flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0B1B2E]
          border border-slate-200 hover:border-slate-300 rounded-md px-3 py-1.5 transition-colors bg-white'
      >
        <Copy size={11} /> Copy full pre-mortem to clipboard
      </button>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CoachingPage() {
  const [tab, setTab] = useState<TabKey>('drawdown')

  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>

      {/* Page header */}
      <div className='border-b border-slate-200 pb-6 mb-6'>
        <p className='text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-1'>TOOLS</p>
        <h1 className='text-3xl font-bold text-[#0B1B2E] tracking-tight mb-1'>Behavioral Coaching</h1>
        <p className='text-base text-slate-600'>
          Tools for advisors to keep clients on plan when emotions run high.
        </p>
      </div>

      {/* Tab bar — underline style */}
      <div className='border-b border-slate-200 mb-6'>
        <div className='flex gap-8'>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 pb-3 text-sm font-medium border-b-2 -mb-px
                transition-colors
                ${tab === key
                  ? 'border-[#2563EB] text-[#0B1B2E] font-semibold'
                  : 'border-transparent text-slate-600 hover:text-[#0B1B2E]'}`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'drawdown'  && <DrawdownSimulator />}
      {tab === 'timing'    && <MissedBestDays />}
      {tab === 'scripts'   && <AdvisorScripts />}
      {tab === 'premortem' && <PreMortem />}
    </div>
  )
}
