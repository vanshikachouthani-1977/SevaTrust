"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function AdminPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <Navbar />
            <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 mb-6">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 mb-4">Admin Portal</h1>
                    <p className="text-slate-600 mb-8 max-w-md text-center">
                        Restricted access. Please log in to manage campaigns, volunteers, and donations.
                    </p>

                    <div className="flex gap-4">
                        <Link href="/admin/dashboard">
                            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
                                Enter Dashboard
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" size="lg">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
