import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as _create } from '@supabase/supabase-js'
import { SERVICE_ROLE_KEY, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './env'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
}

export function createServiceClient() {
  return _create(
    SUPABASE_URL,
    SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )
}
