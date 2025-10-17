import { Project, ProjectResponse, ProjectQueryParams } from '../types/project';
import { Prisma } from '../generated/prisma';

function toArray(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function toCSV(value: string | string[] | null | undefined): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (Array.isArray(value)) return value.map((s) => s.trim()).filter(Boolean).join(',');
  return value;
}

export function formatProjectResponse(p: Project): ProjectResponse {
  return {
    id: p.id.toString(),
    created_at: p.created_at.toISOString(),
    name: p.name,
    address: p.address,
    city: p.city,
    google_location: p.google_location,
    overview_area: p.overview_area,
    near_by: toArray(p.near_by),
    overview_floors: p.overview_floors,
    overview_rem1: p.overview_rem1,
    overview_rem2: p.overview_rem2,
    rooms: p.rooms,
    area_sqft: p.area_sqft,
    price_range: p.price_range,
    usp: toArray(p.usp),
    external_id: p.external_id,
  };
}

export function buildProjectWhereClause(params: ProjectQueryParams): Prisma.projectsWhereInput {
  const where: Prisma.projectsWhereInput = {};

  if (params.city) {
    where.city = { contains: params.city, mode: 'insensitive' };
  }

  if (params.name) {
    where.name = { contains: params.name, mode: 'insensitive' };
  }

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: 'insensitive' } },
      { address: { contains: params.q, mode: 'insensitive' } },
      { city: { contains: params.q, mode: 'insensitive' } },
    ];
  }

  return where;
}

export function sanitizeCreateUpdateInput(body: Record<string, unknown>) {
  // Prepare data object respecting optional nullables
  return {
    name: body.name ?? undefined,
    address: body.address ?? undefined,
    city: body.city ?? undefined,
    google_location: body.google_location ?? undefined,
    overview_area: body.overview_area ?? undefined,
    near_by: toCSV(body.near_by as string | string[] | null | undefined),
    overview_floors: body.overview_floors ?? undefined,
    overview_rem1: body.overview_rem1 ?? undefined,
    overview_rem2: body.overview_rem2 ?? undefined,
    rooms: body.rooms ?? undefined,
    area_sqft: body.area_sqft ?? undefined,
    price_range: body.price_range ?? undefined,
    usp: toCSV(body.usp as string | string[] | null | undefined),
    external_id: body.external_id ?? undefined,
  } as Prisma.projectsCreateInput;
}

