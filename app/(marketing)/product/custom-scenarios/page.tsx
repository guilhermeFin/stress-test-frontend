import Link from 'next/link'
import { ArrowRight, CheckCircle2, Brain, Sliders, Zap, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/neon-button'

export const metadata = { title: 'Custom Scenarios — Vantage' }

const EXAMPLES = [
  '"China invades Taiwan — Asian markets crash 35%, commodities surge 20%, tech supply chains break"',
  '"Fed cuts rates 200bps over 12 months while inflation stays at 5%"',
  '"Commercial real estate collapse: CMBS spreads +400bps, regional banks down 40%"',
  '"AI bubble bursts: tech down 60%, market down 30%, risk-off rotation into bonds"',
]

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Plain-English Input',
    desc: 'Type any scenario in natural language. Claude interprets your description and converts it into a structured set of factor shocks.',
  },
  {
    icon: Sliders,
    title: 'Manual Shock Sliders',
    desc: 'Prefer full control? Use the 6-axis shock builder to set equity, rate, credit, inflation, FX, and volatility shocks precisely.',
  },
  {
    icon: Brain,
    title: 'AI Interpretation',
    desc: 'Claude reads economic context, identifies which asset classes are affected, and calibrates the magnitude of each shock.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    desc: 'Same 12-section dashboard as historical scenarios — factor risk, Monte Carlo, benchmark comparison, AI memo — all in seconds.',
  },
]

const BENEFITS = [
  'Model scenarios your clients are actually worried about — not just textbook crises',
  'Stay ahead of emerging risks: geopolitical events, policy shifts, sector dislocations',
  'Show prospects a scenario tailored to their specific concerns during the first meeting',
  'Document your forward-looking risk process for compliance and due diligence',
]

export default function CustomScenariosPage() {
  return (
    <>
      <section className='relative pt-32 pb-16 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none' />
        <div className='relative max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6'>
            Product · Custom Scenarios
          </div>
          <h1 className='text-5xl font-bold tracking-tight mb-5 leading-tight'>
            Stress test any scenario<br />you can describe.
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed'>
            Type a scenario in plain English — or dial in exact shocks manually — and get a full
            institutional analysis in seconds. If you can imagine it, Vantage can model it.
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
            src='https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80'
            alt='Financial analyst working on custom scenario models'
            className='w-full h-[420px] object-cover'
          />
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-3xl mx-auto'>
          <p className='text-xs font-semibold uppercase tracking-widest text-gray-500 text-center mb-8'>
            Examples of what advisors type
          </p>
          <div className='space-y-3'>
            {EXAMPLES.map(ex => (
              <div key={ex} className='bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4
                text-sm text-gray-300 font-mono leading-relaxed italic'>
                {ex}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-20 bg-white/[0.01]'>
        <div className='max-w-5xl mx-auto py-16'>
          <h2 className='text-3xl font-bold text-center mb-3'>Two ways to build</h2>
          <p className='text-gray-400 text-center mb-12 max-w-xl mx-auto'>
            Type it or tune it — either way you get an institutional analysis in under 60 seconds.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {FEATURES.map(f => (
              <div key={f.title} className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
                <div className='w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/15
                  flex items-center justify-center mb-4'>
                  <f.icon size={18} className='text-violet-400' />
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
          <h2 className='text-3xl font-bold text-center mb-12'>Why custom scenarios matter</h2>
          <div className='space-y-4'>
            {BENEFITS.map(b => (
              <div key={b} className='flex items-start gap-3'>
                <CheckCircle2 size={18} className='text-violet-400 shrink-0 mt-0.5' />
                <p className='text-gray-300 leading-relaxed'>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-24'>
        <div className='max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/[0.08] rounded-3xl px-8 py-14'>
          <h2 className='text-3xl font-bold mb-4'>Build your first custom scenario</h2>
          <p className='text-gray-400 mb-8'>Upload a portfolio and describe any scenario in plain English.</p>
          <Link href='/upload'><Button>Try Custom Scenarios <ArrowRight size={15} className='ml-1' /></Button></Link>
        </div>
      </section>
    </>
  )
}
