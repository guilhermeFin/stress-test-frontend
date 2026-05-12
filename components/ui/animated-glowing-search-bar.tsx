'use client'

import { useRef } from 'react'
import { Send } from 'lucide-react'

interface Props {
  value: string
  onChange: (val: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
  placeholder?: string
}

export function GlowingAdvisorInput({ value, onChange, onSend, onKeyDown, disabled, placeholder }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  return (
    <div className="relative flex items-center justify-center w-full">
      <div className="relative flex items-center justify-center group w-full">

        {/* Layer 1 — outer rotating conic (large blur) */}
        <div className="absolute z-[-1] overflow-hidden h-full w-full max-h-[70px] rounded-xl blur-[3px]
          before:absolute before:content-[''] before:z-[-2] before:w-[999px] before:h-[999px]
          before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
          before:rotate-[60deg]
          before:bg-[conic-gradient(#000,#402fb5_5%,#000_38%,#000_50%,#cf30aa_60%,#000_87%)]
          before:transition-all before:duration-[2000ms]
          group-hover:before:rotate-[-120deg]
          group-focus-within:before:rotate-[420deg] group-focus-within:before:duration-[4000ms]" />

        {/* Layers 2-4 — inner purple/pink conic (medium blur, repeated for depth) */}
        {[0, 1, 2].map(i => (
          <div key={i} className="absolute z-[-1] overflow-hidden h-full w-[calc(100%-4px)] max-h-[65px] rounded-xl blur-[3px]
            before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px]
            before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
            before:rotate-[82deg]
            before:bg-[conic-gradient(rgba(0,0,0,0),#18116a,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#6e1b60,rgba(0,0,0,0)_60%)]
            before:transition-all before:duration-[2000ms]
            group-hover:before:rotate-[-98deg]
            group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]" />
        ))}

        {/* Layer 5 — light inner glow */}
        <div className="absolute z-[-1] overflow-hidden h-full w-[calc(100%-8px)] max-h-[63px] rounded-lg blur-[2px]
          before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px]
          before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
          before:rotate-[83deg]
          before:bg-[conic-gradient(rgba(0,0,0,0)_0%,#a099d8,rgba(0,0,0,0)_8%,rgba(0,0,0,0)_50%,#dfa2da,rgba(0,0,0,0)_58%)]
          before:brightness-[1.4]
          before:transition-all before:duration-[2000ms]
          group-hover:before:rotate-[-97deg]
          group-focus-within:before:rotate-[443deg] group-focus-within:before:duration-[4000ms]" />

        {/* Layer 6 — dark inner conic (tight, defines the visible edge) */}
        <div className="absolute z-[-1] overflow-hidden h-full w-[calc(100%-12px)] max-h-[59px] rounded-xl blur-[0.5px]
          before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px]
          before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
          before:rotate-[70deg]
          before:bg-[conic-gradient(#1c191c,#402fb5_5%,#1c191c_14%,#1c191c_50%,#cf30aa_60%,#1c191c_64%)]
          before:brightness-[1.3]
          before:transition-all before:duration-[2000ms]
          group-hover:before:rotate-[-110deg]
          group-focus-within:before:rotate-[430deg] group-focus-within:before:duration-[4000ms]" />

        {/* Main input surface */}
        <div className="relative w-full group">
          {/* Pink left bleed (fades on hover) */}
          <div className="pointer-events-none absolute w-[30px] h-[20px] bg-[#cf30aa]
            top-[10px] left-[5px] blur-2xl opacity-60 transition-all duration-[2000ms]
            group-hover:opacity-0" />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            className="w-full bg-[#010201] rounded-xl text-white pl-4 pr-12
              text-sm leading-relaxed focus:outline-none placeholder:text-gray-600
              resize-none disabled:opacity-40 py-[18px]"
            style={{ height: '56px', maxHeight: '120px' }}
            onChange={handleChange}
            onKeyDown={onKeyDown}
          />

          {/* Spinning conic decoration (top-right corner) */}
          <div className="absolute h-[42px] w-[40px] overflow-hidden top-[7px] right-[7px] rounded-lg
            before:absolute before:content-[''] before:w-[600px] before:h-[600px]
            before:bg-no-repeat before:top-1/2 before:left-1/2
            before:bg-[conic-gradient(rgba(0,0,0,0),#3d3a4f,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_50%,#3d3a4f,rgba(0,0,0,0)_100%)]
            before:brightness-[1.35] before:animate-spin-slow" />

          {/* Send button */}
          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className="absolute top-[7px] right-[7px] z-10 flex items-center justify-center
              h-[42px] w-[40px] rounded-lg
              bg-gradient-to-b from-[#161329] via-black to-[#1d1b4b]
              border border-transparent
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-opacity hover:opacity-80"
            aria-label="Send message"
          >
            <Send size={15} className="text-[#a099d8]" />
          </button>
        </div>
      </div>
    </div>
  )
}
