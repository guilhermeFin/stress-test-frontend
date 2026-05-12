import Link from 'next/link'
import { ArrowRight, CheckCircle2, Target, Zap, TrendingUp, Award } from 'lucide-react'
import { Button } from '@/components/ui/neon-button'

export const metadata = { title: 'Prospect Conversion — Vantage' }

const STEPS = [
  { step: '1', title: 'Ask for their current portfolio', desc: 'Before the meeting, ask the prospect to bring a statement or a list of holdings. Most will.' },
  { step: '2', title: 'Upload it live', desc: 'Type the tickers and weights directly into Vantage\'s intelligence tool — no Excel upload required.' },
  { step: '3', title: 'Run their scenario', desc: 'Ask what they\'re worried about. Run that exact scenario. Watch the numbers appear in 60 seconds.' },
  { step: '4', title: 'Show the gap', desc: 'Their current portfolio\'s health score is a 4. With your recommended allocation it\'s an 8. That\'s the pitch.' },
]

const FEATURES = [
  {
    icon: Zap,
    title: 'Live Demo in the Meeting',
    desc: 'Type tickers directly — no upload needed. Show the prospect a real analysis of their actual portfolio in the first 10 minutes.',
  },
  {
    icon: Target,
    title: 'Show vs. Tell',
    desc: 'Every competitor tells prospects they\'re better. You show them with data. The risk gap between their current advisor and you is visible on the screen.',
  },
  {
    icon: TrendingUp,
    title: 'Proposed vs. Current',
    desc: 'Run the stress test on their current portfolio, then on your proposed allocation. The comparison tells the story for you.',
  },
  {
    icon: Award,
    title: 'Branded Leave-Behind',
    desc: 'Export a PDF with your firm\'s logo before they leave. They go home with your analysis, not a competitor\'s deck.',
  },
]

const BENEFITS = [
  'Convert skeptical prospects by demonstrating value in the first meeting, not promising it',
  'Differentiate on substance: your analysis vs. their current advisor\'s gut feel',
  'Create urgency without pressure — the risk gap speaks for itself',
  'Leave prospects with a branded artifact that keeps your firm top of mind',
]

const OBJECTIONS = [
  { obj: '"My current advisor is fine."', resp: 'Show them what "fine" looks like in a 2008-style scenario. Let the numbers answer.' },
  { obj: '"I\'m not sure I need to change anything."', resp: 'Run their portfolio. A health score of 4/10 starts the conversation.' },
  { obj: '"I need to think about it."', resp: 'Send the branded PDF. They\'ll come back to it — and to you.' },
]

export default function ProspectsPage() {
  return (
    <>
      <section className='relative pt-32 pb-16 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none' />
        <div className='relative max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-6'>
            Solutions · Prospect Conversion
          </div>
          <h1 className='text-5xl font-bold tracking-tight mb-5 leading-tight'>
            Don't pitch.<br />Demonstrate.
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed'>
            The fastest way to win a new client is to run their portfolio through a stress test
            live in the meeting. Vantage makes it possible in 60 seconds — with their actual holdings.
          </p>
          <div className='flex items-center justify-center gap-4 flex-wrap'>
            <Link href='/auth/sign-up'><Button>Start Free Trial <ArrowRight size={15} className='ml-1' /></Button></Link>
            <Link href='/upload' className='text-sm text-gray-400 hover:text-white transition-colors'>Run a demo →</Link>
          </div>
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-3xl mx-auto'>
          <p className='text-xs font-semibold uppercase tracking-widest text-gray-500 text-center mb-10'>
            The prospect meeting playbook
          </p>
          <div className='space-y-4'>
            {STEPS.map(s => (
              <div key={s.step} className='flex items-start gap-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5'>
                <div className='w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20
                  flex items-center justify-center shrink-0 text-teal-400 font-bold text-sm'>
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
          <h2 className='text-3xl font-bold text-center mb-3'>Why it converts</h2>
          <p className='text-gray-400 text-center mb-12 max-w-xl mx-auto'>
            Prospects have heard every pitch. They haven't seen their own portfolio stress-tested live.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {FEATURES.map(f => (
              <div key={f.title} className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
                <div className='w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/15
                  flex items-center justify-center mb-4'>
                  <f.icon size={18} className='text-teal-400' />
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
          <h2 className='text-3xl font-bold text-center mb-10'>Handling objections with data</h2>
          <div className='space-y-4'>
            {OBJECTIONS.map(o => (
              <div key={o.obj} className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5'>
                <p className='text-sm font-semibold text-white mb-2 italic'>{o.obj}</p>
                <p className='text-sm text-gray-400 leading-relaxed'>{o.resp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>What changes at your next prospect meeting</h2>
          <div className='space-y-4'>
            {BENEFITS.map(b => (
              <div key={b} className='flex items-start gap-3'>
                <CheckCircle2 size={18} className='text-teal-400 shrink-0 mt-0.5' />
                <p className='text-gray-300 leading-relaxed'>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-24'>
        <div className='max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/[0.08] rounded-3xl px-8 py-14'>
          <h2 className='text-3xl font-bold mb-4'>Win your next prospect meeting</h2>
          <p className='text-gray-400 mb-8'>Try the live portfolio analysis tool — no Excel required.</p>
          <Link href='/intelligence'><Button>Try Live Analysis <ArrowRight size={15} className='ml-1' /></Button></Link>
        </div>
      </section>
    </>
  )
}
