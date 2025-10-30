import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";

interface HeaderProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function Header({ currentPage = "home" }: HeaderProps) {
  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-26">
          {/* Logo and Company Name - Left Aligned */}
          <Link
            href={"/"}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <ImageWithFallback
              src="/logo.png"
              width={300}
              height={100}
              alt="PrimeProperties Logo"
              className="h-16 w-auto rounded-xl object-contain"
            />
          </Link>

          {/* Navigation Menu - Center Aligned */}
          <nav className="navMenu">
            <ul className="hidden md:flex space-x-8 items-center">
              <li>
                <Link
                  href="/buy"
                  className={`transition-colors duration-200 py-2 ${
                    currentPage === "buy"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Buy
                </Link>
              </li>
              <li>
                <Link
                  href="/rent"
                  className={`transition-colors duration-200 py-2 ${
                    currentPage === "rent"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Rent
                </Link>
              </li>
              <li>
                <Link
                  href="/sell"
                  className={`transition-colors duration-200 py-2 ${
                    currentPage === "sell"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Sell
                </Link>
              </li>
              <li>
                <Link
                  href="/rental"
                  className={`transition-colors duration-200 py-2 ${
                    currentPage === "rental"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Rental
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className={`transition-colors duration-200 py-2 ${
                    currentPage === "contact-us"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </nav>

          {/* Auth Buttons - Right Aligned */}
          <div className="flex items-center space-x-4">
            <Link href="/projects">
              <Button
                variant="secondary"
                size="sm"
                className="cursor-pointer h-11 md:h-8"
              >
                Projects
              </Button>
            </Link>

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
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation - Visible on small screens */}
        <div className="md:hidden mt-2">
          <nav aria-label="Primary" className="navMenu-mobile">
            <ul className="flex items-center gap-3 overflow-x-auto whitespace-nowrap -mx-4 px-4">
              <li>
                <Link
                  href="/buy"
                  className={`inline-flex items-center h-11 px-3 rounded-md transition-colors duration-200 ${
                    currentPage === "buy"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Buy
                </Link>
              </li>
              <li>
                <Link
                  href="/rent"
                  className={`inline-flex items-center h-11 px-3 rounded-md transition-colors duration-200 ${
                    currentPage === "rent"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Rent
                </Link>
              </li>
              <li>
                <Link
                  href="/sell"
                  className={`inline-flex items-center h-11 px-3 rounded-md transition-colors duration-200 ${
                    currentPage === "sell"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Sell
                </Link>
              </li>
              <li>
                <Link
                  href="/rental"
                  className={`inline-flex items-center h-11 px-3 rounded-md transition-colors duration-200 ${
                    currentPage === "rental"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Rental
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className={`inline-flex items-center h-11 px-3 rounded-md transition-colors duration-200 ${
                    currentPage === "contact-us"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
