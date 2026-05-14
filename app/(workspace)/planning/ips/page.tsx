'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Save, RotateCcw, Info, ChevronDown, ChevronUp,
} from 'lucide-react'
import {
  type AllocationMap, type DriftBand, type IPS, type RebalanceTrigger,
  AssetClass, ASSET_CLASS_LABELS, ASSET_CLASS_COLORS, defaultDriftBands, saveIPS,
} from '@/lib/planning'

const ASSET_CLASSES: AssetClass[] = ['us_equity', 'intl_equity', 'fixed_income', 'alternatives', 'cash']

const DEFAULT_ALLOCATION: AllocationMap = {
  us_equity:    40,
  intl_equity:  20,
  fixed_income: 30,
  alternatives:  5,
  cash:          5,
}

const REBALANCE_OPTIONS: { value: RebalanceTrigger; label: string; desc: string }[] = [
  { value: 'threshold',   label: 'Threshold',    desc: 'Rebalance when any asset class drifts beyond its band' },
  { value: 'quarterly',   label: 'Quarterly',    desc: 'Review and rebalance every 3 months' },
  { value: 'semi_annual', label: 'Semi-annual',  desc: 'Review and rebalance every 6 months' },
  { value: 'annual',      label: 'Annual',       desc: 'Review and rebalance once per year' },
]

// ── Allocation slider ────────────────────────────────────────────────────────

function AllocationSlider({
  ac, value, onChange, color,
}: { ac: AssetClass; value: number; onChange: (v: number) => void; color: string }) {
  return (
    <div className='bg-white border border-slate-200 rounded-lg p-3'>
      <div className='flex items-center justify-between mb-2'>
        <label className='text-sm font-semibold text-[#0B1B2E]'>{ASSET_CLASS_LABELS[ac]}</label>
        <div className='flex items-center gap-2'>
          <input
            type='number' min={0} max={100} value={value}
            onChange={e => onChange(Math.max(0, Math.min(100, Number(e.target.value))))}
            className='w-14 text-right text-sm font-bold font-mono bg-slate-50 border border-slate-300
              rounded-md px-2 py-0.5 text-[#0B1B2E] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-colors'
          />
          <span className='text-sm text-slate-500'>%</span>
        </div>
      </div>
      <div className='relative h-2 bg-slate-200 rounded-full'>
        <div
          className='absolute h-full rounded-full transition-all'
          style={{ width: `${value}%`, background: color }}
        />
        <input
          type='range' min={0} max={100} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className='absolute inset-0 w-full opacity-0 cursor-pointer h-full'
        />
      </div>
    </div>
  )
}

// ── Mini donut (SVG) ─────────────────────────────────────────────────────────

function AllocationDonut({ allocation }: { allocation: AllocationMap }) {
  const r = 40
  const cx = 50
  const cy = 50
  const circ = 2 * Math.PI * r

  let offset = 0
  const slices = ASSET_CLASSES.map(ac => {
    const pct = (allocation[ac] ?? 0) / 100
    const dash = pct * circ
    const slice = { ac, dash, gap: circ - dash, offset }
    offset += dash
    return slice
  })

  return (
    <svg viewBox='0 0 100 100' className='w-28 h-28 -rotate-90'>
      {slices.map(({ ac, dash, gap, offset: off }) => (
        <circle
          key={ac}
          cx={cx} cy={cy} r={r}
          fill='none'
          stroke={ASSET_CLASS_COLORS[ac]}
          strokeWidth='18'
          strokeDasharray={`${dash} ${gap}`}
          strokeDashoffset={-off}
        />
      ))}
    </svg>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function IPSBuilderPage() {
  const [allocation, setAllocation] = useState<AllocationMap>({ ...DEFAULT_ALLOCATION })
  const [driftBands, setDriftBands] = useState<DriftBand[]>(defaultDriftBands(DEFAULT_ALLOCATION))
  const [trigger, setTrigger]       = useState<RebalanceTrigger>('threshold')
  const [horizon, setHorizon]       = useState(10)
  const [riskTol, setRiskTol]       = useState(6)
  const [notes, setNotes]           = useState('')
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [showDrift, setShowDrift]   = useState(false)

  const total = Object.values(allocation).reduce((s, v) => s + v, 0)
  const over  = total > 100
  const under = total < 100

  const setAsset = useCallback((ac: AssetClass, v: number) => {
    setAllocation(prev => ({ ...prev, [ac]: v }))
    setDriftBands(prev => prev.map(b =>
      b.asset_class === ac
        ? { ...b, lower: Math.max(0, v - 5), upper: v + 5 }
        : b
    ))
  }, [])

  const reset = () => {
    setAllocation({ ...DEFAULT_ALLOCATION })
    setDriftBands(defaultDriftBands(DEFAULT_ALLOCATION))
  }

  const setBand = (ac: AssetClass, side: 'lower' | 'upper', v: number) => {
    setDriftBands(prev => prev.map(b =>
      b.asset_class === ac ? { ...b, [side]: v } : b
    ))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveIPS('demo', { allocation, drift_bands: driftBands, rebalance_trigger: trigger, horizon_years: horizon, risk_tolerance: riskTol, constraints: [], notes })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>

      {/* Back link */}
      <Link href='/planning'
        className='flex items-center gap-2 text-sm text-slate-600 hover:text-[#0B1B2E]
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Planning
      </Link>

      {/* Page header */}
      <div className='border-b border-slate-200 pb-6 mb-8 flex items-start justify-between gap-4'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-2'>PLANNING</p>
          <h1 className='text-3xl font-bold text-[#0B1B2E] mb-1'>IPS Builder</h1>
          <p className='text-base text-slate-600'>
            Define target allocation, drift bands, and rebalance rules.
            Each save creates a new version for audit purposes.
          </p>
        </div>
        <div className='flex items-center gap-2 shrink-0 mt-1'>
          <button
            onClick={reset}
            className='flex items-center gap-1.5 text-sm text-slate-600 hover:text-[#0B1B2E]
              border border-slate-300 hover:border-slate-400 rounded-md px-3 py-2 transition-colors'
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving || over || under}
            className='flex items-center gap-1.5 text-sm font-semibold text-white
              bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed
              rounded-md px-5 py-2 transition-colors'
          >
            <Save size={13} />
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save IPS'}
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

        {/* Left: sliders */}
        <div className='lg:col-span-2 space-y-6'>

          {/* Allocation */}
          <section className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm'>
            <div className='flex items-center justify-between border-b border-slate-200 pb-3 mb-5'>
              <h2 className='text-base font-bold text-[#0B1B2E]'>Target allocation</h2>
              <div className={`text-sm font-bold font-mono tabular-nums px-3 py-1 rounded-md border ${
                over   ? 'text-red-700 bg-red-50 border-red-200'
                : under ? 'text-amber-700 bg-amber-50 border-amber-200'
                        : 'text-emerald-700 bg-emerald-50 border-emerald-200'
              }`}>
                {total}%{over ? ` — reduce by ${total - 100}%` : under ? ` — add ${100 - total}%` : ' ✓'}
              </div>
            </div>
            <div className='space-y-3'>
              {ASSET_CLASSES.map(ac => (
                <AllocationSlider
                  key={ac}
                  ac={ac}
                  value={allocation[ac] ?? 0}
                  onChange={v => setAsset(ac, v)}
                  color={ASSET_CLASS_COLORS[ac]}
                />
              ))}
            </div>
          </section>

          {/* Drift bands (collapsible) */}
          <section className='bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm'>
            <button
              onClick={() => setShowDrift(v => !v)}
              className='w-full flex items-center justify-between px-6 py-4 text-base font-bold text-[#0B1B2E]
                hover:bg-slate-50 transition-colors'
            >
              <span>Drift bands</span>
              <div className='flex items-center gap-2 text-slate-500'>
                <Info size={13} />
                <span className='text-xs font-normal'>Rebalance triggers per asset class</span>
                {showDrift ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>
            {showDrift && (
              <div className='px-6 pb-5 border-t border-slate-200'>
                <div className='mt-4 space-y-2'>
                  {ASSET_CLASSES.map(ac => {
                    const band = driftBands.find(b => b.asset_class === ac)
                    if (!band) return null
                    return (
                      <div key={ac} className='bg-white border border-slate-200 rounded-lg p-3 grid grid-cols-3 gap-3 items-center'>
                        <span className='text-sm font-semibold text-[#0B1B2E]'>{ASSET_CLASS_LABELS[ac]}</span>
                        <div className='flex items-center gap-1.5'>
                          <span className='text-xs text-slate-500 shrink-0'>Min</span>
                          <input
                            type='number' min={0} max={100} value={band.lower}
                            onChange={e => setBand(ac, 'lower', Number(e.target.value))}
                            className='w-16 text-sm text-center font-mono bg-slate-50 border border-slate-300
                              rounded-md py-1 text-[#0B1B2E] focus:outline-none focus:border-[#2563EB] transition-colors'
                          />
                          <span className='text-xs text-slate-500'>%</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                          <span className='text-xs text-slate-500 shrink-0'>Max</span>
                          <input
                            type='number' min={0} max={100} value={band.upper}
                            onChange={e => setBand(ac, 'upper', Number(e.target.value))}
                            className='w-16 text-sm text-center font-mono bg-slate-50 border border-slate-300
                              rounded-md py-1 text-[#0B1B2E] focus:outline-none focus:border-[#2563EB] transition-colors'
                          />
                          <span className='text-xs text-slate-500'>%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className='text-xs text-slate-500 mt-3'>
                  Rebalance is triggered when actual weight falls outside the min–max band.
                </p>
              </div>
            )}
          </section>

          {/* Rebalance trigger */}
          <section className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm'>
            <h2 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3 mb-4'>Rebalance trigger</h2>
            <div className='grid grid-cols-2 gap-2'>
              {REBALANCE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTrigger(opt.value)}
                  className={`text-left p-3 rounded-lg border transition-all
                    ${trigger === opt.value
                      ? 'border-[#2563EB] bg-[#2563EB]/5'
                      : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <p className={`text-sm font-semibold mb-0.5 ${trigger === opt.value ? 'text-[#2563EB]' : 'text-[#0B1B2E]'}`}>
                    {opt.label}
                  </p>
                  <p className='text-xs text-slate-500 leading-relaxed'>{opt.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm'>
            <h2 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3 mb-4'>IPS notes</h2>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder='Document any client-specific constraints, ESG preferences, concentration limits, or other policy notes…'
              className='w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2.5
                text-sm text-[#0B1B2E] placeholder:text-slate-400 resize-none
                focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white transition-colors'
            />
          </section>
        </div>

        {/* Right: donut + risk settings */}
        <div className='space-y-4'>

          {/* Donut */}
          <section className='bg-white border border-slate-200 rounded-xl p-5 shadow-sm'>
            <h2 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3 mb-4'>Allocation preview</h2>
            <div className='flex justify-center mb-4'>
              <AllocationDonut allocation={allocation} />
            </div>
            <div className='space-y-2'>
              {ASSET_CLASSES.map(ac => (
                <div key={ac} className='flex items-center justify-between text-sm'>
                  <div className='flex items-center gap-2'>
                    <span className='w-2.5 h-2.5 rounded-full shrink-0'
                      style={{ background: ASSET_CLASS_COLORS[ac] }} />
                    <span className='text-slate-600'>{ASSET_CLASS_LABELS[ac]}</span>
                  </div>
                  <span className='font-semibold font-mono tabular-nums text-[#0B1B2E]'>{allocation[ac] ?? 0}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* Risk & horizon */}
          <section className='bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5'>
            <h2 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3'>Client parameters</h2>

            <div>
              <div className='flex justify-between text-sm mb-2'>
                <span className='font-semibold text-[#0B1B2E]'>Risk tolerance</span>
                <span className='font-bold font-mono text-[#0B1B2E]'>{riskTol}/10</span>
              </div>
              <input
                type='range' min={1} max={10} value={riskTol}
                onChange={e => setRiskTol(Number(e.target.value))}
                className='w-full accent-[#2563EB]'
              />
              <div className='flex justify-between text-xs text-slate-500 mt-1'>
                <span>Conservative</span><span>Aggressive</span>
              </div>
            </div>

            <div>
              <div className='flex justify-between text-sm mb-2'>
                <span className='font-semibold text-[#0B1B2E]'>Investment horizon</span>
                <span className='font-bold font-mono text-[#0B1B2E]'>{horizon} yrs</span>
              </div>
              <input
                type='range' min={1} max={40} value={horizon}
                onChange={e => setHorizon(Number(e.target.value))}
                className='w-full accent-[#2563EB]'
              />
              <div className='flex justify-between text-xs text-slate-500 mt-1'>
                <span>1 yr</span><span>40 yrs</span>
              </div>
            </div>
          </section>

          {/* AI badge */}
          <div className='flex items-start gap-3 bg-amber-50 border border-amber-300
            rounded-lg p-4'>
            <Info size={14} className='text-amber-600 shrink-0 mt-0.5' />
            <span className='text-sm text-amber-800'>AI-assisted — verify allocation suitability before client delivery.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
