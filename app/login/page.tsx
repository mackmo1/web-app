"use client";
import { Header } from "@/components/Header";
import Login from "@/components/Login";
import { Footer } from "@/components/Footer";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { useRouter } from "next/navigation";




const LoginPage = () => {
  const router = useRouter();

  return (
      <>
        <div className="min-h-screen flex flex-col">
          <Header />
          <Login onClose={() => router.back()} />
          <Footer />
          <WhatsAppChat />
        </div>
      </>
  )
}

export default LoginPage