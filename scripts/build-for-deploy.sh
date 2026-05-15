#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# build-for-deploy.sh
# Run this on YOUR LOCAL machine (Windows users: use Git Bash or WSL)
# Creates a ready-to-upload deploy.zip with the pre-built app
# ─────────────────────────────────────────────────────────────────
set -e

echo "▶ Installing all dependencies..."
npm install

echo "▶ Building Next.js app..."
npm run build

echo "▶ Creating deployment archive..."
# Include everything the server needs to RUN (not build)
zip -r deploy.zip \
  .next \
  public \
  server.js \
  next.config.mjs \
  package.json \
  scripts/hash-password.js \
  --exclude "*.DS_Store" \
  --exclude "__MACOSX"

# Add source files needed at runtime (API routes, lib, components, app)
zip -r deploy.zip \
  app \
  lib \
  components \
  middleware.ts \
  tsconfig.json \
  tailwind.config.ts \
  postcss.config.mjs \
  --exclude "*.DS_Store"

echo ""
echo "✅ deploy.zip created!"
echo ""
echo "Next steps:"
echo "  1. Upload deploy.zip to A2Hosting via cPanel File Manager"
echo "  2. Extract it inside your app folder (e.g. niloy-portfolio/)"
echo "  3. In cPanel Terminal: cd ~/niloy-portfolio && npm install --omit=dev"
echo "  4. Set environment variables in cPanel Node.js App panel"
echo "  5. Click Restart in the Node.js App panel"
echo ""
