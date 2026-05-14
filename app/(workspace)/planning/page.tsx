import Link from 'next/link'
import { FileText, Target, LayoutTemplate, ChevronRight, ArrowRight } from 'lucide-react'

const MODULES = [
  {
    href:        '/planning/goals',
    icon:        Target,
    label:       'Goal Planning',
    tagline:     'Monte Carlo projections',
    description: 'Model retirement, college, home, and legacy goals. Run 1,000-path Monte Carlo simulations to show funded ratio and ruin probability.',
    cta:         'Plan goals',
    iconBg:      'bg-blue-50',
    iconColor:   'text-[#2563EB]',
  },
  {
    href:        '/planning/ips',
    icon:        FileText,
    label:       'IPS Builder',
    tagline:     'Investment Policy Statement',
    description: 'Define target allocations, drift bands, and rebalance rules per household. Version-controlled so you always have an audit trail.',
    cta:         'Open IPS builder',
    iconBg:      'bg-emerald-50',
    iconColor:   'text-emerald-700',
  },
  {
    href:        '/planning/strategies',
    icon:        LayoutTemplate,
    label:       'Strategy Templates',
    tagline:     'Pre-built & custom',
    description: 'Choose from five evidence-based allocation templates — Conservative Income, Balanced Growth, Aggressive Growth, All-Weather, Factor Tilt — then fork and customize.',
    cta:         'Browse templates',
    iconBg:      'bg-violet-50',
    iconColor:   'text-violet-700',
  },
]

export default function PlanningHubPage() {
  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>

      {/* Page header */}
      <div className='border-b border-slate-200 pb-6 mb-8'>
        <p className='text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-2'>WORKSPACE</p>
        <h1 className='text-3xl font-bold text-[#0B1B2E] tracking-tight mb-1'>Planning</h1>
        <p className='text-base text-slate-600 max-w-xl'>
          Build investment policy statements, model financial goals with Monte Carlo,
          and apply proven allocation templates — all in one place.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-8'>
        {MODULES.map(({ href, icon: Icon, label, tagline, description, cta, iconBg, iconColor }) => (
          <Link key={href} href={href}
            className='group flex flex-col bg-white border border-slate-200
              hover:border-slate-300 hover:shadow-md rounded-xl p-6 shadow-sm transition-all'>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${iconBg}`}>
              <Icon size={18} className={iconColor} />
            </div>
            <p className='text-lg font-bold text-[#0B1B2E] mb-0.5'>{label}</p>
            <p className='text-xs text-slate-500 mb-3'>{tagline}</p>
            <p className='text-sm text-slate-600 leading-relaxed flex-1 mb-5'>{description}</p>
            <div className='flex items-center justify-end'>
              <span className='flex items-center gap-1 text-sm font-semibold text-[#2563EB] group-hover:text-[#1D4ED8]'>
                {cta} <ChevronRight size={14} className='group-hover:translate-x-0.5 transition-transform' />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick-start guide */}
      <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm'>
        <h2 className='text-base font-bold text-[#0B1B2E] mb-4'>Recommended workflow</h2>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
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
              <span className='text-sm text-slate-600'>{step.text}</span>
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
