// Project types based on Prisma `projects` model
export interface Project {
  id: bigint;
  created_at: Date;
  name: string | null;
  address: string | null;
  city: string | null;
  google_location: string | null;
  overview_area: string | null;
  near_by: string | null; // stored as comma-separated list
  overview_floors: string | null;
  overview_rem1: string | null;
  overview_rem2: string | null;
  rooms: string | null;
  area_sqft: string | null;
  price_range: string | null;
  usp: string | null; // stored as comma-separated list
  external_id: string | null;
}

// Create/Update request payloads (accept either string or string[] for list-like fields)
export interface CreateProjectRequest {
  name?: string;
  address?: string;
  city?: string;
  google_location?: string;
  overview_area?: string;
  near_by?: string | string[];
  overview_floors?: string;
  overview_rem1?: string;
  overview_rem2?: string;
  rooms?: string;
  area_sqft?: string;
  price_range?: string;
  usp?: string | string[];
  external_id?: string;
}

export interface UpdateProjectRequest {
  name?: string | null;
  address?: string | null;
  city?: string | null;
  google_location?: string | null;
  overview_area?: string | null;
  near_by?: string | string[] | null;
  overview_floors?: string | null;
  overview_rem1?: string | null;
  overview_rem2?: string | null;
  rooms?: string | null;
  area_sqft?: string | null;
  price_range?: string | null;
  usp?: string | string[] | null;
  external_id?: string | null;
}

// Response types (normalize arrays)
export interface ProjectResponse {
  id: string; // bigint -> string
  created_at: string; // ISO
  name: string | null;
  address: string | null;
  city: string | null;
  google_location: string | null;
  overview_area: string | null;
  near_by: string[]; // normalized
  overview_floors: string | null;
  overview_rem1: string | null;
  overview_rem2: string | null;
  rooms: string | null;
  area_sqft: string | null;
  price_range: string | null;
  usp: string[]; // normalized
  external_id: string | null;
}

export interface ProjectsListResponse {
  projects: ProjectResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProjectApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Query parameters for filtering
export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  city?: string;
  name?: string; // contains search
  q?: string; // generic search over name/address/city
}

