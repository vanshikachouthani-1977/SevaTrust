"use client";

import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Fetch role from Firestore
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

            if (userDoc.exists()) {
                const rawRole = userDoc.data().role;
                const userRole = typeof rawRole === "string" ? rawRole.trim().toLowerCase() : rawRole;

                if (userRole === "admin") {
                    router.push("/admin/donations");
                } else if (userRole === "local") {
                    router.push("/campaigns");
                } else if (userRole === "volunteer") {
                    router.push("/volunteer");
                } else {
                    router.push("/");
                }
            } else {
                setError("User profile not found. Please contact support.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to sign in. Please check your credentials.");
        } finally {
            setLoading(false);
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
                    <p className="text-sm text-slate-500 mt-2">Please login to continue to Seva Trust</p>
                </div>

                <form className="relative space-y-5" onSubmit={handleSignIn}>
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-slate-800"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-slate-800"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-sm mt-6 flex justify-center items-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div className="relative mt-6 text-center text-sm text-slate-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-teal-600 hover:text-teal-700 hover:underline font-medium transition-colors">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
