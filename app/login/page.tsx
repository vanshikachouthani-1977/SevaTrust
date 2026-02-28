"use client";

import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState("local");

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("role", role);
        if (role === "local") {
            router.push("/campaigns");
        } else if (role === "volunteer") {
            localStorage.setItem("volunteerStatus", "unregistered");
            router.push("/volunteer/register");
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 px-4 relative">
            <Link href="/" className="absolute top-8 left-8 flex items-center text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
            </Link>
            <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-teal-50 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-orange-50 rounded-full opacity-50 blur-xl"></div>

                <div className="relative text-center mb-8">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-sm">
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 font-heading">Welcome Back</h1>
                    <p className="text-sm text-slate-500 mt-2">Please login to continue to UnityConnect</p>
                </div>

                <form className="relative space-y-5" onSubmit={handleSignIn}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            defaultValue="admin@gmail.com"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-slate-800"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            defaultValue="••••••••"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-slate-800"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="role">
                            Login as
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors bg-white cursor-pointer"
                        >
                            <option value="local">Local User</option>
                            <option value="volunteer">Volunteer</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-sm mt-6 flex justify-center items-center cursor-pointer"
                    >
                        Sign In
                    </button>
                </form>

                <div className="relative mt-6 text-center text-sm text-slate-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/contact" className="text-teal-600 hover:text-teal-700 hover:underline font-medium transition-colors">
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}
