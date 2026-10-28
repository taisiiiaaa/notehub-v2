'use client'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Modal from '@/components/Modal/Modal'
import Loader from '@/components/Loader/Loader'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'
import { fetchNoteById } from '@/lib/api/clientApi'
import styles from './NotePreview.module.css'

const NotePreviewClient = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  })

  const handleClose = () => {
    router.back()
  }

  if (isLoading) {
    return <Loader />
  }

  if (isError || !note) {
    return (
      <Modal onClose={handleClose}>
        <ErrorMessage message='Failed to load note details.' />
      </Modal>
    )
  }

  return (
    <Modal onClose={handleClose}>
      <div className={styles.header}>
        <h2>{note.title}</h2>
      </div>

      <p className={styles.tag}>{note.tag}</p>

      <p className={styles.content}>{note.content}</p>

      <p className={styles.date}>{new Date(note.createdAt).toLocaleDateString()}</p>
    </Modal>
  )
}

export default NotePreviewClient
