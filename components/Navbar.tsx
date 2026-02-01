"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Campaigns", href: "/campaigns" },
    { name: "Donate", href: "/donate" },
    { name: "Impact", href: "/impact" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-zinc-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white">
                            <Heart className="w-6 h-6 fill-current" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-heading font-bold text-xl text-slate-800 leading-tight group-hover:text-teal-600 transition-colors">
                                UnityConnect
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                Building Stronger Communities
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-teal-600 ${pathname === link.href ? "text-teal-600" : "text-slate-600"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="h-6 w-px bg-zinc-200 mx-2" />

                        <div className="flex items-center space-x-3">
                            <Link
                                href="/public"
                                className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-full hover:bg-teal-100 transition-colors"
                            >
                                Public
                            </Link>
                            <Link
                                href="/admin"
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
                            >
                                Admin
                            </Link>
                            <Link
                                href="/volunteer"
                                className="px-5 py-2 text-sm font-medium text-white bg-teal-500 rounded-full hover:bg-teal-600 transition-colors shadow-sm hover:shadow-md"
                            >
                                Volunteer
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:text-teal-600 focus:outline-none"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-zinc-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-md"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-zinc-100 my-4" />
                            <div className="grid grid-cols-2 gap-3 px-2">
                                <Link
                                    href="/public"
                                    className="flex justify-center px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-md"
                                >
                                    Public
                                </Link>
                                <Link
                                    href="/admin"
                                    className="flex justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 rounded-md"
                                >
                                    Admin
                                </Link>
                                <Link
                                    href="/volunteer"
                                    className="col-span-2 flex justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md shadow-sm"
                                >
                                    Volunteer
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
