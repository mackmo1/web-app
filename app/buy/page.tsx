'use client'
import { BuyPage } from '@/components/BuyPage'
import { useSearchParams } from 'next/navigation'

export default function Buy() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''

  return (
    <div className='min-h-screen flex flex-col'>
      <BuyPage query={query} />
    </div>
  )
}
