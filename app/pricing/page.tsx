import Link from 'next/link'
import { CheckCircle2, ArrowRight, Zap, Shield, Building2, MessageSquare } from 'lucide-react'
import SiteNav from '@/components/marketing/site-nav'
import MarketingFooter from '@/components/ui/footer-column'

export const metadata = {
  title: 'Pricing — Vantage',
  description: 'Simple, flat pricing for wealth managers and RIAs. No per-seat fees. No usage surprises.',
}

const TIERS = [
  {
    name: 'Starter',
    icon: Zap,
    price: 99,
    desc: 'For individual advisors who need fast, credible risk analysis.',
    popular: false,
    accent: '#6B7280',
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
    accent: '#3B82F6',
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
    accent: '#8B5CF6',
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
    a: 'Yes. The demo at /demo lets you run a full stress test on a sample portfolio with no signup. When you\'re ready to use your own data, Professional comes with a 14-day free trial.',
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
    q: 'What\'s the custodian sync on Enterprise?',
    a: 'Direct API connections to Schwab, Fidelity, and IBKR. Holdings import automatically every night — no more Excel uploads.',
  },
]

function PricingCard({ tier }: { tier: typeof TIERS[number] }) {
  const Icon = tier.icon
  return (
    <div className={`relative flex flex-col rounded-[1.75rem] h-full ${
      tier.popular
        ? 'p-[2px] bg-gradient-to-b from-[#3B82F6]/60 to-[#3B82F6]/20'
        : 'p-[1.5px] bg-white/[0.06]'
    }`}>
      {tier.popular && (
        <div className='absolute -top-4 left-1/2 -translate-x-1/2 z-10'>
          <span className='px-4 py-1.5 bg-[#3B82F6] text-white text-xs font-semibold
            rounded-full shadow-lg shadow-[#3B82F6]/30'>
            Most Popular
          </span>
        </div>
      )}

      <div className={`flex flex-col h-full rounded-[calc(1.75rem-${tier.popular ? '2px' : '1.5px'})]
        bg-[#0A0F1E] p-8`}>

        {/* Header */}
        <div className='mb-7'>
          <div className='flex items-center gap-2.5 mb-4'>
            <div className='w-9 h-9 rounded-xl flex items-center justify-center'
              style={{ background: `${tier.accent}18` }}>
              <Icon size={17} style={{ color: tier.accent }} />
            </div>
            <h2 className='text-lg font-semibold text-white'>{tier.name}</h2>
          </div>

          <div className='flex items-baseline gap-1 mb-3'>
            <span className='text-5xl font-bold text-white tracking-tight'>${tier.price}</span>
            <span className='text-gray-400 text-sm'>/mo</span>
          </div>
          <p className='text-sm text-gray-400 leading-relaxed'>{tier.desc}</p>
        </div>

        {/* CTA */}
        <Link
          href={tier.href}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl
            text-sm font-semibold mb-7 transition-colors ${
            tier.popular
              ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
              : 'border border-white/15 hover:border-white/30 text-white hover:bg-white/[0.04]'
          }`}
        >
          {tier.cta} {tier.popular && <ArrowRight size={14} />}
        </Link>

        {/* Features */}
        <ul className='space-y-3 flex-1'>
          {tier.features.map(feat => (
            <li key={feat} className='flex items-start gap-2.5'>
              <CheckCircle2
                size={14}
                className='shrink-0 mt-0.5'
                style={{ color: tier.popular ? '#3B82F6' : tier.accent }}
              />
              <span className='text-sm text-gray-400'>{feat}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <main className='min-h-screen bg-[#0A0F1E] text-white'>
      <SiteNav />

      {/* Hero */}
      <section className='max-w-6xl mx-auto px-6 pt-32 pb-16 text-center'>
        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
          bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs
          font-medium mb-8'>
          Transparent pricing
        </div>
        <h1 className='text-5xl font-bold tracking-tight text-white mb-5'>
          Simple, flat pricing
        </h1>
        <p className='text-gray-400 max-w-md mx-auto text-lg mb-3'>
          No per-seat fees. No usage surprises. Cancel anytime.
        </p>
        <p className='text-sm text-gray-600'>
          All plans include a 14-day free trial · No credit card required to start
        </p>
      </section>

      {/* Pricing cards */}
      <section className='max-w-6xl mx-auto px-6 pb-24'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch'>
          {TIERS.map(tier => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>

        {/* Annual savings note */}
        <p className='text-center text-sm text-gray-500 mt-8'>
          Save ~20% with annual billing ·{' '}
          <a href='mailto:hello@vantage.app' className='text-[#3B82F6] hover:underline'>
            Contact us for volume discounts
          </a>
        </p>
      </section>

      {/* Comparison table */}
      <section className='max-w-5xl mx-auto px-6 pb-24'>
        <h2 className='text-2xl font-bold text-center mb-10'>Full feature comparison</h2>

        <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl overflow-hidden'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-white/[0.06]'>
                <th className='text-left px-6 py-4 text-gray-500 font-medium w-1/2'>Feature</th>
                {TIERS.map(t => (
                  <th key={t.name} className='px-6 py-4 text-center font-semibold text-white'>
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-white/[0.04]'>
              {[
                ['Stress tests / month',        '25',          'Unlimited',   'Unlimited'],
                ['Historical scenarios',        '6',           '6',           '6 + custom library'],
                ['Custom scenario (plain text)', '—',          '✓',           '✓'],
                ['Custom shock sliders',        '—',          '✓',           '✓'],
                ['Factor risk model',           '✓',          '✓',           '✓'],
                ['Monte Carlo paths',           '1,000',       '10,000',      '10,000'],
                ['Tax impact & TLH scanner',    '—',          '✓',           '✓'],
                ['AI analyst memo',             '—',          '✓',           '✓'],
                ['Branded PDF export',          '✓',          '✓',           '✓'],
                ['Custodian sync',              '—',          '—',           '✓'],
                ['White-label client portal',   '—',          '—',           '✓'],
                ['Weekly intelligence email',   '—',          '—',           '✓'],
                ['SAML SSO',                   '—',          '—',           '✓'],
                ['Audit log export',            '—',          '—',           '✓'],
                ['Team seats',                  '1',          '5',           'Unlimited'],
                ['Support',                     'Email',       'Priority',    'Dedicated AM'],
              ].map(([feature, starter, pro, enterprise]) => (
                <tr key={feature} className='hover:bg-white/[0.02] transition-colors'>
                  <td className='px-6 py-3.5 text-gray-400'>{feature}</td>
                  <td className='px-6 py-3.5 text-center text-gray-300'>{starter}</td>
                  <td className='px-6 py-3.5 text-center text-gray-300'>{pro}</td>
                  <td className='px-6 py-3.5 text-center text-gray-300'>{enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className='max-w-3xl mx-auto px-6 pb-24'>
        <h2 className='text-2xl font-bold text-center mb-10'>Frequently asked questions</h2>
        <div className='space-y-4'>
          {FAQ.map(({ q, a }) => (
            <div key={q} className='bg-white/[0.025] border border-white/[0.06] rounded-2xl p-6'>
              <p className='text-sm font-semibold text-white mb-2'>{q}</p>
              <p className='text-sm text-gray-400 leading-relaxed'>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className='max-w-6xl mx-auto px-6 pb-24'>
        <div className='bg-gradient-to-br from-[#3B82F6]/10 to-[#8B5CF6]/10
          border border-white/[0.08] rounded-2xl p-10 flex flex-col md:flex-row
          items-center justify-between gap-6'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-xl bg-[#3B82F6]/15 flex items-center justify-center shrink-0'>
              <MessageSquare size={22} className='text-[#3B82F6]' />
            </div>
            <div>
              <p className='text-lg font-semibold text-white mb-1'>Need a custom plan?</p>
              <p className='text-sm text-gray-400'>
                Multi-firm groups, volume pricing, compliance integrations, and custom data sources — let&apos;s talk.
              </p>
            </div>
          </div>
          <a
            href='mailto:hello@vantage.app'
            className='shrink-0 flex items-center gap-2 text-sm font-semibold text-white
              bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl px-6 py-3 transition-colors'
          >
            Contact sales <ArrowRight size={14} />
          </a>
        </div>
      </section>

      <MarketingFooter />
    </main>
  )
}
