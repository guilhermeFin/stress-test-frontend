import AppSidebar from '@/components/AppSidebar'
import { PresentationProvider } from '@/lib/presentation-context'
import { ErrorProvider } from '@/lib/error-context'
import { CommandPalette } from '@/components/ui/command-palette'
import { FloatingAiAssistant } from '@/components/ui/glowing-ai-chat-assistant'

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorProvider>
      <PresentationProvider>
        {/* Top-edge gradient line */}
        <div
          className='fixed top-0 left-0 right-0 h-px z-[2] pointer-events-none'
          style={{ background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.30), transparent)' }}
        />
        {/* Radial blue glow from top */}
        <div
          className='fixed inset-0 z-0 pointer-events-none'
          style={{ background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.06) 0%, transparent 60%)' }}
        />
        {/* Subtle 48px grid, masked to center */}
        <div
          className='fixed inset-0 z-0 pointer-events-none'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          } as React.CSSProperties}
        />
        <div className='min-h-screen bg-[#0A0F1E] text-white flex relative z-[10]'>
          <AppSidebar />
          <main className='flex-1 min-w-0 overflow-y-auto'>
            {children}
          </main>
        </div>
        <CommandPalette />
        <FloatingAiAssistant />
      </PresentationProvider>
    </ErrorProvider>
  )
}
