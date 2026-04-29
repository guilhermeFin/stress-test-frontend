'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingDown } from 'lucide-react'

// Labels keyed by section ID. Order is derived from the DOM at runtime so it
// automatically stays in sync when sections are reordered in page.tsx.
const SECTION_LABELS: Record<string, string> = {
  summary:       'Summary',
  charts:        'Charts',
  factors:       'Factors',
  correlation:   'Correlation',
  liquidity:     'Liquidity',
  'monte-carlo': 'Monte Carlo',
  client:        'Client Impact',
  tax:           'Tax impact',
  rebalancing:   'Rebalancing',
  benchmark:     'Benchmark',
  explanation:   'AI Analysis',
  positions:     'Positions',
}

function getStickyOffset(mainEl: Element | null): number {
  if (!mainEl) return 92
  const heights = Array.from(mainEl.children)
    .filter(el => window.getComputedStyle(el).position === 'sticky')
    .map(el => (el as HTMLElement).offsetHeight)
  return heights.length > 0 ? Math.max(...heights) + 8 : 92
}

export default function ResultsNav() {
  const navRef                  = useRef<HTMLDivElement>(null)
  const [sections, setSections] = useState<string[]>(Object.keys(SECTION_LABELS))
  const [active, setActive]     = useState<string>(Object.keys(SECTION_LABELS)[0])

  useEffect(() => {
    // ── Discover actual DOM order ────────────────────────────────────────
    const discovered = Object.keys(SECTION_LABELS)
      .map(id => ({ id, el: document.getElementById(id) }))
      .filter((x): x is { id: string; el: HTMLElement } => x.el !== null)
      .sort((a, b) =>
        a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      )
      .map(x => x.id)

    if (discovered.length > 0) setSections(discovered)

    const ids    = discovered.length > 0 ? discovered : Object.keys(SECTION_LABELS)
    const mainEl = navRef.current?.closest('main') ?? null

    // Compute once — sticky header heights don't change during a session
    const offset = getStickyOffset(mainEl)

    // ── Scroll tracker ───────────────────────────────────────────────────
    const handleScroll = () => {
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= offset) current = id
      }
      setActive(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = getStickyOffset(navRef.current?.closest('main') ?? null)
    window.scrollTo({
      top: window.scrollY + el.getBoundingClientRect().top - offset,
      behavior: 'smooth',
    })
  }

  return (
    <div ref={navRef} className='sticky top-0 z-50 bg-[#0A1628]/95 backdrop-blur-md
      border-b border-white/8 px-6 py-2'>
      <div className='max-w-7xl mx-auto flex items-center gap-3'>

        <Link href='/' className='flex items-center gap-1.5 shrink-0 mr-1
          text-gray-400 hover:text-white transition-colors group'>
          <ArrowLeft size={13} className='group-hover:-translate-x-0.5 transition-transform' />
          <div className='w-5 h-5 bg-[#C9A84C] rounded flex items-center justify-center'>
            <TrendingDown size={11} className='text-[#0A1628]' />
          </div>
          <span className='text-xs font-semibold text-white hidden sm:block'>
            PortfolioStress
          </span>
        </Link>

        <div className='w-px h-4 bg-white/10 hidden sm:block shrink-0' />

        <div className='flex items-center gap-0.5 overflow-x-auto scrollbar-hide flex-1'>
          {sections.map(id => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`relative px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap
                transition-colors duration-150 flex-shrink-0
                ${active === id
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                }`}>
              {SECTION_LABELS[id]}
              {active === id && (
                <span className='absolute bottom-0 left-2 right-2 h-0.5 bg-[#C9A84C] rounded-full' />
              )}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

