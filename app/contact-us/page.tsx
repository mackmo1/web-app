"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ContactForm from "@/components/Contact-form";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { useRouter } from "next/navigation";



const ContactPage = () => {
  const router = useRouter();



  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="contact-section py-[60px]">
          <div className="container mx-auto px-4 flex justify-center">
            <ContactForm onClose={() => router.back()} />
          </div>

        </div>
        <Footer />
        <WhatsAppChat />
      </div>
    </>
  )
}

export default ContactPage