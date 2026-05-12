import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'
import { ASSET_LOCATION_RECS, type AccountType } from '@/lib/tax'

const ACCOUNT_COLORS: Record<AccountType, { bg: string; text: string; label: string }> = {
  taxable:         { bg: 'bg-blue-400/10',   text: 'text-blue-400',   label: 'Taxable' },
  traditional_ira: { bg: 'bg-amber-400/10',  text: 'text-amber-400',  label: 'Traditional IRA / 401(k)' },
  roth:            { bg: 'bg-emerald-400/10', text: 'text-emerald-400', label: 'Roth' },
  '401k':          { bg: 'bg-purple-400/10', text: 'text-purple-400', label: '401(k)' },
}

const ACCOUNT_ORDER: AccountType[] = ['roth', 'traditional_ira', 'taxable']

export default function AssetLocationPage() {
  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>

      <Link href='/tax'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Tax Planning
      </Link>

      <div className='mb-8'>
        <h1 className='text-2xl font-bold tracking-tight mb-1'>Asset Location Optimizer</h1>
        <p className='text-sm text-gray-500'>
          The right asset in the right account type reduces lifetime tax drag — often by 0.5–1.5% annually.
        </p>
      </div>

      {/* Account type legend */}
      <div className='flex flex-wrap gap-3 mb-6'>
        {ACCOUNT_ORDER.map(ac => {
          const { bg, text, label } = ACCOUNT_COLORS[ac]
          return (
            <div key={ac} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${bg}`}>
              <span className={`text-xs font-semibold ${text}`}>{label}</span>
            </div>
          )
        })}
      </div>

      {/* Recommendations table */}
      <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden mb-4'>
        <div className='px-5 py-3 border-b border-white/[0.04]'>
          <h2 className='text-sm font-semibold'>Recommendations by asset class</h2>
        </div>
        <div className='divide-y divide-white/[0.04]'>
          {ASSET_LOCATION_RECS.map(rec => {
            const acct = ACCOUNT_COLORS[rec.recommended_account]
            return (
              <div key={rec.asset_class} className='px-5 py-4 flex items-start gap-4'>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold mb-0.5'>{rec.asset_class}</p>
                  <p className='text-xs text-gray-400 leading-relaxed'>{rec.reason}</p>
                </div>
                <div className='shrink-0 flex flex-col items-end gap-1'>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${acct.bg} ${acct.text}`}>
                    {acct.label}
                  </span>
                  {rec.efficiency_gain != null && (
                    <span className={`text-[10px] font-medium
                      ${rec.efficiency_gain >= 1 ? 'text-emerald-400' : 'text-gray-500'}`}>
                      +{rec.efficiency_gain.toFixed(1)}% efficiency
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Framework card */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
        {[
          {
            account: 'Roth',
            color: 'border-emerald-700/30 bg-emerald-950/20',
            hdr: 'text-emerald-400',
            rules: [
              'Highest-expected-return assets',
              'Small-cap & growth equities',
              'Assets you plan to hold longest',
              'Avoid bonds (wastes tax-free compounding)',
            ],
          },
          {
            account: 'Traditional IRA / 401(k)',
            color: 'border-amber-700/30 bg-amber-950/20',
            hdr: 'text-amber-400',
            rules: [
              'Fixed income / bonds (defer interest)',
              'REITs (non-qualified dividends)',
              'TIPS (defer phantom income)',
              'Dividend-heavy equities',
            ],
          },
          {
            account: 'Taxable',
            color: 'border-blue-700/30 bg-blue-950/20',
            hdr: 'text-blue-400',
            rules: [
              'International equities (FTC benefit)',
              'Tax-managed / index funds (low turnover)',
              'Municipal bonds if in high bracket',
              'Assets you need before 59½',
            ],
          },
        ].map(({ account, color, hdr, rules }) => (
          <div key={account} className={`border rounded-2xl p-4 ${color}`}>
            <h3 className={`text-sm font-bold mb-3 ${hdr}`}>{account}</h3>
            <ul className='space-y-1.5'>
              {rules.map(r => (
                <li key={r} className='text-xs text-gray-400 flex items-start gap-1.5'>
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${hdr.replace('text-', 'bg-')}`} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className='flex items-start gap-2 bg-amber-950/20 border border-amber-700/20
        rounded-xl px-3 py-2.5 text-[10px] text-amber-300/80 leading-relaxed'>
        <Info size={11} className='shrink-0 mt-0.5' />
        Asset location benefits depend on account sizes, time horizon, and tax rates. The foreign tax credit benefit applies only in taxable accounts; verify eligibility annually. AI-assisted — verify before client delivery.
      </div>
    </div>
  )
}
