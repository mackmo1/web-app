"use client";
import { Header } from "@/components/Header";
import Register from "@/components/Register";
import { Footer } from "@/components/Footer";
import { WhatsAppChat } from "@/components/WhatsAppChat"

const RegisterPage = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main>
          <Register />
        </main>
        <Footer />
        <WhatsAppChat />
      </div>
    </>
  )
}

export default RegisterPage