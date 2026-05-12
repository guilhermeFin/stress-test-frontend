import Link from 'next/link'
import { ArrowRight, CheckCircle2, Activity, Target, TrendingUp, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/neon-button'

export const metadata = { title: 'Monte Carlo Simulation — Vantage' }

const STATS = [
  { value: '1,000', label: 'simulated paths per run' },
  { value: '<60s', label: 'full results in under a minute' },
  { value: '5', label: 'percentile bands displayed' },
]

const FEATURES = [
  {
    icon: Activity,
    title: '1,000 Simulated Paths',
    desc: 'Each run generates a thousand independent return paths, giving you a statistically robust picture of what the future could hold.',
  },
  {
    icon: Target,
    title: 'Goal-Based Framing',
    desc: 'Results are expressed as a retirement success probability — a number every client immediately understands.',
  },
  {
    icon: AlertTriangle,
    title: 'Ruin Probability',
    desc: 'See the percentage of paths where the portfolio runs out before the end of the plan horizon, stress-tested against your chosen scenario.',
  },
  {
    icon: TrendingUp,
    title: 'Confidence Bands',
    desc: 'The chart shows 10th, 25th, 50th, 75th, and 90th percentile wealth paths so clients see the full range — not just the median.',
  },
]

const BENEFITS = [
  'Replace single-point projections with honest probability ranges that set realistic expectations',
  'Show clients the retirement impact of a market crash before it happens, not after',
  'Quantify how much a scenario shifts the plan — from 85% success to 63% is a conversation, not a crisis',
  'Demonstrate why staying invested through volatility is mathematically sound',
]

export default function MonteCarloPage() {
  return (
    <>
      <section className='relative pt-32 pb-16 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none' />
        <div className='relative max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6'>
            Product · Monte Carlo Simulation
          </div>
          <h1 className='text-5xl font-bold tracking-tight mb-5 leading-tight'>
            1,000 futures.<br />One clear conversation.
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed'>
            A single-point projection tells clients nothing about risk. Monte Carlo shows them
            the full range — from best case to ruin — so they understand what they're really dealing with.
          </p>
          <div className='flex items-center justify-center gap-4 flex-wrap'>
            <Link href='/auth/sign-up'><Button>Try It Free <ArrowRight size={15} className='ml-1' /></Button></Link>
            <Link href='/upload' className='text-sm text-gray-400 hover:text-white transition-colors'>Run a demo →</Link>
          </div>
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center'>
          {STATS.map(s => (
            <div key={s.label} className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
              <p className='text-4xl font-bold text-white mb-2'>{s.value}</p>
              <p className='text-sm text-gray-500'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='px-6 pb-20 bg-white/[0.01]'>
        <div className='max-w-5xl mx-auto py-16'>
          <h2 className='text-3xl font-bold text-center mb-3'>What the simulation shows</h2>
          <p className='text-gray-400 text-center mb-12 max-w-xl mx-auto'>
            Every run is stress-tested against your chosen scenario, so you see probability
            under adversity — not just in calm markets.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {FEATURES.map(f => (
              <div key={f.title} className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
                <div className='w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15
                  flex items-center justify-center mb-4'>
                  <f.icon size={18} className='text-emerald-400' />
                </div>
                <h3 className='text-base font-semibold mb-2'>{f.title}</h3>
                <p className='text-sm text-gray-400 leading-relaxed'>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>Why probabilistic thinking changes the conversation</h2>
          <div className='space-y-4'>
            {BENEFITS.map(b => (
              <div key={b} className='flex items-start gap-3'>
                <CheckCircle2 size={18} className='text-emerald-400 shrink-0 mt-0.5' />
                <p className='text-gray-300 leading-relaxed'>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-24'>
        <div className='max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/[0.08] rounded-3xl px-8 py-14'>
          <h2 className='text-3xl font-bold mb-4'>Run your first Monte Carlo</h2>
          <p className='text-gray-400 mb-8'>Upload a portfolio, pick a scenario, and see 1,000 futures in under 60 seconds.</p>
          <Link href='/upload'><Button>Run the Simulation <ArrowRight size={15} className='ml-1' /></Button></Link>
        </div>
      </section>
    </>
  )
}
