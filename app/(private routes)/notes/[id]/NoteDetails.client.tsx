'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api/clientApi'
import styles from './NoteDetails.module.css'
import Loader from '@/components/Loader/Loader'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>()

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  })

  if (isLoading) {
    return <Loader />
  }

  if (isError || !note) {
    return <ErrorMessage message='Failed to load note details.' />
  }

  return (
    <>
      <div className={styles.header}>
        <h2>{note.title}</h2>
      </div>

      <p className={styles.tag}>{note.tag}</p>

      <p className={styles.content}>{note.content}</p>

      <p className={styles.date}>{new Date(note.createdAt).toLocaleDateString()}</p>
    </>
  )
}

export default NoteDetailsClient
