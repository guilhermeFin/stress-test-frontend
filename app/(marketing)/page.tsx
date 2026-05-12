import Link from 'next/link'
import { Fragment } from 'react'
import {
  ArrowRight, CheckCircle2,
  Upload, Shield, Brain,
  Target,
  Search, Zap,
} from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'
import { Button } from '@/components/ui/neon-button'
import GlobalBackground from '@/components/GlobalBackground'
import FeaturesSection from '@/components/marketing/features-section'
import ToolsSection from '@/components/marketing/tools-section'
import HeroSection from '@/components/marketing/hero-section'

const STEPS = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload Your Portfolio',
    desc: 'Drop in an Excel file with your positions, or type tickers and weights directly. Any size, any mix.',
  },
  {
    num: '02',
    icon: Shield,
    title: 'Choose a Scenario',
    desc: 'Pick from 6 historical crises — 2008 GFC, COVID, Dot-Com, and more — or describe your own in plain English.',
  },
  {
    num: '03',
    icon: Brain,
    title: 'Get Your Full Analysis',
    desc: '12-section institutional report in under 60 seconds: factor risk, liquidity, Monte Carlo, tax impact, AI memo, and more.',
  },
]

const TIERS = [
  {
    name: 'Starter',
    price: '$99',
    desc: 'For individual advisors who need fast, credible risk analysis.',
    popular: false,
    features: [
      '25 stress tests per month',
      'Excel upload + template',
      '6 historical crisis scenarios',
      'Smart Risk Summary (health score)',
      'Charts & position breakdown',
      'Factor risk model (5 factors)',
      'Correlation breakdown',
      'Liquidity stress analysis',
      'Monte Carlo simulation (1,000 paths)',
      'Benchmark comparison',
      'PDF export',
      'Email support',
    ],
    cta: 'Get Started',
    href: '/upload',
  },
  {
    name: 'Professional',
    price: '$299',
    desc: 'For advisors who need to communicate risk clearly and run client meetings confidently.',
    popular: true,
    features: [
      'Unlimited stress tests',
      'Everything in Starter',
      'Custom scenario builder + shock sliders',
      'Tax impact analysis',
      'Client impact & retirement goals',
      'Rebalancing recommendations',
      'AI analyst memo',
      'Client Presentation Mode (slide deck)',
      'Portfolio comparison tool',
      'Custom ticker portfolios (no Excel needed)',
      'Household / multi-account view',
      'Annual review tracking',
      'Branded PDF reports',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    href: '/upload',
  },
  {
    name: 'Enterprise',
    price: '$799',
    desc: 'For larger firms and teams with advanced compliance needs.',
    popular: false,
    features: [
      'Everything in Professional',
      'Unlimited team seats',
      'White-labeled client portal',
      'CRM integration (Salesforce, Redtail)',
      'Custodian sync (Schwab, Fidelity)',
      'Compliance audit trail',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    href: 'mailto:hello@portfoliostress.com',
  },
]

export default function HomePage() {
  return (
    <div className='relative'>
      <GlobalBackground />
      <ScrollReveal />

      {/* ── Ambient mesh orbs ─────────────────────────────────────────── */}
      <div className='fixed inset-0 z-0 pointer-events-none overflow-hidden' aria-hidden>
        <div className='absolute top-[-18%] left-[-8%] w-[55vw] h-[55vw] rounded-full opacity-[0.06]'
          style={{ background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 68%)' }} />
        <div className='absolute bottom-[5%] right-[-6%] w-[38vw] h-[38vw] rounded-full opacity-[0.04]'
          style={{ background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 68%)' }} />
        <div className='absolute top-[55%] left-[40%] w-[28vw] h-[28vw] rounded-full opacity-[0.03]'
          style={{ background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 68%)' }} />
      </div>

      <div className='relative z-10'>

        {/* ── 2. Hero ─────────────────────────────────────────────────────── */}
        <HeroSection />


        {/* ── 3. How It Works ─────────────────────────────────────────────── */}
        <section id='how-it-works' className='max-w-6xl mx-auto px-6 py-32'>
          <div data-reveal className='text-center mb-20'>
            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs
              font-medium mb-5'>
              Simple by design
            </div>
            <h2 className='font-bold tracking-tight text-white mb-5'
              style={{ fontSize: '48px', lineHeight: '1.21' }}>
              How it works
            </h2>
            <p className='text-gray-400 max-w-md mx-auto'>
              Three steps. Under 60 seconds. Full institutional output.
            </p>
          </div>

          <div className='flex flex-col md:flex-row items-stretch gap-3'>
            {STEPS.map((step, i) => (
              <Fragment key={step.num}>
                <div data-reveal data-delay={i === 0 ? '' : i === 1 ? '150' : '300'}
                  className='flex-1 p-1.5 rounded-[1.75rem] bg-white/4 ring-1 ring-white/8
                    hover:ring-white/[0.16] group
                    transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]'>
                  <div className='h-full rounded-[1.25rem] bg-[#0A0F1E] p-7
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'>
                    <div className='flex items-center gap-4 mb-5'>
                      <div className='w-10 h-10 bg-[#3B82F6]/20 rounded-xl flex items-center
                        justify-center group-hover:bg-[#3B82F6]/30 shrink-0
                        transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]'>
                        <step.icon size={18} className='text-[#3B82F6]' />
                      </div>
                      <span className='text-4xl font-bold text-white/8 tabular-nums leading-none'>
                        {step.num}
                      </span>
                    </div>
                    <h3 className='font-semibold text-white mb-2 text-lg'>{step.title}</h3>
                    <p className='text-sm text-gray-400 leading-relaxed'>{step.desc}</p>
                  </div>
                </div>

                {i < STEPS.length - 1 && (
                  <div className='hidden md:flex items-center justify-center shrink-0 w-8'>
                    <ArrowRight size={16} className='text-white/20' />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </section>

        {/* ── 4. Tools ────────────────────────────────────────────────────── */}
        <ToolsSection />

        {/* ── 5. Features ─────────────────────────────────────────────────── */}
        <FeaturesSection />

        {/* ── 5. Pricing ──────────────────────────────────────────────────── */}
        <section id='pricing' className='max-w-6xl mx-auto px-6 py-32'>
          <div data-reveal className='text-center mb-20'>
            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs
              font-medium mb-5'>
              Transparent pricing
            </div>
            <h2 className='font-bold tracking-tight text-white mb-5'
              style={{ fontSize: '48px', lineHeight: '1.21' }}>
              Simple, flat pricing
            </h2>
            <p className='text-gray-400 max-w-md mx-auto'>
              No per-seat fees. No usage surprises. Cancel anytime.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-start'>
            {TIERS.map((tier, i) => (
              <div key={tier.name}
                data-reveal
                {...(i > 0 ? { 'data-delay': i === 1 ? '150' : '300' } : {})}
                className='relative'>
                {tier.popular ? (
                  <div className='p-[2px] rounded-[1.75rem] bg-gradient-to-b
                    from-[#3B82F6]/60 to-[#3B82F6]/20'>
                    <div className='rounded-[calc(1.75rem-2px)] bg-[#0A0F1E] p-7 flex flex-col
                      shadow-[inset_0_1px_0_rgba(59,130,246,0.2)]'>
                      <PricingCardContent tier={tier} />
                    </div>
                  </div>
                ) : (
                  <div className='p-1.5 rounded-[1.75rem] bg-white/4 ring-1 ring-white/8
                    hover:ring-white/[0.14]
                    transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]'>
                    <div className='rounded-[1.25rem] bg-[#0A0F1E] p-7 flex flex-col
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'>
                      <PricingCardContent tier={tier} />
                    </div>
                  </div>
                )}

                {tier.popular && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                    <span className='px-4 py-1.5 bg-[#3B82F6] text-white text-xs
                      font-semibold rounded-full shadow-lg shadow-[#3B82F6]/20'>
                      Most Popular
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. Final CTA ────────────────────────────────────────────────── */}
        <section data-reveal className='max-w-6xl mx-auto px-6 py-16 pb-32'>
          <div className='p-1.5 rounded-[2rem] bg-white/4 ring-1 ring-white/8'>
            <div className='rounded-[1.6rem] bg-[#0A0F1E] p-16 text-center
              shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'>
              <h2 className='font-bold tracking-tight text-white mb-5'
                style={{ fontSize: '48px', lineHeight: '1.21' }}>
                Ready to run your first stress test?
              </h2>
              <p className='text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed'>
                Upload a portfolio and see your risk in 60 seconds.
                No setup required. No contract.
              </p>
              <Link href='/demo' className='inline-block mb-6'>
                <Button variant='solid' size='lg' className='flex items-center gap-3 text-sm font-semibold'>
                  Try It Free — No Upload Needed <ArrowRight size={14} />
                </Button>
              </Link>
              <p className='text-xs text-gray-600 block'>
                No credit card required · Takes 60 seconds · Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* ── 7. Brand Pillars ────────────────────────────────────────────── */}
        <section data-reveal className='max-w-6xl mx-auto px-6 pb-20'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[
              { icon: Search, label: 'Clarity' },
              { icon: Zap,    label: 'Speed'   },
              { icon: Shield, label: 'Trust'   },
              { icon: Target, label: 'Precision'},
            ].map(({ icon: Icon, label }) => (
              <div key={label}
                className='flex flex-col items-center gap-3 p-6 rounded-2xl
                  bg-white/[0.03] border border-white/8'>
                <div className='w-10 h-10 bg-[#3B82F6]/10 rounded-xl
                  flex items-center justify-center'>
                  <Icon size={18} className='text-[#3B82F6]' />
                </div>
                <span className='text-xs font-medium uppercase tracking-widest text-gray-400'>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

function PricingCardContent({ tier }: { tier: typeof TIERS[number] }) {
  return (
    <>
      <div className='mb-7'>
        <h3 className='font-semibold text-white mb-1 text-lg'>{tier.name}</h3>
        <div className='flex items-baseline gap-1 mb-3'>
          <span className='font-bold text-white'
            style={{ fontSize: '40px', letterSpacing: '-0.4px' }}>
            {tier.price}
          </span>
          <span className='text-gray-400 text-sm'>/mo</span>
        </div>
        <p className='text-sm text-gray-400 leading-relaxed'>{tier.desc}</p>
      </div>

      <ul className='space-y-3 flex-1 mb-7'>
        {tier.features.map(feat => (
          <li key={feat} className='flex items-start gap-2.5'>
            <CheckCircle2 size={14}
              className={`shrink-0 mt-0.5 ${tier.popular ? 'text-[#3B82F6]' : 'text-green-400'}`} />
            <span className='text-sm text-gray-400'>{feat}</span>
          </li>
        ))}
      </ul>

      <Link href={tier.href} className='block'>
        <Button
          variant='solid'
          size='lg'
          className='w-full text-sm font-semibold tracking-wide'
        >
          {tier.cta}
        </Button>
      </Link>
    </>
  )
}
