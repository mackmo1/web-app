import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProjectApiResponse, ProjectResponse } from '@/lib/types/project';
import { formatProjectResponse, sanitizeCreateUpdateInput } from '@/lib/utils/project';
import { validateUpdateProjectRequest } from '@/lib/validation/project';
import { handleApiError, createValidationErrorResponse, createNotFoundResponse, validateProjectId } from '@/lib/utils/error-handler';

// GET /api/projects/[id]
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const projectId = validateProjectId(id);

    const row = await prisma.projects.findUnique({ where: { id: projectId } });
    if (!row) return createNotFoundResponse('Project');

    const formatted = formatProjectResponse(row as any);
    return NextResponse.json<ProjectApiResponse<ProjectResponse>>({ success: true, data: formatted });
  } catch (error) {
    console.error('GET /api/projects/[id] error:', error);
    return handleApiError(error);
  }
}

// PUT /api/projects/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const projectId = validateProjectId(id);

    const body = await request.json();
    const validation = validateUpdateProjectRequest(body);
    if (!validation.isValid) {
      return createValidationErrorResponse(validation.errors);
    }

    const exists = await prisma.projects.findUnique({ where: { id: projectId } });
    if (!exists) return createNotFoundResponse('Project');

    const data = sanitizeCreateUpdateInput(body);
    const updated = await prisma.projects.update({ where: { id: projectId }, data });

    const formatted = formatProjectResponse(updated as any);
    return NextResponse.json<ProjectApiResponse<ProjectResponse>>({ success: true, data: formatted, message: 'Project updated successfully' });
  } catch (error) {
    console.error('PUT /api/projects/[id] error:', error);
    return handleApiError(error);
  }
}

// DELETE /api/projects/[id]
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const projectId = validateProjectId(id);

    const exists = await prisma.projects.findUnique({ where: { id: projectId } });
    if (!exists) return createNotFoundResponse('Project');

    await prisma.projects.delete({ where: { id: projectId } });

    return NextResponse.json<ProjectApiResponse<null>>({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/projects/[id] error:', error);
    return handleApiError(error);
  }
}

