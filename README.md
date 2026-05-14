# PrivPulse

Privacy-first website analytics for Indian businesses, indie founders, and agencies.

## What Is Included

- Next.js app with landing page, signup, demo dashboard, and public share page
- Tracking script at `/p.js`
- Pageview and custom event collector at `/api/collect`
- Dashboard API at `/api/dashboard`
- Compatibility stats API at `/api/stats`
- Weekly digest route at `/api/digest`
- Lemon Squeezy checkout redirect at `/api/checkout`
- Supabase schema in `supabase-schema.sql`

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The app works locally without Supabase credentials by using in-memory demo data.

## Tracking Script

```html
<script async src="https://yourdomain.com/p.js" data-site="pp_YOUR_SITE_ID"></script>
```

Codeless custom events:

```html
<button data-pp="signup">Sign up</button>
<button data-analytics="pricing_cta">Start checkout</button>
```

JavaScript custom events:

```js
window.pp("event", "purchase", { value: 499, currency: "INR" });
```

## Production Setup

1. Create a Supabase project.
2. Run `supabase-schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Fill Supabase, Upstash, Resend, Lemon Squeezy, and secret values.
5. Deploy to Vercel.
6. Set `NEXT_PUBLIC_APP_URL` to your production URL.
7. Put Cloudflare in front of the domain/CDN if desired.

## Important Env Vars

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `RESEND_API_KEY`
- `CRON_SECRET`
- `VISITOR_HASH_SALT`
- `LEMON_SQUEEZY_INDIE_CHECKOUT_URL`
- `LEMON_SQUEEZY_AGENCY_CHECKOUT_URL`

## Verification

```bash
npm run lint
npm run build
```
