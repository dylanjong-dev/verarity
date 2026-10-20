'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { OPEN_STATUSES, SEED_CASES, USERS } from '@/lib/data'
import { nowIso } from '@/lib/format'
import type { Decision, Role, StockCase, User } from '@/lib/types'

interface AppState {
  role: Role
  user: User
  setRole: (role: Role) => void
  cases: StockCase[]
  /** Cases the current role is allowed to see in the inbox. */
  inboxCases: StockCase[]
  getCase: (id: string) => StockCase | undefined
  decide: (id: string, action: Decision['action'], reason: string) => void
  requestReview: (id: string, reason: string) => void
  submitCount: (input: { product: string; recorded: number; counted: number; note: string }) => StockCase
  findOpenCase: (product: string, counted: number) => StockCase | undefined
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('manager')
  const [cases, setCases] = useState<StockCase[]>(SEED_CASES)
  const user = USERS[role]

  const inboxCases = useMemo(
    () =>
      cases.filter(
        (c) => OPEN_STATUSES.includes(c.status) && (role !== 'staff' || c.createdBy === user.name),
      ),
    [cases, role, user.name],
  )

  const getCase = useCallback((id: string) => cases.find((c) => c.id === id), [cases])

  const decide = useCallback(
    (id: string, action: Decision['action'], reason: string) => {
      const at = nowIso()
      setCases((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c
          const approved = action !== 'rejected'
          const finalStock = approved ? c.counted : c.recorded
          const verb = action === 'approved' ? 'Approved' : action === 'rejected' ? 'Rejected' : 'Overridden'
          return {
            ...c,
            status: approved ? 'completed' : 'rejected',
            finalStock,
            decision: { action, by: user.name, role: user.role, reason, at },
            timeline: c.timeline.map((e) => {
              if (e.stage === 'approval') return { ...e, summary: `${verb} by ${user.name}.`, at, actor: user.name }
              if (e.stage === 'outcome')
                return {
                  ...e,
                  summary: approved
                    ? `Stock updated from ${c.recorded} to ${finalStock}.`
                    : `Stock kept at ${c.recorded}.`,
                  at,
                  actor: 'Veracity',
                }
              return e
            }),
          }
        }),
      )
    },
    [user],
  )

  const requestReview = useCallback(
    (id: string, reason: string) => {
      const at = nowIso()
      setCases((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: 'needs_review',
                timeline: c.timeline.map((e) =>
                  e.stage === 'approval'
                    ? { ...e, summary: `Review requested by ${user.name}: ${reason}`, at, actor: user.name }
                    : e,
                ),
              }
            : c,
        ),
      )
    },
    [user.name],
  )

  const findOpenCase = useCallback(
    (product: string, counted: number) =>
      cases.find((c) => c.product === product && c.counted === counted && OPEN_STATUSES.includes(c.status)),
    [cases],
  )

  const submitCount = useCallback<AppState['submitCount']>(
    ({ product, recorded, counted, note }) => {
      const at = nowIso()
      const diff = counted - recorded
      const id = `INV-${String(cases.length + 1).padStart(4, '0')}`
      const created: StockCase = {
        id,
        product,
        recorded,
        counted,
        status: 'manual_review',
        createdAt: at,
        createdBy: user.name,
        versions: [
          {
            version: 1,
            createdAt: at,
            evidenceState: 'incomplete',
            explained: 0,
            unexplained: Math.abs(diff),
            summary: 'Collecting transaction evidence.',
            conclusion: `No records explain the ${Math.abs(diff)} unit difference yet.`,
            evidence: [],
            rules: [
              {
                id: 'R3',
                name: 'Explained units cover the difference',
                passed: false,
                detail: `0 of ${Math.abs(diff)} units explained.`,
              },
            ],
            impact: [`Update stock from ${recorded} to ${counted}`],
          },
        ],
        timeline: [
          {
            stage: 'trigger',
            summary: `Count of ${counted} differs from the record of ${recorded}.${note ? ` Note: ${note}` : ''}`,
            at,
            actor: user.name,
          },
          { stage: 'evidence', summary: 'No matching records found yet.', at, actor: 'Veracity' },
          { stage: 'reasoning', summary: '0 of 1 rules passed.', at, actor: 'Veracity' },
          { stage: 'approval', summary: 'Sent to manual review: evidence is incomplete.', at, actor: 'Veracity' },
          { stage: 'outcome', summary: 'No stock change yet.', at: '', actor: '' },
        ],
      }
      setCases((prev) => [created, ...prev])
      return created
    },
    [cases.length, user.name],
  )

  const value = useMemo(
    () => ({ role, user, setRole, cases, inboxCases, getCase, decide, requestReview, submitCount, findOpenCase }),
    [role, user, cases, inboxCases, getCase, decide, requestReview, submitCount, findOpenCase],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
