import type { CaseStatus } from './types'

export type SegmentKey = 'verified' | 'awaiting' | 'attention' | 'not_counted'

export const SEGMENT_ORDER: SegmentKey[] = ['verified', 'awaiting', 'attention', 'not_counted']

/** Case statuses that belong to each overview segment. Verified and not-counted items have no open case. */
export const SEGMENT_STATUSES: Record<SegmentKey, CaseStatus[]> = {
  verified: [],
  awaiting: ['pending_approval'],
  attention: ['needs_review', 'manual_review'],
  not_counted: [],
}

export interface MissingItem {
  name: string
  units: number
  value: number
  status: CaseStatus
  caseId: string
}

export interface StockSummary {
  total: number
  counts: Record<SegmentKey, number>
  lastCount: string | null
  missing: {
    units: number
    value: number
    explained: number
    unexplained: number
    items: MissingItem[]
  }
  /** A count that has been started but not submitted yet. */
  inProgress?: { counted: number; total: number; by: string; startedAt: string }
}

export interface StaffProgress {
  counted: number
  total: number
  matched: number
  differ: number
  lastSubmitted: string | null
}

export function verifiedPercent(s: Pick<StockSummary, 'total' | 'counts'>) {
  if (s.total === 0) return 0
  return Math.round((s.counts.verified / s.total) * 100)
}

export function formatRM(n: number) {
  return `RM ${n.toFixed(2)}`
}

export const MANAGER_SUMMARY: StockSummary = {
  total: 12,
  counts: { verified: 7, awaiting: 1, attention: 2, not_counted: 2 },
  lastCount: 'today 09:12',
  missing: {
    units: 14,
    value: 39.9,
    explained: 17.5,
    unexplained: 22.4,
    items: [
      { name: 'Bottled Drink A', units: 7, value: 17.5, status: 'pending_approval', caseId: 'INV-0001' },
      { name: 'Snack Biscuits B', units: 4, value: 12.8, status: 'manual_review', caseId: 'INV-0002' },
      { name: 'Canned Coffee C', units: 3, value: 9.6, status: 'needs_review', caseId: 'INV-0003' },
    ],
  },
}

export const ALL_VERIFIED_SUMMARY: StockSummary = {
  total: 12,
  counts: { verified: 12, awaiting: 0, attention: 0, not_counted: 0 },
  lastCount: 'today 09:12',
  missing: { units: 0, value: 0, explained: 0, unexplained: 0, items: [] },
}

export const NO_COUNT_SUMMARY: StockSummary = {
  total: 12,
  counts: { verified: 0, awaiting: 0, attention: 0, not_counted: 12 },
  lastCount: null,
  missing: { units: 0, value: 0, explained: 0, unexplained: 0, items: [] },
}

export const IN_PROGRESS_SUMMARY: StockSummary = {
  ...MANAGER_SUMMARY,
  inProgress: { counted: 5, total: 12, by: 'Staff A', startedAt: '10:40' },
}

export const STAFF_PROGRESS: StaffProgress = {
  counted: 8,
  total: 12,
  matched: 6,
  differ: 2,
  lastSubmitted: 'today 09:12',
}
