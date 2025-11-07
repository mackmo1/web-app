'use client'
import { BuyPage } from '@/components/BuyPage'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function BuyContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''

  return <BuyPage query={query} />
}

export default function Buy() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Suspense fallback={<div>Loading...</div>}>
        <BuyContent />
      </Suspense>
    </div>
  )
}
