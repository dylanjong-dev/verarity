'use client'

import { ClipboardList, Inbox } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useApp } from '@/components/app/app-provider'
import { buttonVariants } from '@/components/ui/button'
import { STATUS_LABEL } from '@/components/veracity/badges'
import { CaseRow } from '@/components/veracity/case-row'
import { EmptyState, PageHeader } from '@/components/veracity/primitives'
import { sortInbox } from '@/lib/data'
import type { CaseStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const FILTERS: (CaseStatus | 'all')[] = ['all', 'pending_approval', 'manual_review', 'needs_review']

export function InboxView() {
  const { inboxCases, role } = useApp()
  const [filter, setFilter] = useState<CaseStatus | 'all'>('all')
  const sorted = sortInbox(inboxCases)
  const visible = filter === 'all' ? sorted : sorted.filter((c) => c.status === filter)

  const subtitle =
    role === 'staff'
      ? 'Cases you submitted. A manager will review them.'
      : role === 'owner'
        ? 'All open cases. You have read-only access.'
        : 'Open cases that need a decision. Pending approval is listed first.'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Inbox" subtitle={subtitle}>
        <Link href="/count" className={cn(buttonVariants({ size: 'lg' }), 'self-start md:self-auto')}>
          <ClipboardList aria-hidden="true" />
          New count
        </Link>
      </PageHeader>

      <div role="group" aria-label="Filter by status" className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {FILTERS.map((f) => {
          const count = f === 'all' ? sorted.length : sorted.filter((c) => c.status === f).length
          const active = filter === f
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={cn(
                'flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-body-sm font-medium transition-colors',
                active
                  ? 'border-accent-text bg-accent-fill/15 text-fg'
                  : 'border-line text-fg-secondary hover:text-fg',
              )}
            >
              {f === 'all' ? 'All' : STATUS_LABEL[f]}
              <span className="num text-fg-tertiary">{count}</span>
            </button>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={filter === 'all' ? 'No open cases' : 'Nothing in this filter'}
          description={
            filter === 'all'
              ? 'Every count matches the record or has been decided.'
              : 'Try another status filter.'
          }
        />
      ) : (
        <ul className="flex flex-col gap-3" aria-label="Open cases">
          {visible.map((c) => (
            <CaseRow key={c.id} stockCase={c} href={`/cases/${c.id}`} />
          ))}
        </ul>
      )}
    </div>
  )
}
