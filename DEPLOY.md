# Studio G.D. — Deployment Guide

## Stack
- **Next.js 14** (App Router) — framework
- **Tailwind CSS v3** — styling with brand tokens
- **GSAP** (ScrollTrigger) — animations
- **Supabase** — order storage
- **Vercel** — hosting

---

## 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and paste the contents of `supabase/schema.sql`
4. Run it — this creates the `orders` table with the right RLS policies
5. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_WA_NUMBER=521XXXXXXXXXX   ← their real WhatsApp number (no + or spaces)
NEXT_PUBLIC_IG_HANDLE=studiogd.stationery ← their real Instagram handle
```

---

## 3. Run locally

```bash
cd studio-gd
npm install
npm run dev
# open http://localhost:3000
```

---

## 4. Deploy to Vercel

```bash
npx vercel
```

Or connect the GitHub repo to Vercel and it deploys automatically on every push.

**Add environment variables in Vercel:**
Vercel Dashboard → Project → Settings → Environment Variables → add the 4 variables above.

---

## 5. Things to update before going live

| What | Where |
|------|-------|
| WhatsApp number | `.env.local` → `NEXT_PUBLIC_WA_NUMBER` |
| Instagram handle | `.env.local` → `NEXT_PUBLIC_IG_HANDLE` |
| "Nosotras" photo | Replace placeholder in `components/Nosotras.tsx` |
| Product photos/mockups | Replace placeholders in `components/ProductCard.tsx` |
| SEO metadata | `app/layout.tsx` → metadata object |

---

## 6. View orders (Supabase Table Editor)

Mariana & Lor can log in to [supabase.com](https://supabase.com), open their project, go to **Table Editor → orders** and see all incoming customization requests with full form data and timestamps.
