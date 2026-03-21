"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function AdminLoginPage() {
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
                } else {
                    setError("Access denied. Admin privileges required.");
                    await auth.signOut();
                }
            } else {
                setError("User profile not found. Please contact support.");
                await auth.signOut();
            }
        } catch (err: any) {
            setError(err.message || "Failed to sign in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-900 px-4 relative">
            <Link href="/" className="absolute top-8 left-8 flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
            </Link>
            <div className="max-w-md w-full mx-auto p-8 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden text-white">
                <div className="relative text-center mb-8">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-sm">
                        <Shield className="w-6 h-6 fill-current" />
                    </div>
                    <h1 className="text-3xl font-bold font-heading">Admin Access</h1>
                    <p className="text-sm text-slate-400 mt-2">Secure login for authorized personnel only</p>
                </div>

                <form className="relative space-y-5" onSubmit={handleSignIn}>
                    {error && (
                        <div className="p-3 bg-red-900/50 text-red-200 border border-red-800 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="email">
                            Admin Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors text-white placeholder-slate-400"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors text-white placeholder-slate-400"
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors shadow-sm mt-6 flex justify-center items-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Authenticating..." : "Sign In to Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
}
