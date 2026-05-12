'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface PresentationContextValue {
  draft: string[]                      // slide IDs queued
  addSlide: (id: string) => void
  removeSlide: (id: string) => void
  toggleSlide: (id: string) => void
  clearDraft: () => void
  hasDraft: boolean
}

const PresentationContext = createContext<PresentationContextValue | null>(null)

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<string[]>([])

  const addSlide    = useCallback((id: string) => setDraft(d => d.includes(id) ? d : [...d, id]), [])
  const removeSlide = useCallback((id: string) => setDraft(d => d.filter(x => x !== id)), [])
  const toggleSlide = useCallback((id: string) => setDraft(d => d.includes(id) ? d.filter(x => x !== id) : [...d, id]), [])
  const clearDraft  = useCallback(() => setDraft([]), [])

  return (
    <PresentationContext.Provider value={{ draft, addSlide, removeSlide, toggleSlide, clearDraft, hasDraft: draft.length > 0 }}>
      {children}
    </PresentationContext.Provider>
  )
}

export function usePresentationDraft() {
  const ctx = useContext(PresentationContext)
  if (!ctx) throw new Error('usePresentationDraft must be used inside PresentationProvider')
  return ctx
}
