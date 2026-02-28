"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Calendar, Clock, HandMetal, Heart, CheckCircle2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VolunteerDashboard() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>("loading");

    useEffect(() => {
        const currentRole = localStorage.getItem("role");
        const vStatus = localStorage.getItem("volunteerStatus");
        setRole(currentRole);

        if (!currentRole || (currentRole === "volunteer" && vStatus !== "registered")) {
            router.push("/volunteer/register");
        }
    }, [router]);

    if (role === "loading") return null;

    const upcomingTasks = [
        {
            title: "Community Food Distribution",
            date: "Tomorrow, 9:00 AM",
            location: "Downtown Center",
            status: "Confirmed",
            icon: HandMetal,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            title: "Park Clean-up Campaign",
            date: "Saturday, 8:00 AM",
            location: "City Park",
            status: "Pending prep",
            icon: CheckCircle2,
            color: "text-green-500",
            bg: "bg-green-50"
        }
    ];

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
                        <p className="text-slate-600">
                            Welcome back! Here's an overview of your impact and upcoming physical tasks.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center bg-teal-50 px-4 py-2 rounded-full border border-teal-100">
                        <span className="w-2 h-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
                        <span className="text-sm font-semibold text-teal-700">Active Volunteer</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-slate-500">Hours Volunteered</h3>
                                <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">42<span className="text-lg text-slate-500 font-normal ml-1">hrs</span></div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-slate-500">Events Attended</h3>
                                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">12</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-slate-500">People Impacted</h3>
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <Heart className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">~850</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-slate-500">Donations Raised</h3>
                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                    <HandMetal className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">₹12.5k</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-lg font-bold text-slate-900">Your Upcoming Tasks</h2>
                                <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">View Calendar</button>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {upcomingTasks.map((task, index) => {
                                    const Icon = task.icon;
                                    return (
                                        <div key={index} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className={`p-3 rounded-full ${task.bg} ${task.color}`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
                                                    <div className="flex flex-col sm:flex-row sm:items-center text-xs text-slate-500 mt-1 gap-1 sm:gap-3">
                                                        <span className="flex items-center">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            {task.date}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {task.location}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-white border-slate-100 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200">
                                        Log Volunteer Hours
                                    </button>
                                    <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200">
                                        Browse New Events
                                    </button>
                                    <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200">
                                        Contact Coordinator
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
