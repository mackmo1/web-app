import { CreateLeadRequest, UpdateLeadRequest, LEAD_WHO_OPTIONS, LEAD_INTENT_OPTIONS, LEAD_PROPERTY_TYPES, LEAD_STATUS_OPTIONS, LEAD_BEDROOM_OPTIONS } from '../types/lead';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validation constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s\-\(\)]{10,15}$/;
const PIN_CODE_REGEX = /^\d{6}$/;
const BUDGET_REGEX = /^[\d,]+(\s*-\s*[\d,]+)?[KLCr]*$/i;
const NAME_MAX_LENGTH = 100;
const LOCATION_MAX_LENGTH = 200;
const ADDRESS_MAX_LENGTH = 500;
const MESSAGE_MAX_LENGTH = 1000;
const AGENT_MAX_LENGTH = 100;

// Validate email format
export function validateEmail(email: string): ValidationError | null {
  if (!email) {
    return {
      field: 'email_id',
      message: 'Email is required'
    };
  }

  if (!EMAIL_REGEX.test(email)) {
    return {
      field: 'email_id',
      message: 'Invalid email format'
    };
  }

  if (email.length > 255) {
    return {
      field: 'email_id',
      message: 'Email must be less than 255 characters'
    };
  }

  return null;
}

// Validate phone number
export function validatePhone(phone: string): ValidationError | null {
  if (!phone) {
    return {
      field: 'phone',
      message: 'Phone number is required'
    };
  }

  if (!PHONE_REGEX.test(phone)) {
    return {
      field: 'phone',
      message: 'Invalid phone number format. Must be 10-15 digits with optional country code'
    };
  }

  return null;
}

// Validate who field
export function validateWho(who: string): ValidationError | null {
  if (!who) {
    return {
      field: 'who',
      message: 'Who field is required'
    };
  }

  if (!LEAD_WHO_OPTIONS.includes(who.toLowerCase() as typeof LEAD_WHO_OPTIONS[number])) {
    return {
      field: 'who',
      message: `Invalid who value. Must be one of: ${LEAD_WHO_OPTIONS.join(', ')}`
    };
  }

  return null;
}

// Validate intent field
export function validateIntent(intent: string): ValidationError | null {
  if (!intent) {
    return {
      field: 'intent',
      message: 'Intent is required'
    };
  }

  if (!LEAD_INTENT_OPTIONS.includes(intent.toLowerCase() as typeof LEAD_INTENT_OPTIONS[number])) {
    return {
      field: 'intent',
      message: `Invalid intent. Must be one of: ${LEAD_INTENT_OPTIONS.join(', ')}`
    };
  }

  return null;
}

// Validate property type
export function validatePropertyType(propertyType: string): ValidationError | null {
  if (!propertyType) return null; // Optional field

  if (!LEAD_PROPERTY_TYPES.includes(propertyType.toLowerCase() as typeof LEAD_PROPERTY_TYPES[number])) {
    return {
      field: 'property_type',
      message: `Invalid property type. Must be one of: ${LEAD_PROPERTY_TYPES.join(', ')}`
    };
  }

  return null;
}


// Validate bedrooms
export function validateBedrooms(bedrooms: string): ValidationError | null {
  if (!bedrooms) return null; // Optional field

  if (!LEAD_BEDROOM_OPTIONS.includes(bedrooms as typeof LEAD_BEDROOM_OPTIONS[number])) {
    return {
      field: 'bedrooms',
      message: `Invalid bedrooms value. Must be one of: ${LEAD_BEDROOM_OPTIONS.join(', ')}`
    };
  }

  return null;
}

// Validate status
export function validateStatus(status: string): ValidationError | null {
  if (!status) return null; // Optional field

  if (!LEAD_STATUS_OPTIONS.includes(status.toLowerCase() as typeof LEAD_STATUS_OPTIONS[number])) {
    return {
      field: 'status',
      message: `Invalid status. Must be one of: ${LEAD_STATUS_OPTIONS.join(', ')}`
    };
  }

  return null;
}

// Validate name
export function validateName(name: string): ValidationError | null {
  if (!name) return null; // Optional field

  if (name.trim().length === 0) {
    return {
      field: 'name',
      message: 'Name cannot be empty'
    };
  }

  if (name.length > NAME_MAX_LENGTH) {
    return {
      field: 'name',
      message: `Name must be less than ${NAME_MAX_LENGTH} characters`
    };
  }

  return null;
}

// Validate location
export function validateLocation(location: string): ValidationError | null {
  if (!location) {
    return {
      field: 'location',
      message: 'Location is required'
    };
  }

  if (location.trim().length === 0) {
    return {
      field: 'location',
      message: 'Location cannot be empty'
    };
  }

  if (location.length > LOCATION_MAX_LENGTH) {
    return {
      field: 'location',
      message: `Location must be less than ${LOCATION_MAX_LENGTH} characters`
    };
  }

  return null;
}

// Validate budget
export function validateBudget(budget: string): ValidationError | null {
  if (!budget) return null; // Optional field

  if (!BUDGET_REGEX.test(budget.trim())) {
    return {
      field: 'budget',
      message: 'Invalid budget format. Use numeric values with optional K/L/Cr suffixes or ranges (e.g., "50000", "10L", "50L-1Cr")'
    };
  }

  return null;
}

// Validate PIN code
export function validatePinCode(pinCode: string): ValidationError | null {
  if (!pinCode) return null; // Optional field

  if (!PIN_CODE_REGEX.test(pinCode)) {
    return {
      field: 'pin_no',
      message: 'PIN code must be exactly 6 digits'
    };
  }

  return null;
}

// Validate address
export function validateAddress(address: string): ValidationError | null {
  if (!address) return null; // Optional field

  if (address.trim().length === 0) {
    return {
      field: 'address',
      message: 'Address cannot be empty'
    };
  }

  if (address.length > ADDRESS_MAX_LENGTH) {
    return {
      field: 'address',
      message: `Address must be less than ${ADDRESS_MAX_LENGTH} characters`
    };
  }

  return null;
}

// Validate message
export function validateMessage(message: string): ValidationError | null {
  if (!message) return null; // Optional field

  if (message.length > MESSAGE_MAX_LENGTH) {
    return {
      field: 'message',
      message: `Message must be less than ${MESSAGE_MAX_LENGTH} characters`
    };
  }

  return null;
}

// Validate agent
export function validateAgent(agent: string): ValidationError | null {
  if (!agent) return null; // Optional field

  if (agent.trim().length === 0) {
    return {
      field: 'agent',
      message: 'Agent name cannot be empty'
    };
  }

  if (agent.length > AGENT_MAX_LENGTH) {
    return {
      field: 'agent',
      message: `Agent name must be less than ${AGENT_MAX_LENGTH} characters`
    };
  }

  return null;
}

// Validate create lead request
export function validateCreateLeadRequest(data: CreateLeadRequest): ValidationResult {
  const errors: ValidationError[] = [];

  // Required field validation
  const whoError = validateWho(data.who);
  if (whoError) errors.push(whoError);

  const intentError = validateIntent(data.intent);
  if (intentError) errors.push(intentError);

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.push(phoneError);

  const emailError = validateEmail(data.email_id);
  if (emailError) errors.push(emailError);

  const locationError = validateLocation(data.location);
  if (locationError) errors.push(locationError);

  // Optional field validation
  if (data.property_type) {
    const propertyTypeError = validatePropertyType(data.property_type);
    if (propertyTypeError) errors.push(propertyTypeError);
  }

  if (data.bedrooms) {
    const bedroomsError = validateBedrooms(data.bedrooms);
    if (bedroomsError) errors.push(bedroomsError);
  }

  if (data.status) {
    const statusError = validateStatus(data.status);
    if (statusError) errors.push(statusError);
  }

  if (data.name) {
    const nameError = validateName(data.name);
    if (nameError) errors.push(nameError);
  }

  if (data.budget) {
    const budgetError = validateBudget(data.budget);
    if (budgetError) errors.push(budgetError);
  }

  if (data.pin_no) {
    const pinCodeError = validatePinCode(data.pin_no);
    if (pinCodeError) errors.push(pinCodeError);
  }

  if (data.address) {
    const addressError = validateAddress(data.address);
    if (addressError) errors.push(addressError);
  }

  if (data.message) {
    const messageError = validateMessage(data.message);
    if (messageError) errors.push(messageError);
  }

  if (data.agent) {
    const agentError = validateAgent(data.agent);
    if (agentError) errors.push(agentError);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validate update lead request
export function validateUpdateLeadRequest(data: UpdateLeadRequest): ValidationResult {
  const errors: ValidationError[] = [];

  // Optional field validation (all fields are optional in update)
  if (data.who !== undefined) {
    const whoError = validateWho(data.who);
    if (whoError) errors.push(whoError);
  }

  if (data.intent !== undefined) {
    const intentError = validateIntent(data.intent);
    if (intentError) errors.push(intentError);
  }

  if (data.phone !== undefined) {
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.push(phoneError);
  }

  if (data.email_id !== undefined) {
    const emailError = validateEmail(data.email_id);
    if (emailError) errors.push(emailError);
  }

  if (data.location !== undefined) {
    const locationError = validateLocation(data.location);
    if (locationError) errors.push(locationError);
  }

  if (data.property_type !== undefined && data.property_type !== null) {
    const propertyTypeError = validatePropertyType(data.property_type);
    if (propertyTypeError) errors.push(propertyTypeError);
  }

  if (data.bedrooms !== undefined && data.bedrooms !== null) {
    const bedroomsError = validateBedrooms(data.bedrooms);
    if (bedroomsError) errors.push(bedroomsError);
  }

  if (data.status !== undefined && data.status !== null) {
    const statusError = validateStatus(data.status);
    if (statusError) errors.push(statusError);
  }

  if (data.name !== undefined && data.name !== null) {
    const nameError = validateName(data.name);
    if (nameError) errors.push(nameError);
  }

  if (data.budget !== undefined && data.budget !== null) {
    const budgetError = validateBudget(data.budget);
    if (budgetError) errors.push(budgetError);
  }

  if (data.pin_no !== undefined && data.pin_no !== null) {
    const pinCodeError = validatePinCode(data.pin_no);
    if (pinCodeError) errors.push(pinCodeError);
  }

  if (data.address !== undefined && data.address !== null) {
    const addressError = validateAddress(data.address);
    if (addressError) errors.push(addressError);
  }

  if (data.message !== undefined && data.message !== null) {
    const messageError = validateMessage(data.message);
    if (messageError) errors.push(messageError);
  }

  if (data.agent !== undefined && data.agent !== null) {
    const agentError = validateAgent(data.agent);
    if (agentError) errors.push(agentError);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
