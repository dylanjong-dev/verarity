import type { Metadata } from 'next'
import { CaseDetailView } from '@/components/screens/case-detail-view'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return { title: `${id} · Veracity` }
}

export default async function CasePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ v?: string; state?: string }>
}) {
  const { id } = await params
  const { v, state } = await searchParams
  return <CaseDetailView id={id} version={v ? Number(v) : undefined} demoState={state} />
}
