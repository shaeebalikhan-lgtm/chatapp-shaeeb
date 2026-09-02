"use client";

import { useState } from "react";
import Link from 'next/link'

import toast from 'react-hot-toast';
// Import an eye icon from react-icons if using lucide-react or react-icons, or use a button:
import { Eye, EyeOff } from "lucide-react";
import './signup.css';
import { useAuthStore } from "@/app/store/useAuthStore.js";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        password: ''
    });
    const {signup} = useAuthStore()

   const [showPassword, setShowPassword] = useState(false)
    const handlechange = (evt) => {
        setFormData((prev) => ({
            ...prev,
            [evt.target.name]: evt.target.value
        }));
    };

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const router = useRouter()
    const validateForm = () => {
        if (!formData.fullName.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!emailRegex.test(formData.email)) return toast.error("Invalid email");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents page reload and URL parameter query string creation
        const success = validateForm();
        console.log(formData)
        if (success === true) {
            // Add your API call/signup logic here
            signup(formData)
            toast.success("Account created successfully!");
            router.replace("/login");
        }
    };

    return (
        <div className="signup-container">
            <header>Sign Up</header>

            <form className="signup-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter email"
                    onChange={handlechange}
                />

                <label htmlFor="fullName">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    placeholder="Enter Full Name"
                    onChange={handlechange}
                />
                <label htmlFor="password">Password</label>
             <div className="password-wrapper">
                
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    placeholder="Enter Password"
                    onChange={handlechange}
                />
                <button type="button" className="toggle-password-btn" onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                </div>

                <button type="submit">Create Account</button>
            </form>

            <div className="signup-login">
                <p>Already have an account?</p>
                <Link href="/login">Sign in</Link>
            </div>
        </div>
    );
}