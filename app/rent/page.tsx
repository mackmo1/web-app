'use client'

import { RentPage } from '@/components/RentPage'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function RentContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''

  return <RentPage query={query} />
}

export default function Rent() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Suspense fallback={<div>Loading...</div>}>
        <RentContent />
      </Suspense>
    </div>
  )
}
