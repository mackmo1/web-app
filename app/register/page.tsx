"use client";
import Register from "@/components/Register";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <main>
          <Register onClose={() => router.back()} />
        </main>
      </div>
    </>
  );
};

export default RegisterPage;
