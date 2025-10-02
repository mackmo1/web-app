import { ImageWithFallback } from './figma/ImageWithFallback'
import { MapPin, Bed, Bath, Square } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'

interface PropertyCardProps {
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

export function PropertyCard({ 
  image, 
  title, 
  price, 
  location, 
  beds, 
  baths, 
  area, 
  type, 
  propertyType 
}: PropertyCardProps) {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        {/* Property Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src={image}
            alt={title}
            width={300} height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge 
            variant={type === 'rent' ? 'secondary' : 'default'} 
            className="absolute top-3 left-3"
          >
            For {type === 'rent' ? 'Rent' : 'Sale'}
          </Badge>
        </div>
        
        {/* Property Details */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <span className="text-primary">{price}</span>
            {type === 'rent' && <span className="text-muted-foreground">/month</span>}
          </div>
          
          {/* Title */}
          <h3 className="mb-2 line-clamp-1">{title}</h3>
          
          {/* Location */}
          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          {/* Property Features */}
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span>{beds}</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span>{baths}</span>
              </div>
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                <span>{area}</span>
              </div>
            </div>
            <span className="text-muted-foreground">{propertyType}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}