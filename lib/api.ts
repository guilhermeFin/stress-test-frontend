import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface Position {
  ticker: string
  name: string
  sector: string
  weight: number
  value: number
  stressed_value: number
  loss: number
  loss_pct: number
  var_95: number
  beta: number
  risk_level: 'Low' | 'Medium' | 'High'
}

export interface Summary {
  total_value: number
  total_cost_basis: number
  total_unrealized_gl: number
  total_tax_impact: number
  stressed_value: number
  total_loss: number
  total_loss_pct: number
  sharpe_before: number
  sharpe_after: number
  severity_label: string
  scenario_text: string
}

export interface StressTestResult {
  positions: Position[]
  summary: Summary
  charts: any
  explanation: any
}

export interface Signal {
  event_type: string
  summary: string
  market_sentiment: 'bullish' | 'bearish' | 'neutral' | 'mixed'
  confidence: string
  affected_positions: {
    ticker: string
    direction: string
    magnitude: string
    rationale: string
  }[]
  macro_themes: string[]
  action_flags: string[]
  urgency: 'immediate' | 'this_week' | 'watch'
  source_event: {
    source: string
    ticker: string
    title: string
    date: string
    url: string
  }
}

export interface PipelineResult {
  status: string
  run_id: string
  summary: {
    macro_series_pulled: number
    filings_found: number
    news_stories: number
    signals_generated: number
  }
  signals: Signal[]
}

export interface ScenarioSummary {
  portfolio_value: number
  total_cost_basis: number
  total_unrealized_gl: number
  total_pnl: number
  pct_impact: number
  new_portfolio_value: number
  total_tax_impact: number
  biggest_loss: any
  biggest_gain: any
}

export interface StressScenario {
  scenario_key: string
  scenario_name: string
  description: string
  probability: number
  positions: any[]
  summary: ScenarioSummary
}

export interface StressResults {
  status: string
  results: {
    run_at: string
    scenarios: {
      rate_shock: StressScenario
      recession: StressScenario
      credit_crisis: StressScenario
      inflation_spike: StressScenario
    }
    meta: {
      expected_weighted_loss: number
      worst_case_scenario: string
      worst_case_pnl: number
      worst_case_pct: number
      total_cost_basis: number
      total_unrealized_gl: number
    }
  }
}

export interface MemoResult {
  status: string
  memo: string
}

export async function runStressTest(
  file: File,
  scenario: string
): Promise<StressTestResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('scenario', scenario)
  const response = await axios.post(
    `${API_BASE}/api/stress-test`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return response.data
}

export async function exportPdf(data: StressTestResult): Promise<void> {
  const response = await axios.post(
    `${API_BASE}/api/export-pdf`,
    data,
    { responseType: 'blob' }
  )
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'stress_report.pdf')
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export async function runPipeline(): Promise<PipelineResult> {
  const response = await axios.post(`${API_BASE}/api/run-pipeline`)
  return response.data
}

export async function getStressResults(): Promise<StressResults> {
  const response = await axios.get(`${API_BASE}/api/stress-results`)
  return response.data
}

export async function getMemo(): Promise<MemoResult> {
  const response = await axios.get(`${API_BASE}/api/memo`)
  return response.data
}

export interface BrazilScenarioMeta {
  id: string
  name: string
  year: number
  severity: number
  description: string
  narrative: string
  recovery_months: number
}

export interface BrazilStressResult {
  scenario: {
    id: string
    name: string
    year: number
    description: string
    narrative: string
    severity: number
    recovery_months: number
    recovery_note: string
    correlation_note: string | null
  }
  portfolio_summary: {
    original_value_usd: number
    stressed_value_usd: number
    impact_usd: number
    impact_pct: number
    original_value_brl: number
    stressed_value_brl: number
    brl_usd_rate_original: number
    brl_usd_rate_stressed: number
  }
  positions: any[]
  shocks_applied: {
    brl_usd: number
    ibovespa: number
    cdi_spread_pts: number
    usd_equities: number
  }
}

export async function listBrazilScenarios(): Promise<BrazilScenarioMeta[]> {
  const response = await axios.get(`${API_BASE}/brazil/scenarios`)
  return response.data
}

export async function runBrazilStressFile(
  file: File,
  scenarioId: string,
  brlUsdRate = 5.20,
): Promise<BrazilStressResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('scenario_id', scenarioId)
  formData.append('brl_usd_rate', brlUsdRate.toString())
  const response = await axios.post(
    `${API_BASE}/api/brazil-stress-file`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return response.data
}

export async function comparePortfolios(
  file1: File,
  file2: File,
  scenario: string
): Promise<{ a: StressTestResult; b: StressTestResult }> {
  const [a, b] = await Promise.all([
    runStressTest(file1, scenario),
    runStressTest(file2, scenario),
  ])
  return { a, b }
}