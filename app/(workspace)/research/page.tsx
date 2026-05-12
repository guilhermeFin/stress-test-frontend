import Link from 'next/link'
import { ChevronRight, TrendingUp, Users2, GraduationCap } from 'lucide-react'

const MODULES = [
  {
    href:        '/research/macro',
    icon:        TrendingUp,
    label:       'Macro Dashboard',
    tagline:     'Live market indicators',
    description: 'Yield curve, credit spreads, breakeven inflation, VIX, FX, commodities. All the macro context you need before a client meeting.',
    accent:      '#3B82F6',
  },
  {
    href:        '/research/managers',
    icon:        Users2,
    label:       'Manager Due Diligence',
    tagline:     'Fund evaluation workspace',
    description: 'Track returns, Sharpe ratios, max drawdowns, fees, and qualitative notes for every manager under evaluation. Rate and review.',
    accent:      '#8B5CF6',
  },
  {
    href:        '/research/education',
    icon:        GraduationCap,
    label:       'Education Library',
    tagline:     'Client-ready slide decks',
    description: '12 pre-built educational modules — investor archetypes, asset class primers, tax strategies, estate planning, and behavioral coaching.',
    accent:      '#10B981',
  },
]

export default function ResearchHubPage() {
  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>
      <div className='mb-10'>
        <h1 className='text-2xl font-bold tracking-tight mb-2'>Research</h1>
        <p className='text-sm text-gray-500 max-w-xl'>
          Macro context, fund due diligence, and client education content —
          everything you need to walk into a meeting confident.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {MODULES.map(({ href, icon: Icon, label, tagline, description, accent }) => (
          <Link key={href} href={href}
            className='group flex flex-col bg-white/[0.025] border border-white/[0.06]
              hover:border-white/12 rounded-2xl p-5 transition-all'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 rounded-xl flex items-center justify-center'
                style={{ background: `${accent}18` }}>
                <Icon size={18} style={{ color: accent }} />
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
    </div>
  )
}
