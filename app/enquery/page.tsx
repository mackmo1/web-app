'use client'
// Legacy Enquery form has been replaced
import PostingForm from '@/components/Posting'
import { useRouter } from 'next/navigation'

const EnqueryPage = () => {
  const router = useRouter()

  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <PostingForm onClose={() => router.back()} />
      </div>
    </>
  )
}

export default EnqueryPage
