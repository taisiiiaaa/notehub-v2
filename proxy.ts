import { NextRequest, NextResponse } from 'next/server'
import { api } from '@/lib/api/api'
import { parseSetCookie } from 'cookie'

const privateRoutes = ['/profile', '/notes']
const publicRoutes = ['/sign-in', '/sign-up']

function isRoute(pathname: string, routes: string[]) {
  return routes.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPrivateRoute = isRoute(pathname, privateRoutes)
  const isPublicRoute = isRoute(pathname, publicRoutes)

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (!accessToken && !refreshToken) {
    return isPrivateRoute
      ? NextResponse.redirect(new URL('/sign-in', request.url))
      : NextResponse.next()
  }

  if (!accessToken && refreshToken) {
    try {
      const refreshResponse = await api.get('/auth/session', {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      })

      const response = isPublicRoute
        ? NextResponse.redirect(new URL('/', request.url))
        : NextResponse.next()

      const setCookieHeaders = refreshResponse.headers['set-cookie'] ?? []

      for (const cookieString of setCookieHeaders) {
        const parsed = parseSetCookie(cookieString)

        if (parsed.name && parsed.value) {
          response.cookies.set(parsed.name, parsed.value, {
            httpOnly: parsed.httpOnly,
            secure: parsed.secure,
            sameSite: parsed.sameSite,
            path: parsed.path,
            expires: parsed.expires,
            maxAge: parsed.maxAge,
          })
        }
      }

      return response
    } catch (error) {
      console.error('Session refresh failed:', error)

      return isPrivateRoute
        ? NextResponse.redirect(new URL('/sign-in', request.url))
        : NextResponse.next()
    }
  }

  try {
    const cookieHeader = request.headers.get('cookie') ?? ''

    const sessionResponse = await api.get('/auth/session', {
      headers: {
        Cookie: cookieHeader,
      },
    })

    const response = isPublicRoute
      ? NextResponse.redirect(new URL('/', request.url))
      : NextResponse.next()

    const setCookieHeaders = sessionResponse.headers['set-cookie'] ?? []

    for (const cookieString of setCookieHeaders) {
      const parsed = parseSetCookie(cookieString)

      if (parsed.name && parsed.value) {
        response.cookies.set(parsed.name, parsed.value, {
          httpOnly: parsed.httpOnly,
          secure: parsed.secure,
          sameSite: parsed.sameSite,
          path: parsed.path,
          expires: parsed.expires,
          maxAge: parsed.maxAge,
        })
      }
    }

    return response
  } catch (error) {
    console.error('Session validation failed:', error)

    return isPrivateRoute
      ? NextResponse.redirect(new URL('/sign-in', request.url))
      : NextResponse.next()
  }
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
}
