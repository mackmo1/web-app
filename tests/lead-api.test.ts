/**
 * Lead API Test Utilities
 * 
 * This file contains test utilities and examples for manually testing
 * the Lead CRUD API endpoints. These are not automated tests but rather
 * utilities to help with development and debugging.
 */

import { CreateLeadRequest, UpdateLeadRequest, LeadQueryParams } from '../lib/types/lead';

// Test data for creating leads
export const testLeadData: CreateLeadRequest[] = [
  {
    who: 'buyer',
    intent: 'buy',
    property_type: 'apartment',
    name: 'Alice Johnson',
    phone: '+91-9876543210',
    email_id: 'alice.johnson@example.com',
    location: 'Mumbai',
    budget: '50L-1Cr',
    message: 'Looking for a 2BHK apartment in Bandra or Andheri',
    pin_no: '400050',
    address: 'Bandra West, Mumbai'
  },
  {
    who: 'seller',
    intent: 'sell',
    property_type: 'villa',
    name: 'Bob Smith',
    phone: '+91-9876543211',
    email_id: 'bob.smith@example.com',
    location: 'Pune',
    budget: '2Cr-3Cr',
    message: 'Selling a 4BHK villa in Koregaon Park',
    pin_no: '411001',
    address: 'Koregaon Park, Pune'
  },
  {
    who: 'tenant',
    intent: 'rent',
    property_type: 'apartment',
    name: 'Carol Davis',
    phone: '+91-9876543212',
    email_id: 'carol.davis@example.com',
    location: 'Bangalore',
    budget: '25K-40K',
    message: 'Looking for a furnished 1BHK apartment near IT corridor',
    pin_no: '560001',
    address: 'Whitefield, Bangalore'
  },
  {
    who: 'investor',
    intent: 'invest',
    property_type: 'commercial',
    name: 'David Wilson',
    phone: '+91-9876543213',
    email_id: 'david.wilson@example.com',
    location: 'Delhi',
    budget: '5Cr+',
    message: 'Looking for commercial properties for investment',
    pin_no: '110001',
    address: 'Connaught Place, Delhi'
  },
  {
    who: 'landlord',
    intent: 'lease',
    property_type: 'office',
    name: 'Eva Brown',
    phone: '+91-9876543214',
    email_id: 'eva.brown@example.com',
    location: 'Chennai',
    budget: '1L-2L',
    message: 'Office space available for lease in IT park',
    pin_no: '600001',
    address: 'OMR, Chennai'
  },
  {
    who: 'website',
    intent: 'brochure_download',
    name: 'Website Brochure User',
    phone: '+91-9876543215',
    email_id: 'brochure.user@example.com',
    location: 'Brochure City',
    message: 'Brochure downloaded for test project'
  }
];

// Test query parameters for filtering
export const testQueryParams: LeadQueryParams[] = [
  { page: 1, limit: 10 },
  { who: 'buyer', intent: 'buy' },
  { property_type: 'apartment', status: 'new' },
  { location: 'mumbai', budget_min: '50000' },
  { search: 'apartment', page: 1, limit: 5 },
  { created_from: '2024-01-01', created_to: '2024-12-31' },
  { agent: 'john', status: 'contacted' },
  { intent: 'brochure_download', page: 1, limit: 5 }
];

// Test update data
export const testUpdateData: UpdateLeadRequest[] = [
  { status: 'contacted', agent: 'John Doe' },
  { status: 'qualified', message: 'Budget confirmed, looking for properties' },
  { status: 'converted', agent: 'Jane Smith' },
  { budget: '75L-1.5Cr', message: 'Budget increased after discussion' },
  { property_type: 'villa', location: 'Gurgaon' }
];

/**
 * Manual test functions for API endpoints
 */

/**
 * Test creating multiple leads
 */
export async function testCreateLeads() {
  console.log('🧪 Testing Lead Creation...');
  
  for (let i = 0; i < testLeadData.length; i++) {
    const leadData = testLeadData[i];
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Lead ${i + 1} created:`, result.data.id);
      } else {
        console.log(`❌ Lead ${i + 1} failed:`, result.error);
      }
    } catch (error) {
      console.log(`❌ Lead ${i + 1} error:`, error);
    }
  }
}

/**
 * Test fetching leads with different filters
 */
export async function testFetchLeads() {
  console.log('🧪 Testing Lead Fetching...');
  
  for (let i = 0; i < testQueryParams.length; i++) {
    const params = testQueryParams[i];
    const queryString = new URLSearchParams(params as any).toString();
    
    try {
      const response = await fetch(`/api/leads?${queryString}`);
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Query ${i + 1} (${queryString}):`, result.data.total, 'leads found');
      } else {
        console.log(`❌ Query ${i + 1} failed:`, result.error);
      }
    } catch (error) {
      console.log(`❌ Query ${i + 1} error:`, error);
    }
  }
}

/**
 * Test fetching a single lead
 */
export async function testFetchSingleLead(leadId: string) {
  console.log('🧪 Testing Single Lead Fetch...');
  
  try {
    const response = await fetch(`/api/leads/${leadId}`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Lead fetched:', result.data);
    } else {
      console.log('❌ Fetch failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Fetch error:', error);
  }
}

/**
 * Test updating leads
 */
export async function testUpdateLeads(leadIds: string[]) {
  console.log('🧪 Testing Lead Updates...');
  
  for (let i = 0; i < Math.min(leadIds.length, testUpdateData.length); i++) {
    const leadId = leadIds[i];
    const updateData = testUpdateData[i];
    
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Lead ${leadId} updated`);
      } else {
        console.log(`❌ Lead ${leadId} update failed:`, result.error);
      }
    } catch (error) {
      console.log(`❌ Lead ${leadId} update error:`, error);
    }
  }
}

/**
 * Test deleting a lead
 */
export async function testDeleteLead(leadId: string) {
  console.log('🧪 Testing Lead Deletion...');
  
  try {
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Lead deleted successfully');
    } else {
      console.log('❌ Delete failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Delete error:', error);
  }
}

/**
 * Test validation errors
 */
export async function testValidationErrors() {
  console.log('🧪 Testing Validation Errors...');
  
  const invalidData = [
    { who: 'invalid', intent: 'buy', phone: '123', email_id: 'invalid', location: '' },
    { who: 'buyer', intent: 'invalid', phone: '', email_id: '', location: 'Mumbai' },
    { who: '', intent: '', phone: '+91-9876543210', email_id: 'test@example.com', location: '' }
  ];
  
  for (let i = 0; i < invalidData.length; i++) {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData[i])
      });
      
      const result = await response.json();
      
      if (!result.success) {
        console.log(`✅ Validation error ${i + 1} caught:`, result.error);
      } else {
        console.log(`❌ Validation error ${i + 1} not caught`);
      }
    } catch (error) {
      console.log(`❌ Validation test ${i + 1} error:`, error);
    }
  }
}

/**
 * Test duplicate behavior (duplicates are allowed by design)
 */
export async function testDuplicateDetection() {
  console.log('🧪 Testing Duplicate Behavior (duplicates should be allowed)...');

  const duplicateData = {
    who: 'buyer',
    intent: 'buy',
    name: 'Duplicate Test',
    phone: '+91-9999999999',
    email_id: 'duplicate@example.com',
    location: 'Test City'
  };

  try {
    // Create first lead
    const response1 = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicateData)
    });

    const result1 = await response1.json();

    if (result1.success) {
      console.log('✅ First lead created');

      // Try to create duplicate
      const response2 = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData)
      });

      const result2 = await response2.json();

      if (result2.success) {
        console.log('✅ Duplicate lead created as expected (duplicate prevention disabled)');
      } else {
        console.log('❌ Duplicate lead creation failed unexpectedly:', result2.error);
      }

      // Clean up - delete the first test lead
      await testDeleteLead(result1.data.id);
    } else {
      console.log('❌ Failed to create first lead:', result1.error);
    }
  } catch (error) {
    console.log('❌ Duplicate behavior test error:', error);
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('🚀 Starting Lead API Tests...\n');
  
  await testValidationErrors();
  console.log('\n');
  
  await testDuplicateDetection();
  console.log('\n');
  
  await testCreateLeads();
  console.log('\n');
  
  await testFetchLeads();
  console.log('\n');
  
  // Get some lead IDs for update/delete tests
  const response = await fetch('/api/leads?limit=3');
  const result = await response.json();
  
  if (result.success && result.data.leads.length > 0) {
    const leadIds = result.data.leads.map((lead: any) => lead.id);
    
    await testFetchSingleLead(leadIds[0]);
    console.log('\n');
    
    await testUpdateLeads(leadIds);
    console.log('\n');
    
    // Only delete the last lead to avoid affecting other tests
    if (leadIds.length > 2) {
      await testDeleteLead(leadIds[leadIds.length - 1]);
    }
  }
  
  console.log('🏁 All tests completed!');
}

// Export test utilities
export default {
  testCreateLeads,
  testFetchLeads,
  testFetchSingleLead,
  testUpdateLeads,
  testDeleteLead,
  testValidationErrors,
  testDuplicateDetection,
  runAllTests
};
