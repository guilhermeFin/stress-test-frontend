'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingDown, ArrowLeft } from 'lucide-react'

const SECTIONS = [
  { id: 'summary',     label: 'Summary' },
  { id: 'charts',      label: 'Charts' },
  { id: 'factors',     label: 'Factors' },
  { id: 'correlation', label: 'Correlation' },
  { id: 'benchmark',   label: 'Benchmark' },
  { id: 'liquidity',   label: 'Liquidity' },
  { id: 'client',       label: 'Client Impact' },
  { id: 'rebalancing', label: 'Rebalancing' },
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
    <div className='sticky top-0 z-50 bg-[#0A0F1E]/95 backdrop-blur-md
      border-b border-white/8 px-6 py-2'>
      <div className='max-w-7xl mx-auto flex items-center gap-3'>

        <Link href='/' className='flex items-center gap-1.5 shrink-0 mr-1
          text-gray-400 hover:text-white transition-colors group'>
          <ArrowLeft size={13} className='group-hover:-translate-x-0.5 transition-transform' />
          <div className='w-5 h-5 bg-blue-600 rounded flex items-center justify-center'>
            <TrendingDown size={11} className='text-white' />
          </div>
          <span className='text-xs font-semibold text-white hidden sm:block'>
            PortfolioStress
          </span>
        </Link>

        <div className='w-px h-4 bg-white/10 hidden sm:block shrink-0' />

        <div className='flex items-center gap-0.5 overflow-x-auto scrollbar-hide flex-1'>
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium
                whitespace-nowrap transition-all duration-150 flex-shrink-0
                ${active === id
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                }`}>
              {label}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
