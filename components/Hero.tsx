"use client";

import { Button } from "./ui/Button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative bg-white pt-20 pb-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-100 rounded-full px-4 py-1.5 text-xs font-semibold text-teal-700 uppercase tracking-wide">
                            <span>Making a Difference Since 2010</span>
                        </div>

                        <h1 className="font-heading text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                            Together, We Build <span className="text-teal-600 block">Brighter Futures</span>
                        </h1>

                        <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                            Join thousands of compassionate individuals working to create lasting change in communities across India. Your support transforms lives.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" showArrow>
                                Get Involved
                            </Button>
                            <Button size="lg" variant="outline">
                                View Current Events
                            </Button>
                        </div>

                        <div className="pt-8 grid grid-cols-3 gap-8 border-t border-slate-100">
                            {[
                                { label: "Lives Impacted", value: "50K+" },
                                { label: "Community Events", value: "120+" },
                                { label: "Active Volunteers", value: "500+" },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="text-2xl font-bold text-teal-600">{stat.value}</div>
                                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Collage */}
                    <div className="relative">
                        {/* Decorative blob/shape behind images */}
                        <div className="absolute -top-12 -right-12 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50 z-0" />

                        <div className="relative z-10 grid grid-cols-12 gap-4">
                            {/* Main large image */}
                            <div className="col-span-8 row-span-2 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                                <Image
                                    src="/helping_elderly.png"
                                    alt="Volunteers helping elderly people"
                                    width={600}
                                    height={500}
                                    className="object-cover h-full w-full transform hover:scale-105 transition-transform duration-700"
                                />
                            </div>

                            {/* Floating stat card */}
                            <div className="col-span-4 row-span-1 flex items-center">
                                <div className="bg-white p-4 rounded-xl shadow-lg border border-teal-50 animate-bounce-slow">
                                    <div className="text-xs text-slate-500 uppercase font-semibold">Total Funds Raised</div>
                                    <div className="text-xl font-bold text-teal-600">₹2.5 Crore</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
