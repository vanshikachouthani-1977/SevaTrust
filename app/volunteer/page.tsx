"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Calendar, Clock, HandMetal, Heart, CheckCircle2, ArrowLeft, AlertCircle, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";

type VolunteerReq = {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    interest: string;
    availableDays: string[];
    hoursPerMonth: string;
    status: string;
    campaign?: string | null;
    timeSlot?: string | null;
    appointmentStatus?: string;
    userId: string;
};

export default function VolunteerDashboard() {
    const router = useRouter();
    const { user, role, loading } = useAuth();
    
    const [myRecord, setMyRecord] = useState<VolunteerReq | null>(null);

    useEffect(() => {
        if (loading) return;
        
        if (!role) {
            router.push("/login");
        } else if (role !== "volunteer") {
            router.push("/");
        }
    }, [role, loading, router]);

    useEffect(() => {
        if (loading || !user || role !== "volunteer") return;
        
        // Listen to the real Firestore entry created when this volunteer registered
        const q = query(collection(db, "volunteer_applications"), where("userId", "==", user.uid));
        const unsub = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const docSnap = snapshot.docs[0];
                setMyRecord({ id: docSnap.id, ...docSnap.data() } as VolunteerReq);
            }
        });
        
        return () => unsub();
    }, [user, role, loading]);

    const handleAppointmentAction = async (action: "accepted" | "declined") => {
        if (!myRecord) return;
        
        try {
            await updateDoc(doc(db, "volunteer_applications", myRecord.id), {
                appointmentStatus: action
            });
        } catch (error) {
            console.error("Error responding to appointment:", error);
        }
    };

    if (loading || !role) return null;

    const stats = [
        { label: "Hours Volunteered", value: "42hrs", icon: Clock, color: "text-teal-600", bg: "bg-teal-50" },
        { label: "Events Attended", value: "12", icon: Calendar, color: "text-orange-600", bg: "bg-orange-50" },
        { label: "People Impacted", value: "~850", icon: Heart, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Donations Raised", value: "₹12.5k", icon: HandMetal, color: "text-indigo-600", bg: "bg-indigo-50" }
    ];

    const isRequestPending = myRecord?.appointmentStatus === "pending_acceptance";
    const hasUpcomingConfirmed = myRecord?.appointmentStatus === "accepted";

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
                        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Volunteer Dashboard</h1>
                        <p className="text-slate-600 mb-1">
                            Welcome back, {myRecord?.fullName || user?.email}! Here's your impact overview.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {stats.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <Card key={i} className="bg-white border-slate-100 shadow-sm border-t-2 border-t-slate-200 hover:border-t-teal-500 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium text-slate-500">{s.label}</h3>
                                        <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">{s.value}</div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        
                        {isRequestPending && myRecord?.campaign && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                                <div className="flex flex-col sm:flex-row gap-5 items-start">
                                    <div className="bg-amber-100 text-amber-600 p-3 rounded-full shrink-0">
                                        <AlertCircle className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-lg font-bold text-amber-900 mb-1">New Campaign Request</h2>
                                        <p className="text-amber-800 text-sm mb-4">
                                            The admin has appointed you to a new campaign! Would you like to accept this assignment?
                                        </p>
                                        <div className="bg-white/60 p-4 rounded-lg border border-amber-100/50 mb-5 shadow-sm">
                                            <p className="font-bold text-amber-900 text-lg">{myRecord.campaign}</p>
                                            <p className="text-amber-800 flex items-center mt-1 text-sm font-medium">
                                                <Clock className="w-4 h-4 mr-2" /> {myRecord.timeSlot}
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button 
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                                onClick={() => handleAppointmentAction("accepted")}
                                            >
                                                <Check className="w-4 h-4 mr-2" /> Accept
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                className="border-amber-300 text-amber-700 hover:bg-amber-100 bg-white"
                                                onClick={() => handleAppointmentAction("declined")}
                                            >
                                                <X className="w-4 h-4 mr-2" /> Decline
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-lg font-bold text-slate-900">Your Upcoming Tasks</h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {hasUpcomingConfirmed && myRecord?.campaign ? (
                                    <div className="px-6 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors animate-in fade-in zoom-in-95 duration-200">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900">{myRecord.campaign}</h3>
                                                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-slate-500 mt-1 gap-1 sm:gap-3">
                                                    <span className="flex items-center font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                                                        {myRecord.timeSlot}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 tracking-wide uppercase">
                                                Confirmed
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="px-6 py-12 text-center flex flex-col items-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                            <Calendar className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 font-medium">No upcoming tasks confirmed.</p>
                                        <p className="text-slate-400 text-sm mt-1">Pending admin appointment or registration review.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-white border-slate-100 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200 group">
                                        Log Volunteer Hours
                                        <span className="text-slate-300 group-hover:text-slate-500">→</span>
                                    </button>
                                    <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200 group">
                                        Browse New Events
                                        <span className="text-slate-300 group-hover:text-slate-500">→</span>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
