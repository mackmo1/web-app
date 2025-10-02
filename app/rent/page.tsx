"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { RentPage } from "@/components/RentPage";

export default function Rent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <RentPage />
      <Footer />
      <WhatsAppChat />
    </div>
  );
}

