'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { X, Sparkles, RotateCcw, Copy, Check, Zap, ExternalLink, ChevronRight } from 'lucide-react'
import { useAdvisor } from '@/lib/advisor-context'
import { GlowingAdvisorInput } from '@/components/ui/animated-glowing-search-bar'
import { SKILLS, BADGE_COLORS, type Skill } from '@/lib/skills'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED = [
  {
    label: 'Client panic script',
    prompt: "My client is panicking about a 15% drawdown and wants to sell everything. What are my talking points?",
  },
  {
    label: 'Roth conversion',
    prompt: "Optimal Roth conversion strategy for a 58-year-old in the 24% bracket with $800K in a traditional IRA?",
  },
  {
    label: '60/40 today',
    prompt: "How should I position a classic 60/40 given current rate levels and inflation dynamics?",
  },
  {
    label: 'Estate trigger',
    prompt: "What estate planning moves should I prioritize for a client with a $5M estate before the exemption sunset?",
  },
]

function renderMarkdown(raw: string) {
  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-[#93C5FD] font-mono text-[11px]">$1</code>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>')
}

// ── Skills sidebar ────────────────────────────────────────────────────────────

function SkillRow({ skill, onAsk }: { skill: Skill; onAsk: (prompt: string) => void }) {
  return (
    <div
      onClick={() => onAsk(skill.aiPrompt)}
      title={`Ask AI about ${skill.slash}`}
      className='group flex items-start gap-2 px-2.5 py-2 rounded-lg cursor-pointer
        hover:bg-white/[0.04] transition-colors'
    >
      <div className='flex-1 min-w-0 space-y-0.5'>
        <div className='flex items-center gap-1.5 flex-wrap'>
          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${skill.color}`}>
            {skill.slash}
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${BADGE_COLORS[skill.badge]}`}>
            {skill.badge}
          </span>
        </div>
        <p className='text-[11px] font-medium text-gray-300 leading-tight'>{skill.label}</p>
        <p className='text-[10px] text-gray-600 leading-snug line-clamp-2'>{skill.description}</p>
      </div>

      <Link
        href={skill.href}
        onClick={e => e.stopPropagation()}
        title={`Open ${skill.label}`}
        className='shrink-0 p-1 rounded-md opacity-0 group-hover:opacity-100
          text-gray-500 hover:text-white hover:bg-white/10 transition-all mt-0.5'
      >
        <ExternalLink size={11} />
      </Link>
    </div>
  )
}

function SkillsSidebar({ onAsk }: { onAsk: (prompt: string) => void }) {
  const categories = Array.from(new Set(SKILLS.map(s => s.category)))

  return (
    <div className='w-[195px] border-r border-white/[0.06] flex flex-col shrink-0 min-h-0'>
      {/* Sidebar header */}
      <div className='px-3 py-3 border-b border-white/[0.05] shrink-0'>
        <div className='flex items-center justify-between'>
          <p className='text-[10px] font-semibold text-gray-500 uppercase tracking-wider'>
            Skills
          </p>
          <span className='text-[10px] text-gray-600 tabular-nums'>{SKILLS.length} available</span>
        </div>
        <p className='text-[10px] text-gray-700 mt-0.5 leading-snug'>
          Click any skill to ask the AI about it, or <ChevronRight size={9} className='inline' /> to open.
        </p>
      </div>

      {/* Skill list */}
      <div className='flex-1 overflow-y-auto py-2 px-1.5 space-y-3'>
        {categories.map(cat => {
          const catSkills = SKILLS.filter(s => s.category === cat)
          return (
            <div key={cat}>
              <p className='text-[9px] font-semibold text-gray-600 uppercase tracking-wider px-2 mb-1'>
                {cat}
              </p>
              <div className='space-y-0.5'>
                {catSkills.map(skill => (
                  <SkillRow key={skill.id} skill={skill} onAsk={onAsk} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer hint */}
      <div className='px-3 py-2.5 border-t border-white/[0.05] shrink-0'>
        <p className='text-[9px] text-gray-700 leading-snug'>
          Press <kbd className='font-mono text-gray-600 bg-white/[0.05] px-1 rounded'>⌘K</kbd> for full skill search
        </p>
      </div>
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────

export function AdvisorPanel() {
  const { isOpen, close } = useAdvisor()
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState('')
  const [streaming, setStreaming]  = useState(false)
  const [copied, setCopied]       = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef  = useRef<AbortController | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return

    const userMsg: Message = { role: 'user', content: text.trim() }
    const history = [...messages, userMsg]
    setMessages([...history, { role: 'assistant', content: '' }])
    setInput('')
    setStreaming(true)
    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error(await res.text())

      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer    = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw || raw === '[DONE]') continue
          try {
            const evt = JSON.parse(raw)
            if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
              setMessages(prev => {
                const copy = [...prev]
                copy[copy.length - 1] = {
                  ...copy[copy.length - 1],
                  content: copy[copy.length - 1].content + evt.delta.text,
                }
                return copy
              })
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return
      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: err.message.includes('ANTHROPIC_API_KEY')
            ? 'AI Advisor is not configured. Add **ANTHROPIC_API_KEY** to your `.env.local` file and restart.'
            : 'Something went wrong. Please try again.',
        }
        return copy
      })
    } finally {
      setStreaming(false)
    }
  }, [messages, streaming])

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const copyMsg = (idx: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  const reset = () => {
    abortRef.current?.abort()
    setMessages([])
    setStreaming(false)
    setInput('')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel — wider to fit sidebar + chat */}
      <div className={`fixed right-0 top-0 h-screen w-[660px] z-50 flex flex-col
        bg-[#07090F] border-l border-white/[0.07] shadow-2xl
        transition-transform duration-200 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* ── Header ── */}
        <div className='flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/20
              flex items-center justify-center'>
              <Sparkles size={15} className='text-[#3B82F6]' />
            </div>
            <div>
              <p className='text-sm font-semibold text-white leading-tight'>AI Advisor</p>
              <p className='text-[10px] text-gray-500 leading-none mt-0.5'>
                Wealth management · Claude · {SKILLS.length} skills
              </p>
            </div>
          </div>
          <div className='flex items-center gap-1'>
            {messages.length > 0 && (
              <button onClick={reset} title='Clear conversation'
                className='text-gray-600 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors'>
                <RotateCcw size={13} />
              </button>
            )}
            <button onClick={close}
              className='text-gray-600 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors'>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Body: sidebar + chat ── */}
        <div className='flex flex-1 min-h-0'>

          {/* Left: skills sidebar */}
          <SkillsSidebar onAsk={prompt => { setInput(prompt); send(prompt) }} />

          {/* Right: chat */}
          <div className='flex flex-col flex-1 min-w-0 min-h-0'>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0'>

              {messages.length === 0 && (
                <div className='space-y-3'>
                  <div className='text-center pt-2 pb-1'>
                    <div className='w-10 h-10 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/15
                      flex items-center justify-center mx-auto mb-3'>
                      <Sparkles size={18} className='text-[#3B82F6]' />
                    </div>
                    <p className='text-sm font-semibold text-white mb-1'>
                      Ask anything about wealth management
                    </p>
                    <p className='text-xs text-gray-500 max-w-[260px] mx-auto leading-relaxed'>
                      Or click a skill on the left to learn how to use it.
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-[10px] text-gray-600 font-medium uppercase tracking-wider px-0.5'>
                      Quick starts
                    </p>
                    {SUGGESTED.map(s => (
                      <button
                        key={s.label}
                        onClick={() => send(s.prompt)}
                        className='w-full text-left bg-white/[0.025] hover:bg-white/[0.05]
                          border border-white/[0.06] hover:border-white/[0.12]
                          rounded-xl px-3 py-2.5 transition-all group'>
                        <div className='flex items-start gap-2'>
                          <Zap size={11} className='text-[#3B82F6] mt-0.5 shrink-0 opacity-60 group-hover:opacity-100' />
                          <div>
                            <p className='text-xs font-medium text-white leading-tight'>{s.label}</p>
                            <p className='text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-1'>
                              {s.prompt}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className='w-6 h-6 rounded-md bg-[#3B82F6]/15 border border-[#3B82F6]/20
                      flex items-center justify-center shrink-0 mt-0.5'>
                      <Sparkles size={11} className='text-[#3B82F6]' />
                    </div>
                  )}

                  <div className='max-w-[88%] group relative'>
                    {msg.role === 'user' ? (
                      <div className='bg-[#3B82F6] text-white text-sm px-3.5 py-2.5
                        rounded-2xl rounded-tr-sm leading-relaxed whitespace-pre-wrap'>
                        {msg.content}
                      </div>
                    ) : (
                      <div className='bg-white/[0.04] border border-white/[0.07] text-gray-200
                        text-sm px-3.5 py-2.5 rounded-2xl rounded-tl-sm leading-relaxed'>
                        {msg.content ? (
                          <p
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                            className='[&>p]:mt-2 [&>p:first-child]:mt-0'
                          />
                        ) : streaming && idx === messages.length - 1 ? (
                          <span className='inline-flex gap-1 items-center h-4'>
                            <span className='w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]' />
                            <span className='w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]' />
                            <span className='w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]' />
                          </span>
                        ) : null}
                      </div>
                    )}

                    {msg.role === 'assistant' && msg.content && (
                      <button
                        onClick={() => copyMsg(idx, msg.content)}
                        className='absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100
                          flex items-center gap-1 text-[10px] text-gray-600 hover:text-gray-400
                          transition-all whitespace-nowrap'>
                        {copied === idx
                          ? <><Check size={9} /> Copied</>
                          : <><Copy size={9} /> Copy</>}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* Disclaimer */}
            <p className='text-[10px] text-gray-700 text-center px-4 py-1 shrink-0'>
              AI-generated — verify before client delivery · Not financial or legal advice
            </p>

            {/* Input */}
            <div className='px-4 pb-4 pt-1.5 shrink-0'>
              <GlowingAdvisorInput
                value={input}
                onChange={setInput}
                onSend={() => send(input)}
                onKeyDown={onKeyDown}
                disabled={streaming}
                placeholder='Ask about markets, tax strategy, client communication…'
              />
              <p className='text-[10px] text-gray-700 mt-2 text-right'>
                Enter to send · Shift+Enter for newline
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
