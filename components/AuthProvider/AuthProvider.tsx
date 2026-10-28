'use client'
import { useEffect, useState } from 'react'
import { checkSession, getMe } from '@/lib/api/clientApi'
import { useAuthStore } from '@/lib/store/authStore'

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setUser = useAuthStore(state => state.setUser)
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await checkSession()
        const user = await getMe()
        setUser(user)
      } catch (error) {
        console.error('Failed to restore authentication:', error)
        clearIsAuthenticated()
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [setUser, clearIsAuthenticated])

  if (isLoading) {
    return null
  }

  return children
}

export default AuthProvider
