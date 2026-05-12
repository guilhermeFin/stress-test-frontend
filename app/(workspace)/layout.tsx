import AppSidebar from '@/components/AppSidebar'

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-[#0A0F1E] text-white flex'>
      <AppSidebar />
      <main className='flex-1 min-w-0 overflow-y-auto'>
        {children}
      </main>
    </div>
  )
}
