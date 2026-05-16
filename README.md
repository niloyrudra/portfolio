# Niloy Rudra — Portfolio + Admin Panel

Next.js 14 portfolio with a full admin panel and JSON file storage.
Designed for **A2Hosting shared hosting** (cPanel Node.js / Passenger).

## Why JSON storage instead of SQLite?

A2Hosting shared hosting enforces strict process/thread limits.
`better-sqlite3` (native module) requires compilation on the server, which
hits those limits. This version uses plain `fs` JSON files — zero native
dependencies, zero compilation on the server.

---

## What's inside

```
niloy-portfolio/
├── app/
│   ├── page.tsx                    ← Public portfolio (server component, reads JSON)
│   ├── admin/                      ← Admin panel (JWT-protected)
│   │   ├── login/page.tsx
│   │   ├── layout.tsx              ← Sidebar shell
│   │   ├── page.tsx                ← Dashboard with unread message count
│   │   ├── hero/page.tsx           ← Edit name, title, tagline, stats
│   │   ├── about/page.tsx          ← Edit bio paragraphs & profile links
│   │   ├── skills/page.tsx         ← Add/edit/remove skill cards & tags
│   │   ├── experience/page.tsx     ← Add/edit/remove timeline entries
│   │   ├── projects/page.tsx       ← Add/edit/remove portfolio projects
│   │   ├── certs/page.tsx          ← Add/edit/remove certifications
│   │   └── messages/page.tsx       ← View / reply / delete contact messages
│   └── api/
│       ├── auth/login/route.ts     ← POST: verify creds → set JWT cookie
│       ├── auth/logout/route.ts    ← POST: clear cookie
│       ├── content/[section]/      ← GET (public) + PUT (admin)
│       ├── contact/route.ts        ← POST: save message + send email
│       └── messages/route.ts       ← GET/PATCH/DELETE (admin only)
├── lib/
│   ├── db.ts                       ← JSON file storage (content.json + messages.json)
│   ├── auth.ts                     ← JWT with jose, bcryptjs password check
│   └── types.ts                    ← All TypeScript interfaces
├── components/
│   ├── ContactForm.tsx             ← Client-side contact form (honeypot + rate limit)
│   └── AdminPageWrapper.tsx        ← Shared admin page header + save button
├── middleware.ts                   ← Protects /admin/* routes
├── server.js                       ← Passenger entry point for A2Hosting
├── data/                           ← Auto-created at runtime
│   ├── content.json                ← All portfolio content
│   └── messages.json               ← Contact form submissions
└── scripts/
    ├── hash-password.js            ← Generate bcrypt hash for admin password
    └── build-for-deploy.sh         ← Build locally → create deploy.zip
```

---

## Local Development

```bash
# 1. Install
npm install

# 2. Environment
cp .env.example .env.local
# Fill in JWT_SECRET, ADMIN_PASSWORD_HASH (see step 3), SMTP settings

# 3. Generate admin password hash
node scripts/hash-password.js niloy_portfolio_secret_5142026
# Copy the output hash into ADMIN_PASSWORD_HASH in .env.local

# 4. Run
npm run build
npm start
# or for hot-reload: npm run dev
```

- Portfolio:  http://localhost:3000
- Admin:      http://localhost:3000/admin/login

---

### The golden rule: BUILD LOCALLY, UPLOAD PRE-BUILT

Never run `npm run build` on shared hosting — it hits process limits.
Build on your machine, upload the result.
