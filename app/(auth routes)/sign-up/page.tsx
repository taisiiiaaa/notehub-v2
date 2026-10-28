'use client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { register } from '@/lib/api/clientApi'
import { useAuthStore } from '@/lib/store/authStore'
import styles from './SignUp.module.css'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'

const SignUp = () => {
  const router = useRouter()
  const setUser = useAuthStore(state => state.setUser)

  const registerMutation = useMutation({
    mutationFn: register,

    onSuccess: ({ user }) => {
      setUser(user)
      toast.success('Registration successful!')
      router.push('/profile')
    },

    onError: () => {
      toast.error('Registration failed. Please check your details and try again.')
    },
  })

  const handleSubmit = (formData: FormData) => {
    if (registerMutation.isPending) return

    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    registerMutation.mutate({ email, password })
  }

  return (
    <main className={styles.mainContent}>
      {' '}
      <h1 className={styles.formTitle}>Sign up</h1>
      <form className={styles.form} action={handleSubmit}>
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
            autoComplete='new-password'
            required
          />
        </div>

        <div className={styles.actions}>
          <button
            type='submit'
            className={styles.submitButton}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Registering...' : 'Register'}
          </button>
        </div>

        {registerMutation.isError && (
          <ErrorMessage message='Registration failed. Please check your details and try again.' />
        )}
      </form>
    </main>
  )
}

export default SignUp
