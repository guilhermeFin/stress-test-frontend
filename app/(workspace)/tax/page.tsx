import Link from 'next/link'
import { ChevronRight, Calculator, Search, RefreshCw, MapPin, Heart } from 'lucide-react'

const MODULES = [
  {
    href:    '/tax/projector',
    icon:    Calculator,
    label:   'Tax Projector',
    tagline: 'Full-year liability estimate',
    description: 'Project federal income tax, capital gains, NIIT, and AMT with live bracket breakdown. Updates in real time as you adjust inputs.',
    accent:  '#3B82F6',
  },
  {
    href:    '/tax/tlh',
    icon:    Search,
    label:   'TLH Scanner',
    tagline: 'Tax-loss harvesting opportunities',
    description: 'Scan portfolio positions for unrealized losses. Flags wash-sale risk, estimates tax savings, and suggests replacement securities.',
    accent:  '#10B981',
  },
  {
    href:    '/tax/roth',
    icon:    RefreshCw,
    label:   'Roth Conversion',
    tagline: 'Bracket-fill optimizer',
    description: 'Model multi-year Roth conversion ladders. Shows tax cost now vs. future RMD savings and break-even year.',
    accent:  '#8B5CF6',
  },
  {
    href:    '/tax/location',
    icon:    MapPin,
    label:   'Asset Location',
    tagline: 'Tax-efficiency optimizer',
    description: 'See which asset classes belong in taxable, tax-deferred, or Roth accounts to minimize lifetime tax drag.',
    accent:  '#F59E08',
  },
  {
    href:    '/tax/charitable',
    icon:    Heart,
    label:   'Charitable Giving',
    tagline: 'Vehicle comparator',
    description: 'Compare DAF, QCD, direct stock donation, CRT, and private foundation side-by-side. See after-tax cost and charity amount for each.',
    accent:  '#EC4899',
  },
]

export default function TaxHubPage() {
  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>
      <div className='mb-10'>
        <h1 className='text-2xl font-bold tracking-tight mb-2'>Tax Planning</h1>
        <p className='text-sm text-gray-500 max-w-xl'>
          Five tax planning tools covering projection, loss harvesting, Roth conversions,
          asset location, and charitable giving — all client-ready.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {MODULES.map(({ href, icon: Icon, label, tagline, description, accent }) => (
          <Link key={href} href={href}
            className='group flex flex-col bg-white/[0.025] border border-white/[0.06]
              hover:border-white/12 rounded-2xl p-5 transition-all'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 rounded-xl flex items-center justify-center'
                style={{ background: `${accent}18` }}>
                <Icon size={17} style={{ color: accent }} />
              </div>
              <div>
                <p className='text-sm font-semibold text-white'>{label}</p>
                <p className='text-[10px] text-gray-500'>{tagline}</p>
              </div>
            </div>
            <p className='text-xs text-gray-400 leading-relaxed flex-1 mb-4'>{description}</p>
            <div className='flex items-center gap-1 text-xs font-medium transition-colors'
              style={{ color: accent }}>
              Open <ChevronRight size={13} className='group-hover:translate-x-0.5 transition-transform' />
            </div>
          </Link>
        ))}
      </div>

      <div className='mt-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5'>
        <p className='text-xs text-gray-500 leading-relaxed'>
          <strong className='text-amber-400'>AI-assisted — verify before client delivery.</strong>{' '}
          All projections use 2025 federal tax brackets and rates. State tax estimates use simplified flat rates.
          Consult a CPA for complex situations involving AMT, UBTI, or multi-state filing.
        </p>
      </div>
    </div>
  )
}
