'use client'

import { useState, useEffect } from 'react'

const SECTIONS = [
  { id: 'summary',     label: 'Summary' },
  { id: 'charts',      label: 'Charts' },
  { id: 'factors',     label: 'Factors' },
  { id: 'correlation', label: 'Correlation' },
  { id: 'benchmark',   label: 'Benchmark' },
  { id: 'liquidity',   label: 'Liquidity' },
  { id: 'client',      label: 'Client Impact' },
  { id: 'monte-carlo', label: 'Monte Carlo' },
  { id: 'positions',   label: 'Positions' },
  { id: 'explanation', label: 'AI Analysis' },
]

export default function ResultsNav() {
  const [active, setActive] = useState('summary')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className='sticky top-0 z-50 bg-gray-950/95 backdrop-blur-sm
      border-b border-gray-800 px-6 py-2'>
      <div className='max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto
        scrollbar-hide'>
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium
              whitespace-nowrap transition-colors flex-shrink-0
              ${active === id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}