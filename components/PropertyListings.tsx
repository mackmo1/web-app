'use client'

import { useCallback, useEffect, useState } from 'react'

import { PropertyCard } from './PropertyCard'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function PropertyListings() {
  // Local types and state for fetched properties
  type CardItem = {
    id: string
    image: string
    title: string
    price: string
    location: string
    beds: number
    baths: number
    area: string
    type: 'rent' | 'buy'
    propertyType: string
  }
  type ApiProperty = {
    id: string | number
    listing?: 'buy' | 'rent' | string
    type?: string
    city?: string
    project?: string
    address?: string
    rooms?: number | string | null
    price?: number | string | null
    area?: number | string | null
    coverImageUrl?: string | null
  }

  const [rentProperties, setRentProperties] = useState<CardItem[]>([])
  const [buyProperties, setBuyProperties] = useState<CardItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const mapToCardItem = useCallback(
    (p: ApiProperty): CardItem => ({
      id: String(p.id),
      image: p.coverImageUrl || '/hero_image_1.jpg',
      title: p.project ?? '-',
      price: String(p.price ?? ''),
      location: [p.address, p.city].filter(Boolean).join(', '),
      beds: Number(p.rooms ?? 0),
      baths: 0,
      area: p.area != null ? String(p.area) : '',
      type: (p.listing as 'buy' | 'rent') ?? 'buy',
      propertyType: p.type ?? '',
    }),
    []
  )

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setError(null)
        const [rRes, bRes] = await Promise.all([
          fetch(`/api/properties?listing=rent&limit=6`, { cache: 'no-store' }),
          fetch(`/api/properties?listing=buy&limit=6`, { cache: 'no-store' }),
        ])
        const [rJson, bJson] = await Promise.all([rRes.json(), bRes.json()])
        const rItems: ApiProperty[] = (rJson?.data?.properties ?? []) as ApiProperty[]
        const bItems: ApiProperty[] = (bJson?.data?.properties ?? []) as ApiProperty[]
        if (!cancelled) {
          setRentProperties(rItems.map(mapToCardItem))
          setBuyProperties(bItems.map(mapToCardItem))
        }
      } catch {
        if (!cancelled) setError('Failed to load top listings')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [mapToCardItem])

  return (
    <section className='py-16 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {error && <div className='text-center py-2 text-red-600'>{error}</div>}

        {/* Top Listings for Rent */}
        <div className='mb-16'>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='mb-2'>Top Listings for Rent</h2>
              <p className='text-muted-foreground'>Discover our most popular rental properties</p>
            </div>

            <Link href='/rent'>
              <Button variant='outline' className='flex items-center gap-2 cursor-pointer'>
                View All Rentals
                <ArrowRight className='w-4 h-4' />
              </Button>
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {rentProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>

        {/* Top Listings for Buy */}
        <div>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='mb-2'>Top Listings for Sale</h2>
              <p className='text-muted-foreground'>Find your perfect home to purchase</p>
            </div>

            <Link href='/buy'>
              <Button variant='outline' className='flex items-center gap-2 cursor-pointer'>
                View All Properties
                <ArrowRight className='w-4 h-4' />
              </Button>
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {buyProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
