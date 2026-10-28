'use client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { login } from '@/lib/api/clientApi'
import { useAuthStore } from '@/lib/store/authStore'
import styles from './SignIn.module.css'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'

const SignIn = () => {
  const router = useRouter()
  const setUser = useAuthStore(state => state.setUser)

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: ({ user }) => {
      setUser(user)
      toast.success('Login successful!')
      router.push('/profile')
    },

    onError: () => {
      toast.error('Login failed. Please check your email and password.')
    },
  })

  const handleSubmit = (formData: FormData) => {
    if (loginMutation.isPending) return

    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    loginMutation.mutate({ email, password })
  }

  return (
    <main className={styles.mainContent}>
      {' '}
      <form className={styles.form} action={handleSubmit}>
        {' '}
        <h1 className={styles.formTitle}>Sign in</h1>
        <div className={styles.formGroup}>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            name='email'
            className={styles.input}
            autoComplete='email'
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type='password'
            name='password'
            className={styles.input}
            autoComplete='current-password'
            required
          />
        </div>
        <div className={styles.actions}>
          <button type='submit' className={styles.submitButton} disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Logging in...' : 'Log in'}
          </button>
        </div>
        {loginMutation.isError && (
          <ErrorMessage message='Login failed. Please check your email and password.' />
        )}
      </form>
    </main>
  )
}

export default SignIn
