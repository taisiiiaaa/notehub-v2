import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { fetchNotes } from '@/lib/api'
import type { NoteTag } from '@/types/note'
import NotesClient from './Notes.client'
import { Metadata } from 'next'

type generateMetadataProps = {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: generateMetadataProps): Promise<Metadata> {
  const { slug } = await params
  const selectedTag = slug[0]
  return {
    title: `${selectedTag === 'all' ? 'My Notes | ' : selectedTag + ' | '}NoteHub`,
    description: `Notes filtered by category: ${slug}`,
  }
}

interface NotesByCategoryProps {
  params: Promise<{ slug: string[] }>
}

const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']

const NotesByCategory = async ({ params }: NotesByCategoryProps) => {
  const { slug } = await params
  const selectedTag = slug[0]

  const tag: NoteTag | undefined =
    selectedTag === 'all'
      ? undefined
      : tags.find(item => item.toLowerCase() === selectedTag?.toLowerCase())

  if (selectedTag !== 'all' && !tag) {
    return <p>Category not found.</p>
  }

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag ?? 'all', '', 1],
    queryFn: () => fetchNotes(1, '', tag),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  )
}

export default NotesByCategory
