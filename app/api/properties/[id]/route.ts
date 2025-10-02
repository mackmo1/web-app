import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import type { property as PropertyModel } from '@/lib/generated/prisma';

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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const item = await prisma.property.findUnique({ where: { id: BigInt(id) } });
    if (!item) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: formatProperty(item) });
  } catch (e) {
    console.error('GET /api/properties/[id]', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();

    const data: Partial<PropertyEntity> = {
      listing: body.listing ?? undefined,
      type: body.type ?? undefined,
      city: body.city ?? undefined,
      project: body.project ?? undefined,
      address: body.address ?? undefined,
      pin_code: body.pin_code ?? undefined,
      rooms: body.rooms ?? undefined,
      parking: typeof body.parking === 'boolean' ? body.parking : undefined,
      price: body.price ?? undefined,
      facing: body.facing ?? undefined,
      starting_dt: body.starting_dt ? new Date(body.starting_dt) : undefined,
      user_id: body.user_id != null ? BigInt(body.user_id) : undefined,
      area: body.area != null ? BigInt(body.area) : undefined,
      status: body.status ?? undefined,
      message: body.message ?? undefined,
      external_id: body.external_id ?? undefined,
    };

    const updated = await prisma.property.update({ where: { id: BigInt(id) }, data });
    return NextResponse.json({ success: true, data: formatProperty(updated), message: 'Property updated' });
  } catch (e) {
    console.error('PUT /api/properties/[id]', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.property.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ success: true, message: 'Property deleted' });
  } catch (e) {
    console.error('DELETE /api/properties/[id]', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
