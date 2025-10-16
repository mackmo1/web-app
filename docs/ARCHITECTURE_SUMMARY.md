# Architecture Summary - Quick Reference

## 🎯 System at a Glance

**Real Estate Agency Web Application**
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **CMS**: Strapi v5
- **Styling**: Tailwind CSS
- **ORM**: Prisma

---

## 📁 Project Structure

```
web-app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (Backend)
│   ├── (pages)/           # Frontend Pages
│   └── layout.tsx         # Root Layout
├── components/            # React Components
├── lib/                   # Shared Libraries
│   ├── types/            # TypeScript Types
│   ├── utils/            # Utilities
│   ├── validation/       # Validators
│   ├── prisma.ts         # Prisma Client
│   └── strapi.ts         # Strapi Client
├── prisma/               # Database Schema
├── docs/                 # Documentation (You are here!)
└── public/               # Static Assets
```

---

## 🔄 Request Flow

### Frontend Page Request
```
Browser → Next.js Page → Prisma → PostgreSQL → Response
```

### API Request
```
Browser → API Route → Validation → Prisma → PostgreSQL → Response
```

### Media Request (Strapi)
```
Browser → /api/strapi-media → Strapi CMS → Media File → Browser
```

---

## 🗄️ Database Tables

| Table | Records | Purpose |
|-------|---------|---------|
| `user` | User accounts | Authentication & profiles |
| `property` | Property listings | Buy/Rent properties |
| `projects` | Real estate projects | Project information |
| `Lead` | Customer inquiries | Lead management |

---

## 🌐 API Endpoints

### Pattern: `/api/{resource}` and `/api/{resource}/[id]`

| Resource | Endpoints | Operations |
|----------|-----------|------------|
| **users** | `/api/users`, `/api/users/[id]` | CRUD |
| **properties** | `/api/properties`, `/api/properties/[id]` | CRUD |
| **projects** | `/api/projects`, `/api/projects/[id]` | CRUD |
| **leads** | `/api/leads`, `/api/leads/[id]` | CRUD |
| **strapi-media** | `/api/strapi-media/[...path]` | Proxy |

---

## 🎨 Frontend Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home | Landing page |
| `/buy` | Buy | Property buying |
| `/rent` | Rent | Property rental |
| `/projects` | Projects List | All projects |
| `/projects/[slug]` | Project Detail | Single project |
| `/login` | Login | User login |
| `/register` | Register | User registration |
| `/contact-us` | Contact | Contact form |
| `/enquery` | Enquiry | Enquiry form |
| `/posting` | Posting | Post property |

---

## 🔐 Security Features

1. **Environment Variables**: Sensitive data in `.env`
2. **Server-Side Auth**: Strapi token never exposed to browser
3. **Input Validation**: All API inputs validated
4. **Prisma ORM**: SQL injection prevention
5. **Type Safety**: TypeScript throughout

---

## ⚡ Performance Features

1. **Server-Side Rendering**: SEO-friendly pages
2. **Connection Pooling**: Efficient database connections
3. **Media Caching**: Immutable cache headers
4. **Code Splitting**: Automatic with Next.js
5. **Image Optimization**: Next.js Image component

---

## 🔌 External Integrations

### Strapi CMS (localhost:1337)
- **Purpose**: Media management (images, PDFs)
- **Authentication**: Bearer token
- **Integration**: REST API + Media Proxy

### Supabase PostgreSQL
- **Purpose**: Primary database
- **Connection**: Prisma ORM
- **Features**: Connection pooling, migrations

---

## 📊 Data Models

### User
```typescript
{
  id: bigint
  email_id: string (unique)
  mobile: string (unique)
  type: string
  name: string
  city: string
  verified: boolean
  role: string
}
```

### Property
```typescript
{
  id: bigint
  listing: string
  city: string
  price: decimal
  rooms: string
  user_id: bigint (FK)
  external_id: string
}
```

### Project
```typescript
{
  id: bigint
  name: string
  address: string
  city: string
  external_id: string (unique)
  // + overview fields
}
```

### Lead
```typescript
{
  id: bigint
  who: string
  intent: string
  name: string
  phone: string
  email_id: string
  status: string
}
```

---

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)

# Database
npx prisma migrate dev   # Run migrations
npx prisma studio        # Open Prisma Studio
npx prisma generate      # Generate Prisma client

# Build
npm run build            # Production build
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint
```

---

## 🌍 Environment Variables

```env
# Database
DATABASE_URL=postgresql://...       # Connection pooling
DIRECT_URL=postgresql://...         # Direct connection

# Strapi
STRAPI_URL=http://localhost:1337   # Strapi base URL
STRAPI_TOKEN=...                    # API token
```

---

## 📦 Key Dependencies

### Frontend
- `react` - UI library
- `next` - Framework
- `typescript` - Type safety
- `tailwindcss` - Styling

### Backend
- `@prisma/client` - Database ORM
- `prisma` - Database toolkit

### Development
- `eslint` - Linting
- `@types/*` - TypeScript types

---

## 🎯 Design Patterns

1. **API Route Handlers**: RESTful design
2. **Server Components**: Default rendering
3. **Client Components**: Interactive UI
4. **Proxy Pattern**: Media file serving
5. **Repository Pattern**: Prisma abstraction
6. **Validation Layer**: Input sanitization
7. **Error Handling**: Centralized errors

---

## 📈 Scalability Considerations

### Current
- Single Next.js server
- Supabase managed PostgreSQL
- Strapi on localhost

### Future
- **CDN**: Cloudflare/CloudFront for media
- **Caching**: Redis for API responses
- **Load Balancing**: Multiple Next.js instances
- **Database**: Read replicas
- **Monitoring**: Application performance monitoring

---

## 🧪 Testing Strategy

### Current
- API endpoint tests (`tests/`)
- Example client code (`examples/`)

### Recommended
- Unit tests (Jest)
- Integration tests (Playwright)
- E2E tests (Cypress)
- API tests (Supertest)

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Documentation index |
| `architecture.md` | System architecture |
| `component-architecture.md` | Frontend structure |
| `strapi-integration.md` | Strapi integration |
| `USER_API.md` | User API reference |
| `LEAD_API.md` | Lead API reference |
| `ARCHITECTURE_SUMMARY.md` | This file |

---

## 🚀 Deployment

### Development
```
localhost:3000 (Next.js)
localhost:1337 (Strapi)
Supabase Cloud (Database)
```

### Production (Recommended)
```
Vercel (Next.js)
Strapi Cloud or VPS (Strapi)
Supabase Cloud (Database)
```

---

## 🔍 Troubleshooting

### Images not loading?
- Check `STRAPI_URL` and `STRAPI_TOKEN`
- Verify Strapi is running
- Check browser console for errors
- Review `/api/strapi-media` logs

### Database connection issues?
- Verify `DATABASE_URL` and `DIRECT_URL`
- Check Supabase dashboard
- Run `npx prisma generate`

### API errors?
- Check request validation
- Review API route logs
- Verify database schema
- Check Prisma client generation

---

## 📞 Quick Links

- [Full Architecture](./architecture.md)
- [Component Guide](./component-architecture.md)
- [Strapi Integration](./strapi-integration.md)
- [User API](./USER_API.md)
- [Lead API](./LEAD_API.md)

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-13  
**Tech Stack**: Next.js 15 + React 19 + TypeScript + Prisma + PostgreSQL + Strapi

