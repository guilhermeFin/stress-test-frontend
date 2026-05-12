export interface Skill {
  id: string
  slash: string
  label: string
  description: string
  triggers: string[]
  href: string
  category: 'Wealth Management' | 'Equity Research' | 'Operations'
  badge: 'P0' | 'P1'
  color: string       // Tailwind classes for the slash badge
  aiPrompt: string    // Pre-filled AI question when clicking the skill row
}

export const SKILLS: Skill[] = [
  {
    id: 'client-review',
    slash: '/client-review',
    label: 'Client Review Prep',
    description: 'Performance summary, allocation drift, talking points, and action items for a client meeting.',
    triggers: ['client review', 'meeting prep', 'quarterly review', 'prep for client', 'client meeting'],
    href: '/households',
    category: 'Wealth Management',
    badge: 'P0',
    color: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    aiPrompt: 'Walk me through how to run an effective /client-review — what does the output include and how should I use it in a meeting?',
  },
  {
    id: 'tlh',
    slash: '/tlh',
    label: 'Tax-Loss Harvesting',
    description: 'Scan taxable accounts for loss candidates, wash-sale check, and trade execution plan.',
    triggers: ['tax-loss harvesting', 'TLH', 'harvest losses', 'tax losses', 'unrealized losses', 'year-end tax planning'],
    href: '/tax/tlh',
    category: 'Wealth Management',
    badge: 'P0',
    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    aiPrompt: 'Explain the /tlh scanner — how does it identify candidates, handle wash-sale rules, and what should I tell a client about harvesting losses?',
  },
  {
    id: 'financial-plan',
    slash: '/financial-plan',
    label: 'Financial Plan',
    description: 'Cash flow projection, Monte Carlo retirement success, goals, and scenario modeling.',
    triggers: ['financial plan', 'retirement plan', 'can I retire', 'education funding', 'estate plan', 'plan update'],
    href: '/planning/goals',
    category: 'Wealth Management',
    badge: 'P0',
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    aiPrompt: 'How should I interpret the /financial-plan Monte Carlo results with a client — what funded ratio and success probability are acceptable?',
  },
  {
    id: 'rebalance',
    slash: '/rebalance',
    label: 'Portfolio Rebalance',
    description: 'Drift vs IPS targets across asset classes, tax-aware trade list for all account types.',
    triggers: ['rebalance', 'portfolio drift', 'allocation check', 'rebalancing trades', 'out of balance'],
    href: '/portfolios',
    category: 'Wealth Management',
    badge: 'P0',
    color: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    aiPrompt: 'When running /rebalance, how should I prioritize which accounts to trade in first from a tax perspective?',
  },
  {
    id: 'proposal',
    slash: '/proposal',
    label: 'Investment Proposal',
    description: 'Prospect presentation: firm overview, proposed allocation, expected outcomes, fee structure.',
    triggers: ['investment proposal', 'prospect presentation', 'pitch new client', 'new client presentation', 'proposal for'],
    href: '/households',
    category: 'Wealth Management',
    badge: 'P1',
    color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    aiPrompt: 'What makes a compelling /proposal for a prospect with $3M who is moving from a wirehouse? What should I emphasize?',
  },
  {
    id: 'client-report',
    slash: '/client-report',
    label: 'Client Report',
    description: 'One-page performance and allocation report for a client household.',
    triggers: ['client report', 'performance report', 'account report'],
    href: '/households',
    category: 'Wealth Management',
    badge: 'P1',
    color: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    aiPrompt: 'What are the best practices for sending a /client-report — frequency, what to highlight, and how to frame underperformance?',
  },
  {
    id: 'morning-note',
    slash: '/morning-note',
    label: 'Morning Note',
    description: 'Overnight developments, macro context, and trade ideas — 2-minute read for the 7am meeting.',
    triggers: ['morning note', 'morning meeting', 'what happened overnight', 'trade idea', 'morning call prep', 'daily note'],
    href: '/research/macro',
    category: 'Equity Research',
    badge: 'P1',
    color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    aiPrompt: 'What macro signals should I be watching right now to inform my /morning-note — yield curve, credit spreads, or something else?',
  },
]

export const SKILL_CATEGORIES = [
  'Wealth Management',
  'Equity Research',
  'Operations',
] as const

export const BADGE_COLORS = {
  P0: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20',
  P1: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
} as const
