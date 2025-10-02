"use client";
// Legacy Enquery form has been replaced
import PostingForm from "@/components/Posting";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import Image from "next/image";

const EnqueryPage = () => {
  return (
      <>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="contact-poster">
            <figure className="poster">
              <Image src="/contact-poster.jpg" alt="contact poster" width={720} height={580} />
            </figure>
            <PostingForm />
          </div>
          <Footer />
          <WhatsAppChat />
        </div>
      </>
  )
}

export default EnqueryPage