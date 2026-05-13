'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'
import {
  calculateEstateTax, annualGiftingCapacity,
  FEDERAL_EXEMPTION_PER_PERSON, ANNUAL_GIFT_EXCLUSION, STATE_ESTATE_TAX,
  MOCK_FAMILY, MOCK_GIFTS, MOCK_DOCUMENTS,
  type FamilyMember, type GiftRecord, type DocumentStatus,
} from '@/lib/estate'

function fmt(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n}`
}

const ROLE_LABEL: Record<string, string> = {
  primary: 'Primary', spouse: 'Spouse', child: 'Child',
  grandchild: 'Grandchild', trust: 'Trust', charity: 'Charity',
}

const DOC_STATUS_ICON = {
  current:  CheckCircle2,
  outdated: AlertTriangle,
  missing:  XCircle,
}
const DOC_STATUS_COLOR = {
  current:  'text-[#15803D]',
  outdated: 'text-amber-600',
  missing:  'text-[#B91C1C]',
}

type Tab = 'overview' | 'family' | 'gifts' | 'documents'

export default function EstatePage() {
  const [tab, setTab] = useState<Tab>('overview')

  // Estate tax inputs
  const [grossEstate, setGrossEstate]   = useState(8_500_000)
  const [married, setMarried]           = useState(true)
  const [lifetimeUsed, setLifetimeUsed] = useState(500_000)
  const [maritalDed, setMaritalDed]     = useState(0)
  const [charDed, setCharDed]           = useState(0)
  const [debts, setDebts]               = useState(250_000)
  const [state, setState]               = useState('New York')

  // Family & gifts
  const [family, setFamily] = useState<FamilyMember[]>(MOCK_FAMILY)
  const [gifts, setGifts]   = useState<GiftRecord[]>(MOCK_GIFTS)
  const [docs]              = useState<DocumentStatus[]>(MOCK_DOCUMENTS)

  const projection = useMemo(
    () => calculateEstateTax(grossEstate, married, lifetimeUsed, state, maritalDed, charDed, debts),
    [grossEstate, married, lifetimeUsed, state, maritalDed, charDed, debts]
  )

  const thisYearGifts   = gifts.filter(g => g.date.startsWith('2025'))
  const totalGifted2025 = thisYearGifts.reduce((s, g) => s + g.amount, 0)
  const giftCapacity    = annualGiftingCapacity(family.filter(m => m.role !== 'primary' && m.role !== 'spouse').length, married)
  const giftRemaining   = giftCapacity - totalGifted2025

  const docIssues = docs.filter(d => d.status !== 'current').length

  const addGift = () => {
    const newGift: GiftRecord = {
      id:             crypto.randomUUID(),
      from_member_id: family[0]?.id ?? '',
      to_member_id:   family[2]?.id ?? '',
      amount:         ANNUAL_GIFT_EXCLUSION,
      date:           new Date().toISOString().slice(0, 10),
      gift_type:      'annual_exclusion',
    }
    setGifts(g => [newGift, ...g])
  }

  const removeGift = (id: string) => setGifts(g => g.filter(x => x.id !== id))

  const memberName = (id: string) => family.find(m => m.id === id)?.name ?? id

  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>

      {/* Page header */}
      <div className='border-b border-slate-200 pb-6 mb-6'>
        <p className='text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-1'>WORKSPACE</p>
        <h1 className='text-3xl font-bold text-[#0B1B2E] tracking-tight mb-1'>Estate Planning</h1>
        <p className='text-base text-slate-600'>
          Federal + state estate tax projection, annual gifting tracker, family map, and document audit.
        </p>
      </div>

      {/* Tabs — underline style */}
      <div className='border-b border-slate-200 mb-6'>
        <div className='flex gap-8'>
          {([
            { key: 'overview',   label: 'Tax Projection' },
            { key: 'family',     label: 'Family Map' },
            { key: 'gifts',      label: 'Gifting Tracker' },
            { key: 'documents',  label: `Documents${docIssues > 0 ? ` (${docIssues})` : ''}` },
          ] as { key: Tab; label: string }[]).map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors
                ${tab === key
                  ? 'border-[#2563EB] text-[#0B1B2E] font-semibold'
                  : `border-transparent hover:text-[#0B1B2E]
                    ${key === 'documents' && docIssues > 0 ? 'text-amber-600' : 'text-slate-600'}`}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Overview: Estate Tax Projection ── */}
      {tab === 'overview' && (
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
          {/* Inputs */}
          <div className='lg:col-span-2 space-y-4'>
            <div className='bg-white border border-slate-200 rounded-lg p-5 space-y-4'>
              <h2 className='text-sm font-semibold text-[#0B1B2E]'>Estate inputs</h2>

              {[
                { label: 'Gross estate', value: grossEstate, set: setGrossEstate, step: 100_000 },
                { label: 'Marital deduction', value: maritalDed, set: setMaritalDed, step: 100_000 },
                { label: 'Charitable deduction', value: charDed, set: setCharDed, step: 10_000 },
                { label: 'Debts & expenses', value: debts, set: setDebts, step: 10_000 },
                { label: 'Lifetime exemption used', value: lifetimeUsed, set: setLifetimeUsed, step: 100_000 },
              ].map(({ label, value, set: s, step }) => (
                <div key={label}>
                  <label className='text-xs text-slate-600 mb-1 block font-medium'>{label}</label>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm'>$</span>
                    <input type='number' step={step} min={0} value={value}
                      onChange={e => s(Number(e.target.value))}
                      className='w-full bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-2
                        text-sm text-[#0B1B2E] focus:outline-none focus:ring-1 focus:ring-[#2563EB]
                        focus:border-[#2563EB] tabular-nums transition-colors' />
                  </div>
                </div>
              ))}

              <div className='flex items-center gap-3'>
                <button onClick={() => setMarried(m => !m)}
                  className={`w-9 h-5 rounded-full transition-colors shrink-0 ${married ? 'bg-[#2563EB]' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5
                    ${married ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <span className='text-xs text-slate-600'>Married (portability applies)</span>
              </div>

              <div>
                <label className='text-xs text-slate-600 mb-1 block font-medium'>State of domicile</label>
                <select value={state} onChange={e => setState(e.target.value)}
                  className='w-full bg-white border border-slate-200 rounded-lg px-3 py-2
                    text-sm text-[#0B1B2E] focus:outline-none focus:ring-1 focus:ring-[#2563EB]
                    focus:border-[#2563EB] transition-colors'>
                  {Object.keys(STATE_ESTATE_TAX).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className='lg:col-span-3 space-y-4'>
            {/* Key metrics */}
            <div className='grid grid-cols-2 gap-3'>
              {[
                { label: 'Gross estate',       value: fmt(projection.gross_estate),        color: 'text-[#0B1B2E]' },
                { label: 'Taxable estate',      value: fmt(projection.taxable_estate),       color: 'text-[#0B1B2E]' },
                { label: 'Federal estate tax',  value: fmt(projection.federal_estate_tax),   color: projection.federal_estate_tax > 0 ? 'text-[#B91C1C]' : 'text-[#15803D]' },
                { label: 'State estate tax',    value: fmt(projection.state_estate_tax),     color: projection.state_estate_tax > 0 ? 'text-[#B91C1C]' : 'text-[#15803D]' },
                { label: 'Total estate tax',    value: fmt(projection.total_estate_tax),     color: projection.total_estate_tax > 0 ? 'text-[#B91C1C]' : 'text-[#15803D]', accent: true },
                { label: 'Heirs receive',       value: fmt(projection.heirs_receive),        color: 'text-[#15803D]', accent: true },
              ].map(({ label, value, color, accent }) => (
                <div key={label}
                  className={`rounded-lg p-4 border ${accent ? 'bg-[#2563EB]/5 border-[#2563EB]/20' : 'bg-white border-slate-200'}`}>
                  <p className='text-[10px] text-slate-500 uppercase tracking-wide mb-1'>{label}</p>
                  <p className={`text-lg font-bold tabular-nums ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Waterfall */}
            <div className='bg-white border border-slate-200 rounded-lg p-5'>
              <h2 className='text-sm font-semibold text-[#0B1B2E] mb-4'>Estate waterfall</h2>
              {[
                { label: 'Gross estate',           value: projection.gross_estate,          color: '#3B82F6' },
                { label: '− Debts & expenses',     value: -projection.debts_and_expenses,   color: '#94A3B8' },
                { label: '− Marital deduction',    value: -projection.marital_deduction,    color: '#94A3B8' },
                { label: '− Charitable deduction', value: -projection.charitable_deduction, color: '#94A3B8' },
                { label: '= Taxable estate',       value: projection.taxable_estate,        color: '#F59E08' },
                { label: '− Federal exemption',    value: -Math.min(projection.taxable_estate, projection.exemption_remaining), color: '#10B981' },
                { label: '− Federal estate tax',   value: -projection.federal_estate_tax,   color: '#EF4444' },
                { label: '− State estate tax',     value: -projection.state_estate_tax,     color: '#F97316' },
                { label: '= Heirs receive',        value: projection.heirs_receive,         color: '#10B981' },
              ].filter(r => r.value !== 0).map(({ label, value, color }) => (
                <div key={label} className='flex items-center gap-3 mb-2'>
                  <span className='text-xs text-slate-600 w-44 shrink-0'>{label}</span>
                  <div className='flex-1 h-4 bg-slate-100 rounded overflow-hidden'>
                    <div className='h-full rounded transition-all'
                      style={{
                        width: `${(Math.abs(value) / projection.gross_estate) * 100}%`,
                        background: color, opacity: 0.8,
                      }} />
                  </div>
                  <span className='text-xs font-semibold tabular-nums w-24 text-right'
                    style={{ color }}>
                    {value < 0 ? '-' : ''}{fmt(Math.abs(value))}
                  </span>
                </div>
              ))}
            </div>

            {/* Exemption status */}
            <div className='bg-white border border-slate-200 rounded-lg p-4'>
              <div className='flex justify-between text-xs mb-2'>
                <span className='text-slate-600'>Federal exemption remaining</span>
                <span className='font-bold text-[#0B1B2E] tabular-nums'>
                  {fmt(projection.exemption_remaining)} / {fmt(FEDERAL_EXEMPTION_PER_PERSON * (married ? 2 : 1))}
                </span>
              </div>
              <div className='h-2 bg-slate-100 rounded-full overflow-hidden'>
                <div className='h-full bg-emerald-500 rounded-full transition-all'
                  style={{ width: `${(projection.exemption_remaining / (FEDERAL_EXEMPTION_PER_PERSON * (married ? 2 : 1))) * 100}%` }} />
              </div>
              <p className='text-[10px] text-slate-500 mt-2'>
                2025 federal exemption: {fmt(FEDERAL_EXEMPTION_PER_PERSON)} per person
                {married ? ` · ${fmt(FEDERAL_EXEMPTION_PER_PERSON * 2)} total with portability` : ''}
              </p>
            </div>

            <div className='flex items-start gap-2 bg-amber-50 border border-amber-200
              rounded-lg px-3 py-2.5 text-[10px] text-amber-800 leading-relaxed'>
              <Info size={11} className='shrink-0 mt-0.5' />
              AI-assisted estimate. Federal exemption sunsets after 2025 to ~$7M without legislation. State estate taxes vary. Verify with estate planning attorney.
            </div>
          </div>
        </div>
      )}

      {/* ── Family Map ── */}
      {tab === 'family' && (
        <div className='space-y-3'>
          {family.map(m => (
            <div key={m.id}
              className='flex items-center gap-4 bg-white border border-slate-200
                rounded-lg px-5 py-4'>
              <div className='w-10 h-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center
                text-sm font-bold text-[#2563EB] shrink-0'>
                {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className='flex-1'>
                <p className='text-sm font-semibold text-[#0B1B2E]'>{m.name}</p>
                <p className='text-xs text-slate-500'>
                  {ROLE_LABEL[m.role]}
                  {m.dob && ` · Born ${new Date(m.dob).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                </p>
              </div>
              {m.is_beneficiary && (
                <div className='text-right'>
                  <span className='text-xs font-semibold text-emerald-700 bg-emerald-100
                    border border-emerald-200 px-2.5 py-1 rounded-full'>
                    Beneficiary {m.beneficiary_pct != null ? `${m.beneficiary_pct}%` : ''}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Gifting Tracker ── */}
      {tab === 'gifts' && (
        <div className='space-y-4'>
          {/* Annual capacity card */}
          <div className='grid grid-cols-3 gap-3'>
            {[
              { label: '2025 exclusion / recipient', value: fmt(ANNUAL_GIFT_EXCLUSION), color: 'text-[#0B1B2E]' },
              { label: '2025 capacity (all recipients)', value: fmt(giftCapacity), color: 'text-[#0B1B2E]' },
              { label: 'Remaining this year', value: fmt(Math.max(0, giftRemaining)), color: giftRemaining > 0 ? 'text-[#15803D]' : 'text-amber-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className='bg-white border border-slate-200 rounded-lg p-4'>
                <p className='text-[10px] text-slate-500 uppercase tracking-wide mb-1'>{label}</p>
                <p className={`text-lg font-bold tabular-nums ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Gift log */}
          <div className='bg-white border border-slate-200 rounded-lg overflow-hidden'>
            <div className='flex items-center justify-between px-5 py-3 border-b border-slate-100'>
              <h2 className='text-sm font-semibold text-[#0B1B2E]'>Gift log</h2>
              <button onClick={addGift}
                className='flex items-center gap-1.5 text-xs font-semibold text-white
                  bg-[#2563EB] hover:bg-[#1D4ED8] rounded-md px-3 py-1.5 transition-colors'>
                <Plus size={11} /> Add gift
              </button>
            </div>
            <div className='divide-y divide-slate-100'>
              {gifts.map(g => (
                <div key={g.id} className='flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-[#0B1B2E]'>
                      <span className='font-medium'>{memberName(g.from_member_id)}</span>
                      <span className='text-slate-400'> → </span>
                      <span className='font-medium'>{memberName(g.to_member_id)}</span>
                    </p>
                    <p className='text-xs text-slate-500 mt-0.5 capitalize'>
                      {g.gift_type.replace(/_/g, ' ')} · {g.date}
                      {g.description && ` · ${g.description}`}
                    </p>
                  </div>
                  <p className='text-sm font-bold tabular-nums text-[#0B1B2E]'>{fmt(g.amount)}</p>
                  <button onClick={() => removeGift(g.id)}
                    className='p-1.5 rounded-md text-slate-400 hover:text-[#B91C1C] hover:bg-red-50 transition-colors ml-1'>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Documents ── */}
      {tab === 'documents' && (
        <div className='space-y-2'>
          {docs.map(doc => {
            const Icon  = DOC_STATUS_ICON[doc.status]
            const color = DOC_STATUS_COLOR[doc.status]
            return (
              <div key={doc.type}
                className='flex items-start gap-4 bg-white border border-slate-200
                  rounded-lg px-5 py-4 hover:border-slate-300 transition-colors'>
                <Icon size={16} className={`${color} shrink-0 mt-0.5`} />
                <div className='flex-1'>
                  <p className='text-sm font-medium text-[#0B1B2E]'>{doc.type}</p>
                  {doc.status === 'current' && doc.last_updated && (
                    <p className='text-xs text-slate-500'>Last updated {doc.last_updated}</p>
                  )}
                  {doc.status === 'outdated' && (
                    <p className='text-xs text-amber-600'>{doc.notes ?? 'Needs review'}</p>
                  )}
                  {doc.status === 'missing' && (
                    <p className='text-xs text-[#B91C1C]'>Missing — recommend obtaining</p>
                  )}
                </div>
                <span className={`text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full border
                  ${doc.status === 'current'  ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                    doc.status === 'outdated' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-red-100 text-red-700 border-red-200'}`}>
                  {doc.status}
                </span>
              </div>
            )
          })}
          <p className='text-[10px] text-slate-500 px-1'>
            AI-assisted review — verify document status with the client&apos;s estate planning attorney.
          </p>
        </div>
      )}
    </div>
  )
}
