// Lead types based on Prisma schema
export interface Lead {
  id: bigint;
  created_at: Date;
  who: string;
  intent: string;
  property_type: string | null;
  agent: string | null;
  status: string | null;
  name: string | null;
  phone: string;
  email_id: string;
  location: string;
  message: string | null;
  budget: string | null;
  pin_no: string | null;
  address: string | null;
  bedrooms: string | null;
}

// Request types for API operations
export interface CreateLeadRequest {
  who: string;
  intent: string;
  property_type?: string;
  agent?: string;
  status?: string;
  name?: string;
  phone: string;
  email_id: string;
  location: string;
  message?: string;
  budget?: string;
  pin_no?: string;
  address?: string;
  bedrooms?: string;
}

export interface UpdateLeadRequest {
  who?: string;
  intent?: string;
  property_type?: string;
  agent?: string;
  status?: string;
  name?: string;
  phone?: string;
  email_id?: string;
  location?: string;
  message?: string;
  budget?: string;
  pin_no?: string;
  address?: string;
  bedrooms?: string;
}

// Response types
export interface LeadResponse {
  id: string; // Convert bigint to string for JSON serialization
  created_at: string;
  who: string;
  intent: string;
  property_type: string | null;
  agent: string | null;
  status: string | null;
  name: string | null;
  phone: string;
  email_id: string;
  location: string;
  message: string | null;
  budget: string | null;
  pin_no: string | null;
  address: string | null;
  bedrooms: string | null;
}

export interface LeadsListResponse {
  leads: LeadResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Query parameters for filtering leads
export interface LeadQueryParams {
  page?: number;
  limit?: number;
  who?: string;
  intent?: string;
  property_type?: string;
  agent?: string;
  status?: string;
  location?: string;
  search?: string; // For searching by name, email, or phone
  budget_min?: string;
  budget_max?: string;
  created_from?: string; // ISO date string
  created_to?: string; // ISO date string
  bedrooms?: string;
}

// Validation schemas
export interface LeadValidationRules {
  who: {
    required: true;
    enum: string[];
  };
  intent: {
    required: true;
    enum: string[];
  };
  property_type?: {
    required?: boolean;
    enum?: string[];
  };
  agent?: {
    required?: boolean;
    maxLength?: number;
  };
  status?: {
    required?: boolean;
    enum?: string[];
  };
  name?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
  phone: {
    required: true;
    pattern?: string;
  };
  email_id: {
    required: true;
    format: 'email';
  };
  location: {
    required: true;
    minLength?: number;
    maxLength?: number;
  };
  message?: {
    required?: boolean;
    maxLength?: number;
  };
  budget?: {
    required?: boolean;
    pattern?: string;
  };
  pin_no?: {
    required?: boolean;
    pattern?: string;
  };
  address?: {
    required?: boolean;
    maxLength?: number;
  };
  bedrooms?: {
    required?: false;
    enum?: string[];
  };
}

// Enums for validation
export const LEAD_WHO_OPTIONS = ['buyer', 'seller', 'investor', 'tenant', 'landlord', 'website'] as const;
export const LEAD_INTENT_OPTIONS = ['buy', 'sell', 'rent', 'lease', 'invest', 'brochure_download'] as const;
export const LEAD_PROPERTY_TYPES = ['apartment', 'villa', 'plot', 'commercial', 'office', 'warehouse'] as const;
export const LEAD_STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'converted', 'closed', 'lost'] as const;
export const LEAD_BEDROOM_OPTIONS = ['1BHK', '2BHK', '3BHK', '4BHK'] as const;

export type LeadWho = typeof LEAD_WHO_OPTIONS[number];
export type LeadIntent = typeof LEAD_INTENT_OPTIONS[number];
export type LeadPropertyType = typeof LEAD_PROPERTY_TYPES[number];
export type LeadStatus = typeof LEAD_STATUS_OPTIONS[number];
export type LeadBedrooms = typeof LEAD_BEDROOM_OPTIONS[number];
