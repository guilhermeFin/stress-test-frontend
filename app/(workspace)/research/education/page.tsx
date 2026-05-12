'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, BookOpen, Check, ChevronRight,
  ChevronLeft, X, Eye,
} from 'lucide-react'
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

const CATEGORY_ACCENT: Record<SlideCategory, string> = {
  investor_archetype: '#3B82F6',
  asset_class:        '#34d399',
  tax:                '#fbbf24',
  estate:             '#a78bfa',
  behavioral:         '#fb923c',
  macro:              '#22d3ee',
}

// ── Slide preview modal ───────────────────────────────────────────────────────

function SlidePreview({
  slides,
  index,
  onClose,
  onNavigate,
  added,
  onAdd,
}: {
  slides: EducationSlide[]
  index: number
  onClose: () => void
  onNavigate: (i: number) => void
  added: Set<string>
  onAdd: (id: string) => void
}) {
  const slide = slides[index]
  const accent = CATEGORY_ACCENT[slide.category]
  const catColor = CATEGORY_COLORS[slide.category]
  const total = slides.length
  const hasPrev = index > 0
  const hasNext = index < total - 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft'  && hasPrev) onNavigate(index - 1)
      if (e.key === 'ArrowRight' && hasNext) onNavigate(index + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, hasPrev, hasNext, onClose, onNavigate])

  return (
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8'
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/70 backdrop-blur-md' />

      {/* Slide panel */}
      <div
        className='relative z-10 w-full max-w-3xl rounded-3xl overflow-hidden
          shadow-2xl shadow-black/60 border border-white/10'
        onClick={e => e.stopPropagation()}
      >
        {/* Slide header bar */}
        <div
          className='flex items-center justify-between px-6 py-3 border-b border-white/[0.07]'
          style={{ background: `linear-gradient(135deg, ${accent}18 0%, #0D1120 100%)` }}
        >
          <div className='flex items-center gap-3'>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor}`}>
              {CATEGORY_LABELS[slide.category]}
            </span>
            <span className='text-xs text-gray-600'>
              {index + 1} / {total}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => onAdd(slide.id)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5
                rounded-lg border transition-all ${added.has(slide.id)
                  ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
                  : 'text-[#3B82F6] border-[#3B82F6]/30 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20'}`}
            >
              {added.has(slide.id) ? <><Check size={11} /> Added</> : '+ Add to presentation'}
            </button>
            <button
              onClick={onClose}
              className='p-1.5 rounded-lg text-gray-500 hover:text-white
                hover:bg-white/[0.06] transition-colors'
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Slide body */}
        <div className='bg-[#0D1120] px-8 py-10 md:px-12'>

          {/* Icon + title */}
          <div className='flex items-start gap-5 mb-8'>
            <span className='text-5xl leading-none shrink-0'>{slide.icon}</span>
            <div>
              <h2 className='text-2xl font-bold text-white tracking-tight leading-tight mb-1'>
                {slide.title}
              </h2>
              <p className='text-sm text-gray-400'>{slide.subtitle}</p>
            </div>
          </div>

          {/* Description */}
          <p className='text-sm text-gray-300 leading-relaxed mb-8 max-w-xl'>
            {slide.description}
          </p>

          {/* Two-column: takeaways + talking points */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <p className='text-[10px] font-semibold uppercase tracking-widest mb-3'
                style={{ color: accent }}>
                Key Takeaways
              </p>
              <ul className='space-y-2.5'>
                {slide.key_takeaways.map((t, i) => (
                  <li key={i} className='flex items-start gap-2.5 text-sm text-gray-200'>
                    <span className='w-1.5 h-1.5 rounded-full shrink-0 mt-1.5'
                      style={{ background: accent }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3'>
                Talking Points
              </p>
              <ul className='space-y-2.5'>
                {slide.talking_points.map((tp, i) => (
                  <li key={i}
                    className='text-xs text-gray-400 bg-white/[0.03] border border-white/[0.06]
                      rounded-xl px-3.5 py-2.5 leading-relaxed italic'>
                    "{tp}"
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Slide footer — prev / next */}
        <div className='bg-[#0D1120] border-t border-white/[0.07] px-6 py-3 flex items-center justify-between'>
          <button
            onClick={() => hasPrev && onNavigate(index - 1)}
            disabled={!hasPrev}
            className='flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
              text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all
              disabled:opacity-30 disabled:cursor-not-allowed'
          >
            <ChevronLeft size={14} /> Previous
          </button>

          {/* Dot indicators */}
          <div className='flex items-center gap-1'>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => onNavigate(i)}
                className='w-1.5 h-1.5 rounded-full transition-all'
                style={{ background: i === index ? accent : 'rgba(255,255,255,0.15)' }}
              />
            ))}
          </div>

          <button
            onClick={() => hasNext && onNavigate(index + 1)}
            disabled={!hasNext}
            className='flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
              text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all
              disabled:opacity-30 disabled:cursor-not-allowed'
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Slide card ────────────────────────────────────────────────────────────────

function SlideCard({ slide, added, onAdd, onPreview }: {
  slide: EducationSlide
  added: boolean
  onAdd: (id: string) => void
  onPreview: () => void
}) {
  const catColor = CATEGORY_COLORS[slide.category]

  return (
    <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4
      hover:border-white/[0.10] transition-colors'>
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
        <button
          onClick={onPreview}
          className='shrink-0 p-1.5 rounded-lg text-gray-600 hover:text-white
            hover:bg-white/[0.06] transition-colors'
          title='Preview slide'
        >
          <Eye size={14} />
        </button>
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

      <div className='flex items-center gap-2 mt-auto pt-1'>
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

// ── Page ──────────────────────────────────────────────────────────────────────

const ALL_CATEGORIES = ['all', ...Object.keys(CATEGORY_LABELS)] as const
type FilterValue = typeof ALL_CATEGORIES[number]

export default function EducationPage() {
  const [filter, setFilter]       = useState<FilterValue>('all')
  const [added, setAdded]         = useState<Set<string>>(new Set())
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const visible = filter === 'all'
    ? EDUCATION_SLIDES
    : EDUCATION_SLIDES.filter(s => s.category === filter)

  const handleAdd = (id: string) =>
    setAdded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  const openPreview = useCallback((idx: number) => setPreviewIndex(idx), [])
  const closePreview = useCallback(() => setPreviewIndex(null), [])

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
          <p className='text-sm text-gray-500'>{EDUCATION_SLIDES.length} slides · client-ready talking points · click Preview to see the full slide</p>
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
        {visible.map((slide, i) => (
          <SlideCard
            key={slide.id}
            slide={slide}
            added={added.has(slide.id)}
            onAdd={handleAdd}
            onPreview={() => openPreview(i)}
          />
        ))}
      </div>

      {/* Preview modal */}
      {previewIndex !== null && (
        <SlidePreview
          slides={visible}
          index={previewIndex}
          onClose={closePreview}
          onNavigate={setPreviewIndex}
          added={added}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
