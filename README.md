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

## A2Hosting Deployment — Step by Step

### The golden rule: BUILD LOCALLY, UPLOAD PRE-BUILT

Never run `npm run build` on shared hosting — it hits process limits.
Build on your machine, upload the result.

---

### Step 1 — Build locally

**Windows (Git Bash or WSL) / Mac / Linux:**

```bash
npm install
npm run build
```

Or use the helper script (Mac/Linux/WSL):
```bash
bash scripts/build-for-deploy.sh
```

This creates a `deploy.zip` ready to upload.

**Windows without WSL — zip manually:**
After `npm run build` completes, select and zip these files/folders:
- `.next/`
- `app/`
- `lib/`
- `components/`
- `public/`
- `server.js`
- `next.config.mjs`
- `package.json`
- `middleware.ts`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `scripts/`

---

### Step 2 — Upload to A2Hosting

1. Log into cPanel → **File Manager**
2. Navigate to your home directory
3. Create a folder: `niloy-portfolio`
4. Upload `deploy.zip` into it
5. Right-click → **Extract** → extract here

You should now see `.next/`, `app/`, `server.js`, etc. inside `niloy-portfolio/`.

---

### Step 3 — Set up Node.js App in cPanel

1. cPanel → **Setup Node.js App** → **Create Application**
2. Settings:
   | Field | Value |
   |---|---|
   | Node.js version | 18.x or 20.x (latest available) |
   | Application mode | Production |
   | Application root | `niloy-portfolio` |
   | Application URL | `niloyrudra.com` (your domain) |
   | Application startup file | `server.js` |
3. Click **Create**

---

### Step 4 — Set environment variables

In the Node.js App panel, add these environment variables:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | A random string, 32+ characters |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD_HASH` | Output of `node scripts/hash-password.js yourPassword` |
| `DATA_DIR` | `/home/CPANEL_USERNAME/niloy-portfolio/data` |
| `SMTP_HOST` | `mail.niloyrudra.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `contact@niloyrudra.com` |
| `SMTP_PASS` | Your cPanel email password |
| `CONTACT_TO` | `contact@niloyrudra.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://niloyrudra.com` |

> Replace `CPANEL_USERNAME` with your actual cPanel username (shown top-right in cPanel).

---

### Step 5 — Install production dependencies on server

In cPanel → **Terminal**:

```bash
cd ~/niloy-portfolio
npm install --omit=dev
```

This is fast — all packages are pure JavaScript, no compilation.

---

### Step 6 — Create the data directory

```bash
mkdir -p ~/niloy-portfolio/data
chmod 755 ~/niloy-portfolio/data
```

The app will seed `content.json` with your portfolio data on first run.

---

### Step 7 — Start the app

Back in the **Node.js App** panel → click **Restart**.

- Portfolio: `https://niloyrudra.com`
- Admin:     `https://niloyrudra.com/admin/login`

---

## Updating content after deployment

Just log into `/admin`, make changes, click Save. Done.
Changes write to `data/content.json` instantly — no rebuild needed.

---

## Deploying code changes (future updates)

1. Make changes locally
2. Run `npm run build` locally
3. Re-upload only the `.next/` folder (or the full deploy.zip)
4. In Node.js App panel → **Restart**

---

## Finding your cPanel SMTP settings

1. cPanel → **Email Accounts**
2. Click **Connect Devices** next to `contact@niloyrudra.com`
3. Use **Secure SSL/TLS Settings — Outgoing Server**:
   - Host: shown there (usually `mail.niloyrudra.com`)
   - Port: `465` (SSL) or `587` (STARTTLS)

---

## Changing your admin password

```bash
# Run locally
node scripts/hash-password.js yourNewPassword
```

Paste the new hash into the `ADMIN_PASSWORD_HASH` env var in cPanel, then Restart.

---

## Backup your content

Your content lives in `data/content.json` on the server.
Download it via cPanel File Manager anytime as a backup.

To restore: upload the file back and restart.

---

## Troubleshooting

**Blank page / app won't start:**
- cPanel → Node.js App → **Error Log** — the error message will be there
- Check that `.next/` was uploaded (it's a hidden folder — enable "Show Hidden Files" in File Manager)
- Verify `server.js` is set as the startup file

**Admin login fails:**
- Re-run `node scripts/hash-password.js` and update the env var
- Make sure `JWT_SECRET` is set

**Contact form fails to send:**
- Messages are still saved to `data/messages.json` even if email fails
- Check `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` — find correct values in cPanel → Email → Connect Devices
- Try `SMTP_PORT=587` + `SMTP_SECURE=false` if port 465 fails

**`data/` permission error:**
```bash
mkdir -p ~/niloy-portfolio/data
chmod 755 ~/niloy-portfolio/data
```

**App works but content is default:**
- `DATA_DIR` env var must be the absolute path — check it matches your cPanel username
- Example: `/home/niloycom/niloy-portfolio/data`
