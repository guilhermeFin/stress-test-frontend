'use client'

import { useState } from 'react'
import { FileText, Users, ArrowRightLeft, Download } from 'lucide-react'
import { exportPdf } from '@/lib/api'

const tabs = [
  { key: 'advisor_summary', label: 'Advisor Note', icon: FileText },
  { key: 'client_explanation', label: 'Client Letter', icon: Users },
  { key: 'suggestions', label: 'Suggestions', icon: ArrowRightLeft },
]

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^## (.+)$/gm, '<p class="text-white font-semibold text-base mb-2">$1</p>')
    .replace(/^# (.+)$/gm, '<p class="text-white font-semibold text-base mb-2">$1</p>')
    .replace(/\n\n/g, '</p><p class="mt-3">')
    .replace(/\n/g, '<br/>')
}

export default function ExplanationPanel({ explanation }: { explanation: any }) {
  const [active, setActive] = useState('advisor_summary')
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const raw = sessionStorage.getItem('stressResults')
      if (raw) await exportPdf(JSON.parse(raw))
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className='bg-white/3 rounded-2xl border border-white/8'>
      <div className='flex items-center justify-between p-6 pb-0'>
        <div className='flex gap-1'>
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActive(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                transition-all duration-150 ${active === key
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'}`}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
        <button onClick={handleExport} disabled={exporting}
          className='flex items-center gap-2 text-sm text-gray-400
            hover:text-white transition-colors'>
          <Download size={14} />
          {exporting ? 'Generating...' : 'Export PDF'}
        </button>
      </div>
      <div className='p-6'>
        <div
          className='bg-black/20 rounded-xl p-5 text-gray-300 text-sm leading-relaxed min-h-[120px]'
          dangerouslySetInnerHTML={{ __html: renderMarkdown(explanation[active]) }}
        />
        {active === 'client_explanation' && (
          <button
            onClick={() => navigator.clipboard.writeText(explanation.client_explanation)}
            className='mt-3 text-xs text-blue-400 hover:underline'>
            Copy to clipboard
          </button>
        )}
      </div>
    </div>
  )
}