'use client'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const router = useRouter()

  useEffect(() => {
    router.refresh()
  }, [router])

  return <section>{children}</section>
}

export default AuthLayout
