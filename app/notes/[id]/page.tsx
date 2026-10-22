import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api'
import NoteDetailsClient from './NoteDetails.client'
import { Metadata } from 'next'

export async function generateMetadata({ params }: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params
  const note = await fetchNoteById(id)

  const title = `${note.title} | NoteHub`
  const description = note.content.length > 100 ? `${note.content.slice(0, 100)}` : note.content

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${note.title} — NoteHub`,
        },
      ],
    },
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
