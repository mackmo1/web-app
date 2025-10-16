import { CreateProjectRequest, UpdateProjectRequest } from '../types/project';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

const URL_REGEX = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+(?:[\w\-\._~:\/?#[\]@!$&'()*+,;=.]+)?$/i;

export function validateCreateProjectRequest(data: CreateProjectRequest): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Project name is required' });
  }

  if (!data.address || data.address.trim().length === 0) {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  if (data.google_location && !URL_REGEX.test(data.google_location)) {
    errors.push({ field: 'google_location', message: 'Invalid URL format' });
  }

  return { isValid: errors.length === 0, errors };
}

export function validateUpdateProjectRequest(data: UpdateProjectRequest): ValidationResult {
  const errors: ValidationError[] = [];

  if (data.name !== undefined && data.name !== null && data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name cannot be empty' });
  }

  if (data.address !== undefined && data.address !== null && data.address.trim().length === 0) {
    errors.push({ field: 'address', message: 'Address cannot be empty' });
  }

  if (data.google_location !== undefined && data.google_location !== null && !URL_REGEX.test(data.google_location)) {
    errors.push({ field: 'google_location', message: 'Invalid URL format' });
  }

  return { isValid: errors.length === 0, errors };
}

