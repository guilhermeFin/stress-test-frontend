'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'
import {
  calculateTax, type TaxInputs, type FilingStatus,
  FILING_LABELS, STANDARD_DEDUCTION,
} from '@/lib/tax'

const US_STATES: { label: string; rate: number }[] = [
  { label: 'No state income tax', rate: 0 },
  { label: 'California (13.3%)', rate: 0.133 },
  { label: 'New York (10.9%)',   rate: 0.109 },
  { label: 'New Jersey (10.75%)',rate: 0.1075 },
  { label: 'Oregon (9.9%)',      rate: 0.099 },
  { label: 'Minnesota (9.85%)',  rate: 0.0985 },
  { label: 'Vermont (8.75%)',    rate: 0.0875 },
  { label: 'Wisconsin (7.65%)',  rate: 0.0765 },
  { label: 'Georgia (5.75%)',    rate: 0.0575 },
  { label: 'Arizona (2.5%)',     rate: 0.025 },
  { label: 'Colorado (4.4%)',    rate: 0.044 },
  { label: 'Illinois (4.95%)',   rate: 0.0495 },
  { label: 'Pennsylvania (3.07%)',rate: 0.0307 },
  { label: 'Massachusetts (5%)', rate: 0.05 },
]

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function fmtPct(n: number) { return (n * 100).toFixed(2) + '%' }

const BRACKET_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E08', '#EF4444', '#EC4899', '#F97316']

function NumberInput({ label, value, onChange, step = 1000 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div>
      <label className='text-xs text-gray-500 mb-1 block'>{label}</label>
      <div className='relative'>
        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'>$</span>
        <input
          type='number' step={step} min={0} value={value}
          onChange={e => onChange(Math.max(0, Number(e.target.value)))}
          className='w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-2
            text-sm text-white focus:outline-none focus:border-white/20 tabular-nums'
        />
      </div>
    </div>
  )
}

export default function TaxProjectorPage() {
  const [inputs, setInputs] = useState<TaxInputs>({
    filing_status:        'mfj',
    w2_income:            350_000,
    business_income:      0,
    interest_income:      8_000,
    qualified_dividends:  12_000,
    short_term_gains:     15_000,
    long_term_gains:      45_000,
    itemized_deductions:  0,
    use_itemized:         false,
    state_rate:           0.109,
  })

  const set = <K extends keyof TaxInputs>(k: K) => (v: TaxInputs[K]) =>
    setInputs(prev => ({ ...prev, [k]: v }))

  const result = useMemo(() => calculateTax(inputs), [inputs])

  const stdDeduction = STANDARD_DEDUCTION[inputs.filing_status]
  const totalFederal = result.ordinary_tax + result.ltcg_tax + result.niit + result.amt
  const stateTax     = result.agi * inputs.state_rate
  const grandTotal   = totalFederal + stateTax

  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>

      <Link href='/tax'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Tax Planning
      </Link>

      <div className='mb-8'>
        <h1 className='text-2xl font-bold tracking-tight mb-1'>Tax Projector</h1>
        <p className='text-sm text-gray-500'>2025 federal tax brackets. Updates in real time.</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>

        {/* Inputs — 2 columns */}
        <div className='lg:col-span-2 space-y-4'>

          {/* Filing status */}
          <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4'>
            <h2 className='text-sm font-semibold'>Filing status</h2>
            <div className='grid grid-cols-2 gap-2'>
              {(Object.keys(FILING_LABELS) as FilingStatus[]).map(fs => (
                <button key={fs} onClick={() => set('filing_status')(fs)}
                  className={`text-xs px-3 py-2 rounded-lg border transition-colors text-left
                    ${inputs.filing_status === fs
                      ? 'border-[#3B82F6]/50 bg-[#3B82F6]/10 text-[#3B82F6]'
                      : 'border-white/[0.06] text-gray-400 hover:border-white/10 hover:text-white'}`}>
                  {FILING_LABELS[fs]}
                </button>
              ))}
            </div>
          </div>

          {/* Income */}
          <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-3'>
            <h2 className='text-sm font-semibold'>Income</h2>
            <NumberInput label='W-2 / Salary'              value={inputs.w2_income}          onChange={set('w2_income')} />
            <NumberInput label='Business / self-employment' value={inputs.business_income}    onChange={set('business_income')} />
            <NumberInput label='Interest income'            value={inputs.interest_income}    onChange={set('interest_income')} step={500} />
            <NumberInput label='Qualified dividends'        value={inputs.qualified_dividends} onChange={set('qualified_dividends')} step={500} />
            <NumberInput label='Short-term capital gains'  value={inputs.short_term_gains}   onChange={set('short_term_gains')} />
            <NumberInput label='Long-term capital gains'   value={inputs.long_term_gains}    onChange={set('long_term_gains')} />
          </div>

          {/* Deductions */}
          <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-3'>
            <h2 className='text-sm font-semibold'>Deductions</h2>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => set('use_itemized')(!inputs.use_itemized)}
                className={`w-9 h-5 rounded-full transition-colors ${inputs.use_itemized ? 'bg-[#3B82F6]' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5
                  ${inputs.use_itemized ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
              <span className='text-xs text-gray-400'>Itemize deductions</span>
            </div>
            {inputs.use_itemized ? (
              <NumberInput
                label={`Itemized deductions (std: ${fmt(stdDeduction)})`}
                value={inputs.itemized_deductions}
                onChange={set('itemized_deductions')}
              />
            ) : (
              <p className='text-xs text-gray-500'>Standard deduction: {fmt(stdDeduction)}</p>
            )}
          </div>

          {/* State */}
          <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5'>
            <h2 className='text-sm font-semibold mb-3'>State income tax</h2>
            <select
              value={inputs.state_rate}
              onChange={e => set('state_rate')(Number(e.target.value))}
              className='w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2
                text-sm text-white focus:outline-none focus:border-white/20'
            >
              {US_STATES.map(s => (
                <option key={s.label} value={s.rate}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results — 3 columns */}
        <div className='lg:col-span-3 space-y-4'>

          {/* Summary cards */}
          <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
            {[
              { label: 'AGI',            value: fmt(result.agi),            sub: '' },
              { label: 'Taxable income', value: fmt(result.taxable_income), sub: '' },
              { label: 'Federal tax',    value: fmt(totalFederal),          sub: `${fmtPct(totalFederal / Math.max(1, result.agi))} eff.` },
              { label: 'State tax',      value: fmt(stateTax),              sub: `${fmtPct(inputs.state_rate)} rate` },
              { label: 'Total tax bill', value: fmt(grandTotal),            sub: `${fmtPct(grandTotal / Math.max(1, result.agi))} eff.`, accent: true },
              { label: 'Marginal rate',  value: fmtPct(result.marginal_rate), sub: 'Ordinary income' },
            ].map(({ label, value, sub, accent }) => (
              <div key={label}
                className={`rounded-xl p-4 border ${accent ? 'bg-[#3B82F6]/10 border-[#3B82F6]/30' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                <p className='text-[10px] text-gray-500 uppercase tracking-wide mb-1'>{label}</p>
                <p className={`text-lg font-bold tabular-nums ${accent ? 'text-[#3B82F6]' : 'text-white'}`}>{value}</p>
                {sub && <p className='text-[10px] text-gray-500 mt-0.5'>{sub}</p>}
              </div>
            ))}
          </div>

          {/* Bracket breakdown */}
          <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5'>
            <h2 className='text-sm font-semibold mb-4'>Federal bracket breakdown</h2>
            {result.bracket_breakdown.length === 0 ? (
              <p className='text-xs text-gray-500'>No taxable ordinary income.</p>
            ) : (
              <div className='space-y-2'>
                {result.bracket_breakdown.map((b, i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <span className='w-8 text-xs font-bold tabular-nums'
                      style={{ color: BRACKET_COLORS[i % BRACKET_COLORS.length] }}>
                      {(b.rate * 100).toFixed(0)}%
                    </span>
                    <div className='flex-1 h-5 bg-white/[0.03] rounded overflow-hidden'>
                      <div className='h-full rounded transition-all'
                        style={{
                          width: `${(b.taxable_in_bracket / result.taxable_income) * 100}%`,
                          background: BRACKET_COLORS[i % BRACKET_COLORS.length],
                          opacity: 0.7,
                        }}
                      />
                    </div>
                    <div className='text-right shrink-0 w-32'>
                      <span className='text-xs text-gray-400 tabular-nums'>{fmt(b.taxable_in_bracket)} → </span>
                      <span className='text-xs font-semibold text-white tabular-nums'>{fmt(b.tax_in_bracket)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional taxes */}
          {(result.ltcg_tax > 0 || result.niit > 0 || result.amt > 0) && (
            <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5'>
              <h2 className='text-sm font-semibold mb-3'>Additional federal taxes</h2>
              <div className='space-y-2'>
                {result.ltcg_tax > 0 && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-400'>Long-term capital gains tax</span>
                    <span className='font-semibold tabular-nums'>{fmt(result.ltcg_tax)}</span>
                  </div>
                )}
                {result.niit > 0 && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-400'>Net Investment Income Tax (3.8%)</span>
                    <span className='font-semibold tabular-nums text-amber-400'>{fmt(result.niit)}</span>
                  </div>
                )}
                {result.amt > 0 && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-400'>Alternative Minimum Tax (AMT)</span>
                    <span className='font-semibold tabular-nums text-red-400'>{fmt(result.amt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quarterly payments + bracket headroom */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-white/[0.02] border border-white/[0.06] rounded-xl p-4'>
              <p className='text-[10px] text-gray-500 uppercase tracking-wide mb-1'>Est. quarterly payment</p>
              <p className='text-lg font-bold tabular-nums'>{fmt(result.quarterly_payment)}</p>
              <p className='text-[10px] text-gray-600 mt-1'>Due Apr / Jun / Sep / Jan</p>
            </div>
            <div className='bg-white/[0.02] border border-white/[0.06] rounded-xl p-4'>
              <p className='text-[10px] text-gray-500 uppercase tracking-wide mb-1'>Bracket headroom</p>
              <p className='text-lg font-bold tabular-nums text-emerald-400'>
                {result.bracket_headroom > 0 ? fmt(result.bracket_headroom) : '—'}
              </p>
              <p className='text-[10px] text-gray-600 mt-1'>Before next bracket</p>
            </div>
          </div>

          <div className='flex items-start gap-2 bg-amber-950/20 border border-amber-700/20
            rounded-xl px-3 py-2.5 text-[10px] text-amber-300/80 leading-relaxed'>
            <Info size={11} className='shrink-0 mt-0.5' />
            AI-assisted estimate using 2025 brackets. State tax uses simplified flat rate. Verify with CPA for complex situations.
          </div>
        </div>
      </div>
    </div>
  )
}
