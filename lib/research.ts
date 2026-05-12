// FastAPI contract:
// GET  /api/v1/research/macro                      → MacroData
// GET  /api/v1/research/managers                   → Manager[]
// POST /api/v1/research/managers                   → Manager
// PATCH/DELETE /api/v1/research/managers/:id
// GET  /api/v1/presentations                       → Presentation[]
// POST /api/v1/presentations                       → Presentation
// PATCH/DELETE /api/v1/presentations/:id
// POST /api/v1/presentations/:id/export            → { url, expires_at }

// ── Macro types ───────────────────────────────────────────────────────────────

export interface MacroMetric {
  label: string
  value: number
  unit: string
  change: number       // 1-day or 1-week change
  change_unit: string
  direction: 'up' | 'down' | 'neutral'
  description: string
}

export interface YieldPoint { maturity: string; rate: number }

export interface MacroData {
  as_of: string
  yield_curve: YieldPoint[]
  metrics: MacroMetric[]
}

// ── Manager DD types ──────────────────────────────────────────────────────────

export type ManagerRating = 'buy' | 'hold' | 'watch' | 'sell'

export interface Manager {
  id: string
  name: string
  firm: string
  strategy: string
  asset_class: string
  aum_bn: number
  inception_year: number
  expense_ratio: number
  return_1y: number
  return_3y: number
  return_5y: number
  sharpe_3y: number
  max_drawdown: number
  benchmark: string
  rating: ManagerRating
  notes: string
  last_reviewed: string
}

// ── Education slide types ─────────────────────────────────────────────────────

export type SlideCategory =
  | 'investor_archetype'
  | 'asset_class'
  | 'tax'
  | 'estate'
  | 'behavioral'
  | 'macro'

export interface EducationSlide {
  id: string
  title: string
  subtitle: string
  category: SlideCategory
  description: string
  key_takeaways: string[]
  talking_points: string[]
  icon: string
}

// ── Presentation types ────────────────────────────────────────────────────────

export interface PresentationSlide {
  slide_id: string
  order: number
  custom_notes?: string
}

export interface Presentation {
  id: string
  title: string
  household_id?: string
  household_name?: string
  slides: PresentationSlide[]
  created_at: string
  updated_at: string
  share_url?: string
  share_expires?: string
}

// ── Mock macro data (May 2026) ────────────────────────────────────────────────

export const MOCK_MACRO: MacroData = {
  as_of: '2026-05-11',
  yield_curve: [
    { maturity: '1M',  rate: 4.31 },
    { maturity: '3M',  rate: 4.28 },
    { maturity: '6M',  rate: 4.19 },
    { maturity: '1Y',  rate: 4.08 },
    { maturity: '2Y',  rate: 4.12 },
    { maturity: '3Y',  rate: 4.18 },
    { maturity: '5Y',  rate: 4.29 },
    { maturity: '7Y',  rate: 4.38 },
    { maturity: '10Y', rate: 4.48 },
    { maturity: '20Y', rate: 4.64 },
    { maturity: '30Y', rate: 4.71 },
  ],
  metrics: [
    { label: 'S&P 500',           value: 5642,   unit: '',     change: +0.42,  change_unit: '%',   direction: 'up',   description: 'YTD +4.2%' },
    { label: 'VIX',               value: 18.4,   unit: '',     change: -1.2,   change_unit: 'pts', direction: 'down', description: 'Fear gauge below 20 — complacent' },
    { label: 'Fed Funds Rate',     value: 4.375,  unit: '%',    change: 0,      change_unit: 'bps', direction: 'neutral', description: '4.25–4.50% target range' },
    { label: '2Y–10Y Spread',      value: 0.36,   unit: '%',    change: +0.08,  change_unit: '%',   direction: 'up',   description: 'Curve steepening — recession risk receding' },
    { label: 'IG Credit Spread',   value: 98,     unit: 'bps',  change: -4,     change_unit: 'bps', direction: 'down', description: 'Investment grade OAS — tight' },
    { label: 'HY Credit Spread',   value: 342,    unit: 'bps',  change: +12,    change_unit: 'bps', direction: 'up',   description: 'High yield OAS — widening modestly' },
    { label: '5Y5Y Breakeven',     value: 2.28,   unit: '%',    change: +0.04,  change_unit: '%',   direction: 'up',   description: 'Market inflation expectation' },
    { label: 'DXY Dollar Index',   value: 103.2,  unit: '',     change: -0.3,   change_unit: '',    direction: 'down', description: 'Dollar softening YTD' },
    { label: 'WTI Crude Oil',      value: 71.5,   unit: '$',    change: -1.2,   change_unit: '$',   direction: 'down', description: 'Per barrel — supply concerns' },
    { label: 'Gold',               value: 2318,   unit: '$',    change: +8,     change_unit: '$',   direction: 'up',   description: 'Per troy oz — risk-off bid' },
    { label: 'ISM Manufacturing',  value: 49.2,   unit: '',     change: +0.4,   change_unit: 'pts', direction: 'up',   description: 'Below 50 = contraction' },
    { label: '10Y Real Yield',     value: 2.14,   unit: '%',    change: +0.06,  change_unit: '%',   direction: 'up',   description: 'TIPS-implied — restrictive' },
  ],
}

// ── Mock managers ─────────────────────────────────────────────────────────────

export const MOCK_MANAGERS: Manager[] = [
  {
    id: 'm1', name: 'Harbor Growth', firm: 'Harbor Capital', strategy: 'Large Cap Growth',
    asset_class: 'US Equity', aum_bn: 12.4, inception_year: 2008, expense_ratio: 0.65,
    return_1y: 18.2, return_3y: 12.4, return_5y: 14.8, sharpe_3y: 1.12, max_drawdown: -28.4,
    benchmark: 'Russell 1000 Growth', rating: 'buy',
    notes: 'Consistent alpha generation over 5Y. High conviction, low turnover. Manager tenure 15+ years.',
    last_reviewed: '2026-02-15',
  },
  {
    id: 'm2', name: 'Meridian Value', firm: 'Meridian AM', strategy: 'Small Cap Value',
    asset_class: 'US Equity', aum_bn: 3.1, inception_year: 2012, expense_ratio: 0.88,
    return_1y: 8.4, return_3y: 7.2, return_5y: 9.1, sharpe_3y: 0.74, max_drawdown: -34.1,
    benchmark: 'Russell 2000 Value', rating: 'hold',
    notes: 'Solid 5Y track record but recent underperformance vs benchmark on factor headwinds. Watch.',
    last_reviewed: '2026-01-10',
  },
  {
    id: 'm3', name: 'Vanguard Total Bond', firm: 'Vanguard', strategy: 'Core Fixed Income',
    asset_class: 'Fixed Income', aum_bn: 318.0, inception_year: 1986, expense_ratio: 0.03,
    return_1y: 4.8, return_3y: 1.2, return_5y: 2.1, sharpe_3y: 0.41, max_drawdown: -15.2,
    benchmark: 'Bloomberg Agg', rating: 'buy',
    notes: 'Benchmark-hugging. Used as core fixed income sleeve. No alpha expected — keep costs minimal.',
    last_reviewed: '2025-12-01',
  },
  {
    id: 'm4', name: 'Winton Macro', firm: 'Winton Group', strategy: 'Global Macro / CTA',
    asset_class: 'Alternatives', aum_bn: 8.7, inception_year: 1997, expense_ratio: 1.50,
    return_1y: 14.1, return_3y: 6.8, return_5y: 5.4, sharpe_3y: 0.68, max_drawdown: -22.7,
    benchmark: 'HFRX Macro', rating: 'hold',
    notes: 'Good crisis alpha. Expensive. Evaluate if alternatives sleeve is under-utilized.',
    last_reviewed: '2026-03-20',
  },
  {
    id: 'm5', name: 'Artisan Intl Value', firm: 'Artisan Partners', strategy: 'International Value',
    asset_class: 'International Equity', aum_bn: 22.3, inception_year: 2002, expense_ratio: 1.05,
    return_1y: 11.3, return_3y: 9.1, return_5y: 7.8, sharpe_3y: 0.88, max_drawdown: -31.5,
    benchmark: 'MSCI EAFE Value', rating: 'buy',
    notes: 'Strong value discipline. Currency hedged share class available for large accounts.',
    last_reviewed: '2026-04-05',
  },
]

// ── Education slide library ───────────────────────────────────────────────────

export const EDUCATION_SLIDES: EducationSlide[] = [
  {
    id: 'accumulator',
    title: 'The Accumulator',
    subtitle: 'Building wealth during the growth years',
    category: 'investor_archetype',
    description: 'Investors in peak earning years with a long time horizon. Can tolerate short-term volatility in exchange for long-term growth.',
    key_takeaways: [
      'Time is your greatest asset — market downturns are buying opportunities',
      'Dollar-cost averaging smooths entry price over time',
      'Tax-advantaged accounts (401k, Roth IRA) should be maximized first',
    ],
    talking_points: [
      'A 20% decline early in your career means you\'re buying future returns at a discount',
      'The average millionaire\'s portfolio declined 30–40% at least three times on the way to $1M',
      'Your human capital (future earnings) is your largest asset — your portfolio can afford to be aggressive',
    ],
    icon: '📈',
  },
  {
    id: 'retiree',
    title: 'The Retiree',
    subtitle: 'Protecting income in the distribution phase',
    category: 'investor_archetype',
    description: 'Investors drawing down assets for income. Sequence-of-returns risk is the primary concern. Capital preservation and income stability take priority.',
    key_takeaways: [
      'Sequence risk: a bad market in year 1–3 of retirement is more damaging than at year 15',
      'The 4% rule has a 95%+ success rate over 30 years — but a cash buffer is insurance',
      'Bonds provide ballast — short-duration ladders reduce rate sensitivity',
    ],
    talking_points: [
      'Your spending needs for the next 2 years are in cash. The invested portion doesn\'t need to do anything for you right now.',
      'We structured income to come from bonds first — you\'re not selling equities to fund your lifestyle',
      'A 30-year retirement needs growth. Zero equity exposure carries its own risk — running out of money',
    ],
    icon: '🏡',
  },
  {
    id: 'business-owner',
    title: 'The Business Owner',
    subtitle: 'Concentrated wealth and liquidity planning',
    category: 'investor_archetype',
    description: 'Owners whose net worth is concentrated in their business. The business is both asset and income source — liquidity events and succession are central planning priorities.',
    key_takeaways: [
      'Concentration risk: your business and your job are the same asset — diversify early',
      'Qualified Opportunity Zones and installment sales can defer large taxable events',
      'Key-person insurance protects business value and should be reviewed annually',
    ],
    talking_points: [
      'Your business is already a highly leveraged, illiquid, single-stock position. Your investment portfolio should be the opposite.',
      'The day you sell your business, your income stops. We\'re building the portfolio to replace that income stream.',
      'Estate planning now — before the sale — can save millions in estate and gift taxes',
    ],
    icon: '🏢',
  },
  {
    id: 'how-6040-works',
    title: 'How a 60/40 Portfolio Behaves',
    subtitle: 'Asset class primer',
    category: 'asset_class',
    description: 'A deep dive into the classic balanced portfolio — how stocks and bonds interact, where it works, and where it can disappoint.',
    key_takeaways: [
      'Stocks and bonds are negatively correlated in most environments — bonds cushion equity drawdowns',
      '2022 was a rare exception: both fell simultaneously as the Fed raised rates aggressively',
      'Over 20-year periods, 60/40 has never produced a negative real return',
    ],
    talking_points: [
      '60/40 returned negative in 2022 for the first time in 40 years — but it recovered in 2023–24',
      'The correlation between stocks and bonds is not permanent. When inflation normalizes, the hedge returns.',
      'Even after 2022, a client who held 60/40 for 10 years ending 2024 still earned ~7% annually',
    ],
    icon: '⚖️',
  },
  {
    id: 'why-international',
    title: 'Why We Hold International',
    subtitle: 'Asset class primer',
    category: 'asset_class',
    description: 'International equity has underperformed the US for 15 years. Here\'s the case for maintaining global diversification anyway.',
    key_takeaways: [
      'Mean reversion: US vs. international outperformance runs in 10–15 year cycles',
      'International exposure accesses sectors underrepresented in the US (energy, financials, industrials)',
      'Currency diversification reduces home-country bias and USD concentration',
    ],
    talking_points: [
      'US equities trade at 22x earnings; developed international trades at 14x. The valuation gap hasn\'t been this wide since 2000.',
      'The decade of US dominance followed a decade of international dominance (2000–2010). We\'re positioned for the rotation.',
      'Global GDP is 75% non-US. Holding only US stocks is a bet that this continues forever.',
    ],
    icon: '🌍',
  },
  {
    id: 'tlh-explained',
    title: 'Tax-Loss Harvesting Explained',
    subtitle: 'Tax strategy primer',
    category: 'tax',
    description: 'How to turn paper losses into real tax savings — without changing your long-term asset allocation.',
    key_takeaways: [
      'Selling a losing position to realize the loss, then buying a similar (not identical) replacement',
      'The loss offsets gains dollar-for-dollar. Excess losses carry forward indefinitely.',
      'Wash-sale rule: no buying back the same security for 30 days before or after',
    ],
    talking_points: [
      'You\'re not changing your investment thesis — you\'re just moving to a slightly different fund that does the same job',
      'We harvested $38,000 in losses last quarter. At your tax rate, that\'s roughly $9,000 back in your pocket.',
      'Tax-loss harvesting doesn\'t reduce your returns — it reduces the government\'s share of those returns',
    ],
    icon: '🌿',
  },
  {
    id: 'roth-conversion',
    title: 'The Roth Conversion Strategy',
    subtitle: 'Tax strategy primer',
    category: 'tax',
    description: 'Converting pre-tax IRA money to Roth — paying tax now to avoid larger tax bills later, especially if future rates are higher.',
    key_takeaways: [
      'Converts ordinary income tax liability today into tax-free growth forever',
      'Best done in low-income years or when filling lower brackets',
      'RMDs don\'t apply to Roth IRAs — reduces forced income in retirement',
    ],
    talking_points: [
      'You\'re in the 22% bracket now. If RMDs push you to 32% at 73, you paid the IRS more by waiting.',
      'Think of this as pre-paying your tax bill at today\'s price before rates potentially increase.',
      'Your kids inherit a Roth tax-free. They inherit a tIRA and immediately owe income tax on every dollar.',
    ],
    icon: '🔄',
  },
  {
    id: 'revocable-trust',
    title: 'What a Revocable Trust Does',
    subtitle: 'Estate planning primer',
    category: 'estate',
    description: 'The foundational estate planning document — what it does, what it doesn\'t do, and why it\'s not just for the wealthy.',
    key_takeaways: [
      'Avoids probate — assets transfer immediately to heirs without court involvement',
      '"Revocable" means you retain full control during your lifetime',
      'Does NOT protect assets from creditors and does NOT reduce estate taxes by itself',
    ],
    talking_points: [
      'Probate in California takes 12–18 months and costs 4–7% of the estate. A trust bypasses all of that.',
      'The trust becomes irrevocable at death — your successor trustee takes over exactly as you specified.',
      'Even a modest estate benefits: no court fees, no delays, complete privacy (trusts aren\'t public)',
    ],
    icon: '📋',
  },
  {
    id: 'missed-best-days',
    title: 'The Cost of Market Timing',
    subtitle: 'Behavioral finance primer',
    category: 'behavioral',
    description: 'Why trying to avoid the worst days almost always means missing the best days — and why staying invested is the superior strategy.',
    key_takeaways: [
      'The 10 best days of the last 20 years cluster within 2 weeks of the 10 worst days',
      'Missing just the 10 best days cuts a $10,000 investment\'s value roughly in half',
      'The investors who try to time the market lose twice: buying high and selling low',
    ],
    talking_points: [
      'If you were in cash on those 10 best days, you weren\'t safe — you permanently destroyed wealth.',
      'Markets price in bad news fast. The recovery starts before the headlines turn positive.',
      'No one has consistently called market tops and bottoms. The strategy that works is the one you can stick to.',
    ],
    icon: '📊',
  },
  {
    id: 'sequence-of-returns',
    title: 'Sequence-of-Returns Risk',
    subtitle: 'Retirement income primer',
    category: 'investor_archetype',
    description: 'Why the order of returns matters more than the average return — and how a bad early retirement can destroy an otherwise sound plan.',
    key_takeaways: [
      'The same average return produces wildly different outcomes depending on the sequence',
      'A 30% drop in year 1 of retirement is far more damaging than in year 15',
      'Cash buffers and bond ladders are the primary defenses against sequence risk',
    ],
    talking_points: [
      'Two retirees with identical portfolios and identical 7% average returns — if their sequences differ, one runs out of money and the other doesn\'t.',
      'We built a two-year cash buffer specifically so you never sell stocks in a down market to fund lifestyle.',
      'Flexible withdrawal rates — spending a bit less in bad years — is the most powerful sequence-risk tool available',
    ],
    icon: '⏳',
  },
  {
    id: 'yield-curve',
    title: 'Reading the Yield Curve',
    subtitle: 'Macro primer',
    category: 'macro',
    description: 'What the Treasury yield curve tells us about growth expectations, inflation, and recession probability — and how it affects the portfolio.',
    key_takeaways: [
      'Normal curve: long rates > short rates (positive slope) — economy growing normally',
      'Inverted curve: short rates > long rates — historically predicts recession 6–18 months out',
      'Curve steepening after inversion often signals the recession is imminent or underway',
    ],
    talking_points: [
      'The 2Y–10Y spread inverted in 2022 — every US recession since 1970 was preceded by an inversion.',
      'The curve is steepening now. That doesn\'t mean the coast is clear — it often means the recession is arriving.',
      'Your portfolio\'s short-duration bias was positioned for exactly this environment',
    ],
    icon: '📉',
  },
  {
    id: 'alternative-investments',
    title: 'Alternatives: What They Do and Don\'t Do',
    subtitle: 'Asset class primer',
    category: 'asset_class',
    description: 'Private equity, hedge funds, real assets, and CTAs — their role in a diversified portfolio, realistic return expectations, and the liquidity trade-off.',
    key_takeaways: [
      'Alternatives add diversification, not necessarily higher returns',
      'Illiquidity premium is real but requires a 7–10 year lockup — not appropriate for near-term needs',
      'Fees matter: 2-and-20 costs 3–4% in net returns annually at average market returns',
    ],
    talking_points: [
      'Alternative managers that beat public markets net-of-fees are rare. Vetting matters more here than anywhere.',
      'The "Yale Endowment" model works for Yale because they have a 30-year horizon and can handle illiquidity. Most clients can\'t.',
      'If an alternative investment can\'t explain clearly how it makes money — it\'s a fee, not an investment',
    ],
    icon: '🏛️',
  },
]
