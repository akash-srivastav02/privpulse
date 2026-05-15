# PrivPulse — Complete Setup Guide
# From zero to live in ~25 minutes

---

## WHAT YOU NEED (all free)
- Node.js 18+ installed
- A GitHub account
- A Vercel account (vercel.com)
- A Supabase account (supabase.com)
- An Upstash account (upstash.com)
- A Resend account (resend.com)
- A domain (~₹900/yr from GoDaddy or Namecheap)

---

## STEP 1 — Set up Supabase (5 min)

1. Go to https://supabase.com → "New project"
2. Name it "privpulse", choose a region close to India (Singapore or Mumbai)
3. Set a strong database password (save it!)
4. Wait ~2 minutes for it to spin up

5. Go to Settings → API and copy:
   - Project URL          → save as NEXT_PUBLIC_SUPABASE_URL
   - anon / public key    → save as NEXT_PUBLIC_SUPABASE_ANON_KEY
   - service_role key     → save as SUPABASE_SERVICE_KEY (KEEP SECRET)

6. Go to SQL Editor → New query → paste contents of:
      supabase/migrations/001_schema.sql
   → Click "Run"

7. New query again → paste contents of:
      supabase/migrations/002_functions.sql
   → Click "Run"

8. Go to Authentication → Settings:
   - Set "Site URL" to https://yourdomain.com
   - Add https://yourdomain.com/dashboard to "Redirect URLs"

---

## STEP 2 — Set up Upstash Redis (2 min)

1. Go to https://console.upstash.com → "Create Database"
2. Name: "privpulse-ratelimit"
3. Type: Regional → Select "ap-south-1" (Mumbai) or "ap-southeast-1" (Singapore)
4. Click Create
5. Copy:
   - REST URL   → save as UPSTASH_REDIS_REST_URL
   - REST Token → save as UPSTASH_REDIS_REST_TOKEN

---

## STEP 3 — Set up Resend (2 min)

1. Go to https://resend.com → Sign up
2. Go to Domains → Add Domain → enter yourdomain.com
3. Add the DNS records shown (in GoDaddy/Namecheap DNS settings)
4. Go to API Keys → Create API Key
5. Copy the key → save as RESEND_API_KEY
6. Set EMAIL_FROM=digest@yourdomain.com

---

## STEP 4 — Deploy to Vercel (5 min)

### Option A — Deploy via Vercel CLI (recommended)

```bash
# In your terminal, inside the privpulse folder:

npm install
npx vercel login          # Opens browser to log in
npx vercel                # Follow prompts — say yes to all defaults
```

When asked "Set up and deploy?", say Y.
When asked "Which scope?", pick your account.
When asked project name, type: privpulse
When asked "Detected Next.js" → Y.

This gives you a preview URL like https://privpulse-abc123.vercel.app

### Option B — Deploy via GitHub

```bash
git init
git add .
git commit -m "Initial commit"
# Create a repo on github.com then:
git remote add origin https://github.com/YOURUSERNAME/privpulse.git
git push -u origin main
```
Then go to vercel.com → New Project → Import from GitHub → select privpulse.

---

## STEP 5 — Add environment variables to Vercel (5 min)

Go to your project on vercel.com → Settings → Environment Variables.
Add ALL of these (copy from your notes above):

```
NEXT_PUBLIC_SUPABASE_URL          = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY     = eyJ...
SUPABASE_SERVICE_KEY              = eyJ...  (mark as Secret)
HASH_SALT                         = (run: openssl rand -hex 32)
NEXT_PUBLIC_APP_URL               = https://yourdomain.com
UPSTASH_REDIS_REST_URL            = https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN          = xxx
RESEND_API_KEY                    = re_xxx
EMAIL_FROM                        = digest@yourdomain.com
```

After adding all vars → click "Redeploy" (top right of Vercel dashboard).

---

## STEP 6 — Connect your domain (3 min)

1. In Vercel → Settings → Domains → Add Domain → type yourdomain.com
2. Vercel shows you DNS records to add (usually an A record and CNAME)
3. Go to your domain registrar (GoDaddy/Namecheap):
   - Delete existing A records
   - Add the records Vercel shows
4. Wait 5–30 minutes for DNS to propagate
5. Vercel auto-provisions SSL certificate

---

## STEP 7 — Test everything (3 min)

### Test 1: Tracking API
Open your browser console on your live site and run:
```javascript
fetch('https://yourdomain.com/api/collect', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    type: 'pageview',
    siteKey: 'PASTE_YOUR_SITE_KEY_HERE',
    url: 'https://test.com/'
  })
}).then(r => console.log('Status:', r.status))
// Should print: Status: 200
```

Then check Supabase → Table Editor → pageviews table.
You should see 1 row.

### Test 2: Dashboard
1. Go to https://yourdomain.com/signup
2. Create an account with your email
3. Check email and click confirmation link
4. You'll be redirected to /dashboard
5. Click "Add site" → enter your site name and domain
6. Copy the script tag shown
7. Paste it on any site you own
8. Visit that site — you should see the live counter increment in your dashboard

---

## STEP 8 — Embed on your own site

After adding your first site in the dashboard, copy the script tag:

```html
<script async
  src="https://yourdomain.com/p.js"
  data-site="pp_YOUR_UNIQUE_KEY">
</script>
```

Paste before </head> on every page.

### Custom event tracking (no JS needed):
```html
<button data-pp="signup">Sign up</button>
<a data-pp="download" href="/file.pdf">Download</a>
```

### Custom events via JavaScript:
```javascript
window.pp('event', 'purchase', { value: 499, currency: 'INR' })
```

---

## STEP 9 — Launch checklist

Before going public, verify:

- [ ] https://yourdomain.com loads (landing page)
- [ ] https://yourdomain.com/signup works (can create account)
- [ ] https://yourdomain.com/login works (can sign in)
- [ ] https://yourdomain.com/dashboard shows (after login)
- [ ] Can add a site and get a script tag
- [ ] Pasting p.js on a test page sends data to Supabase
- [ ] /api/collect returns 200
- [ ] SSL certificate is active (green lock in browser)

---

## QUICK COMMANDS REFERENCE

```bash
# Local development
npm install
cp .env.example .env.local   # fill in your values
npm run dev                  # starts on http://localhost:3000

# Deploy
npx vercel --prod            # deploy to production

# Minify tracking script (optional, saves ~30%)
npm run minify               # creates public/p.min.js
# Then update script src to /p.min.js
```

---

## TROUBLESHOOTING

**"Invalid API key" from Supabase**
→ Check NEXT_PUBLIC_SUPABASE_ANON_KEY is correct in Vercel env vars
→ Redeploy after changing env vars

**Pageviews not appearing in dashboard**
→ Check the siteKey in your script tag matches the site_key in Supabase sites table
→ Open browser Network tab, look for POST to /api/collect, check response

**Login redirect loops**
→ Make sure Site URL in Supabase Auth settings matches your actual domain
→ Make sure the redirect URL is added in Supabase Auth settings

**Build fails on Vercel**
→ Check Vercel build logs for the specific error
→ Most common: missing env var — add it in Vercel settings and redeploy

**Rate limit errors in dev**
→ Normal — Upstash not required in dev. Set UPSTASH vars only in production.
