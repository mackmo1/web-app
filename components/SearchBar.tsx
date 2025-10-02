import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Search } from "lucide-react"

export function SearchBar() {
  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="searchbox bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 min-w-0">
              <Input
                placeholder="Enter location, property type, or keyword..."
                className="w-full border-gray-300 focus:border-primary"
              />
            </div>
            
            {/* Buy/Rent Dropdown */}
            <div className="w-full sm:w-48">
              <Select defaultValue="buy">
                <SelectTrigger className="border-gray-300 focus:border-primary">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Search Button */}
            <Button className="w-full sm:w-auto px-8" size="default">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}