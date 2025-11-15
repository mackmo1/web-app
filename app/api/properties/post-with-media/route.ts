import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getPublicImageUrl } from '@/lib/image-url'
import type { property as PropertyModel, Prisma } from '@/lib/generated/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'property-images'

const CATEGORY_LABELS = ['Inside View', 'Floor Plan', 'Outside View', 'Brochure'] as const

type Category = (typeof CATEGORY_LABELS)[number]

type ErrorCode =
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'NETWORK_ERROR'
  | 'DB_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN'

type PropertyEntity = PropertyModel

type PropertyJson = {
  id: string
  listing: string
  type: string | null
  city: string
  project: string | null
  address: string
  pin_code: string | null
  rooms: string
  parking: boolean | null
  price: string
  facing: string | null
  starting_dt: string | null
  user_id: string | null
  area: string | null
  status: string | null
  message: string | null
  external_id: string | null
  created_at: string
  coverImageUrl: string
}

function formatProperty(p: PropertyEntity): PropertyJson {
  return {
    id: p.id.toString(),
    listing: p.listing,
    type: p.type ?? null,
    city: p.city,
    project: p.project ?? null,
    address: p.address,
    pin_code: p.pin_code ?? null,
    rooms: p.rooms,
    parking: p.parking ?? null,
    price: String(p.price),
    facing: p.facing ?? null,
    starting_dt: p.starting_dt ? new Date(p.starting_dt as unknown as Date).toISOString() : null,
    user_id: p.user_id != null ? p.user_id.toString() : null,
    area: p.area != null ? p.area.toString() : null,
    status: p.status ?? null,
    message: p.message ?? null,
    external_id: p.external_id ?? null,
    created_at: new Date(p.created_at as unknown as Date).toISOString(),
    coverImageUrl: getPublicImageUrl(p.coverImagePath ?? undefined),
  }
}

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

function errorResponse(code: ErrorCode, message: string, status: number) {
  return NextResponse.json({ success: false, code, message }, { status })
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()

    const getField = (name: string): string | null => {
      const val = form.get(name)
      if (val == null) return null
      if (typeof val === 'string') {
        const trimmed = val.trim()
        return trimmed === '' ? null : trimmed
      }
      return String(val)
    }

    const listing = getField('listing')
    const city = getField('city')
    const address = getField('address')
    const rooms = getField('rooms')
    const price = getField('price')

    for (const [key, value] of [
      ['listing', listing],
      ['city', city],
      ['address', address],
      ['rooms', rooms],
      ['price', price],
    ] as const) {
      if (!value) {
        return errorResponse('VALIDATION_ERROR', `${key} is required`, 400)
      }
    }

    const type = getField('type')
    const project = getField('project')
    const pin_code = getField('pin_code')
    const facing = getField('facing')
    const startingDtStr = getField('starting_dt')
    const userIdStr = getField('user_id')
    const areaStr = getField('area')
    const status = getField('status')
    const message = getField('message')
    const externalId = getField('external_id')
    const parkingStr = getField('parking') // 'yes' | 'no'

    let startingDate: Date | null = null
    if (startingDtStr) {
      const dt = new Date(startingDtStr)
      if (!Number.isNaN(dt.getTime())) {
        startingDate = dt
      }
    }

    let userId: bigint | null = null
    if (userIdStr) {
      try {
        userId = BigInt(userIdStr)
      } catch {
        userId = null
      }
    }

    let area: bigint | null = null
    if (areaStr) {
      try {
        area = BigInt(areaStr)
      } catch {
        area = null
      }
    }

    let parking: boolean | null = null
    if (parkingStr === 'yes') parking = true
    else if (parkingStr === 'no') parking = false

    const data: Prisma.propertyCreateInput = {
      listing: listing!,
      type: type ?? null,
      city: city!,
      project: project ?? null,
      address: address!,
      pin_code: pin_code ?? null,
      rooms: rooms!,
      parking,
      price: price!,
      facing: facing ?? null,
      starting_dt: startingDate,
      user_id: userId,
      area,
      status: status ?? null,
      message: message ?? null,
      external_id: externalId ?? null,
    }

    const property = await prisma.property.create({ data })
    const propertyIdBigInt = property.id
    const propertyIdStr = propertyIdBigInt.toString()

    const files = form.getAll('files') as File[]
    const categoriesRaw = form.getAll('categories')

    if (!files.length) {
      const formatted = formatProperty(property)
      return NextResponse.json(
        { success: true, data: formatted, message: 'Property created successfully' },
        { status: 201 },
      )
    }

    if (categoriesRaw.length !== files.length) {
      await prisma.property.delete({ where: { id: propertyIdBigInt } })
      return errorResponse('VALIDATION_ERROR', 'categories length must match files length', 400)
    }

    const items: { file: File; category: Category; index: number }[] = []
    for (let i = 0; i < files.length; i++) {
      const catVal = categoriesRaw[i]
      if (!isAllowedCategory(catVal)) {
        await prisma.property.delete({ where: { id: propertyIdBigInt } })
        return errorResponse('VALIDATION_ERROR', `Invalid category at index ${i}`, 400)
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

    for (const [i, it] of ordered.entries()) {
      const mime = it.file.type
      if (it.category === 'Brochure') {
        if (!isPdf(mime) && !isImage(mime)) {
          await prisma.property.delete({ where: { id: propertyIdBigInt } })
          return errorResponse(
            'INVALID_FILE_TYPE',
            `Brochure at position ${i} must be image/* or application/pdf`,
            400,
          )
        }
      } else {
        if (!isImage(mime)) {
          await prisma.property.delete({ where: { id: propertyIdBigInt } })
          return errorResponse(
            'INVALID_FILE_TYPE',
            `${it.category} at position ${i} must be an image`,
            400,
          )
        }
      }
    }

    const uploadResults: { path: string; mime: string; category: Category }[] = []

    for (const it of ordered) {
      const mime = it.file.type || 'application/octet-stream'
      const ext = extFromMime(mime)
      const uuid = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)
      const objectPath = `${propertyIdStr}/${uuid}.${ext}`

      let body: ArrayBuffer
      try {
        body = await it.file.arrayBuffer()
      } catch (readErr) {
        await prisma.property.delete({ where: { id: propertyIdBigInt } })
        return errorResponse(
          'NETWORK_ERROR',
          `Failed to read uploaded file, ${JSON.stringify(readErr)}`,
          400,
        )
      }

      const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET).upload(objectPath, body, {
        contentType: mime,
        upsert: false,
      })

      if (uploadError) {
        const uploadedPaths = uploadResults.map((u) => u.path)
        if (uploadedPaths.length) {
          await supabaseAdmin.storage.from(BUCKET).remove(uploadedPaths)
        }
        await prisma.property.delete({ where: { id: propertyIdBigInt } })

        const lower = uploadError.message.toLowerCase()
        if (lower.includes('size') || lower.includes('limit') || lower.includes('too large') || lower.includes('exceeds')) {
          return errorResponse(
            'FILE_TOO_LARGE',
            'Image upload failed: File size exceeds the allowed limit. Please choose a smaller image.',
            400,
          )
        }

        return errorResponse(
          'NETWORK_ERROR',
          `Image upload failed due to a storage error: ${uploadError.message}`,
          500,
        )
      }

      uploadResults.push({ path: objectPath, mime, category: it.category })
    }

    const ops = uploadResults.map((u, idx) =>
      prisma.propertyMedia.create({
        data: {
          propertyId: propertyIdBigInt,
          path: u.path,
          isCover: false,
          order: idx + 1,
          alt: u.category,
        },
        select: { id: true, path: true, isCover: true, order: true, alt: true },
      }),
    )

    try {
      await prisma.$transaction(ops)
    } catch (dbErr: unknown) {
      const toRemove = uploadResults.map((u) => u.path)
      if (toRemove.length) {
        await supabaseAdmin.storage.from(BUCKET).remove(toRemove)
      }
      await prisma.property.delete({ where: { id: propertyIdBigInt } })
      return errorResponse(
        'DB_ERROR',
        `Database error creating media records, ${JSON.stringify(dbErr)}`,
        500,
      )
    }

    const formatted = formatProperty(property)
    return NextResponse.json(
      { success: true, data: formatted, message: 'Property and media uploaded successfully' },
      { status: 201 },
    )
  } catch (e: unknown) {
    console.error('POST /api/properties/post-with-media error', e)
    return errorResponse('UNKNOWN', 'Unexpected error. Please try again.', 500)
  }
}

