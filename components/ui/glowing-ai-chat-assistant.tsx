'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Bot, X, Send, Mic, Paperclip, RotateCcw,
  Copy, Check, Sparkles, Zap, ExternalLink,
} from 'lucide-react'
import { SKILLS, BADGE_COLORS, type Skill } from '@/lib/skills'
import { useError } from '@/lib/error-context'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const MAX_CHARS = 2000

const SUGGESTED = [
  {
    label: 'Client panic script',
    prompt: 'My client is panicking about a 15% drawdown and wants to sell everything. What are my talking points?',
  },
  {
    label: 'Roth conversion',
    prompt: 'Optimal Roth conversion strategy for a 58-year-old in the 24% bracket with $800K in a traditional IRA?',
  },
  {
    label: '60/40 today',
    prompt: 'How should I position a classic 60/40 given current rate levels and inflation dynamics?',
  },
  {
    label: 'Estate trigger',
    prompt: 'What estate planning moves should I prioritize for a client with a $5M estate before the exemption sunset?',
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

export function FloatingAiAssistant() {
  const [open, setOpen]             = useState(false)
  const [messages, setMessages]     = useState<Message[]>([])
  const [input, setInput]           = useState('')
  const [streaming, setStreaming]   = useState(false)
  const [copied, setCopied]         = useState<number | null>(null)
  const [showSkills, setShowSkills] = useState(false)

  const { showError } = useError()

  const bottomRef      = useRef<HTMLDivElement>(null)
  const abortRef       = useRef<AbortController | null>(null)
  const textareaRef    = useRef<HTMLTextAreaElement>(null)
  const skillsBtnRef   = useRef<HTMLButtonElement>(null)
  const skillsDropRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 100)
  }, [open])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        skillsDropRef.current?.contains(e.target as Node) ||
        skillsBtnRef.current?.contains(e.target as Node)
      ) return
      setShowSkills(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const send = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return
    setShowSkills(false)

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
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      const errMsg = err instanceof Error ? err.message : ''
      const isConfig = errMsg.includes('ANTHROPIC_API_KEY')

      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: isConfig
            ? 'AI Advisor is not configured. Contact your administrator.'
            : 'Something went wrong. Please try again.',
        }
        return copy
      })

      showError(
        isConfig
          ? 'The AI Advisor API key is not configured. Add ANTHROPIC_API_KEY to your environment and restart the server.'
          : 'We encountered an error processing your AI Advisor request. Please try again.',
        {
          title: isConfig ? 'Configuration Error' : 'AI Advisor Error',
          errorCode: errMsg || 'Unknown error',
        }
      )
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

  const charsLeft = MAX_CHARS - input.length
  const canSend   = input.trim().length > 0 && !streaming && input.length <= MAX_CHARS

  return (
    <>
      {/* ── Chat window ── */}
      {open && (
        <div
          className='fixed bottom-24 right-6 z-50 w-[384px] flex flex-col
            bg-[#0D1120] border border-white/10 rounded-2xl shadow-2xl shadow-black/60
            animate-pop-in overflow-hidden'
          style={{ height: '540px' }}
        >
          {/* Header */}
          <div className='flex items-center justify-between px-4 py-3
            border-b border-white/[0.07] shrink-0'>
            <div className='flex items-center gap-2.5'>
              <div className='w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25
                flex items-center justify-center'>
                <Sparkles size={13} className='text-violet-400' />
              </div>
              <div>
                <p className='text-sm font-semibold text-white leading-tight'>AI Advisor</p>
                <p className='text-[10px] text-gray-500'>Wealth management · {SKILLS.length} skills</p>
              </div>
            </div>
            <div className='flex items-center gap-1'>
              {messages.length > 0 && (
                <button onClick={reset} title='Clear conversation'
                  className='text-gray-600 hover:text-white p-1.5 rounded-lg
                    hover:bg-white/5 transition-colors'>
                  <RotateCcw size={12} />
                </button>
              )}
              <button onClick={() => setOpen(false)}
                className='text-gray-600 hover:text-white p-1.5 rounded-lg
                  hover:bg-white/5 transition-colors'>
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0'>
            {messages.length === 0 && (
              <div className='space-y-3'>
                <div className='text-center pt-3 pb-1'>
                  <div className='w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/15
                    flex items-center justify-center mx-auto mb-2'>
                    <Sparkles size={18} className='text-violet-400' />
                  </div>
                  <p className='text-sm font-semibold text-white mb-1'>Ask anything</p>
                  <p className='text-xs text-gray-500 leading-relaxed'>
                    Wealth management, tax strategy, client communication
                  </p>
                </div>
                <div className='grid grid-cols-2 gap-1.5'>
                  {SUGGESTED.map(s => (
                    <button key={s.label} onClick={() => send(s.prompt)}
                      className='text-left bg-white/[0.02] hover:bg-white/[0.05]
                        border border-white/[0.06] hover:border-white/[0.12]
                        rounded-xl px-2.5 py-2 transition-all group'>
                      <div className='flex items-start gap-1.5'>
                        <Zap size={10} className='text-violet-400 mt-0.5 shrink-0
                          opacity-60 group-hover:opacity-100 transition-opacity' />
                        <p className='text-[11px] font-medium text-white leading-tight'>{s.label}</p>
                      </div>
                      <p className='text-[10px] text-gray-600 mt-1 leading-snug line-clamp-2'>
                        {s.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className='w-5 h-5 rounded-md bg-violet-500/15 border border-violet-500/20
                    flex items-center justify-center shrink-0 mt-0.5'>
                    <Sparkles size={9} className='text-violet-400' />
                  </div>
                )}
                <div className='max-w-[85%] group relative'>
                  {msg.role === 'user' ? (
                    <div className='bg-[#3B82F6] text-white text-sm px-3 py-2
                      rounded-2xl rounded-tr-sm leading-relaxed whitespace-pre-wrap'>
                      {msg.content}
                    </div>
                  ) : (
                    <div className='bg-white/[0.04] border border-white/[0.07] text-gray-200
                      text-sm px-3 py-2 rounded-2xl rounded-tl-sm leading-relaxed'>
                      {msg.content ? (
                        <p
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                          className='[&>p]:mt-2 [&>p:first-child]:mt-0'
                        />
                      ) : streaming && idx === messages.length - 1 ? (
                        <span className='inline-flex gap-1 items-center h-4'>
                          <span className='w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]' />
                          <span className='w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]' />
                          <span className='w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]' />
                        </span>
                      ) : null}
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.content && (
                    <button onClick={() => copyMsg(idx, msg.content)}
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

          {/* Skills dropdown */}
          {showSkills && (
            <div ref={skillsDropRef}
              className='border-t border-white/[0.06] bg-[#0A0D18] max-h-[200px]
                overflow-y-auto shrink-0'>
              <div className='px-3 py-2 border-b border-white/[0.04]'>
                <p className='text-[10px] font-semibold text-gray-500 uppercase tracking-wider'>
                  Skills — {SKILLS.length} available
                </p>
              </div>
              <div className='p-2 space-y-0.5'>
                {SKILLS.map((skill: Skill) => (
                  <button key={skill.id}
                    onClick={() => { send(skill.aiPrompt); setShowSkills(false) }}
                    className='w-full text-left flex items-start gap-2 px-2 py-2 rounded-lg
                      hover:bg-white/[0.04] transition-colors group'>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5
                      rounded-md border shrink-0 mt-0.5 ${skill.color}`}>
                      {skill.slash}
                    </span>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-1.5'>
                        <p className='text-[11px] font-medium text-gray-300'>{skill.label}</p>
                        <span className={`text-[9px] font-bold px-1 py-0.5 rounded-full border
                          ${BADGE_COLORS[skill.badge]}`}>
                          {skill.badge}
                        </span>
                      </div>
                      <p className='text-[10px] text-gray-600 leading-snug line-clamp-1'>
                        {skill.description}
                      </p>
                    </div>
                    <Link href={skill.href} onClick={e => e.stopPropagation()}
                      title={`Open ${skill.label}`}
                      className='shrink-0 p-1 rounded-md opacity-0 group-hover:opacity-100
                        text-gray-500 hover:text-white hover:bg-white/10 transition-all mt-0.5'>
                      <ExternalLink size={10} />
                    </Link>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className='border-t border-white/[0.07] px-3 pt-2.5 pb-3 shrink-0 space-y-2'>
            <p className='text-[9px] text-gray-700 text-center'>
              AI-generated — verify before client delivery · Not financial advice
            </p>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={streaming}
              placeholder='Ask about markets, tax strategy, client communication…'
              rows={2}
              className='w-full bg-white/[0.03] border border-white/[0.08] rounded-xl
                px-3 py-2 text-sm text-white placeholder:text-gray-600
                focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05]
                transition-all resize-none disabled:opacity-50'
            />

            <div className='flex items-center gap-2'>
              <button title='Attach file'
                className='p-1.5 rounded-lg text-gray-600 hover:text-white
                  hover:bg-white/[0.04] transition-colors'>
                <Paperclip size={14} />
              </button>

              <button
                ref={skillsBtnRef}
                onClick={() => setShowSkills(v => !v)}
                title='Skills commands'
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium
                  transition-colors border
                  ${showSkills
                    ? 'text-violet-400 bg-violet-500/10 border-violet-500/30'
                    : 'text-gray-500 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06] hover:border-white/[0.12]'}`}>
                <Sparkles size={11} />
                <span>Skills</span>
              </button>

              <button title='Voice input'
                className='p-1.5 rounded-lg text-gray-600 hover:text-white
                  hover:bg-white/[0.04] transition-colors'>
                <Mic size={14} />
              </button>

              <div className='flex-1' />

              <span className={`text-[10px] tabular-nums transition-colors
                ${charsLeft < 100 ? 'text-orange-400' : 'text-gray-700'}`}>
                {charsLeft}
              </span>

              <button
                onClick={() => send(input)}
                disabled={!canSend}
                className='p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white
                  disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95'>
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating trigger button ── */}
      <div className='fixed bottom-6 right-6 z-50 w-14 h-14 relative'>
        {/* Spinning conic-gradient ring — extends 3px beyond button edges */}
        <div
          className='absolute rounded-full [animation:fab-ring-spin_4s_linear_infinite]'
          style={{
            inset: '-3px',
            background: 'conic-gradient(from 0deg, #4f46e5, #7c3aed, #a855f7, #c084fc, #818cf8, #4f46e5)',
          }}
        />
        {/* Button sits on top, its bg covers the ring center leaving only the 3px rim */}
        <button
          onClick={() => setOpen(v => !v)}
          aria-label='Toggle AI Advisor'
          className={`absolute inset-0 rounded-full flex items-center justify-center z-10
            shadow-lg shadow-black/50 bg-violet-600 hover:bg-violet-500
            transition-all duration-200
            ${open ? 'rotate-90 scale-95' : 'hover:scale-105'}`}
        >
          {open
            ? <X size={20} className='text-white' />
            : <Bot size={22} className='text-white' />}
        </button>
      </div>
    </>
  )
}
