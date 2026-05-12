import Link from 'next/link'
import { ArrowRight, CheckCircle2, Phone, Clock, FileText, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/neon-button'

export const metadata = { title: 'Client Panic Mode — Vantage' }

const SCENARIO = [
  { step: '1', title: 'Client calls in a panic', desc: 'The S&P is down 8% and your client wants to sell everything. You have 10 minutes to respond.' },
  { step: '2', title: 'Pull up their portfolio', desc: 'Open Vantage. Their saved portfolio is already there — no re-uploading, no searching for the spreadsheet.' },
  { step: '3', title: 'Run the scenario', desc: 'Click "2008 GFC" or describe today\'s exact scenario. Results in 60 seconds.' },
  { step: '4', title: 'Walk them through it', desc: 'Screen-share the analysis. Show the Monte Carlo. Read the AI talking points. The conversation shifts from fear to data.' },
]

const FEATURES = [
  {
    icon: Clock,
    title: 'Under 60 Seconds',
    desc: 'By the time your client finishes explaining what they saw on the news, you have a full analysis on your screen.',
  },
  {
    icon: Phone,
    title: 'Built for the Phone Call',
    desc: 'Every output includes plain-English talking points written by Claude. Read them directly — no prep needed.',
  },
  {
    icon: FileText,
    title: 'The AI Talking Points',
    desc: 'Vantage generates an advisor script: what to say, what to emphasize, what not to say. Tailored to the scenario and the portfolio.',
  },
  {
    icon: ShieldCheck,
    title: 'Data Beats Platitudes',
    desc: '"Your portfolio dropped X% in 2008 and recovered in Y months" is far more reassuring than "markets always recover." Now you have the number.',
  },
]

const BENEFITS = [
  'Respond to client panic in under 10 minutes — with data, not reassurances',
  'Reduce the chance a client makes an emotional, wealth-destroying decision in a downturn',
  'Build loyalty: clients who see you respond quickly and confidently during volatility don\'t leave',
  'Turn every market event into a demonstration of your value as their advisor',
]

export default function PanicModePage() {
  return (
    <>
      <section className='relative pt-32 pb-16 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none' />
        <div className='relative max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-6'>
            Solutions · Client Panic Mode
          </div>
          <h1 className='text-5xl font-bold tracking-tight mb-5 leading-tight'>
            Market drops 10%.<br />You have 10 minutes.<br />Here's what you do.
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed'>
            When clients panic, the advisor who responds fastest with the clearest data wins the relationship.
            Vantage puts that analysis in your hands in under 60 seconds.
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
            src='https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80'
            alt='Advisor calmly responding to a client during market volatility'
            className='w-full h-[420px] object-cover'
          />
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-3xl mx-auto'>
          <p className='text-xs font-semibold uppercase tracking-widest text-gray-500 text-center mb-10'>
            The panic response playbook
          </p>
          <div className='space-y-4'>
            {SCENARIO.map(s => (
              <div key={s.step} className='flex items-start gap-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5'>
                <div className='w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20
                  flex items-center justify-center shrink-0 text-orange-400 font-bold text-sm'>
                  {s.step}
                </div>
                <div>
                  <p className='font-semibold text-white mb-1'>{s.title}</p>
                  <p className='text-sm text-gray-400 leading-relaxed'>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-20 bg-white/[0.01]'>
        <div className='max-w-5xl mx-auto py-16'>
          <h2 className='text-3xl font-bold text-center mb-3'>Why it works</h2>
          <p className='text-gray-400 text-center mb-12 max-w-xl mx-auto'>
            Speed and clarity are the only things that matter when a client is afraid.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {FEATURES.map(f => (
              <div key={f.title} className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
                <div className='w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/15
                  flex items-center justify-center mb-4'>
                  <f.icon size={18} className='text-orange-400' />
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
          <h2 className='text-3xl font-bold text-center mb-12'>What advisors say changes</h2>
          <div className='space-y-4'>
            {BENEFITS.map(b => (
              <div key={b} className='flex items-start gap-3'>
                <CheckCircle2 size={18} className='text-orange-400 shrink-0 mt-0.5' />
                <p className='text-gray-300 leading-relaxed'>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-24'>
        <div className='max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/[0.08] rounded-3xl px-8 py-14'>
          <h2 className='text-3xl font-bold mb-4'>Be ready before the next call</h2>
          <p className='text-gray-400 mb-8'>Upload your clients' portfolios now so you can pull up an analysis the moment they call.</p>
          <Link href='/auth/sign-up'><Button>Get Started Free <ArrowRight size={15} className='ml-1' /></Button></Link>
        </div>
      </section>
    </>
  )
}
