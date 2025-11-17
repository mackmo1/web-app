import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  LeadApiResponse,
  LeadResponse,
  LeadsListResponse,
  LeadQueryParams
} from '@/lib/types/lead';
import {
  formatLeadResponse,
  buildLeadWhereClause
} from '@/lib/utils/lead';
import {
  validateCreateLeadRequest
} from '@/lib/validation/lead';
import {
  handleApiError,
  createValidationErrorResponse,
  validatePagination
} from '@/lib/utils/error-handler';

// GET /api/leads - Fetch all leads with optional filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const who = searchParams.get('who') || undefined;
    const intent = searchParams.get('intent') || undefined;
    const property_type = searchParams.get('property_type') || undefined;
    const agent = searchParams.get('agent') || undefined;
    const status = searchParams.get('status') || undefined;
    const location = searchParams.get('location') || undefined;
    const search = searchParams.get('search') || undefined;
    const budget_min = searchParams.get('budget_min') || undefined;
    const budget_max = searchParams.get('budget_max') || undefined;
    const created_from = searchParams.get('created_from') || undefined;
    const created_to = searchParams.get('created_to') || undefined;
    const bedrooms = searchParams.get('bedrooms') || undefined;

    // Validate pagination parameters
    validatePagination(page, limit);

    // Build where clause for filtering
    const queryParams: LeadQueryParams = {
      who, intent, property_type, agent, status, location, search,
      budget_min, budget_max, created_from, created_to,
      bedrooms
    };
    const where = buildLeadWhereClause(queryParams);

    // Calculate offset
    const offset = (page - 1) * limit;

    // Fetch leads with pagination
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      prisma.lead.count({ where })
    ]);

    // Format response
    const formattedLeads = leads.map(formatLeadResponse);
    const totalPages = Math.ceil(total / limit);

    const response: LeadsListResponse = {
      leads: formattedLeads,
      total,
      page,
      limit,
      totalPages
    };

    return NextResponse.json<LeadApiResponse<LeadsListResponse>>({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('GET /api/leads error:', error);
    return handleApiError(error);
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = validateCreateLeadRequest(body);
    if (!validation.isValid) {
      return createValidationErrorResponse(validation.errors);
    }

    // Create the lead
    const leadData = {
      who: body.who.toLowerCase(),
      intent: body.intent.toLowerCase(),
      property_type: body.property_type?.toLowerCase() || null,
      agent: body.agent || null,
      status: body.status?.toLowerCase() || 'new', // Default status
      name: body.name || null,
      phone: body.phone,
      email_id: body.email_id.toLowerCase(),
      location: body.location,
      message: body.message || null,
      budget: body.budget || null,
      pin_no: body.pin_no || null,
      address: body.address || null,
      bedrooms: body.bedrooms || null,
    };

    const newLead = await prisma.lead.create({
      data: leadData
    });

    const formattedLead = formatLeadResponse(newLead);

    return NextResponse.json<LeadApiResponse<LeadResponse>>({
      success: true,
      data: formattedLead,
      message: 'Lead created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/leads error:', error);
    return handleApiError(error);
  }
}
