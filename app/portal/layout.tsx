import type { ReactNode } from 'react'

export const metadata = {
  title: 'Client Portal — Vantage',
}

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-[#0A0F1E] text-white'>
      {children}
    </div>
  )
}
