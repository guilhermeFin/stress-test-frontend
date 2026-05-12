/**
 * Client for the portfolio & run history API.
 *
 * FastAPI contract (backend to implement):
 *   GET    /api/v1/portfolios               → Portfolio[]
 *   POST   /api/v1/portfolios               → Portfolio   body: { name, holdings_json, scenario }
 *   GET    /api/v1/portfolios/:id           → Portfolio
 *   DELETE /api/v1/portfolios/:id           → 204
 *   GET    /api/v1/portfolios/:id/runs      → StressRun[]
 *   POST   /api/v1/portfolios/:id/runs      → StressRun   body: { scenario, results_json }
 *   GET    /api/v1/runs/:id                 → StressRun
 *   PATCH  /api/v1/runs/:id/actions/:aid    → RecommendedAction   body: { status }
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export interface Portfolio {
  id: string
  firm_id: string
  name: string
  holdings_json: unknown
  created_at: string
  last_run_at: string | null
  run_count: number
}

export interface RecommendedAction {
  id: string
  kind: 'rebalance' | 'harvest' | 'hedge' | 'raise_cash' | 'client_call'
  title: string
  detail: string
  status: 'todo' | 'done' | 'dismissed'
  due_at: string | null
  assignee_id: string | null
}

export interface StressRun {
  id: string
  portfolio_id: string
  scenario: string
  status: 'completed' | 'failed'
  health_score: number
  total_loss_pct: number
  severity_label: string
  portfolio_value: number
  stressed_value: number
  results_json: unknown
  recommended_actions: RecommendedAction[]
  latency_ms: number
  created_at: string
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  getToken?: () => Promise<string | null>
): Promise<T> {
  const token = getToken ? await getToken() : null
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  const res = await fetch(`${API_URL}${path}`, { ...init, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(err.detail ?? `API error ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export async function listPortfolios(token?: string | null): Promise<Portfolio[]> {
  return apiFetch<Portfolio[]>('/api/v1/portfolios', undefined, token ? () => Promise.resolve(token) : undefined)
}

export async function createPortfolio(
  data: { name: string; holdings_json: unknown },
  token?: string | null
): Promise<Portfolio> {
  return apiFetch<Portfolio>(
    '/api/v1/portfolios',
    { method: 'POST', body: JSON.stringify(data) },
    token ? () => Promise.resolve(token) : undefined
  )
}

export async function deletePortfolio(id: string, token?: string | null): Promise<void> {
  return apiFetch<void>(
    `/api/v1/portfolios/${id}`,
    { method: 'DELETE' },
    token ? () => Promise.resolve(token) : undefined
  )
}

export async function listRuns(portfolioId: string, token?: string | null): Promise<StressRun[]> {
  return apiFetch<StressRun[]>(
    `/api/v1/portfolios/${portfolioId}/runs`,
    undefined,
    token ? () => Promise.resolve(token) : undefined
  )
}

export async function createRun(
  portfolioId: string,
  data: { scenario: string; results_json: unknown },
  token?: string | null
): Promise<StressRun> {
  return apiFetch<StressRun>(
    `/api/v1/portfolios/${portfolioId}/runs`,
    { method: 'POST', body: JSON.stringify(data) },
    token ? () => Promise.resolve(token) : undefined
  )
}

export async function patchAction(
  runId: string,
  actionId: string,
  status: RecommendedAction['status'],
  token?: string | null
): Promise<RecommendedAction> {
  return apiFetch<RecommendedAction>(
    `/api/v1/runs/${runId}/actions/${actionId}`,
    { method: 'PATCH', body: JSON.stringify({ status }) },
    token ? () => Promise.resolve(token) : undefined
  )
}
