'use client'
import type { CreateNote, NoteTag } from '../../types/note'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createNote } from '@/lib/api/clientApi'
import styles from './NoteForm.module.css'
import { useNoteDraftStore } from '@/lib/store/noteStore'

const validTags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']

const NoteForm = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { draft, setDraft, clearDraft } = useNoteDraftStore()

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    })
  }

  const createNoteMutation = useMutation({
    mutationFn: createNote,

    onSuccess: async () => {
      clearDraft()
      await queryClient.invalidateQueries({ queryKey: ['notes'] })

      toast.success('Note created successfully!')
      router.push('/notes/filter/all')
    },

    onError: () => {
      toast.error('Failed to create note.')
    },
  })

  const handleSubmit = async (formData: FormData) => {
    if (createNoteMutation.isPending) return

    const title = String(formData.get('title') ?? '').trim()
    const content = String(formData.get('content') ?? '').trim()
    const tag = String(formData.get('tag') ?? '')

    if (title.length < 3 || title.length > 50) {
      toast.error('Title must be between 3 and 50 characters.')
      return
    }

    if (content.length > 500) {
      toast.error('Content could not exceed 500 characters.')
      return
    }

    if (!validTags.includes(tag as NoteTag)) {
      toast.error('Please select a valid tag.')
      return
    }

    const note: CreateNote = {
      title,
      content,
      tag: tag as NoteTag,
    }

    createNoteMutation.mutate(note)
  }

  return (
    <form action={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor='title'>Title</label>

        <input
          id='title'
          type='text'
          name='title'
          className={styles.input}
          defaultValue={draft?.title}
          minLength={3}
          maxLength={50}
          required
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor='content'>Content</label>

        <textarea
          id='content'
          name='content'
          rows={8}
          className={styles.textarea}
          defaultValue={draft?.content}
          maxLength={500}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor='tag'>Tag</label>

        <select
          id='tag'
          name='tag'
          className={styles.select}
          defaultValue={draft?.tag}
          required
          onChange={handleChange}
        >
          {validTags.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.actions}>
        <button onClick={() => router.back()} type='button' className={styles.cancelButton}>
          Cancel
        </button>

        <button
          type='submit'
          className={styles.submitButton}
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  )
}

export default NoteForm
