'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'
import { calculateCharitable, type CharitableInputs, type CharitableVehicle } from '@/lib/tax'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const VEHICLE_COLORS: Record<CharitableVehicle, string> = {
  daf:                '#3B82F6',
  qcd:                '#10B981',
  direct_stock:       '#8B5CF6',
  crt:                '#F59E08',
  private_foundation: '#EC4899',
}

const COMPLEXITY_BADGE: Record<string, string> = {
  low:    'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  high:   'text-red-400 bg-red-400/10 border-red-400/20',
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
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Tax Planning
      </Link>

      <div className='mb-8'>
        <h1 className='text-2xl font-bold tracking-tight mb-1'>Charitable Giving Comparator</h1>
        <p className='text-sm text-gray-500'>
          Compare five charitable vehicles side-by-side. See after-tax cost, charity amount, and deduction for each.
        </p>
      </div>

      {/* Inputs */}
      <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 mb-6'>
        <h2 className='text-sm font-semibold mb-4'>Gift parameters</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>

          <div className='col-span-2 md:col-span-1'>
            <label className='text-xs text-gray-500 mb-1 block'>Donation amount</label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'>$</span>
              <input type='number' step={10000} min={1} value={inputs.donation_amount}
                onChange={e => set('donation_amount')(Number(e.target.value))}
                className='w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-2
                  text-sm text-white focus:outline-none focus:border-white/20 tabular-nums' />
            </div>
          </div>

          <div>
            <label className='text-xs text-gray-500 mb-1 block'>Asset type</label>
            <select value={inputs.asset_type} onChange={e => set('asset_type')(e.target.value as CharitableInputs['asset_type'])}
              className='w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2
                text-sm text-white focus:outline-none focus:border-white/20'>
              <option value='cash'>Cash</option>
              <option value='appreciated_stock'>Appreciated stock</option>
              <option value='ira'>IRA / retirement</option>
            </select>
          </div>

          {inputs.asset_type === 'appreciated_stock' && (
            <div>
              <label className='text-xs text-gray-500 mb-1 block'>Cost basis</label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'>$</span>
                <input type='number' step={5000} min={0} value={inputs.cost_basis ?? 0}
                  onChange={e => set('cost_basis')(Number(e.target.value))}
                  className='w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-2
                    text-sm text-white focus:outline-none focus:border-white/20 tabular-nums' />
              </div>
            </div>
          )}

          <div>
            <label className='text-xs text-gray-500 mb-1 block'>AGI</label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'>$</span>
              <input type='number' step={10000} min={0} value={inputs.agi}
                onChange={e => set('agi')(Number(e.target.value))}
                className='w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-2
                  text-sm text-white focus:outline-none focus:border-white/20 tabular-nums' />
            </div>
          </div>

          <div>
            <label className='text-xs text-gray-500 mb-1 block'>Marginal rate</label>
            <select value={inputs.marginal_rate} onChange={e => set('marginal_rate')(Number(e.target.value))}
              className='w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2
                text-sm text-white focus:outline-none focus:border-white/20'>
              {[0.22, 0.24, 0.32, 0.35, 0.37].map(r => (
                <option key={r} value={r}>{(r * 100).toFixed(0)}%</option>
              ))}
            </select>
          </div>

          <div>
            <label className='text-xs text-gray-500 mb-1 block'>LTCG rate</label>
            <select value={inputs.ltcg_rate} onChange={e => set('ltcg_rate')(Number(e.target.value))}
              className='w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2
                text-sm text-white focus:outline-none focus:border-white/20'>
              {[0, 0.15, 0.20].map(r => (
                <option key={r} value={r}>{(r * 100).toFixed(0)}%</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
        {sorted.map((opt, rank) => {
          const color = VEHICLE_COLORS[opt.vehicle]
          const isBest = rank === 0
          return (
            <div key={opt.vehicle}
              className={`bg-white/[0.025] border rounded-2xl p-5 relative
                ${isBest ? 'border-[#3B82F6]/40' : 'border-white/[0.06]'}`}>
              {isBest && (
                <span className='absolute -top-2.5 left-4 text-[10px] font-bold text-[#3B82F6]
                  bg-[#0A0F1E] px-2'>
                  Lowest cost to client
                </span>
              )}

              <div className='flex items-start justify-between mb-4'>
                <div>
                  <p className='text-sm font-bold' style={{ color }}>{opt.label}</p>
                  <p className='text-[10px] text-gray-500 mt-0.5'>Min: {fmt(opt.minimum_amount)}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize
                  ${COMPLEXITY_BADGE[opt.setup_complexity]}`}>
                  {opt.setup_complexity} complexity
                </span>
              </div>

              <div className='space-y-2 mb-4'>
                {[
                  { label: 'Charity receives', value: fmt(opt.charity_receives), color: 'text-white' },
                  { label: 'Tax deduction',    value: fmt(opt.tax_deduction),    color: 'text-emerald-400' },
                  { label: 'After-tax cost',   value: fmt(opt.after_tax_cost),   color: isBest ? 'text-[#3B82F6]' : 'text-white' },
                  ...(opt.income_stream ? [{ label: 'Annual income stream', value: fmt(opt.income_stream) + '/yr', color: 'text-amber-400' }] : []),
                ].map(({ label, value, color: c }) => (
                  <div key={label} className='flex justify-between text-sm'>
                    <span className='text-gray-400'>{label}</span>
                    <span className={`font-semibold tabular-nums ${c}`}>{value}</span>
                  </div>
                ))}
              </div>

              <p className='text-[10px] text-gray-500 leading-relaxed border-t border-white/[0.05] pt-3'>
                {opt.best_for}
              </p>
            </div>
          )
        })}
      </div>

      <div className='flex items-start gap-2 bg-amber-950/20 border border-amber-700/20
        rounded-xl px-3 py-2.5 text-[10px] text-amber-300/80 leading-relaxed'>
        <Info size={11} className='shrink-0 mt-0.5' />
        QCD is only available to IRA owners age 70½ or older. CRT projections are simplified; actual CRT terms vary. Charitable deduction limits subject to AGI caps. AI-assisted — verify with CPA and legal counsel.
      </div>
    </div>
  )
}
