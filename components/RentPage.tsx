import { useState } from 'react'
import { RentSearchBar } from './RentSearchBar'
import { RentalPropertyCard } from './RentalPropertyCard'
import { PropertyCard } from './PropertyCard'

interface RentSearchFilters {
  query: string
  type: 'buy' | 'rent'
  minPrice: string
  maxPrice: string
  propertyType: string
  rooms: string
  furnishing: string
}

export function RentPage() {
  const [searchResults, setSearchResults] = useState<typeof mockRentalProperties>([])
  const [isSearched, setIsSearched] = useState(false)
  const [loading, setLoading] = useState(false)


  const rentProperties = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1751998816246-c63d182770c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTUyNjc0MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Luxury Downtown Apartment',
      price: '$2,500',
      location: 'Downtown, New York',
      beds: 2,
      baths: 2,
      area: '1,200 sq ft',
      type: 'rent' as const,
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
      type: 'rent' as const,
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
      type: 'rent' as const,
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
      type: 'rent' as const,
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
      type: 'rent' as const,
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
      type: 'rent' as const,
      propertyType: 'House'
    }
  ]
  // Mock rental property data
  const mockRentalProperties = [
    {
      id: '1',
      images: ['https://images.unsplash.com/photo-1632999101501-47bd016f7e46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBsaXZpbmclMjByb29tJTIwZnVybmlzaGVkfGVufDF8fHx8MTc1NTM0MDAyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
      title: 'Furnished Studio Apartment in Downtown',
      monthlyRent: '$2,500',
      location: 'Manhattan, New York',
      beds: 1,
      baths: 1,
      area: '650 sq ft',
      propertyType: 'Apartment',
      furnishing: 'furnished' as const,
      description: 'Beautiful furnished studio apartment in the heart of Manhattan. Perfect for young professionals with modern amenities and excellent location.',
      amenities: ['WiFi', 'AC', 'Gym', 'Laundry', 'Doorman', 'Rooftop'],
      postedDate: '1 day ago',
      agentName: 'Emma Thompson',
      agentPhone: '+1-555-0200',
      isVerified: true,
      securityDeposit: '$2,500'
    },
    {
      id: '2',
      images: ['https://images.unsplash.com/photo-1743008019164-2d810a54915e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tJTIwcmVudGFsfGVufDF8fHx8MTc1NTM0MDAyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
      title: 'Spacious 2BR Semi-Furnished Apartment',
      monthlyRent: '$3,200',
      location: 'Brooklyn, New York',
      beds: 2,
      baths: 2,
      area: '1,100 sq ft',
      propertyType: 'Apartment',
      furnishing: 'semi-furnished' as const,
      description: 'Modern 2-bedroom apartment with some furniture included. Great natural light and close to subway stations for easy commuting.',
      amenities: ['Parking', 'Storage', 'Balcony', 'Dishwasher', 'In-unit Laundry'],
      postedDate: '3 days ago',
      agentName: 'David Martinez',
      agentPhone: '+1-555-0201',
      isVerified: true,
      securityDeposit: '$3,200'
    },
    {
      id: '3',
      images: ['https://images.unsplash.com/photo-1601002257790-ebe0966a85ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZW50YWwlMjBob3VzZSUyMGludGVyaW9yfGVufDF8fHx8MTc1NTM0MDAyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
      title: 'Luxury Furnished Villa with Pool',
      monthlyRent: '$8,500',
      location: 'Long Island, New York',
      beds: 4,
      baths: 3,
      area: '3,500 sq ft',
      propertyType: 'Villa',
      furnishing: 'furnished' as const,
      description: 'Exceptional luxury villa fully furnished with high-end furniture and appliances. Features include swimming pool, garden, and premium finishes throughout.',
      amenities: ['Swimming Pool', 'Garden', 'Garage', 'Security', 'Maid Service', 'Chef Kitchen'],
      postedDate: '1 week ago',
      agentName: 'Sophie Williams',
      agentPhone: '+1-555-0202',
      isVerified: true,
      securityDeposit: '$17,000'
    },
    {
      id: '4',
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc1NTIxNzk0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
      title: 'Unfurnished Family House',
      monthlyRent: '$4,200',
      location: 'Queens, New York',
      beds: 3,
      baths: 2,
      area: '1,800 sq ft',
      propertyType: 'House',
      furnishing: 'unfurnished' as const,
      description: 'Spacious unfurnished family house perfect for those who want to bring their own furniture. Features include private backyard and updated kitchen.',
      amenities: ['Backyard', 'Parking', 'Storage', 'Updated Kitchen', 'Quiet Neighborhood'],
      postedDate: '4 days ago',
      agentName: 'James Rodriguez',
      agentPhone: '+1-555-0203',
      isVerified: false,
      securityDeposit: '$4,200'
    },
    {
      id: '5',
      images: ['https://images.unsplash.com/photo-1656789280583-c5bebda7ca1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwZW50aG91c2UlMjBhcGFydG1lbnQlMjBsdXh1cnl8ZW58MXx8fHwxNzU1MzM4Njc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
      title: 'Modern 3BR Semi-Furnished Apartment',
      monthlyRent: '$4,800',
      location: 'Manhattan, New York',
      beds: 3,
      baths: 2,
      area: '1,500 sq ft',
      propertyType: 'Apartment',
      furnishing: 'semi-furnished' as const,
      description: 'Contemporary 3-bedroom apartment with some furniture and appliances included. Great city views and premium location near Central Park.',
      amenities: ['City Views', 'Concierge', 'Gym', 'Elevator', 'Near Park'],
      postedDate: '5 days ago',
      agentName: 'Anna Chen',
      agentPhone: '+1-555-0204',
      isVerified: true,
      securityDeposit: '$4,800'
    },
    {
      id: '6',
      images: ['https://images.unsplash.com/photo-1560185007-5f0bb1866cab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3duaG91c2UlMjBwcm9wZXJ0eXxlbnwxfHx8fDE3NTUzMzg2Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
      title: 'Furnished Townhouse with Garden',
      monthlyRent: '$5,500',
      location: 'Brooklyn, New York',
      beds: 3,
      baths: 2,
      area: '2,000 sq ft',
      propertyType: 'House',
      furnishing: 'furnished' as const,
      description: 'Charming furnished townhouse with private garden. Perfect for families, includes all necessary furniture and appliances for comfortable living.',
      amenities: ['Garden', 'Parking', 'Furnished', 'Pet Friendly', 'Near Schools'],
      postedDate: '6 days ago',
      agentName: 'Michael Brown',
      agentPhone: '+1-555-0205',
      isVerified: true,
      securityDeposit: '$5,500'
    }
  ]

  const handleSearch = (filters: RentSearchFilters) => {
    setLoading(true)
    setIsSearched(true)

    // Simulate API call delay
    setTimeout(() => {
      // Filtering logic for rental properties
      const filtered = mockRentalProperties.filter((property) => {
        if (filters.type && filters.type !== 'rent') return false

        if (filters.propertyType && filters.propertyType !== 'all' &&
          property.propertyType.toLowerCase() !== filters.propertyType) return false

        if (filters.furnishing && filters.furnishing !== 'all' &&
          property.furnishing !== filters.furnishing) return false

        if (filters.rooms && filters.rooms !== 'all') {
          const roomCount = property.beds
          const filterRoom = filters.rooms
          if (filterRoom === '1bhk' && roomCount !== 1) return false
          if (filterRoom === '2bhk' && roomCount !== 2) return false
          if (filterRoom === '3bhk' && roomCount !== 3) return false
          if (filterRoom === '4bhk' && roomCount !== 4) return false
        }

        if (filters.query && !property.location.toLowerCase().includes(filters.query.toLowerCase()) &&
          !property.title.toLowerCase().includes(filters.query.toLowerCase())) return false

        // Price filtering for monthly rent
        if (filters.minPrice || filters.maxPrice) {
          const monthlyRent = parseInt(property.monthlyRent.replace(/[$,]/g, ''))
          const minRent = filters.minPrice ? parseInt(filters.minPrice) : 0
          const maxRent = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity
          if (monthlyRent < minRent || monthlyRent > maxRent) return false
        }

        return true
      })

      setSearchResults(filtered)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RentSearchBar onSearch={handleSearch} defaultType="rent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isSearched && (
          <div className="text-center py-16">
            <h2 className="mb-4 text-4xl font-medium">Find Your Perfect Rental</h2>
            <p className="text-muted-foreground">Use our advanced search filters to find properties that match your needs</p>
            <section className="pt-10 pb-0 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    {rentProperties.map((property) => (
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
            <p className="mt-4 text-muted-foreground">Searching rental properties...</p>
          </div>
        )}

        {isSearched && !loading && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2>{searchResults.length} Rental Properties Found</h2>
              <select className="px-3 py-2 border rounded-md">
                <option>Sort by: Relevance</option>
                <option>Rent: Low to High</option>
                <option>Rent: High to Low</option>
                <option>Newest First</option>
                <option>Availability</option>
              </select>
            </div>

            <div className="space-y-6">
              {searchResults.map((property) => (
                <RentalPropertyCard key={property.id} {...property} />
              ))}
            </div>

            {searchResults.length === 0 && (
              <div className="text-center py-16">
                <h3 className="mb-2">No Rental Properties Found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters to find more rental properties</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}