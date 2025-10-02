import { CreateUserRequest, UpdateUserRequest } from '../types/user';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validation rules
const USER_TYPES = ['buyer', 'agent', 'builder'];
const USER_ROLES = ['user', 'admin', 'moderator'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[+]?[\d\s\-\(\)]{10,15}$/;
const PASSWORD_MIN_LENGTH = 6;
const NAME_MAX_LENGTH = 100;

// Validate email format
export function validateEmail(email: string): ValidationError | null {
  if (!email) return null;
  
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

// Validate mobile number
export function validateMobile(mobile: string): ValidationError | null {
  if (!mobile) return null;
  
  if (!MOBILE_REGEX.test(mobile)) {
    return {
      field: 'mobile',
      message: 'Invalid mobile number format. Must be 10-15 digits with optional country code'
    };
  }
  
  return null;
}

// Validate user type
export function validateUserType(type: string): ValidationError | null {
  if (!type) {
    return {
      field: 'type',
      message: 'User type is required'
    };
  }
  
  if (!USER_TYPES.includes(type.toLowerCase())) {
    return {
      field: 'type',
      message: `Invalid user type. Must be one of: ${USER_TYPES.join(', ')}`
    };
  }
  
  return null;
}

// Validate user role
export function validateUserRole(role: string): ValidationError | null {
  if (!role) return null;
  
  if (!USER_ROLES.includes(role.toLowerCase())) {
    return {
      field: 'role',
      message: `Invalid user role. Must be one of: ${USER_ROLES.join(', ')}`
    };
  }
  
  return null;
}

// Validate name
export function validateName(name: string): ValidationError | null {
  if (!name) return null;
  
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

// Validate password
export function validatePassword(password: string): ValidationError | null {
  if (!password) return null;
  
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      field: 'password',
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`
    };
  }
  
  return null;
}

// Validate city
export function validateCity(city: string): ValidationError | null {
  if (!city) return null;
  
  if (city.trim().length === 0) {
    return {
      field: 'city',
      message: 'City cannot be empty'
    };
  }
  
  if (city.length > 100) {
    return {
      field: 'city',
      message: 'City must be less than 100 characters'
    };
  }
  
  return null;
}

// Validate profession
export function validateProfession(profession: string): ValidationError | null {
  if (!profession) return null;
  
  if (profession.trim().length === 0) {
    return {
      field: 'profession',
      message: 'Profession cannot be empty'
    };
  }
  
  if (profession.length > 100) {
    return {
      field: 'profession',
      message: 'Profession must be less than 100 characters'
    };
  }
  
  return null;
}

// Validate create user request
export function validateCreateUserRequest(data: CreateUserRequest): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Required field validation
  const typeError = validateUserType(data.type);
  if (typeError) errors.push(typeError);
  
  // Optional field validation
  if (data.email_id) {
    const emailError = validateEmail(data.email_id);
    if (emailError) errors.push(emailError);
  }
  
  if (data.mobile) {
    const mobileError = validateMobile(data.mobile);
    if (mobileError) errors.push(mobileError);
  }
  
  if (data.name) {
    const nameError = validateName(data.name);
    if (nameError) errors.push(nameError);
  }
  
  if (data.password) {
    const passwordError = validatePassword(data.password);
    if (passwordError) errors.push(passwordError);
  }
  
  if (data.city) {
    const cityError = validateCity(data.city);
    if (cityError) errors.push(cityError);
  }
  
  if (data.profession) {
    const professionError = validateProfession(data.profession);
    if (professionError) errors.push(professionError);
  }
  
  if (data.role) {
    const roleError = validateUserRole(data.role);
    if (roleError) errors.push(roleError);
  }
  
  // Business logic validation
  if (!data.email_id && !data.mobile) {
    errors.push({
      field: 'contact',
      message: 'Either email or mobile number must be provided'
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validate update user request
export function validateUpdateUserRequest(data: UpdateUserRequest): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Optional field validation
  if (data.type !== undefined) {
    const typeError = validateUserType(data.type);
    if (typeError) errors.push(typeError);
  }
  
  if (data.email_id !== undefined && data.email_id !== null) {
    const emailError = validateEmail(data.email_id);
    if (emailError) errors.push(emailError);
  }
  
  if (data.mobile !== undefined && data.mobile !== null) {
    const mobileError = validateMobile(data.mobile);
    if (mobileError) errors.push(mobileError);
  }
  
  if (data.name !== undefined && data.name !== null) {
    const nameError = validateName(data.name);
    if (nameError) errors.push(nameError);
  }
  
  if (data.password !== undefined && data.password !== null) {
    const passwordError = validatePassword(data.password);
    if (passwordError) errors.push(passwordError);
  }
  
  if (data.city !== undefined && data.city !== null) {
    const cityError = validateCity(data.city);
    if (cityError) errors.push(cityError);
  }
  
  if (data.profession !== undefined && data.profession !== null) {
    const professionError = validateProfession(data.profession);
    if (professionError) errors.push(professionError);
  }
  
  if (data.role !== undefined && data.role !== null) {
    const roleError = validateUserRole(data.role);
    if (roleError) errors.push(roleError);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
