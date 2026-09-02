
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import "./Navbar.css";

export default function Navbar() {
  const router = useRouter();

  const { authUser, logout, isLoggingIn } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link href="/chat" className="navbar-logo">
          ChatApp
        </Link>


        {/* User Actions */}
        <div className="navbar-actions">

          {authUser && (
            <span className="navbar-user">
              {authUser.fullName || authUser.name || authUser.email}
            </span>
          )}

          <Link href="/profile" className="profile-btn">
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="logout-btn"
            disabled={isLoggingIn}
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}
