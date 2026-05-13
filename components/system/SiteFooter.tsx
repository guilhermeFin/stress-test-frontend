import Link from 'next/link'
import { Mail, X } from 'lucide-react'
import Logo from '@/components/Logo'

const SOCIAL = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com/vantageapp',
    icon: <X size={18} />,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/vantageapp',
    icon: (
      <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { text: 'Historical Scenarios', href: '/product/scenarios' },
      { text: 'Custom Scenarios',     href: '/product/custom-scenarios' },
      { text: 'Monte Carlo',          href: '/product/monte-carlo' },
      { text: 'Factor Risk Model',    href: '/product/factor-model' },
      { text: 'Branded PDF Export',   href: '/product/pdf' },
    ],
  },
  {
    heading: 'Methodology',
    links: [
      { text: 'Independent RIAs',     href: '/solutions/rias' },
      { text: 'Solo Advisors',        href: '/solutions/solo' },
      { text: 'Multi-Family Offices', href: '/solutions/mfo' },
      { text: 'Client Panic Mode',    href: '/solutions/panic-mode' },
      { text: 'Quarterly Reviews',    href: '/solutions/qbr' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { text: 'Pricing',  href: '/pricing' },
      { text: 'Roadmap',  href: '/roadmap' },
      { text: 'Try Demo', href: '/demo' },
      { text: 'Sign in',  href: '/auth/sign-in' },
    ],
    extra: {
      heading: 'Legal',
      links: [
        { text: 'Privacy Policy',   href: '#' },
        { text: 'Terms of Service', href: '#' },
      ],
    },
  },
]

export default function SiteFooter() {
  return (
    <footer className="bg-[#0B1B2E] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo size={18} />
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mt-4">
              Institutional-grade portfolio stress testing for independent wealth managers and RIAs.
              Clarity in uncertainty. Confidence in every decision.
            </p>
            <ul className="mt-6 flex items-center gap-5">
              {SOCIAL.map(({ label, href, icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 hover:text-white transition-colors duration-150"
                    aria-label={label}
                  >
                    {icon}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:hello@vantage.app"
                  className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors duration-150"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:col-span-3 gap-8">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="space-y-8">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-4">
                    {col.heading}
                  </p>
                  <ul className="space-y-2.5">
                    {col.links.map(({ text, href }) => (
                      <li key={text}>
                        <Link
                          href={href}
                          className="text-sm text-white/50 hover:text-white transition-colors duration-150"
                        >
                          {text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {'extra' in col && col.extra && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-4">
                      {col.extra.heading}
                    </p>
                    <ul className="space-y-2.5">
                      {col.extra.links.map(({ text, href }) => (
                        <li key={text}>
                          <Link
                            href={href}
                            className="text-sm text-white/50 hover:text-white transition-colors duration-150"
                          >
                            {text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© 2026 Vantage. All rights reserved.</p>
          <p>Built for independent wealth managers &amp; RIAs.</p>
        </div>
      </div>
    </footer>
  )
}
