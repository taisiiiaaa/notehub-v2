'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { logout } from '@/lib/api/clientApi'
import styles from './AuthNavigation.module.css'

const AuthNavigation = () => {
  const router = useRouter()

  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      clearIsAuthenticated()
      router.push('/sign-in')
      router.refresh()
    }
  }

  if (isAuthenticated) {
    return (
      <>
        <li className={styles.navigationItem}>
          <Link href='/profile' prefetch={false} className={styles.navigationLink}>
            Profile
          </Link>
        </li>

        <li className={styles.navigationItem}>
          <p className={styles.userEmail}>{user?.email}</p>
          <button type='button' className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </li>
      </>
    )
  }

  return (
    <>
      <li className={styles.navigationItem}>
        <Link href='/sign-in' prefetch={false} className={styles.navigationLink}>
          Login
        </Link>
      </li>

      <li className={styles.navigationItem}>
        <Link href='/sign-up' prefetch={false} className={styles.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  )
}

export default AuthNavigation
