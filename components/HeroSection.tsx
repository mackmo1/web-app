import { Button } from './ui/button'
import { ImageWithFallback } from './figma/ImageWithFallback'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className='relative bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Text Content */}
          <div className='space-y-8'>
            <div className='space-y-4'>
              <h1 className='text-4xl lg:text-5xl leading-tight text-gray-900'>
                Find Your Dream Home with <span className='text-primary'>PrimeProperties</span>
              </h1>
              <p className='text-xl text-gray-600 leading-relaxed'>
                Discover the perfect property that matches your lifestyle. From luxury homes to affordable apartments,
                we have something for everyone.
              </p>
            </div>

            <Link href='/projects' className=' w-full'>
              <Button size='lg' className='px-8 w-full cursor-pointer'>
                New Projects
              </Button>
            </Link>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-8 pt-8'>
              <div className='text-center'>
                <div className='text-2xl text-primary mb-1'>1000+</div>
                <div className='text-gray-600'>Properties</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl text-primary mb-1'>500+</div>
                <div className='text-gray-600'>Happy Clients</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl text-primary mb-1'>15+</div>
                <div className='text-gray-600'>Years Experience</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className='relative'>
            <ImageWithFallback
              src='/floor-apartment.jpg'
              alt='Beautiful modern home'
              width={1200}
              height={480}
              className='rounded-2xl shadow-2xl w-full h-[400px] lg:h-[500px] object-cover'
            />
          </div>
        </div>
      </div>
    </section>
  )
}
