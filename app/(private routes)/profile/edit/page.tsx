'use client'
import Image from 'next/image'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { updateMe } from '@/lib/api/clientApi'
import { useAuthStore } from '@/lib/store/authStore'
import styles from './EditProfilePage.module.css'
import Loader from '@/components/Loader/Loader'

interface FormState {
  error: string | null
}

export default function EditProfilePage() {
  const router = useRouter()
  const user = useAuthStore(state => state.user)
  const setUser = useAuthStore(state => state.setUser)

  const updateProfile = async (_prevState: FormState, formData: FormData): Promise<FormState> => {
    const username = String(formData.get('username') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()

    if (!username || !email) {
      return { error: 'Username and email are required.' }
    }

    try {
      const updatedUser = await updateMe({ username, email })

      setUser(updatedUser)
      router.push('/profile')
      router.refresh()

      return { error: null }
    } catch {
      return { error: 'Failed to update your profile. Please try again.' }
    }
  }

  const [state, formAction, isPending] = useActionState(updateProfile, {
    error: null,
  })

  if (!user) {
    return <Loader />
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.profileCard}>
        <h1 className={styles.formTitle}>Edit Profile</h1>
        <Image
          src={user.avatar}
          alt='User Avatar'
          width={120}
          height={120}
          className={styles.avatar}
        />
        <form action={formAction} className={styles.profileInfo}>
          <div className={styles.usernameWrapper}>
            <label htmlFor='username'>Username:</label>
            <input
              id='username'
              name='username'
              type='text'
              defaultValue={user.username}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.usernameWrapper}>
            <label htmlFor='email'>Email:</label>
            <input
              id='email'
              name='email'
              type='email'
              defaultValue={user.email}
              className={styles.input}
              required
            />
          </div>

          {state.error && <p role='alert'>{state.error}</p>}

          <div className={styles.actions}>
            <button type='submit' className={styles.saveButton} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </button>

            <button
              type='button'
              className={styles.cancelButton}
              onClick={() => router.push('/profile')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
