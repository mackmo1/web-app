"use client";
import { Header } from "@/components/Header";
import Register from "@/components/Register";
import { Footer } from "@/components/Footer";
import { WhatsAppChat } from "@/components/WhatsAppChat"
import { useRouter } from "next/navigation";


const RegisterPage = () => {
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main>
          <Register onClose={() => router.back()} />
        </main>
        <Footer />
        <WhatsAppChat />
      </div>
    </>
  )
}

export default RegisterPage