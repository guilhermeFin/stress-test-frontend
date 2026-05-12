import AppSidebar from '@/components/AppSidebar'
import { PresentationProvider } from '@/lib/presentation-context'
import { AdvisorProvider } from '@/lib/advisor-context'
import { CommandPalette } from '@/components/ui/command-palette'
import { AdvisorPanel } from '@/components/ui/advisor-panel'

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdvisorProvider>
      <PresentationProvider>
        <div className='min-h-screen bg-[#0A0F1E] text-white flex'>
          <AppSidebar />
          <main className='flex-1 min-w-0 overflow-y-auto'>
            {children}
          </main>
        </div>
        <CommandPalette />
        <AdvisorPanel />
      </PresentationProvider>
    </AdvisorProvider>
  )
}
