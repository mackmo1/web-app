import { ImageWithFallback } from './figma/ImageWithFallback'
import { MapPin, Bed, Bath, Square, Heart, Phone, Mail, Calendar } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

interface DetailedPropertyCardProps {
  id: string
  images: string[]
  title: string
  price: string
  location: string
  beds: number
  baths: number
  area: string
  type: 'rent' | 'buy'
  propertyType: string
  description: string
  amenities: string[]
  postedDate: string
  agentName: string
  // agentPhone: string
  isVerified?: boolean
  onShowInterest?: () => void
  onToggleFavorite?: () => void
  isFavorite?: boolean
}

export function DetailedPropertyCard({
  images,
  title,
  price,
  location,
  beds,
  baths,
  area,
  type,
  propertyType,
  description,
  amenities,
  postedDate,
  agentName,
  // agentPhone,
  isVerified = false,
  onShowInterest,
  onToggleFavorite,
  isFavorite = false,
}: DetailedPropertyCardProps) {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Property Images */}
          <div className="relative lg:w-1/3">
            <ImageWithFallback
              src={images[0]}
              alt={title}
              width={300} height={300}
              className="w-full h-64 lg:h-full object-cover rounded-l-lg"
            />
            <Badge 
              variant={type === 'rent' ? 'secondary' : 'default'} 
              className="absolute top-3 left-3"
            >
              For {type === 'rent' ? 'Rent' : 'Sale'}
            </Badge>
            {isVerified && (
              <Badge variant="default" className="absolute top-3 right-3 bg-green-600">
                Verified
              </Badge>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="absolute bottom-3 right-3 bg-white/80 hover:bg-white"
              onClick={onToggleFavorite}
              type="button"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-700'}`}
              />
            </Button>
          </div>
          
          {/* Property Details */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-primary">{price}</span>
                  {type === 'rent' && <span className="text-muted-foreground">/month</span>}
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{propertyType}</span>
                </div>
                <h3 className="mb-2">{title}</h3>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{location}</span>
                </div>
              </div>
            </div>

            {/* Property Features */}
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1 text-muted-foreground" />
                <span>{beds} Beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1 text-muted-foreground" />
                <span>{baths} Baths</span>
              </div>
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1 text-muted-foreground" />
                <span>{area}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>

            {/* Amenities */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {amenities.slice(0, 4).map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {amenities.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{amenities.length - 4} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Agent Info and Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm">{agentName}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Posted {postedDate}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button size="sm" onClick={onShowInterest} type="button">
                  Show Interest
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}