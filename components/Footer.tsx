"use client";

import Link from "next/link";
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer id="contact" className="bg-slate-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="flex items-center space-x-2 mb-6 group">
                            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white">
                                <Heart className="w-6 h-6 fill-current" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-heading font-bold text-2xl leading-none">
                                    UnityConnect
                                </span>
                                <span className="text-xs text-slate-400 font-medium tracking-wide">
                                    Building Stronger Communities
                                </span>
                            </div>
                        </Link>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            Empowering communities through collective action. Join us in making a difference, one life at a time.
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:text-white transition-all transform hover:-translate-y-1"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2 col-span-1">
                        <h3 className="font-heading font-semibold text-lg mb-6">Discovery</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Campaigns', path: '/#campaigns' },
                                { name: 'Donate', path: '/donate' },
                                { name: 'Impact', path: '/#impact' },
                                { name: 'About Us', path: '/about' },
                                { name: 'Contact', path: '/#contact' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.path} className="text-slate-400 hover:text-teal-400 transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-2 col-span-1">
                        <h3 className="font-heading font-semibold text-lg mb-6">Get Involved</h3>
                        <ul className="space-y-4">
                            {['Volunteer', 'Partner with Us', 'Corporate CSR', 'Events', 'Careers'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-400 hover:text-teal-400 transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Subscribe */}
                    <div className="lg:col-span-4">
                        <h3 className="font-heading font-semibold text-lg mb-6">Stay Updated</h3>
                        <p className="text-slate-400 mb-4">
                            Subscribe to our newsletter for the latest updates and impact stories.
                        </p>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="email"
                                className="block w-full pl-10 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                                placeholder="Enter your email"
                            />
                            <button className="absolute right-2 top-2 p-1.5 bg-teal-500 rounded-md text-white hover:bg-teal-600 transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>© 2026 UnityConnect. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
