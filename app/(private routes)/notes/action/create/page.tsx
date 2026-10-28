import NoteForm from '@/components/NoteForm/NoteForm'
import styles from './CreateNote.module.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Note | NoteHub',
  description:
    'Create a new note in NoteHub, a simple and efficient application for managing personal notes. Organize your thoughts and ideas with ease',
  openGraph: {
    title: 'Create Note | NoteHub',
    description:
      'Create a new note in NoteHub, a simple and efficient application for managing personal notes. Organize your thoughts and ideas with ease',
    url: `https://notehub.com/notes/action/create`,
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub - A simple and efficient application for managing personal notes',
      },
    ],
  },
}

const CreateNote = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  )
}

export default CreateNote
