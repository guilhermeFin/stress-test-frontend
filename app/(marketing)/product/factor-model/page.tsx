import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/neon-button'

export const metadata = { title: 'Factor Risk Model — Vantage' }

const FACTORS = [
  { name: 'Beta (Market)', color: 'bg-blue-500', desc: 'Exposure to broad equity market moves. Tells you how much of your risk is simply being long stocks.' },
  { name: 'Interest Rates', color: 'bg-amber-500', desc: 'Sensitivity to rate changes. Critical for bond-heavy and dividend portfolios.' },
  { name: 'Inflation', color: 'bg-orange-500', desc: 'Exposure to inflation surprises. Commodities and TIPS provide natural hedges; most equities don\'t.' },
  { name: 'Credit', color: 'bg-red-500', desc: 'Spread risk across corporate bonds, high-yield, and credit-sensitive equities.' },
  { name: 'Growth', color: 'bg-violet-500', desc: 'Tilt toward economically sensitive assets. High in tech and consumer discretionary; low in utilities.' },
]

const BENEFITS = [
  'Identify hidden concentration — two different funds may load identically on the same factor',
  'Explain portfolio risk in terms every client understands: "40% of your risk comes from interest rates"',
  'See how factor exposures shift under stress vs. normal market conditions',
  'Build the case for diversification with numbers, not opinions',
]

export default function FactorModelPage() {
  return (
    <>
      <section className='relative pt-32 pb-16 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none' />
        <div className='relative max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium mb-6'>
            Product · Factor Risk Model
          </div>
          <h1 className='text-5xl font-bold tracking-tight mb-5 leading-tight'>
            Not just how much risk.<br />Where it lives.
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed'>
            Vantage decomposes every portfolio into five risk factors, so you can show clients
            exactly which forces are driving their exposure — and what to do about it.
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
            src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
            alt='Financial analysis screens showing risk factor decomposition'
            className='w-full h-[420px] object-cover'
          />
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-4xl mx-auto'>
          <p className='text-xs font-semibold uppercase tracking-widest text-gray-500 text-center mb-10'>
            Five factors. Every portfolio.
          </p>
          <div className='space-y-4'>
            {FACTORS.map((f, i) => (
              <div key={f.name} className='flex items-start gap-5 bg-white/[0.03] border border-white/[0.08]
                rounded-2xl p-5 hover:bg-white/[0.05] transition-colors'>
                <div className='flex items-center gap-3 w-48 shrink-0'>
                  <div className={`w-2.5 h-2.5 rounded-full ${f.color} shrink-0`} />
                  <span className='text-sm font-semibold text-white'>{f.name}</span>
                </div>
                <p className='text-sm text-gray-400 leading-relaxed'>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-20 bg-white/[0.01]'>
        <div className='max-w-5xl mx-auto py-16'>
          <h2 className='text-3xl font-bold text-center mb-3'>Normal vs. stress correlations</h2>
          <p className='text-gray-400 text-center mb-10 max-w-2xl mx-auto leading-relaxed'>
            In calm markets, factors behave independently. In a crisis, correlations spike and
            diversification evaporates. Vantage shows you both regimes side by side — so you're
            never surprised by a portfolio that "diversified" its way into a bigger loss.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <div className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
              <p className='text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3'>Normal Markets</p>
              <p className='text-3xl font-bold text-[#3B82F6] mb-2'>0.18</p>
              <p className='text-sm text-gray-400'>Average cross-factor correlation — assets move independently, diversification works as expected.</p>
            </div>
            <div className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
              <p className='text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3'>Stress Markets</p>
              <p className='text-3xl font-bold text-red-400 mb-2'>0.74</p>
              <p className='text-sm text-gray-400'>Average cross-factor correlation in a crisis — most assets move together, and the "diversification" disappears.</p>
            </div>
          </div>
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>Why factor analysis changes the conversation</h2>
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
          <h2 className='text-3xl font-bold mb-4'>See your factor exposures</h2>
          <p className='text-gray-400 mb-8'>Upload any portfolio and get a full 5-factor breakdown in under 60 seconds.</p>
          <Link href='/upload'><Button>Run Factor Analysis <ArrowRight size={15} className='ml-1' /></Button></Link>
        </div>
      </section>
    </>
  )
}
