// FastAPI contract:
// GET    /api/v1/households                    → Household[]
// POST   /api/v1/households                    → Household
// GET    /api/v1/households/:id                → Household
// PATCH  /api/v1/households/:id                → Household
// DELETE /api/v1/households/:id
// GET    /api/v1/households/:id/portfolios     → Portfolio[]
// GET    /api/v1/households/:id/timeline       → TimelineEvent[]
// POST   /api/v1/households/:id/review         → ClientReviewPacket  (TODO — Claude: Sonnet)
// POST   /api/v1/households/:id/proposal       → InvestmentProposal  (TODO — Claude: Sonnet)
// GET    /api/v1/dashboard                     → DashboardData
// GET    /api/v1/inbox                         → InboxItem[]
// PATCH  /api/v1/inbox/:id                     → InboxItem  (action: dismiss|snooze|assign)

// Skill: client-review (wealth-management bundle)
// Step 1 → GET /households/:id  (client context, AUM, risk profile, last meeting date)
// Step 2 → GET /households/:id/portfolios  (performance vs benchmark — needs return series TODO)
// Step 3 → DriftAlert in DashboardData already provides allocation drift
// Step 4 → POST /households/:id/review  generates talking points via Claude Sonnet (endpoint TODO)
// Step 5 → recommendations surface as InboxItem + RecommendedAction (rebalance, harvest, etc.)
// Step 6 → output: one-page PDF via /households/:id/review?format=pdf (TODO)
// Skill ref: C:/Users/guilh/.claude/plugins/cache/claude-for-financial-services/wealth-management/0.1.0/skills/client-review/SKILL.md

// Skill: investment-proposal (wealth-management bundle)
// Step 1 → prospect context gathered on households creation (risk_profile, goals, tags)
// Step 2–3 → POST /households/:id/proposal  drafts strategy + allocation table via Claude Sonnet (TODO)
// Step 4 → runClientMonteCarlo() in planning.ts covers expected outcomes
// Skill ref: C:/Users/guilh/.claude/plugins/cache/claude-for-financial-services/wealth-management/0.1.0/skills/investment-proposal/SKILL.md

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

export type RiskProfile = 'conservative' | 'moderate' | 'growth' | 'aggressive'

export interface HouseholdMember {
  id: string
  name: string
  role: 'primary' | 'spouse' | 'dependent' | 'beneficiary'
  dob?: string
}

export interface Goal {
  id: string
  type: 'retirement' | 'college' | 'home' | 'legacy' | 'other'
  label: string
  target_amount: number
  target_date: string
  funded_ratio?: number
}

export interface Household {
  id: string
  firm_id: string
  name: string
  risk_profile: RiskProfile
  advisor_id?: string
  aum?: number
  portfolio_count: number
  members: HouseholdMember[]
  goals: Goal[]
  created_at: string
  last_activity_at?: string
  alert_count?: number
  ytd_return?: number
  tags?: string[]
}

export type AlertType = 'drift' | 'plan_checkin' | 'rmd' | 'market' | 'life_event' | 'run_complete'

export interface InboxItem {
  id: string
  household_id?: string
  household_name?: string
  type: AlertType
  title: string
  body: string
  severity: 'info' | 'warning' | 'critical'
  status: 'unread' | 'read' | 'snoozed' | 'dismissed'
  created_at: string
  snoozed_until?: string
  assigned_to?: string
  action_url?: string
}

export interface TopMover {
  ticker: string
  name: string
  change_pct: number
  household_name: string
  household_id: string
}

export interface DriftAlert {
  household_id: string
  household_name: string
  portfolio_id: string
  asset_class: string
  current_weight: number
  target_weight: number
  drift_pct: number
}

export interface DashboardData {
  total_aum: number
  aum_change_1d: number
  household_count: number
  active_alerts: number
  top_movers: TopMover[]
  drift_alerts: DriftAlert[]
  recent_runs: RecentRun[]
  inbox_preview: InboxItem[]
}

export interface RecentRun {
  run_id: string
  portfolio_name: string
  household_name?: string
  scenario: string
  health_score: number
  created_at: string
}

// ── API helpers ──────────────────────────────────────────────────────────────

export const listHouseholds = () => apiFetch<Household[]>('/api/v1/households')
export const getHousehold   = (id: string) => apiFetch<Household>(`/api/v1/households/${id}`)

export const listInbox = () => apiFetch<InboxItem[]>('/api/v1/inbox')

export const patchInboxItem = (id: string, action: 'dismiss' | 'read' | 'snooze', snoozeUntil?: string) =>
  apiFetch<InboxItem>(`/api/v1/inbox/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ action, snooze_until: snoozeUntil }),
  })

export const getDashboard = () => apiFetch<DashboardData>('/api/v1/dashboard')
