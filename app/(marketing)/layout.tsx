import type { ReactNode } from 'react'
import SiteHeader from '@/components/system/SiteHeader'
import SiteFooter from '@/components/system/SiteFooter'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-white text-[#0B1B2E] flex flex-col'>
      <SiteHeader variant='marketing' />
      <div className='flex-1'>{children}</div>
      <SiteFooter />
    </div>
  )
}
