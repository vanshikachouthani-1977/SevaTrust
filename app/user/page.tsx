"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Heart, HandMetal, ArrowLeft, Calendar } from "lucide-react";

export default function UserDashboard() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
                
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">My Profile</h1>
                        <p className="text-slate-600">
                            Welcome! Here's an overview of your activity and contributions.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                        <span className="text-sm font-semibold text-blue-700">Supporter</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-slate-500">Total Donations</h3>
                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                    <HandMetal className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">₹0</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-slate-500">Campaigns Supported</h3>
                                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                                    <Heart className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">0</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-slate-500">Member Since</h3>
                                <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-xl font-bold text-slate-900">March 2026</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer />
        </main>
    );
}
