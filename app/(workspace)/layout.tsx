import AppSidebar from '@/components/AppSidebar'
import { PresentationProvider } from '@/lib/presentation-context'
import { ErrorProvider } from '@/lib/error-context'
import { CommandPalette } from '@/components/ui/command-palette'
import { FloatingAiAssistant } from '@/components/ui/glowing-ai-chat-assistant'

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorProvider>
      <PresentationProvider>
        <div className='min-h-screen bg-white text-[#0B1B2E] flex relative'>
          <AppSidebar />
          <main className='flex-1 min-w-0 overflow-y-auto bg-white'>
            {children}
          </main>
        </div>
        <CommandPalette />
        <FloatingAiAssistant />
      </PresentationProvider>
    </ErrorProvider>
  )
}
