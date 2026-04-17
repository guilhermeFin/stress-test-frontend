import { Summary } from '@/lib/api'
import { TrendingDown, AlertTriangle, BarChart2, DollarSign, PiggyBank, Receipt } from 'lucide-react'

function Card({ label, value, sub, color, icon: Icon }: any) {
  return (
    <div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
      <div className='flex justify-between items-start'>
        <span className='text-sm text-gray-400'>{label}</span>
        <Icon size={18} className={color} />
      </div>
      <div className={`text-3xl font-bold mt-2 ${color}`}>{value}</div>
      {sub && <div className='text-xs text-gray-500 mt-1'>{sub}</div>}
    </div>
  )
}

export default function SummaryCards({ summary }: { summary: Summary }) {
  const fmt = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(n)

  const severityColor = summary.severity_label === 'Extreme' ? 'text-red-400'
    : summary.severity_label === 'Severe' ? 'text-orange-400'
    : summary.severity_label === 'Moderate' ? 'text-yellow-400'
    : 'text-green-400'

  const uglColor = summary.total_unrealized_gl >= 0 ? 'text-green-400' : 'text-red-400'

  return (
    <div className='space-y-4'>
      {/* Row 1 — Core stress results */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card label='Portfolio Value' value={fmt(summary.total_value)}
          color='text-white' icon={DollarSign} />
        <Card label='Stressed Value' value={fmt(summary.stressed_value)}
          sub='Under scenario conditions' color='text-red-400' icon={TrendingDown} />
        <Card label='Total Loss' value={`${summary.total_loss_pct.toFixed(1)}%`}
          sub={`${fmt(summary.total_loss)} absolute`}
          color='text-red-400' icon={AlertTriangle} />
        <Card label='Scenario Severity' value={summary.severity_label}
          sub={`Sharpe: ${summary.sharpe_before} → ${summary.sharpe_after}`}
          color={severityColor} icon={BarChart2} />
      </div>

      {/* Row 2 — Cost basis & tax (only shown if available) */}
      {summary.total_cost_basis > 0 && (
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card label='Total Cost Basis' value={fmt(summary.total_cost_basis)}
            color='text-gray-300' icon={PiggyBank} />
          <Card label='Unrealized G/L' value={fmt(summary.total_unrealized_gl)}
            sub='Before stress event' color={uglColor} icon={TrendingDown} />
          <Card label='Est. Tax Impact' value={fmt(summary.total_tax_impact ?? 0)}
            sub='20% CGT on losses' color='text-orange-400' icon={Receipt} />
          <Card label='After-Tax Loss' value={fmt(summary.total_loss + (summary.total_tax_impact ?? 0))}
            sub='Loss net of tax benefit' color='text-red-400' icon={AlertTriangle} />
        </div>
      )}
    </div>
  )
}