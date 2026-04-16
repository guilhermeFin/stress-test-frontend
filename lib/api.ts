import axios from 'axios'

const API_BASE = 'http://localhost:8000'

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