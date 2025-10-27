# Real Estate DB Schema Proposal (Supabase + Prisma)

This proposal adds a normalized, mobile-first friendly schema to power property search (buy/rent), details, agents, saved searches, favorites, and enquiries, while integrating with Strapi for media.

Key goals:
- Efficient search queries (price, city, type, rooms)
- Clean separation (Users/Agents, Listings, Media, Enquiries)
- Media decoupling (Strapi or Supabase Storage)
- Mobile app support (push tokens)

## ERD (high-level)

- user (existing)
- AgentProfile (1–1 user)
- Listing (properties)
  - ListingMedia (images/docs) → source: STRAPI|SUPABASE|EXTERNAL
  - ListingAmenity (M–N) ↔ Amenity
  - Enquiry (1–N)
  - Favorite (M–N) ↔ user
- SavedSearch (filters JSON per user)
- EnquiryEvent (activity for enquiries)
- NotificationToken (push tokens)
- SearchLog (optional analytics)

See docs/db/prisma-schema-proposal.prisma for the detailed Prisma schema.

## Design decisions

- Listings vs. existing `property` table: introduce `Listing` as the primary, normalized model. Migrate or map from `property` gradually (see migration). Keep `projects` unchanged.
- Media: avoid fetching Strapi during SSR; store a CDN/proxied URL in `ListingMedia.cdnUrl`. Keep `source` and `externalId` for Strapi bookkeeping. For Supabase Storage, store `bucket`/`path` and also a transformed `cdnUrl` for fast delivery.
- Amenities: normalize (Amenity + join) for filtering and future i18n.
- SavedSearch: store filter payload as JSON; allows evolving the filter model without schema churn.
- Enquiries: separate entity with status + events for audit trail and assignment to agents.
- Mobile: `NotificationToken` supports FCM/APNs via Capacitor/Expo push.

## Indexing strategy

Common read path (search/list page):
- Listing: composite index `(status, listingType, city)`
- Individual indexes: `price`, `propertyType`, `bedrooms`, `(latitude, longitude)`
- Amenity filtering: join select on `ListingAmenity` with `@@id([listingId, amenityId])` and `@@index([amenityId])`

Text search (title/location):
- Start simple: ILIKE on `title`/`city` with selective filters
- Scale-up options (raw SQL migrations):
  - `CREATE EXTENSION IF NOT EXISTS pg_trgm;`
  - `CREATE INDEX idx_listings_title_trgm ON "Listing" USING gin ("title" gin_trgm_ops);`
  - Postgres full-text search with tsvector column and GIN index

Geo search (optional):
- Begin with `latitude/longitude` numeric fields with a btree or composite index
- Upgrade to PostGIS later for radius search (GiST index) if needed

SavedSearch JSON:
- GIN index on `filters` (Prisma: `@@index([filters], type: Gin)`) helps specific key lookups

## Microservices boundaries (future-ready)

- Property Service
  - Owns: Listing, ListingMedia, ListingAmenity, Amenity
  - Responsibilities: listing CRUD, media URL management, publishing events (e.g., ListingPublished)
- User Service
  - Owns: user (existing), AgentProfile, NotificationToken
  - Responsibilities: auth/profile, push token lifecycle
- Enquiry Service
  - Owns: Enquiry, EnquiryEvent
  - Responsibilities: pipeline, assignment, notifications
- Search Service (optional)
  - Owns: read model / external index (Typesense/Elastic), ingestion from events
- Media Service (optional)
  - Syncs assets from Strapi to Supabase Storage (optional), URL proxying, caching

Data pattern: prefer database-per-service in production; for now, a shared Postgres (Supabase) with clear ownership, and communicate via REST/HTTP internally or event bus (e.g., Supabase functions, queue).

## Migration path from mock data

1) Deploy schema additions alongside existing tables (no breaking changes).
2) Seed base data:
   - Amenity catalog (e.g., Parking, Garden, Pool, Gym, Balcony)
   - A few AgentProfile rows linked to existing `user` rows
   - Sample Listing rows from your current mock objects
   - ListingMedia rows with real or placeholder image URLs
3) Switch UI data source:
   - Implement `/app/api/listings/search` (or a server action) to query `Listing` with filters (type, price range, propertyType, rooms, query)
   - Update `components/BuyPage.tsx` to call the API instead of filtering mock data
4) Gradually backfill/transform existing `property` rows into `Listing` (scripted ETL) and point new writes to `Listing` only
5) Optionally retire/rename the old `property` table when unused

## Prisma integration notes

- Keep your current `prisma/schema.prisma` active. Merge models from `prisma-schema-proposal.prisma` incrementally and `prisma migrate dev` to track changes.
- Keep generator output at `lib/generated/prisma` to match current imports.
- For enums and new models, add one migration at a time, deploy, and test.
- Use Prisma `@map` / `@@map` only if you need to keep legacy table/column names.

## Strapi integration

- Store Strapi asset ID in `ListingMedia.externalId`, set `source=STRAPI`, and save your proxied URL in `cdnUrl` (e.g., `/api/strapi-media/...`).
- Alternatively, copy images to Supabase Storage. Set `source=SUPABASE`, and store `bucket`, `path`, and transformed `cdnUrl` (render endpoint with width/height for thumbnails).
- Do not fetch Strapi during listing SSR. Render `cdnUrl` in the page; the browser fetches bytes via your proxy/CDN.

## Mobile-first considerations

- Push notifications: store device tokens in `NotificationToken`; send property updates or enquiry responses.
- Offline-friendly: important derived data (e.g., user’s favorites, saved searches) can be cached in the app; API endpoints should support conditional requests (ETag/If-None-Match) and pagination.

## Next steps

- Review and confirm the proposal
- I can merge the `Listing`, `Amenity`, joins, and `Enquiry` models into your live schema and add a minimal search API endpoint and seed scripts.

