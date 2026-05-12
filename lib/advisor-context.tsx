'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type AdvisorCtx = {
  isOpen: boolean
  open:   () => void
  close:  () => void
  toggle: () => void
}

const Ctx = createContext<AdvisorCtx>({
  isOpen: false, open: () => {}, close: () => {}, toggle: () => {},
})

export function AdvisorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Ctx.Provider value={{
      isOpen,
      open:   () => setIsOpen(true),
      close:  () => setIsOpen(false),
      toggle: () => setIsOpen(v => !v),
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAdvisor = () => useContext(Ctx)
