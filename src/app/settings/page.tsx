import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import SettingsClient from './settings-client'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: sites } = await supabase.from('sites').select('*').eq('user_id', user.id).order('created_at')
  return <SettingsClient user={user} sites={sites ?? []} />
}
