'use client'
import Link from 'next/link'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

export default function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close drawer when route changes
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Close drawer on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <div
      ref={drawerRef}
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className='flex justify-between items-center p-4 border-b'>
        <Link href='/' className='cursor-pointer mr-7'>
          <ImageWithFallback
            src='/logo.png'
            width={300}
            height={100}
            alt='PrimeProperties Logo'
            className='h-16 w-auto rounded-xl object-contain'
          />
        </Link>
        <button onClick={onClose} aria-label='Close menu'>
          ✕
        </button>
      </div>
      <nav className='flex flex-col p-4 space-y-4'>
        <Link href='/login' className='cursor-pointer'>
          <Button variant='outline' size='sm'>
            Login
          </Button>
        </Link>

        <Link href='/register' className='cursor-pointer'>
          <Button size='sm'>Register</Button>
        </Link>

        <Link href='/projects'>
          <Button variant='secondary' size='sm' className='cursor-pointer h-11 md:h-8'>
            Projects
          </Button>
        </Link>

        <Link href='/enquery'>
          <Button variant='secondary' size='sm' className='cursor-pointer'>
            List property Free
          </Button>
        </Link>

        <Link href='/buy' className='text-gray-700 hover:text-blue-600'>
          Buy
        </Link>
        <Link href='/rent' className='text-gray-700 hover:text-blue-600'>
          Rent
        </Link>
        <Link href='/sell' className='text-gray-700 hover:text-blue-600'>
          Sell
        </Link>
        <Link href='/rental' className='text-gray-700 hover:text-blue-600'>
          Rental
        </Link>
        <Link href='/contact-us' className='text-gray-700 hover:text-blue-600'>
          Contact Us
        </Link>
      </nav>
    </div>
  )
}
