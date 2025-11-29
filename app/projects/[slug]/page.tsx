import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSalePropertyMediaByExternalId } from '@/lib/strapi';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';

import type { Prisma } from '@/lib/generated/prisma';


export const runtime = 'nodejs';
export const preferredRegion = ['arn1'];
export const revalidate = 3600;

export async function generateStaticParams() {
  const { data, error } = await supabaseAdmin.from('projects').select('id, external_id');
  if (error || !data) return [] as { slug: string }[];
  return data.map((p) => ({ slug: p.external_id || String(p.id) }));
}

function csvToArray(v?: string | null): string[] {
  return (v || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function toEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  // Already an embed URL
  if (url.includes('/maps/embed?') || url.includes('output=embed')) return url;
  // If it has a query param form, append output=embed
  try {
    const u = new URL(url);
    if (u.hostname.includes('google.') && (u.pathname.includes('/maps') || u.hostname.includes('maps.google'))) {
      if (!u.searchParams.has('output')) {
        u.searchParams.append('output', 'embed');
      }
      return u.toString();
    }
  } catch {
    // Fallback: if it's a plain string with google maps, best-effort append
    if (url.startsWith('http') && url.includes('google.com/maps')) {
      return url + (url.includes('?') ? '&' : '?') + 'output=embed';
    }
  }
  return url;
}

// Pricing tiers type used for rendering multiple tiers
type PricingTier = { rooms: string; area_sqft: string; price_range: string };



async function getProjectBySlugOrId(slug: string) {
  // If slug is numeric, treat as ID
  const asNum = Number(slug);
  if (!Number.isNaN(asNum) && Number.isFinite(asNum)) {
    const row = await prisma.projects.findUnique({ where: { id: BigInt(asNum) } });
    return row;
  }
  // Try by external_id
  const byExternal = await prisma.projects.findFirst({ where: { external_id: slug } });
  if (byExternal) return byExternal;
  // Fallback by name contains (slug with dashes -> spaces)
  const nameLike = slug.replace(/[-_]+/g, ' ');
  return prisma.projects.findFirst({ where: { name: { contains: nameLike, mode: 'insensitive' } } });
}

export default async function ProjectPage(
  {
    params,
    searchParams,
  }: {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  },
) {
  const { slug } = await params;
  const resolvedSearchParams = (searchParams && (await searchParams)) ?? undefined;
  const brochureLeadErrorRaw = resolvedSearchParams?.brochureLeadError;
  const brochureLeadMessageRaw = resolvedSearchParams?.brochureLeadMessage;
  const brochureLeadError = Array.isArray(brochureLeadErrorRaw) ? brochureLeadErrorRaw[0] : brochureLeadErrorRaw;
  const brochureLeadMessage = Array.isArray(brochureLeadMessageRaw) ? brochureLeadMessageRaw[0] : brochureLeadMessageRaw;
  const brochureErrorToShow =
    brochureLeadMessage
      || (brochureLeadError === 'missing_phone'
        ? 'To download the brochure, please add a phone number to your profile.'
        : brochureLeadError === 'validation_error'
          ? 'We could not process your brochure request. Please try again.'
          : brochureLeadError === 'lead_creation_failed'
            ? 'We could not create your enquiry right now. Please try again later.'
            : brochureLeadError === 'user_not_found'
              ? 'We could not find your account. Please log in again.'
              : undefined);
  const row = await getProjectBySlugOrId(slug);
  if (!row) {
    return notFound();
  }
  const externalId = row.external_id || slug;
  let media = { heroUrl: null as string | null, imageUrls: [] as string[], brochureUrl: null as string | null };
  try {
    media = await getSalePropertyMediaByExternalId(externalId);
  } catch (e) {
    console.error('[ProjectPage] Strapi media fetch failed', { externalId, error: e instanceof Error ? e.message : String(e) });
  }

  // Normalize pricing tiers with backward compatibility
  const rawValue: unknown = (row as { pricing_tiers?: unknown }).pricing_tiers ?? null;
  const rawArray: Prisma.JsonArray = Array.isArray(rawValue) ? (rawValue as Prisma.JsonArray) : [];
  const jsonTiers: PricingTier[] = rawArray
    .map((t) => {
      const obj = t && typeof t === 'object' && !Array.isArray(t) ? (t as Record<string, unknown>) : {};
      const rooms = typeof obj['rooms'] === 'string' && (obj['rooms'] as string).trim() ? (obj['rooms'] as string) : '';
      const area_sqft = typeof obj['area_sqft'] === 'string' && (obj['area_sqft'] as string).trim() ? (obj['area_sqft'] as string) : '';
      const price_range = typeof obj['price_range'] === 'string' && (obj['price_range'] as string).trim() ? (obj['price_range'] as string) : '';
      return { rooms, area_sqft, price_range };
    })
    .filter((t) => t.rooms || t.area_sqft || t.price_range)
    .map((t) => ({
      rooms: t.rooms || 'TBA',
      area_sqft: t.area_sqft || 'TBA',
      price_range: t.price_range || 'TBA',
    }));

  const tiers: PricingTier[] = jsonTiers.length > 0
    ? jsonTiers
    : ((row.rooms || row.area_sqft || row.price_range)
        ? [{ rooms: row.rooms || 'TBA', area_sqft: row.area_sqft || 'TBA', price_range: row.price_range || 'TBA' }]
        : []);

  const project = {
    name: row.name || 'Untitled Project',
    address: row.address || '',
    nearby: csvToArray(row.near_by),
    overview: {
      area: row.overview_area || '-',
      floors: row.overview_floors || '-',
      towers: row.overview_rem1 || '-',
      units: row.overview_rem2 || '-',
    },
    googleMapsUrl: row.google_location || null,
    brochureUrl: media.brochureUrl,
    brochureDownloadUrl: `/api/projects/${encodeURIComponent(slug)}/brochure-download`,
    usps: csvToArray(row.usp),
    heroUrl: media.heroUrl,
    galleryUrls: media.imageUrls,
    pricingTiers: tiers,
  };

  if (!project) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Project not found</h1>
          <p className="mt-2 text-muted-foreground">Please check the URL or explore other projects.</p>
          <div className="mt-6">
            <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gray-900 text-white">
        {project.heroUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={project.name}
            src={project.heroUrl}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )}
        <div className="relative z-10 p-6 sm:p-10">
          <h1 className="text-2xl sm:text-4xl font-bold">
            {project.name}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-200">
            {project.address}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.nearby.slice(0, 5).map((chip) => (
              <span key={chip} className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs sm:text-sm">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Grid layout */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Nearby Areas */}
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Nearby Areas</h2>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {project.nearby.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Overview */}
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Overview</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-sm text-gray-500">Area</div>
                <div className="mt-1 text-base font-medium">{project.overview.area}</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-sm text-gray-500">Floors</div>
                <div className="mt-1 text-base font-medium">{project.overview.floors}</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-sm text-gray-500">Towers</div>
                <div className="mt-1 text-base font-medium">{project.overview.towers}</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-sm text-gray-500">Units</div>
                <div className="mt-1 text-base font-medium">{project.overview.units}</div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Pricing</h2>
            {project.pricingTiers && project.pricingTiers.length > 0 ? (
              <div className="mt-4 space-y-3">
                {project.pricingTiers.map((t, i) => (
                  <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="text-xs text-gray-500">Rooms (BHK)</div>
                      <div className="mt-1 text-sm font-medium">{t.rooms || 'TBA'}</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="text-xs text-gray-500">Area (sq ft)</div>
                      <div className="mt-1 text-sm font-medium">{t.area_sqft || 'TBA'}</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="text-xs text-gray-500">Price Range</div>
                      <div className="mt-1 text-sm font-medium">{t.price_range || 'TBA'}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-600">Pricing to be announced</p>
            )}
          </section>

          {/* Gallery (from Strapi) */}
          {project.galleryUrls && project.galleryUrls.length > 0 && (
            <section className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {project.galleryUrls.map((url) => (
                  <a key={url} href={url} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-md border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="Project image" className="h-36 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* USP / Amenities */}
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">USP & Amenities</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {project.usps.map((usp) => (
                <li key={usp} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                  <span className="text-sm text-gray-700">{usp}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right column */}
        <aside className="space-y-6">
          {/* Location */}
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Location</h2>
            {project.googleMapsUrl ? (
              <div className="mt-4 overflow-hidden rounded-lg border">
                <iframe
                  src={toEmbedUrl(project.googleMapsUrl) || undefined}
                  width="100%"
                  height="260"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-600">Map link will appear here.</p>
            )}
            {/* Temporarily hide the external Google Maps link
            {project.googleMapsUrl && (
              <div className="mt-3">
                <a
                  href={toExternalMapsUrl(project.googleMapsUrl) ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
            )}
            */}
          </section>

          {/* Brochure */}
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Brochure</h2>
            <p className="mt-2 text-sm text-gray-600">Get the detailed project brochure with floor plans and specifications.</p>
            {brochureErrorToShow && (
              <p className="mt-2 text-sm text-red-600">{brochureErrorToShow}</p>
            )}
            <div className="mt-4">
              {project.brochureUrl ? (
                <a
                  href={project.brochureDownloadUrl}
                  className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Download Brochure
                </a>
              ) : (
                <button
                  type="button"
                  aria-disabled="true"
                  disabled
                  className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed"
                  title="Brochure not available"
                >
                  Brochure not available
                </button>
              )}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

