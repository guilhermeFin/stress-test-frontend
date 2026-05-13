import Link from 'next/link'
import { CheckCircle2, ArrowRight, Zap, Shield, Building2, MessageSquare } from 'lucide-react'

export const metadata = {
  title: 'Pricing — Vantage',
  description: 'Simple, flat pricing for wealth managers and RIAs. No per-seat fees. No usage surprises.',
}

const SERIF: React.CSSProperties = {
  fontFamily: 'var(--vantage-serif), Georgia, "Times New Roman", serif',
}

const MONO: React.CSSProperties = {
  fontFamily: 'var(--vantage-mono), "SF Mono", Menlo, monospace',
}

const TIERS = [
  {
    name: 'Starter',
    icon: Zap,
    price: 99,
    desc: 'For individual advisors who need fast, credible risk analysis.',
    popular: false,
    features: [
      '25 stress tests per month',
      'Excel upload + downloadable template',
      '6 historical crisis scenarios',
      'Smart Risk Summary with health score',
      'Factor risk model (5 factors)',
      'Correlation breakdown (normal vs stress)',
      'Liquidity stress analysis',
      'Monte Carlo simulation (1,000 paths)',
      'Benchmark comparison (4 benchmarks)',
      'Branded PDF export',
      'Email support',
    ],
    cta: 'Get started',
    href: '/demo',
  },
  {
    name: 'Professional',
    icon: Shield,
    price: 299,
    desc: 'For advisors who need to communicate risk clearly and run client meetings confidently.',
    popular: true,
    features: [
      'Unlimited stress tests',
      'Everything in Starter',
      'Custom scenario builder (plain English)',
      'Custom shock sliders (6 dimensions)',
      'Tax impact analysis & TLH scanner',
      'Goal-based planning & Monte Carlo (10K paths)',
      'AI analyst memo + client letter',
      'Client Presentation Mode',
      'Portfolio comparison tool',
      'Custom ticker portfolios (no Excel needed)',
      'Rebalancing recommendations',
      'Action plan with assignable tasks',
      'Branded PDF + compliance footer',
      'Priority support',
    ],
    cta: 'Start free trial',
    href: '/demo',
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: 799,
    desc: 'For larger firms and teams with compliance, white-labeling, and integration needs.',
    popular: false,
    features: [
      'Everything in Professional',
      'Unlimited team seats & advisors',
      'White-labeled client portal',
      'SAML SSO (Okta, Azure AD, Google)',
      'Custodian sync (Schwab, Fidelity, IBKR)',
      'Weekly intelligence email digest',
      'Custom scenario library',
      'Priority Claude routing (< 45s SLA)',
      'Audit log export (CSV)',
      'Dedicated account manager',
      'Custom compliance footers per advisor',
      'API access',
    ],
    cta: 'Contact sales',
    href: 'mailto:hello@vantage.app',
  },
]

const FAQ = [
  {
    q: 'Is there a free trial?',
    a: "Yes. The demo at /demo lets you run a full stress test on a sample portfolio with no signup. When you're ready to use your own data, Professional comes with a 14-day free trial.",
  },
  {
    q: 'What counts as a "stress test"?',
    a: 'One stress test = one portfolio × one scenario run. Uploading a portfolio and running 2008 GFC is one test. Running it again with COVID is a second test. The Starter plan includes 25 per month; Professional and Enterprise are unlimited.',
  },
  {
    q: 'Can I change plans anytime?',
    a: 'Yes. Upgrade instantly (prorated), downgrade at the end of your billing period. No cancellation fees.',
  },
  {
    q: 'Is there a per-seat fee?',
    a: 'No. Starter and Professional are per firm, not per user. Enterprise includes unlimited seats.',
  },
  {
    q: 'How is billing handled?',
    a: 'Monthly or annual billing via Stripe. Annual plans save ~20%. Invoices available in your billing settings.',
  },
  {
    q: "What's the custodian sync on Enterprise?",
    a: 'Direct API connections to Schwab, Fidelity, and IBKR. Holdings import automatically every night — no more Excel uploads.',
  },
]

function PricingCard({ tier }: { tier: typeof TIERS[number] }) {
  const Icon = tier.icon
  return (
    <div
      className={`relative flex flex-col bg-white rounded-lg h-full p-8 ${
        tier.popular
          ? 'border-2 border-[#2563EB] shadow-[0_4px_12px_rgba(37,99,235,0.12)]'
          : 'border border-slate-200 shadow-sm'
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1.5 bg-[#2563EB] text-white text-xs font-semibold rounded-full shadow-sm">
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: tier.popular ? 'rgba(37,99,235,0.08)' : 'rgba(11,27,46,0.06)' }}
          >
            <Icon size={17} className={tier.popular ? 'text-[#2563EB]' : 'text-[#0B1B2E]'} />
          </div>
          <h2 className="text-base font-semibold text-[#0B1B2E]">{tier.name}</h2>
        </div>

        <div className="flex items-baseline gap-1 mb-3">
          <span
            className="tabular-nums text-[#0B1B2E]"
            style={{ ...MONO, fontSize: '48px', fontWeight: 500, lineHeight: 1 }}
          >
            ${tier.price}
          </span>
          <span className="text-slate-500 text-sm">/mo</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{tier.desc}</p>
      </div>

      {/* CTA */}
      <Link
        href={tier.href}
        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-md
          text-sm font-semibold mb-7 transition-colors duration-150 ${
          tier.popular
            ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
            : 'border border-slate-300 hover:bg-slate-50 text-[#0B1B2E]'
        }`}
      >
        {tier.cta} {tier.popular && <ArrowRight size={14} />}
      </Link>

      {/* Features */}
      <ul className="space-y-2.5 flex-1">
        {tier.features.map(feat => (
          <li key={feat} className="flex items-start gap-2.5">
            <CheckCircle2
              size={14}
              className="shrink-0 mt-0.5"
              style={{ color: tier.popular ? '#2563EB' : '#64748B' }}
            />
            <span className="text-sm text-slate-600">{feat}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function PricingPage() {
  return (
    <div className="bg-white text-[#0B1B2E]">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-4">
          TRANSPARENT PRICING
        </p>
        <h1
          className="mb-4"
          style={{ ...SERIF, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600, lineHeight: 1.1, color: '#0B1B2E' }}
        >
          Simple, flat pricing
        </h1>
        <p className="text-slate-500 max-w-md mx-auto text-lg mb-2">
          No per-seat fees. No usage surprises. Cancel anytime.
        </p>
        <p className="text-sm text-slate-400">
          All plans include a 14-day free trial · No credit card required to start
        </p>
      </section>

      {/* Pricing cards */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {TIERS.map(tier => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 mt-8">
          Save ~20% with annual billing ·{' '}
          <a href="mailto:hello@vantage.app" className="text-[#2563EB] hover:underline">
            Contact us for volume discounts
          </a>
        </p>
      </section>

      {/* Comparison table */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2
          className="text-center mb-10"
          style={{ ...SERIF, fontSize: '28px', fontWeight: 600, color: '#0B1B2E' }}
        >
          Full feature comparison
        </h2>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-6 py-4 text-slate-500 font-medium w-1/2">Feature</th>
                {TIERS.map(t => (
                  <th key={t.name} className="px-6 py-4 text-center font-semibold text-[#0B1B2E]">
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ['Stress tests / month',         '25',          'Unlimited',   'Unlimited'],
                ['Historical scenarios',         '6',           '6',           '6 + custom library'],
                ['Custom scenario (plain text)',  '—',           '✓',           '✓'],
                ['Custom shock sliders',         '—',           '✓',           '✓'],
                ['Factor risk model',            '✓',           '✓',           '✓'],
                ['Monte Carlo paths',            '1,000',       '10,000',      '10,000'],
                ['Tax impact & TLH scanner',     '—',           '✓',           '✓'],
                ['AI analyst memo',              '—',           '✓',           '✓'],
                ['Branded PDF export',           '✓',           '✓',           '✓'],
                ['Custodian sync',               '—',           '—',           '✓'],
                ['White-label client portal',    '—',           '—',           '✓'],
                ['Weekly intelligence email',    '—',           '—',           '✓'],
                ['SAML SSO',                     '—',           '—',           '✓'],
                ['Audit log export',             '—',           '—',           '✓'],
                ['Team seats',                   '1',           '5',           'Unlimited'],
                ['Support',                      'Email',       'Priority',    'Dedicated AM'],
              ].map(([feature, starter, pro, enterprise]) => (
                <tr key={feature} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 text-slate-600">{feature}</td>
                  <td className="px-6 py-3.5 text-center text-slate-700 tabular-nums">{starter}</td>
                  <td className="px-6 py-3.5 text-center text-slate-700 tabular-nums">{pro}</td>
                  <td className="px-6 py-3.5 text-center text-slate-700 tabular-nums">{enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2
          className="text-center mb-10"
          style={{ ...SERIF, fontSize: '28px', fontWeight: 600, color: '#0B1B2E' }}
        >
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#0B1B2E] mb-2">{q}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#2563EB]/10 flex items-center justify-center shrink-0">
              <MessageSquare size={22} className="text-[#2563EB]" />
            </div>
            <div>
              <p className="text-base font-semibold text-[#0B1B2E] mb-1">Need a custom plan?</p>
              <p className="text-sm text-slate-600">
                Multi-firm groups, volume pricing, compliance integrations — let&apos;s talk.
              </p>
            </div>
          </div>
          <a
            href="mailto:hello@vantage.app"
            className="shrink-0 flex items-center gap-2 text-sm font-semibold text-white
              bg-[#2563EB] hover:bg-[#1D4ED8] rounded-md px-6 py-2.5 transition-colors duration-150"
          >
            Contact sales <ArrowRight size={14} />
          </a>
        </div>
      </section>

    </div>
  )
}
