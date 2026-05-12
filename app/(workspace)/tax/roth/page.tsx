'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'
import { calculateRoth, type RothInputs } from '@/lib/tax'

function fmt(n: number) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

function fmtPct(n: number) { return (n * 100).toFixed(0) + '%' }

const RATES = [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37]

function SliderRow({ label, value, min, max, step, onChange, fmt: fmtFn }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; fmt: (v: number) => string
}) {
  return (
    <div>
      <div className='flex justify-between text-xs mb-1.5'>
        <span className='text-gray-400'>{label}</span>
        <span className='font-bold text-white'>{fmtFn(value)}</span>
      </div>
      <input type='range' min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className='w-full accent-[#3B82F6]' />
    </div>
  )
}

export default function RothConversionPage() {
  const [inputs, setInputs] = useState<RothInputs>({
    ira_balance:           1_200_000,
    annual_conversion:     75_000,
    current_marginal_rate: 0.22,
    future_marginal_rate:  0.24,
    growth_rate:           0.07,
    years_to_convert:      5,
    years_in_retirement:   30,
  })

  const set = <K extends keyof RothInputs>(k: K) => (v: RothInputs[K]) =>
    setInputs(prev => ({ ...prev, [k]: v }))

  const result = useMemo(() => calculateRoth(inputs), [inputs])

  const maxBarValue = Math.max(...result.years.map(y => Math.max(y.ira_balance_after, y.roth_balance_after)))

  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>

      <Link href='/tax'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Tax Planning
      </Link>

      <div className='mb-8'>
        <h1 className='text-2xl font-bold tracking-tight mb-1'>Roth Conversion Ladder</h1>
        <p className='text-sm text-gray-500'>
          Model multi-year conversions to fill lower tax brackets now and reduce future RMD exposure.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>

        {/* Inputs */}
        <div className='lg:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-5'>
          <h2 className='text-sm font-semibold'>Parameters</h2>

          <SliderRow label='Traditional IRA balance' value={inputs.ira_balance}
            min={100_000} max={5_000_000} step={50_000}
            onChange={set('ira_balance')} fmt={fmt} />

          <SliderRow label='Annual conversion amount' value={inputs.annual_conversion}
            min={10_000} max={300_000} step={5_000}
            onChange={set('annual_conversion')} fmt={fmt} />

          <div>
            <label className='text-xs text-gray-400 mb-1.5 block'>Current marginal rate</label>
            <div className='flex flex-wrap gap-1.5'>
              {RATES.map(r => (
                <button key={r} onClick={() => set('current_marginal_rate')(r)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors
                    ${inputs.current_marginal_rate === r
                      ? 'border-[#3B82F6]/50 bg-[#3B82F6]/10 text-[#3B82F6]'
                      : 'border-white/[0.06] text-gray-400 hover:border-white/10'}`}>
                  {fmtPct(r)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className='text-xs text-gray-400 mb-1.5 block'>Projected retirement rate</label>
            <div className='flex flex-wrap gap-1.5'>
              {RATES.map(r => (
                <button key={r} onClick={() => set('future_marginal_rate')(r)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors
                    ${inputs.future_marginal_rate === r
                      ? 'border-[#8B5CF6]/50 bg-[#8B5CF6]/10 text-[#8B5CF6]'
                      : 'border-white/[0.06] text-gray-400 hover:border-white/10'}`}>
                  {fmtPct(r)}
                </button>
              ))}
            </div>
          </div>

          <SliderRow label='Years to convert' value={inputs.years_to_convert}
            min={1} max={10} step={1}
            onChange={set('years_to_convert')} fmt={v => `${v} yrs`} />

          <SliderRow label='Retirement duration' value={inputs.years_in_retirement}
            min={10} max={40} step={5}
            onChange={set('years_in_retirement')} fmt={v => `${v} yrs`} />

          <SliderRow label='Expected growth rate' value={inputs.growth_rate}
            min={0.02} max={0.12} step={0.005}
            onChange={set('growth_rate')} fmt={v => `${(v * 100).toFixed(1)}%`} />
        </div>

        {/* Results */}
        <div className='lg:col-span-3 space-y-4'>

          {/* Summary */}
          <div className='grid grid-cols-2 gap-3'>
            {[
              { label: 'Total tax cost',         value: fmt(result.total_tax_cost),          color: 'text-red-400' },
              { label: 'Projected savings',       value: fmt(result.projected_tax_savings),   color: 'text-emerald-400' },
              { label: 'Break-even',             value: `${result.break_even_years} yrs`,    color: 'text-white' },
              { label: 'Rate arbitrage',
                value: inputs.future_marginal_rate > inputs.current_marginal_rate
                  ? `+${fmtPct(inputs.future_marginal_rate - inputs.current_marginal_rate)} advantage`
                  : inputs.future_marginal_rate === inputs.current_marginal_rate ? 'Neutral' : 'Convert less',
                color: inputs.future_marginal_rate > inputs.current_marginal_rate ? 'text-emerald-400' : 'text-amber-400'
              },
            ].map(({ label, value, color }) => (
              <div key={label} className='bg-white/[0.02] border border-white/[0.06] rounded-xl p-4'>
                <p className='text-[10px] text-gray-500 uppercase tracking-wide mb-1'>{label}</p>
                <p className={`text-lg font-bold tabular-nums ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Year-by-year table */}
          <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden'>
            <div className='px-5 py-3 border-b border-white/[0.04]'>
              <h2 className='text-sm font-semibold'>Year-by-year projection</h2>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-xs'>
                <thead>
                  <tr className='text-gray-500 text-left border-b border-white/[0.04]'>
                    {['Year', 'Conversion', 'Tax cost', 'tIRA balance', 'Roth balance'].map(h => (
                      <th key={h} className='px-4 py-2 font-medium'>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-white/[0.03]'>
                  {result.years.map(y => (
                    <tr key={y.year} className='hover:bg-white/[0.02]'>
                      <td className='px-4 py-2.5 font-medium'>{y.year}</td>
                      <td className='px-4 py-2.5 tabular-nums'>{fmt(y.conversion_amount)}</td>
                      <td className='px-4 py-2.5 tabular-nums text-red-400'>{fmt(y.tax_cost)}</td>
                      <td className='px-4 py-2.5 tabular-nums'>{fmt(y.ira_balance_after)}</td>
                      <td className='px-4 py-2.5 tabular-nums text-emerald-400'>{fmt(y.roth_balance_after)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Balance chart */}
          <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5'>
            <h2 className='text-sm font-semibold mb-4'>tIRA vs Roth balance over conversion period</h2>
            <div className='space-y-2'>
              {result.years.map(y => (
                <div key={y.year} className='flex items-center gap-2'>
                  <span className='text-[10px] text-gray-500 w-8 shrink-0'>Yr {y.year}</span>
                  <div className='flex-1 flex h-4 gap-0.5 rounded overflow-hidden'>
                    <div
                      className='bg-[#6B7280] transition-all rounded-l'
                      style={{ width: `${(y.ira_balance_after / maxBarValue) * 50}%` }}
                    />
                    <div
                      className='bg-emerald-500 transition-all rounded-r'
                      style={{ width: `${(y.roth_balance_after / maxBarValue) * 50}%` }}
                    />
                  </div>
                  <span className='text-[10px] text-gray-500 w-20 text-right shrink-0'>
                    {fmt(y.ira_balance_after + y.roth_balance_after)}
                  </span>
                </div>
              ))}
            </div>
            <div className='flex gap-4 mt-3'>
              <div className='flex items-center gap-1.5 text-[10px] text-gray-500'>
                <span className='w-3 h-3 rounded-sm bg-[#6B7280]' /> tIRA
              </div>
              <div className='flex items-center gap-1.5 text-[10px] text-gray-500'>
                <span className='w-3 h-3 rounded-sm bg-emerald-500' /> Roth
              </div>
            </div>
          </div>

          <div className='flex items-start gap-2 bg-amber-950/20 border border-amber-700/20
            rounded-xl px-3 py-2.5 text-[10px] text-amber-300/80 leading-relaxed'>
            <Info size={11} className='shrink-0 mt-0.5' />
            Roth conversions increase ordinary income for the year. Verify IRMAA thresholds, ACA subsidy cliffs, and state tax implications. AI-assisted — verify with CPA.
          </div>
        </div>
      </div>
    </div>
  )
}
