'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'
import { calculateCharitable, type CharitableInputs, type CharitableVehicle } from '@/lib/tax'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const VEHICLE_COLORS: Record<CharitableVehicle, string> = {
  daf:                '#2563EB',
  qcd:                '#059669',
  direct_stock:       '#7C3AED',
  crt:                '#D97706',
  private_foundation: '#DB2777',
}

const COMPLEXITY_BADGE: Record<string, string> = {
  low:    'bg-emerald-100 text-emerald-800 border border-emerald-300',
  medium: 'bg-amber-100 text-amber-800 border border-amber-300',
  high:   'bg-red-100 text-red-800 border border-red-300',
}

export default function CharitablePage() {
  const [inputs, setInputs] = useState<CharitableInputs>({
    donation_amount:  100_000,
    asset_type:       'appreciated_stock',
    agi:              400_000,
    marginal_rate:    0.35,
    ltcg_rate:        0.20,
    cost_basis:       40_000,
  })

  const set = <K extends keyof CharitableInputs>(k: K) => (v: CharitableInputs[K]) =>
    setInputs(prev => ({ ...prev, [k]: v }))

  const options = useMemo(() => calculateCharitable(inputs), [inputs])
  const sorted  = [...options].sort((a, b) => a.after_tax_cost - b.after_tax_cost)

  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>

      <Link href='/tax'
        className='flex items-center gap-2 text-sm text-slate-600 hover:text-[#0B1B2E] transition-colors mb-6'>
        <ArrowLeft size={14} /> Tax Planning
      </Link>

      <div className='border-b border-slate-200 pb-6 mb-8'>
        <p className='text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-2'>TAX PLANNING</p>
        <h1 className='text-3xl font-bold text-[#0B1B2E] tracking-tight mb-1'>Charitable Giving Comparator</h1>
        <p className='text-base text-slate-600'>
          Compare five charitable vehicles side-by-side. See after-tax cost, charity amount, and deduction for each.
        </p>
      </div>

      {/* Inputs */}
      <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6'>
        <h2 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3 mb-4'>Gift parameters</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>

          <div className='col-span-2 md:col-span-1'>
            <label className='text-sm font-semibold text-[#0B1B2E] mb-2 block'>Donation amount</label>
            <div className='flex rounded-md overflow-hidden border border-slate-300 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20'>
              <span className='bg-slate-100 border-r border-slate-300 px-3 py-2.5 text-slate-500 font-medium text-sm shrink-0'>$</span>
              <input type='number' step={10000} min={1} value={inputs.donation_amount}
                onChange={e => set('donation_amount')(Number(e.target.value))}
                className='w-full bg-slate-50 focus:bg-white px-3 py-2.5 text-sm text-[#0B1B2E] focus:outline-none tabular-nums font-mono' />
            </div>
          </div>

          <div>
            <label className='text-sm font-semibold text-[#0B1B2E] mb-2 block'>Asset type</label>
            <select value={inputs.asset_type}
              onChange={e => set('asset_type')(e.target.value as CharitableInputs['asset_type'])}
              className='w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2.5
                text-sm text-[#0B1B2E] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white'>
              <option value='cash'>Cash</option>
              <option value='appreciated_stock'>Appreciated stock</option>
              <option value='ira'>IRA / retirement</option>
            </select>
          </div>

          {inputs.asset_type === 'appreciated_stock' && (
            <div>
              <label className='text-sm font-semibold text-[#0B1B2E] mb-2 block'>Cost basis</label>
              <div className='flex rounded-md overflow-hidden border border-slate-300 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20'>
                <span className='bg-slate-100 border-r border-slate-300 px-3 py-2.5 text-slate-500 font-medium text-sm shrink-0'>$</span>
                <input type='number' step={5000} min={0} value={inputs.cost_basis ?? 0}
                  onChange={e => set('cost_basis')(Number(e.target.value))}
                  className='w-full bg-slate-50 focus:bg-white px-3 py-2.5 text-sm text-[#0B1B2E] focus:outline-none tabular-nums font-mono' />
              </div>
            </div>
          )}

          <div>
            <label className='text-sm font-semibold text-[#0B1B2E] mb-2 block'>AGI</label>
            <div className='flex rounded-md overflow-hidden border border-slate-300 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20'>
              <span className='bg-slate-100 border-r border-slate-300 px-3 py-2.5 text-slate-500 font-medium text-sm shrink-0'>$</span>
              <input type='number' step={10000} min={0} value={inputs.agi}
                onChange={e => set('agi')(Number(e.target.value))}
                className='w-full bg-slate-50 focus:bg-white px-3 py-2.5 text-sm text-[#0B1B2E] focus:outline-none tabular-nums font-mono' />
            </div>
          </div>

          <div>
            <label className='text-sm font-semibold text-[#0B1B2E] mb-2 block'>Marginal rate</label>
            <select value={inputs.marginal_rate} onChange={e => set('marginal_rate')(Number(e.target.value))}
              className='w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2.5
                text-sm text-[#0B1B2E] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white'>
              {[0.22, 0.24, 0.32, 0.35, 0.37].map(r => (
                <option key={r} value={r}>{(r * 100).toFixed(0)}%</option>
              ))}
            </select>
          </div>

          <div>
            <label className='text-sm font-semibold text-[#0B1B2E] mb-2 block'>LTCG rate</label>
            <select value={inputs.ltcg_rate} onChange={e => set('ltcg_rate')(Number(e.target.value))}
              className='w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2.5
                text-sm text-[#0B1B2E] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white'>
              {[0, 0.15, 0.20].map(r => (
                <option key={r} value={r}>{(r * 100).toFixed(0)}%</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
        {sorted.map((opt, rank) => {
          const color = VEHICLE_COLORS[opt.vehicle]
          const isBest = rank === 0
          return (
            <div key={opt.vehicle}
              className={`bg-white rounded-xl p-6 shadow-sm relative hover:shadow-md transition-shadow
                ${isBest ? 'border-2 border-[#2563EB]' : 'border border-slate-200 hover:border-slate-300'}`}>
              {isBest && (
                <span className='absolute -top-3 left-4 text-xs font-semibold uppercase tracking-wide
                  text-white bg-[#2563EB] px-2 py-1 rounded'>
                  Lowest cost to client
                </span>
              )}

              <div className='flex items-start justify-between mb-4'>
                <div>
                  <p className='text-lg font-bold' style={{ color }}>{opt.label}</p>
                  <p className='text-sm text-slate-500 mt-0.5'>Min: {fmt(opt.minimum_amount)}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize
                  ${COMPLEXITY_BADGE[opt.setup_complexity]}`}>
                  {opt.setup_complexity} complexity
                </span>
              </div>

              <div className='mb-4'>
                {[
                  { label: 'Charity receives', value: fmt(opt.charity_receives), valColor: 'text-[#0B1B2E]' },
                  { label: 'Tax deduction',    value: fmt(opt.tax_deduction),    valColor: 'text-emerald-700' },
                  { label: 'After-tax cost',   value: fmt(opt.after_tax_cost),   valColor: isBest ? 'text-[#2563EB]' : 'text-[#0B1B2E]' },
                  ...(opt.income_stream ? [{ label: 'Annual income stream', value: fmt(opt.income_stream) + '/yr', valColor: 'text-amber-700' }] : []),
                ].map(({ label, value, valColor }) => (
                  <div key={label} className='flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0'>
                    <span className='text-sm text-slate-600'>{label}</span>
                    <span className={`text-base font-semibold tabular-nums font-mono ${valColor}`}>{value}</span>
                  </div>
                ))}
              </div>

              <p className='text-sm text-slate-700 italic leading-relaxed border-t border-slate-100 pt-3'>
                {opt.best_for}
              </p>
            </div>
          )
        })}
      </div>

      <div className='bg-amber-50 border border-amber-300 rounded-lg p-4'>
        <div className='flex items-start gap-3'>
          <Info size={15} className='shrink-0 mt-0.5 text-amber-600' />
          <p className='text-sm text-amber-800 leading-relaxed'>
            QCD is only available to IRA owners age 70½ or older. CRT projections are simplified;
            actual CRT terms vary. Charitable deduction limits subject to AGI caps.{' '}
            <strong className='font-semibold'>AI-assisted — verify with CPA and legal counsel.</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
