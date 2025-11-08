import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const footerMenus = [
    {
      title: 'Services',
      items: [
        { name: 'Buy Properties', href: '/buy' },
        { name: 'Rent Properties', href: '/rent' },
        { name: 'Sell Properties', href: '/enquery#sale' },
        { name: 'Property Management', href: '/contact-us' },
      ],
    },
    {
      title: 'Company',
      items: [
        { name: 'About Us', href: '#' },
        { name: 'Our Team', href: '#' },
      ],
    },
    {
      title: 'Support',
      items: [
        { name: 'Contact Us', href: '/contact-us' },
      ],
    },
    {
      title: 'Locations',
      items: [
        { name: 'Bangalore', href: '#' },
        { name: 'Kolkata', href: '#' },
      ],
    },
  ]

  const socialIcons = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ]

  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8'>
          {/* Company Info */}
          <div className='lg:col-span-2'>
            <h3 className='mb-4'>Step360degree</h3>
            <p className='text-gray-300 mb-6 leading-relaxed'>
              Your trusted partner in finding the perfect property. We specialize in residential and commercial real
              estate solutions.
            </p>

            {/* Contact Info */}
            <div className='space-y-3 text-gray-300'>
              <div className='flex items-center space-x-3'>
                <Phone className='w-4 h-4' />
                <span>+91 7899775598</span>
              </div>
              <div className='flex items-center space-x-3'>
                <Mail className='w-4 h-4' />
                <span>info@step360d.com</span>
              </div>
              <div className='flex items-center space-x-3'>
                <MapPin className='w-4 h-4' />
                <span>Sarjapur, Prestige City, Bangaluru 562125</span>
              </div>
            </div>
          </div>

          {/* Footer Menus */}
          {footerMenus.map((menu, index) => (
            <div key={index} className='lg:col-span-1'>
              <h4 className='mb-4'>{menu.title}</h4>
              <ul className='space-y-2'>
                {menu.items.map(({ name, href }, itemIndex) => (
                  <li key={itemIndex}>
                    <Link href={href} className='text-gray-300 hover:text-white transition-colors duration-200'>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className='mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center'>
          <p className='text-gray-400 mb-4 sm:mb-0'>© 2025 Step360degree. All rights reserved.</p>

          {/* Social Media Icons */}
          <div className='flex space-x-4'>
            {socialIcons.map((social, index) => {
              const IconComponent = social.icon
              return (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className='text-gray-400 hover:text-white transition-colors duration-200'
                >
                  <IconComponent className='w-5 h-5' />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
