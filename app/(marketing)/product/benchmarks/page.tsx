import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Benchmark Comparison — Vantage' }

export default function StubPage() {
  return (
    <div className='max-w-3xl mx-auto px-6 pt-40 pb-24 text-center'>
      <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
        bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium mb-8'>
        Coming soon
      </div>
      <h1 className='text-4xl font-bold tracking-tight mb-4'>Benchmark Comparison</h1>
      <p className='text-gray-400 mb-10'>This page is under construction. Check back soon.</p>
      <Link href='/' className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors'>
        <ArrowLeft size={14} /> Back to home
      </Link>
    </div>
  )
}
