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
      className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-all
        ${selected ? 'bg-[#3B82F6]/5 border-l-2 border-[#3B82F6]' : 'border-l-2 border-transparent hover:bg-white/[0.02]'}
        ${opp.wash_sale_risk ? 'opacity-60' : ''}`}
    >
      {/* Checkbox */}
      <div className={`w-4 h-4 rounded border mt-0.5 shrink-0 flex items-center justify-center transition-colors
        ${selected ? 'bg-[#3B82F6] border-[#3B82F6]' : 'border-white/20'}
        ${opp.wash_sale_risk ? 'cursor-not-allowed' : ''}`}>
        {selected && <CheckCircle2 size={12} className='text-white' />}
      </div>

      {/* Ticker badge */}
      <div className='w-14 shrink-0'>
        <div className='w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center
          text-[10px] font-bold text-gray-300'>
          {opp.ticker.slice(0, 4)}
        </div>
      </div>

      {/* Details */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-0.5 flex-wrap'>
          <p className='text-sm font-semibold'>{opp.ticker}</p>
          <p className='text-xs text-gray-500 truncate'>{opp.name}</p>
          {opp.wash_sale_risk && (
            <span className='flex items-center gap-1 text-[10px] font-bold text-orange-400
              bg-orange-400/10 border border-orange-400/20 px-1.5 py-0.5 rounded-full'>
              <AlertTriangle size={9} /> Wash-sale risk ({opp.days_held}d)
            </span>
          )}
        </div>
        <div className='flex flex-wrap gap-x-4 text-xs text-gray-500'>
          <span>Market value: <strong className='text-white'>{fmt(opp.current_value)}</strong></span>
          <span>Cost basis: {fmt(opp.cost_basis)}</span>
          <span>Held: {opp.days_held} days</span>
        </div>
        {opp.suggested_replacement && (
          <p className='text-[10px] text-[#3B82F6] mt-1'>
            Suggested replacement: {opp.suggested_replacement}
          </p>
        )}
      </div>

      {/* Loss + savings */}
      <div className='text-right shrink-0'>
        <p className='text-sm font-bold text-red-400 tabular-nums'>
          {fmt(opp.unrealized_loss)}
        </p>
        <p className='text-[10px] text-gray-500 tabular-nums'>
          {opp.loss_pct.toFixed(1)}% loss
        </p>
        <p className='text-xs font-semibold text-emerald-400 mt-0.5 tabular-nums'>
          ~{fmt(opp.estimated_tax_savings)} saved
        </p>
      </div>
    </div>
  )
}

export default function TLHScannerPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [taxRate, setTaxRate]   = useState(0.24)

  const opps    = MOCK_TLH_OPPORTUNITIES
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
  const LTCG_RATE    = 0.15  // 15% for most taxpayers; long-term = held > 365 days
  const totalSavings = selectedOpps.reduce((s, o) => {
    const rate = o.days_held > 365 ? LTCG_RATE : taxRate
    return s + Math.abs(o.unrealized_loss) * rate
  }, 0)

  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>

      <Link href='/tax'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Tax Planning
      </Link>

      <div className='flex items-start justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight mb-1'>TLH Scanner</h1>
          <p className='text-sm text-gray-500'>
            Tax-loss harvesting opportunities across taxable accounts. Select positions to harvest.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <label className='text-xs text-gray-500'>Tax rate</label>
          <select value={taxRate} onChange={e => setTaxRate(Number(e.target.value))}
            className='bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white
              focus:outline-none focus:border-white/20'>
            {[0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37].map(r => (
              <option key={r} value={r}>{(r * 100).toFixed(0)}%</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary bar */}
      <div className='grid grid-cols-3 gap-3 mb-6'>
        {[
          { label: 'Harvestable losses',    value: fmt(opps.reduce((s, o) => s + o.unrealized_loss, 0)), color: 'text-red-400' },
          { label: 'Est. tax savings (all)',value: fmt(eligible.reduce((s, o) => s + o.estimated_tax_savings, 0)), color: 'text-emerald-400' },
          { label: 'Wash-sale alerts',       value: String(opps.filter(o => o.wash_sale_risk).length), color: 'text-orange-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className='bg-white/[0.02] border border-white/[0.06] rounded-xl p-4'>
            <p className='text-[10px] text-gray-500 uppercase tracking-wide mb-1'>{label}</p>
            <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Opportunity table */}
      <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden mb-4'>
        <div className='flex items-center justify-between px-5 py-3 border-b border-white/[0.04]'>
          <div className='flex items-center gap-2'>
            <TrendingDown size={13} className='text-red-400' />
            <p className='text-sm font-semibold'>Positions with unrealized losses</p>
          </div>
          <div className='flex gap-2'>
            <button onClick={selectAll}
              className='text-xs text-[#3B82F6] hover:underline'>Select all eligible</button>
            <span className='text-gray-700'>·</span>
            <button onClick={clearAll}
              className='text-xs text-gray-500 hover:text-white'>Clear</button>
          </div>
        </div>
        <div className='divide-y divide-white/[0.04]'>
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
        <div className='bg-emerald-950/20 border border-emerald-700/20 rounded-2xl p-5'>
          <h3 className='text-sm font-semibold mb-3 text-emerald-400'>
            Harvest summary — {selected.size} position{selected.size !== 1 ? 's' : ''}
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
            <div>
              <p className='text-[10px] text-gray-500 mb-0.5'>Total loss to harvest</p>
              <p className='text-lg font-bold text-red-400 tabular-nums'>{fmt(totalLoss)}</p>
            </div>
            <div>
              <p className='text-[10px] text-gray-500 mb-0.5'>Estimated tax savings</p>
              <p className='text-lg font-bold text-emerald-400 tabular-nums'>{fmt(totalSavings)}</p>
            </div>
            <div>
              <p className='text-[10px] text-gray-500 mb-0.5'>At marginal rate</p>
              <p className='text-lg font-bold text-white'>{(taxRate * 100).toFixed(0)}%</p>
            </div>
          </div>
          <button className='flex items-center gap-1.5 text-sm font-semibold text-white
            bg-emerald-600 hover:bg-emerald-500 rounded-lg px-4 py-2 transition-colors'>
            Export harvest list to PDF
          </button>
        </div>
      )}

      {/* Wash sale explainer */}
      <div className='mt-4 flex items-start gap-2 bg-amber-950/20 border border-amber-700/20
        rounded-xl px-3 py-2.5 text-[10px] text-amber-300/80 leading-relaxed'>
        <Info size={11} className='shrink-0 mt-0.5' />
        Wash-sale rule: you cannot repurchase the same or substantially identical security within 30 days before or after harvesting the loss. Use a replacement security to maintain market exposure.
        AI-assisted — verify with CPA before executing.
      </div>
    </div>
  )
}
