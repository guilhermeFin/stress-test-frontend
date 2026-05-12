import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Palette, Share2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/neon-button'

export const metadata = { title: 'Branded PDF Export — Vantage' }

const PAGES = [
  { num: '1', title: 'Executive Summary', desc: 'Health score, headline risk metrics, and the AI-generated advisor memo in a single page.' },
  { num: '2', title: 'Risk Analysis', desc: 'Factor breakdown, correlation heatmap, liquidity profile, benchmark comparison, and Monte Carlo chart.' },
  { num: '3', title: 'Client Letter & Actions', desc: 'Plain-English client letter written by Claude, plus the prioritized action plan with assignable items.' },
]

const FEATURES = [
  {
    icon: Palette,
    title: 'Your Firm\'s Branding',
    desc: 'Logo, colors, and firm name are embedded in every PDF. Your client sees your practice, not a generic tool.',
  },
  {
    icon: FileText,
    title: '3-Page Institutional Format',
    desc: 'Executive summary, risk analysis, and client letter — structured exactly like a wire house research note, built for a 30-minute meeting.',
  },
  {
    icon: Share2,
    title: 'One-Click Export',
    desc: 'Generate the PDF from any stress test result in seconds. Download or share a link with a built-in expiry date.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance-Ready Footer',
    desc: 'Custom disclaimer text is injected into every page. Every output is stamped "AI-assisted — verify before client delivery."',
  },
]

const BENEFITS = [
  'Leave every client meeting with a professional report they can read, file, and refer back to',
  'Eliminate the hours spent formatting PowerPoints and Word documents for annual reviews',
  'Differentiate your practice with output that looks as good as anything a bulge-bracket firm produces',
  'Create a paper trail for every client conversation for compliance and E&O purposes',
]

export default function PdfPage() {
  return (
    <>
      <section className='relative pt-32 pb-16 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none' />
        <div className='relative max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-6'>
            Product · Branded PDF Export
          </div>
          <h1 className='text-5xl font-bold tracking-tight mb-5 leading-tight'>
            Leave every meeting with<br />a report they'll keep.
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed'>
            Generate a 3-page institutional-grade PDF — branded with your firm's logo — in seconds.
            The kind of deliverable that used to take two hours now takes two clicks.
          </p>
          <div className='flex items-center justify-center gap-4 flex-wrap'>
            <Link href='/auth/sign-up'><Button>Try It Free <ArrowRight size={15} className='ml-1' /></Button></Link>
            <Link href='/upload' className='text-sm text-gray-400 hover:text-white transition-colors'>Run a demo →</Link>
          </div>
        </div>
      </section>

      <section className='px-6 pb-20'>
        <div className='max-w-3xl mx-auto'>
          <p className='text-xs font-semibold uppercase tracking-widest text-gray-500 text-center mb-10'>
            Three pages. Everything your client needs.
          </p>
          <div className='space-y-4'>
            {PAGES.map(p => (
              <div key={p.num} className='flex items-start gap-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5'>
                <div className='w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20
                  flex items-center justify-center shrink-0 text-amber-400 font-bold text-sm'>
                  {p.num}
                </div>
                <div>
                  <p className='font-semibold text-white mb-1'>{p.title}</p>
                  <p className='text-sm text-gray-400 leading-relaxed'>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-20 bg-white/[0.01]'>
        <div className='max-w-5xl mx-auto py-16'>
          <h2 className='text-3xl font-bold text-center mb-3'>Built for your practice</h2>
          <p className='text-gray-400 text-center mb-12 max-w-xl mx-auto'>
            Every detail is designed to look like you built it, not like you used a tool.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {FEATURES.map(f => (
              <div key={f.title} className='bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6'>
                <div className='w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/15
                  flex items-center justify-center mb-4'>
                  <f.icon size={18} className='text-amber-400' />
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
          <h2 className='text-3xl font-bold text-center mb-12'>Why the PDF matters</h2>
          <div className='space-y-4'>
            {BENEFITS.map(b => (
              <div key={b} className='flex items-start gap-3'>
                <CheckCircle2 size={18} className='text-amber-400 shrink-0 mt-0.5' />
                <p className='text-gray-300 leading-relaxed'>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-24'>
        <div className='max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/[0.08] rounded-3xl px-8 py-14'>
          <h2 className='text-3xl font-bold mb-4'>Generate your first report</h2>
          <p className='text-gray-400 mb-8'>Run a stress test and export a branded PDF in under 60 seconds.</p>
          <Link href='/upload'><Button>Try PDF Export <ArrowRight size={15} className='ml-1' /></Button></Link>
        </div>
      </section>
    </>
  )
}
