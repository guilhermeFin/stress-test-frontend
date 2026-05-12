import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock, TrendingDown, BarChart2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/neon-button'

export const metadata = { title: 'Historical Scenarios — Vantage' }

const SCENARIOS = [
  { year: '2008', name: '2008 Global Financial Crisis', drop: '−57%', detail: 'Credit markets freeze, financials collapse 80%, real estate −65%, credit spreads +300bps.' },
  { year: '2020', name: 'COVID-19 Crash', drop: '−34%', detail: 'Market falls 34% in 5 weeks, energy −55%, rates cut to zero, gold +15%.' },
  { year: '2000', name: 'Dot-Com Bust', drop: '−49%', detail: 'Tech crashes 78%, comms −65%, equities fall over 2 years, rates ease 2.5%.' },
  { year: '1987', name: 'Black Monday', drop: '−22%', detail: 'Market drops 22% in a single session, vol spikes 300%, portfolio insurance fails.' },
  { year: '2022', name: '2022 Rate Shock', drop: '−19%', detail: 'Fastest Fed hiking cycle in 40 years, bonds −17%, growth stocks −40%.' },
  { year: '70s', name: 'Stagflation', drop: '−48%', detail: 'Inflation at 13%, energy crisis, commodities surge, real returns devastated.' },
]

const FEATURES = [
  {
    icon: Clock,
    title: '60-Second Results',
    desc: 'Apply any historical scenario to your portfolio instantly. No manual data entry, no spreadsheets, no waiting.',
  },
  {
    icon: TrendingDown,
    title: 'Exact Historical Shocks',
    desc: 'Each scenario uses precise factor shocks calibrated from real market data — not rough approximations.',
  },
  {
    icon: BarChart2,
    title: 'Side-by-Side Comparison',
    desc: 'Run multiple crises on the same portfolio and compare outcomes across the 12-section dashboard.',
  },
  {
    icon: Shield,
    title: 'Client-Ready Output',
    desc: 'Every result comes with plain-English interpretation and a talking-points memo you can use in the meeting.',
  },
]

const BENEFITS = [
  'Show clients exactly what their portfolio would have done in the worst crises of the last 40 years',
  'Replace vague reassurances with hard numbers — no more "it\'s only temporary"',
  'Identify concentration risks before they become client calls',
  'Build a paper trail for compliance and annual reviews',
]

export default function ScenariosPage() {
  return (
    <>
      {/* Hero */}
      <section className='relative pt-32 pb-16 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-[#3B82F6]/5 to-transparent pointer-events-none' />
        <div className='relative max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium mb-6'>
            Product · Historical Scenarios
          </div>
          <h1 className='text-5xl font-bold tracking-tight mb-5 leading-tight'>
            Six crises.<br />One upload. Instant answers.
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed'>
            Apply the exact market shocks from history's worst crises to your portfolio
            in under 60 seconds. Give clients hard numbers, not soft reassurances.
          </p>
          <div className='flex items-center justify-center gap-4 flex-wrap'>
            <Link href='/auth/sign-up'>
              <Button>Try It Free <ArrowRight size={15} className='ml-1' /></Button>
            </Link>
            <Link href='/upload' className='text-sm text-gray-400 hover:text-white transition-colors'>
              Run a demo →
            </Link>
          </div>
        </div>
      </section>

      {/* Hero image */}
      <section className='px-6 pb-20'>
        <div className='max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/40'>
          <img
            src='https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80'
            alt='Stock market chart showing historical market movements'
            className='w-full h-[420px] object-cover'
          />
        </div>
      </section>

      {/* Scenario cards */}
      <section className='px-6 pb-20'>
        <div className='max-w-5xl mx-auto'>
          <p className='text-xs font-semibold uppercase tracking-widest text-gray-500 text-center mb-10'>
            Six pre-built scenarios — calibrated from real market data
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {SCENARIOS.map(s => (
              <div key={s.year}
                className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5
                  hover:border-white/[0.14] hover:bg-white/[0.05] transition-all'>
                <div className='flex items-start justify-between mb-3'>
                  <span className='text-xs font-mono text-gray-500'>{s.year}</span>
                  <span className='text-red-400 font-bold text-sm font-mono'>{s.drop}</span>
                </div>
                <p className='text-sm font-semibold text-white mb-2'>{s.name}</p>
                <p className='text-xs text-gray-500 leading-relaxed'>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='px-6 pb-20 bg-white/[0.01]'>
        <div className='max-w-5xl mx-auto py-16'>
          <h2 className='text-3xl font-bold text-center mb-3'>Built for the client meeting</h2>
          <p className='text-gray-400 text-center mb-12 max-w-xl mx-auto'>
            Every feature is designed around the moment a client asks "what if the market crashes?"
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {FEATURES.map(f => (
              <div key={f.title}
                className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
                <div className='w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/15
                  flex items-center justify-center mb-4'>
                  <f.icon size={18} className='text-[#3B82F6]' />
                </div>
                <h3 className='text-base font-semibold mb-2'>{f.title}</h3>
                <p className='text-sm text-gray-400 leading-relaxed'>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className='px-6 pb-20'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>Why it matters</h2>
          <div className='space-y-4'>
            {BENEFITS.map(b => (
              <div key={b} className='flex items-start gap-3'>
                <CheckCircle2 size={18} className='text-[#3B82F6] shrink-0 mt-0.5' />
                <p className='text-gray-300 leading-relaxed'>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='px-6 pb-24'>
        <div className='max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/[0.08]
          rounded-3xl px-8 py-14'>
          <h2 className='text-3xl font-bold mb-4'>See it on your portfolio</h2>
          <p className='text-gray-400 mb-8'>
            Upload any portfolio and run all six historical scenarios in under 60 seconds.
          </p>
          <Link href='/upload'>
            <Button>Run a Stress Test <ArrowRight size={15} className='ml-1' /></Button>
          </Link>
        </div>
      </section>
    </>
  )
}
