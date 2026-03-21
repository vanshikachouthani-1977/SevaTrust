"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle, XCircle, Clock, Package, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function IncomingDonations() {
    const [donations, setDonations] = useState<any[]>([]);
    const { role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && role !== "admin") {
            router.push("/admin/login");
        }
    }, [role, loading, router]);

    useEffect(() => {
        if (role !== "admin") return;
        const q = query(collection(db, "donations"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const visibleDonations = data.filter((d: any) => !d.adminDeleted);
            setDonations(visibleDonations);
        });

        return () => unsubscribe();
    }, [role]);

    if (loading || role !== "admin") return null;

    const handleAccept = async (id: string) => {
        try {
            await updateDoc(doc(db, "donations", id), { status: "accepted" });
        } catch (error) {
            console.error("Error accepting donation:", error);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await updateDoc(doc(db, "donations", id), { status: "rejected" });
        } catch (error) {
            console.error("Error rejecting donation:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to hide this donation record from the admin view? The user will still see it in their activity.")) {
            try {
                await updateDoc(doc(db, "donations", id), { adminDeleted: true });
            } catch (error) {
                console.error("Error hiding donation:", error);
                alert("Failed to hide record.");
            }
        }
    };



    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900">Incoming Donations</h1>
                        <p className="text-slate-600 mt-1">Review and accept physical item donation pledges from users.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {donations.map((donation) => (
                        <Card key={donation.id} className="overflow-hidden border border-slate-200 hover:shadow-md transition-all bg-white rounded-2xl">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                                            <div className="w-12 h-12 bg-teal-50 border border-teal-100 text-teal-600 rounded-full flex items-center justify-center shrink-0">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-1">
                                                    {donation.name || "Anonymous Donor"}
                                                </h3>
                                                <div className="text-sm font-medium text-slate-500 flex flex-wrap gap-2 items-center">
                                                    <span>{donation.email}</span> 
                                                    {donation.phone && <><span className="text-slate-300">•</span><span>{donation.phone}</span></>}
                                                    <span className="text-slate-300">•</span>
                                                    <span>Pledged on {donation.createdAt?.toDate ? donation.createdAt.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown'}</span>
                                                </div>
                                            </div>
                                            <div className="ml-auto flex flex-col md:flex-row items-end md:items-center gap-3">
                                                {donation.status === "pending" && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                        <Clock className="w-3.5 h-3.5 mr-1.5" /> Pending
                                                    </span>
                                                )}
                                                {donation.status === "accepted" && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Accepted
                                                    </span>
                                                )}
                                                {donation.status === "rejected" && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                                                        <XCircle className="w-3.5 h-3.5 mr-1.5" /> Declined
                                                    </span>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(donation.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-2"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Item Category</p>
                                                <p className="text-base font-semibold text-slate-800">{donation.category}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Quantity/Amount</p>
                                                <p className="text-base font-semibold text-slate-800">{donation.quantity}</p>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Description</p>
                                                <div className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm leading-relaxed">
                                                    {donation.description} {donation.notes && `(Notes: ${donation.notes})`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {donation.status === "pending" && (
                                        <div className="flex flex-row md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8 min-w-[160px]">
                                            <Button
                                                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                                                leftIcon={<CheckCircle className="w-4 h-4" />}
                                                onClick={() => handleAccept(donation.id)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 text-slate-600 hover:text-red-700 hover:bg-red-50 border-slate-200 bg-white"
                                                leftIcon={<XCircle className="w-4 h-4" />}
                                                onClick={() => handleReject(donation.id)}
                                            >
                                                Decline
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
