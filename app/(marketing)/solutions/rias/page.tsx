import Link from 'next/link'
import { ArrowRight, CheckCircle2, Trophy, DollarSign, Clock, Users } from 'lucide-react'

export const metadata = { title: 'Vantage for Independent RIAs' }

const SERIF: React.CSSProperties = {
  fontFamily: 'var(--vantage-serif), Georgia, "Times New Roman", serif',
}

const MONO: React.CSSProperties = {
  fontFamily: 'var(--vantage-mono), "SF Mono", Menlo, monospace',
}

const PAIN_POINTS = [
  { label: 'Riskalyze',  cost: '$4,000–10,000/yr', note: 'Limited scenario depth, no AI memo',       highlight: false },
  { label: 'eMoney',     cost: '$5,000–15,000/yr', note: 'Planning-focused, no stress testing',       highlight: false },
  { label: 'Vantage',   cost: 'From $99/mo',       note: 'Full institutional analysis in 60 seconds', highlight: true },
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
    <div className="bg-white text-[#0B1B2E]">

      {/* Hero */}
      <section className="border-b border-slate-200 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-4">
            SOLUTIONS · INDEPENDENT RIAS
          </p>
          <h1
            className="mb-5"
            style={{ ...SERIF, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600, lineHeight: 1.1, color: '#0B1B2E' }}
          >
            Wirehouses have a $100K research budget.<br />Now so do you.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed mb-10">
            Vantage gives independent RIAs the same institutional-grade stress testing
            that bulge-bracket firms use — at a price that makes sense for a boutique practice.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]
                text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors duration-150"
            >
              Start Free Trial <ArrowRight size={14} />
            </Link>
            <Link href="/pricing" className="text-sm text-slate-500 hover:text-[#0B1B2E] transition-colors">
              See pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* Price comparison */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-400 mb-8">
          What you were paying vs. what you pay now
        </p>
        <div className="space-y-3">
          {PAIN_POINTS.map(p => (
            <div
              key={p.label}
              className={`flex items-center justify-between rounded-lg px-5 py-4 border ${
                p.highlight
                  ? 'bg-[#2563EB]/5 border-[#2563EB]/25'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <p className={`font-semibold text-sm ${p.highlight ? 'text-[#2563EB]' : 'text-[#0B1B2E]'}`}>
                  {p.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{p.note}</p>
              </div>
              <p
                className={`font-semibold text-sm tabular-nums ${p.highlight ? 'text-[#2563EB]' : 'text-slate-600'}`}
                style={MONO}
              >
                {p.cost}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 border-y border-slate-200 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center mb-3"
            style={{ ...SERIF, fontSize: '32px', fontWeight: 600, color: '#0B1B2E' }}
          >
            Built for your practice
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-xl mx-auto">
            Every feature is designed around the realities of running an independent firm.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center mb-4">
                  <f.icon size={18} className="text-[#2563EB]" />
                </div>
                <h3 className="text-base font-semibold text-[#0B1B2E] mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2
          className="mb-10"
          style={{ ...SERIF, fontSize: '28px', fontWeight: 600, color: '#0B1B2E' }}
        >
          What changes when you use Vantage
        </h2>
        <div className="space-y-4">
          {BENEFITS.map(b => (
            <div key={b} className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-[#2563EB] shrink-0 mt-0.5" />
              <p className="text-slate-700 leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 py-12 px-6">
        <div className="max-w-2xl mx-auto text-center bg-slate-50 border border-slate-200 rounded-xl px-8 py-14">
          <h2
            className="mb-4"
            style={{ ...SERIF, fontSize: '32px', fontWeight: 600, color: '#0B1B2E' }}
          >
            Start your free trial
          </h2>
          <p className="text-slate-600 mb-8">No credit card required. Full access for 14 days.</p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]
              text-white px-6 py-3 rounded-md text-sm font-semibold transition-colors duration-150"
          >
            Get Started Free <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </div>
  )
}
