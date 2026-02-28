import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Shield, Users, Heart, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RoleSelection() {
    const roles = [
        {
            title: "Admin Portal",
            description: "Manage events, track funding progress, and oversee all platform operations. Full control over campaigns and volunteer assignments.",
            icon: Shield,
            action: "Manage Platform",
            href: "/admin/dashboard",
            color: "text-teal-600",
            bg: "bg-teal-50",
            buttonVariant: "primary" as const
        },
        {
            title: "Volunteer Zone",
            description: "Register as a volunteer, view your duty dashboard, and contribute your time to meaningful causes in your community.",
            icon: Users,
            action: "Join the Team",
            href: "/volunteer/dashboard", // Direct to dashboard for demo flow
            color: "text-teal-600",
            bg: "bg-teal-50",
            buttonVariant: "primary" as const
        },
        {
            title: "Local User",
            description: "Browse active campaigns, donate physical goods like clothes and books, and stay updated on our community initiatives.",
            icon: Heart,
            action: "Support a Cause",
            href: "/donate",
            color: "text-teal-600",
            bg: "bg-teal-50",
            buttonVariant: "secondary" as const // Using orange for user action emphasis? Or stick to teal for consistency. Screenshot shows teal. Sticking to teal (primary). Actually screenshot shows teal for all.
        }
    ];

    return (
        <main className="min-h-screen font-sans bg-slate-50 flex flex-col">
            <div className="bg-white border-b border-zinc-100 py-4 px-6 md:px-12">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
            </div>

            <div className="flex-grow flex items-center justify-center py-16 px-4">
                <div className="max-w-6xl w-full">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-4">
                            Select Your Role
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">
                            How Would You Like to Help?
                        </h1>
                        <p className="text-lg text-slate-600">
                            Choose the role that best fits how you'd like to contribute to our mission
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {roles.map((role, idx) => (
                            <Card key={idx} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                                    <div className={`w-20 h-20 rounded-full ${role.bg} flex items-center justify-center mb-6`}>
                                        <role.icon className={`w-10 h-10 ${role.color}`} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{role.title}</h3>
                                    <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
                                        {role.description}
                                    </p>

                                    <Link href={role.href} className="w-full">
                                        <Button className="w-full h-12 text-base" showArrow>
                                            {role.action}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Role Descriptions Footer (from screenshot) */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-zinc-200 pt-8 text-center text-sm text-slate-500">
                        <div>
                            <Shield className="w-5 h-5 mx-auto mb-2 text-slate-400" />
                            <div className="font-semibold text-slate-700 mb-1">Admins</div>
                            <div>Create and manage campaigns, track all activities</div>
                        </div>
                        <div>
                            <Users className="w-5 h-5 mx-auto mb-2 text-slate-400" />
                            <div className="font-semibold text-slate-700 mb-1">Volunteers</div>
                            <div>Get assigned to events and track your contributions</div>
                        </div>
                        <div>
                            <Heart className="w-5 h-5 mx-auto mb-2 text-slate-400" />
                            <div className="font-semibold text-slate-700 mb-1">Local Users</div>
                            <div>Donate items and support ongoing initiatives</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
