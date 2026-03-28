"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Calendar, Clock, HandMetal, Heart, CheckCircle2, ArrowLeft, AlertCircle, Check, X, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc, increment } from "firebase/firestore";

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
    hoursVolunteered?: number;
    eventsAttended?: number;
    totalImpactScore?: number;
    totalRatingScore?: number;
};

type Appointment = {
    id: string;
    volunteerId: string;
    volunteerName: string;
    userId: string;
    campaignName: string;
    timeSlot: string;
    status: "pending_acceptance" | "accepted" | "declined" | "completed";
    review: string;
    hoursAttended: number;
    dateAssigned: string;
};

export default function VolunteerDashboard() {
    const router = useRouter();
    const { user, role, loading } = useAuth();
    
    const [myRecord, setMyRecord] = useState<VolunteerReq | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        const checkStatus = async () => {
            if (loading) return;
            
            if (!role) {
                router.push("/login");
            } else if (role !== "volunteer") {
                router.push("/");
            } else if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists() && userDoc.data().volunteerStatus !== "registered") {
                        router.push("/volunteer/register");
                    }
                } catch (error) {
                    console.error("Error checking volunteer status:", error);
                }
            }
        };
        checkStatus();
    }, [user, role, loading, router]);

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

    useEffect(() => {
        if (loading || !user || role !== "volunteer") return;
        
        // Correctly fetch appointments
        const q = query(collection(db, "appointments"), where("userId", "==", user.uid));
        const unsub = onSnapshot(q, (snapshot) => {
            const data: Appointment[] = [];
            snapshot.forEach((d) => {
                data.push({ id: d.id, ...d.data() } as Appointment);
            });
            // Sort by assigned date descending (newest first)
            data.sort((a, b) => new Date(b.dateAssigned || 0).getTime() - new Date(a.dateAssigned || 0).getTime());
            setAppointments(data);
        });
        
        return () => unsub();
    }, [user, role, loading]);

    const handleApptStatus = async (id: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, "appointments", id), { status: newStatus });
            
            // Also update the fallback status on user record to avoid inconsistency with old logic
            if (myRecord) {
                await updateDoc(doc(db, "volunteer_applications", myRecord.id), {
                    appointmentStatus: newStatus
                });
            }
        } catch (error) {
            console.error("Error updating appointment status:", error);
        }
    };

    if (loading || !role) return null;

    const averageRating = myRecord?.eventsAttended && myRecord.eventsAttended > 0 && myRecord.totalRatingScore
        ? (myRecord.totalRatingScore / myRecord.eventsAttended).toFixed(1) 
        : "0.0";

    const stats = [
        { label: "Hours Volunteered", value: `${myRecord?.hoursVolunteered || 0} hrs`, icon: Clock, color: "text-teal-600", bg: "bg-teal-50" },
        { label: "Events Attended", value: `${myRecord?.eventsAttended || 0}`, icon: Calendar, color: "text-orange-600", bg: "bg-orange-50" },
        { label: "Impact Points", value: `${myRecord?.totalImpactScore || 0}`, icon: Heart, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Avg. Admin Rating", value: `${averageRating} ★`, icon: Star, color: "text-indigo-600", bg: "bg-indigo-50" }
    ];

    const pendingApps = appointments.filter(a => a.status === "pending_acceptance");
    const activeApps = appointments.filter(a => a.status === "accepted");
    const pastApps = appointments.filter(a => a.status === "completed" || a.status === "declined");

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-16">
            <Navbar />

            <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
                
                <div className="mb-10 bg-gradient-to-r from-teal-600 to-emerald-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full translate-y-1/3 -translate-x-1/4 blur-xl"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 tracking-tight">Volunteer Dashboard</h1>
                        <p className="text-teal-50 text-base sm:text-lg max-w-2xl font-medium">
                            Welcome back, {myRecord?.fullName || user?.email}! Here's your impact overview.
                        </p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <Card key={i} className="bg-white border-0 shadow-sm ring-1 ring-slate-100 rounded-2xl overflow-hidden transition-all duration-300 group relative">
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase leading-tight pr-2">{s.label}</h3>
                                        <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-extrabold tracking-tight text-slate-900">{s.value}</div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="space-y-8">
                    
                    {/* Pending Requests */}
                    {pendingApps.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                                <AlertCircle className="w-6 h-6 mr-2 text-amber-500" /> Action Required: New Assignments
                            </h2>
                            {pendingApps.map(appt => (
                                <div key={appt.id} className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
                                    <div className="flex flex-col sm:flex-row gap-5 items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-amber-800 text-sm mb-2 font-medium">The admin has requested you for a campaign.</p>
                                            <div className="bg-white/80 p-5 rounded-xl border border-amber-100/50 mb-4 shadow-sm backdrop-blur-sm">
                                                <p className="font-extrabold text-amber-900 text-xl">{appt.campaignName}</p>
                                                <p className="text-amber-700 flex items-center mt-2 text-sm font-semibold">
                                                    <Clock className="w-4 h-4 mr-2" /> {appt.timeSlot}
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <Button 
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                                                    onClick={() => handleApptStatus(appt.id, "accepted")}
                                                >
                                                    <Check className="w-5 h-5 mr-2" /> Accept
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    className="border-amber-300 text-amber-800 hover:bg-amber-100 bg-white/50 backdrop-blur-sm transition-colors"
                                                    onClick={() => handleApptStatus(appt.id, "declined")}
                                                >
                                                    <X className="w-5 h-5 mr-2" /> Decline
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upcoming Assignments */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-6 border-b border-slate-100 flex items-center bg-white">
                            <div className="w-2 h-6 bg-teal-500 rounded-full mr-3"></div>
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Your Upcoming & Active Tasks</h2>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {activeApps.length > 0 ? (
                                activeApps.map(appt => (
                                    <div key={appt.id} className="p-6 flex flex-col md:flex-row gap-4 justify-between hover:bg-slate-50/80 transition-colors group">
                                        <div className="flex items-start space-x-5">
                                            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 shadow-sm ring-1 ring-emerald-200/50 group-hover:scale-110 transition-transform duration-300">
                                                <CheckCircle2 className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{appt.campaignName}</h3>
                                                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-slate-500 mt-2 gap-2">
                                                    <span className="flex items-center font-medium bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-md text-slate-600 shadow-sm">
                                                        <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
                                                        {appt.timeSlot}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:items-end gap-3 mt-4 md:mt-0">
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 tracking-wider uppercase shadow-sm ring-1 ring-emerald-200/60 w-fit">
                                                Confirmed & Active
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-6 py-16 text-center flex flex-col items-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-white shadow-sm">
                                        <Calendar className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <p className="text-slate-600 font-bold text-lg">No upcoming tasks confirmed.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Past History */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner opacity-80">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-100/50">
                            <h2 className="text-lg font-bold text-slate-600 flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-slate-400" /> Past Appointments & History
                            </h2>
                        </div>
                        <div className="divide-y divide-slate-200/60">
                            {pastApps.length > 0 ? (
                                pastApps.map(appt => (
                                    <div key={appt.id} className="p-5 flex flex-col sm:flex-row justify-between hover:bg-slate-100/50 transition-colors">
                                        <div className="mb-2 sm:mb-0">
                                            <h3 className="text-base font-bold text-slate-700">{appt.campaignName}</h3>
                                            <p className="text-sm text-slate-500 mt-1">{appt.timeSlot}</p>
                                            {appt.status === "completed" && (
                                                <p className="text-sm text-slate-500 mt-2 bg-slate-100 p-2 rounded-lg border border-slate-200 italic">"{appt.review}"</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-start sm:items-end">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 ${appt.status === "completed" ? "bg-slate-200 text-slate-600" : "bg-red-50 text-red-600"}`}>
                                                {appt.status}
                                            </span>
                                            {appt.status === "completed" && (
                                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                                    +{appt.hoursAttended} hours logged
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-6 py-8 text-center text-slate-400 text-sm">No historical appointments found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
