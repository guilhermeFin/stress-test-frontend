import Link from 'next/link'
import { ArrowRight, CheckCircle2, Building2, BarChart2, Layers, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/neon-button'

export const metadata = { title: 'Vantage for Multi-Family Offices' }

const FEATURES = [
  {
    icon: Layers,
    title: 'Parallel Portfolio Analysis',
    desc: 'Run stress tests across multiple family portfolios simultaneously. Compare results side-by-side to spot shared risk and family-level concentration.',
  },
  {
    icon: BarChart2,
    title: 'Consolidated Risk View',
    desc: 'Aggregate exposures across all family entities — revocable trusts, LLCs, IRAs, taxable accounts — to see the true family-level factor loadings.',
  },
  {
    icon: Building2,
    title: 'White-Label Branding',
    desc: 'Every PDF carries your firm\'s logo and custom disclaimer. Clients see your practice\'s name — not a third-party tool — on every deliverable.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance & Documentation',
    desc: 'Every analysis is timestamped, branded, and saved to run history. Build an audit trail for every family relationship automatically.',
  },
]

const BENEFITS = [
  'Produce analysis across 10 family portfolios in the time it used to take for one',
  'Identify when two families carry the same concentrated risk and address it proactively',
  'Meet the documentation expectations of complex, multi-generational family relationships',
  'Scale your analytical capacity without scaling your team',
]

export default function MfoPage() {
  return (
    <>
      <section className='relative pt-32 pb-16 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none' />
        <div className='relative max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium mb-6'>
            Solutions · Multi-Family Offices
          </div>
          <h1 className='text-5xl font-bold tracking-tight mb-5 leading-tight'>
            Complex families.<br />Unified risk view.
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed'>
            Multi-family offices manage layered, multi-entity wealth structures. Vantage lets you
            see risk across every family relationship — consolidated, stress-tested, and ready to present.
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
            src='https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80'
            alt='Multi-family office team in a strategic planning meeting'
            className='w-full h-[420px] object-cover'
          />
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center'>
          {[
            { value: '12', label: 'sections per analysis' },
            { value: '60s', label: 'per portfolio' },
            { value: '∞', label: 'portfolios per firm' },
          ].map(s => (
            <div key={s.label} className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
              <p className='text-4xl font-bold text-white mb-2'>{s.value}</p>
              <p className='text-sm text-gray-500'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='px-6 pb-20 bg-white/[0.01]'>
        <div className='max-w-5xl mx-auto py-16'>
          <h2 className='text-3xl font-bold text-center mb-3'>Built for complexity</h2>
          <p className='text-gray-400 text-center mb-12 max-w-xl mx-auto'>
            Every feature scales to the demands of a multi-family office relationship.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {FEATURES.map(f => (
              <div key={f.title} className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
                <div className='w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/15
                  flex items-center justify-center mb-4'>
                  <f.icon size={18} className='text-sky-400' />
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
          <h2 className='text-3xl font-bold text-center mb-12'>What MFOs gain</h2>
          <div className='space-y-4'>
            {BENEFITS.map(b => (
              <div key={b} className='flex items-start gap-3'>
                <CheckCircle2 size={18} className='text-sky-400 shrink-0 mt-0.5' />
                <p className='text-gray-300 leading-relaxed'>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-24'>
        <div className='max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/[0.08] rounded-3xl px-8 py-14'>
          <h2 className='text-3xl font-bold mb-4'>Talk to our team</h2>
          <p className='text-gray-400 mb-8'>Enterprise plans for multi-family offices include white-label branding, unlimited portfolios, and priority support.</p>
          <Link href='/auth/sign-up'><Button>Get Started <ArrowRight size={15} className='ml-1' /></Button></Link>
        </div>
      </section>
    </>
  )
}
