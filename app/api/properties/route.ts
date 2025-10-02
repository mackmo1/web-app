import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper: format property to JSON friendly (BigInt -> string, Decimal -> string)
import type { property as PropertyModel, Prisma } from '@/lib/generated/prisma';

type PropertyEntity = PropertyModel;

type PropertyJson = Omit<PropertyEntity, 'id' | 'user_id' | 'area' | 'price' | 'created_at'> & {
  id: string | PropertyEntity['id'];
  user_id: string | null;
  area: string | null;
  price: string;
  created_at: string;
};

function formatProperty(p: PropertyEntity): PropertyJson {
  return {
    ...(p as unknown as Omit<PropertyEntity, 'id' | 'user_id' | 'area' | 'price' | 'created_at'>),
    id: p.id.toString(),
    user_id: p.user_id != null ? p.user_id.toString() : null,
    area: p.area != null ? p.area.toString() : null,
    price: String(p.price),
    created_at: new Date(p.created_at as unknown as Date).toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json({ success: false, error: 'Invalid pagination' }, { status: 400 });
    }

    const where: Prisma.propertyWhereInput = {};
    const listing = searchParams.get('listing');
    const city = searchParams.get('city');
    const type = searchParams.get('type');

    if (listing) where.listing = listing;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (type) where.type = type;

    const [items, total] = await Promise.all([
      prisma.property.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: 'desc' } }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        properties: items.map(formatProperty),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    console.error('GET /api/properties', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    const required = ['listing', 'city', 'address', 'rooms', 'price'];
    for (const key of required) {
      if (!body[key]) {
        return NextResponse.json({ success: false, error: `${key} is required` }, { status: 400 });
      }
    }

    // Coercions for numeric/boolean/date fields
    const data: Prisma.propertyCreateInput = {
      listing: body.listing,
      type: body.type ?? null,
      city: body.city,
      project: body.project ?? null,
      address: body.address,
      pin_code: body.pin_code ?? null,
      rooms: body.rooms,
      parking: typeof body.parking === 'boolean' ? body.parking : null,
      price: body.price, // Prisma will coerce string->Decimal
      facing: body.facing ?? null,
      starting_dt: body.starting_dt ? new Date(body.starting_dt) : null,
      user_id: body.user_id ? BigInt(body.user_id) : null,
      area: body.area != null ? BigInt(body.area) : null,
      status: body.status ?? null,
      message: body.message ?? null,
      external_id: body.external_id ?? null,
    };

    const created = await prisma.property.create({ data });
    return NextResponse.json({ success: true, data: formatProperty(created), message: 'Property created' }, { status: 201 });
  } catch (e) {
    console.error('POST /api/properties', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
