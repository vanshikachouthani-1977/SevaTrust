"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Phone, Mail, MapPin, Clock, ArrowLeft } from "lucide-react";

export default function Contact() {
    return (
        <main className="min-h-screen bg-white font-sans">
            <Navbar />

            <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Get in Touch</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="rounded-xl border border-orange-200 p-8 flex flex-col items-start hover:shadow-lg transition-shadow bg-orange-50/50">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-6">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Phone</h3>
                        <p className="text-slate-500 mb-4 text-sm">Mon-Fri from 9am to 6pm</p>
                        <p className="text-orange-600 font-bold text-lg">+91 98765 43210</p>
                    </div>

                    <div className="rounded-xl border border-orange-200 p-8 flex flex-col items-start hover:shadow-lg transition-shadow bg-orange-50/50">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-6">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Email</h3>
                        <p className="text-slate-500 mb-4 text-sm">We'll respond within 24 hours</p>
                        <p className="text-orange-600 font-bold text-lg">contact@ngo.org</p>
                    </div>

                    <div className="rounded-xl border border-orange-200 p-8 flex flex-col items-start hover:shadow-lg transition-shadow bg-orange-50/50">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-6">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Office</h3>
                        <p className="text-slate-500 mb-4 text-sm">Visit us in person</p>
                        <div className="text-slate-700">
                            123 Service Street<br />
                            Mumbai, Maharashtra<br />
                            India - 400001
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Inquiry Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-zinc-200 p-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Send us a Message</h2>
                            <p className="text-slate-600 mb-8 text-sm">Fill out the form below and our team will get back to you</p>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Your Name</label>
                                        <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                                        <input type="text" placeholder="+91 98765 43210" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                    <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Subject</label>
                                    <input type="text" placeholder="How can we help you?" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Message</label>
                                    <textarea rows={4} placeholder="Tell us about your inquiry..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>

                                <Button size="lg" className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl border border-zinc-200 p-8">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-6">Office Hours</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Monday - Friday</span>
                                    <span className="font-semibold text-slate-900">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-50 pt-3">
                                    <span className="text-slate-600">Saturday</span>
                                    <span className="font-semibold text-slate-900">10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-50 pt-3">
                                    <span className="text-slate-600">Sunday</span>
                                    <span className="font-semibold text-slate-400">Closed</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-orange-50 rounded-xl border border-orange-100 p-8">
                            <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
                            <div className="space-y-3 text-sm">
                                <a href="#" className="flex items-center text-orange-700 hover:underline">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Volunteer Inquiries: volunteer@ngo.org
                                </a>
                                <a href="#" className="flex items-center text-orange-700 hover:underline">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Corporate Partnerships: partnerships@ngo.org
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
