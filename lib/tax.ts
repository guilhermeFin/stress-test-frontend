// FastAPI contract:
// POST /api/v1/tax/project          body: TaxInputs    → TaxResult
// GET  /api/v1/tax/tlh/:portfolio_id                   → TLHOpportunity[]
// POST /api/v1/tax/roth             body: RothInputs   → RothResult
// POST /api/v1/tax/location         body: LocationInputs → LocationResult
// POST /api/v1/tax/charitable       body: CharitableInputs → CharitableOption[]

// ── Types ────────────────────────────────────────────────────────────────────

export type FilingStatus = 'single' | 'mfj' | 'mfs' | 'hoh'

export const FILING_LABELS: Record<FilingStatus, string> = {
  single: 'Single',
  mfj:    'Married Filing Jointly',
  mfs:    'Married Filing Separately',
  hoh:    'Head of Household',
}

export interface TaxBracketResult {
  rate: number
  min: number
  max: number
  taxable_in_bracket: number
  tax_in_bracket: number
}

export interface TaxResult {
  agi: number
  taxable_income: number
  ordinary_tax: number
  ltcg_tax: number
  niit: number
  amt: number
  total_tax: number
  effective_rate: number
  marginal_rate: number
  bracket_breakdown: TaxBracketResult[]
  quarterly_payment: number
  bracket_headroom: number
}

export interface TLHOpportunity {
  ticker: string
  name: string
  account_type: 'taxable' | 'ira' | 'roth'
  current_value: number
  cost_basis: number
  unrealized_loss: number
  loss_pct: number
  estimated_tax_savings: number
  wash_sale_risk: boolean
  days_held: number
  suggested_replacement?: string
}

export interface RothConversionYear {
  year: number
  conversion_amount: number
  tax_cost: number
  ira_balance_after: number
  roth_balance_after: number
  marginal_rate_used: number
}

export interface RothResult {
  annual_conversion: number
  total_tax_cost: number
  projected_tax_savings: number
  break_even_years: number
  years: RothConversionYear[]
}

export type AccountType = 'taxable' | 'traditional_ira' | 'roth' | '401k'

export interface AssetLocationRecommendation {
  asset_class: string
  recommended_account: AccountType
  current_account?: AccountType
  reason: string
  efficiency_gain?: number
}

export type CharitableVehicle = 'daf' | 'qcd' | 'direct_stock' | 'crt' | 'private_foundation'

export interface CharitableOption {
  vehicle: CharitableVehicle
  label: string
  charity_receives: number
  tax_deduction: number
  after_tax_cost: number
  income_stream?: number
  setup_complexity: 'low' | 'medium' | 'high'
  minimum_amount: number
  best_for: string
}

// ── 2025 Federal brackets ─────────────────────────────────────────────────────

interface Bracket { min: number; max: number; rate: number }

const ORDINARY_BRACKETS: Record<FilingStatus, Bracket[]> = {
  single: [
    { min: 0,       max: 11_925,  rate: 0.10 },
    { min: 11_925,  max: 48_475,  rate: 0.12 },
    { min: 48_475,  max: 103_350, rate: 0.22 },
    { min: 103_350, max: 197_300, rate: 0.24 },
    { min: 197_300, max: 250_525, rate: 0.32 },
    { min: 250_525, max: 626_350, rate: 0.35 },
    { min: 626_350, max: Infinity, rate: 0.37 },
  ],
  mfj: [
    { min: 0,       max: 23_850,  rate: 0.10 },
    { min: 23_850,  max: 96_950,  rate: 0.12 },
    { min: 96_950,  max: 206_700, rate: 0.22 },
    { min: 206_700, max: 394_600, rate: 0.24 },
    { min: 394_600, max: 501_050, rate: 0.32 },
    { min: 501_050, max: 751_600, rate: 0.35 },
    { min: 751_600, max: Infinity, rate: 0.37 },
  ],
  mfs: [
    { min: 0,       max: 11_925,  rate: 0.10 },
    { min: 11_925,  max: 48_475,  rate: 0.12 },
    { min: 48_475,  max: 103_350, rate: 0.22 },
    { min: 103_350, max: 197_300, rate: 0.24 },
    { min: 197_300, max: 250_525, rate: 0.32 },
    { min: 250_525, max: 375_800, rate: 0.35 },
    { min: 375_800, max: Infinity, rate: 0.37 },
  ],
  hoh: [
    { min: 0,       max: 17_000,  rate: 0.10 },
    { min: 17_000,  max: 64_850,  rate: 0.12 },
    { min: 64_850,  max: 103_350, rate: 0.22 },
    { min: 103_350, max: 197_300, rate: 0.24 },
    { min: 197_300, max: 250_500, rate: 0.32 },
    { min: 250_500, max: 626_350, rate: 0.35 },
    { min: 626_350, max: Infinity, rate: 0.37 },
  ],
}

const LTCG_BRACKETS: Record<FilingStatus, Bracket[]> = {
  single: [
    { min: 0,       max: 48_350,  rate: 0 },
    { min: 48_350,  max: 533_400, rate: 0.15 },
    { min: 533_400, max: Infinity, rate: 0.20 },
  ],
  mfj: [
    { min: 0,       max: 96_700,  rate: 0 },
    { min: 96_700,  max: 600_050, rate: 0.15 },
    { min: 600_050, max: Infinity, rate: 0.20 },
  ],
  mfs: [
    { min: 0,       max: 48_350,  rate: 0 },
    { min: 48_350,  max: 300_000, rate: 0.15 },
    { min: 300_000, max: Infinity, rate: 0.20 },
  ],
  hoh: [
    { min: 0,       max: 64_750,  rate: 0 },
    { min: 64_750,  max: 566_700, rate: 0.15 },
    { min: 566_700, max: Infinity, rate: 0.20 },
  ],
}

export const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 15_000,
  mfj:    30_000,
  mfs:    15_000,
  hoh:    22_500,
}

const NIIT_THRESHOLD: Record<FilingStatus, number> = {
  single: 200_000,
  mfj:    250_000,
  mfs:    125_000,
  hoh:    200_000,
}

const AMT_EXEMPTION: Record<FilingStatus, number> = {
  single: 88_100,
  mfj:    137_000,
  mfs:    68_500,
  hoh:    88_100,
}

const AMT_PHASE_OUT: Record<FilingStatus, number> = {
  single: 626_350,
  mfj:    1_252_700,
  mfs:    626_350,
  hoh:    626_350,
}

// ── Calculation engine ────────────────────────────────────────────────────────

function calcBracketTax(taxable: number, brackets: Bracket[]): { total: number; breakdown: TaxBracketResult[] } {
  let total = 0
  const breakdown: TaxBracketResult[] = []
  for (const b of brackets) {
    if (taxable <= 0) break
    const inBracket = Math.min(taxable, b.max === Infinity ? taxable : b.max - b.min)
    const tax = inBracket * b.rate
    if (inBracket > 0) breakdown.push({ rate: b.rate, min: b.min, max: b.max, taxable_in_bracket: inBracket, tax_in_bracket: tax })
    total += tax
    taxable -= inBracket
  }
  return { total, breakdown }
}

export interface TaxInputs {
  filing_status: FilingStatus
  w2_income: number
  business_income: number
  interest_income: number
  qualified_dividends: number
  short_term_gains: number
  long_term_gains: number
  itemized_deductions: number
  use_itemized: boolean
  state_rate: number
}

export function calculateTax(inputs: TaxInputs): TaxResult {
  const {
    filing_status, w2_income, business_income, interest_income,
    qualified_dividends, short_term_gains, long_term_gains,
    itemized_deductions, use_itemized, state_rate,
  } = inputs

  const ordinary_income = w2_income + business_income + interest_income + short_term_gains
  const investment_income = qualified_dividends + long_term_gains
  const agi = ordinary_income + investment_income

  const deduction = use_itemized
    ? Math.max(itemized_deductions, STANDARD_DEDUCTION[filing_status])
    : STANDARD_DEDUCTION[filing_status]

  const taxable_ordinary = Math.max(0, ordinary_income - deduction)
  const taxable_ltcg     = Math.max(0, investment_income)

  const { total: ordinary_tax, breakdown } = calcBracketTax(taxable_ordinary, ORDINARY_BRACKETS[filing_status])
  const taxable_income = taxable_ordinary + taxable_ltcg

  // LTCG — stacked on top of ordinary income
  const ltcg_base = taxable_ordinary
  let ltcg_tax = 0
  const ltcg_brackets = LTCG_BRACKETS[filing_status]
  let remaining_ltcg = taxable_ltcg
  for (const b of ltcg_brackets) {
    if (remaining_ltcg <= 0) break
    if (ltcg_base >= b.max) continue
    const room = b.max - Math.max(ltcg_base, b.min)
    const taxed = Math.min(remaining_ltcg, room)
    ltcg_tax += taxed * b.rate
    remaining_ltcg -= taxed
  }

  // NIIT
  const niit_threshold = NIIT_THRESHOLD[filing_status]
  const niit = agi > niit_threshold
    ? Math.min(investment_income, agi - niit_threshold) * 0.038
    : 0

  // AMT (simplified — add back standard deduction, no other preferences)
  const amt_exemption_base = AMT_EXEMPTION[filing_status]
  const phase_out_start = AMT_PHASE_OUT[filing_status]
  const amt_income = agi - (use_itemized ? 0 : STANDARD_DEDUCTION[filing_status])
  const phase_out_reduction = Math.max(0, (amt_income - phase_out_start) * 0.25)
  const amt_exemption = Math.max(0, amt_exemption_base - phase_out_reduction)
  const amt_base = Math.max(0, amt_income - amt_exemption)
  const tentative_amt = amt_base <= 232_600 ? amt_base * 0.26 : 232_600 * 0.26 + (amt_base - 232_600) * 0.28
  const amt = Math.max(0, tentative_amt - ordinary_tax)

  const total_tax = ordinary_tax + ltcg_tax + niit + amt

  // Marginal rate
  const last_bracket = breakdown[breakdown.length - 1]
  const marginal_rate = last_bracket?.rate ?? 0.10

  // Bracket headroom (how much more income before next bracket)
  const current_bracket_max = last_bracket?.max ?? Infinity
  const bracket_headroom = current_bracket_max === Infinity ? 0 : current_bracket_max - taxable_ordinary

  return {
    agi,
    taxable_income,
    ordinary_tax,
    ltcg_tax,
    niit,
    amt,
    total_tax,
    effective_rate: agi > 0 ? total_tax / agi : 0,
    marginal_rate,
    bracket_breakdown: breakdown,
    quarterly_payment: total_tax / 4,
    bracket_headroom,
  }
}

// ── Roth conversion math ──────────────────────────────────────────────────────

export interface RothInputs {
  ira_balance: number
  annual_conversion: number
  current_marginal_rate: number
  future_marginal_rate: number
  years_in_retirement: number
  growth_rate: number
  years_to_convert: number
}

export function calculateRoth(inputs: RothInputs): RothResult {
  const { ira_balance, annual_conversion, current_marginal_rate, future_marginal_rate, growth_rate, years_to_convert, years_in_retirement } = inputs

  const years: RothConversionYear[] = []
  let ira_bal = ira_balance
  let roth_bal = 0

  for (let y = 1; y <= Math.min(years_to_convert, 10); y++) {
    const conv = Math.min(annual_conversion, ira_bal)
    const tax = conv * current_marginal_rate
    ira_bal = (ira_bal - conv) * (1 + growth_rate)
    roth_bal = (roth_bal + conv - tax) * (1 + growth_rate)
    years.push({
      year: y,
      conversion_amount: conv,
      tax_cost: tax,
      ira_balance_after: ira_bal,
      roth_balance_after: roth_bal,
      marginal_rate_used: current_marginal_rate,
    })
  }

  const total_tax_cost = years.reduce((s, y) => s + y.tax_cost, 0)
  const future_ira_tax = ira_bal * future_marginal_rate * years_in_retirement * 0.04
  const projected_savings = Math.max(0, future_ira_tax - total_tax_cost)
  const break_even_years = total_tax_cost > 0 ? Math.ceil(total_tax_cost / (projected_savings / years_in_retirement)) : 0

  return { annual_conversion, total_tax_cost, projected_tax_savings: projected_savings, break_even_years, years }
}

// ── Asset location recommendations ───────────────────────────────────────────

export const ASSET_LOCATION_RECS: AssetLocationRecommendation[] = [
  { asset_class: 'US Equity (Growth)', recommended_account: 'roth', reason: 'Tax-free compounding maximizes growth; avoid IRS on appreciation', efficiency_gain: 1.2 },
  { asset_class: 'International Equity', recommended_account: 'taxable', reason: 'Foreign tax credit (FTC) only available in taxable accounts; dividends taxed at LTCG rates', efficiency_gain: 0.8 },
  { asset_class: 'US Equity (Value/Dividend)', recommended_account: 'traditional_ira', reason: 'Defers dividend income; qualified dividends lose LTCG treatment in Roth anyway', efficiency_gain: 0.6 },
  { asset_class: 'Fixed Income / Bonds', recommended_account: 'traditional_ira', reason: 'Interest taxed as ordinary income — defer it; bonds drag Roth compounding less than equities', efficiency_gain: 1.4 },
  { asset_class: 'REITs', recommended_account: 'traditional_ira', reason: 'REIT dividends are non-qualified ordinary income; sheltering them saves 15–37% on distributions', efficiency_gain: 1.8 },
  { asset_class: 'Alternatives (Private)', recommended_account: 'taxable', reason: 'K-1 complexity incompatible with IRAs; unrelated business income (UBTI) triggers IRA tax', efficiency_gain: 0.3 },
  { asset_class: 'Inflation-Protected (TIPS)', recommended_account: 'traditional_ira', reason: 'Phantom income on inflation adjustments taxed as ordinary income — defer it', efficiency_gain: 1.1 },
  { asset_class: 'Small-Cap Equity', recommended_account: 'roth', reason: 'High growth potential; tax-free compounding most valuable for highest-return assets', efficiency_gain: 1.5 },
]

// ── Charitable comparator ────────────────────────────────────────────────────

export interface CharitableInputs {
  donation_amount: number
  asset_type: 'cash' | 'appreciated_stock' | 'ira'
  agi: number
  marginal_rate: number
  ltcg_rate: number
  cost_basis?: number
}

export function calculateCharitable(inputs: CharitableInputs): CharitableOption[] {
  const { donation_amount, asset_type, agi, marginal_rate, ltcg_rate, cost_basis = donation_amount * 0.5 } = inputs
  const gain = donation_amount - cost_basis
  const cap_gains_avoided = asset_type === 'appreciated_stock' ? gain * ltcg_rate : 0
  const agi_limit_60 = agi * 0.6
  const agi_limit_30 = agi * 0.3

  return [
    {
      vehicle: 'daf',
      label: 'Donor-Advised Fund',
      charity_receives: donation_amount,
      tax_deduction: Math.min(donation_amount, asset_type === 'cash' ? agi_limit_60 : agi_limit_30),
      after_tax_cost: donation_amount - Math.min(donation_amount, asset_type === 'cash' ? agi_limit_60 : agi_limit_30) * marginal_rate - cap_gains_avoided,
      setup_complexity: 'low',
      minimum_amount: 5_000,
      best_for: 'Bunching multiple years of giving; appreciated stock donations; grant flexibility',
    },
    {
      vehicle: 'qcd',
      label: 'Qualified Charitable Distribution',
      charity_receives: Math.min(donation_amount, 105_000),
      tax_deduction: 0,
      after_tax_cost: Math.min(donation_amount, 105_000) * (1 - marginal_rate),
      setup_complexity: 'low',
      minimum_amount: 1,
      best_for: 'IRA owners 70½+; satisfies RMD; excludes from AGI entirely',
    },
    {
      vehicle: 'direct_stock',
      label: 'Direct Stock Donation',
      charity_receives: donation_amount,
      tax_deduction: Math.min(donation_amount, agi_limit_30),
      after_tax_cost: donation_amount - Math.min(donation_amount, agi_limit_30) * marginal_rate - cap_gains_avoided,
      setup_complexity: 'low',
      minimum_amount: 1,
      best_for: 'Single large gift of appreciated stock; no setup; charity gets full value',
    },
    {
      vehicle: 'crt',
      label: 'Charitable Remainder Trust',
      charity_receives: donation_amount * 0.5,
      tax_deduction: donation_amount * 0.3,
      after_tax_cost: donation_amount - donation_amount * 0.3 * marginal_rate - cap_gains_avoided,
      income_stream: donation_amount * 0.05,
      setup_complexity: 'high',
      minimum_amount: 250_000,
      best_for: 'Income-producing gift; estate planning; large appreciated assets',
    },
    {
      vehicle: 'private_foundation',
      label: 'Private Foundation',
      charity_receives: donation_amount * 0.95,
      tax_deduction: Math.min(donation_amount, asset_type === 'cash' ? agi_limit_60 : agi_limit_30),
      after_tax_cost: donation_amount - Math.min(donation_amount, agi_limit_60) * marginal_rate,
      setup_complexity: 'high',
      minimum_amount: 1_000_000,
      best_for: 'Dynasty giving; family philanthropy; grantmaking control',
    },
  ]
}

// ── Mock TLH data (pre-backend) ───────────────────────────────────────────────

export const MOCK_TLH_OPPORTUNITIES: TLHOpportunity[] = [
  {
    ticker: 'EFA',  name: 'iShares MSCI EAFE ETF',        account_type: 'taxable',
    current_value: 141_800, cost_basis: 178_500, unrealized_loss: -36_700, loss_pct: -20.6,
    estimated_tax_savings: 8_808, wash_sale_risk: false, days_held: 412,
    suggested_replacement: 'VEA (Vanguard FTSE Developed Markets)',
  },
  {
    ticker: 'AGG',  name: 'iShares Core US Agg Bond ETF',  account_type: 'taxable',
    current_value: 88_200, cost_basis: 102_000, unrealized_loss: -13_800, loss_pct: -13.5,
    estimated_tax_savings: 3_312, wash_sale_risk: false, days_held: 287,
    suggested_replacement: 'BND (Vanguard Total Bond Market)',
  },
  {
    ticker: 'AMZN', name: 'Amazon.com Inc',                account_type: 'taxable',
    current_value: 34_100, cost_basis: 48_600, unrealized_loss: -14_500, loss_pct: -29.8,
    estimated_tax_savings: 3_480, wash_sale_risk: true, days_held: 18,
    suggested_replacement: undefined,
  },
  {
    ticker: 'GDX',  name: 'VanEck Gold Miners ETF',        account_type: 'taxable',
    current_value: 22_400, cost_basis: 29_100, unrealized_loss: -6_700, loss_pct: -23.0,
    estimated_tax_savings: 1_608, wash_sale_risk: false, days_held: 155,
    suggested_replacement: 'GDXJ (Junior Gold Miners)',
  },
]
