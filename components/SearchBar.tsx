import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Search } from 'lucide-react'
import Link from 'next/link'

export function SearchBar() {
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('buy')

  return (
    <div className='w-full bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='searchbox bg-white rounded-lg border border-gray-200 p-6 shadow-sm'>
          <div className='flex flex-col sm:flex-row gap-4 items-center'>
            {/* Search Input */}
            <div className='flex-1 min-w-0'>
              <Input
                type='text'
                placeholder='Enter city, locality, or property name...'
                className='w-full border-gray-300 focus:border-primary'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {/* Buy/Rent Dropdown */}
            <div className='w-full sm:w-48'>
              <Select defaultValue='buy' onValueChange={(value) => setSearchTerm(value)}>
                <SelectTrigger className='border-gray-300 focus:border-primary'>
                  <SelectValue placeholder='Select option' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='buy'>Buy</SelectItem>
                  <SelectItem value='rent'>Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Link href={searchTerm === 'buy' ? `/buy?query=${searchInput}` : `/rent?query=${searchInput}`}>
              <Button className='w-full sm:w-auto px-8 cursor-pointer' size='default'>
                <Search className='w-4 h-4 mr-2' />
                Search
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
