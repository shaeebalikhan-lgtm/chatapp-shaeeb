"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import Navbar from "../components/Navbar";

export default function ProtectedLayout({
  children,
}) {
  const router = useRouter();

  const authUser =
    useAuthStore(
      (state) => state.authUser
    );

  const checkAuth =
    useAuthStore(
      (state) => state.checkAuth
    );

  const isCheckingAuth =
    useAuthStore(
      (state) => state.isCheckingAuth
    );

  // ============================================
  // CHECK AUTH ONCE
  // ============================================

  useEffect(() => {
    checkAuth();
  }, []);

  // ============================================
  // REDIRECT
  // ============================================

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!authUser) {
        router.replace("/login");
      }
    }
  }, [
    authUser,
    isCheckingAuth,
    router,
  ]);

  // ============================================
  // LOADING
  // ============================================

  if (isCheckingAuth) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  // ============================================
  // NOT AUTHENTICATED
  // ============================================

  if (!authUser) {
    return null;
  }

  // ============================================
  // AUTHENTICATED
  // ============================================

  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>
    </>
  );
}