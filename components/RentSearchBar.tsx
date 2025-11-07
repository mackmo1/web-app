import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Search, ChevronDown } from "lucide-react"

interface RentSearchFilters {
  query?: string
  type?: 'buy' | 'rent'
  minPrice?: string
  maxPrice?: string
  propertyType?: string
  rooms?: string
  furnishing?: string
}

interface RentSearchBarProps {
  onSearch: (filters: RentSearchFilters) => void
  defaultType?: 'buy' | 'rent',
  query?: string
}

export function RentSearchBar({ onSearch, defaultType = 'rent', query = ''}: RentSearchBarProps) {
  const [filters, setFilters] = useState<RentSearchFilters>({
    query,
    type: defaultType,
    minPrice: '',
    maxPrice: '',
    propertyType: 'all',
    rooms: 'all',
    furnishing: 'all'
  })

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleFilterChange = (key: keyof RentSearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' }
  ]

  const roomOptions = [
    { value: '1bhk', label: '1 BHK' },
    { value: '2bhk', label: '2 BHK' },
    { value: '3bhk', label: '3 BHK' },
    { value: '4bhk', label: '4 BHK' }
  ]

  const furnishingOptions = [
    { value: 'furnished', label: 'Furnished' },
    { value: 'semi-furnished', label: 'Semi Furnished' },
    { value: 'unfurnished', label: 'Unfurnished' }
  ]

  return (
    <div className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Search Input */}
          <div className="flex-1 min-w-[250px]">
            <label className="block mb-2">Search Location</label>
            <Input
              type="text"
              placeholder="Enter city, locality, or property name..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Buy/Rent Dropdown */}
          <div className="min-w-[120px]">
            <label className="block mb-2">Type</label>
            <Select 
              value={filters.type} 
              onValueChange={(value: 'buy' | 'rent') => handleFilterChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Dropdown with Custom Min/Max */}
          <div className="min-w-[150px]">
            <label className="block mb-2">Monthly Rent</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {filters.minPrice || filters.maxPrice 
                    ? `$${filters.minPrice || '0'} - $${filters.maxPrice || '∞'}`
                    : 'Select Rent'
                  }
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">Min Monthly Rent</label>
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Max Monthly Rent</label>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Property Type Dropdown */}
          <div className="min-w-[140px]">
            <label className="block mb-2">Property Type</label>
            <Select 
              value={filters.propertyType} 
              onValueChange={(value) => handleFilterChange('propertyType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Type</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rooms Dropdown */}
          <div className="min-w-[120px]">
            <label className="block mb-2">Rooms</label>
            <Select 
              value={filters.rooms} 
              onValueChange={(value) => handleFilterChange('rooms', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                {roomOptions.map((room) => (
                  <SelectItem key={room.value} value={room.value}>
                    {room.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Furnishing Dropdown */}
          <div className="min-w-[140px] hidden">
            <label className="block mb-2">Furnishing</label>
            <Select 
              value={filters.furnishing} 
              onValueChange={(value) => handleFilterChange('furnishing', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                {furnishingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button onClick={handleSearch} className="px-8">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}