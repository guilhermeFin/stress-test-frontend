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

  // ── Investor Archetypes ───────────────────────────────────────────────────
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
    id: 'beneficiary',
    title: 'The Inheritor',
    subtitle: 'Managing sudden wealth responsibly',
    category: 'investor_archetype',
    description: 'Clients who received a significant inheritance or windfall. Common mistakes include moving too fast, over-concentrating, or letting guilt drive poor decisions.',
    key_takeaways: [
      'The first rule of inherited wealth: do nothing for 90 days',
      'Inherited IRAs have a 10-year depletion rule — timing withdrawals to manage tax brackets is critical',
      'A sudden wealth event is also a grief event — financial decisions should wait until emotional stability returns',
    ],
    talking_points: [
      'This money came with responsibility attached. The best thing we can do now is slow down and make sure it lasts.',
      'You\'ll owe income tax on every dollar you take out of the inherited IRA. The question is whether we take it in your 22% bracket or your 37% bracket.',
      'There is no urgency to invest a windfall all at once. A 12-month dollar-cost-averaging plan removes the timing pressure entirely.',
    ],
    icon: '🎗️',
  },
  {
    id: 'widowed-divorced',
    title: 'The Newly Single Client',
    subtitle: 'Financial reset after a major life transition',
    category: 'investor_archetype',
    description: 'Clients recently widowed or divorced who are taking financial control for the first time. A mix of urgent decisions and long-term restructuring is needed.',
    key_takeaways: [
      'Update all beneficiary designations immediately — they override any will',
      'Social Security survivor or divorced-spouse benefits have filing deadlines',
      'New budget reality: one income, same fixed costs — the plan needs to be rebuilt from scratch',
    ],
    talking_points: [
      'The most important thing right now isn\'t investment returns — it\'s making sure the right people inherit the right accounts.',
      'You may be entitled to a larger Social Security benefit based on your spouse\'s record. That\'s real money and we should file correctly.',
      'You\'ve never had to manage this alone. We\'re going to go through everything together, at your pace.',
    ],
    icon: '🌱',
  },
  {
    id: 'pre-retiree',
    title: 'The Pre-Retiree',
    subtitle: 'The decade before retirement is the most critical',
    category: 'investor_archetype',
    description: 'Clients within 10 years of retirement. The transition from accumulation to distribution requires a complete portfolio rethink — the stakes are highest here.',
    key_takeaways: [
      'The final decade determines retirement readiness more than any prior decade',
      'Roth conversions and tax bracket management are most impactful now, before RMDs force income',
      'Healthcare is the single largest underestimated retirement expense — plan for $300K+ lifetime',
    ],
    talking_points: [
      'You\'re in the preparation window. Decisions made in the next 5–7 years will define your retirement income for 30 years.',
      'We need to start derisking the portfolio gradually — not all at once, but on a glide path.',
      'Medicare starts at 65. If you retire before that, bridging healthcare costs $1,000–$2,000/month. That has to be in the plan.',
    ],
    icon: '🏁',
  },

  // ── Asset Classes ─────────────────────────────────────────────────────────
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
  {
    id: 'bonds-explained',
    title: 'How Bonds Work',
    subtitle: 'Fixed income primer',
    category: 'asset_class',
    description: 'Bonds confuse even experienced investors. This slide demystifies price, yield, duration, and credit risk in plain language your clients will actually retain.',
    key_takeaways: [
      'Bond prices move opposite to interest rates — when rates rise, existing bond prices fall',
      'Duration measures interest rate sensitivity: a 7-year duration bond falls ~7% per 1% rate rise',
      'Credit spread = the extra yield you earn for taking default risk over Treasuries',
    ],
    talking_points: [
      'You didn\'t lose money on your bonds because the company failed — you lost because interest rates rose. The bonds will return to par at maturity.',
      'We hold short-duration bonds specifically because they\'re less sensitive to rate moves. That\'s not a coincidence.',
      'The bond market is twice the size of the stock market. It tells us things the stock market doesn\'t.',
    ],
    icon: '🏦',
  },
  {
    id: 'reits-explained',
    title: 'Real Estate Through REITs',
    subtitle: 'Asset class primer',
    category: 'asset_class',
    description: 'How publicly traded REITs give clients real estate exposure without landlord headaches — and how they differ from owning property directly.',
    key_takeaways: [
      'REITs must distribute 90%+ of taxable income — built-in income stream',
      'Publicly traded REITs are highly liquid unlike direct real estate',
      'Rate-sensitive: REITs often fall when rates rise (like bonds) but recover as income grows',
    ],
    talking_points: [
      'This gives you the real estate income you want without a tenant calling at midnight or a roof that needs replacing.',
      'REITs are not a substitute for bonds — they\'re equity with income characteristics. Don\'t confuse the two.',
      'Historically, REITs have delivered equity-like returns with above-average dividend income — a combination most clients find compelling.',
    ],
    icon: '🏗️',
  },
  {
    id: 'gold-commodities',
    title: 'Gold & Commodities in a Portfolio',
    subtitle: 'Asset class primer',
    category: 'asset_class',
    description: 'The role of hard assets as an inflation hedge, crisis refuge, and portfolio diversifier — and why the allocation size matters as much as the decision to own them.',
    key_takeaways: [
      'Gold has a near-zero correlation to equities over long periods — pure diversification',
      'Commodities are a real inflation hedge; stocks and bonds are not in the short term',
      'Position size: 5–10% is meaningful diversification; more than 15% becomes a speculative bet',
    ],
    talking_points: [
      'Gold doesn\'t pay interest or dividends. Its job is to hold value when everything else is falling. It\'s insurance, not an investment.',
      'In 2022, when bonds and stocks both fell double digits, commodities rose 25%. That\'s the diversification argument in one year.',
      'We\'re not predicting inflation. We\'re buying a small insurance policy against a scenario where every other asset disappoints.',
    ],
    icon: '🥇',
  },
  {
    id: 'factor-investing',
    title: 'Factor Investing Explained',
    subtitle: 'Asset class primer',
    category: 'asset_class',
    description: 'Value, size, momentum, quality, and low volatility — the systematic risk factors that have historically driven excess returns and how to access them cheaply.',
    key_takeaways: [
      'Factor premiums are real but cyclical — value underperformed for a decade before 2022',
      'Smart beta ETFs give factor exposure at low cost (often 0.10–0.25% vs. 1%+ for active)',
      'Combining uncorrelated factors (e.g., value + momentum) reduces drawdowns',
    ],
    talking_points: [
      'This is what quant funds charge 2-and-20 to deliver. We can access the same factors for 0.15% in an ETF.',
      'Value looked dead from 2010 to 2020. Anyone who abandoned it missed one of the strongest value recoveries in history in 2021–22.',
      'We\'re not picking stocks — we\'re tilting toward characteristics that have been rewarded over 100 years of data.',
    ],
    icon: '🔬',
  },

  // ── Tax Strategies ────────────────────────────────────────────────────────
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
    id: 'asset-location',
    title: 'Asset Location: Where to Hold What',
    subtitle: 'Tax strategy primer',
    category: 'tax',
    description: 'Putting the right investments in the right account types — tax-deferred, Roth, or taxable — to minimize lifetime tax drag without changing the overall allocation.',
    key_takeaways: [
      'Tax-deferred (IRA/401k): best for bonds and REITs that generate ordinary income',
      'Roth: best for highest-growth assets — gains compound and distribute tax-free',
      'Taxable: best for tax-efficient equity (index funds, ETFs) and municipal bonds',
    ],
    talking_points: [
      'Your allocation is the same — 60% stocks, 40% bonds — but where we hold them cuts your annual tax bill by an estimated $4,000.',
      'A bond fund in a taxable account turns its interest income into an annual tax event. In your IRA, you defer that entirely.',
      'We review account location every year because your balances, income, and tax situation all change.',
    ],
    icon: '🗂️',
  },
  {
    id: 'charitable-giving',
    title: 'Charitable Giving: DAF, QCD & Direct Stock',
    subtitle: 'Tax strategy primer',
    category: 'tax',
    description: 'Three giving strategies that maximize impact while minimizing taxes — Donor-Advised Funds, Qualified Charitable Distributions, and donating appreciated stock.',
    key_takeaways: [
      'Donating appreciated stock avoids capital gains AND gets a full deduction — double benefit',
      'QCDs satisfy RMDs without adding to taxable income — only available at age 70½+',
      'DAF: bunch deductions into one year for itemizing, then grant to charities over time',
    ],
    talking_points: [
      'If you sell that Apple stock and then donate the cash, you owe capital gains first. If you donate the stock directly, you skip that entirely.',
      'Your RMD this year is $42,000. If you give $25,000 to charity as a QCD, that $25,000 never hits your income at all.',
      'The DAF is like a charitable checking account. Fund it in a high-income year, take the deduction now, distribute to charities over 10 years.',
    ],
    icon: '💝',
  },
  {
    id: 'rmds-explained',
    title: 'Required Minimum Distributions',
    subtitle: 'Tax strategy primer',
    category: 'tax',
    description: 'The IRS forces withdrawals from tax-deferred accounts starting at age 73. Failing to plan turns RMDs into your largest annual tax bill.',
    key_takeaways: [
      'RMDs begin at age 73 (SECURE 2.0); the amount is based on the prior year-end balance divided by an IRS life expectancy factor',
      'Missed RMDs carry a 25% penalty on the amount not taken',
      'RMDs stack on top of Social Security and other income — often pushing retirees into higher brackets',
    ],
    talking_points: [
      'At current IRA balances, your RMD at 73 will be roughly $58,000. Added to Social Security and pension, that puts 85% of your SS into taxable income.',
      'Every dollar we convert to Roth today is a dollar that will never be subject to an RMD.',
      'RMDs are not optional. But when to take them within the year, which account to draw from, and how to deploy the proceeds — those are all planning decisions.',
    ],
    icon: '📅',
  },
  {
    id: 'niit-cap-gains',
    title: 'Capital Gains & the Net Investment Income Tax',
    subtitle: 'Tax strategy primer',
    category: 'tax',
    description: 'Long-term capital gains are taxed preferentially — but add them to ordinary income and you can trigger the NIIT surcharge and bracket creep. Timing matters.',
    key_takeaways: [
      'Long-term gains are taxed at 0%, 15%, or 20% depending on total income',
      'NIIT adds 3.8% surcharge on investment income above $200K (single) / $250K (married)',
      'Harvesting gains in low-income years locks in the 0% or 15% rate forever',
    ],
    talking_points: [
      'You\'re in the 15% capital gains bracket this year. If we do nothing, a large bonus next year could push you to 20% plus NIIT — a 8.8% difference.',
      'Realizing gains intentionally in low-income years is called gain harvesting — the opposite of loss harvesting, and equally powerful.',
      'We review your projected income every December specifically to decide whether to realize or defer gains.',
    ],
    icon: '💰',
  },

  // ── Estate Planning ───────────────────────────────────────────────────────
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
    id: 'beneficiary-audit',
    title: 'The Beneficiary Audit',
    subtitle: 'Estate planning primer',
    category: 'estate',
    description: 'Beneficiary designations on IRAs, 401ks, and insurance policies override your will entirely. A 30-minute audit can prevent years of family conflict.',
    key_takeaways: [
      'Beneficiary designations override your will — they are legally supreme',
      'An ex-spouse listed on a 401k will inherit it regardless of a later divorce decree',
      'Contingent beneficiaries are as important as primary — what happens if your beneficiary dies first?',
    ],
    talking_points: [
      'The most common estate planning mistake I see isn\'t missing a will — it\'s a 20-year-old beneficiary form that hasn\'t been updated since a divorce.',
      'A beneficiary designation takes 10 minutes to update. A court battle over a contested estate takes 3 years.',
      'We recommend reviewing all designations after any major life event: marriage, divorce, birth, death.',
    ],
    icon: '✅',
  },
  {
    id: 'irrevocable-life-insurance-trust',
    title: 'The ILIT: Life Insurance Outside Your Estate',
    subtitle: 'Estate planning primer',
    category: 'estate',
    description: 'An Irrevocable Life Insurance Trust removes life insurance proceeds from your taxable estate — a critical tool for estates above the federal exemption.',
    key_takeaways: [
      'Life insurance owned by the deceased is included in their taxable estate',
      'An ILIT owns the policy — proceeds pass to heirs estate-tax-free',
      'Crummey notices allow premium payments as annual exclusion gifts',
    ],
    talking_points: [
      'Your $5M life insurance policy is currently inside your estate. At current exemption levels, that could generate a $2M estate tax bill for your heirs.',
      'The ILIT is irrevocable — you give up control, but you give up the tax problem too.',
      'This is not exotic planning. For estates above $5M, the ILIT is standard practice.',
    ],
    icon: '🛡️',
  },
  {
    id: 'gifting-strategy',
    title: 'Lifetime Gifting Strategy',
    subtitle: 'Estate planning primer',
    category: 'estate',
    description: 'The annual gift exclusion and lifetime exemption are powerful tools for reducing a taxable estate — but timing and structure matter.',
    key_takeaways: [
      'Annual exclusion: $18,000 per recipient per year, zero tax, zero forms',
      'Lifetime exemption: $13.6M per person (2024), indexed to inflation — use it before legislation reduces it',
      'Direct payments for tuition and medical expenses are excluded entirely — not subject to gift tax',
    ],
    talking_points: [
      'You and your spouse can give $36,000 to each child, each grandchild, and each spouse of a child this year — all tax-free, no forms.',
      'The 2017 Tax Cuts and Jobs Act doubled the exemption. When it sunsets in 2026, the exemption may drop by half. The window to act is now.',
      'Paying your grandchild\'s tuition directly to the university doesn\'t count against the annual exclusion at all. That\'s often the single most efficient gift.',
    ],
    icon: '🎁',
  },
  {
    id: 'power-of-attorney',
    title: 'Powers of Attorney & Healthcare Directives',
    subtitle: 'Estate planning primer',
    category: 'estate',
    description: 'Who makes decisions if you can\'t? Durable POA and healthcare directives are the documents that prevent family paralysis and court-ordered guardianship.',
    key_takeaways: [
      'Durable POA: designates someone to manage financial affairs if you\'re incapacitated',
      'Healthcare proxy / MPOA: designates someone to make medical decisions',
      'Living will: specifies your wishes on end-of-life care — removes guesswork from family',
    ],
    talking_points: [
      'Without a durable POA, your family has to go to court to manage your finances if you become incapacitated. That takes months and costs thousands.',
      'Your spouse cannot automatically act on your behalf financially — they need either joint ownership or a POA.',
      'This is not a document about dying. It\'s a document about making sure someone you trust can pay your bills if you get sick.',
    ],
    icon: '📝',
  },

  // ── Behavioral Finance ────────────────────────────────────────────────────
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
    id: 'drawdown-in-dollars',
    title: 'What a Drawdown Looks Like in Dollars',
    subtitle: 'Behavioral finance primer',
    category: 'behavioral',
    description: 'Percentages don\'t scare people — dollars do. This slide translates market drawdowns into portfolio dollar amounts to prepare clients emotionally before a crisis hits.',
    key_takeaways: [
      'A 30% market decline on a $2M portfolio is a $600,000 paper loss',
      'Every major market crash has fully recovered — the average recovery time is 2.5 years',
      'Investors who sell during a crash lock in the loss permanently',
    ],
    talking_points: [
      'I want to show you what 2008 would have looked like in your account — not to scare you, but so that if it happens again, you\'ve already seen it.',
      'Your portfolio is built to survive a 40% decline without you having to sell anything. The cash buffer is specifically for that.',
      'The clients who called me in March 2020 to sell everything — most of them locked in permanent losses and missed a 100% recovery in 18 months.',
    ],
    icon: '💸',
  },
  {
    id: 'loss-aversion',
    title: 'Loss Aversion: Why Losses Hurt Twice as Much',
    subtitle: 'Behavioral finance primer',
    category: 'behavioral',
    description: 'Kahneman and Tversky proved that losses feel approximately twice as painful as equivalent gains feel good. Understanding this wiring is the first step to overcoming it.',
    key_takeaways: [
      'Loss aversion causes investors to sell at bottoms and hold losers too long (disposition effect)',
      'Paper losses feel real even when nothing has changed about the underlying investment',
      'The antidote: pre-commitment — agree on the plan before the market moves',
    ],
    talking_points: [
      'Your brain is wired to treat a $50,000 loss as twice as painful as a $50,000 gain is pleasurable. That\'s not rational — but it\'s human.',
      'We wrote down your plan when you were calm. That plan is what I\'m going to point to when you\'re not.',
      'The reason we rebalance on a schedule — not based on feelings — is precisely to remove your brain\'s wiring from the equation.',
    ],
    icon: '🧠',
  },
  {
    id: 'recency-bias',
    title: 'Recency Bias: Why Today Feels Like Forever',
    subtitle: 'Behavioral finance primer',
    category: 'behavioral',
    description: 'We overweight recent experience and project it indefinitely into the future. Recency bias is why clients want to sell at bottoms and buy at tops.',
    key_takeaways: [
      'After a bull market, investors overestimate future returns and take too much risk',
      'After a crash, investors overestimate future losses and take too little risk',
      'The correct response to both is the same: stay with the plan',
    ],
    talking_points: [
      'In 2021, every client wanted more tech stocks. In 2022, everyone wanted to know when we were getting out. The market didn\'t change — the mood did.',
      'The data covering 100 years says long-term equity returns are around 7% real. Nothing that happened last quarter changes that.',
      'I\'m going to ask you to do the hardest thing in investing: decide what you believe when things are calm, and then stick to it when things aren\'t.',
    ],
    icon: '🔮',
  },
  {
    id: 'anchoring',
    title: 'Anchoring: The Price You Paid vs. the Price Today',
    subtitle: 'Behavioral finance primer',
    category: 'behavioral',
    description: 'Investors anchor to the price they paid and wait to "break even" — a cognitive error that costs real returns over time.',
    key_takeaways: [
      'The market doesn\'t know what you paid — your purchase price is irrelevant to future performance',
      '"Waiting to break even" is an opportunity cost — better alternatives may be available now',
      'Tax-loss harvesting turns the anchoring trap into an advantage',
    ],
    talking_points: [
      'Your cost basis is your tax story — it\'s not your investment story. The stock doesn\'t know you\'re waiting for it to come back.',
      'If you wouldn\'t buy this position today at this price, the question is why you\'re holding it.',
      'Selling at a loss feels like losing. But if we reinvest in a better position, the loss was actually the right decision.',
    ],
    icon: '⚓',
  },
  {
    id: 'panic-mode-script',
    title: 'What to Say When a Client Panics',
    subtitle: 'Advisor script primer',
    category: 'behavioral',
    description: 'A structured framework for client conversations during market crises — how to acknowledge fear, provide context, and redirect to the plan without dismissing emotions.',
    key_takeaways: [
      'Step 1: Acknowledge — validate the emotion before providing data',
      'Step 2: Contextualize — put the current decline in historical perspective',
      'Step 3: Redirect — bring the conversation back to their goals, not the market',
    ],
    talking_points: [
      '"I completely understand why this feels alarming. Let me show you exactly what your portfolio looks like right now and what our plan says to do."',
      '"Every decline in history has recovered. The only investors who didn\'t participate in the recovery were the ones who sold."',
      '"Your income for the next two years doesn\'t come from the market. You don\'t need to make any decisions today."',
    ],
    icon: '🗣️',
  },

  // ── Macro & Markets ───────────────────────────────────────────────────────
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
    id: 'inflation-primer',
    title: 'Inflation: What It Is and What Survives It',
    subtitle: 'Macro primer',
    category: 'macro',
    description: 'Inflation erodes purchasing power silently. Understanding which assets protect against it — and which don\'t — is essential for long-term planning.',
    key_takeaways: [
      'Real assets (real estate, commodities, TIPS) are direct inflation hedges',
      'Cash and fixed-rate bonds lose real value in high-inflation environments',
      'Equities are a partial inflation hedge — companies can raise prices, but earnings compress in the short run',
    ],
    talking_points: [
      '$100,000 in cash earning 2% in an environment with 6% inflation loses $4,000 of real purchasing power per year.',
      'The 2022 inflation spike was the first time in 40 years that bonds failed to protect portfolios. We\'ve adjusted our fixed income structure as a result.',
      'Your spending needs are in real dollars — your groceries, healthcare, and travel will all cost more. The portfolio has to grow faster than your spending.',
    ],
    icon: '🔥',
  },
  {
    id: 'fed-policy',
    title: 'How the Fed Affects Your Portfolio',
    subtitle: 'Macro primer',
    category: 'macro',
    description: 'The Federal Reserve sets the price of money — and every asset class has a view on it. Here\'s how to translate Fed policy into portfolio implications.',
    key_takeaways: [
      'Fed raises rates: bonds fall, growth stocks fall, dollar strengthens, REITs fall',
      'Fed cuts rates: bonds rise, growth recovers, dollar weakens, risk assets rally',
      'Markets price Fed decisions months in advance — what matters is the surprise, not the move',
    ],
    talking_points: [
      'The Fed doesn\'t control the stock market — but the stock market is obsessed with the Fed. Short-term volatility around Fed meetings is mostly noise.',
      'Your bond portfolio\'s duration is short specifically because we anticipated Fed rate hikes. That positioning worked.',
      'When the Fed pivots to cutting, long-duration bonds tend to rally sharply. We\'ll look at extending duration when that signal is clearer.',
    ],
    icon: '🏛️',
  },
  {
    id: 'credit-spreads',
    title: 'What Credit Spreads Tell Us',
    subtitle: 'Macro primer',
    category: 'macro',
    description: 'Credit spreads — the extra yield corporate bonds pay over Treasuries — are one of the most reliable leading indicators of economic stress.',
    key_takeaways: [
      'Tight spreads (< 100bps IG, < 350bps HY): market is calm, credit risk is priced low',
      'Widening spreads: investors demanding more compensation for default risk — a warning signal',
      'Spreads often widen before recessions and tighten dramatically in early recovery',
    ],
    talking_points: [
      'Investment grade spreads are near historic lows. That means corporate bonds are expensive — there\'s limited upside and real downside if economic conditions deteriorate.',
      'In 2008, high yield spreads hit 2,000 basis points. Today they\'re around 350. The credit market is not pricing in stress.',
      'We watch spreads weekly as part of our risk monitoring. When they start moving, we move.',
    ],
    icon: '📡',
  },
  {
    id: 'dollar-currency',
    title: 'The Dollar, Currency Risk & Your Portfolio',
    subtitle: 'Macro primer',
    category: 'macro',
    description: 'A strong dollar hurts international stock returns for US investors — but currency diversification provides long-run benefits that outweigh short-term headwinds.',
    key_takeaways: [
      'When the dollar strengthens, international stock returns (in USD) are reduced',
      'Currency hedging eliminates the FX impact but costs 1–2% annually in hedging fees',
      'Over 20-year periods, currency effects largely cancel out — long-run allocation matters more',
    ],
    talking_points: [
      'Your international holdings were up 12% in local currency last year — but only 8% in dollars because the euro weakened. That\'s currency drag.',
      'We don\'t hedge currency for most clients because the 20-year data shows it costs more in fees than it saves in volatility.',
      'A weaker dollar is actually a tailwind for international stocks. When the Fed cuts rates, the dollar typically weakens — which could benefit your international allocation.',
    ],
    icon: '💱',
  },
]
