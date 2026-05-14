export const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const hasSupabase =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

export const hasUpstash =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

export const hasResend = Boolean(process.env.RESEND_API_KEY);
