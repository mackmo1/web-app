'use client'

import { RentPage } from '@/components/RentPage'
import { useSearchParams } from 'next/navigation'

export default function Rent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''

  return (
    <div className='min-h-screen flex flex-col'>
      <RentPage query={query} />
    </div>
  )
}
