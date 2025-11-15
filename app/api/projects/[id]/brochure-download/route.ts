import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthTokenFromRequest } from '@/lib/auth';
import { getSalePropertyMediaByExternalId } from '@/lib/strapi';

export const runtime = 'nodejs';

async function getProjectBySlugOrId(slugOrId: string) {
  const asNum = Number(slugOrId);
  if (!Number.isNaN(asNum) && Number.isFinite(asNum)) {
    const row = await prisma.projects.findUnique({ where: { id: BigInt(asNum) } });
    return row;
  }

  const byExternal = await prisma.projects.findFirst({ where: { external_id: slugOrId } });
  if (byExternal) return byExternal;

  const nameLike = slugOrId.replace(/[-_]+/g, ' ');
  return prisma.projects.findFirst({ where: { name: { contains: nameLike, mode: 'insensitive' } } });
}

// GET /api/projects/[id]/brochure-download
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const slugOrId = id;

    const payload = getAuthTokenFromRequest(request);
    if (!payload) {
      // Not authenticated: redirect to login with redirect back to the project page
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', `/projects/${encodeURIComponent(slugOrId)}`);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated: resolve project and brochure URL
    const row = await getProjectBySlugOrId(slugOrId);
    if (!row) {
      // Project not found: send back to the project page (which will show 404 if needed)
      const projectUrl = new URL(`/projects/${encodeURIComponent(slugOrId)}`, request.url);
      return NextResponse.redirect(projectUrl);
    }

    const externalId = (row as { external_id?: string | null }).external_id || slugOrId;

    const media = await getSalePropertyMediaByExternalId(externalId);
    if (!media.brochureUrl) {
      // No brochure available; redirect back to the project page where UI already handles this case
      const projectUrl = new URL(`/projects/${encodeURIComponent(slugOrId)}`, request.url);
      return NextResponse.redirect(projectUrl);
    }

    // Redirect directly to the Strapi brochure URL
    return NextResponse.redirect(media.brochureUrl);
  } catch (error) {
    console.error('GET /api/projects/[id]/brochure-download error:', error);
    const fallbackUrl = new URL('/projects', request.url);
    return NextResponse.redirect(fallbackUrl);
  }
}

