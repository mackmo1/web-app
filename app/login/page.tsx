"use client";
import Login from "@/components/Login";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Login onClose={() => router.back()} />
      </div>
    </>
  );
};

export default LoginPage;
