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

      <div className='mb-10'>
        <h1 className='text-2xl font-bold tracking-tight mb-2'>Planning</h1>
        <p className='text-sm text-gray-500 max-w-xl'>
          Build investment policy statements, model financial goals with Monte Carlo,
          and apply proven allocation templates — all in one place.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-12'>
        {MODULES.map(({ href, icon: Icon, label, tagline, description, cta, accent }) => (
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
              {cta} <ChevronRight size={13} className='group-hover:translate-x-0.5 transition-transform' />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick-start guide */}
      <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6'>
        <h2 className='text-sm font-semibold mb-4'>Recommended workflow</h2>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-gray-400'>
          {[
            { n: '1', text: 'Pick a strategy template that matches the household risk profile' },
            { n: '2', text: 'Load it into the IPS builder and adjust drift bands' },
            { n: '3', text: 'Add financial goals and run Monte Carlo to validate the plan' },
          ].map((step, i) => (
            <div key={step.n} className='flex items-start sm:items-center gap-2 flex-1'>
              <span className='w-6 h-6 rounded-full bg-white/5 flex items-center justify-center
                text-[11px] font-bold text-gray-500 shrink-0'>
                {step.n}
              </span>
              <span className='text-xs'>{step.text}</span>
              {i < 2 && (
                <ArrowRight size={14} className='text-gray-700 shrink-0 hidden sm:block' />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
