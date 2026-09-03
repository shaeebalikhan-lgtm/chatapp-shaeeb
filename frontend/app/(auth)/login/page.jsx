
"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore.js";
import "./login.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (evt) => {
    setFormData((prev) => ({
      ...prev,
      [evt.target.name]: evt.target.value,
    }));
  };

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const success = await login(formData);

      if (success) {
        router.push("/chat");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <header>Sign In</header>

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>

        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter email"
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>

        <div className="password-wrapper">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            placeholder="Enter Password"
            onChange={handleChange}
          />

          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="login-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="login-signup">
        <p>Don't have an account?</p>
        <Link href="/signup">Sign up</Link>
      </div>
    </div>
  );
}
