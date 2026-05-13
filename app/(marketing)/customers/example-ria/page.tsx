import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Customer Story — Vantage' }

const SERIF: React.CSSProperties = {
  fontFamily: 'var(--vantage-serif), Georgia, "Times New Roman", serif',
}

const MONO: React.CSSProperties = {
  fontFamily: 'var(--vantage-mono), "SF Mono", Menlo, monospace',
}

const METRICS = [
  { label: 'Time to full analysis',  before: '4–6 hours', after: '60 seconds' },
  { label: 'Client presentations/mo', before: '3–4',       after: '20+' },
  { label: 'Client retention rate',  before: '78%',        after: '94%' },
]

export default function CustomerStoryPage() {
  return (
    <div className="bg-white text-[#0B1B2E]">

      {/* Header */}
      <section className="border-b border-slate-200 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-3">
            CUSTOMER STORY
          </p>
          <h1
            className="mb-4"
            style={{ ...SERIF, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 600, lineHeight: 1.1, color: '#0B1B2E' }}
          >
            How one independent RIA doubled client meetings without adding staff
          </h1>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="font-medium text-[#0B1B2E]">Meridian Wealth Advisors</span>
            <span>·</span>
            <span>$120M AUM · Solo advisor</span>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {METRICS.map(({ label, before, after }) => (
            <div key={label} className="bg-slate-50 border border-slate-200 rounded-lg p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-400 mb-3">{label}</p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400 line-through tabular-nums" style={MONO}>{before}</span>
                <span className="text-slate-300">→</span>
                <span className="text-base font-semibold text-[#15803D] tabular-nums" style={MONO}>{after}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="border-l-2 border-[#2563EB] pl-6 mb-10">
          <p
            className="mb-3"
            style={{ ...SERIF, fontSize: '24px', fontWeight: 400, lineHeight: 1.4, color: '#0B1B2E' }}
          >
            &ldquo;Before Vantage, I&apos;d spend a Friday afternoon building a stress scenario for one client.
            Now I run four of them before lunch.&rdquo;
          </p>
          <cite className="text-sm text-slate-500 not-italic">
            — Daniel Reyes, CFP · Founder, Meridian Wealth Advisors
          </cite>
        </blockquote>

        {/* Story body */}
        <div className="prose prose-slate max-w-none text-[15px] leading-relaxed space-y-4">
          <p className="text-slate-700">
            Daniel runs a solo RIA with 42 client households and $120M in AUM. Like most independent
            advisors, he built his practice on relationships — not on the analytical horsepower of a
            bulge-bracket research desk. That worked until volatility arrived.
          </p>
          <p className="text-slate-700">
            During the 2022 rate shock, three clients called in the same week, each asking the same
            question: &ldquo;What happens to my portfolio if rates keep rising?&rdquo; Daniel spent the weekend
            building Excel models. By the time they were ready, two of the clients had already moved money.
          </p>
          <p className="text-slate-700">
            Vantage changed how Daniel handles uncertainty. He now runs a stress test before every
            quarterly review — and keeps the results ready when markets move. &ldquo;I send a one-page PDF
            before the panic even starts. The client sees I already thought about it. That&apos;s the whole game.&rdquo;
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 py-12 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0B1B2E] transition-colors"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]
              text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors duration-150"
          >
            Try Vantage free <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </div>
  )
}
