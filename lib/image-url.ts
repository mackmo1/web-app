export type ImageTransformOptions = {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png' | 'avif'
}

const FALLBACK_IMAGE = '/hero_image_1.jpg'

/**
 * Build a public Supabase Storage URL for an object path with optional transformations.
 * Expects relative object path like `${propertyId}/${uuid}.jpg`.
 * Returns a fully-qualified URL or a fallback if misconfigured.
 */
export function getPublicImageUrl(
  path?: string | null,
  transform?: ImageTransformOptions
): string {
  if (!path) return FALLBACK_IMAGE

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'property-images'
  if (!base) return FALLBACK_IMAGE

  try {
    const u = new URL(base)
    // Normalize leading slashes
    const normalizedPath = path.replace(/^\/+/, '')
    u.pathname = `/storage/v1/object/public/${bucket}/${normalizedPath}`

    if (transform) {
      const { width, height, quality, format } = transform
      if (width != null) u.searchParams.set('width', String(width))
      if (height != null) u.searchParams.set('height', String(height))
      if (quality != null) u.searchParams.set('quality', String(quality))
      if (format) u.searchParams.set('format', format)
    }

    return u.toString()
  } catch {
    return FALLBACK_IMAGE
  }
}

