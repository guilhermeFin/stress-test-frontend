import Link from 'next/link'
import { ArrowRight, CheckCircle2, Calendar, FileText, BarChart2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/neon-button'

export const metadata = { title: 'Quarterly Reviews — Vantage' }

const AGENDA = [
  { time: '0–5 min', item: 'Health score overview — one number, immediate context' },
  { time: '5–15 min', item: 'Factor risk breakdown — where does risk live?' },
  { time: '15–25 min', item: 'Scenario walkthrough — how did we hold up vs. the quarter\'s story?' },
  { time: '25–40 min', item: 'Monte Carlo update — are we still on track for retirement?' },
  { time: '40–55 min', item: 'Action items — rebalancing, tax, contributions' },
  { time: '55–60 min', item: 'Client questions + leave behind branded PDF' },
]

const FEATURES = [
  {
    icon: Clock,
    title: 'Prep in Under 10 Minutes',
    desc: 'Run the stress test, export the PDF, glance at the AI memo. Your QBR is prepared faster than it takes to find parking.',
  },
  {
    icon: Calendar,
    title: 'Consistent Agenda Every Quarter',
    desc: 'The 12-section dashboard gives every review the same structure, so clients know what to expect and trust the process.',
  },
  {
    icon: BarChart2,
    title: 'Scenario-Driven Narrative',
    desc: 'Pick the scenario that defined the quarter — rate shock, equity sell-off, credit event — and show how the portfolio performed against it.',
  },
  {
    icon: FileText,
    title: 'Leave-Behind That Clients Read',
    desc: 'The branded PDF is a 3-page document clients can actually read, file, and refer back to. Not a 40-slide deck they never open.',
  },
]

const BENEFITS = [
  'Cut QBR prep from 3 hours to under 15 minutes without losing quality',
  'Run a consistent, repeatable process that builds client trust over time',
  'Give every client the same institutional experience, regardless of AUM',
  'Document every review for compliance and relationship continuity',
]

export default function QbrPage() {
  return (
    <>
      <section className='relative pt-32 pb-16 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none' />
        <div className='relative max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6'>
            Solutions · Quarterly Reviews
          </div>
          <h1 className='text-5xl font-bold tracking-tight mb-5 leading-tight'>
            The best 60-minute review<br />you've ever run.
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed'>
            Vantage turns quarterly reviews from a stressful preparation exercise into a
            confident, data-driven client conversation — prepared in minutes, remembered for quarters.
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
            A 60-minute agenda that runs itself
          </p>
          <div className='space-y-3'>
            {AGENDA.map(a => (
              <div key={a.time} className='flex items-center gap-4 bg-white/[0.03] border border-white/[0.08]
                rounded-xl px-4 py-3'>
                <span className='text-xs font-mono text-indigo-400 shrink-0 w-20'>{a.time}</span>
                <p className='text-sm text-gray-300'>{a.item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-20 bg-white/[0.01]'>
        <div className='max-w-5xl mx-auto py-16'>
          <h2 className='text-3xl font-bold text-center mb-3'>What makes it work</h2>
          <p className='text-gray-400 text-center mb-12 max-w-xl mx-auto'>
            The QBR structure is built into every Vantage output — you just need to show up prepared.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {FEATURES.map(f => (
              <div key={f.title} className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
                <div className='w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15
                  flex items-center justify-center mb-4'>
                  <f.icon size={18} className='text-indigo-400' />
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
          <h2 className='text-3xl font-bold text-center mb-12'>How quarterly reviews improve</h2>
          <div className='space-y-4'>
            {BENEFITS.map(b => (
              <div key={b} className='flex items-start gap-3'>
                <CheckCircle2 size={18} className='text-indigo-400 shrink-0 mt-0.5' />
                <p className='text-gray-300 leading-relaxed'>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-24'>
        <div className='max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/[0.08] rounded-3xl px-8 py-14'>
          <h2 className='text-3xl font-bold mb-4'>Prep your next QBR now</h2>
          <p className='text-gray-400 mb-8'>Upload a portfolio and have a complete review package ready in under 10 minutes.</p>
          <Link href='/upload'><Button>Run a Stress Test <ArrowRight size={15} className='ml-1' /></Button></Link>
        </div>
      </section>
    </>
  )
}
