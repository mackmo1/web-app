import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthTokenFromRequest } from '@/lib/auth';
import { getSalePropertyMediaByExternalId } from '@/lib/strapi';
import type { CreateLeadRequest } from '@/lib/types/lead';
import { validateCreateLeadRequest } from '@/lib/validation/lead';

export const runtime = 'nodejs';

const BROCHURE_LEAD_INTENT = 'brochure_download' as const;

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

function buildProjectRedirect(
  request: NextRequest,
  slugOrId: string,
  errorCode?: string,
  errorMessage?: string,
) {
  const projectUrl = new URL(`/projects/${encodeURIComponent(slugOrId)}`, request.url);
  if (errorCode) projectUrl.searchParams.set('brochureLeadError', errorCode);
  if (errorMessage) projectUrl.searchParams.set('brochureLeadMessage', errorMessage);
  return NextResponse.redirect(projectUrl);
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
      return buildProjectRedirect(request, slugOrId, 'project_not_found', 'This project could not be found.');
    }

    const externalId = (row as { external_id?: string | null }).external_id || slugOrId;

    const media = await getSalePropertyMediaByExternalId(externalId);
    if (!media.brochureUrl) {
      // No brochure available; redirect back to the project page where UI already handles this case
      return buildProjectRedirect(request, slugOrId);
    }

    // Look up the full user to get phone and name
    const user = await prisma.user.findUnique({ where: { email_id: payload.email.toLowerCase() } });
    if (!user) {
      console.warn('[BrochureDownload] Auth token email not found in user table', { email: payload.email });
      return buildProjectRedirect(
        request,
        slugOrId,
        'user_not_found',
        'We could not find your account. Please log in again.',
      );
    }

    if (!user.mobile) {
      console.warn('[BrochureDownload] User missing mobile number; blocking brochure download', {
        userId: user.id.toString(),
        email: user.email_id,
      });
      return buildProjectRedirect(
        request,
        slugOrId,
        'missing_phone',
        'To download the brochure, please add a phone number to your profile.',
      );
    }

    const leadName = user.name || payload.name || null;
    const location = (row as { city?: string | null; address?: string | null }).city
      || (row as { city?: string | null; address?: string | null }).address
      || 'Unknown';

    const leadRequest: CreateLeadRequest = {
      who: 'website',
      intent: BROCHURE_LEAD_INTENT,
      status: 'new',
      name: leadName ?? undefined,
      phone: user.mobile,
      email_id: payload.email,
      location,
      message: `Brochure downloaded for project "${(row as { name?: string | null }).name || 'Untitled Project'}" (id: ${row.id.toString()}, city: ${(row as { city?: string | null }).city || 'N/A'}, external_id: ${(row as { external_id?: string | null }).external_id || 'N/A'})`,
    };

    const validation = validateCreateLeadRequest(leadRequest);
    if (!validation.isValid) {
      console.warn('[BrochureDownload] Lead validation failed', {
        errors: validation.errors,
        email: payload.email,
        projectId: row.id.toString(),
      });
      return buildProjectRedirect(
        request,
        slugOrId,
        'validation_error',
        'We could not process your brochure request. Please try again.',
      );
    }

    try {
      const leadData = {
        who: leadRequest.who.toLowerCase(),
        intent: leadRequest.intent.toLowerCase(),
        property_type: leadRequest.property_type?.toLowerCase() || null,
        agent: leadRequest.agent || null,
        status: (leadRequest.status ?? 'new').toLowerCase(),
        name: leadRequest.name || null,
        phone: leadRequest.phone,
        email_id: leadRequest.email_id.toLowerCase(),
        location: leadRequest.location,
        message: leadRequest.message || null,
        budget: leadRequest.budget || null,
        pin_no: leadRequest.pin_no || null,
        address: leadRequest.address || null,
        bedrooms: leadRequest.bedrooms || null,
      };

      const createdLead = await prisma.lead.create({ data: leadData });

      console.info('[BrochureDownload] Created brochure_download lead', {
        leadId: createdLead.id.toString(),
        projectId: row.id.toString(),
        externalId,
        email: leadRequest.email_id.toLowerCase(),
      });
    } catch (leadError) {
      console.error('[BrochureDownload] Failed to create lead for brochure download', {
        error: leadError instanceof Error ? leadError.message : String(leadError),
        projectId: row.id.toString(),
        externalId,
        email: payload.email,
      });
      return buildProjectRedirect(
        request,
        slugOrId,
        'lead_creation_failed',
        'We could not create your enquiry right now. Please try again later.',
      );
    }

    // Lead created successfully; redirect directly to the Strapi brochure URL
    return NextResponse.redirect(media.brochureUrl);
  } catch (error) {
    console.error('GET /api/projects/[id]/brochure-download error:', error);
    const fallbackUrl = new URL('/projects', request.url);
    return NextResponse.redirect(fallbackUrl);
  }
}
