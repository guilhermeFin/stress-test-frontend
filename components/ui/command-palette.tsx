'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, X } from 'lucide-react'
import { SKILLS as COMMANDS, BADGE_COLORS } from '@/lib/skills'

import type { Skill } from '@/lib/skills'

function score(cmd: Skill, q: string): number {
  const lower = q.toLowerCase()
  if (cmd.slash.toLowerCase().includes(lower)) return 3
  if (cmd.label.toLowerCase().includes(lower)) return 2
  if (cmd.triggers.some(t => t.toLowerCase().includes(lower))) return 1
  if (cmd.description.toLowerCase().includes(lower)) return 0.5
  return -1
}

export function CommandPalette() {
  const [open, setOpen]       = useState(false)
  const [query, setQuery]     = useState('')
  const [active, setActive]   = useState(0)
  const router                = useRouter()
  const inputRef              = useRef<HTMLInputElement>(null)

  const filtered = query.trim()
    ? COMMANDS.filter(c => score(c, query) >= 0).sort((a, b) => score(b, query) - score(a, query))
    : COMMANDS

  const close = useCallback(() => { setOpen(false); setQuery('') }, [])

  const navigate = useCallback((href: string) => {
    router.push(href)
    close()
  }, [router, close])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(v => !v)
        setQuery('')
        setActive(0)
      }
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [close])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  useEffect(() => { setActive(0) }, [query])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && filtered[active]) navigate(filtered[active].href)
  }

  if (!open) return null

  return (
    <div className='fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4'
      onClick={close}>

      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' />

      <div className='relative w-full max-w-xl bg-[#0D1120] border border-white/10 rounded-2xl
        shadow-2xl shadow-black/60 overflow-hidden'
        onClick={e => e.stopPropagation()}>

        {/* Search input */}
        <div className='flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]'>
          <Search size={15} className='text-gray-500 shrink-0' />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder='Search skills — try "rebalance", "TLH", "morning note"…'
            className='flex-1 bg-transparent text-sm text-white placeholder:text-gray-600
              focus:outline-none'
          />
          {query && (
            <button onClick={() => setQuery('')}
              className='text-gray-600 hover:text-gray-400 transition-colors'>
              <X size={13} />
            </button>
          )}
          <kbd className='hidden sm:flex items-center gap-1 text-[10px] text-gray-600
            bg-white/[0.04] border border-white/[0.08] rounded px-1.5 py-0.5'>
            esc
          </kbd>
        </div>

        {/* Command list */}
        <div className='max-h-[360px] overflow-y-auto'>
          {filtered.length === 0 && (
            <p className='text-sm text-gray-600 text-center py-10'>No matching skills.</p>
          )}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => navigate(cmd.href)}
              onMouseEnter={() => setActive(i)}
              className={`w-full text-left flex items-start gap-3.5 px-4 py-3.5 transition-colors
                ${i === active ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'}
                ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}>

              {/* Slash badge */}
              <span className='shrink-0 mt-0.5 text-[11px] font-mono font-semibold
                text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20
                rounded-lg px-2 py-1 leading-none whitespace-nowrap'>
                {cmd.slash}
              </span>

              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-0.5'>
                  <span className='text-sm font-semibold text-white'>{cmd.label}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border
                    ${BADGE_COLORS[cmd.badge]}`}>
                    {cmd.badge}
                  </span>
                  <span className='text-[10px] text-gray-600'>{cmd.category}</span>
                </div>
                <p className='text-xs text-gray-400 leading-relaxed line-clamp-1'>
                  {cmd.description}
                </p>
                <p className='text-[10px] text-gray-600 mt-1'>
                  {cmd.triggers.slice(0, 4).join(' · ')}
                </p>
              </div>

              <ArrowRight size={13}
                className={`shrink-0 mt-1 transition-opacity ${i === active ? 'text-gray-400 opacity-100' : 'opacity-0'}`} />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className='px-4 py-2.5 border-t border-white/[0.06] flex items-center gap-4
          text-[10px] text-gray-600'>
          <span><kbd className='font-mono'>↑↓</kbd> navigate</span>
          <span><kbd className='font-mono'>↵</kbd> open</span>
          <span><kbd className='font-mono'>⌘K</kbd> toggle</span>
          <span className='ml-auto'>{filtered.length} skill{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  )
}
