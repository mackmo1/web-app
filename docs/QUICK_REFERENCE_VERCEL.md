# Vercel Deployment - Quick Reference Card

## 🚀 Deploy to Vercel

### Prerequisites Checklist

- [ ] Environment variables set in Vercel Dashboard
- [ ] Database accessible from Vercel (Supabase configured)
- [ ] Strapi CMS accessible (if using media features)
- [ ] Git repository connected to Vercel

### Deploy Command

```bash
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Install dependencies (`npm install`)
3. Run `postinstall` → `prisma generate`
4. Run `build` → `prisma generate && next build`
5. Deploy the application

---

## 🔧 Build Scripts

### Current Configuration

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  }
}
```

### What Each Script Does

| Script | Command | When It Runs | Purpose |
|--------|---------|--------------|---------|
| `dev` | `next dev --turbopack` | Local development | Start dev server with Turbopack |
| `build` | `prisma generate && next build` | Vercel deployment | Generate Prisma Client + build app |
| `start` | `next start` | Production server | Start production server |
| `lint` | `next lint` | Manual/CI | Run ESLint checks |
| `postinstall` | `prisma generate` | After `npm install` | Auto-generate Prisma Client |

---

## 🌍 Environment Variables

### Required for Vercel

```bash
# Database (Supabase)
DATABASE_URL=postgresql://user:pass@host:5432/db?pgbouncer=true
DIRECT_URL=postgresql://user:pass@host:5432/db

# Strapi CMS
STRAPI_URL=http://your-strapi-url:1337
STRAPI_TOKEN=your_api_token_here
```

### How to Set in Vercel

1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add each variable
4. Select: Production, Preview, Development
5. Save

---

## 🧪 Test Before Deploying

### Local Build Test

```bash
# Clean build
rm -rf .next lib/generated/prisma

# Install dependencies (triggers postinstall)
npm install

# Build for production
npm run build

# Start production server
npm run start
```

### Expected Output

```
✔ Generated Prisma Client (v6.15.0) to .\lib\generated\prisma
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

## 🔍 Verify Deployment

### 1. Check Build Logs

Vercel Dashboard → Deployments → [Latest] → Build Logs

**Look for:**
```
✔ Generated Prisma Client (v6.15.0) to ./lib/generated/prisma
✓ Compiled successfully
```

### 2. Test Endpoints

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Projects API
curl https://your-app.vercel.app/api/projects

# Leads API
curl https://your-app.vercel.app/api/leads
```

### 3. Check Runtime Logs

Vercel Dashboard → Deployments → [Latest] → Runtime Logs

**No errors should appear related to:**
- Prisma Client
- Database connections
- Missing modules

---

## 🚨 Troubleshooting

### Issue: "Prisma Client is outdated"

**Solution:** ✅ Already fixed!
- `build` script includes `prisma generate`
- `postinstall` script ensures generation

### Issue: "Cannot find module '@/lib/generated/prisma'"

**Check:**
1. Build logs show Prisma generation
2. `postinstall` script is in `package.json`
3. No errors during `npm install`

**Fix:**
```bash
npm run build
```

### Issue: Database connection timeout

**Check:**
1. `DATABASE_URL` and `DIRECT_URL` are set in Vercel
2. Supabase allows connections from Vercel IPs
3. Pages use `force-dynamic` rendering

**Files with dynamic rendering:**
- `app/projects/page.tsx`
- `app/projects/[slug]/page.tsx`

### Issue: Build fails with TypeScript errors

**Check:**
1. All imports use `@/lib/generated/prisma`
2. No imports from `@prisma/client` (except in dependencies)
3. Run `npm run lint` locally

---

## 📊 Build Performance

### Typical Build Times

| Phase | Duration |
|-------|----------|
| Install dependencies | 30-60s |
| Prisma generate | 1-2s |
| Next.js compile | 7-10s |
| Type checking | 2-3s |
| Static generation | 1-2s |
| **Total** | **~45-80s** |

### Build Output

```
Route (app)                              Size  First Load JS
┌ ○ /                                 4.54 kB         152 kB
├ ƒ /api/leads                          150 B        99.8 kB
├ ƒ /api/projects                       150 B        99.8 kB
├ ƒ /projects                           165 B         103 kB
└ ƒ /projects/[slug]                    165 B         103 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## 🔗 Quick Links

### Documentation
- [Full Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Architecture Overview](./architecture.md)
- [API Documentation](./USER_API.md)

### External Resources
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] All tests pass locally
- [ ] `npm run build` succeeds
- [ ] Environment variables configured in Vercel
- [ ] Database migrations applied (if any)
- [ ] Strapi CMS accessible
- [ ] API endpoints tested
- [ ] Build logs reviewed
- [ ] Runtime logs checked
- [ ] No console errors in browser

---

## 🎯 Common Commands

```bash
# Local development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Generate Prisma Client
npx prisma generate

# View database in Prisma Studio
npx prisma studio

# Run database migrations
npx prisma migrate dev

# Pull schema from database
npx prisma db pull
```

---

## 📞 Support

If you encounter issues:

1. Check [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed troubleshooting
2. Review Vercel build and runtime logs
3. Test locally with `npm run build`
4. Check environment variables are set correctly

---

**Last Updated:** 2025-10-17  
**Status:** ✅ Production Ready

