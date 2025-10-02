"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { BuyPage } from "@/components/BuyPage";

export default function Buy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BuyPage />
      <Footer />
      <WhatsAppChat />
    </div>
  );
}

