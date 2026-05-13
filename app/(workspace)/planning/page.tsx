import Link from 'next/link'
import { FileText, Target, LayoutTemplate, ChevronRight, ArrowRight } from 'lucide-react'

const MODULES = [
  {
    href:    '/planning/ips',
    icon:    FileText,
    label:   'IPS Builder',
    tagline: 'Investment Policy Statement',
    description:
      'Define target allocations, drift bands, and rebalance rules per household. Version-controlled so you always have an audit trail.',
    cta:     'Open IPS builder',
    accent:  '#3B82F6',
  },
  {
    href:    '/planning/goals',
    icon:    Target,
    label:   'Goal Planning',
    tagline: 'Monte Carlo projections',
    description:
      'Model retirement, college, home, and legacy goals. Run 1,000-path Monte Carlo simulations to show funded ratio and ruin probability.',
    cta:     'Plan goals',
    accent:  '#10B981',
  },
  {
    href:    '/planning/strategies',
    icon:    LayoutTemplate,
    label:   'Strategy Templates',
    tagline: 'Pre-built & custom',
    description:
      'Choose from five evidence-based allocation templates — Conservative Income, Balanced Growth, Aggressive Growth, All-Weather, Factor Tilt — then fork and customize.',
    cta:     'Browse templates',
    accent:  '#8B5CF6',
  },
]

export default function PlanningHubPage() {
  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>

      {/* Page header */}
      <div className='border-b border-slate-200 pb-6 mb-8'>
        <p className='text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-1'>WORKSPACE</p>
        <h1 className='text-3xl font-bold text-[#0B1B2E] tracking-tight mb-1'>Planning</h1>
        <p className='text-base text-slate-600 max-w-xl'>
          Build investment policy statements, model financial goals with Monte Carlo,
          and apply proven allocation templates — all in one place.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        {MODULES.map(({ href, icon: Icon, label, tagline, description, cta, accent }) => (
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
              {cta} <ChevronRight size={13} className='group-hover:translate-x-0.5 transition-transform' />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick-start guide */}
      <div className='bg-slate-50 border border-slate-200 rounded-lg p-6'>
        <h2 className='text-sm font-semibold text-[#0B1B2E] mb-4'>Recommended workflow</h2>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-slate-600'>
          {[
            { n: '1', text: 'Pick a strategy template that matches the household risk profile' },
            { n: '2', text: 'Load it into the IPS builder and adjust drift bands' },
            { n: '3', text: 'Add financial goals and run Monte Carlo to validate the plan' },
          ].map((step, i) => (
            <div key={step.n} className='flex items-start sm:items-center gap-2 flex-1'>
              <span className='w-6 h-6 rounded-full bg-[#2563EB]/10 flex items-center justify-center
                text-[11px] font-bold text-[#2563EB] shrink-0'>
                {step.n}
              </span>
              <span className='text-xs text-slate-600'>{step.text}</span>
              {i < 2 && (
                <ArrowRight size={14} className='text-slate-300 shrink-0 hidden sm:block' />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
