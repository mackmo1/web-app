# Documentation Index

Welcome to the Real Estate Agency Web Application documentation. This folder contains comprehensive documentation about the application's architecture, APIs, and integrations.

## 📚 Documentation Files

### Architecture Documentation

#### 1. [architecture.md](./architecture.md)
**Main system architecture overview**

Contains:
- System architecture diagram
- Data flow diagrams
- Technology stack overview
- API architecture
- Database schema (ERD)
- Environment configuration
- Key features and security considerations
- Performance optimizations
- Deployment architecture

**Best for**: Understanding the overall system design and how components interact

---

#### 2. [component-architecture.md](./component-architecture.md)
**Frontend component structure and patterns**

Contains:
- Component hierarchy diagram
- State management flow
- API integration patterns
- File structure
- Component responsibilities
- Styling architecture
- Routing strategy
- Form handling patterns
- Design patterns used

**Best for**: Frontend developers working with React components and pages

---

#### 3. [strapi-integration.md](./strapi-integration.md)
**Strapi CMS integration details**

Contains:
- Integration architecture diagram
- Data flow sequences
- Strapi client implementation
- Media proxy implementation
- Strapi v5 data structure
- URL conversion strategy
- Authentication flow
- Caching strategy
- Error handling
- Benefits of proxy pattern

**Best for**: Understanding how media files are managed and served from Strapi

---

### API Documentation

#### 4. [USER_API.md](./USER_API.md)
**User management API reference**

Contains:
- Complete CRUD endpoints for users
- Request/response examples
- Query parameters
- Filtering and pagination
- Error responses
- TypeScript types

**Endpoints**:
- `GET /api/users` - List users
- `GET /api/users/[id]` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

---

#### 5. [LEAD_API.md](./LEAD_API.md)
**Lead management API reference**

Contains:
- Complete CRUD endpoints for leads
- Request/response examples
- Query parameters
- Filtering and pagination
- Error responses
- TypeScript types

**Endpoints**:
- `GET /api/leads` - List leads
- `GET /api/leads/[id]` - Get single lead
- `POST /api/leads` - Create lead
- `PUT /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead

---

## 🗺️ Quick Navigation

### For New Developers
1. Start with [architecture.md](./architecture.md) to understand the system
2. Read [component-architecture.md](./component-architecture.md) for frontend structure
3. Review API docs ([USER_API.md](./USER_API.md), [LEAD_API.md](./LEAD_API.md)) for backend endpoints

### For Frontend Developers
1. [component-architecture.md](./component-architecture.md) - Component structure
2. [architecture.md](./architecture.md) - API endpoints and data flow
3. [strapi-integration.md](./strapi-integration.md) - Media handling

### For Backend Developers
1. [architecture.md](./architecture.md) - Database schema and API design
2. [USER_API.md](./USER_API.md) - User API implementation
3. [LEAD_API.md](./LEAD_API.md) - Lead API implementation
4. [strapi-integration.md](./strapi-integration.md) - External service integration

### For DevOps/Deployment
1. [architecture.md](./architecture.md) - Deployment architecture and environment config
2. [strapi-integration.md](./strapi-integration.md) - External service dependencies

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Web Browser                          │
│                    (Client Layer)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Application (Port 3000)                │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Frontend   │  │  API Routes  │  │ Business Logic  │  │
│  │    Pages     │──│  /api/*      │──│  Prisma/Strapi  │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│  Supabase        │          │  Strapi CMS      │
│  PostgreSQL      │          │  (Port 1337)     │
│  (Database)      │          │  (Media)         │
└──────────────────┘          └──────────────────┘
```

---

## 🔑 Key Technologies

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Next.js 15, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Database** | PostgreSQL (Supabase) |
| **CMS** | Strapi v5 |
| **Deployment** | Vercel (Next.js), Supabase Cloud (Database) |

---

## 📊 Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **user** | User accounts | email_id, mobile, type, role, verified |
| **property** | Property listings | listing, city, price, rooms, user_id |
| **projects** | Real estate projects | name, address, city, external_id |
| **Lead** | Customer leads | who, intent, status, phone, email_id |

---

## 🔌 API Endpoints Summary

### Users
- `GET /api/users` - List users with filters
- `GET /api/users/[id]` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Properties
- `GET /api/properties` - List properties
- `GET /api/properties/[id]` - Get property
- `POST /api/properties` - Create property
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

### Projects
- `GET /api/projects` - List projects
- `GET /api/projects/[id]` - Get project
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Leads
- `GET /api/leads` - List leads
- `GET /api/leads/[id]` - Get lead
- `POST /api/leads` - Create lead
- `PUT /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead

### Media Proxy
- `GET /api/strapi-media/[...path]` - Proxy Strapi media files

---

## 🎨 Diagrams

All documentation files include Mermaid diagrams that can be viewed:
- In GitHub (automatic rendering)
- In VS Code (with Mermaid extension)
- In any Markdown viewer with Mermaid support

### Diagram Types Included:
- **System Architecture** - Overall system design
- **Sequence Diagrams** - Data flow and interactions
- **Component Hierarchy** - Frontend structure
- **Entity Relationship** - Database schema
- **Flow Charts** - Business logic flows

---

## 🔧 Development Setup

### Prerequisites
```bash
# Required
Node.js 18+
PostgreSQL (via Supabase)
Strapi CMS

# Optional
Docker (for local Strapi)
```

### Environment Variables
```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your_token_here
```

### Quick Start
```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

---

## 📝 Contributing

When adding new features:
1. Update relevant architecture diagrams
2. Document new API endpoints
3. Add TypeScript types
4. Update this README if adding new docs

---

## 🔗 Related Files

- `../IMPLEMENTATION_SUMMARY.md` - User API implementation summary
- `../LEAD_API_IMPLEMENTATION_SUMMARY.md` - Lead API implementation summary
- `../examples/` - API usage examples
- `../tests/` - API test files
- `../lib/types/` - TypeScript type definitions
- `../lib/validation/` - Validation logic
- `../lib/utils/` - Utility functions

---

## 📞 Support

For questions or issues:
1. Check the relevant documentation file
2. Review the architecture diagrams
3. Look at example code in `../examples/`
4. Check test files in `../tests/`

---

**Last Updated**: 2025-10-13  
**Version**: 1.0.0  
**Maintained by**: Development Team

