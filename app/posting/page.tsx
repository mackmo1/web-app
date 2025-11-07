import PostingForm from '@/components/Posting'
import Image from 'next/image'
import { Suspense } from 'react'

const PostingPage = () => {
  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <div className='contact-poster'>
          <figure className='poster'>
            <Image src='/contact-poster.jpg' alt='contact poster' width={720} height={580} />
          </figure>
          <Suspense fallback={<div>Loading...</div>}>
            <PostingForm />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default PostingPage
