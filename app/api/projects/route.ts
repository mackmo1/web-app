import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { projects as ProjectsModel } from '@/lib/generated/prisma';
import { ProjectApiResponse, ProjectResponse, ProjectsListResponse, ProjectQueryParams } from '@/lib/types/project';
import { buildProjectWhereClause, formatProjectResponse, sanitizeCreateUpdateInput } from '@/lib/utils/project';
import { validateCreateProjectRequest } from '@/lib/validation/project';
import { handleApiError, createValidationErrorResponse, validatePagination } from '@/lib/utils/error-handler';

// GET /api/projects - list with optional filters and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const city = searchParams.get('city') || undefined;
    const name = searchParams.get('name') || undefined;
    const q = searchParams.get('q') || undefined;

    validatePagination(page, limit);

    const where = buildProjectWhereClause({ city, name, q } as ProjectQueryParams);
    const offset = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      prisma.projects.findMany({ where, skip: offset, take: limit, orderBy: { created_at: 'desc' } }),
      prisma.projects.count({ where })
    ]);

    const projects = rows.map(formatProjectResponse);
    const resp: ProjectsListResponse = {
      projects,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit))
    };

    return NextResponse.json<ProjectApiResponse<ProjectsListResponse>>({ success: true, data: resp });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return handleApiError(error);
  }
}

// POST /api/projects - create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateCreateProjectRequest(body);
    if (!validation.isValid) {
      return createValidationErrorResponse(validation.errors);
    }

    const data = sanitizeCreateUpdateInput(body);

    const created = await prisma.projects.create({ data });
    const formatted = formatProjectResponse(created as ProjectsModel);

    return NextResponse.json<ProjectApiResponse<ProjectResponse>>({
      success: true,
      data: formatted,
      message: 'Project created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return handleApiError(error);
  }
}

