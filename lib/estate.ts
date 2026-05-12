// FastAPI contract:
// GET    /api/v1/estate/:household_id              → EstateProfile
// PUT    /api/v1/estate/:household_id              → EstateProfile
// POST   /api/v1/estate/:household_id/gifts        → GiftRecord
// DELETE /api/v1/estate/gifts/:id
// GET    /api/v1/estate/:household_id/projection   → EstateTaxProjection

// ── Types ────────────────────────────────────────────────────────────────────

export type MemberRole = 'primary' | 'spouse' | 'child' | 'grandchild' | 'trust' | 'charity'

export interface FamilyMember {
  id: string
  name: string
  role: MemberRole
  dob?: string
  is_beneficiary: boolean
  beneficiary_pct?: number
  relationship?: string
}

export interface GiftRecord {
  id: string
  from_member_id: string
  to_member_id: string
  amount: number
  date: string
  gift_type: 'annual_exclusion' | 'lifetime_exemption' | 'educational_exclusion' | 'medical_exclusion' | 'charity'
  description?: string
}

export interface DocumentStatus {
  type: string
  status: 'current' | 'outdated' | 'missing'
  last_updated?: string
  notes?: string
}

export interface EstateTaxProjection {
  gross_estate: number
  marital_deduction: number
  charitable_deduction: number
  debts_and_expenses: number
  taxable_estate: number
  lifetime_exemption_used: number
  exemption_remaining: number
  federal_estate_tax: number
  state_estate_tax: number
  total_estate_tax: number
  effective_estate_rate: number
  heirs_receive: number
}

// ── 2025 Federal estate tax constants ────────────────────────────────────────

export const FEDERAL_EXEMPTION_PER_PERSON = 13_990_000  // 2025
export const ANNUAL_GIFT_EXCLUSION         = 19_000       // 2025 per recipient
export const FEDERAL_ESTATE_RATE           = 0.40

// Simplified state estate tax (a few common states)
export const STATE_ESTATE_TAX: Record<string, { exemption: number; rate: number }> = {
  'None':          { exemption: Infinity, rate: 0 },
  'Massachusetts': { exemption: 2_000_000, rate: 0.16 },
  'Oregon':        { exemption: 1_000_000, rate: 0.16 },
  'Washington':    { exemption: 2_193_000, rate: 0.20 },
  'Minnesota':     { exemption: 3_000_000, rate: 0.16 },
  'New York':      { exemption: 7_160_000, rate: 0.16 },
  'Hawaii':        { exemption: 5_490_000, rate: 0.20 },
  'Illinois':      { exemption: 4_000_000, rate: 0.16 },
  'Maryland':      { exemption: 5_000_000, rate: 0.16 },
  'Connecticut':   { exemption: 13_990_000, rate: 0.12 },
}

export const DOCUMENT_TYPES = [
  'Revocable Living Trust',
  'Pour-Over Will',
  'Durable Power of Attorney',
  'Healthcare Directive',
  'HIPAA Authorization',
  'Beneficiary Designations',
  'Life Insurance Policies',
  'Business Succession Plan',
]

// ── Calculation engine ────────────────────────────────────────────────────────

export function calculateEstateTax(
  gross_estate: number,
  married: boolean,
  lifetime_exemption_used: number,
  state: string,
  marital_deduction = 0,
  charitable_deduction = 0,
  debts = 0,
): EstateTaxProjection {
  const taxable_estate = Math.max(0, gross_estate - marital_deduction - charitable_deduction - debts)

  const exemption_per_person = FEDERAL_EXEMPTION_PER_PERSON
  const total_exemption = married ? exemption_per_person * 2 : exemption_per_person
  const exemption_remaining = Math.max(0, total_exemption - lifetime_exemption_used)

  const federal_taxable = Math.max(0, taxable_estate - exemption_remaining)
  const federal_estate_tax = federal_taxable * FEDERAL_ESTATE_RATE

  const state_config = STATE_ESTATE_TAX[state] ?? STATE_ESTATE_TAX['None']
  const state_taxable = Math.max(0, taxable_estate - state_config.exemption)
  const state_estate_tax = state_taxable * state_config.rate

  const total_estate_tax = federal_estate_tax + state_estate_tax

  return {
    gross_estate,
    marital_deduction,
    charitable_deduction,
    debts_and_expenses: debts,
    taxable_estate,
    lifetime_exemption_used,
    exemption_remaining,
    federal_estate_tax,
    state_estate_tax,
    total_estate_tax,
    effective_estate_rate: taxable_estate > 0 ? total_estate_tax / taxable_estate : 0,
    heirs_receive: Math.max(0, gross_estate - debts - total_estate_tax),
  }
}

export function annualGiftingCapacity(recipientCount: number, married: boolean): number {
  return ANNUAL_GIFT_EXCLUSION * recipientCount * (married ? 2 : 1)
}

// ── Mock data ─────────────────────────────────────────────────────────────────

export const MOCK_FAMILY: FamilyMember[] = [
  { id: 'm1', name: 'James Harrison', role: 'primary',     dob: '1968-04-12', is_beneficiary: false },
  { id: 'm2', name: 'Susan Harrison', role: 'spouse',      dob: '1971-07-30', is_beneficiary: false },
  { id: 'm3', name: 'Emma Harrison',  role: 'child',       dob: '2003-11-05', is_beneficiary: true, beneficiary_pct: 50 },
  { id: 'm4', name: 'Liam Harrison',  role: 'child',       dob: '2006-02-18', is_beneficiary: true, beneficiary_pct: 50 },
]

export const MOCK_GIFTS: GiftRecord[] = [
  { id: 'g1', from_member_id: 'm1', to_member_id: 'm3', amount: 19_000, date: '2025-01-15', gift_type: 'annual_exclusion', description: 'Annual exclusion gift' },
  { id: 'g2', from_member_id: 'm2', to_member_id: 'm3', amount: 19_000, date: '2025-01-15', gift_type: 'annual_exclusion', description: 'Annual exclusion gift' },
  { id: 'g3', from_member_id: 'm1', to_member_id: 'm4', amount: 19_000, date: '2025-01-15', gift_type: 'annual_exclusion', description: 'Annual exclusion gift' },
  { id: 'g4', from_member_id: 'm2', to_member_id: 'm4', amount: 19_000, date: '2025-01-15', gift_type: 'annual_exclusion', description: 'Annual exclusion gift' },
  { id: 'g5', from_member_id: 'm1', to_member_id: 'm3', amount: 45_000, date: '2024-08-20', gift_type: 'educational_exclusion', description: 'College tuition (direct to institution)' },
]

export const MOCK_DOCUMENTS: DocumentStatus[] = [
  { type: 'Revocable Living Trust',   status: 'current',  last_updated: '2023-06-01' },
  { type: 'Pour-Over Will',           status: 'current',  last_updated: '2023-06-01' },
  { type: 'Durable Power of Attorney', status: 'outdated', last_updated: '2018-03-15', notes: 'Predecessor law — recommend update' },
  { type: 'Healthcare Directive',     status: 'current',  last_updated: '2022-11-10' },
  { type: 'HIPAA Authorization',      status: 'missing' },
  { type: 'Beneficiary Designations', status: 'outdated', last_updated: '2019-04-01', notes: 'Does not reflect 2023 estate plan update' },
  { type: 'Life Insurance Policies',  status: 'current',  last_updated: '2024-01-15' },
  { type: 'Business Succession Plan', status: 'missing' },
]
