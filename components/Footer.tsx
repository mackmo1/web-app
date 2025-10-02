import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  const footerMenus = [
    {
      title: "Services",
      items: ["Buy Properties", "Rent Properties", "Sell Properties", "Property Management"]
    },
    {
      title: "Company",
      items: ["About Us", "Our Team", "Careers", "Blog"]
    },
    {
      title: "Support",
      items: ["Contact Us", "FAQ", "Help Center", "Terms of Service"]
    },
    {
      title: "Locations",
      items: ["New York", "Los Angeles", "Chicago", "Miami"]
    }
  ]

  const socialIcons = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="mb-4">PrimeProperties</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner in finding the perfect property. We specialize in residential and commercial real estate solutions.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span>info@primeproperties.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" />
                <span>123 Real Estate Ave, City, State 12345</span>
              </div>
            </div>
          </div>

          {/* Footer Menus */}
          {footerMenus.map((menu, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="mb-4">{menu.title}</h4>
              <ul className="space-y-2">
                {menu.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 sm:mb-0">
            © 2024 PrimeProperties. All rights reserved.
          </p>
          
          {/* Social Media Icons */}
          <div className="flex space-x-4">
            {socialIcons.map((social, index) => {
              const IconComponent = social.icon
              return (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <IconComponent className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}