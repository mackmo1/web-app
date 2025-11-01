import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { getPublicImageUrl } from '@/lib/image-url'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function extFromMime(mime: string): string {
  if (mime === 'image/jpeg' || mime === 'image/jpg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/gif') return 'gif'
  if (mime === 'image/avif') return 'avif'
  return 'bin'
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
    const existing = await prisma.property.findUnique({
      where: { id: propertyIdBigInt },
      select: { id: true, coverImagePath: true },
    })
    if (!existing) {
      return NextResponse.json({ ok: false, error: 'Property not found' }, { status: 404 })
    }

    // Parse multipart/form-data
    const form = await req.formData()
    let file = form.get('file') as unknown as File | null
    if (!file) file = form.get('image') as unknown as File | null
    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file uploaded (expected field "file" or "image")' }, { status: 400 })
    }

    const mime = file.type as string | undefined
    if (!mime || !mime.startsWith('image/')) {
      return NextResponse.json({ ok: false, error: 'Invalid file type; image/* required' }, { status: 400 })
    }

    const origName = (file as File).name as string | undefined
    const ext = (origName && origName.includes('.'))
      ? origName.split('.').pop()!.toLowerCase()
      : extFromMime(mime)

    const uuid = (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2))
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'property-images'
    const objectPath = `${propertyIdStr}/${uuid}.${ext}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from(bucket)
      .upload(objectPath, file, { contentType: mime, upsert: false })

    if (uploadError) {
      return NextResponse.json({ ok: false, error: `Upload failed: ${uploadError.message}` }, { status: 500 })
    }

    // Determine if this should be the cover image
    const isCover = !existing.coverImagePath

    // Determine order (append)
    const count = await prisma.propertyMedia.count({ where: { propertyId: propertyIdBigInt } })

    // Create PropertyMedia record
    const media = await prisma.propertyMedia.create({
      data: {
        propertyId: propertyIdBigInt,
        path: objectPath,
        isCover,
        order: count + 1,
        alt: null,
      },
      select: { id: true, path: true, isCover: true, order: true },
    })

    // If first image for this property, set as cover
    if (isCover) {
      await prisma.property.update({
        where: { id: propertyIdBigInt },
        data: { coverImagePath: objectPath },
      })
    }

    const publicUrl = getPublicImageUrl(objectPath)

    return NextResponse.json({ ok: true, data: { ...media, path: objectPath, publicUrl } }, { status: 201 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

