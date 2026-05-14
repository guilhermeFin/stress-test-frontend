'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'
import {
  calculateTax, type TaxInputs, type FilingStatus,
  FILING_LABELS, STANDARD_DEDUCTION,
} from '@/lib/tax'

const US_STATES: { label: string; rate: number }[] = [
  { label: 'No state income tax',   rate: 0 },
  { label: 'California (13.3%)',    rate: 0.133 },
  { label: 'New York (10.9%)',      rate: 0.109 },
  { label: 'New Jersey (10.75%)',   rate: 0.1075 },
  { label: 'Oregon (9.9%)',         rate: 0.099 },
  { label: 'Minnesota (9.85%)',     rate: 0.0985 },
  { label: 'Vermont (8.75%)',       rate: 0.0875 },
  { label: 'Wisconsin (7.65%)',     rate: 0.0765 },
  { label: 'Georgia (5.75%)',       rate: 0.0575 },
  { label: 'Arizona (2.5%)',        rate: 0.025 },
  { label: 'Colorado (4.4%)',       rate: 0.044 },
  { label: 'Illinois (4.95%)',      rate: 0.0495 },
  { label: 'Pennsylvania (3.07%)',  rate: 0.0307 },
  { label: 'Massachusetts (5%)',    rate: 0.05 },
]

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function fmtPct(n: number) { return (n * 100).toFixed(2) + '%' }

const BRACKET_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E08', '#EF4444', '#EC4899', '#F97316']

function NumberInput({ label, value, onChange, step = 1000 }: {
  label: string; value: number; onChange: (v: number) => void; step?: number
}) {
  return (
    <div>
      <label className='text-sm font-semibold text-[#0B1B2E] mb-2 block'>{label}</label>
      <div className='flex rounded-md overflow-hidden border border-slate-300 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20'>
        <span className='bg-slate-100 border-r border-slate-300 px-3 py-2.5 text-slate-500 font-medium text-sm shrink-0'>$</span>
        <input
          type='number' step={step} min={0} value={value}
          onChange={e => onChange(Math.max(0, Number(e.target.value)))}
          className='w-full bg-slate-50 focus:bg-white px-3 py-2.5 text-sm text-[#0B1B2E] focus:outline-none tabular-nums font-mono'
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
        className='flex items-center gap-2 text-sm text-slate-600 hover:text-[#0B1B2E] transition-colors mb-6'>
        <ArrowLeft size={14} /> Tax Planning
      </Link>

      <div className='border-b border-slate-200 pb-6 mb-8'>
        <p className='text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-2'>TAX PLANNING</p>
        <h1 className='text-3xl font-bold text-[#0B1B2E] tracking-tight mb-1'>Tax Projector</h1>
        <p className='text-base text-slate-600'>2025 federal tax brackets. Updates in real time as you adjust inputs.</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>

        {/* Inputs — 2 columns */}
        <div className='lg:col-span-2 space-y-4'>

          {/* Filing status */}
          <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm'>
            <h2 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3 mb-4'>Filing status</h2>
            <div className='bg-white border border-slate-200 rounded-lg p-1 grid grid-cols-2 gap-1'>
              {(Object.keys(FILING_LABELS) as FilingStatus[]).map(fs => (
                <button key={fs} onClick={() => set('filing_status')(fs)}
                  className={`text-xs px-3 py-2 rounded-md font-medium transition-colors text-left
                    ${inputs.filing_status === fs
                      ? 'bg-[#2563EB] text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B1B2E]'}`}>
                  {FILING_LABELS[fs]}
                </button>
              ))}
            </div>
          </div>

          {/* Income */}
          <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4'>
            <h2 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3 mb-2'>Income</h2>
            <NumberInput label='W-2 / Salary'               value={inputs.w2_income}           onChange={set('w2_income')} />
            <NumberInput label='Business / self-employment'  value={inputs.business_income}     onChange={set('business_income')} />
            <NumberInput label='Interest income'             value={inputs.interest_income}     onChange={set('interest_income')} step={500} />
            <NumberInput label='Qualified dividends'         value={inputs.qualified_dividends} onChange={set('qualified_dividends')} step={500} />
            <NumberInput label='Short-term capital gains'    value={inputs.short_term_gains}    onChange={set('short_term_gains')} />
            <NumberInput label='Long-term capital gains'     value={inputs.long_term_gains}     onChange={set('long_term_gains')} />
          </div>

          {/* Deductions */}
          <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4'>
            <h2 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3 mb-2'>Deductions</h2>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => set('use_itemized')(!inputs.use_itemized)}
                className={`w-9 h-5 rounded-full transition-colors ${inputs.use_itemized ? 'bg-[#2563EB]' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5
                  ${inputs.use_itemized ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
              <span className='text-sm font-semibold text-[#0B1B2E]'>Itemize deductions</span>
            </div>
            {inputs.use_itemized ? (
              <NumberInput
                label={`Itemized deductions (std: ${fmt(stdDeduction)})`}
                value={inputs.itemized_deductions}
                onChange={set('itemized_deductions')}
              />
            ) : (
              <p className='text-sm text-slate-600'>
                Standard deduction: <span className='font-mono font-semibold tabular-nums'>{fmt(stdDeduction)}</span>
              </p>
            )}
          </div>

          {/* State */}
          <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm'>
            <h2 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3 mb-4'>State income tax</h2>
            <label className='text-sm font-semibold text-[#0B1B2E] mb-2 block'>State / rate</label>
            <select
              value={inputs.state_rate}
              onChange={e => set('state_rate')(Number(e.target.value))}
              className='w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2.5
                text-sm text-[#0B1B2E] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white'
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
              { label: 'AGI',            value: fmt(result.agi),              sub: '' },
              { label: 'Taxable income', value: fmt(result.taxable_income),   sub: '' },
              { label: 'Federal tax',    value: fmt(totalFederal),            sub: `${fmtPct(totalFederal / Math.max(1, result.agi))} eff.` },
              { label: 'State tax',      value: fmt(stateTax),                sub: `${fmtPct(inputs.state_rate)} rate` },
              { label: 'Total tax bill', value: fmt(grandTotal),              sub: `${fmtPct(grandTotal / Math.max(1, result.agi))} eff.`, accent: true },
              { label: 'Marginal rate',  value: fmtPct(result.marginal_rate), sub: 'Ordinary income' },
            ].map(({ label, value, sub, accent }) => (
              <div key={label}
                className={`rounded-xl p-4 border ${accent ? 'bg-[#2563EB]/5 border-[#2563EB]' : 'bg-white border-slate-200 shadow-sm'}`}>
                <p className='text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2'>{label}</p>
                <p className={`text-xl font-bold tabular-nums font-mono ${accent ? 'text-[#2563EB]' : 'text-[#0B1B2E]'}`}>{value}</p>
                {sub && <p className='text-xs text-slate-500 mt-1'>{sub}</p>}
              </div>
            ))}
          </div>

          {/* Bracket breakdown */}
          <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm'>
            <h2 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3 mb-4'>Federal bracket breakdown</h2>
            {result.bracket_breakdown.length === 0 ? (
              <p className='text-sm text-slate-600'>No taxable ordinary income.</p>
            ) : (
              <div className='space-y-1'>
                <div className='flex items-center gap-3 pb-3 border-b border-slate-200'>
                  <span className='w-8 text-xs font-semibold uppercase tracking-wide text-slate-500'>Rate</span>
                  <span className='flex-1 text-xs font-semibold uppercase tracking-wide text-slate-500'>Bracket fill</span>
                  <span className='text-right shrink-0 w-36 text-xs font-semibold uppercase tracking-wide text-slate-500'>Income → Tax</span>
                </div>
                {result.bracket_breakdown.map((b, i) => (
                  <div key={i} className='flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0'>
                    <span className='w-8 text-sm font-bold tabular-nums'
                      style={{ color: BRACKET_COLORS[i % BRACKET_COLORS.length] }}>
                      {(b.rate * 100).toFixed(0)}%
                    </span>
                    <div className='flex-1 h-5 bg-slate-100 rounded overflow-hidden'>
                      <div className='h-full rounded transition-all'
                        style={{
                          width: `${(b.taxable_in_bracket / result.taxable_income) * 100}%`,
                          background: BRACKET_COLORS[i % BRACKET_COLORS.length],
                          opacity: 0.6,
                        }}
                      />
                    </div>
                    <div className='text-right shrink-0 w-36'>
                      <span className='text-xs text-slate-600 tabular-nums font-mono'>{fmt(b.taxable_in_bracket)} → </span>
                      <span className='text-xs font-semibold text-[#0B1B2E] tabular-nums font-mono'>{fmt(b.tax_in_bracket)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional taxes */}
          {(result.ltcg_tax > 0 || result.niit > 0 || result.amt > 0) && (
            <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm'>
              <h2 className='text-base font-bold text-[#0B1B2E] border-b border-slate-200 pb-3 mb-2'>Additional federal taxes</h2>
              <div>
                {result.ltcg_tax > 0 && (
                  <div className='flex justify-between items-center py-3 border-b border-slate-100 last:border-0'>
                    <span className='text-sm text-slate-700'>Long-term capital gains tax</span>
                    <span className='text-sm font-semibold tabular-nums font-mono text-[#0B1B2E]'>{fmt(result.ltcg_tax)}</span>
                  </div>
                )}
                {result.niit > 0 && (
                  <div className='flex justify-between items-center py-3 border-b border-slate-100 last:border-0'>
                    <span className='text-sm text-slate-700'>Net Investment Income Tax (3.8%)</span>
                    <span className='text-sm font-semibold tabular-nums font-mono text-amber-700'>{fmt(result.niit)}</span>
                  </div>
                )}
                {result.amt > 0 && (
                  <div className='flex justify-between items-center py-3 border-b border-slate-100 last:border-0'>
                    <span className='text-sm text-slate-700'>Alternative Minimum Tax (AMT)</span>
                    <span className='text-sm font-semibold tabular-nums font-mono text-red-600'>{fmt(result.amt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quarterly payments + bracket headroom */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-white border border-slate-200 rounded-xl p-4 shadow-sm'>
              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2'>Est. quarterly payment</p>
              <p className='text-xl font-bold tabular-nums font-mono text-[#0B1B2E]'>{fmt(result.quarterly_payment)}</p>
              <p className='text-xs text-slate-500 mt-1'>Due Apr / Jun / Sep / Jan</p>
            </div>
            <div className='bg-white border border-slate-200 rounded-xl p-4 shadow-sm'>
              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2'>Bracket headroom</p>
              <p className='text-xl font-bold tabular-nums font-mono text-emerald-700'>
                {result.bracket_headroom > 0 ? fmt(result.bracket_headroom) : '—'}
              </p>
              <p className='text-xs text-slate-500 mt-1'>Before next bracket</p>
            </div>
          </div>

          <div className='bg-amber-50 border border-amber-300 rounded-lg p-4'>
            <div className='flex items-start gap-3'>
              <Info size={15} className='shrink-0 mt-0.5 text-amber-600' />
              <p className='text-sm text-amber-800 leading-relaxed'>
                <strong className='font-semibold'>AI-assisted estimate</strong> using 2025 brackets.
                State tax uses simplified flat rate. Verify with CPA for complex situations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
