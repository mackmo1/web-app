import { PropertyCard } from './PropertyCard'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

export function PropertyListings() {
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
    }
  ]

  const buyProperties = [
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Listings for Rent */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Top Listings for Rent</h2>
              <p className="text-muted-foreground">Discover our most popular rental properties</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              View All Rentals
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>

        {/* Top Listings for Buy */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Top Listings for Sale</h2>
              <p className="text-muted-foreground">Find your perfect home to purchase</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}