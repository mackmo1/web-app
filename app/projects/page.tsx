import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSalePropertyHeroMapByExternalIds } from '@/lib/strapi';

// SSG with ISR near the DB region
export const runtime = 'nodejs';
export const preferredRegion = ['arn1'];
export const revalidate = 3600;

function csvToArray(v?: string | null): string[] {
  return (v || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function ProjectsListingPage() {
  const rows = await prisma.projects.findMany({ orderBy: { created_at: 'desc' }, take: 24 });
  const extIds = rows.map((p) => p.external_id).filter((v): v is string => Boolean(v));
  const heroMap = await getSalePropertyHeroMapByExternalIds(extIds);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Residential Projects</h1>
        <p className="mt-2 text-sm text-gray-600">Explore curated projects with pricing, amenities, and location details.</p>
      </header>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((p) => {
          const nearby = csvToArray(p.near_by).slice(0, 3);
          const slug = p.external_id || p.id.toString();
          const heroUrl = (p.external_id ? heroMap[p.external_id] : null) || '/prestige_banner.jpg';
          return (
            <article key={p.id.toString()} className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
              {/* Cover */}
              <div className="relative h-44 w-full bg-gray-100 sm:h-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroUrl}
                  alt={p.name || 'Project image'}
                  className="absolute inset-0 h-full w-full object-contain"
                />
                {p.overview_area && (
                  <div className="absolute left-3 top-3 rounded bg-black/55 px-2 py-0.5 text-xs text-white">
                    {p.overview_area}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-4">
                <h2 className="line-clamp-1 text-lg font-semibold">{p.name}</h2>
                <p className="mt-1 line-clamp-1 text-sm text-gray-600">{p.address}</p>

                {/* Nearby chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {nearby.map((chip) => (
                    <span key={chip} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                      {chip}
                    </span>
                  ))}
                </div>

                {/* Pricing summary */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Pricing:</span>{' '}
                    {p.price_range || 'TBA'}
                  </div>
                  <Link
                    href={`/projects/${slug}`}
                    className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

