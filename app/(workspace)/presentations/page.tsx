'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2, GripVertical, Download, Share2, BookOpen, ChevronRight } from 'lucide-react'
import { EDUCATION_SLIDES, type Presentation } from '@/lib/research'

const MOCK_PRESENTATIONS: Presentation[] = [
  {
    id: 'p1',
    title: 'Q2 2026 Client Review',
    household_name: 'Davidson Family',
    slides: [
      { slide_id: 'accumulator',        order: 0 },
      { slide_id: 'how-6040-works',     order: 1 },
      { slide_id: 'tlh-explained',      order: 2 },
      { slide_id: 'missed-best-days',   order: 3 },
    ],
    created_at: '2026-05-01',
    updated_at: '2026-05-10',
  },
  {
    id: 'p2',
    title: 'Estate Planning Overview',
    household_name: 'Chen Family',
    slides: [
      { slide_id: 'revocable-trust',   order: 0 },
      { slide_id: 'roth-conversion',   order: 1 },
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
    <div className='flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3'>
      <GripVertical size={14} className='text-gray-700 shrink-0 cursor-grab' />
      <span className='text-xs text-gray-600 tabular-nums w-4 shrink-0'>{order + 1}</span>
      <span className='text-lg leading-none'>{slide.icon}</span>
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium text-white truncate'>{slide.title}</p>
        <p className='text-[10px] text-gray-500'>{slide.subtitle}</p>
      </div>
      <button onClick={onRemove} className='text-gray-700 hover:text-red-400 transition-colors'>
        <Trash2 size={13} />
      </button>
    </div>
  )
}

function PresentationCard({ pres, onDelete }: { pres: Presentation; onDelete: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl overflow-hidden'>
      <div className='flex items-start justify-between px-5 py-4'>
        <div>
          <p className='text-sm font-semibold text-white'>{pres.title}</p>
          {pres.household_name && (
            <p className='text-xs text-gray-500 mt-0.5'>{pres.household_name}</p>
          )}
          <p className='text-[10px] text-gray-600 mt-1'>
            {pres.slides.length} slides · Updated {pres.updated_at}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            title='Export PDF'
            className='text-gray-600 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg'>
            <Download size={14} />
          </button>
          <button
            title='Share link'
            className='text-gray-600 hover:text-[#3B82F6] transition-colors p-1.5 hover:bg-white/5 rounded-lg'>
            <Share2 size={14} />
          </button>
          <button
            onClick={onDelete}
            className='text-gray-700 hover:text-red-400 transition-colors p-1.5 hover:bg-white/5 rounded-lg'>
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => setOpen(v => !v)}
            className='text-gray-500 hover:text-white transition-colors p-1.5'>
            <ChevronRight size={14} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className='px-5 pb-5 space-y-2 border-t border-white/[0.06] pt-4'>
          {pres.slides.sort((a, b) => a.order - b.order).map(ps => (
            <SlideRow
              key={ps.slide_id}
              slideId={ps.slide_id}
              order={ps.order}
              onRemove={() => {}}
            />
          ))}
          <Link href='/research/education'
            className='flex items-center gap-1.5 text-xs text-[#3B82F6] hover:text-blue-400
              transition-colors mt-2'>
            <Plus size={12} /> Add slides from library
          </Link>
        </div>
      )}
    </div>
  )
}

export default function PresentationsPage() {
  const [presentations, setPresentations] = useState<Presentation[]>(MOCK_PRESENTATIONS)
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const createPresentation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const pres: Presentation = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      slides: [],
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10),
    }
    setPresentations(ps => [pres, ...ps])
    setNewTitle('')
    setShowNew(false)
  }

  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>

      <div className='flex items-start justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight mb-1'>Presentations</h1>
          <p className='text-sm text-gray-500'>Build client-meeting decks from your education library.</p>
        </div>
        <div className='flex items-center gap-2'>
          <Link href='/research/education'
            className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
              border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 transition-colors'>
            <BookOpen size={14} /> Library
          </Link>
          <button
            onClick={() => setShowNew(v => !v)}
            className='flex items-center gap-1.5 text-sm font-semibold text-white
              bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg px-4 py-2 transition-colors'>
            <Plus size={14} /> New presentation
          </button>
        </div>
      </div>

      {showNew && (
        <form onSubmit={createPresentation}
          className='bg-white/[0.02] border border-[#3B82F6]/20 rounded-2xl p-5 mb-6'>
          <h3 className='text-sm font-semibold mb-3'>New presentation</h3>
          <input
            type='text'
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder='e.g. Q3 Client Review — Davidson Family'
            autoFocus
            required
            className='w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm
              text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 mb-3'
          />
          <div className='flex gap-2'>
            <button type='submit'
              className='bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold
                rounded-lg px-4 py-2 transition-colors'>
              Create
            </button>
            <button type='button' onClick={() => setShowNew(false)}
              className='text-sm text-gray-500 hover:text-white border border-white/10
                hover:border-white/20 rounded-lg px-4 py-2 transition-colors'>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className='space-y-4'>
        {presentations.map(p => (
          <PresentationCard
            key={p.id}
            pres={p}
            onDelete={() => setPresentations(ps => ps.filter(x => x.id !== p.id))}
          />
        ))}
      </div>

      {presentations.length === 0 && (
        <div className='text-center py-20 text-gray-600'>
          <BookOpen size={32} className='mx-auto mb-3 opacity-30' />
          <p className='text-sm'>No presentations yet.</p>
          <p className='text-xs mt-1'>Start by adding slides from the <Link href='/research/education' className='text-[#3B82F6] hover:underline'>education library</Link>.</p>
        </div>
      )}
    </div>
  )
}
