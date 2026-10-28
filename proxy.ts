import { NextRequest, NextResponse } from 'next/server'
import { checkSession } from '@/lib/api/serverApi'

const privateRoutes = ['/profile', '/notes']
const publicRoutes = ['/sign-in', '/sign-up']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPrivateRoute = privateRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  )

  const isPublicRoute = publicRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next()
  }

  const cookieHeader = request.headers.get('cookie') ?? ''

  if (!cookieHeader) {
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next()
  }

  try {
    await checkSession(cookieHeader)

    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/profile', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Session check failed:', error instanceof Error ? error.message : error)

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
}
