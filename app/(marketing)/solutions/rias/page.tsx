import Link from 'next/link'
import { ArrowRight, CheckCircle2, Trophy, DollarSign, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/neon-button'

export const metadata = { title: 'Vantage for Independent RIAs' }

const PAIN_POINTS = [
  { label: 'Riskalyze', cost: '$4,000–10,000/yr', note: 'Limited scenario depth, no AI memo' },
  { label: 'eMoney', cost: '$5,000–15,000/yr', note: 'Planning-focused, no stress testing' },
  { label: 'Vantage', cost: 'From $99/mo', note: 'Full institutional analysis in 60 seconds', highlight: true },
]

const FEATURES = [
  {
    icon: Trophy,
    title: 'Institutional Output at Mid-Market Price',
    desc: 'The same quality of stress testing used by $10B AUM firms — without the $10K/yr price tag. Compete on analysis quality, not just relationships.',
  },
  {
    icon: Clock,
    title: '60 Seconds per Analysis',
    desc: 'Run a complete 12-section risk report before your client finishes reading your intro email. Preparation time drops from hours to minutes.',
  },
  {
    icon: DollarSign,
    title: 'Defend Your Fee Every Meeting',
    desc: 'Walk in with a branded PDF. Show the Monte Carlo. Explain the factors. Give clients the experience that justifies your advisory fee every quarter.',
  },
  {
    icon: Users,
    title: 'Grow Without Adding Staff',
    desc: 'Run analysis for 50 clients in the time it used to take for 5. Vantage scales your intellectual bandwidth without scaling your headcount.',
  },
]

const BENEFITS = [
  'Win RFPs against larger firms by showing up with better analysis',
  'Retain clients during volatility by responding within minutes, not days',
  'Use existing client data — no new data feeds, no custodian integration required to start',
  'Get to value on day one: upload a portfolio, run a test, export the PDF',
]

export default function RiasPage() {
  return (
    <>
      <section className='relative pt-32 pb-16 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-[#3B82F6]/5 to-transparent pointer-events-none' />
        <div className='relative max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium mb-6'>
            Solutions · Independent RIAs
          </div>
          <h1 className='text-5xl font-bold tracking-tight mb-5 leading-tight'>
            Wirehouses have a<br />$100K research budget.<br />Now so do you.
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed'>
            Vantage gives independent RIAs the same institutional-grade stress testing
            that bulge-bracket firms use — at a price that makes sense for a boutique practice.
          </p>
          <div className='flex items-center justify-center gap-4 flex-wrap'>
            <Link href='/auth/sign-up'><Button>Start Free Trial <ArrowRight size={15} className='ml-1' /></Button></Link>
            <Link href='/pricing' className='text-sm text-gray-400 hover:text-white transition-colors'>See pricing →</Link>
          </div>
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/40'>
          <img
            src='https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80'
            alt='Independent financial advisor meeting with clients'
            className='w-full h-[420px] object-cover object-top'
          />
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-3xl mx-auto'>
          <p className='text-xs font-semibold uppercase tracking-widest text-gray-500 text-center mb-8'>
            What you were paying vs. what you pay now
          </p>
          <div className='space-y-3'>
            {PAIN_POINTS.map(p => (
              <div key={p.label} className={`flex items-center justify-between rounded-2xl px-5 py-4
                border ${p.highlight
                  ? 'bg-[#3B82F6]/5 border-[#3B82F6]/30'
                  : 'bg-white/[0.02] border-white/[0.06]'}`}>
                <div>
                  <p className={`font-semibold text-sm ${p.highlight ? 'text-[#3B82F6]' : 'text-white'}`}>{p.label}</p>
                  <p className='text-xs text-gray-500 mt-0.5'>{p.note}</p>
                </div>
                <p className={`font-mono font-bold text-sm ${p.highlight ? 'text-[#3B82F6]' : 'text-gray-400'}`}>{p.cost}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-20 bg-white/[0.01]'>
        <div className='max-w-5xl mx-auto py-16'>
          <h2 className='text-3xl font-bold text-center mb-3'>Built for your practice</h2>
          <p className='text-gray-400 text-center mb-12 max-w-xl mx-auto'>
            Every feature is designed around the realities of running an independent firm.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {FEATURES.map(f => (
              <div key={f.title} className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
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

      <section className='px-6 pb-20'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>What changes when you use Vantage</h2>
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

      <section className='px-6 pb-24'>
        <div className='max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/[0.08] rounded-3xl px-8 py-14'>
          <h2 className='text-3xl font-bold mb-4'>Start your free trial</h2>
          <p className='text-gray-400 mb-8'>No credit card required. Full access for 14 days.</p>
          <Link href='/auth/sign-up'><Button>Get Started Free <ArrowRight size={15} className='ml-1' /></Button></Link>
        </div>
      </section>
    </>
  )
}
