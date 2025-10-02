"use client";
import { Header } from "@/components/Header";
import Login from "@/components/Login";
import { Footer } from "@/components/Footer";
import { WhatsAppChat } from "@/components/WhatsAppChat";

const LoginPage = () => {
  return (
      <>
        <div className="min-h-screen flex flex-col">
          <Header />
          <Login />
          <Footer />
          <WhatsAppChat />
        </div>
      </>
  )
}

export default LoginPage