// Minimal Strapi REST client helpers for server-side usage
// Expects STRAPI_URL (e.g., http://localhost:1337) and optional STRAPI_TOKEN (read-only API token)

export type StrapiMedia = {
  id: number;
  attributes: {
    url: string; // may be relative
    alternativeText?: string | null;
    caption?: string | null;
    name?: string;
    mime?: string;
    size?: number;
    width?: number;
    height?: number;
    formats?: Record<string, { url: string; width: number; height: number }>;
  };
};

export type StrapiEntity<T> = {
  id: number;
  attributes: T;
};

export type StrapiResponse<T> = {
  data: T;
  meta?: any;
};

function absoluteUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // Use Next.js API proxy route to serve Strapi media files
  // This allows the browser to access private uploads with server-side authentication
  // Example: /uploads/image.jpg -> /api/strapi-media/uploads/image.jpg
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  return `/api/strapi-media/${cleanPath}`;
}

// Derive the REST collection path from the Strapi collection type API ID (e.g., 'sale-property' => '/api/sale-properties').
// If you customized the route in Strapi, set STRAPI_SALE_PROPERTY_ID accordingly or adjust getCollectionPath().

function getCollectionPath(): string {
  // Hardcoded path for SaleProperty (API id: 'sale-property')
  return '/api/sale-properties';
}

async function strapiFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  const base = (process.env.STRAPI_URL || '').replace(/\/$/, '');
  if (!base) throw new Error('STRAPI_URL is not set');

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (process.env.STRAPI_TOKEN) headers['Authorization'] = `Bearer ${process.env.STRAPI_TOKEN}`;

  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers,
    cache: 'no-store',
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strapi request failed: ${res.status} ${res.statusText} - ${text}`);
  }
  const data = await res.json();
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('[Strapi]', (init?.method || 'GET'), url, '->', res.status);
      console.dir(data, { depth: 4 });
    } catch {
      console.log('[Strapi] response JSON', JSON.stringify(data).slice(0, 2000));
    }
  }
  return data;
}

// Fetch SaleProperty media by external_id and return normalized URLs
export async function getSalePropertyMediaByExternalId(externalId: string): Promise<{
  heroUrl: string | null;
  imageUrls: string[];
  brochureUrl: string | null;
}> {
  // populate media fields; ensure all relations are included
  const qs = new URLSearchParams();
  qs.set('filters[external_id][$eq]', externalId);
  // Strapi v4: populate media relations safely using 'true' to avoid internal keys like 'related'.
  qs.append('populate[hero_image]', 'true');
  qs.append('populate[property_images]', 'true');
  qs.append('populate[brochure]', 'true');

  const basePath = getCollectionPath();
  const resp = await strapiFetch<StrapiResponse<Array<StrapiEntity<any>>>>(`${basePath}?${qs.toString()}`);
  const entity = resp.data?.[0];
  if (!entity) {
    return { heroUrl: null, imageUrls: [], brochureUrl: null };
  }

  // Strapi v5 returns media directly, not wrapped in .data
  const heroData = entity?.hero_image as any;
  const heroItem = Array.isArray(heroData) ? heroData[0] : heroData;

  const galleryData = entity?.property_images as any;
  const galleryArr: any[] = Array.isArray(galleryData)
    ? galleryData
    : galleryData
    ? [galleryData]
    : [];

  const brochureData = entity?.brochure as any;
  const brochureItem = Array.isArray(brochureData) ? brochureData[0] : brochureData;

  const pickBestUrl = (file: any): string | null => {
    if (!file) return null;
    // Strapi v5: media fields are directly on the object, not wrapped in .attributes
    const direct = file.url;
    const byFormat = file.formats?.large?.url || file.formats?.medium?.url || file.formats?.small?.url || file.formats?.thumbnail?.url;
    const candidate = direct || byFormat || null;
    return candidate ? absoluteUrl(candidate) : null;
  };

  const heroUrl = pickBestUrl(heroItem);
  const imageUrls = galleryArr
    .map((m) => pickBestUrl(m))
    .filter((u): u is string => Boolean(u));
  const brochureUrl = pickBestUrl(brochureItem);

  if (process.env.NODE_ENV !== 'production') {
    console.log('[Strapi Media URLs]', { heroUrl, imageUrls, brochureUrl });
  }

  return { heroUrl, imageUrls, brochureUrl };
}

