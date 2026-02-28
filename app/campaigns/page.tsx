"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function CampaignsPage() {
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
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 text-xs font-semibold text-teal-700 uppercase tracking-wide bg-teal-50 border border-teal-100 rounded-full">
                        Our Campaigns
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-6">Current Events</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Explore our active campaigns and find ways to get involved. Every contribution makes a difference.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        {
                            title: "Clean Water Initiative",
                            desc: "Providing clean drinking water access to rural communities. This initiative aims to install water purification systems in 10 villages.",
                            raised: "₹325,000",
                            goal: "₹500,000",
                            progress: 65,
                            image: "/impact_clean_water.png"
                        },
                        {
                            title: "Digital Education Program",
                            desc: "Equipping schools with computers and digital learning tools to bridge the technology gap for underprivileged students.",
                            raised: "₹480,000",
                            goal: "₹750,000",
                            progress: 44,
                            image: "/impact_education.png"
                        }
                    ].map((campaign, idx) => (
                        <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
                            <div className="relative h-64 w-full">
                                <Image src={campaign.image} alt={campaign.title} fill className="object-cover" />
                                <div className="absolute top-4 right-4 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded shadow-sm">
                                    Active
                                </div>
                            </div>
                            <CardContent className="p-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{campaign.title}</h3>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    {campaign.desc}
                                </p>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <span className="text-slate-500">Funding Progress</span>
                                        <span className="text-teal-700 font-bold">{campaign.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3">
                                        <div
                                            className="bg-teal-600 h-3 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${campaign.progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-end pt-2">
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">Goal</div>
                                            <div className="font-bold text-slate-700">{campaign.goal}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-teal-600 mb-1">Raised</div>
                                            <div className="font-bold text-teal-600 text-lg">{campaign.raised}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <Button fullWidth size="lg">Support This Cause</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
