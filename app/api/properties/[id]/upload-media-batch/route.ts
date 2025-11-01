import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getPublicImageUrl } from '@/lib/image-url'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'property-images'

const CATEGORY_LABELS = [
  'Inside View',
  'Floor Plan',
  'Outside View',
  'Brochure',
] as const

type Category = typeof CATEGORY_LABELS[number]

function isAllowedCategory(value: unknown): value is Category {
  return typeof value === 'string' && CATEGORY_LABELS.includes(value as Category)
}

function extFromMime(mime: string): string {
  if (mime === 'image/jpeg' || mime === 'image/jpg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/gif') return 'gif'
  if (mime === 'image/avif') return 'avif'
  if (mime === 'application/pdf') return 'pdf'
  return 'bin'
}

function isPdf(mime?: string) {
  return mime === 'application/pdf'
}

function isImage(mime?: string) {
  return !!mime && mime.startsWith('image/')
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id: propertyIdStr } = await ctx.params
    if (!propertyIdStr) {
      return NextResponse.json({ ok: false, error: 'Missing property id' }, { status: 400 })
    }

    let propertyIdBigInt: bigint
    try {
      propertyIdBigInt = BigInt(propertyIdStr)
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid property id' }, { status: 400 })
    }

    // Ensure property exists
    const existing = await prisma.property.findUnique({ where: { id: propertyIdBigInt }, select: { id: true } })
    if (!existing) {
      return NextResponse.json({ ok: false, error: 'Property not found' }, { status: 404 })
    }

    const form = await req.formData()
    const files = form.getAll('files') as File[]
    const categoriesRaw = form.getAll('categories')

    if (!files.length) {
      return NextResponse.json({ ok: false, error: 'No files provided (expect repeated field "files")' }, { status: 400 })
    }

    if (categoriesRaw.length !== files.length) {
      return NextResponse.json({ ok: false, error: 'categories length must match files length' }, { status: 400 })
    }

    // Build tuples and stable-partition so that 'Brochure' items go last, preserving input order
    const items: { file: File; category: Category; index: number }[] = []
    for (let i = 0; i < files.length; i++) {
      const catVal = categoriesRaw[i]
      if (!isAllowedCategory(catVal)) {
        return NextResponse.json({ ok: false, error: `Invalid category at index ${i}` }, { status: 400 })
      }
      items.push({ file: files[i], category: catVal, index: i })
    }

    const nonBrochure: typeof items = []
    const brochure: typeof items = []
    for (const it of items) {
      if (it.category === 'Brochure') brochure.push(it)
      else nonBrochure.push(it)
    }
    const ordered = [...nonBrochure, ...brochure]

    // Validate mimes per category
    for (const [i, it] of ordered.entries()) {
      const mime = it.file.type
      if (it.category === 'Brochure') {
        if (!isPdf(mime) && !isImage(mime)) {
          return NextResponse.json({ ok: false, error: `Brochure at position ${i} must be image/* or application/pdf` }, { status: 400 })
        }
      } else {
        if (!isImage(mime)) {
          return NextResponse.json({ ok: false, error: `${it.category} at position ${i} must be an image` }, { status: 400 })
        }
      }
    }

    // Compute base order (1-based to stay consistent with existing single-upload route)
    const initialCount = await prisma.propertyMedia.count({ where: { propertyId: propertyIdBigInt } })

    // Upload to Supabase Storage first; then create DB records in a transaction
    const uploadResults: { path: string; mime: string; category: Category }[] = []

    for (const it of ordered) {
      const mime = it.file.type || 'application/octet-stream'
      const ext = extFromMime(mime)
      const uuid = (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2))
      const objectPath = `${propertyIdStr}/${uuid}.${ext}`

      // Convert to ArrayBuffer explicitly to avoid Node/Web File quirks in some environments
      let body: ArrayBuffer
      try {
        body = await it.file.arrayBuffer()
      } catch (readErr) {
        return NextResponse.json({ ok: false, error: 'Failed to read uploaded file' }, { status: 400 })
      }

      const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET).upload(objectPath, body, {
        contentType: mime,
        upsert: false,
      })
      if (uploadError) {
        return NextResponse.json({ ok: false, error: `Upload failed: ${uploadError.message}` }, { status: 500 })
      }
      uploadResults.push({ path: objectPath, mime, category: it.category })
    }

    // Prepare DB operations
    const ops = uploadResults.map((u, idx) =>
      prisma.propertyMedia.create({
        data: {
          propertyId: propertyIdBigInt,
          path: u.path,
          isCover: false,
          order: initialCount + idx + 1, // 1-based index
          alt: u.category,
        },
        select: { id: true, path: true, isCover: true, order: true, alt: true },
      })
    )

    let created = [] as Awaited<typeof ops[number]>[]
    try {
      created = await prisma.$transaction(ops)
    } catch (_dbErr: unknown) {
      // Roll back uploaded storage objects best-effort
      const toRemove = uploadResults.map(u => u.path)
      await supabaseAdmin.storage.from(BUCKET).remove(toRemove)
      return NextResponse.json({ ok: false, error: 'Database error creating media records' }, { status: 500 })
    }

    const data = created.map(m => ({
      id: m.id.toString(),
      path: m.path ?? null,
      isCover: Boolean(m.isCover),
      order: m.order ?? null,
      alt: m.alt ?? null,
      publicUrl: getPublicImageUrl(m.path ?? undefined),
    }))
    return NextResponse.json({ ok: true, data }, { status: 201 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

