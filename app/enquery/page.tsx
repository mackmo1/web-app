import PostingForm from '@/components/Posting'
import { Suspense } from 'react'

const EnqueryPage = () => {
  
  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <Suspense fallback={<div>Loading...</div>}>
          <PostingForm />
        </Suspense>
      </div>
    </>
  )
}

export default EnqueryPage
