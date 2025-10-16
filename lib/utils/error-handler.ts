import { NextResponse } from 'next/server';
import { ApiResponse } from '../types/user';
import { ValidationError } from '../validation/user';

// Error types
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST'
}

// Custom error class
export class ApiError extends Error {
  public type: ErrorType;
  public statusCode: number;
  public details?: Record<string, unknown>;

  constructor(type: ErrorType, message: string, statusCode: number, details?: Record<string, unknown>) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

// Error response builders
export function createValidationErrorResponse(errors: ValidationError[]) {
  return NextResponse.json<ApiResponse<null>>({
    success: false,
    error: 'Validation failed',
    message: errors.map(err => `${err.field}: ${err.message}`).join(', ')
  }, { status: 400 });
}

export function createNotFoundResponse(resource: string = 'Resource') {
  return NextResponse.json<ApiResponse<null>>({
    success: false,
    error: `${resource} not found`
  }, { status: 404 });
}

export function createDuplicateEntryResponse(message: string = 'Resource already exists') {
  return NextResponse.json<ApiResponse<null>>({
    success: false,
    error: message
  }, { status: 409 });
}

export function createBadRequestResponse(message: string) {
  return NextResponse.json<ApiResponse<null>>({
    success: false,
    error: message
  }, { status: 400 });
}

export function createUnauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json<ApiResponse<null>>({
    success: false,
    error: message
  }, { status: 401 });
}

export function createForbiddenResponse(message: string = 'Forbidden') {
  return NextResponse.json<ApiResponse<null>>({
    success: false,
    error: message
  }, { status: 403 });
}

export function createInternalErrorResponse(message: string = 'Internal server error') {
  return NextResponse.json<ApiResponse<null>>({
    success: false,
    error: message
  }, { status: 500 });
}

// Generic error handler
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: error.message,
      ...(error.details && { details: error.details })
    }, { status: error.statusCode });
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code?: string; message?: string };

    switch (prismaError.code) {
      case 'P2002':
        return createDuplicateEntryResponse('A record with this information already exists');
      case 'P2025':
        return createNotFoundResponse('Record');
      case 'P2003':
        return createBadRequestResponse('Foreign key constraint failed');
      case 'P2014':
        return createBadRequestResponse('Invalid ID provided');
      default:
        console.error('Unhandled Prisma error:', prismaError);
        return createInternalErrorResponse();
    }
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.message.includes('JSON')) {
    return createBadRequestResponse('Invalid JSON in request body');
  }

  // Default error response
  return createInternalErrorResponse();
}

// Async error wrapper for API routes
export function withErrorHandling<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Validation helper
export function validateAndThrow(isValid: boolean, errors: ValidationError[]) {
  if (!isValid) {
    throw new ApiError(
      ErrorType.VALIDATION_ERROR,
      'Validation failed',
      400,
      { validationErrors: errors }
    );
  }
}

// ID validation helper
export function validateUserId(id: string): bigint {
  if (!id || isNaN(Number(id))) {
    throw new ApiError(
      ErrorType.BAD_REQUEST,
      'Invalid user ID format',
      400
    );
  }

  const numericId = Number(id);
  if (numericId <= 0) {
    throw new ApiError(
      ErrorType.BAD_REQUEST,
      'User ID must be a positive number',
      400
    );
  }

  return BigInt(id);
}

// Lead ID validation helper
export function validateLeadId(id: string): bigint {
  if (!id || isNaN(Number(id))) {
    throw new ApiError(
      ErrorType.BAD_REQUEST,
      'Invalid lead ID format',
      400
    );
  }

  const numericId = Number(id);
  if (numericId <= 0) {
    throw new ApiError(
      ErrorType.BAD_REQUEST,
      'Lead ID must be a positive number',
      400
    );
  }

  return BigInt(id);
}

// Project ID validation helper
export function validateProjectId(id: string): bigint {
  if (!id || isNaN(Number(id))) {
    throw new ApiError(
      ErrorType.BAD_REQUEST,
      'Invalid project ID format',
      400
    );
  }
  const numericId = Number(id);
  if (numericId <= 0) {
    throw new ApiError(
      ErrorType.BAD_REQUEST,
      'Project ID must be a positive number',
      400
    );
  }
  return BigInt(id);
}


// Pagination validation helper
export function validatePagination(page: number, limit: number) {
  if (page < 1) {
    throw new ApiError(
      ErrorType.BAD_REQUEST,
      'Page number must be greater than 0',
      400
    );
  }

  if (limit < 1 || limit > 100) {
    throw new ApiError(
      ErrorType.BAD_REQUEST,
      'Limit must be between 1 and 100',
      400
    );
  }
}
