"use client";

import { Suspense } from "react";
import Login from "@/components/Login";
import { useRouter, useSearchParams } from "next/navigation";

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleClose = () => {
    if (redirect) {
      router.push(redirect);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Login onClose={handleClose} />
    </div>
  );
}

const LoginPage = () => {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
};

export default LoginPage;
