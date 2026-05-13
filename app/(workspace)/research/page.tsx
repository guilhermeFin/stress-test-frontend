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

      {/* Page header */}
      <div className='border-b border-slate-200 pb-6 mb-8'>
        <p className='text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-1'>WORKSPACE</p>
        <h1 className='text-3xl font-bold text-[#0B1B2E] tracking-tight mb-1'>Research</h1>
        <p className='text-base text-slate-600 max-w-xl'>
          Macro context, fund due diligence, and client education content —
          everything you need to walk into a meeting confident.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {MODULES.map(({ href, icon: Icon, label, tagline, description, accent }) => (
          <Link key={href} href={href}
            className='group flex flex-col bg-white border border-slate-200
              hover:border-slate-300 hover:shadow-sm rounded-lg p-5 transition-all'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 rounded-lg flex items-center justify-center'
                style={{ background: `${accent}18` }}>
                <Icon size={18} style={{ color: accent }} />
              </div>
              <div>
                <p className='text-sm font-semibold text-[#0B1B2E]'>{label}</p>
                <p className='text-[10px] text-slate-500'>{tagline}</p>
              </div>
            </div>
            <p className='text-xs text-slate-600 leading-relaxed flex-1 mb-4'>{description}</p>
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
