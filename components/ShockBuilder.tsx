'use client'

import { useState } from 'react'
import { SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'

interface ShockValues {
  market:    number
  rates:     number
  oil:       number
  usd:       number
  tech:      number
  credit:    number
}

interface Props {
  onApply: (scenario: string) => void
}

const DEFAULTS: ShockValues = {
  market: 0,
  rates:  0,
  oil:    0,
  usd:    0,
  tech:   0,
  credit: 0,
}

const PRESETS = [
  {
    label: '2008 Crisis',
    values: { market: -50, rates: -2, oil: -60, usd: 8, tech: -55, credit: 300 },
  },
  {
    label: 'Rate Shock',
    values: { market: -15, rates: 3, oil: 5, usd: 5, tech: -20, credit: 100 },
  },
  {
    label: 'Stagflation',
    values: { market: -20, rates: 2, oil: 40, usd: -5, tech: -25, credit: 150 },
  },
  {
    label: 'Tech Crash',
    values: { market: -25, rates: 0, oil: -10, usd: 2, tech: -60, credit: 80 },
  },
]

function Slider({
  label, value, min, max, step = 1, unit, color, onChange
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit: string
  color: string
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div>
      <div className='flex justify-between items-center mb-1'>
        <span className='text-sm text-gray-300'>{label}</span>
        <span className={`text-sm font-bold tabular-nums ${
          value > 0 ? 'text-red-400' : value < 0 ? 'text-green-400' : 'text-gray-400'
        }`}>
          {value > 0 ? '+' : ''}{value}{unit}
        </span>
      </div>
      <div className='relative'>
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className='w-full h-2 rounded-full appearance-none cursor-pointer'
          style={{
            background: `linear-gradient(to right, ${color} ${pct}%, #374151 ${pct}%)`
          }}
        />
      </div>
    </div>
  )
}

export default function ShockBuilder({ onApply }: Props) {
  const [open, setOpen]     = useState(false)
  const [shocks, setShocks] = useState<ShockValues>(DEFAULTS)

  const set = (key: keyof ShockValues) => (v: number) =>
    setShocks(prev => ({ ...prev, [key]: v }))

  const reset = () => setShocks(DEFAULTS)

  const buildScenario = (): string => {
    const parts: string[] = []
    if (shocks.market !== 0)
      parts.push(`market ${shocks.market > 0 ? 'rises' : 'crashes'} ${Math.abs(shocks.market)}%`)
    if (shocks.rates !== 0)
      parts.push(`interest rates ${shocks.rates > 0 ? 'rise' : 'fall'} ${Math.abs(shocks.rates)}%`)
    if (shocks.oil !== 0)
      parts.push(`oil price ${shocks.oil > 0 ? 'surges' : 'drops'} ${Math.abs(shocks.oil)}%`)
    if (shocks.usd !== 0)
      parts.push(`USD ${shocks.usd > 0 ? 'strengthens' : 'weakens'} ${Math.abs(shocks.usd)}%`)
    if (shocks.tech !== 0)
      parts.push(`tech sector ${shocks.tech > 0 ? 'rallies' : 'drops'} ${Math.abs(shocks.tech)}%`)
    if (shocks.credit !== 0)
      parts.push(`credit spreads widen ${shocks.credit}bps`)
    return parts.length > 0
      ? parts.join(', ')
      : 'No shocks selected — adjust the sliders above'
  }

  const hasShocks = Object.values(shocks).some(v => v !== 0)

  return (
    <div className='border border-white/10 rounded-xl overflow-hidden mb-4'>

      {/* Header toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className='w-full flex items-center justify-between px-4 py-3
          bg-[#0A0F1E] hover:bg-white/5 transition-colors text-sm'>
        <div className='flex items-center gap-2 text-gray-300'>
          <SlidersHorizontal size={16} className='text-blue-400' />
          <span className='font-medium'>Custom Shock Builder</span>
          {hasShocks && (
            <span className='bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full'>
              Active
            </span>
          )}
        </div>
        {open ? <ChevronUp size={16} className='text-gray-400' /> : <ChevronDown size={16} className='text-gray-400' />}
      </button>

      {open && (
        <div className='bg-[#0A0F1E] border-t border-white/8 p-4 space-y-4'>

          {/* Presets */}
          <div>
            <p className='text-xs text-gray-500 mb-2'>Quick presets</p>
            <div className='flex flex-wrap gap-2'>
              {PRESETS.map((p) => (
                <button key={p.label}
                  onClick={() => setShocks(p.values as ShockValues)}
                  className='text-xs bg-white/5 hover:bg-white/10 border border-white/10
                    text-gray-300 px-3 py-1.5 rounded-lg transition-colors'>
                  {p.label}
                </button>
              ))}
              <button onClick={reset}
                className='text-xs flex items-center gap-1 text-gray-500
                  hover:text-gray-300 px-3 py-1.5 rounded-lg transition-colors'>
                <RotateCcw size={12} /> Reset
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Slider label='S&P 500 / Market'    value={shocks.market} min={-60} max={20}
              unit='%' color='#EF4444' onChange={set('market')} />
            <Slider label='Interest Rates'       value={shocks.rates}  min={-3}  max={5}  step={0.25}
              unit='%' color='#F59E0B' onChange={set('rates')} />
            <Slider label='Oil Price'            value={shocks.oil}    min={-60} max={80}
              unit='%' color='#F97316' onChange={set('oil')} />
            <Slider label='USD Strength'         value={shocks.usd}    min={-20} max={20}
              unit='%' color='#8B5CF6' onChange={set('usd')} />
            <Slider label='Tech Sector'          value={shocks.tech}   min={-70} max={30}
              unit='%' color='#3B82F6' onChange={set('tech')} />
            <Slider label='Credit Spreads'       value={shocks.credit} min={0}   max={500} step={25}
              unit='bps' color='#EF4444' onChange={set('credit')} />
          </div>

          {/* Preview */}
          <div className='bg-white/5 rounded-xl p-3 border border-white/10'>
            <p className='text-xs text-gray-500 mb-1'>Scenario preview</p>
            <p className='text-sm text-gray-200 leading-relaxed'>{buildScenario()}</p>
          </div>

          {/* Apply button */}
          <button
            onClick={() => onApply(buildScenario())}
            disabled={!hasShocks}
            className='w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700
              active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed
              text-white font-medium py-2.5 rounded-xl transition-all duration-150 text-sm'>
            Apply to Stress Test
          </button>
        </div>
      )}
    </div>
  )
}