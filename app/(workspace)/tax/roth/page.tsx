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
      <div className='flex justify-between mb-2'>
        <span className='text-sm font-semibold text-[#0B1B2E]'>{label}</span>
        <span className='text-sm font-mono font-bold text-[#2563EB] tabular-nums'>{fmtFn(value)}</span>
      </div>
      <input type='range' min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className='w-full accent-[#2563EB]' />
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
        className='flex items-center gap-2 text-sm text-slate-600 hover:text-[#0B1B2E] transition-colors mb-6'>
        <ArrowLeft size={14} /> Tax Planning
      </Link>

      <div className='border-b border-slate-200 pb-6 mb-8'>
        <p className='text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-2'>TAX PLANNING</p>
        <h1 className='text-3xl font-bold text-[#0B1B2E] tracking-tight mb-1'>Roth Conversion Ladder</h1>
        <p className='text-base text-slate-600'>
          Model multi-year conversions to fill lower tax brackets now and reduce future RMD exposure.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>

        {/* Inputs */}
        <div className='lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5'>
          <h2 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3 mb-2'>Parameters</h2>

          <SliderRow label='Traditional IRA balance' value={inputs.ira_balance}
            min={100_000} max={5_000_000} step={50_000}
            onChange={set('ira_balance')} fmt={fmt} />

          <SliderRow label='Annual conversion amount' value={inputs.annual_conversion}
            min={10_000} max={300_000} step={5_000}
            onChange={set('annual_conversion')} fmt={fmt} />

          <div>
            <label className='text-sm font-semibold text-[#0B1B2E] mb-2 block'>Current marginal rate</label>
            <div className='flex flex-wrap gap-1.5'>
              {RATES.map(r => (
                <button key={r} onClick={() => set('current_marginal_rate')(r)}
                  className={`text-xs px-3 py-1.5 rounded-md font-medium border transition-colors
                    ${inputs.current_marginal_rate === r
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-[#0B1B2E]'}`}>
                  {fmtPct(r)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className='text-sm font-semibold text-[#0B1B2E] mb-2 block'>Projected retirement rate</label>
            <div className='flex flex-wrap gap-1.5'>
              {RATES.map(r => (
                <button key={r} onClick={() => set('future_marginal_rate')(r)}
                  className={`text-xs px-3 py-1.5 rounded-md font-medium border transition-colors
                    ${inputs.future_marginal_rate === r
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-[#0B1B2E]'}`}>
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

          {/* Summary cards */}
          <div className='grid grid-cols-2 gap-3'>
            {[
              { label: 'Total tax cost',   value: fmt(result.total_tax_cost),        color: 'text-red-600',    border: 'border-red-200' },
              { label: 'Projected savings', value: fmt(result.projected_tax_savings), color: 'text-emerald-700', border: 'border-emerald-200' },
              { label: 'Break-even',       value: `${result.break_even_years} yrs`,  color: 'text-[#0B1B2E]', border: 'border-slate-200' },
              {
                label: 'Rate arbitrage',
                value: inputs.future_marginal_rate > inputs.current_marginal_rate
                  ? `+${fmtPct(inputs.future_marginal_rate - inputs.current_marginal_rate)} advantage`
                  : inputs.future_marginal_rate === inputs.current_marginal_rate ? 'Neutral' : 'Convert less',
                color: inputs.future_marginal_rate > inputs.current_marginal_rate ? 'text-emerald-700' : 'text-amber-700',
                border: 'border-slate-200',
              },
            ].map(({ label, value, color, border }) => (
              <div key={label} className={`bg-white border ${border} rounded-xl p-4 shadow-sm`}>
                <p className='text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2'>{label}</p>
                <p className={`text-xl font-bold tabular-nums font-mono ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Year-by-year table */}
          <div className='bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm'>
            <div className='px-6 py-4 border-b border-slate-200'>
              <h2 className='text-base font-bold text-[#0B1B2E]'>Year-by-year projection</h2>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-slate-200'>
                    {['Year', 'Conversion', 'Tax cost', 'tIRA balance', 'Roth balance'].map(h => (
                      <th key={h} className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.years.map(y => (
                    <tr key={y.year} className='border-b border-slate-100 last:border-0 hover:bg-slate-50'>
                      <td className='px-4 py-3 font-medium text-[#0B1B2E]'>{y.year}</td>
                      <td className='px-4 py-3 tabular-nums font-mono text-slate-700'>{fmt(y.conversion_amount)}</td>
                      <td className='px-4 py-3 tabular-nums font-mono text-red-600'>{fmt(y.tax_cost)}</td>
                      <td className='px-4 py-3 tabular-nums font-mono text-slate-700'>{fmt(y.ira_balance_after)}</td>
                      <td className='px-4 py-3 tabular-nums font-mono text-emerald-700'>{fmt(y.roth_balance_after)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Balance chart */}
          <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm'>
            <h2 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3 mb-4'>
              tIRA vs Roth balance over conversion period
            </h2>
            <div className='space-y-2'>
              {result.years.map(y => (
                <div key={y.year} className='flex items-center gap-2'>
                  <span className='text-xs font-semibold text-slate-500 w-8 shrink-0'>Yr {y.year}</span>
                  <div className='flex-1 flex h-5 gap-0.5 rounded overflow-hidden bg-slate-100'>
                    <div
                      className='bg-slate-400 transition-all rounded-l'
                      style={{ width: `${(y.ira_balance_after / maxBarValue) * 50}%` }}
                    />
                    <div
                      className='bg-emerald-500 transition-all rounded-r'
                      style={{ width: `${(y.roth_balance_after / maxBarValue) * 50}%` }}
                    />
                  </div>
                  <span className='text-xs text-slate-600 w-20 text-right shrink-0 font-mono tabular-nums'>
                    {fmt(y.ira_balance_after + y.roth_balance_after)}
                  </span>
                </div>
              ))}
            </div>
            <div className='flex gap-4 mt-3'>
              <div className='flex items-center gap-1.5 text-xs text-slate-600'>
                <span className='w-3 h-3 rounded-sm bg-slate-400' /> tIRA
              </div>
              <div className='flex items-center gap-1.5 text-xs text-slate-600'>
                <span className='w-3 h-3 rounded-sm bg-emerald-500' /> Roth
              </div>
            </div>
          </div>

          <div className='bg-amber-50 border border-amber-300 rounded-lg p-4'>
            <div className='flex items-start gap-3'>
              <Info size={15} className='shrink-0 mt-0.5 text-amber-600' />
              <p className='text-sm text-amber-800 leading-relaxed'>
                Roth conversions increase ordinary income for the year. Verify IRMAA thresholds,
                ACA subsidy cliffs, and state tax implications.{' '}
                <strong className='font-semibold'>AI-assisted — verify with CPA.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
