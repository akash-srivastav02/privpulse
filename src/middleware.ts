import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './lib/env'

type CookieOptions = Record<string, unknown>

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })
  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => { request.cookies.set({name,value,...options}); response = NextResponse.next({request:{headers:request.headers}}); response.cookies.set({name,value,...options}) },
        remove: (name: string, options: CookieOptions) => { request.cookies.set({name,value:'',...options}); response = NextResponse.next({request:{headers:request.headers}}); response.cookies.set({name,value:'',...options}) },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname
  const isAuth = !!user
  const isDashboard = path.startsWith('/dashboard')
  const isSettings = path.startsWith('/settings')
  const isAuthPage = path === '/login' || path === '/signup'

  if ((isDashboard || isSettings) && !isAuth) return NextResponse.redirect(new URL('/login', request.url))
  if (isAuthPage && isAuth) return NextResponse.redirect(new URL('/dashboard', request.url))
  return response
}
export const config = { matcher: ['/dashboard/:path*', '/settings/:path*', '/login', '/signup'] }
