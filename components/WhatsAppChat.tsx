'use client'
import { MessageCircle } from "lucide-react"

export function WhatsAppChat() {
  const handleWhatsAppClick = () => {
    // Replace with your WhatsApp number
    const phoneNumber = "1234567890" // Format: country code + number without + or spaces
    const message = "Hi! I'm interested in your real estate services."
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed right-6 bottom-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  )
}