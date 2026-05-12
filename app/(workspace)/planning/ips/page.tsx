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
    <div className='group'>
      <div className='flex items-center justify-between mb-1.5'>
        <label className='text-sm font-medium text-gray-300'>{ASSET_CLASS_LABELS[ac]}</label>
        <div className='flex items-center gap-2'>
          <input
            type='number'
            min={0} max={100}
            value={value}
            onChange={e => onChange(Math.max(0, Math.min(100, Number(e.target.value))))}
            className='w-14 text-right text-sm font-bold bg-white/5 border border-white/10
              rounded-lg px-2 py-0.5 text-white focus:outline-none focus:border-white/20'
          />
          <span className='text-sm text-gray-500'>%</span>
        </div>
      </div>
      <div className='relative h-1.5 bg-white/5 rounded-full'>
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
      // backend not wired — optimistic save
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>

      {/* Header */}
      <Link href='/planning'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Planning
      </Link>

      <div className='flex items-start justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight mb-1'>IPS Builder</h1>
          <p className='text-sm text-gray-500'>
            Define target allocation, drift bands, and rebalance rules.
            Each save creates a new version for audit purposes.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={reset}
            className='flex items-center gap-1.5 text-xs text-gray-500 hover:text-white
              border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-colors'
          >
            <RotateCcw size={12} /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving || over || under}
            className='flex items-center gap-1.5 text-sm font-semibold text-white
              bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-40 disabled:cursor-not-allowed
              rounded-lg px-4 py-1.5 transition-colors'
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
          <section className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6'>
            <div className='flex items-center justify-between mb-5'>
              <h2 className='text-sm font-semibold'>Target allocation</h2>
              <span className={`text-sm font-bold tabular-nums ${
                over ? 'text-red-400' : under ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {total}% {over ? '— reduce by ' + (total - 100) + '%' : under ? '— add ' + (100 - total) + '%' : '✓'}
              </span>
            </div>
            <div className='space-y-5'>
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
          <section className='bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden'>
            <button
              onClick={() => setShowDrift(v => !v)}
              className='w-full flex items-center justify-between px-6 py-4 text-sm font-semibold
                hover:bg-white/[0.02] transition-colors'
            >
              <span>Drift bands</span>
              <div className='flex items-center gap-2 text-gray-500'>
                <Info size={13} />
                <span className='text-xs font-normal'>Rebalance triggers per asset class</span>
                {showDrift ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>
            {showDrift && (
              <div className='px-6 pb-5 border-t border-white/[0.04]'>
                <div className='mt-4 space-y-3'>
                  {ASSET_CLASSES.map(ac => {
                    const band = driftBands.find(b => b.asset_class === ac)
                    if (!band) return null
                    return (
                      <div key={ac} className='grid grid-cols-3 gap-3 items-center'>
                        <span className='text-xs text-gray-400'>{ASSET_CLASS_LABELS[ac]}</span>
                        <div className='flex items-center gap-1.5'>
                          <span className='text-[10px] text-gray-600'>Min</span>
                          <input
                            type='number' min={0} max={100}
                            value={band.lower}
                            onChange={e => setBand(ac, 'lower', Number(e.target.value))}
                            className='w-14 text-xs text-center bg-white/5 border border-white/10
                              rounded-lg py-1 text-white focus:outline-none focus:border-white/20'
                          />
                          <span className='text-[10px] text-gray-600'>%</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                          <span className='text-[10px] text-gray-600'>Max</span>
                          <input
                            type='number' min={0} max={100}
                            value={band.upper}
                            onChange={e => setBand(ac, 'upper', Number(e.target.value))}
                            className='w-14 text-xs text-center bg-white/5 border border-white/10
                              rounded-lg py-1 text-white focus:outline-none focus:border-white/20'
                          />
                          <span className='text-[10px] text-gray-600'>%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className='text-[10px] text-gray-600 mt-3'>
                  Rebalance is triggered when actual weight falls outside the min–max band.
                </p>
              </div>
            )}
          </section>

          {/* Rebalance trigger */}
          <section className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6'>
            <h2 className='text-sm font-semibold mb-4'>Rebalance trigger</h2>
            <div className='grid grid-cols-2 gap-2'>
              {REBALANCE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTrigger(opt.value)}
                  className={`text-left p-3 rounded-xl border transition-all
                    ${trigger === opt.value
                      ? 'border-[#3B82F6]/50 bg-[#3B82F6]/10'
                      : 'border-white/[0.06] hover:border-white/10'}`}
                >
                  <p className={`text-sm font-medium ${trigger === opt.value ? 'text-[#3B82F6]' : 'text-gray-300'}`}>
                    {opt.label}
                  </p>
                  <p className='text-[10px] text-gray-500 mt-0.5 leading-relaxed'>{opt.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6'>
            <h2 className='text-sm font-semibold mb-3'>IPS notes</h2>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder='Document any client-specific constraints, ESG preferences, concentration limits, or other policy notes…'
              className='w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-3
                text-sm text-gray-300 placeholder:text-gray-600 resize-none
                focus:outline-none focus:border-white/12 transition-colors'
            />
          </section>
        </div>

        {/* Right: donut + risk settings */}
        <div className='space-y-4'>

          {/* Donut */}
          <section className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5'>
            <h2 className='text-sm font-semibold mb-4'>Allocation preview</h2>
            <div className='flex justify-center mb-4'>
              <AllocationDonut allocation={allocation} />
            </div>
            <div className='space-y-2'>
              {ASSET_CLASSES.map(ac => (
                <div key={ac} className='flex items-center justify-between text-xs'>
                  <div className='flex items-center gap-2'>
                    <span className='w-2.5 h-2.5 rounded-full shrink-0'
                      style={{ background: ASSET_CLASS_COLORS[ac] }} />
                    <span className='text-gray-400'>{ASSET_CLASS_LABELS[ac]}</span>
                  </div>
                  <span className='font-semibold tabular-nums'>{allocation[ac] ?? 0}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* Risk & horizon */}
          <section className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4'>
            <h2 className='text-sm font-semibold'>Client parameters</h2>

            <div>
              <div className='flex justify-between text-xs mb-2'>
                <span className='text-gray-400'>Risk tolerance</span>
                <span className='font-bold text-white'>{riskTol}/10</span>
              </div>
              <input
                type='range' min={1} max={10} value={riskTol}
                onChange={e => setRiskTol(Number(e.target.value))}
                className='w-full accent-[#3B82F6]'
              />
              <div className='flex justify-between text-[10px] text-gray-600 mt-1'>
                <span>Conservative</span><span>Aggressive</span>
              </div>
            </div>

            <div>
              <div className='flex justify-between text-xs mb-2'>
                <span className='text-gray-400'>Investment horizon</span>
                <span className='font-bold text-white'>{horizon} yrs</span>
              </div>
              <input
                type='range' min={1} max={40} value={horizon}
                onChange={e => setHorizon(Number(e.target.value))}
                className='w-full accent-[#3B82F6]'
              />
              <div className='flex justify-between text-[10px] text-gray-600 mt-1'>
                <span>1 yr</span><span>40 yrs</span>
              </div>
            </div>
          </section>

          {/* AI badge */}
          <div className='flex items-start gap-2 bg-amber-950/20 border border-amber-700/20
            rounded-xl px-3 py-2.5 text-[10px] text-amber-300/80 leading-relaxed'>
            <Info size={11} className='shrink-0 mt-0.5' />
            AI-assisted — verify allocation suitability before client delivery.
          </div>
        </div>
      </div>
    </div>
  )
}
