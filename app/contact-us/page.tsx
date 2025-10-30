"use client";
import ContactForm from "@/components/Contact-form";
import { useRouter } from "next/navigation";

const ContactPage = () => {
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="contact-section py-[60px]">
          <div className="container mx-auto px-4 flex justify-center">
            <ContactForm onClose={() => router.back()} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
