import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SiteNav from '@/components/marketing/site-nav'

export const metadata = { title: 'IC Prep — Vantage' }

export default function StubPage() {
  return (
    <main className='min-h-screen bg-[#0A0F1E] text-white'>
      <SiteNav />
      <div className='max-w-3xl mx-auto px-6 pt-40 pb-24 text-center'>
        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
          bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium mb-8'>
          Coming soon
        </div>
        <h1 className='text-4xl font-bold tracking-tight mb-4'>IC Prep</h1>
        <p className='text-gray-400 mb-10'>This page is under construction. Check back soon.</p>
        <Link href='/' className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors'>
          <ArrowLeft size={14} /> Back to home
        </Link>
      </div>
    </main>
  )
}
