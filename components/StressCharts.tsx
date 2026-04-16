import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Position } from '@/lib/api'

const SECTOR_COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6',
                       '#06B6D4','#F97316','#84CC16','#EC4899','#6B7280']

export default function StressCharts({ charts, positions }: any) {
  const sectorData = Object.entries(charts.sector_weights).map(([name, value]) => ({
    name, value: Number(Number(value).toFixed(1))
  }))

  const lossData = charts.loss_by_position.slice(0, 8).map((p: any) => ({
    ticker: p.ticker,
    loss: Math.abs(p.loss_pct),
    fill: p.loss_pct < -25 ? '#EF4444' : p.loss_pct < -10 ? '#F59E0B' : '#10B981'
  }))

  const compareData = positions.slice(0, 6).map((p: Position) => ({
    ticker: p.ticker,
    before: Number(p.value.toFixed(0)),
    after: Number(p.stressed_value.toFixed(0)),
  }))

  const renderLabel = ({ name, value }: { name?: string; value?: number }) => {
    const shortName = (name ?? '').split(' ')[0]
    return `${shortName} ${value}%`
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

      <div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
        <h3 className='font-semibold mb-4 text-gray-200'>Loss by Position (%)</h3>
        <ResponsiveContainer width='100%' height={240}>
          <BarChart data={lossData} layout='vertical'>
            <XAxis type='number' tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <YAxis dataKey='ticker' type='category'
              tick={{ fill: '#9CA3AF', fontSize: 12 }} width={50} />
            <Tooltip
              formatter={(v: any) => [`-${v}%`, 'Loss']}
              contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
            <Bar dataKey='loss'>
              {lossData.map((entry: any, i: number) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
        <h3 className='font-semibold mb-4 text-gray-200'>Sector Allocation</h3>
        <ResponsiveContainer width='100%' height={240}>
          <PieChart>
            <Pie data={sectorData} dataKey='value' nameKey='name'
              cx='50%' cy='50%' outerRadius={80}
              label={renderLabel}>
              {sectorData.map((_: any, i: number) => (
                <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{
              background: '#111827', border: '1px solid #374151' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className='bg-gray-900 rounded-2xl p-6 border border-gray-800 lg:col-span-2'>
        <h3 className='font-semibold mb-4 text-gray-200'>Before vs After Stress</h3>
        <ResponsiveContainer width='100%' height={220}>
          <BarChart data={compareData}>
            <XAxis dataKey='ticker' tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }}
              tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(v: any) => [`$${Number(v).toLocaleString()}`, '']}
              contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
            <Bar dataKey='before' name='Current Value' fill='#3B82F6' radius={[4,4,0,0]} />
            <Bar dataKey='after' name='Stressed Value' fill='#EF4444' radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}