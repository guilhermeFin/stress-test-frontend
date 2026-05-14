import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'
import { ASSET_LOCATION_RECS, type AccountType } from '@/lib/tax'

const ACCOUNT_COLORS: Record<AccountType, { pill: string; label: string }> = {
  taxable:         { pill: 'bg-blue-100 text-blue-800 border border-blue-300',          label: 'Taxable' },
  traditional_ira: { pill: 'bg-amber-100 text-amber-800 border border-amber-300',       label: 'Traditional IRA / 401(k)' },
  roth:            { pill: 'bg-emerald-100 text-emerald-800 border border-emerald-300', label: 'Roth' },
  '401k':          { pill: 'bg-purple-100 text-purple-800 border border-purple-300',    label: '401(k)' },
}

const ACCOUNT_ORDER: AccountType[] = ['roth', 'traditional_ira', 'taxable']

export default function AssetLocationPage() {
  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>

      <Link href='/tax'
        className='flex items-center gap-2 text-sm text-slate-600 hover:text-[#0B1B2E] transition-colors mb-6'>
        <ArrowLeft size={14} /> Tax Planning
      </Link>

      <div className='border-b border-slate-200 pb-6 mb-8'>
        <p className='text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-2'>TAX PLANNING</p>
        <h1 className='text-3xl font-bold text-[#0B1B2E] tracking-tight mb-1'>Asset Location Optimizer</h1>
        <p className='text-base text-slate-600'>
          The right asset in the right account type reduces lifetime tax drag — often by 0.5–1.5% annually.
        </p>
      </div>

      {/* Account type legend */}
      <div className='flex flex-wrap gap-2 mb-6'>
        {ACCOUNT_ORDER.map(ac => {
          const { pill, label } = ACCOUNT_COLORS[ac]
          return (
            <span key={ac} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${pill}`}>
              {label}
            </span>
          )
        })}
      </div>

      {/* Recommendations table */}
      <div className='bg-white border border-slate-200 rounded-xl shadow-sm mb-6'>
        <div className='px-6 py-4 border-b border-slate-200'>
          <h2 className='text-base font-bold text-[#0B1B2E]'>Recommendations by asset class</h2>
        </div>
        <div className='divide-y divide-slate-100'>
          {ASSET_LOCATION_RECS.map(rec => {
            const acct = ACCOUNT_COLORS[rec.recommended_account]
            return (
              <div key={rec.asset_class} className='px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors'>
                <div className='flex-1 min-w-0'>
                  <p className='text-base font-semibold text-[#0B1B2E] mb-1'>{rec.asset_class}</p>
                  <p className='text-sm text-slate-600 leading-relaxed'>{rec.reason}</p>
                </div>
                <div className='shrink-0 flex flex-col items-end gap-1.5'>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${acct.pill}`}>
                    {acct.label}
                  </span>
                  {rec.efficiency_gain != null && (
                    <span className={`text-xs font-semibold font-mono tabular-nums
                      ${rec.efficiency_gain >= 1 ? 'text-emerald-700' : 'text-slate-500'}`}>
                      +{rec.efficiency_gain.toFixed(1)}% efficiency
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Framework cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        {[
          {
            account: 'Roth',
            cardBorder: 'border-emerald-200',
            pillClass:  'bg-emerald-100 text-emerald-800 border border-emerald-300',
            dotClass:   'bg-emerald-500',
            rules: [
              'Highest-expected-return assets',
              'Small-cap & growth equities',
              'Assets you plan to hold longest',
              'Avoid bonds (wastes tax-free compounding)',
            ],
          },
          {
            account: 'Traditional IRA / 401(k)',
            cardBorder: 'border-amber-200',
            pillClass:  'bg-amber-100 text-amber-800 border border-amber-300',
            dotClass:   'bg-amber-500',
            rules: [
              'Fixed income / bonds (defer interest)',
              'REITs (non-qualified dividends)',
              'TIPS (defer phantom income)',
              'Dividend-heavy equities',
            ],
          },
          {
            account: 'Taxable',
            cardBorder: 'border-blue-200',
            pillClass:  'bg-blue-100 text-blue-800 border border-blue-300',
            dotClass:   'bg-blue-500',
            rules: [
              'International equities (FTC benefit)',
              'Tax-managed / index funds (low turnover)',
              'Municipal bonds if in high bracket',
              'Assets you need before 59½',
            ],
          },
        ].map(({ account, cardBorder, pillClass, dotClass, rules }) => (
          <div key={account} className={`bg-white border ${cardBorder} rounded-xl p-5 shadow-sm`}>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${pillClass}`}>
              {account}
            </span>
            <ul className='space-y-2'>
              {rules.map(r => (
                <li key={r} className='text-sm text-slate-700 flex items-start gap-2'>
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className='bg-amber-50 border border-amber-300 rounded-lg p-4'>
        <div className='flex items-start gap-3'>
          <Info size={15} className='shrink-0 mt-0.5 text-amber-600' />
          <p className='text-sm text-amber-800 leading-relaxed'>
            Asset location benefits depend on account sizes, time horizon, and tax rates. The foreign
            tax credit benefit applies only in taxable accounts; verify eligibility annually.{' '}
            <strong className='font-semibold'>AI-assisted — verify before client delivery.</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
