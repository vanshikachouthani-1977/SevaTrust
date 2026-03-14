"use client";

import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/Card";
import { Calendar, Droplets, BookOpen, Utensils, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function MyActivityPage() {
    const router = useRouter();
    const { role, loading } = useAuth();

    useEffect(() => {
        if (!loading && !role) {
            router.push("/");
        }
    }, [role, loading, router]);

    if (loading || !role) return null;

    const donationHistory = [
        {
            id: "DON-2024-089",
            campaign: "Clean Water Initiative",
            date: "Feb 15, 2026",
            amount: "₹5,000",
            icon: Droplets,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            id: "DON-2024-042",
            campaign: "Digital Education Program",
            date: "Jan 22, 2026",
            amount: "₹2,500",
            icon: BookOpen,
            color: "text-indigo-500",
            bg: "bg-indigo-50"
        },
        {
            id: "DON-2023-112",
            campaign: "Winter Food Drive",
            date: "Dec 10, 2025",
            amount: "₹1,000",
            icon: Utensils,
            color: "text-orange-500",
            bg: "bg-orange-50"
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-2">My Activity</h1>
                    <p className="text-slate-600">
                        View your past contributions and the impact you've made.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-slate-500">Total Donated</h3>
                                <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                                    <Heart className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">₹8,500</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-slate-500">Campaigns Supported</h3>
                                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">3</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-slate-500">Member Since</h3>
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-xl font-bold text-slate-900 mt-2">Dec 2025</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900">Donation History</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {donationHistory.map((donation, index) => {
                            const Icon = donation.icon;
                            return (
                                <div key={index} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-full ${donation.bg} ${donation.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">{donation.campaign}</h3>
                                            <div className="flex items-center text-xs text-slate-500 mt-1">
                                                <span className="mr-3">{donation.id}</span>
                                                <span className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {donation.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-teal-600">{donation.amount}</div>
                                        <div className="text-xs text-slate-500 mt-1">Successful</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
}
