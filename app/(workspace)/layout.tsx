import AppSidebar from '@/components/AppSidebar'
import { PresentationProvider } from '@/lib/presentation-context'
import { CommandPalette } from '@/components/ui/command-palette'
import { FloatingAiAssistant } from '@/components/ui/glowing-ai-chat-assistant'

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <PresentationProvider>
      <div className='min-h-screen bg-[#0A0F1E] text-white flex'>
        <AppSidebar />
        <main className='flex-1 min-w-0 overflow-y-auto'>
          {children}
        </main>
      </div>
      <CommandPalette />
      <FloatingAiAssistant />
    </PresentationProvider>
  )
}
