import Link from 'next/link'
import { ArrowRight, CheckCircle2, User, Clock, Zap, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/neon-button'

export const metadata = { title: 'Vantage for Solo Advisors' }

const BEFORE_AFTER = [
  { before: '3–4 hours to prepare a risk analysis for a client meeting', after: '60 seconds with Vantage' },
  { before: 'Manual spreadsheet models prone to formula errors', after: 'Validated institutional models, zero setup' },
  { before: 'Generic charts that don\'t tell a story', after: 'Branded PDF with AI memo and client letter' },
  { before: 'Scrambling when a client calls during a market drop', after: 'Pull up the analysis in seconds, stay calm' },
]

const FEATURES = [
  {
    icon: User,
    title: 'One Advisor, Full Capability',
    desc: 'You shouldn\'t need a research team to produce institutional-quality analysis. Vantage is designed for one person to run like a team of ten.',
  },
  {
    icon: Clock,
    title: 'Time Is Your Scarcest Resource',
    desc: 'Every hour spent on analysis is an hour not spent on relationships. Vantage gives you the analysis in 60 seconds so you can spend the rest on what matters.',
  },
  {
    icon: Zap,
    title: 'No Technical Setup',
    desc: 'Upload an Excel file, pick a scenario, get results. No API keys, no model calibration, no data science degree required.',
  },
  {
    icon: FileCheck,
    title: 'Compliance Out of the Box',
    desc: 'Every output carries a disclaimer and an "AI-assisted — verify before delivery" badge. Built to satisfy your compliance checklist from day one.',
  },
]

const BENEFITS = [
  'Run full analysis for every client before every meeting, not just the big ones',
  'Look like a larger firm without the overhead of a larger firm',
  'Respond to market events in minutes, not days',
  'Focus your limited time on advice and relationships, not formatting reports',
]

export default function SoloPage() {
  return (
    <>
      <section className='relative pt-32 pb-16 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none' />
        <div className='relative max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6'>
            Solutions · Solo Advisors
          </div>
          <h1 className='text-5xl font-bold tracking-tight mb-5 leading-tight'>
            You wear every hat.<br />Vantage does the analysis.
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed'>
            Solo advisors don't have a research team. Vantage gives you the analytical
            firepower of one in 60 seconds — so you can spend your time on clients, not spreadsheets.
          </p>
          <div className='flex items-center justify-center gap-4 flex-wrap'>
            <Link href='/auth/sign-up'><Button>Start Free Trial <ArrowRight size={15} className='ml-1' /></Button></Link>
            <Link href='/pricing' className='text-sm text-gray-400 hover:text-white transition-colors'>See pricing →</Link>
          </div>
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-4xl mx-auto'>
          <p className='text-xs font-semibold uppercase tracking-widest text-gray-500 text-center mb-10'>
            Before Vantage vs. after Vantage
          </p>
          <div className='space-y-3'>
            {BEFORE_AFTER.map(item => (
              <div key={item.before} className='grid grid-cols-2 gap-3'>
                <div className='bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3'>
                  <p className='text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1'>Before</p>
                  <p className='text-sm text-gray-400'>{item.before}</p>
                </div>
                <div className='bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-xl px-4 py-3'>
                  <p className='text-xs text-[#3B82F6] font-semibold uppercase tracking-wider mb-1'>After</p>
                  <p className='text-sm text-white'>{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-20 bg-white/[0.01]'>
        <div className='max-w-5xl mx-auto py-16'>
          <h2 className='text-3xl font-bold text-center mb-3'>Designed for one person</h2>
          <p className='text-gray-400 text-center mb-12 max-w-xl mx-auto'>
            Every feature is optimized for speed and simplicity — no onboarding required.
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
          <h2 className='text-3xl font-bold text-center mb-12'>What solo advisors gain</h2>
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
          <h2 className='text-3xl font-bold mb-4'>Try it on your next client</h2>
          <p className='text-gray-400 mb-8'>Upload their portfolio. Pick a scenario. Walk in prepared.</p>
          <Link href='/upload'><Button>Run a Stress Test <ArrowRight size={15} className='ml-1' /></Button></Link>
        </div>
      </section>
    </>
  )
}
