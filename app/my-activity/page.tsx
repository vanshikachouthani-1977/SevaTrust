"use client";

import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/Card";
import { Calendar, Droplets, BookOpen, Utensils, Heart, Shirt, Apple, PenTool, Box, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function MyActivityPage() {
    const router = useRouter();
    const { user, role, loading } = useAuth();
    const [donations, setDonations] = useState<any[]>([]);

    useEffect(() => {
        if (!loading && !role) {
            router.push("/");
        }
    }, [role, loading, router]);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, "donations"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            data.sort((a: any, b: any) => {
                const dateA = a.createdAt?.toMillis() || 0;
                const dateB = b.createdAt?.toMillis() || 0;
                return dateB - dateA;
            });
            setDonations(data);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading || !role) return null;

    const totalCategories = new Set(donations.map(d => d.category)).size;
    
    // Parse the creation date from user metadata if available
    const memberSince = user?.metadata?.creationTime 
        ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
        : "Recently";

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case "Clothes": return { icon: Shirt, color: "text-blue-500", bg: "bg-blue-50" };
            case "Books": return { icon: BookOpen, color: "text-purple-500", bg: "bg-purple-50" };
            case "Utensils": return { icon: Utensils, color: "text-green-500", bg: "bg-green-50" };
            case "Food": return { icon: Apple, color: "text-red-500", bg: "bg-red-50" };
            case "Stationery": return { icon: PenTool, color: "text-yellow-500", bg: "bg-yellow-50" };
            default: return { icon: Box, color: "text-slate-500", bg: "bg-slate-50" };
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 bg-gradient-to-r from-teal-700 to-emerald-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 tracking-tight">My Activity</h1>
                        <p className="text-teal-50 text-base sm:text-lg font-medium">View your past contributions and the impact you've made.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <Card className="bg-white border-0 shadow-sm ring-1 ring-slate-100 transition-all duration-300 rounded-2xl group overflow-hidden relative">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold tracking-wider uppercase text-slate-500 pr-2">Total Pledges</h3>
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-teal-50 border border-teal-100 rounded-xl text-teal-600 shadow-sm">
                                    <Heart className="w-5 h-5 fill-current" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold tracking-tight text-slate-900">{donations.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-0 shadow-sm ring-1 ring-slate-100 transition-all duration-300 rounded-2xl group overflow-hidden relative">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold tracking-wider uppercase text-slate-500 pr-2">Categories Supported</h3>
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-orange-50 border border-orange-100 rounded-xl text-orange-500 shadow-sm">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold tracking-tight text-slate-900">{totalCategories}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-0 shadow-sm ring-1 ring-slate-100 transition-all duration-300 rounded-2xl group overflow-hidden relative">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold tracking-wider uppercase text-slate-500 pr-2">Member Since</h3>
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-50 border border-blue-100 rounded-xl text-blue-500 shadow-sm">
                                    <Calendar className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-1">{memberSince}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-900">Donation History</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {donations.length === 0 ? (
                            <div className="px-8 py-16 text-center">
                                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Box className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No donations yet</h3>
                                <p className="text-slate-500 max-w-sm mx-auto">Start making an impact today by browsing our campaigns and donating items.</p>
                            </div>
                        ) : (
                            donations.map((donation, index) => {
                                const styles = getCategoryStyles(donation.category);
                                const Icon = styles.icon;
                                const dateFormatted = donation.createdAt?.toDate 
                                    ? donation.createdAt.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                                    : 'Just now';
                                
                                return (
                                    <div key={donation.id || index} className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/80 transition-colors gap-6 border-l-4 border-transparent hover:border-teal-500">
                                        <div className="flex items-center space-x-6">
                                            <div className={`p-4 rounded-2xl ${styles.bg} ${styles.color} shadow-sm border border-slate-50`}>
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900 mb-1">{donation.category} Donation</h3>
                                                <div className="text-sm font-medium text-slate-600 mb-1">
                                                    <span className="text-slate-800">{donation.description}</span> <span className="text-slate-300 mx-1">•</span> Qty: {donation.quantity}
                                                </div>
                                                <div className="flex items-center text-xs font-semibold text-slate-400">
                                                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                                    {dateFormatted}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {donation.status === "pending" && (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
                                                    <Clock className="w-3.5 h-3.5 mr-1.5" /> Pending Review
                                                </span>
                                            )}
                                            {donation.status === "accepted" && (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                                                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Accepted
                                                </span>
                                            )}
                                            {donation.status === "rejected" && (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 shadow-sm">
                                                    <XCircle className="w-3.5 h-3.5 mr-1.5" /> Declined
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
