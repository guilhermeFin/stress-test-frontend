export type NavItem = {
  title: string
  description: string
  href: string
  badge?: string
}

export type NavColumn = {
  heading: string
  items?: NavItem[]
  featured?: {
    eyebrow: string
    title: string
    href: string
    cta: string
  }
}

export type MegaMenu = {
  label: string
  columns: NavColumn[]
}

export type PlainLink = {
  label: string
  href: string
}

export type NavConfig = {
  product: MegaMenu
  solutions: MegaMenu
  pricing: PlainLink
}

export const navConfig: NavConfig = {
  product: {
    label: 'Product',
    columns: [
      {
        heading: 'Stress Testing',
        items: [
          { title: 'Historical Scenarios',  description: '2008, COVID, Dot-Com & more',        href: '/product/scenarios' },
          { title: 'Custom Scenarios',       description: 'Describe a crisis in plain English', href: '/product/custom-scenarios' },
          { title: 'Monte Carlo',            description: '1,000-path forward simulation',      href: '/product/monte-carlo' },
          { title: 'Factor Risk Model',      description: '5-factor decomposition',             href: '/product/factor-model' },
        ],
      },
      {
        heading: 'Client Analysis',
        items: [
          { title: 'Portfolio Diagnostics',  description: 'Correlation, liquidity, drawdown',   href: '/product/diagnostics' },
          { title: 'Benchmark Comparison',   description: 'S&P 500, 60/40, All-Weather',        href: '/product/benchmarks' },
          { title: 'Goal Impact',            description: 'Retirement & ruin probability',      href: '/product/goal-impact' },
          { title: 'Rebalancing',            description: 'Tax-aware recommendations',          href: '/product/rebalancing' },
        ],
      },
      {
        heading: 'Reporting',
        items: [
          { title: 'Branded PDF Export',     description: 'Client-ready in seconds',            href: '/product/pdf' },
          { title: 'Analyst Memo',           description: 'AI-drafted advisor note',            href: '/product/analyst-memo' },
          { title: 'Client Letter',          description: 'Plain-English explanation',          href: '/product/client-letter' },
          { title: 'Action Plan',            description: 'Assignable tasks',                   href: '/product/action-plan' },
        ],
      },
      {
        heading: 'Coming Soon',
        items: [
          { title: 'Custodian Sync',         description: 'Schwab, Fidelity, IBKR',             href: '/roadmap', badge: 'Soon' },
          { title: 'Weekly Intelligence',    description: 'Personalized digest emails',          href: '/roadmap', badge: 'Soon' },
          { title: 'White-Label Portal',     description: 'Branded client view',                href: '/roadmap', badge: 'Soon' },
          { title: 'Planning, Tax & Estate', description: 'The full advisor workspace',          href: '/roadmap', badge: 'Soon' },
        ],
      },
    ],
  },
  solutions: {
    label: 'Solutions',
    columns: [
      {
        heading: 'By Firm Type',
        items: [
          { title: 'Independent RIAs',       description: 'Mid-market firms, $50M–$5B AUM',     href: '/solutions/rias' },
          { title: 'Solo Advisors',          description: 'One-person practices',               href: '/solutions/solo' },
          { title: 'Multi-Family Offices',   description: 'UHNW & complex households',          href: '/solutions/mfo' },
          { title: 'Hybrid Advisors',        description: 'Broker-dealer + RIA',               href: '/solutions/hybrid' },
        ],
      },
      {
        heading: 'By Job To Be Done',
        items: [
          { title: 'Client Panic Mode',      description: '60-second answers during sell-offs', href: '/solutions/panic-mode' },
          { title: 'Quarterly Reviews',      description: 'Meeting prep in minutes',            href: '/solutions/qbr' },
          { title: 'Prospect Conversion',    description: 'Win trust with institutional output',href: '/solutions/prospects' },
          { title: 'IC Prep',               description: 'Investment committee packets',        href: '/solutions/ic' },
        ],
      },
      {
        heading: 'Featured',
        featured: {
          eyebrow: 'Customer story',
          title: 'How a $400M RIA cut review prep from 90 to 10 minutes',
          href: '/customers/example-ria',
          cta: 'Read the story →',
        },
      },
    ],
  },
  pricing:    { label: 'Pricing',      href: '/pricing' },
}
