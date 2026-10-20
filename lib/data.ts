import type { CaseStatus, Product, Role, StockCase, User } from './types'

export const USERS: Record<Role, User> = {
  staff: { id: 'u-staff-a', name: 'Staff A', role: 'staff' },
  manager: { id: 'u-manager-k', name: 'Manager K', role: 'manager' },
  owner: { id: 'u-owner-r', name: 'Owner R', role: 'owner' },
}

export const ROLE_INFO: Record<Role, { label: string; description: string }> = {
  staff: { label: 'Staff', description: 'Counts stock and submits cases. Cannot approve.' },
  manager: { label: 'Manager', description: 'Approves, rejects, requests review or overrides.' },
  owner: { label: 'Owner', description: 'Read-only access to cases and history.' },
}

export const PRODUCTS: Product[] = [
  { id: 'p-a', name: 'Bottled Drink A', recorded: 50 },
  { id: 'p-b', name: 'Snack Biscuits B', recorded: 40 },
  { id: 'p-c', name: 'Canned Coffee C', recorded: 24 },
  { id: 'p-d', name: 'Bottled Drink D', recorded: 43 },
  { id: 'p-e', name: 'Paper Towels E', recorded: 30 },
  { id: 'p-f', name: 'Instant Noodles F', recorded: 60 },
  { id: 'p-g', name: 'Mineral Water G', recorded: 80 },
]

export const OPEN_STATUSES: CaseStatus[] = ['pending_approval', 'manual_review', 'needs_review']
export const CLOSED_STATUSES: CaseStatus[] = ['completed', 'rejected']

export const SEED_CASES: StockCase[] = [
  {
    id: 'INV-0001',
    product: 'Bottled Drink A',
    recorded: 50,
    counted: 43,
    status: 'pending_approval',
    createdAt: '2026-10-20T09:12:00',
    createdBy: 'Staff A',
    versions: [
      {
        version: 1,
        createdAt: '2026-10-20T09:13:00',
        evidenceState: 'supported',
        explained: 7,
        unexplained: 0,
        summary: '3 sales found that were not yet deducted from stock.',
        conclusion: '3 unposted sales (7 units) explain the full difference.',
        evidence: [
          { id: 'TX001', type: 'Sale', quantity: -3, stockStatus: 'Not yet deducted from stock', match: 'matched' },
          { id: 'TX002', type: 'Sale', quantity: -2, stockStatus: 'Not yet deducted from stock', match: 'matched' },
          { id: 'TX003', type: 'Sale', quantity: -2, stockStatus: 'Not yet deducted from stock', match: 'matched' },
        ],
        rules: [
          { id: 'R1', name: 'Sales match the product', passed: true, detail: 'All 3 sales are for Bottled Drink A.' },
          { id: 'R2', name: 'Sales happened before the count', passed: true, detail: 'All sales were made between the last sync and 09:12.' },
          { id: 'R3', name: 'Explained units cover the difference', passed: true, detail: '7 of 7 units explained (100%).' },
          { id: 'R4', name: 'No conflicting records', passed: true, detail: 'No returns, transfers or damage reports for this product.' },
        ],
        impact: ['Mark TX001, TX002, TX003 as posted', 'Update stock from 50 to 43', 'Not create a separate adjustment'],
      },
    ],
    timeline: [
      { stage: 'trigger', summary: 'Count of 43 differs from the record of 50.', at: '2026-10-20T09:12:00', actor: 'Staff A' },
      { stage: 'evidence', summary: '3 sales found that were not yet deducted from stock.', at: '2026-10-20T09:13:00', actor: 'Veracity' },
      { stage: 'reasoning', summary: '4 of 4 rules passed. All 7 units explained.', at: '2026-10-20T09:13:00', actor: 'Veracity' },
      { stage: 'approval', summary: 'Waiting for a manager to approve.', at: '2026-10-20T09:13:00', actor: 'Veracity' },
      { stage: 'outcome', summary: 'No stock change yet.', at: '', actor: '' },
    ],
  },
  {
    id: 'INV-0002',
    product: 'Snack Biscuits B',
    recorded: 40,
    counted: 33,
    status: 'manual_review',
    createdAt: '2026-10-20T10:05:00',
    createdBy: 'Staff B',
    versions: [
      {
        version: 1,
        createdAt: '2026-10-20T10:06:00',
        evidenceState: 'incomplete',
        explained: 3,
        unexplained: 4,
        summary: '1 sale found. 4 units have no matching record.',
        conclusion: 'Only 3 of 7 units are explained. Not enough evidence to adjust stock.',
        evidence: [
          { id: 'TX010', type: 'Sale', quantity: -3, stockStatus: 'Not yet deducted from stock', match: 'matched' },
        ],
        rules: [
          { id: 'R1', name: 'Sales match the product', passed: true, detail: 'TX010 is for Snack Biscuits B.' },
          { id: 'R2', name: 'Sales happened before the count', passed: true, detail: 'TX010 was made at 09:40, before the count.' },
          { id: 'R3', name: 'Explained units cover the difference', passed: false, detail: '3 of 7 units explained (43%). 4 units have no record.' },
          { id: 'R4', name: 'No conflicting records', passed: true, detail: 'No returns or transfers found.' },
        ],
        impact: ['Mark TX010 as posted', 'Update stock from 40 to 37', 'Leave 4 units unexplained'],
      },
    ],
    timeline: [
      { stage: 'trigger', summary: 'Count of 33 differs from the record of 40.', at: '2026-10-20T10:05:00', actor: 'Staff B' },
      { stage: 'evidence', summary: '1 sale found. 4 units have no matching record.', at: '2026-10-20T10:06:00', actor: 'Veracity' },
      { stage: 'reasoning', summary: '3 of 4 rules passed. 4 units unexplained.', at: '2026-10-20T10:06:00', actor: 'Veracity' },
      { stage: 'approval', summary: 'Sent to manual review: evidence is incomplete.', at: '2026-10-20T10:06:00', actor: 'Veracity' },
      { stage: 'outcome', summary: 'No stock change yet.', at: '', actor: '' },
    ],
  },
  {
    id: 'INV-0003',
    product: 'Canned Coffee C',
    recorded: 24,
    counted: 27,
    status: 'needs_review',
    createdAt: '2026-10-19T16:40:00',
    createdBy: 'Staff A',
    versions: [
      {
        version: 1,
        createdAt: '2026-10-19T16:41:00',
        evidenceState: 'conflicting',
        explained: 3,
        unexplained: 0,
        summary: 'A delivery and a return disagree about 3 units.',
        conclusion: 'A delivery explains 3 extra units, but a return record conflicts with it.',
        evidence: [
          { id: 'TX020', type: 'Delivery', quantity: 3, stockStatus: 'Not yet added to stock', match: 'matched' },
          { id: 'TX021', type: 'Return to supplier', quantity: -3, stockStatus: 'Not yet deducted from stock', match: 'conflicting' },
        ],
        rules: [
          { id: 'R1', name: 'Records match the product', passed: true, detail: 'Both records are for Canned Coffee C.' },
          { id: 'R2', name: 'Records happened before the count', passed: true, detail: 'Both records are dated 19 Oct.' },
          { id: 'R3', name: 'Explained units cover the difference', passed: true, detail: '3 of 3 units explained by TX020.' },
          { id: 'R4', name: 'No conflicting records', passed: false, detail: 'TX021 says the same 3 units were returned.' },
        ],
        impact: ['Mark TX020 as posted', 'Update stock from 24 to 27', 'Cancel TX021'],
      },
    ],
    timeline: [
      { stage: 'trigger', summary: 'Count of 27 differs from the record of 24.', at: '2026-10-19T16:40:00', actor: 'Staff A' },
      { stage: 'evidence', summary: 'A delivery and a return disagree about 3 units.', at: '2026-10-19T16:41:00', actor: 'Veracity' },
      { stage: 'reasoning', summary: '3 of 4 rules passed. Records conflict.', at: '2026-10-19T16:41:00', actor: 'Veracity' },
      { stage: 'approval', summary: 'Needs review before a decision can be made.', at: '2026-10-19T16:41:00', actor: 'Veracity' },
      { stage: 'outcome', summary: 'No stock change yet.', at: '', actor: '' },
    ],
  },
  {
    id: 'INV-0004',
    product: 'Bottled Drink D',
    recorded: 50,
    counted: 43,
    status: 'completed',
    createdAt: '2026-10-19T11:20:00',
    createdBy: 'Staff C',
    finalStock: 43,
    decision: {
      action: 'approved',
      by: 'Manager K',
      role: 'manager',
      reason: 'Damage report confirmed with the supplier. Sales match the till.',
      at: '2026-10-19T15:02:00',
    },
    versions: [
      {
        version: 1,
        createdAt: '2026-10-19T11:21:00',
        evidenceState: 'incomplete',
        explained: 3,
        unexplained: 4,
        summary: '2 sales found. 4 units have no matching record.',
        conclusion: 'Only 3 units explained.',
        evidence: [
          { id: 'TX030', type: 'Sale', quantity: -2, stockStatus: 'Not yet deducted from stock', match: 'matched' },
          { id: 'TX031', type: 'Sale', quantity: -1, stockStatus: 'Not yet deducted from stock', match: 'matched' },
        ],
        rules: [
          { id: 'R1', name: 'Sales match the product', passed: true, detail: 'Both sales are for Bottled Drink D.' },
          { id: 'R2', name: 'Sales happened before the count', passed: true, detail: 'Both sales were made before 11:20.' },
          { id: 'R3', name: 'Explained units cover the difference', passed: false, detail: '3 of 7 units explained (43%).' },
          { id: 'R4', name: 'No conflicting records', passed: true, detail: 'No conflicts found.' },
        ],
        impact: ['Mark TX030, TX031 as posted', 'Update stock from 50 to 47', 'Leave 4 units unexplained'],
      },
      {
        version: 2,
        createdAt: '2026-10-19T14:30:00',
        evidenceState: 'supported',
        explained: 7,
        unexplained: 0,
        summary: '2 sales and 1 damage report found.',
        conclusion: 'All 7 units explained.',
        evidence: [
          { id: 'TX030', type: 'Sale', quantity: -2, stockStatus: 'Not yet deducted from stock', match: 'matched' },
          { id: 'TX031', type: 'Sale', quantity: -1, stockStatus: 'Not yet deducted from stock', match: 'matched' },
          { id: 'DR004', type: 'Damage report: 4 units', quantity: -4, stockStatus: 'Not yet deducted from stock', match: 'matched', isNew: true },
        ],
        rules: [
          { id: 'R1', name: 'Records match the product', passed: true, detail: 'All records are for Bottled Drink D.' },
          { id: 'R2', name: 'Records happened before the count', passed: true, detail: 'All records are dated before 11:20.' },
          { id: 'R3', name: 'Explained units cover the difference', passed: true, detail: '7 of 7 units explained (100%).' },
          { id: 'R4', name: 'No conflicting records', passed: true, detail: 'No conflicts found.' },
        ],
        impact: ['Mark TX030, TX031 as posted', 'Record DR004 as damaged stock', 'Update stock from 50 to 43'],
      },
    ],
    timeline: [
      { stage: 'trigger', summary: 'Count of 43 differs from the record of 50.', at: '2026-10-19T11:20:00', actor: 'Staff C' },
      { stage: 'evidence', summary: 'Damage report added. 2 sales and 1 damage report found.', at: '2026-10-19T14:30:00', actor: 'Staff C' },
      { stage: 'reasoning', summary: '4 of 4 rules passed. All 7 units explained.', at: '2026-10-19T14:30:00', actor: 'Veracity' },
      { stage: 'approval', summary: 'Approved by Manager K.', at: '2026-10-19T15:02:00', actor: 'Manager K' },
      { stage: 'outcome', summary: 'Stock updated from 50 to 43.', at: '2026-10-19T15:02:00', actor: 'Veracity' },
    ],
  },
  {
    id: 'INV-0005',
    product: 'Paper Towels E',
    recorded: 30,
    counted: 26,
    status: 'rejected',
    createdAt: '2026-10-18T13:15:00',
    createdBy: 'Staff B',
    finalStock: 30,
    decision: {
      action: 'rejected',
      by: 'Manager K',
      role: 'manager',
      reason: 'Recount found 30 units on the back shelf. No change needed.',
      at: '2026-10-18T17:45:00',
    },
    versions: [
      {
        version: 1,
        createdAt: '2026-10-18T13:16:00',
        evidenceState: 'incomplete',
        explained: 0,
        unexplained: 4,
        summary: 'No matching records found.',
        conclusion: 'No records explain the 4 missing units.',
        evidence: [],
        rules: [
          { id: 'R3', name: 'Explained units cover the difference', passed: false, detail: '0 of 4 units explained.' },
        ],
        impact: ['Update stock from 30 to 26'],
      },
    ],
    timeline: [
      { stage: 'trigger', summary: 'Count of 26 differs from the record of 30.', at: '2026-10-18T13:15:00', actor: 'Staff B' },
      { stage: 'evidence', summary: 'No matching records found.', at: '2026-10-18T13:16:00', actor: 'Veracity' },
      { stage: 'reasoning', summary: '0 of 1 rules passed.', at: '2026-10-18T13:16:00', actor: 'Veracity' },
      { stage: 'approval', summary: 'Rejected by Manager K.', at: '2026-10-18T17:45:00', actor: 'Manager K' },
      { stage: 'outcome', summary: 'Stock kept at 30.', at: '2026-10-18T17:45:00', actor: 'Veracity' },
    ],
  },
]

const STATUS_PRIORITY: Record<CaseStatus, number> = {
  pending_approval: 0,
  manual_review: 1,
  needs_review: 2,
  completed: 3,
  rejected: 4,
}

export function sortInbox(cases: StockCase[]) {
  return [...cases].sort(
    (a, b) =>
      STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}
