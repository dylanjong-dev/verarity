'use client'

import { useRef } from 'react'
import { useApp } from '@/components/app/app-provider'
import { CaseRow } from '@/components/veracity/case-row'
import { PageHeader } from '@/components/veracity/primitives'
import { StaffHealth, StockHealth, StockHealthBar } from '@/components/veracity/stock-health'
import { useOutOfView } from '@/hooks/use-out-of-view'
import { sortInbox } from '@/lib/data'
import {
  ALL_VERIFIED_SUMMARY,
  IN_PROGRESS_SUMMARY,
  MANAGER_SUMMARY,
  NO_COUNT_SUMMARY,
  STAFF_PROGRESS,
} from '@/lib/stock'
import { cn } from '@/lib/utils'

const FIXED = 'min-h-0 md:min-h-0'

function Frame({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`frame-${id}`} className="flex flex-col gap-3">
      <h2 id={`frame-${id}`} className="flex items-center gap-2 text-body-sm font-medium text-fg-secondary">
        <span className="flex size-6 items-center justify-center rounded-full bg-elevated text-caption font-semibold text-fg">
          {id}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function MobileFrame() {
  const { inboxCases } = useApp()
  const rootRef = useRef<HTMLDivElement>(null)
  const overviewRef = useRef<HTMLDivElement>(null)
  const collapsed = useOutOfView(overviewRef, { root: rootRef, topOffset: 0 })

  return (
    <div className="mx-auto w-[375px] max-w-full overflow-hidden rounded-[28px] border-4 border-elevated bg-base">
      <div ref={rootRef} className="relative h-[680px] overflow-y-auto">
        <div
          className={cn(
            'sticky top-0 z-10 -mb-11 transition-opacity duration-200',
            collapsed ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          aria-hidden={!collapsed}
        >
          <StockHealthBar summary={MANAGER_SUMMARY} />
        </div>
        <div className="flex flex-col gap-4 p-4">
          <p className="text-h1-sm font-semibold">Inbox</p>
          <div ref={overviewRef}>
            <StockHealth summary={MANAGER_SUMMARY} compact className="min-h-[272px] md:min-h-[272px] md:p-4" />
          </div>
          <ul className="flex flex-col gap-3">
            {sortInbox(inboxCases).map((c) => (
              <CaseRow key={c.id} stockCase={c} href={`/cases/${c.id}`} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function InboxFramesView() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Inbox · Stock health frames"
        subtitle="Every state of the overview that sits above the filter tabs and case list."
      />
      <Frame id="A" title="Manager · normal">
        <StockHealth summary={MANAGER_SUMMARY} className={FIXED} />
      </Frame>
      <Frame id="B" title="All verified (100%)">
        <StockHealth summary={ALL_VERIFIED_SUMMARY} className={FIXED} />
      </Frame>
      <Frame id="C" title="No count yet (0%)">
        <StockHealth summary={NO_COUNT_SUMMARY} className={FIXED} />
      </Frame>
      <Frame id="D" title="Count in progress">
        <StockHealth summary={IN_PROGRESS_SUMMARY} className={FIXED} />
      </Frame>
      <Frame id="E" title="Loading">
        <StockHealth state="loading" summary={MANAGER_SUMMARY} className={FIXED} />
      </Frame>
      <Frame id="F" title="Load error">
        <StockHealth state="error" summary={MANAGER_SUMMARY} className={FIXED} />
      </Frame>
      <Frame id="G" title="Staff view · own count only">
        <StaffHealth progress={STAFF_PROGRESS} className={FIXED} />
      </Frame>
      <Frame id="H" title="Mobile · scroll inside the frame to collapse the overview">
        <MobileFrame />
      </Frame>
    </div>
  )
}
