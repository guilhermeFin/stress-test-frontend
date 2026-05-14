'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, CheckCircle2, TrendingDown, Info } from 'lucide-react'
import { MOCK_TLH_OPPORTUNITIES, type TLHOpportunity } from '@/lib/tax'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function TLHRow({ opp, selected, onToggle }: {
  opp: TLHOpportunity
  selected: boolean
  onToggle: () => void
}) {
  return (
    <div
      onClick={onToggle}
      className={`flex items-start gap-4 p-4 cursor-pointer transition-all bg-white border rounded-lg mb-3 last:mb-0
        ${selected
          ? 'border-[#2563EB] bg-[#2563EB]/5 hover:border-[#2563EB]'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}
        ${opp.wash_sale_risk ? 'opacity-70' : ''}`}
    >
      {/* Checkbox */}
      <div className={`w-4 h-4 rounded border mt-0.5 shrink-0 flex items-center justify-center transition-colors
        ${selected ? 'bg-[#2563EB] border-[#2563EB]' : 'border-slate-300'}
        ${opp.wash_sale_risk ? 'cursor-not-allowed' : ''}`}>
        {selected && <CheckCircle2 size={12} className='text-white' />}
      </div>

      {/* Ticker badge */}
      <div className='shrink-0'>
        <div className='bg-slate-100 border border-slate-300 rounded px-3 py-1 font-mono font-bold text-[#0B1B2E] text-sm'>
          {opp.ticker.slice(0, 4)}
        </div>
      </div>

      {/* Details */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-1 flex-wrap'>
          <p className='text-base font-semibold text-[#0B1B2E]'>{opp.ticker}</p>
          <p className='text-sm text-slate-600 truncate'>{opp.name}</p>
          {opp.wash_sale_risk && (
            <span className='flex items-center gap-1 text-xs font-semibold text-amber-800
              bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full'>
              <AlertTriangle size={10} /> Wash-sale risk ({opp.days_held}d)
            </span>
          )}
        </div>
        <div className='flex flex-wrap gap-x-4 text-sm text-slate-600'>
          <span>Market value: <strong className='font-mono tabular-nums text-[#0B1B2E]'>{fmt(opp.current_value)}</strong></span>
          <span>Cost basis: <span className='font-mono tabular-nums'>{fmt(opp.cost_basis)}</span></span>
          <span>Held: {opp.days_held} days</span>
        </div>
        {opp.suggested_replacement && (
          <p className='text-sm text-[#2563EB] hover:text-[#1D4ED8] hover:underline mt-1 cursor-pointer'>
            Suggested replacement: {opp.suggested_replacement}
          </p>
        )}
      </div>

      {/* Loss + savings */}
      <div className='text-right shrink-0'>
        <p className='text-lg font-bold text-red-600 tabular-nums font-mono'>
          {fmt(opp.unrealized_loss)}
        </p>
        <p className='text-xs text-slate-500 tabular-nums'>
          {opp.loss_pct.toFixed(1)}% loss
        </p>
        <p className='text-sm font-semibold text-emerald-700 mt-0.5 tabular-nums font-mono'>
          ~{fmt(opp.estimated_tax_savings)} saved
        </p>
      </div>
    </div>
  )
}

export default function TLHScannerPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [taxRate, setTaxRate]   = useState(0.24)

  const opps     = MOCK_TLH_OPPORTUNITIES
  const eligible = opps.filter(o => !o.wash_sale_risk)

  const toggle = (ticker: string) => {
    if (opps.find(o => o.ticker === ticker)?.wash_sale_risk) return
    setSelected(s => {
      const next = new Set(s)
      next.has(ticker) ? next.delete(ticker) : next.add(ticker)
      return next
    })
  }

  const selectAll = () => setSelected(new Set(eligible.map(o => o.ticker)))
  const clearAll  = () => setSelected(new Set())

  const selectedOpps = opps.filter(o => selected.has(o.ticker))
  const totalLoss    = selectedOpps.reduce((s, o) => s + o.unrealized_loss, 0)
  const LTCG_RATE    = 0.15
  const totalSavings = selectedOpps.reduce((s, o) => {
    const rate = o.days_held > 365 ? LTCG_RATE : taxRate
    return s + Math.abs(o.unrealized_loss) * rate
  }, 0)

  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>

      <Link href='/tax'
        className='flex items-center gap-2 text-sm text-slate-600 hover:text-[#0B1B2E] transition-colors mb-6'>
        <ArrowLeft size={14} /> Tax Planning
      </Link>

      <div className='border-b border-slate-200 pb-6 mb-8'>
        <p className='text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-2'>TAX PLANNING</p>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-[#0B1B2E] tracking-tight mb-1'>TLH Scanner</h1>
            <p className='text-base text-slate-600'>
              Tax-loss harvesting opportunities across taxable accounts. Select positions to harvest.
            </p>
          </div>
          <div className='flex items-center gap-2 shrink-0'>
            <label className='text-sm font-semibold text-[#0B1B2E]'>Tax rate</label>
            <select value={taxRate} onChange={e => setTaxRate(Number(e.target.value))}
              className='bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-sm text-[#0B1B2E]
                focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white'>
              {[0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37].map(r => (
                <option key={r} value={r}>{(r * 100).toFixed(0)}%</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className='grid grid-cols-3 gap-3 mb-6'>
        {[
          {
            label: 'Harvestable losses',
            value: fmt(opps.reduce((s, o) => s + o.unrealized_loss, 0)),
            numColor: 'text-red-600', borderColor: 'border-red-200',
          },
          {
            label: 'Est. tax savings (all)',
            value: fmt(eligible.reduce((s, o) => s + o.estimated_tax_savings, 0)),
            numColor: 'text-emerald-700', borderColor: 'border-emerald-200',
          },
          {
            label: 'Wash-sale alerts',
            value: String(opps.filter(o => o.wash_sale_risk).length),
            numColor: 'text-amber-700', borderColor: 'border-amber-200',
          },
        ].map(({ label, value, numColor, borderColor }) => (
          <div key={label} className={`bg-white border ${borderColor} rounded-xl p-4 shadow-sm`}>
            <p className='text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2'>{label}</p>
            <p className={`text-2xl font-bold tabular-nums font-mono ${numColor}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Opportunity list */}
      <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-4'>
        <div className='flex items-center justify-between border-b border-slate-200 pb-3 mb-4'>
          <div className='flex items-center gap-2'>
            <TrendingDown size={15} className='text-red-500' />
            <h2 className='text-base font-bold text-[#0B1B2E]'>Positions with unrealized losses</h2>
          </div>
          <div className='flex gap-3'>
            <button onClick={selectAll}
              className='text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium'>Select all eligible</button>
            <span className='text-slate-300'>·</span>
            <button onClick={clearAll}
              className='text-sm text-slate-600 hover:text-[#0B1B2E]'>Clear</button>
          </div>
        </div>
        <div>
          {opps.map(opp => (
            <TLHRow
              key={opp.ticker}
              opp={opp}
              selected={selected.has(opp.ticker)}
              onToggle={() => toggle(opp.ticker)}
            />
          ))}
        </div>
      </div>

      {/* Selected summary */}
      {selected.size > 0 && (
        <div className='bg-white border border-emerald-200 rounded-xl p-6 shadow-sm mb-4'>
          <h3 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3 mb-4'>
            Harvest summary — {selected.size} position{selected.size !== 1 ? 's' : ''}
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2'>Total loss to harvest</p>
              <p className='text-2xl font-bold text-red-600 tabular-nums font-mono'>{fmt(totalLoss)}</p>
            </div>
            <div>
              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2'>Estimated tax savings</p>
              <p className='text-2xl font-bold text-emerald-700 tabular-nums font-mono'>{fmt(totalSavings)}</p>
            </div>
            <div>
              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2'>At marginal rate</p>
              <p className='text-2xl font-bold text-[#0B1B2E] font-mono tabular-nums'>{(taxRate * 100).toFixed(0)}%</p>
            </div>
          </div>
          <button className='flex items-center gap-1.5 text-sm font-semibold text-white
            bg-emerald-600 hover:bg-emerald-500 rounded-lg px-4 py-2 transition-colors'>
            Export harvest list to PDF
          </button>
        </div>
      )}

      <div className='bg-amber-50 border border-amber-300 rounded-lg p-4'>
        <div className='flex items-start gap-3'>
          <Info size={15} className='shrink-0 mt-0.5 text-amber-600' />
          <p className='text-sm text-amber-800 leading-relaxed'>
            <strong className='font-semibold'>Wash-sale rule:</strong> you cannot repurchase the same or substantially
            identical security within 30 days before or after harvesting the loss. Use a replacement security to maintain
            market exposure. AI-assisted — verify with CPA before executing.
          </p>
        </div>
      </div>
    </div>
  )
}
