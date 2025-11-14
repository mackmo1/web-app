'use client'
import { useState } from 'react'
import MobileDrawer from './MobileDrawer'
import Link from 'next/link'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Button } from './ui/button'
import { useAuth } from './AuthProvider'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { authenticated, user, loading, refreshAuth } = useAuth()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      await refreshAuth()
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <header className='w-full bg-white shadow-md z-50 border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-26'>
        <Link href='/' className='cursor-pointer'>
          <ImageWithFallback
            src='/logo.png'
            width={300}
            height={100}
            alt='PrimeProperties Logo'
            className='h-16 w-auto rounded-xl object-contain'
          />
        </Link>

        {/* Desktop Menu */}
        <nav className='hidden md:flex space-x-6'>
          <Link href='/buy' className='text-gray-700 hover:text-blue-600'>
            Buy
          </Link>
          <Link href='/rent' className='text-gray-700 hover:text-blue-600'>
            Rent
          </Link>
          <Link href='/enquery?listing=sale' className='text-gray-700 hover:text-blue-600'>
            Sell
          </Link>
          <Link href='/enquery?listing=rent' className='text-gray-700 hover:text-blue-600'>
            Rental
          </Link>
          <Link href='/contact-us' className='text-gray-700 hover:text-blue-600'>
            Contact Us
          </Link>
        </nav>

        <nav className='hidden md:flex space-x-6 items-center'>
          <Link href='/projects'>
            <Button variant='outline' size='sm' className='cursor-pointer h-11 md:h-8'>
              Projects
            </Button>
          </Link>

          <Link href='/enquery'>
            <Button variant='outline' size='sm' className='cursor-pointer'>
              List property Free
            </Button>
          </Link>

          {authenticated ? (
            <>
              <span className='text-sm text-gray-700'>
                {user?.name || user?.email}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={handleLogout}
                disabled={loading}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href='/login' className='cursor-pointer'>
                <Button variant='outline' size='sm'>
                  Login
                </Button>
              </Link>
              <Link href='/register' className='cursor-pointer'>
                <Button size='sm'>Register</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden text-gray-700 hover:text-blue-600'
          onClick={() => setIsOpen(true)}
          aria-label='Open menu'
        >
          ☰
        </button>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  )
}
