import Link from 'next/link'
import { ArrowRight, CheckCircle2, Heart, BarChart2, AlertCircle, Layers } from 'lucide-react'
import { Button } from '@/components/ui/neon-button'

export const metadata = { title: 'Portfolio Diagnostics — Vantage' }

const DIMENSIONS = [
  'Concentration risk (top 5 holdings)',
  'Factor exposure balance',
  'Liquidity under stress',
  'Drawdown vs. benchmark',
  'Inflation sensitivity',
  'Credit quality',
  'Correlation to client goals',
  'Tail risk (CVaR)',
]

const FEATURES = [
  {
    icon: Heart,
    title: 'Health Score 1–10',
    desc: 'A single number that captures portfolio resilience. Walk into every meeting knowing whether the portfolio is a 7 or a 4 — and why.',
  },
  {
    icon: AlertCircle,
    title: 'Top Risk Callouts',
    desc: 'Vantage surfaces the two or three biggest risk drivers automatically, so you know where to focus the conversation.',
  },
  {
    icon: Layers,
    title: 'Eight Dimensions',
    desc: 'Concentration, liquidity, factor balance, drawdown, inflation, credit, goal alignment, and tail risk — all in one view.',
  },
  {
    icon: BarChart2,
    title: 'Plain-English Summary',
    desc: 'Each diagnostic comes with a one-paragraph plain-English interpretation you can read directly to a client.',
  },
]

const BENEFITS = [
  'Give every client a single number that anchors the risk discussion before showing charts',
  'Identify problems proactively — not after the client calls in a panic',
  'Build a repeatable annual review process that clients expect and value',
  'Document portfolio health over time for compliance and accountability',
]

export default function DiagnosticsPage() {
  return (
    <>
      <section className='relative pt-32 pb-16 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none' />
        <div className='relative max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium mb-6'>
            Product · Portfolio Diagnostics
          </div>
          <h1 className='text-5xl font-bold tracking-tight mb-5 leading-tight'>
            One number.<br />Eight dimensions. Full picture.
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed'>
            The Smart Risk Summary gives every portfolio a health score from 1 to 10, evaluated
            across eight risk dimensions. One glance tells you where the vulnerabilities are.
          </p>
          <div className='flex items-center justify-center gap-4 flex-wrap'>
            <Link href='/auth/sign-up'><Button>Try It Free <ArrowRight size={15} className='ml-1' /></Button></Link>
            <Link href='/upload' className='text-sm text-gray-400 hover:text-white transition-colors'>Run a demo →</Link>
          </div>
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/40'>
          <img
            src='https://images.unsplash.com/photo-1526628953301-3cd6d4f37c95?auto=format&fit=crop&w=1200&q=80'
            alt='Portfolio analytics dashboard showing health metrics'
            className='w-full h-[420px] object-cover'
          />
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-4xl mx-auto'>
          <p className='text-xs font-semibold uppercase tracking-widest text-gray-500 text-center mb-10'>
            Eight dimensions — one health score
          </p>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            {DIMENSIONS.map((d, i) => (
              <div key={d} className='bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-center'>
                <p className='text-xs text-gray-400 leading-snug'>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-20 bg-white/[0.01]'>
        <div className='max-w-5xl mx-auto py-16'>
          <h2 className='text-3xl font-bold text-center mb-3'>What's inside the score</h2>
          <p className='text-gray-400 text-center mb-12 max-w-xl mx-auto'>
            Every dimension is weighted, scored, and explained — so you always know what's driving the number.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {FEATURES.map(f => (
              <div key={f.title} className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
                <div className='w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/15
                  flex items-center justify-center mb-4'>
                  <f.icon size={18} className='text-rose-400' />
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
          <h2 className='text-3xl font-bold text-center mb-12'>Why a single health score matters</h2>
          <div className='space-y-4'>
            {BENEFITS.map(b => (
              <div key={b} className='flex items-start gap-3'>
                <CheckCircle2 size={18} className='text-rose-400 shrink-0 mt-0.5' />
                <p className='text-gray-300 leading-relaxed'>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-24'>
        <div className='max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/[0.08] rounded-3xl px-8 py-14'>
          <h2 className='text-3xl font-bold mb-4'>Get your portfolio's health score</h2>
          <p className='text-gray-400 mb-8'>Upload any portfolio and see a full diagnostic in under 60 seconds.</p>
          <Link href='/upload'><Button>Run Diagnostics <ArrowRight size={15} className='ml-1' /></Button></Link>
        </div>
      </section>
    </>
  )
}
