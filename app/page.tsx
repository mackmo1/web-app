"use client";

import { Header } from "@/components/Header";
import { HomePage } from "@/components/HomePage";
import { Footer } from "@/components/Footer";
import { WhatsAppChat } from "@/components/WhatsAppChat";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HomePage />
      <Footer />
      <WhatsAppChat />
    </div>
  );
}
