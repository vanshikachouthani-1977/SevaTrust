"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Plus, Edit2, Trash2, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function AdminDashboard() {
    const campaigns = [
        {
            title: "Clean Water Initiative",
            description: "Providing clean drinking water access to rural communities. This initiative aims to install water purification systems in 10 villages.",
            progress: 65,
            target: "₹500,000",
            received: "₹325,000",
            remaining: "₹175,000",
            image: "/impact_clean_water.png"
        },
        {
            title: "Digital Education Program",
            description: "Equipping schools with computers and digital learning tools to bridge the technology gap for underprivileged students.",
            progress: 44,
            target: "₹750,000",
            received: "₹480,000",
            remaining: "₹270,000",
            image: "/impact_education.png"
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900">Master Admin Dashboard</h1>
                        <p className="text-slate-600 mt-1">Manage live events and fundraising campaigns</p>
                    </div>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white" leftIcon={<Plus className="w-4 h-4" />}>
                        Create Live Event
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {campaigns.map((campaign, idx) => (
                        <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-48 w-full">
                                <Image src={campaign.image} alt={campaign.title} fill className="object-cover" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-teal-700 flex items-center shadow-sm">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Active
                                </div>
                            </div>

                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{campaign.title}</h3>
                                <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                                    {campaign.description}
                                </p>

                                <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-100">
                                    <div className="flex justify-between text-sm font-medium mb-2">
                                        <span className="text-slate-500">Progress</span>
                                        <span className="text-teal-700 font-bold">{campaign.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                                        <div
                                            className="bg-teal-600 h-2 rounded-full"
                                            style={{ width: `${campaign.progress}%` }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-xs text-slate-400 mb-1">Target</div>
                                            <div className="font-bold text-slate-700 text-sm">{campaign.target}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400 mb-1">Received</div>
                                            <div className="font-bold text-teal-600 text-sm">{campaign.received}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400 mb-1">Remaining</div>
                                            <div className="font-bold text-orange-500 text-sm">{campaign.remaining}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button variant="outline" size="sm" className="flex-1" leftIcon={<Edit2 className="w-4 h-4" />}>
                                        Edit
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-12 px-0 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 hover:border-red-200">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
