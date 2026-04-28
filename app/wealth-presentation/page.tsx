'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import WealthPresentation, { SAMPLE_DATA } from '@/components/results/WealthPresentation'

export default function WealthPresentationPage() {
  const [advisorMode, setAdvisorMode] = useState(false)
  const [usingSample, setUsingSample] = useState(true)

  // If the advisor ran a full stress test and stored results, we could
  // hydrate portfolioData from sessionStorage here. For now we always
  // render sample data so the page works standalone.
  useEffect(() => {
    const raw = sessionStorage.getItem('stressResults')
    if (!raw) setUsingSample(true)
  }, [])

  return (
    <main className='min-h-screen bg-[#0A1628]'>
      {/* Thin control bar — hidden when printing */}
      <div className='print:hidden sticky top-0 z-50 bg-[#0A1628]/95 backdrop-blur border-b border-white/8'>
        <div className='max-w-4xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between'>
          <Link
            href='/results'
            className='text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1'
          >
            ← Back to results
          </Link>

          <div className='flex items-center gap-3'>
            {usingSample && (
              <span className='text-xs text-yellow-500/70 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full'>
                Sample data
              </span>
            )}
            <label className='flex items-center gap-2 cursor-pointer'>
              <span className='text-xs text-slate-400'>Advisor mode</span>
              <button
                onClick={() => setAdvisorMode(v => !v)}
                className={`w-9 h-5 rounded-full transition-colors ${advisorMode ? 'bg-yellow-500' : 'bg-white/20'}`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full ml-0.5 transition-transform ${advisorMode ? 'translate-x-4' : ''}`} />
              </button>
            </label>
          </div>
        </div>
      </div>

      <WealthPresentation portfolioData={SAMPLE_DATA} advisorMode={advisorMode} />
    </main>
  )
}
