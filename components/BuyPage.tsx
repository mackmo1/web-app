import { useState } from 'react'
import { AdvancedSearchBar } from './AdvancedSearchBar'
import { DetailedPropertyCard } from './DetailedPropertyCard'
import { PropertyCard } from './PropertyCard'

interface SearchFilters {
  query: string
  type: 'buy' | 'rent'
  minPrice: string
  maxPrice: string
  propertyType: string
  rooms: string
}

export function BuyPage() {
  const [searchResults, setSearchResults] = useState<typeof mockProperties>([])
  const [isSearched, setIsSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const buyProperties = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1751998816246-c63d182770c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTUyNjc0MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Luxury Downtown Apartment',
      price: '$2,500',
      location: 'Downtown, New York',
      beds: 2,
      baths: 2,
      area: '1,200 sq ft',
      type: 'buy' as const,
      propertyType: 'Apartment'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1737737210863-387afd35344e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYXBhcnRtZW50JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NTUyNjcxNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Cozy Studio in Brooklyn',
      price: '$1,800',
      location: 'Brooklyn Heights, NY',
      beds: 1,
      baths: 1,
      area: '750 sq ft',
      type: 'buy' as const,
      propertyType: 'Studio'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1556889882-50d7a74e8be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnQlMjByZW50YWx8ZW58MXx8fHwxNzU1Mjg2OTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Modern Loft Space',
      price: '$3,200',
      location: 'SoHo, Manhattan',
      beds: 1,
      baths: 1,
      area: '900 sq ft',
      type: 'buy' as const,
      propertyType: 'Loft'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc1NTIxNzk0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Modern Family House',
      price: '$750,000',
      location: 'Westchester, NY',
      beds: 4,
      baths: 3,
      area: '2,400 sq ft',
      type: 'buy' as const,
      propertyType: 'House'
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1707075108813-edefd7b3308d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMHByb3BlcnR5JTIwcmVhbCUyMGVzdGF0ZXxlbnwxfHx8fDE3NTUyODY5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Luxury Villa with Pool',
      price: '$1,250,000',
      location: 'Long Island, NY',
      beds: 5,
      baths: 4,
      area: '3,800 sq ft',
      type: 'buy' as const,
      propertyType: 'Villa'
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1705363134717-0210c88d2689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBob21lJTIwc2FsZXxlbnwxfHx8fDE3NTUyODY5ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Charming Suburban Home',
      price: '$525,000',
      location: 'Queens, NY',
      beds: 3,
      baths: 2,
      area: '1,800 sq ft',
      type: 'buy' as const,
      propertyType: 'House'
    }
  ]

  // Mock property data for search results
  const mockProperties = [
    {
      id: '1',
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc1NTIxNzk0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
      title: 'Modern Family House with Garden',
      price: '$750,000',
      location: 'Westchester, New York',
      beds: 4,
      baths: 3,
      area: '2,400 sq ft',
      type: 'buy' as const,
      propertyType: 'House',
      description: 'Beautiful modern family house featuring an open-plan design, spacious rooms, and a lovely garden. Perfect for families looking for comfort and style in a prime location.',
      amenities: ['Parking', 'Garden', 'Modern Kitchen', 'Fireplace', 'Balcony', 'Storage'],
      postedDate: '2 days ago',
      agentName: 'Sarah Johnson',
      agentPhone: '+1-555-0123',
      isVerified: true
    },
    {
      id: '2',
      images: ['https://images.unsplash.com/photo-1707075108813-edefd7b3308d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMHByb3BlcnR5JTIwcmVhbCUyMGVzdGF0ZXxlbnwxfHx8fDE3NTUyODY5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
      title: 'Luxury Villa with Swimming Pool',
      price: '$1,250,000',
      location: 'Long Island, New York',
      beds: 5,
      baths: 4,
      area: '3,800 sq ft',
      type: 'buy' as const,
      propertyType: 'Villa',
      description: 'Stunning luxury villa with premium finishes, spacious living areas, and a beautiful swimming pool. This property offers the ultimate in comfort and elegance.',
      amenities: ['Swimming Pool', 'Gym', 'Wine Cellar', 'Garage', 'Security System', 'Garden'],
      postedDate: '1 week ago',
      agentName: 'Michael Davis',
      agentPhone: '+1-555-0124',
      isVerified: true
    },
    {
      id: '3',
      images: ['https://images.unsplash.com/photo-1656789280583-c5bebda7ca1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwZW50aG91c2UlMjBhcGFydG1lbnQlMjBsdXh1cnl8ZW58MXx8fHwxNzU1MzM4Njc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
      title: 'Penthouse Apartment with City Views',
      price: '$950,000',
      location: 'Manhattan, New York',
      beds: 3,
      baths: 2,
      area: '1,800 sq ft',
      type: 'buy' as const,
      propertyType: 'Apartment',
      description: 'Exclusive penthouse apartment offering breathtaking city views, modern amenities, and premium location in the heart of Manhattan.',
      amenities: ['City Views', 'Concierge', 'Gym', 'Roof Terrace', 'High-end Appliances'],
      postedDate: '3 days ago',
      agentName: 'Emily Chen',
      agentPhone: '+1-555-0125',
      isVerified: false
    },
    {
      id: '4',
      images: ['https://images.unsplash.com/photo-1643297551340-19d8ad4f20ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhkdXBsZXglMjBob3VzZSUyMG1vZGVybnxlbnwxfHx8fDE3NTUzMzg2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
      title: 'Contemporary Duplex House',
      price: '$680,000',
      location: 'Brooklyn, New York',
      beds: 3,
      baths: 2,
      area: '2,100 sq ft',
      type: 'buy' as const,
      propertyType: 'House',
      description: 'Stylish duplex house with contemporary design, open living spaces, and modern amenities. Great location with easy access to transportation.',
      amenities: ['Modern Design', 'Open Plan', 'Parking', 'Near Transport'],
      postedDate: '5 days ago',
      agentName: 'Robert Wilson',
      agentPhone: '+1-555-0126',
      isVerified: true
    },
    {
      id: '5',
      images: ['https://images.unsplash.com/photo-1560185007-5f0bb1866cab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3duaG91c2UlMjBwcm9wZXJ0eXxlbnwxfHx8fDE3NTUzMzg2Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
      title: 'Charming Townhouse',
      price: '$525,000',
      location: 'Queens, New York',
      beds: 3,
      baths: 2,
      area: '1,800 sq ft',
      type: 'buy' as const,
      propertyType: 'House',
      description: 'Charming townhouse in a quiet neighborhood, perfect for families. Features include updated kitchen, hardwood floors, and private backyard.',
      amenities: ['Hardwood Floors', 'Updated Kitchen', 'Backyard', 'Quiet Area'],
      postedDate: '1 week ago',
      agentName: 'Lisa Anderson',
      agentPhone: '+1-555-0127',
      isVerified: false
    }
  ]

  const handleSearch = (filters: SearchFilters) => {
    setLoading(true)
    setIsSearched(true)

    // Simulate API call delay
    setTimeout(() => {
      // Simple filtering logic - in real app this would be done on backend
      const filtered = mockProperties.filter((property) => {
        if (filters.type && property.type !== filters.type) return false
        if (filters.propertyType && filters.propertyType !== 'all' && property.propertyType.toLowerCase() !== filters.propertyType) return false
        if (filters.rooms && filters.rooms !== 'all') {
          // Simple room matching - in real app this would be more sophisticated
          const roomCount = property.beds
          const filterRoom = filters.rooms
          if (filterRoom === '1bhk' && roomCount !== 1) return false
          if (filterRoom === '2bhk' && roomCount !== 2) return false
          if (filterRoom === '3bhk' && roomCount !== 3) return false
          if (filterRoom === '4bhk' && roomCount !== 4) return false
        }
        if (filters.query && !property.location.toLowerCase().includes(filters.query.toLowerCase()) &&
          !property.title.toLowerCase().includes(filters.query.toLowerCase())) return false

        // Price filtering (simplified)
        if (filters.minPrice || filters.maxPrice) {
          const propertyPrice = parseInt(property.price.replace(/[$,]/g, ''))
          const minPrice = filters.minPrice ? parseInt(filters.minPrice) : 0
          const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity
          if (propertyPrice < minPrice || propertyPrice > maxPrice) return false
        }

        return true
      })

      setSearchResults(filtered)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdvancedSearchBar onSearch={handleSearch} defaultType="buy" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isSearched && (
          <div className="text-center py-16">
            <h2 className="mb-4 text-4xl font-medium">Find Your Perfect Property</h2>
            <p className="text-muted-foreground">Use our advanced search filters to find properties that match your needs</p>
            <section className="pt-10 pb-0 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    {buyProperties.map((property) => (
                      <PropertyCard key={property.id} {...property} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Searching properties...</p>
          </div>
        )}

        {isSearched && !loading && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2>{searchResults.length} Properties Found</h2>
              <select className="px-3 py-2 border rounded-md">
                <option>Sort by: Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>

            <div className="space-y-6">
              {searchResults.map((property) => (
                <DetailedPropertyCard key={property.id} {...property} />
              ))}
            </div>

            {searchResults.length === 0 && (
              <div className="text-center py-16">
                <h3 className="mb-2">No Properties Found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters to find more properties</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}