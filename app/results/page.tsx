'use client'

import { useEffect, useState } from 'react'
import { StressTestResult } from '@/lib/api'
import SummaryCards from '@/components/SummaryCards'
import StressCharts from '@/components/StressCharts'
import PositionTable from '@/components/PositionTable'
import ExplanationPanel from '@/components/ExplanationPanel'

export default function ResultsPage() {
  const [results, setResults] = useState<StressTestResult | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('stressResults')
    if (raw) setResults(JSON.parse(raw))
  }, [])

  if (!results) return (
    <main className='min-h-screen bg-gray-950 text-white flex items-center justify-center'>
      <p>No results found. <a href='/' className='text-blue-400'>Run a stress test</a></p>
    </main>
  )

  return (
    <main className='min-h-screen bg-gray-950 text-white p-6'>
      <div className='max-w-7xl mx-auto space-y-8'>
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='text-2xl font-bold'>Stress Test Results</h1>
            <p className='text-gray-400 mt-1'>{results.summary.scenario_text}</p>
          </div>
          <a href='/' className='text-sm text-blue-400 hover:underline'>
            Run new test</a>
        </div>
        <SummaryCards summary={results.summary} />
        <StressCharts charts={results.charts} positions={results.positions} />
        <PositionTable positions={results.positions} />
        <ExplanationPanel explanation={results.explanation} />
      </div>
    </main>
  )
}