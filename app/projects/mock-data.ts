// Shared mock data for Projects pages. Replace with Supabase fetch later.

export interface PricingItem {
  bhk: '1BHK' | '2BHK' | '3BHK' | '4BHK' | string;
  areaSqFt: number;
  priceMin: string;
  priceMax?: string;
}

export interface Project {
  slug: string;
  name: string;
  address: string;
  nearby: string[];
  overview: {
    area: string;
    floors: number;
    towers: number;
    units: number;
  };
  pricing: PricingItem[];
  usps: string[];
  googleMapsUrl?: string;
  brochureUrl?: string;
  heroImageUrl?: string;
}

const PROJECTS: Record<string, Project> = {
  'sunrise-residency': {
    slug: 'sunrise-residency',
    name: 'Sunrise Residency',
    address: 'Sector 62, Gurugram, Haryana',
    nearby: ['NH-48', 'Cyber City', 'Huda City Centre Metro', 'DLF Phase 3'],
    overview: { area: '8 Acres', floors: 24, towers: 6, units: 720 },
    pricing: [
      { bhk: '1BHK', areaSqFt: 650, priceMin: '₹45L', priceMax: '₹55L' },
      { bhk: '2BHK', areaSqFt: 980, priceMin: '₹70L', priceMax: '₹90L' },
      { bhk: '3BHK', areaSqFt: 1450, priceMin: '₹1.1Cr', priceMax: '₹1.35Cr' },
      { bhk: '4BHK', areaSqFt: 1950, priceMin: '₹1.6Cr', priceMax: '₹1.9Cr' },
    ],
    usps: [
      'Clubhouse with gym & indoor games',
      'Infinity-edge swimming pool',
      'Gated community with 3-tier security',
      'Dedicated kids play area & jogging track',
      'Power backup & ample parking',
    ],
    googleMapsUrl:
      'https://www.google.com/maps?q=Sector+62+Gurugram+Haryana&output=embed',
    brochureUrl: '#',
    heroImageUrl:
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c9fb?q=80&w=2000&auto=format&fit=crop',
  },
};

export function getProjectBySlug(slug: string) {
  return PROJECTS[slug] ?? null;
}

export function getAllProjects(): Project[] {
  return Object.values(PROJECTS);
}

