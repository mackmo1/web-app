import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  UpdateLeadRequest, 
  LeadApiResponse, 
  LeadResponse 
} from '@/lib/types/lead';
import { formatLeadResponse } from '@/lib/utils/lead';
import { validateUpdateLeadRequest } from '@/lib/validation/lead';
import { 
  handleApiError,
  createValidationErrorResponse,
  createNotFoundResponse,
  validateLeadId 
} from '@/lib/utils/error-handler';

// GET /api/leads/[id] - Fetch a single lead by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = validateLeadId(id);

    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return createNotFoundResponse('Lead');
    }

    const formattedLead = formatLeadResponse(lead);

    return NextResponse.json<LeadApiResponse<LeadResponse>>({
      success: true,
      data: formattedLead
    });

  } catch (error) {
    console.error('GET /api/leads/[id] error:', error);
    return handleApiError(error);
  }
}

// PUT /api/leads/[id] - Update a lead by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = validateLeadId(id);

    const body = await request.json();

    // Validate request body
    const validation = validateUpdateLeadRequest(body);
    if (!validation.isValid) {
      return createValidationErrorResponse(validation.errors);
    }

    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!existingLead) {
      return createNotFoundResponse('Lead');
    }

    // Check for duplicate email/phone (excluding current lead)
    if (body.email_id || body.phone) {
      const duplicateConditions = [];
      
      if (body.email_id) {
        duplicateConditions.push({ email_id: body.email_id });
      }
      
      if (body.phone) {
        duplicateConditions.push({ phone: body.phone });
      }

      const duplicateLead = await prisma.lead.findFirst({
        where: {
          AND: [
            { id: { not: leadId } },
            { OR: duplicateConditions }
          ]
        }
      });

      if (duplicateLead) {
        return NextResponse.json<LeadApiResponse<null>>({
          success: false,
          error: 'A lead with this email or phone number already exists'
        }, { status: 409 });
      }
    }

    // Prepare update data (only include defined fields)
    const updateData: any = {};
    
    if (body.who !== undefined) updateData.who = body.who.toLowerCase();
    if (body.intent !== undefined) updateData.intent = body.intent.toLowerCase();
    if (body.property_type !== undefined) {
      updateData.property_type = body.property_type ? body.property_type.toLowerCase() : null;
    }
    if (body.agent !== undefined) updateData.agent = body.agent;
    if (body.status !== undefined) {
      updateData.status = body.status ? body.status.toLowerCase() : null;
    }
    if (body.name !== undefined) updateData.name = body.name;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.email_id !== undefined) updateData.email_id = body.email_id.toLowerCase();
    if (body.location !== undefined) updateData.location = body.location;
    if (body.message !== undefined) updateData.message = body.message;
    if (body.budget !== undefined) updateData.budget = body.budget;
    if (body.pin_no !== undefined) updateData.pin_no = body.pin_no;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.bedrooms !== undefined) updateData.bedrooms = body.bedrooms;

    // Update the lead
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: updateData
    });

    const formattedLead = formatLeadResponse(updatedLead);

    return NextResponse.json<LeadApiResponse<LeadResponse>>({
      success: true,
      data: formattedLead,
      message: 'Lead updated successfully'
    });

  } catch (error) {
    console.error('PUT /api/leads/[id] error:', error);
    return handleApiError(error);
  }
}

// DELETE /api/leads/[id] - Delete a lead by ID
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = validateLeadId(id);

    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!existingLead) {
      return createNotFoundResponse('Lead');
    }

    // Delete the lead
    await prisma.lead.delete({
      where: { id: leadId }
    });

    return NextResponse.json<LeadApiResponse<null>>({
      success: true,
      message: 'Lead deleted successfully'
    });

  } catch (error) {
    console.error('DELETE /api/leads/[id] error:', error);
    return handleApiError(error);
  }
}
