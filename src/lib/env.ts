export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_FugcjZvmztg316It9WoSUw_lJdF7Nuj'

export const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!

export const HASH_SALT =
  process.env.HASH_SALT ||
  process.env.VISITOR_HASH_SALT ||
  'dev-salt-change-in-prod'
