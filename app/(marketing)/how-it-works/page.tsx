import Link from 'next/link'
import { ArrowLeft, Upload, Shield, Brain, Clock } from 'lucide-react'

export const metadata = { title: 'How It Works — Vantage' }

const SERIF: React.CSSProperties = {
  fontFamily: 'var(--vantage-serif), Georgia, "Times New Roman", serif',
}

const STEPS = [
  {
    Icon: Upload,
    step: '01',
    title: 'Upload your portfolio',
    desc: 'Drop in an Excel file with your positions, or type tickers directly. Vantage accepts any size, any asset mix — equities, fixed income, alternatives, cash.',
  },
  {
    Icon: Shield,
    step: '02',
    title: 'Choose a scenario',
    desc: 'Pick from 6 pre-built historical crises (2008 GFC, COVID, Dot-Com, Black Monday, 2022 Rate Shock, Stagflation) or describe your own in plain English. Custom shock sliders let you fine-tune every factor.',
  },
  {
    Icon: Brain,
    step: '03',
    title: 'Get your full analysis in 60 seconds',
    desc: 'A 12-section institutional report streams in: factor risk, correlation, liquidity, Monte Carlo, tax impact, AI analyst memo — ready to put in front of a client.',
  },
  {
    Icon: Clock,
    step: '04',
    title: 'Share and act',
    desc: 'Export a branded 3-page PDF, send a client letter, or walk through Presentation Mode live in the room. Every section is designed to explain, not just report.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="bg-white text-[#0B1B2E]">

      {/* Page header */}
      <section className="border-b border-slate-200 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-3">
            HOW IT WORKS
          </p>
          <h1
            style={{ ...SERIF, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600, lineHeight: 1.1, color: '#0B1B2E' }}
          >
            From portfolio to full analysis<br />in 60 seconds
          </h1>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl leading-relaxed">
            Vantage is built for the advisor in the room — where every second counts and every chart needs to be explainable.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-16">
          {STEPS.map(({ Icon, step, title, desc }) => (
            <div key={step} className="flex items-start gap-8">
              <div className="shrink-0">
                <div className="w-14 h-14 rounded-lg bg-[#2563EB]/8 border border-[#2563EB]/20 flex items-center justify-center">
                  <Icon size={22} className="text-[#2563EB]" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-400 mb-1">{step}</p>
                <h2
                  className="mb-3"
                  style={{ ...SERIF, fontSize: '24px', fontWeight: 600, color: '#0B1B2E' }}
                >
                  {title}
                </h2>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-3">
            READY?
          </p>
          <h2
            className="mb-4"
            style={{ ...SERIF, fontSize: '36px', fontWeight: 600, color: '#0B1B2E' }}
          >
            See it in action
          </h2>
          <p className="text-slate-600 mb-8">Run a full stress test on a sample portfolio. No signup required.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]
                text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors duration-150"
            >
              Try the demo
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0B1B2E] transition-colors"
            >
              <ArrowLeft size={14} /> Back to home
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
