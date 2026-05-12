import type { ReactNode } from 'react'
import SiteNav from '@/components/marketing/site-nav'
import MarketingFooter from '@/components/ui/footer-column'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-[#0A0F1E] text-white flex flex-col'>
      <SiteNav />
      <div className='flex-1'>{children}</div>
      <MarketingFooter />
    </div>
  )
}
