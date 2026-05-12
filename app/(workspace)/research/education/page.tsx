'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Check, ChevronRight } from 'lucide-react'
import { EDUCATION_SLIDES, type SlideCategory, type EducationSlide } from '@/lib/research'

const CATEGORY_LABELS: Record<SlideCategory, string> = {
  investor_archetype: 'Investor Archetypes',
  asset_class:        'Asset Classes',
  tax:                'Tax Strategies',
  estate:             'Estate Planning',
  behavioral:         'Behavioral Finance',
  macro:              'Macro & Markets',
}

const CATEGORY_COLORS: Record<SlideCategory, string> = {
  investor_archetype: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20',
  asset_class:        'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  tax:                'text-amber-400 bg-amber-400/10 border-amber-400/20',
  estate:             'text-purple-400 bg-purple-400/10 border-purple-400/20',
  behavioral:         'text-orange-400 bg-orange-400/10 border-orange-400/20',
  macro:              'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
}

function SlideCard({ slide, added, onAdd }: {
  slide: EducationSlide
  added: boolean
  onAdd: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const catColor = CATEGORY_COLORS[slide.category]

  return (
    <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4'>
      <div className='flex items-start gap-3'>
        <span className='text-2xl leading-none mt-0.5'>{slide.icon}</span>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 flex-wrap mb-1'>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor}`}>
              {CATEGORY_LABELS[slide.category]}
            </span>
          </div>
          <p className='text-sm font-semibold text-white leading-snug'>{slide.title}</p>
          <p className='text-[11px] text-gray-500 mt-0.5'>{slide.subtitle}</p>
        </div>
      </div>

      <p className='text-xs text-gray-400 leading-relaxed'>{slide.description}</p>

      <div>
        <p className='text-[10px] text-gray-500 uppercase tracking-wide font-medium mb-2'>Key Takeaways</p>
        <ul className='space-y-1.5'>
          {slide.key_takeaways.map((t, i) => (
            <li key={i} className='flex items-start gap-2 text-xs text-gray-300'>
              <span className='text-[#3B82F6] shrink-0 mt-0.5'>·</span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      {expanded && (
        <div>
          <p className='text-[10px] text-gray-500 uppercase tracking-wide font-medium mb-2'>Talking Points</p>
          <ul className='space-y-2'>
            {slide.talking_points.map((tp, i) => (
              <li key={i} className='text-xs text-gray-300 bg-white/[0.02] border border-white/[0.06]
                rounded-xl px-3 py-2 leading-relaxed italic'>
                "{tp}"
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='flex items-center gap-2 mt-auto pt-1'>
        <button
          onClick={() => setExpanded(v => !v)}
          className='flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors'
        >
          {expanded ? 'Hide' : 'Talking points'}
          <ChevronRight size={11} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
        <button
          onClick={() => onAdd(slide.id)}
          className={`ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg
            border transition-all ${added
              ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
              : 'text-[#3B82F6] border-[#3B82F6]/30 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20'}`}
        >
          {added ? <><Check size={11} /> Added</> : '+ Add to presentation'}
        </button>
      </div>
    </div>
  )
}

const ALL_CATEGORIES = ['all', ...Object.keys(CATEGORY_LABELS)] as const
type FilterValue = typeof ALL_CATEGORIES[number]

export default function EducationPage() {
  const [filter, setFilter]   = useState<FilterValue>('all')
  const [added, setAdded]     = useState<Set<string>>(new Set())

  const visible = filter === 'all'
    ? EDUCATION_SLIDES
    : EDUCATION_SLIDES.filter(s => s.category === filter)

  const handleAdd = (id: string) =>
    setAdded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <div className='max-w-6xl mx-auto px-6 py-10'>

      <Link href='/research'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Research
      </Link>

      <div className='flex items-start justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight mb-1'>Education Library</h1>
          <p className='text-sm text-gray-500'>{EDUCATION_SLIDES.length} slides · client-ready talking points</p>
        </div>
        {added.size > 0 && (
          <Link href='/presentations'
            className='flex items-center gap-1.5 text-sm font-semibold text-white
              bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg px-4 py-2 transition-colors'>
            <BookOpen size={14} /> View presentation ({added.size})
          </Link>
        )}
      </div>

      {/* Category filter */}
      <div className='flex flex-wrap gap-2 mb-6'>
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
              filter === cat
                ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30'
                : 'text-gray-500 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            {cat === 'all' ? 'All slides' : CATEGORY_LABELS[cat as SlideCategory]}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {visible.map(slide => (
          <SlideCard
            key={slide.id}
            slide={slide}
            added={added.has(slide.id)}
            onAdd={handleAdd}
          />
        ))}
      </div>
    </div>
  )
}
