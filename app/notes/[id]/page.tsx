import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api'
import NoteDetailsClient from './NoteDetails.client'
import { Metadata } from 'next'

type generateMetadataProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: generateMetadataProps): Promise<Metadata> {
  const { id } = await params
  const note = await fetchNoteById(id)
  return {
    title: `${note.title} | NoteHub`,
    description: note.content.length > 100 ? note.content.slice(0, 100) + '...' : note.content,
  }
}

interface NoteDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

const NoteDetails = async ({ params }: NoteDetailsPageProps) => {
  const { id } = await params

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  )
}

export default NoteDetails
