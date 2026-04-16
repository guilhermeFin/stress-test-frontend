'use client'

import { useState } from 'react'
import { Position } from '@/lib/api'
import { ChevronUp, ChevronDown } from 'lucide-react'

const RISK_COLORS = {
  High: 'bg-red-900/40 text-red-400 border border-red-800',
  Medium: 'bg-yellow-900/40 text-yellow-400 border border-yellow-800',
  Low: 'bg-green-900/40 text-green-400 border border-green-800',
}

export default function PositionTable({ positions }: { positions: Position[] }) {
  const [sortKey, setSortKey] = useState<keyof Position>('loss_pct')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = [...positions].sort((a, b) => {
    const av = a[sortKey] as number
    const bv = b[sortKey] as number
    return sortDir === 'asc' ? av - bv : bv - av
  })

  const toggleSort = (key: keyof Position) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  const SortIcon = ({ k }: { k: keyof Position }) => sortKey === k
    ? (sortDir === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)
    : null

  return (
    <div className='bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden'>
      <div className='p-6 pb-3'>
        <h3 className='font-semibold text-gray-200'>Position Detail</h3>
        <p className='text-xs text-gray-500 mt-1'>Click column headers to sort</p>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-800 text-gray-400'>
            <tr>
              <th className='px-4 py-3 text-left'>Ticker</th>
              <th className='px-4 py-3 text-left'>Sector</th>
              <th className='px-4 py-3 text-right cursor-pointer hover:text-white'
                onClick={() => toggleSort('weight')}>
                <span className='flex items-center justify-end gap-1'>
                  Weight <SortIcon k='weight' /></span></th>
              <th className='px-4 py-3 text-right cursor-pointer hover:text-white'
                onClick={() => toggleSort('loss_pct')}>
                <span className='flex items-center justify-end gap-1'>
                  Stress Loss <SortIcon k='loss_pct' /></span></th>
              <th className='px-4 py-3 text-right cursor-pointer hover:text-white'
                onClick={() => toggleSort('var_95')}>
                <span className='flex items-center justify-end gap-1'>
                  VaR 95% <SortIcon k='var_95' /></span></th>
              <th className='px-4 py-3 text-right'>Beta</th>
              <th className='px-4 py-3 text-center'>Risk</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr key={p.ticker}
                className={`border-t border-gray-800 hover:bg-gray-800/50 transition-colors
                ${i % 2 === 0 ? '' : 'bg-gray-900/50'}`}>
                <td className='px-4 py-3'>
                  <div className='font-medium text-white'>{p.ticker}</div>
                  <div className='text-xs text-gray-500'>{p.name.substring(0, 20)}</div>
                </td>
                <td className='px-4 py-3 text-gray-400 text-xs'>{p.sector}</td>
                <td className='px-4 py-3 text-right text-gray-300'>{p.weight}%</td>
                <td className='px-4 py-3 text-right font-medium text-red-400'>
                  {p.loss_pct.toFixed(1)}%</td>
                <td className='px-4 py-3 text-right text-gray-400'>{p.var_95}%</td>
                <td className='px-4 py-3 text-right text-gray-300'>{p.beta}</td>
                <td className='px-4 py-3 text-center'>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${RISK_COLORS[p.risk_level]}`}>{p.risk_level}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}