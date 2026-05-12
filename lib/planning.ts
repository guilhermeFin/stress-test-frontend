// FastAPI contract:
// GET    /api/v1/planning/ips/:household_id              → IPS
// PUT    /api/v1/planning/ips/:household_id              → IPS
// GET    /api/v1/planning/ips/:household_id/versions     → IPSVersion[]
// GET    /api/v1/planning/goals/:household_id            → Goal[]
// POST   /api/v1/planning/goals/:household_id            → Goal
// PATCH  /api/v1/planning/goals/:id                      → Goal
// DELETE /api/v1/planning/goals/:id
// POST   /api/v1/planning/goals/:id/monte-carlo          → MonteCarloResult
// POST   /api/v1/planning/cashflow/:household_id         → CashFlowProjection[]  (TODO)
// POST   /api/v1/planning/scenarios/:household_id        → ScenarioComparison[]  (TODO — Claude: Sonnet)
// GET    /api/v1/planning/strategies                     → Strategy[]
// POST   /api/v1/planning/strategies/:id/apply           body: { household_id } → IPS

// Skill: financial-plan (wealth-management bundle)
// Step 1 → Household + IPS provides client profile (demographics, accounts, goals)
// Step 2 → POST /planning/cashflow/:household_id  (annual cash flow table — TODO)
// Step 3 → POST /planning/goals/:id/monte-carlo   already implemented (funded ratio, ruin prob)
// Step 4 → Goal types (retirement, college, home, legacy) already modelled in Goal interface
// Step 5 → POST /planning/scenarios/:household_id  (retire-early, market-drop comparisons — TODO, Claude: Sonnet)
// Step 6 → recommendations as Goal-level action items (TODO)
// Step 7 → export via PDF endpoint (TODO)
// Skill ref: C:/Users/guilh/.claude/plugins/cache/claude-for-financial-services/wealth-management/0.1.0/skills/financial-plan/SKILL.md

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://stress-test-backend-production.up.railway.app'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

// ── Types ────────────────────────────────────────────────────────────────────

export type AssetClass = 'us_equity' | 'intl_equity' | 'fixed_income' | 'alternatives' | 'cash'

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  us_equity:    'US Equity',
  intl_equity:  'International Equity',
  fixed_income: 'Fixed Income',
  alternatives: 'Alternatives',
  cash:         'Cash & Equivalents',
}

export const ASSET_CLASS_COLORS: Record<AssetClass, string> = {
  us_equity:    '#3B82F6',
  intl_equity:  '#8B5CF6',
  fixed_income: '#10B981',
  alternatives: '#F59E08',
  cash:         '#6B7280',
}

export type AllocationMap = Record<AssetClass, number>

export interface DriftBand {
  asset_class: AssetClass
  lower: number
  upper: number
}

export type RebalanceTrigger = 'threshold' | 'quarterly' | 'semi_annual' | 'annual'

export interface IPS {
  household_id: string
  version: number
  updated_at: string
  allocation: AllocationMap
  drift_bands: DriftBand[]
  rebalance_trigger: RebalanceTrigger
  horizon_years: number
  risk_tolerance: number
  constraints: string[]
  notes: string
}

export interface IPSVersion {
  version: number
  updated_at: string
  updated_by: string
}

export type GoalType = 'retirement' | 'college' | 'home' | 'legacy' | 'other'

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  retirement: 'Retirement',
  college:    'College Fund',
  home:       'Home Purchase',
  legacy:     'Estate / Legacy',
  other:      'Other Goal',
}

export interface Goal {
  id: string
  household_id: string
  type: GoalType
  label: string
  target_amount: number
  target_date: string
  current_savings: number
  monthly_contribution: number
  expected_return: number
  funded_ratio?: number
  success_rate?: number
  created_at: string
}

export interface MonteCarloResult {
  paths: number
  success_rate: number
  median_outcome: number
  p10_outcome: number
  p90_outcome: number
  ruin_probability: number
  funded_ratio: number
  years: number
  percentile_bands: PercentileBand[]
}

export interface PercentileBand {
  year: number
  p10: number
  p25: number
  p50: number
  p75: number
  p90: number
}

export type RiskProfile = 'conservative' | 'moderate' | 'growth' | 'aggressive'

export interface Strategy {
  id: string
  name: string
  description: string
  risk_profile: RiskProfile
  allocation: AllocationMap
  glidepath?: GlidepathStep[]
  drift_bands: DriftBand[]
  commentary: string
  rebalance_trigger: RebalanceTrigger
  is_builtin: boolean
}

export interface GlidepathStep {
  years_to_target: number
  allocation: AllocationMap
}

// ── Default drift bands ───────────────────────────────────────────────────────

export function defaultDriftBands(allocation: AllocationMap): DriftBand[] {
  return (Object.keys(allocation) as AssetClass[]).map(ac => ({
    asset_class: ac,
    lower: Math.max(0, allocation[ac] - 5),
    upper: allocation[ac] + 5,
  }))
}

// ── Built-in strategies ───────────────────────────────────────────────────────

export const BUILTIN_STRATEGIES: Strategy[] = [
  {
    id: 'conservative-income',
    name: 'Conservative Income',
    description: 'Capital preservation with modest income generation. Suitable for near-retirement or low-risk-tolerance clients.',
    risk_profile: 'conservative',
    allocation: { us_equity: 20, intl_equity: 10, fixed_income: 55, alternatives: 5, cash: 10 },
    drift_bands: [
      { asset_class: 'us_equity', lower: 15, upper: 25 },
      { asset_class: 'intl_equity', lower: 7, upper: 13 },
      { asset_class: 'fixed_income', lower: 50, upper: 60 },
      { asset_class: 'alternatives', lower: 2, upper: 8 },
      { asset_class: 'cash', lower: 7, upper: 13 },
    ],
    commentary: 'Emphasizes high-quality fixed income with limited equity exposure. Designed to generate stable income while protecting principal against significant drawdowns.',
    rebalance_trigger: 'quarterly',
    is_builtin: true,
  },
  {
    id: 'balanced-growth',
    name: 'Balanced Growth',
    description: 'Classic 60/40 adapted for modern markets with an alternatives sleeve.',
    risk_profile: 'moderate',
    allocation: { us_equity: 40, intl_equity: 20, fixed_income: 30, alternatives: 5, cash: 5 },
    drift_bands: [
      { asset_class: 'us_equity', lower: 35, upper: 45 },
      { asset_class: 'intl_equity', lower: 15, upper: 25 },
      { asset_class: 'fixed_income', lower: 25, upper: 35 },
      { asset_class: 'alternatives', lower: 2, upper: 8 },
      { asset_class: 'cash', lower: 3, upper: 8 },
    ],
    commentary: 'A modernized balanced portfolio that maintains the core 60/40 framework while adding a small alternatives sleeve for diversification. Targets long-term real returns of 5–6% annually.',
    rebalance_trigger: 'threshold',
    is_builtin: true,
  },
  {
    id: 'aggressive-growth',
    name: 'Aggressive Growth',
    description: 'Maximum equity exposure for long-horizon clients comfortable with short-term volatility.',
    risk_profile: 'aggressive',
    allocation: { us_equity: 60, intl_equity: 20, fixed_income: 10, alternatives: 7, cash: 3 },
    drift_bands: [
      { asset_class: 'us_equity', lower: 55, upper: 65 },
      { asset_class: 'intl_equity', lower: 15, upper: 25 },
      { asset_class: 'fixed_income', lower: 7, upper: 15 },
      { asset_class: 'alternatives', lower: 4, upper: 10 },
      { asset_class: 'cash', lower: 1, upper: 5 },
    ],
    commentary: 'High equity allocation targeting long-term capital appreciation. Clients should expect 30–40% drawdowns in severe downturns and should have a 10+ year horizon.',
    rebalance_trigger: 'threshold',
    is_builtin: true,
  },
  {
    id: 'all-weather',
    name: 'All-Weather',
    description: 'Risk-parity inspired portfolio designed to perform across all economic environments.',
    risk_profile: 'moderate',
    allocation: { us_equity: 30, intl_equity: 10, fixed_income: 40, alternatives: 15, cash: 5 },
    drift_bands: [
      { asset_class: 'us_equity', lower: 25, upper: 35 },
      { asset_class: 'intl_equity', lower: 7, upper: 15 },
      { asset_class: 'fixed_income', lower: 35, upper: 45 },
      { asset_class: 'alternatives', lower: 10, upper: 20 },
      { asset_class: 'cash', lower: 3, upper: 8 },
    ],
    commentary: 'Inspired by Bridgewater\'s All-Weather framework. Heavy fixed income and alternatives provide ballast during equity drawdowns, while the equity sleeve captures growth in risk-on environments.',
    rebalance_trigger: 'annual',
    is_builtin: true,
  },
  {
    id: 'factor-tilt',
    name: 'Factor Tilt',
    description: 'Evidence-based equity tilt toward value and small-cap factors with international diversification.',
    risk_profile: 'growth',
    allocation: { us_equity: 50, intl_equity: 25, fixed_income: 15, alternatives: 7, cash: 3 },
    drift_bands: [
      { asset_class: 'us_equity', lower: 45, upper: 55 },
      { asset_class: 'intl_equity', lower: 20, upper: 30 },
      { asset_class: 'fixed_income', lower: 12, upper: 20 },
      { asset_class: 'alternatives', lower: 4, upper: 10 },
      { asset_class: 'cash', lower: 1, upper: 5 },
    ],
    commentary: 'Overweights value, small-cap, and international equities based on academic factor research. Higher expected return premium over time, with somewhat higher tracking error vs. a cap-weighted benchmark.',
    rebalance_trigger: 'semi_annual',
    is_builtin: true,
  },
]

// ── API helpers ───────────────────────────────────────────────────────────────

export const getIPS    = (householdId: string) => apiFetch<IPS>(`/api/v1/planning/ips/${householdId}`)
export const saveIPS   = (householdId: string, ips: Omit<IPS, 'household_id' | 'version' | 'updated_at'>) =>
  apiFetch<IPS>(`/api/v1/planning/ips/${householdId}`, { method: 'PUT', body: JSON.stringify(ips) })

export const listGoals  = (householdId: string) => apiFetch<Goal[]>(`/api/v1/planning/goals/${householdId}`)
export const createGoal = (householdId: string, goal: Omit<Goal, 'id' | 'household_id' | 'created_at' | 'funded_ratio' | 'success_rate'>) =>
  apiFetch<Goal>(`/api/v1/planning/goals/${householdId}`, { method: 'POST', body: JSON.stringify(goal) })
export const deleteGoal = (id: string) => apiFetch<void>(`/api/v1/planning/goals/${id}`, { method: 'DELETE' })
export const runMonteCarlo = (goalId: string, paths = 1000) =>
  apiFetch<MonteCarloResult>(`/api/v1/planning/goals/${goalId}/monte-carlo`, {
    method: 'POST',
    body: JSON.stringify({ paths }),
  })

// ── Client-side Monte Carlo (used before backend is wired) ───────────────────
// Simulates log-normal monthly returns for N paths over the goal horizon.

export function runClientMonteCarlo(goal: Goal, paths = 1000): MonteCarloResult {
  const months = Math.max(1,
    (new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))
  const years  = months / 12
  const annualVol = 0.15  // ~15% annualised vol for a diversified balanced portfolio; independent of return
  const sigma = annualVol / Math.sqrt(12)
  const mu    = (goal.expected_return - 0.5 * annualVol * annualVol) / 12  // Itô drift correction

  const finals: number[] = []
  const bands: PercentileBand[] = []

  const yearlySnapshots: number[][] = Array.from({ length: Math.ceil(years) }, () => [])

  for (let p = 0; p < paths; p++) {
    let v = goal.current_savings
    for (let m = 0; m < Math.ceil(months); m++) {
      const r = mu + sigma * gaussRandom()
      v = v * (1 + r) + goal.monthly_contribution
      if ((m + 1) % 12 === 0) {
        const yr = Math.floor(m / 12)
        if (yr < yearlySnapshots.length) yearlySnapshots[yr].push(v)
      }
    }
    finals.push(v)
  }

  finals.sort((a, b) => a - b)

  for (let y = 0; y < yearlySnapshots.length; y++) {
    const s = yearlySnapshots[y].slice().sort((a, b) => a - b)
    if (s.length === 0) continue
    bands.push({
      year: y + 1,
      p10: pct(s, 10),
      p25: pct(s, 25),
      p50: pct(s, 50),
      p75: pct(s, 75),
      p90: pct(s, 90),
    })
  }

  const success = finals.filter(v => v >= goal.target_amount).length
  const median  = pct(finals, 50)

  return {
    paths,
    success_rate:    success / paths,
    median_outcome:  median,
    p10_outcome:     pct(finals, 10),
    p90_outcome:     pct(finals, 90),
    ruin_probability: finals.filter(v => v <= 0).length / paths,
    funded_ratio:     median / goal.target_amount,
    years,
    percentile_bands: bands,
  }
}

function pct(sorted: number[], p: number) {
  const i = Math.max(0, Math.floor((p / 100) * sorted.length) - 1)
  return sorted[i] ?? 0
}

function gaussRandom() {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
