/**
 * Lead API Client Example
 * 
 * This file demonstrates how to interact with the Lead CRUD API
 * using TypeScript. It includes examples for all CRUD operations
 * with proper error handling and type safety.
 */

import { 
  CreateLeadRequest, 
  UpdateLeadRequest, 
  LeadResponse, 
  LeadsListResponse, 
  LeadApiResponse,
  LeadQueryParams 
} from '../lib/types/lead';

// Base API URL - adjust according to your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Lead API Client Class
 */
export class LeadApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch all leads with optional filtering and pagination
   */
  async getLeads(params?: LeadQueryParams): Promise<LeadsListResponse> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const url = `${this.baseUrl}/api/leads${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    const result: LeadApiResponse<LeadsListResponse> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch leads');
    }
    
    return result.data!;
  }

  /**
   * Fetch a single lead by ID
   */
  async getLead(id: string): Promise<LeadResponse> {
    const response = await fetch(`${this.baseUrl}/api/leads/${id}`);
    const result: LeadApiResponse<LeadResponse> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch lead');
    }
    
    return result.data!;
  }

  /**
   * Create a new lead
   */
  async createLead(leadData: CreateLeadRequest): Promise<LeadResponse> {
    const response = await fetch(`${this.baseUrl}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });
    
    const result: LeadApiResponse<LeadResponse> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create lead');
    }
    
    return result.data!;
  }

  /**
   * Update an existing lead
   */
  async updateLead(id: string, updateData: UpdateLeadRequest): Promise<LeadResponse> {
    const response = await fetch(`${this.baseUrl}/api/leads/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    const result: LeadApiResponse<LeadResponse> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update lead');
    }
    
    return result.data!;
  }

  /**
   * Delete a lead
   */
  async deleteLead(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/leads/${id}`, {
      method: 'DELETE',
    });
    
    const result: LeadApiResponse<null> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete lead');
    }
  }
}

// Example usage functions

/**
 * Example: Create a new lead
 */
export async function createLeadExample() {
  const client = new LeadApiClient();
  
  const newLead: CreateLeadRequest = {
    who: 'buyer',
    intent: 'buy',
    property_type: 'apartment',
    name: 'John Doe',
    phone: '+91-9876543210',
    email_id: 'john.doe@example.com',
    location: 'Mumbai',
    budget: '50L-1Cr',
    message: 'Looking for a 2BHK apartment in Bandra',
    pin_no: '400050',
    address: 'Bandra West, Mumbai'
  };

  try {
    const createdLead = await client.createLead(newLead);
    console.log('Lead created successfully:', createdLead);
    return createdLead;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

/**
 * Example: Fetch leads with filtering
 */
export async function fetchLeadsExample() {
  const client = new LeadApiClient();
  
  const filters: LeadQueryParams = {
    page: 1,
    limit: 10,
    who: 'buyer',
    intent: 'buy',
    status: 'new',
    location: 'mumbai'
  };

  try {
    const leads = await client.getLeads(filters);
    console.log('Leads fetched successfully:', leads);
    return leads;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
}

/**
 * Example: Update a lead status
 */
export async function updateLeadStatusExample(leadId: string) {
  const client = new LeadApiClient();
  
  const updateData: UpdateLeadRequest = {
    status: 'contacted',
    agent: 'Jane Smith',
    message: 'Initial contact made, scheduled property viewing'
  };

  try {
    const updatedLead = await client.updateLead(leadId, updateData);
    console.log('Lead updated successfully:', updatedLead);
    return updatedLead;
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
}

/**
 * Example: Search leads
 */
export async function searchLeadsExample(searchTerm: string) {
  const client = new LeadApiClient();
  
  const searchParams: LeadQueryParams = {
    search: searchTerm,
    page: 1,
    limit: 20
  };

  try {
    const results = await client.getLeads(searchParams);
    console.log('Search results:', results);
    return results;
  } catch (error) {
    console.error('Error searching leads:', error);
    throw error;
  }
}

/**
 * Example: Get leads by date range
 */
export async function getLeadsByDateRangeExample(fromDate: string, toDate: string) {
  const client = new LeadApiClient();
  
  const dateFilters: LeadQueryParams = {
    created_from: fromDate,
    created_to: toDate,
    page: 1,
    limit: 50
  };

  try {
    const leads = await client.getLeads(dateFilters);
    console.log('Leads in date range:', leads);
    return leads;
  } catch (error) {
    console.error('Error fetching leads by date range:', error);
    throw error;
  }
}

/**
 * Example: Complete lead management workflow
 */
export async function leadManagementWorkflowExample() {
  const client = new LeadApiClient();
  
  try {
    // 1. Create a new lead
    console.log('Step 1: Creating a new lead...');
    const newLead = await createLeadExample();
    
    // 2. Fetch the created lead
    console.log('Step 2: Fetching the created lead...');
    const fetchedLead = await client.getLead(newLead.id);
    
    // 3. Update the lead status
    console.log('Step 3: Updating lead status...');
    const updatedLead = await updateLeadStatusExample(newLead.id);
    
    // 4. Search for similar leads
    console.log('Step 4: Searching for similar leads...');
    const similarLeads = await searchLeadsExample(newLead.location);
    
    console.log('Workflow completed successfully!');
    return {
      created: newLead,
      fetched: fetchedLead,
      updated: updatedLead,
      similar: similarLeads
    };
    
  } catch (error) {
    console.error('Workflow failed:', error);
    throw error;
  }
}

// Export the client for use in other modules
export default LeadApiClient;
