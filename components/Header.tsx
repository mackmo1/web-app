import { Button } from "./ui/button"
import { ImageWithFallback } from './figma/ImageWithFallback'
import Link from "next/link";


interface HeaderProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function Header({ onNavigate, currentPage = 'home' }: HeaderProps) {
  // const navigationItems = ['Buy', 'Rent', 'Sell', 'Rental', 'Enquiry']

  const handleNavClick = (item: string) => {
    if (onNavigate) {
      onNavigate(item.toLowerCase())
    }
  }

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-26">
          {/* Logo and Company Name - Left Aligned */}
          <Link href={"/"} className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate?.('home')}>
            <ImageWithFallback
              src="/logo.png"
              width={100} height={100}
              alt="PrimeProperties Logo"
              className="h-24 w-22 rounded-lg object-cover"
            />
            <h1 className="text-primary">PrimeProperties</h1>
          </Link>

          {/* Navigation Menu - Center Aligned */}
          <nav className="navMenu">
            <ul className="hidden md:flex space-x-8 items-center">
              <li className="group relative">
                <Link
                  href="/buy"
                  className={`transition-colors duration-200 py-2 ${currentPage === 'buy' ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary'
                    }`}
                >
                  Buy
                </Link>
                <ul className="submenu shadow-lg">
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Property in Bangalore
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Property in Kolkata
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Search Property
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Chat on WhatsApp
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="group relative">
                <Link
                  href="/rent"
                  className={`transition-colors duration-200 py-2 ${currentPage === 'rent' ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary'
                    }`}
                >
                  Rent
                </Link>
                <ul className="submenu shadow-lg">
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Rental in Bangalore
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Search Rentals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Chat on WhatsApp
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="group relative">
                <button
                  onClick={() => handleNavClick('sell')}
                  className={`transition-colors duration-200 py-2 ${currentPage === 'sell' ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary'
                    }`}
                >
                  Sell
                </button>
                <ul className="submenu shadow-lg">
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      First time user
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      My Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      List Property Free
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Chat on WhatsApp
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Call us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Send Email
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="group relative">
                <button
                  onClick={() => handleNavClick('rental')}
                  className={`transition-colors duration-200 py-2 ${currentPage === 'rental' ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary'
                    }`}
                >
                  Rental
                </button>
                <ul className="submenu shadow-lg">
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      First time user
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      My Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      List Rental Free
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Chat on WhatsApp
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Call us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Send Email
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="group relative">
                <Link
                  href="/contact-us"
                  className={`transition-colors duration-200 py-2 ${currentPage === 'contact-us' ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary'
                    }`}
                >
                  Contact us
                </Link>
                <ul className="submenu shadow-lg">
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Chat on WhatsApp
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Call us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Request for Callback
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`transition-colors duration-200 py-2 text-gray-700 hover:text-primary`}
                    >
                      Send Email
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>

          {/* Auth Buttons - Right Aligned */}
          <div className="flex items-center space-x-4">
            <Link href="/enquery">
              <Button variant="secondary" size="sm" className="cursor-pointer">
                List property Free
              </Button>
            </Link>
            <Link href="/login" className="cursor-pointer">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register" className="cursor-pointer">
              <Button size="sm">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}