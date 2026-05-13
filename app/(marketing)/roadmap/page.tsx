import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, Circle } from 'lucide-react'

export const metadata = { title: 'Roadmap — Vantage' }

const SERIF: React.CSSProperties = {
  fontFamily: 'var(--vantage-serif), Georgia, "Times New Roman", serif',
}

type Status = 'shipped' | 'in-progress' | 'planned'

const ITEMS: { status: Status; quarter: string; title: string; desc: string }[] = [
  { status: 'shipped',     quarter: 'Q1 2026', title: 'Excel upload + 6 crisis scenarios',       desc: 'Core stress testing flow — upload positions, pick a scenario, get a report.' },
  { status: 'shipped',     quarter: 'Q1 2026', title: 'Factor risk model (5 factors)',             desc: 'Beta, rates, inflation, credit, and growth factor decomposition.' },
  { status: 'shipped',     quarter: 'Q1 2026', title: 'Correlation breakdown',                     desc: 'Normal vs stress correlation matrix for every position pair.' },
  { status: 'shipped',     quarter: 'Q2 2026', title: 'Monte Carlo simulation (1,000 paths)',      desc: 'P5 / P50 / P95 outcome distributions for any scenario.' },
  { status: 'shipped',     quarter: 'Q2 2026', title: 'AI analyst memo',                          desc: 'Plain-English risk narrative and trade recommendations from Claude.' },
  { status: 'shipped',     quarter: 'Q2 2026', title: 'Branded PDF export',                       desc: '3-page institutional report with compliance footer.' },
  { status: 'shipped',     quarter: 'Q2 2026', title: 'Custom scenario builder',                  desc: 'Describe any scenario in plain English; Vantage maps it to shocks.' },
  { status: 'in-progress', quarter: 'Q3 2026', title: 'Client household management',              desc: 'Organize portfolios by household, track AUM, and flag drift alerts.' },
  { status: 'in-progress', quarter: 'Q3 2026', title: 'Tax-loss harvesting scanner',              desc: 'Identify harvest opportunities surfaced by any stress scenario.' },
  { status: 'planned',     quarter: 'Q4 2026', title: 'White-labeled client portal',              desc: 'Share results with clients under your firm\'s branding.' },
  { status: 'planned',     quarter: 'Q4 2026', title: 'Custodian sync (Schwab, Fidelity, IBKR)', desc: 'Nightly position imports — no Excel required.' },
  { status: 'planned',     quarter: 'Q1 2027', title: 'CRM integration (Salesforce, Redtail)',    desc: 'Push stress results directly to client records.' },
  { status: 'planned',     quarter: 'Q1 2027', title: 'Compliance audit trail',                   desc: 'Exportable log of every analysis run for regulatory review.' },
  { status: 'planned',     quarter: 'Q2 2027', title: 'Mobile app',                               desc: 'Run quick stress tests from the field.' },
]

const STATUS_CONFIG: Record<Status, { label: string; color: string; Icon: typeof CheckCircle2 }> = {
  shipped:     { label: 'Shipped',      color: '#15803D', Icon: CheckCircle2 },
  'in-progress': { label: 'In progress', color: '#2563EB', Icon: Clock },
  planned:     { label: 'Planned',      color: '#94A3B8', Icon: Circle },
}

export default function RoadmapPage() {
  return (
    <div className="bg-white text-[#0B1B2E]">

      {/* Page header */}
      <section className="border-b border-slate-200 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-3">ROADMAP</p>
          <h1 style={{ ...SERIF, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600, lineHeight: 1.1, color: '#0B1B2E' }}>
            What we&apos;re building
          </h1>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl leading-relaxed">
            Vantage ships fast. This is a live snapshot of what&apos;s done, what&apos;s in progress, and what&apos;s next.
          </p>
        </div>
      </section>

      {/* Legend */}
      <section className="max-w-3xl mx-auto px-6 pt-10 pb-4">
        <div className="flex items-center gap-6 flex-wrap">
          {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[Status]][]).map(([, cfg]) => (
            <div key={cfg.label} className="flex items-center gap-2 text-sm text-slate-600">
              <cfg.Icon size={14} style={{ color: cfg.color }} />
              {cfg.label}
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-3xl mx-auto px-6 py-8 pb-24">
        <div className="space-y-3">
          {ITEMS.map(({ status, quarter, title, desc }) => {
            const cfg = STATUS_CONFIG[status]
            return (
              <div
                key={title}
                className="flex items-start gap-4 bg-white border border-slate-200 rounded-lg p-5 shadow-sm"
              >
                <cfg.Icon size={16} className="mt-0.5 shrink-0" style={{ color: cfg.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-[#0B1B2E]">{title}</p>
                    <span className="text-[10px] font-medium text-slate-400 shrink-0">{quarter}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Back link */}
      <section className="border-t border-slate-100 py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0B1B2E] transition-colors"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>
      </section>

    </div>
  )
}
