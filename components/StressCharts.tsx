import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  ComposedChart, Area, ReferenceLine
} from 'recharts'
import { Position } from '@/lib/api'

const SECTOR_COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6',
                       '#06B6D4','#F97316','#84CC16','#EC4899','#6B7280']

const TOOLTIP_STYLE = {
  background: '#1F2937',
  border: '1px solid #374151',
  borderRadius: 8,
  color: '#F9FAFB'
}

function StatBox({ label, value, sub, color = 'text-white' }: any) {
  return (
    <div className='bg-white/5 rounded-xl p-4'>
      <div className='text-xs text-gray-400 mb-1'>{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      {sub && <div className='text-xs text-gray-500 mt-0.5'>{sub}</div>}
    </div>
  )
}

export default function StressCharts({ charts, positions }: any) {

  const sectorData = Object.entries(charts.sector_weights).map(([name, value]) => ({
    name, value: Number(Number(value).toFixed(1))
  }))

  const lossData = charts.loss_by_position.slice(0, 10).map((p: any) => ({
    ticker: p.ticker,
    loss: Math.abs(p.loss_pct),
    fill: p.loss_pct < -25 ? '#EF4444' : p.loss_pct < -10 ? '#F59E0B' : '#10B981'
  }))

  const compareData = positions.slice(0, 8).map((p: Position) => ({
    ticker: p.ticker,
    before: Number(p.value.toFixed(0)),
    after: Number(p.stressed_value.toFixed(0)),
  }))

  const totalValue = positions.reduce((s: number, p: Position) => s + p.value, 0)

  const totalLossPct = positions.reduce((acc: number, p: Position) =>
    acc + (p.loss / totalValue), 0) * 100

  const drawdownPath = Array.from({ length: 13 }, (_, i) => {
    const progress = i / 12
    const curve = Math.sin(progress * Math.PI)
    const loss = totalLossPct * curve
    return {
      month: i === 0 ? 'Start' : i === 6 ? 'Trough' : i === 12 ? 'Recovery' : `M${i}`,
      value: Number((100 + loss).toFixed(2)),
    }
  })

  const sectorLoss: Record<string, { loss: number; value: number }> = {}
  positions.forEach((p: Position) => {
    const s = (p as any).sector || 'Unknown'
    if (!sectorLoss[s]) sectorLoss[s] = { loss: 0, value: 0 }
    sectorLoss[s].loss += p.loss
    sectorLoss[s].value += p.value
  })

  const sectorContrib = Object.entries(sectorLoss)
    .map(([name, { loss, value }]) => ({
      name,
      contribution: Number(((loss / totalValue) * 100).toFixed(2)),
      weight: Number(((value / totalValue) * 100).toFixed(1)),
    }))
    .sort((a, b) => a.contribution - b.contribution)

  const positionsWithVar = positions.filter((p: any) => p.var_95 !== undefined)
  const weightedVar95 = positionsWithVar.length > 0
    ? positionsWithVar.reduce((acc: number, p: any) =>
        acc + (p.var_95 * (p.value / totalValue)), 0)
    : totalLossPct * 0.6

  const cvar95  = weightedVar95 * 1.4
  const var99   = weightedVar95 * 1.6
  const maxLoss = Math.min(...positions.map((p: Position) => p.loss_pct))

  const renderLabel = ({ name, value }: { name?: string; value?: number }) => {
    const shortName = (name ?? '').split(' ')[0]
    return `${shortName} ${value}%`
  }

  return (
    <div className='space-y-6'>

      {/* Row 1: Tail Risk + Drawdown */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

        <div className='bg-white/3 rounded-2xl p-6 border border-white/8'>
          <h3 className='font-semibold mb-1 text-gray-200'>Tail Risk Metrics</h3>
          <p className='text-xs text-gray-500 mb-4'>Estimated under this stress scenario</p>
          <div className='grid grid-cols-2 gap-3 mb-4'>
            <StatBox label='Portfolio Loss'    value={`${totalLossPct.toFixed(1)}%`}  color='text-red-400' />
            <StatBox label='Worst Position'    value={`${maxLoss.toFixed(1)}%`}        color='text-red-500' />
            <StatBox label='VaR (95%)'         value={`${Math.abs(weightedVar95).toFixed(1)}%`}
              sub='1-day 95% confidence' color='text-orange-400' />
            <StatBox label='CVaR (95%)'        value={`${Math.abs(cvar95).toFixed(1)}%`}
              sub='Expected shortfall'   color='text-orange-500' />
            <StatBox label='VaR (99%)'         value={`${Math.abs(var99).toFixed(1)}%`}
              sub='1-day 99% confidence' color='text-red-400' />
            <StatBox label='Positions at Risk'
              value={`${positions.filter((p: Position) => p.loss_pct < -10).length} / ${positions.length}`}
              sub='Loss > 10%' color='text-yellow-400' />
          </div>
          <div className='mt-2'>
            <div className='flex justify-between text-xs text-gray-500 mb-1'>
              <span>Low risk</span><span>High risk</span>
            </div>
            <div className='w-full h-3 bg-white/10 rounded-full overflow-hidden'>
              <div className='h-full rounded-full transition-all'
                style={{
                  width: `${Math.min(100, Math.abs(totalLossPct) * 3)}%`,
                  background: Math.abs(totalLossPct) > 20 ? '#EF4444'
                    : Math.abs(totalLossPct) > 10 ? '#F59E0B' : '#10B981'
                }} />
            </div>
          </div>
        </div>

        <div className='bg-white/3 rounded-2xl p-6 border border-white/8'>
          <h3 className='font-semibold mb-1 text-gray-200'>Drawdown Timeline</h3>
          <p className='text-xs text-gray-500 mb-4'>Simulated peak → trough → recovery path</p>
          <ResponsiveContainer width='100%' height={220}>
            <ComposedChart data={drawdownPath}>
              <defs>
                <linearGradient id='drawdownGrad' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%'  stopColor='#EF4444' stopOpacity={0.3} />
                  <stop offset='95%' stopColor='#EF4444' stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey='month' tick={{ fill: '#6B7280', fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']}
                tick={{ fill: '#6B7280', fontSize: 11 }}
                tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(v: any) => [`${Number(v).toFixed(1)}%`, 'Portfolio value']}
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{ color: '#F9FAFB' }} />
              <ReferenceLine y={100} stroke='#374151' strokeDasharray='4 4' />
              <Area type='monotone' dataKey='value' stroke='#EF4444'
                strokeWidth={2} fill='url(#drawdownGrad)' />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Sector contribution + Loss by position */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

        <div className='bg-white/3 rounded-2xl p-6 border border-white/8'>
          <h3 className='font-semibold mb-1 text-gray-200'>Loss Contribution by Sector</h3>
          <p className='text-xs text-gray-500 mb-4'>What is driving your losses?</p>
          <ResponsiveContainer width='100%' height={240}>
            <BarChart data={sectorContrib} layout='vertical'>
              <XAxis type='number' tick={{ fill: '#6B7280', fontSize: 11 }}
                tickFormatter={(v) => `${v}%`} />
              <YAxis dataKey='name' type='category'
                tick={{ fill: '#9CA3AF', fontSize: 11 }} width={110} />
              <Tooltip
                formatter={(v: any, name: string) => [
                  `${Number(v).toFixed(2)}%`,
                  name === 'contribution' ? 'Loss contribution' : 'Portfolio weight'
                ]}
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{ color: '#F9FAFB' }}
                itemStyle={{ color: '#F9FAFB' }} />
              <ReferenceLine x={0} stroke='#374151' />
              <Bar dataKey='contribution' name='contribution' radius={[0, 4, 4, 0]}>
                {sectorContrib.map((entry, i) => (
                  <Cell key={i}
                    fill={entry.contribution < -3 ? '#EF4444'
                      : entry.contribution < -1 ? '#F59E0B'
                      : entry.contribution < 0  ? '#6B7280'
                      : '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white/3 rounded-2xl p-6 border border-white/8'>
          <h3 className='font-semibold mb-1 text-gray-200'>Loss by Position</h3>
          <p className='text-xs text-gray-500 mb-4'>Individual position shock (%)</p>
          <ResponsiveContainer width='100%' height={240}>
            <BarChart data={lossData} layout='vertical'>
              <XAxis type='number' tick={{ fill: '#6B7280', fontSize: 11 }} />
              <YAxis dataKey='ticker' type='category'
                tick={{ fill: '#9CA3AF', fontSize: 12 }} width={50} />
              <Tooltip
                formatter={(v: any) => [`-${v}%`, 'Loss']}
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{ color: '#F9FAFB' }}
                itemStyle={{ color: '#F9FAFB' }} />
              <Bar dataKey='loss' radius={[0, 4, 4, 0]}>
                {lossData.map((entry: any, i: number) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Before vs After + Sector Pie */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

        <div className='bg-white/3 rounded-2xl p-6 border border-white/8'>
          <h3 className='font-semibold mb-1 text-gray-200'>Before vs After Stress</h3>
          <p className='text-xs text-gray-500 mb-4'>Position value comparison</p>
          <ResponsiveContainer width='100%' height={220}>
            <BarChart data={compareData}>
              <XAxis dataKey='ticker' tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }}
                tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: any) => [`$${Number(v).toLocaleString()}`, '']}
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{ color: '#F9FAFB' }}
                itemStyle={{ color: '#F9FAFB' }} />
              <Bar dataKey='before' name='Current Value'  fill='#3B82F6' radius={[4,4,0,0]} />
              <Bar dataKey='after'  name='Stressed Value' fill='#EF4444' radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white/3 rounded-2xl p-6 border border-white/8'>
          <h3 className='font-semibold mb-1 text-gray-200'>Sector Allocation</h3>
          <p className='text-xs text-gray-500 mb-4'>Current portfolio weight by sector</p>
          <ResponsiveContainer width='100%' height={220}>
            <PieChart>
              <Pie data={sectorData} dataKey='value' nameKey='name'
                cx='50%' cy='50%' outerRadius={80} label={renderLabel}>
                {sectorData.map((_: any, i: number) => (
                  <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                itemStyle={{ color: '#F9FAFB' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}