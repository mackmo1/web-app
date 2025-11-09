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
  meta?: Record<string, unknown>;
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

async function strapiFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const base = (process.env.STRAPI_URL || '').replace(/\/$/, '');
  if (!base) throw new Error('STRAPI_URL is not set');

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (process.env.STRAPI_TOKEN) headers['Authorization'] = `Bearer ${process.env.STRAPI_TOKEN}`;

  const url = `${base}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.STRAPI_TIMEOUT_MS || 60000));
  const res = await fetch(url, {
    headers,
    next: { revalidate: 3600 },
    ...(init || {}),
    signal: controller.signal,
  });
  clearTimeout(timeout);
  if (!res.ok) {
    const text = await res.text();
    console.error('[Strapi] request failed', {
      method: init?.method || 'GET',
      url,
      status: res.status,
      statusText: res.statusText,
      tokenPresent: Boolean(process.env.STRAPI_TOKEN),
    });
    throw new Error(`Strapi request failed: ${res.status} ${res.statusText} - ${text}`);
  }
  const data = await res.json();
  if (process.env.NODE_ENV !== 'production' || /^(1|true|yes|debug)$/i.test(String(process.env.STRAPI_LOG || process.env.STRAPI_DEBUG || ''))) {
    try {
      console.log('[Strapi]', (init?.method || 'GET'), url, '->', res.status);
    } catch {}
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
  qs.append('populate[hero_image][fields][0]', 'url');
  qs.append('populate[property_images][fields][0]', 'url');
  qs.append('populate[brochure][fields][0]', 'url');

  const basePath = getCollectionPath();

  // Define the expected entity structure
  interface StrapiMediaFile {
    url?: string;
    formats?: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  }

  interface SalePropertyEntity {
    hero_image?: StrapiMediaFile | StrapiMediaFile[];
    property_images?: StrapiMediaFile | StrapiMediaFile[];
    brochure?: StrapiMediaFile | StrapiMediaFile[];
  }

  const resp = await strapiFetch<StrapiResponse<SalePropertyEntity[]>>(`${basePath}?${qs.toString()}`);
  const entity = resp.data?.[0];
  if (!entity) {
    return { heroUrl: null, imageUrls: [], brochureUrl: null };
  }

  // Strapi v5 returns media directly, not wrapped in .data
  const heroData = entity?.hero_image;
  const heroItem = Array.isArray(heroData) ? heroData[0] : heroData;

  const galleryData = entity?.property_images;
  const galleryArr: StrapiMediaFile[] = Array.isArray(galleryData)
    ? galleryData
    : galleryData
    ? [galleryData]
    : [];

  const brochureData = entity?.brochure;
  const brochureItem = Array.isArray(brochureData) ? brochureData[0] : brochureData;

  const pickBestUrl = (file: StrapiMediaFile | undefined): string | null => {
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

  if (process.env.NODE_ENV !== 'production' || /^(1|true|yes|debug)$/i.test(String(process.env.STRAPI_LOG || process.env.STRAPI_DEBUG || ''))) {
    console.log('[Strapi Media URLs]', { heroUrl, imageUrls, brochureUrl });
  }

  return { heroUrl, imageUrls, brochureUrl };
}



// Bulk fetch: map external_id -> hero image URL (or null)
export async function getSalePropertyHeroMapByExternalIds(externalIds: string[]): Promise<Record<string, string | null>> {
  const result: Record<string, string | null> = {};
  const ids = Array.from(new Set(externalIds.filter(Boolean)));
  if (ids.length === 0) return result;

  const qs = new URLSearchParams();
  for (const id of ids) qs.append('filters[external_id][$in]', id);
  qs.append('populate[hero_image][fields][0]', 'url');
  qs.append('pagination[pageSize]', '100');

  const basePath = getCollectionPath();

  interface StrapiMediaFile { url?: string; formats?: Record<string, { url: string }>; }
  interface Entity { external_id?: string; hero_image?: StrapiMediaFile | StrapiMediaFile[] }

  try {
    const resp = await strapiFetch<StrapiResponse<Entity[]>>(`${basePath}?${qs.toString()}`);
    const items = Array.isArray(resp.data) ? resp.data : [];

    const pick = (file?: StrapiMediaFile): string | null => {
      if (!file) return null;
      const candidate = file.url || file.formats?.large?.url || file.formats?.medium?.url || file.formats?.small?.url || file.formats?.thumbnail?.url;
      return candidate ? absoluteUrl(candidate) : null;
    };

    for (const item of items) {
      const key = item.external_id || '';
      if (!key) continue;
      const hero = Array.isArray(item.hero_image) ? item.hero_image[0] : item.hero_image;
      result[key] = pick(hero);
    }
  } catch (e) {
    console.error('[Strapi] bulk hero fetch failed', {
      count: ids.length,
      error: e instanceof Error ? e.message : String(e),
    });
  }

  return result;
}
