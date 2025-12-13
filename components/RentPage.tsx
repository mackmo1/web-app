'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RentSearchBar } from './RentSearchBar'
import { RentalPropertyCard } from './RentalPropertyCard'
import { PropertyCard } from './PropertyCard'
import { buildContactUrl, PropertyContext } from '@/lib/property-funnel'
import { useFavorites } from '@/hooks/useFavorites'

interface RentSearchFilters {
  query?: string
  type?: 'buy' | 'rent'
  minPrice?: string
  maxPrice?: string
  propertyType?: string
  rooms?: string
  furnishing?: string
}

export function RentPage({ query }: { query: string }) {
  // Local shapes used to adapt API data to existing cards without changing UI
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
  type RentDetailItem = {
    id: string
    images: string[]
    title: string
    monthlyRent: string
    location: string
    beds: number
    baths: number
    area: string
    propertyType: string
    furnishing: 'furnished' | 'semi-furnished' | 'unfurnished'
    description: string
    amenities: string[]
    postedDate: string
    agentName: string
    isVerified?: boolean
    securityDeposit?: string
  }

  // Define API response type we expect from /api/properties
  type ApiProperty = {
    id: string | number
    listing?: 'buy' | 'rent' | string
    type?: string
    city?: string
    project?: string
    address?: string
    rooms?: number | string | null
    bathrooms?: number | string | null
    price?: number | string | null
    area?: number | string | null
    message?: string | null
    created_at?: string | null
    coverImageUrl?: string | null
  }

  const [initialProperties, setInitialProperties] = useState<CardItem[]>([])
  const [searchResults, setSearchResults] = useState<RentDetailItem[]>([])
  const [isSearched, setIsSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { toggleFavorite, isFavorite } = useFavorites()

  // Helper to map API property -> CardItem (grid items)
  const mapToCardItem = useCallback(
    (p: ApiProperty): CardItem => {
      const bedsNum = Number(p.rooms)
      const bathsNum = Number(p.bathrooms)

      return {
        id: String(p.id),
        image: p.coverImageUrl || '/hero_image_1.jpg',
        title: p.project ?? '-',
        price: String(p.price ?? ''),
        location: [p.address, p.city].filter(Boolean).join(', '),
        beds: Number.isFinite(bedsNum) ? bedsNum : 0,
        baths: Number.isFinite(bathsNum) ? bathsNum : 0,
        area: p.area != null ? String(p.area) : '',
        type: 'rent',
        propertyType: p.type ?? '',
      }
    },
    []
  )

  // Helper to map API property -> RentalPropertyCard item (search results)
  const mapToRentItem = (p: ApiProperty): RentDetailItem => {
    const bedsNum = Number(p.rooms)
    const bathsNum = Number(p.bathrooms)

    return {
      id: String(p.id),
      images: [p.coverImageUrl || '/hero_image_1.jpg'],
      title: p.project ?? '-',
      monthlyRent: String(p.price ?? ''),
      location: [p.address, p.city].filter(Boolean).join(', '),
      beds: Number.isFinite(bedsNum) ? bedsNum : 0,
      baths: Number.isFinite(bathsNum) ? bathsNum : 0,
      area: p.area != null ? String(p.area) : '',
      propertyType: p.type ?? '',
      furnishing: 'unfurnished',
      description: p.message ?? '',
      amenities: [],
      postedDate: (() => {
        const created = p.created_at ? new Date(p.created_at) : null
        if (!created) return ''
        const days = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24))
        if (days <= 0) return 'today'
        if (days === 1) return '1 day ago'
        return `${days} days ago`
      })(),
      agentName: '—',
      isVerified: false,
      securityDeposit: undefined,
    }
  }

  // Initial load for "Rent" grid
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setError(null)
        const res = await fetch(`/api/properties?listing=rent&limit=9`, { cache: 'no-store' })
        const json = await res.json()
        const items: ApiProperty[] = (json?.data?.properties ?? []) as ApiProperty[]
        if (!cancelled) setInitialProperties(items.map(mapToCardItem))
      } catch {
        if (!cancelled) setError('Failed to load rental properties')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [mapToCardItem])

  const handleShowInterest = (property: RentDetailItem) => {
    const context: PropertyContext = {
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.monthlyRent,
      listingType: 'rent',
      propertyType: property.propertyType,
    }

    const url = buildContactUrl(context, 'property_interest')
    router.push(url)
  }

  const handleSearch = async (filters: RentSearchFilters) => {
    try {
      setLoading(true)
      setIsSearched(true)
      setError(null)

      const params = new URLSearchParams()
      params.set('listing', filters.type || 'rent')
      params.set('limit', '50')
      if (filters.query) params.set('search', filters.query)

      const res = await fetch(`/api/properties?${params.toString()}`, { cache: 'no-store' })
      const json = await res.json()
      let items: ApiProperty[] = (json?.data?.properties ?? []) as ApiProperty[]

      // Client-side filtering to match UI controls
      if (filters.propertyType && filters.propertyType !== 'all') {
        items = items.filter((p) => (p.type ?? '').toLowerCase() === filters.propertyType)
      }
      if (filters.rooms && filters.rooms !== 'all') {
        const roomsMap: Record<string, number> = { '1bhk': 1, '2bhk': 2, '3bhk': 3, '4bhk': 4 }
        const need = roomsMap[filters.rooms]
        items = items.filter((p) => Number(p.rooms ?? 0) === need)
      }
      if (filters.minPrice || filters.maxPrice) {
        const min = filters.minPrice ? Number(filters.minPrice) : 0
        const max = filters.maxPrice ? Number(filters.maxPrice) : Number.POSITIVE_INFINITY
        items = items.filter((p) => {
          const priceNum = Number(p.price ?? 0)
          return priceNum >= min && priceNum <= max
        })
      }

      setSearchResults(items.map(mapToRentItem))
    } catch {
      setError('Search failed. Please try again.')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  // Initial search if query prop is provided
  useEffect(() => {
    if (query && query.trim() !== '') {
      handleSearch({ query, type: 'rent' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='min-h-screen bg-gray-50'>
      <RentSearchBar onSearch={handleSearch} defaultType='rent' query={query} />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {error && <div className='text-center py-2 text-red-600'>{error}</div>}

        {!isSearched && (
          <div className='text-center py-16'>
            <h2 className='mb-4 text-4xl font-medium'>Find Your Perfect Rental</h2>
            <p className='text-muted-foreground'>
              Use our advanced search filters to find properties that match your needs
            </p>
            <section className='pt-10 pb-0 bg-gray-50'>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left'>
                    {initialProperties.map((property) => (
                      <PropertyCard key={property.id} {...property} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {loading && (
          <div className='text-center py-16'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
            <p className='mt-4 text-muted-foreground'>Searching rental properties...</p>
          </div>
        )}

        {isSearched && !loading && (
          <div>
            <div className='flex justify-between items-center mb-6'>
              <h2>{searchResults.length} Rental Properties Found</h2>
              <select className='px-3 py-2 border rounded-md'>
                <option>Sort by: Relevance</option>
                <option>Rent: Low to High</option>
                <option>Rent: High to Low</option>
                <option>Newest First</option>
                <option>Availability</option>
              </select>
            </div>

            <div className='space-y-6'>
              {searchResults.map((property) => (
                <RentalPropertyCard
                  key={property.id}
                  {...property}
                  onShowInterest={() => handleShowInterest(property)}
                  onToggleFavorite={() => toggleFavorite(property.id)}
                  isFavorite={isFavorite(property.id)}
                />
              ))}
            </div>

            {searchResults.length === 0 && (
              <div className='text-center py-16'>
                <h3 className='mb-2'>No Rental Properties Found</h3>
                <p className='text-muted-foreground'>
                  Try adjusting your search filters to find more rental properties
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
