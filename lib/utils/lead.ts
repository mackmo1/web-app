import { Lead, LeadResponse, LeadQueryParams } from '../types/lead';
import { Prisma } from '../generated/prisma';

// Extended Lead type with bedrooms field
type LeadWithBedrooms = Lead & {
  bedrooms?: string | null;
};

// Convert Prisma lead to API response format
export function formatLeadResponse(lead: Lead): LeadResponse {
  const leadWithBedrooms = lead as LeadWithBedrooms;
  return {
    id: lead.id.toString(),
    created_at: lead.created_at.toISOString(),
    who: lead.who,
    intent: lead.intent,
    property_type: lead.property_type,
    agent: lead.agent,
    status: lead.status,
    name: lead.name,
    phone: lead.phone,
    email_id: lead.email_id,
    location: lead.location,
    message: lead.message,
    budget: lead.budget,
    pin_no: lead.pin_no,
    address: lead.address,
    bedrooms: leadWithBedrooms.bedrooms ?? null,
  };
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number format
export function isValidPhone(phone: string): boolean {
  // Allow various phone formats: +1234567890, 1234567890, (123) 456-7890, etc.
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone);
}

// Validate who field
export function isValidWho(who: string): boolean {
  const validOptions = ['buyer', 'seller', 'investor', 'tenant', 'landlord', 'website'];
  return validOptions.includes(who.toLowerCase());
}

// Validate intent field
export function isValidIntent(intent: string): boolean {
  const validOptions = ['buy', 'sell', 'rent', 'lease', 'invest'];
  return validOptions.includes(intent.toLowerCase());
}

// Validate property type
export function isValidPropertyType(propertyType: string): boolean {
  const validOptions = ['apartment', 'villa', 'plot', 'commercial', 'office', 'warehouse'];
  return validOptions.includes(propertyType.toLowerCase());
}

// Validate status
export function isValidStatus(status: string): boolean {
  const validOptions = ['new', 'contacted', 'qualified', 'converted', 'closed', 'lost'];
  return validOptions.includes(status.toLowerCase());
}

// Validate budget format (should be numeric or range like "50000-100000")
export function isValidBudget(budget: string): boolean {
  // Allow formats: "50000", "50000-100000", "50K", "1L", "1Cr"
  const budgetRegex = /^[\d,]+(\s*-\s*[\d,]+)?[KLCr]*$/i;
  return budgetRegex.test(budget.trim());
}

// Validate PIN code
export function isValidPinCode(pinCode: string): boolean {
  // Indian PIN code format: 6 digits
  const pinRegex = /^\d{6}$/;
  return pinRegex.test(pinCode);
}

// Build where clause for lead filtering
export function buildLeadWhereClause(params: LeadQueryParams): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};

  // Exact match filters
  if (params.who) {
    where.who = params.who;
  }

  if (params.intent) {
    where.intent = params.intent;
  }

  if (params.property_type) {
    where.property_type = params.property_type;
  }

  if (params.bedrooms) {
    where.bedrooms = params.bedrooms;
  }

  if (params.agent) {
    where.agent = { contains: params.agent, mode: 'insensitive' };
  }

  if (params.status) {
    where.status = params.status;
  }

  if (params.location) {
    where.location = { contains: params.location, mode: 'insensitive' };
  }

  // Search across multiple fields
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { email_id: { contains: params.search, mode: 'insensitive' } },
      { phone: { contains: params.search, mode: 'insensitive' } },
      { location: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  // Budget filtering (exact match only - budget is stored as string)
  // Note: For range filtering, budget should be stored as a numeric field
  if (params.budget_min || params.budget_max) {
    // Since budget is a string field, we can only do exact match or contains
    // For now, we'll skip range filtering on string budget field
    // TODO: Convert budget to numeric field for proper range filtering
  }

  // Date range filtering
  if (params.created_from || params.created_to) {
    const dateConditions: Prisma.DateTimeFilter = {};
    
    if (params.created_from) {
      dateConditions.gte = new Date(params.created_from);
    }
    
    if (params.created_to) {
      dateConditions.lte = new Date(params.created_to);
    }
    
    where.created_at = dateConditions;
  }

  return where;
}

// Hash sensitive data (if needed for privacy)
export function hashPhone(phone: string): string {
  // Simple masking for display purposes
  if (phone.length <= 4) return phone;
  const visibleDigits = phone.slice(-4);
  const maskedPart = '*'.repeat(phone.length - 4);
  return maskedPart + visibleDigits;
}

// Format budget for display
export function formatBudget(budget: string): string {
  if (!budget) return '';
  
  // Convert numeric budget to readable format
  const numericBudget = parseInt(budget.replace(/[^\d]/g, ''));
  
  if (isNaN(numericBudget)) return budget;
  
  if (numericBudget >= 10000000) { // 1 Crore
    return `₹${(numericBudget / 10000000).toFixed(1)}Cr`;
  } else if (numericBudget >= 100000) { // 1 Lakh
    return `₹${(numericBudget / 100000).toFixed(1)}L`;
  } else if (numericBudget >= 1000) { // 1 Thousand
    return `₹${(numericBudget / 1000).toFixed(1)}K`;
  } else {
    return `₹${numericBudget}`;
  }
}

// Generate lead reference number
export function generateLeadReference(id: bigint): string {
  const timestamp = Date.now().toString().slice(-6);
  const leadId = id.toString().padStart(4, '0');
  return `LEAD-${timestamp}-${leadId}`;
}

// Check if lead is recent (within last 24 hours)
export function isRecentLead(createdAt: Date): boolean {
  const now = new Date();
  const timeDiff = now.getTime() - createdAt.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  return hoursDiff <= 24;
}

// Get lead priority based on intent and budget
export function getLeadPriority(intent: string, budget?: string): 'high' | 'medium' | 'low' {
  const highPriorityIntents = ['buy', 'invest'];
  const isHighPriorityIntent = highPriorityIntents.includes(intent.toLowerCase());
  
  if (!budget) {
    return isHighPriorityIntent ? 'medium' : 'low';
  }
  
  const numericBudget = parseInt(budget.replace(/[^\d]/g, ''));
  
  if (isNaN(numericBudget)) {
    return isHighPriorityIntent ? 'medium' : 'low';
  }
  
  // High priority: High budget + high priority intent
  if (numericBudget >= 5000000 && isHighPriorityIntent) { // 50L+
    return 'high';
  }
  
  // Medium priority: Medium budget or high priority intent
  if (numericBudget >= 1000000 || isHighPriorityIntent) { // 10L+
    return 'medium';
  }
  
  return 'low';
}
