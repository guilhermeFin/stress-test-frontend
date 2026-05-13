'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus, Trash2, GripVertical, Download, Share2,
  BookOpen, ChevronRight, Check, X, ArrowRight,
} from 'lucide-react'
import { EDUCATION_SLIDES, type Presentation } from '@/lib/research'
import { usePresentationDraft } from '@/lib/presentation-context'

function exportPresentation(pres: Presentation) {
  const slides = pres.slides
    .sort((a, b) => a.order - b.order)
    .map(ps => EDUCATION_SLIDES.find(s => s.id === ps.slide_id))
    .filter(Boolean)

  const lines: string[] = [
    `VANTAGE — ${pres.title}`,
    pres.household_name ? `Client: ${pres.household_name}` : '',
    `Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    `Slides: ${slides.length}`,
    '',
    '─'.repeat(60),
    '',
  ]

  slides.forEach((s, i) => {
    if (!s) return
    lines.push(`${i + 1}. ${s.title}`)
    lines.push(`   ${s.subtitle}`)
    lines.push('')
    lines.push(`   ${s.description}`)
    lines.push('')
    lines.push('   Key Takeaways:')
    s.key_takeaways.forEach(t => lines.push(`   • ${t}`))
    lines.push('')
    lines.push('   Talking Points:')
    s.talking_points.forEach(t => lines.push(`   "${t}"`))
    lines.push('')
    lines.push('─'.repeat(60))
    lines.push('')
  })

  lines.push('AI-assisted — verify before client delivery | Vantage by VANTAGE')

  const blob = new Blob([lines.filter(Boolean).join('\n')], { type: 'text/plain' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${pres.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

const MOCK_PRESENTATIONS: Presentation[] = [
  {
    id: 'p1',
    title: 'Q2 2026 Client Review',
    household_name: 'Davidson Family',
    slides: [
      { slide_id: 'accumulator',      order: 0 },
      { slide_id: 'how-6040-works',   order: 1 },
      { slide_id: 'tlh-explained',    order: 2 },
      { slide_id: 'missed-best-days', order: 3 },
    ],
    created_at: '2026-05-01',
    updated_at: '2026-05-10',
  },
  {
    id: 'p2',
    title: 'Estate Planning Overview',
    household_name: 'Chen Family',
    slides: [
      { slide_id: 'revocable-trust', order: 0 },
      { slide_id: 'roth-conversion', order: 1 },
      { slide_id: 'beneficiary-audit', order: 2 },
    ],
    created_at: '2026-04-15',
    updated_at: '2026-04-28',
  },
]

function SlideRow({ slideId, order, onRemove }: {
  slideId: string
  order: number
  onRemove: () => void
}) {
  const slide = EDUCATION_SLIDES.find(s => s.id === slideId)
  if (!slide) return null
  return (
    <div className='flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3'>
      <GripVertical size={14} className='text-slate-400 shrink-0 cursor-grab' />
      <span className='text-xs text-slate-500 tabular-nums w-4 shrink-0'>{order + 1}</span>
      <span className='text-lg leading-none'>{slide.icon}</span>
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium text-[#0B1B2E] truncate'>{slide.title}</p>
        <p className='text-[10px] text-slate-500'>{slide.subtitle}</p>
      </div>
      <button onClick={onRemove}
        className='p-1.5 rounded-md text-slate-400 hover:text-[#B91C1C] hover:bg-red-50 transition-colors'>
        <Trash2 size={13} />
      </button>
    </div>
  )
}

function PresentationCard({ pres, onDelete, onAddDraft, draftCount }: {
  pres: Presentation
  onDelete: () => void
  onAddDraft: (id: string) => void
  draftCount: number
}) {
  const [open, setOpen] = useState(false)
  const [slides, setSlides] = useState(pres.slides)

  return (
    <div className='bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all'>
      <div className='flex items-start justify-between px-5 py-4'>
        <div>
          <p className='text-base font-semibold text-[#0B1B2E]'>{pres.title}</p>
          {pres.household_name && (
            <p className='text-sm text-slate-600 mt-0.5'>{pres.household_name}</p>
          )}
          <p className='text-xs text-slate-500 mt-1'>
            {slides.length} slides · Updated {pres.updated_at}
          </p>
        </div>
        <div className='flex items-center gap-1'>
          {draftCount > 0 && (
            <button
              onClick={() => onAddDraft(pres.id)}
              className='flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 mr-1
                rounded-md border text-emerald-700 border-emerald-200 bg-emerald-100
                hover:bg-emerald-200 transition-all'>
              <Plus size={11} /> Add {draftCount} slide{draftCount > 1 ? 's' : ''}
            </button>
          )}
          <button title='Export outline'
            onClick={() => exportPresentation(pres)}
            className='p-2 rounded-md text-slate-500 hover:text-[#0B1B2E] hover:bg-slate-100 transition-colors'>
            <Download size={14} />
          </button>
          <button title='Share link'
            className='p-2 rounded-md text-slate-500 hover:text-[#2563EB] hover:bg-slate-100 transition-colors'>
            <Share2 size={14} />
          </button>
          <button onClick={onDelete}
            className='p-2 rounded-md text-slate-500 hover:text-[#B91C1C] hover:bg-red-50 transition-colors'>
            <Trash2 size={13} />
          </button>
          <button onClick={() => setOpen(v => !v)}
            className='p-2 rounded-md text-slate-500 hover:text-[#0B1B2E] hover:bg-slate-100 transition-colors'>
            <ChevronRight size={14} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className='px-5 pb-5 space-y-2 border-t border-slate-100 pt-4 bg-slate-50'>
          {slides.length === 0 && (
            <p className='text-xs text-slate-500 py-2'>No slides yet. Add from the library below.</p>
          )}
          {slides.sort((a, b) => a.order - b.order).map(ps => (
            <SlideRow
              key={ps.slide_id}
              slideId={ps.slide_id}
              order={ps.order}
              onRemove={() => setSlides(s => s.filter(x => x.slide_id !== ps.slide_id))}
            />
          ))}
          <Link href='/research/education'
            className='flex items-center gap-1.5 text-xs text-[#2563EB] hover:underline transition-colors mt-2'>
            <Plus size={12} /> Add slides from library
          </Link>
        </div>
      )}
    </div>
  )
}

// ── Draft banner ──────────────────────────────────────────────────────────────

function DraftBanner({ draft, onDismiss }: { draft: string[]; onDismiss: () => void }) {
  const slides = draft.map(id => EDUCATION_SLIDES.find(s => s.id === id)).filter(Boolean)
  if (slides.length === 0) return null

  return (
    <div className='bg-[#2563EB]/5 border border-[#2563EB]/20 rounded-lg p-5 mb-6'>
      <div className='flex items-start justify-between mb-3'>
        <div>
          <p className='text-sm font-semibold text-[#0B1B2E] mb-0.5'>
            {slides.length} slide{slides.length > 1 ? 's' : ''} ready to add
          </p>
          <p className='text-xs text-slate-600'>
            Select a presentation below to add them, or create a new one.
          </p>
        </div>
        <button onClick={onDismiss}
          className='p-1 text-slate-400 hover:text-[#0B1B2E] transition-colors'>
          <X size={14} />
        </button>
      </div>
      <div className='flex flex-wrap gap-2'>
        {slides.map(s => s && (
          <span key={s.id} className='flex items-center gap-1.5 text-xs bg-white
            border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700'>
            {s.icon} {s.title}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PresentationsPage() {
  const { draft, clearDraft, hasDraft } = usePresentationDraft()
  const [presentations, setPresentations] = useState<Presentation[]>(MOCK_PRESENTATIONS)
  const [showNew, setShowNew]             = useState(false)
  const [newTitle, setNewTitle]           = useState('')

  const createPresentation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const newSlides = draft.map((id, i) => ({ slide_id: id, order: i }))
    const pres: Presentation = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      slides: newSlides,
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10),
    }
    setPresentations(ps => [pres, ...ps])
    setNewTitle('')
    setShowNew(false)
    if (hasDraft) clearDraft()
  }

  const addDraftToPresentation = (presId: string) => {
    setPresentations(ps => ps.map(p => {
      if (p.id !== presId) return p
      const existing = new Set(p.slides.map(s => s.slide_id))
      const newSlides = draft
        .filter(id => !existing.has(id))
        .map((id, i) => ({ slide_id: id, order: p.slides.length + i }))
      return {
        ...p,
        slides: [...p.slides, ...newSlides],
        updated_at: new Date().toISOString().slice(0, 10),
      }
    }))
    clearDraft()
  }

  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>

      {/* Page header */}
      <div className='border-b border-slate-200 pb-6 mb-8'>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.06em] text-[#2563EB] mb-1'>TOOLS</p>
            <h1 className='text-3xl font-bold text-[#0B1B2E] tracking-tight mb-1'>Presentations</h1>
            <p className='text-base text-slate-600'>Build client-meeting decks from your education library.</p>
          </div>
          <div className='flex items-center gap-2 mt-1'>
            <Link href='/research/education'
              className='flex items-center gap-1.5 text-sm text-slate-600 hover:text-[#0B1B2E]
                border border-slate-200 hover:border-slate-300 rounded-md px-3 py-2 transition-colors bg-white'>
              <BookOpen size={14} /> Library
            </Link>
            <button onClick={() => setShowNew(v => !v)}
              className='flex items-center gap-1.5 text-sm font-semibold text-white
                bg-[#2563EB] hover:bg-[#1D4ED8] rounded-md px-4 py-2 transition-colors'>
              <Plus size={14} /> New presentation
            </button>
          </div>
        </div>
      </div>

      {/* Draft banner */}
      {hasDraft && <DraftBanner draft={draft} onDismiss={clearDraft} />}

      {/* New presentation form */}
      {showNew && (
        <form onSubmit={createPresentation}
          className='bg-white border border-[#2563EB]/20 rounded-lg p-5 mb-6 shadow-sm'>
          <h3 className='text-sm font-semibold text-[#0B1B2E] mb-1'>New presentation</h3>
          {hasDraft && (
            <p className='text-xs text-slate-600 mb-3 flex items-center gap-1'>
              <Check size={11} className='text-emerald-600' />
              {draft.length} slide{draft.length > 1 ? 's' : ''} from library will be included
            </p>
          )}
          <input
            type='text'
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder='e.g. Q3 Client Review — Davidson Family'
            autoFocus
            required
            className='w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm
              text-[#0B1B2E] placeholder:text-slate-400 focus:outline-none focus:ring-1
              focus:ring-[#2563EB] focus:border-[#2563EB] mb-3 transition-colors'
          />
          <div className='flex gap-2'>
            <button type='submit'
              className='bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold
                rounded-md px-4 py-2 transition-colors flex items-center gap-1.5'>
              Create <ArrowRight size={13} />
            </button>
            <button type='button' onClick={() => setShowNew(false)}
              className='text-sm text-slate-600 hover:text-[#0B1B2E] border border-slate-200
                hover:border-slate-300 rounded-md px-4 py-2 transition-colors bg-white'>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className='space-y-3'>
        {presentations.map(p => (
          <PresentationCard
            key={p.id}
            pres={p}
            onDelete={() => setPresentations(ps => ps.filter(x => x.id !== p.id))}
            onAddDraft={addDraftToPresentation}
            draftCount={hasDraft ? draft.filter(id => !p.slides.find(s => s.slide_id === id)).length : 0}
          />
        ))}
      </div>

      {presentations.length === 0 && (
        <div className='text-center py-20 border border-dashed border-slate-200 rounded-lg bg-slate-50'>
          <BookOpen size={32} className='mx-auto mb-3 text-slate-300' />
          <p className='text-slate-700 text-sm font-medium mb-1'>No presentations yet</p>
          <p className='text-slate-500 text-xs'>
            Start by adding slides from the{' '}
            <Link href='/research/education' className='text-[#2563EB] hover:underline'>
              education library
            </Link>.
          </p>
        </div>
      )}
    </div>
  )
}
