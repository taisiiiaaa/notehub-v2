import { NextRequest, NextResponse } from 'next/server'
import { parseSetCookie } from 'cookie'
import { checkSession } from './lib/api/serverApi'

const privateRoutes = ['/profile', '/notes']
const publicRoutes = ['/sign-in', '/sign-up']

function isRoute(pathname: string, routes: string[]) {
  return routes.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

function applySetCookies(response: NextResponse, setCookieHeaders: string[]) {
  for (const cookieString of setCookieHeaders) {
    const parsed = parseSetCookie(cookieString)
    if (!parsed.name) continue

    response.cookies.set(parsed.name, parsed.value ?? '', {
      httpOnly: parsed.httpOnly,
      secure: parsed.secure,
      sameSite: parsed.sameSite,
      path: parsed.path,
      expires: parsed.expires,
      maxAge: parsed.maxAge,
    })
  }
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

  if (accessToken) {
    return isPublicRoute ? NextResponse.redirect(new URL('/', request.url)) : NextResponse.next()
  }

  try {
    const cookieHeader = request.cookies
      .getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ')
    const sessionResponse = await checkSession(cookieHeader)

    const response = isPublicRoute
      ? NextResponse.redirect(new URL('/', request.url))
      : NextResponse.next()

    const rawSetCookie = sessionResponse.headers['set-cookie']

    const setCookieHeaders = Array.isArray(rawSetCookie)
      ? rawSetCookie
      : rawSetCookie
        ? [rawSetCookie]
        : []

    applySetCookies(response, setCookieHeaders)

    const refreshedAccessToken = setCookieHeaders.some(cookieString => {
      const parsed = parseSetCookie(cookieString)
      return parsed.name === 'accessToken' && Boolean(parsed.value)
    })

    if (isPrivateRoute && !refreshedAccessToken) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return response
  } catch (error) {
    console.error('Session refresh failed:', error)
    return isPrivateRoute
      ? NextResponse.redirect(new URL('/sign-in', request.url))
      : NextResponse.next()
  }
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
}
