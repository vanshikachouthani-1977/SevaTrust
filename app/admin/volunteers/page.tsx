"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { UserCheck, Clock, CheckCircle, Calendar, Eye, X, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, query } from "firebase/firestore";

export type VolunteerReq = {
    id: string;
    fullName?: string;
    email?: string;
    phone?: string;
    interest?: string;
    availableDays?: string[];
    hoursPerMonth?: string;
    status: string; // "pending_review" | "verified" | "rejected"
    campaign?: string | null;
    timeSlot?: string | null;
    appointmentStatus?: "none" | "pending_acceptance" | "accepted" | "declined";
    userId?: string;
    aadhaarUrl?: string;
    photoUrl?: string;
};

export default function AdminVolunteers() {
    const { role, loading } = useAuth();
    const router = useRouter();

    const [volunteers, setVolunteers] = useState<VolunteerReq[]>([]);
    const [activeTab, setActiveTab] = useState<"pending" | "accepted">("pending");
    
    // Modal states
    const [detailsModal, setDetailsModal] = useState<VolunteerReq | null>(null);
    const [appointModal, setAppointModal] = useState<VolunteerReq | null>(null);
    const [campaignInput, setCampaignInput] = useState("");
    const [timeInput, setTimeInput] = useState("");

    const activeCampaigns = ["Clean Water Initiative", "Digital Education Program", "Food Drive"];

    useEffect(() => {
        if (!loading && role !== "admin") {
            router.push("/admin/login");
        }
    }, [role, loading, router]);

    useEffect(() => {
        if (loading || role !== "admin") return;
        
        // Listen to actual Firestore collection created during volunteer registration
        const q = query(collection(db, "volunteer_applications"));
        const unsub = onSnapshot(q, (snapshot) => {
            const data: VolunteerReq[] = [];
            snapshot.forEach((d) => {
                data.push({ id: d.id, ...d.data() } as VolunteerReq);
            });
            setVolunteers(data);
        });
        
        return () => unsub();
    }, [role, loading]);

    if (loading || role !== "admin") return null;

    const handleVerify = async (id: string) => {
        try {
            await updateDoc(doc(db, "volunteer_applications", id), { status: "verified" });
            setDetailsModal(null);
        } catch (e) {
            console.error("Error verifying:", e);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await updateDoc(doc(db, "volunteer_applications", id), { status: "rejected" });
            setDetailsModal(null);
        } catch (e) {
            console.error("Error rejecting:", e);
        }
    };

    const handleAppoint = async () => {
        if (appointModal && campaignInput && timeInput) {
            try {
                await updateDoc(doc(db, "volunteer_applications", appointModal.id), {
                    campaign: campaignInput,
                    timeSlot: timeInput,
                    appointmentStatus: "pending_acceptance"
                });
                setAppointModal(null);
                setCampaignInput("");
                setTimeInput("");
                alert(`Appointed ${appointModal.fullName} to ${campaignInput}! They will see this request in their dashboard.`);
            } catch (e) {
                console.error("Error appointing:", e);
            }
        }
    };

    // "pending_review" is the status set in app/volunteer/register/page.tsx
    const pendingList = volunteers.filter(v => v.status === "pending_review" || v.status === "pending");
    const acceptedList = volunteers.filter(v => v.status === "verified");

    const renderList = activeTab === "pending" ? pendingList : acceptedList;

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-slate-900">Volunteer Management</h1>
                    <p className="text-slate-600 mt-1">Review real registrations and assign volunteers to campaigns.</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6 border-b border-slate-200">
                    <button 
                        onClick={() => setActiveTab("pending")}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "pending" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                    >
                        Pending Validations ({pendingList.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab("accepted")}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "accepted" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                    >
                        Accepted Volunteers ({acceptedList.length})
                    </button>
                </div>

                <div className="space-y-4">
                    {renderList.length === 0 && (
                        <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <p className="font-medium text-slate-600 text-lg">No {activeTab === "pending" ? "Pending" : "Accepted"} Volunteers Found</p>
                            <p className="text-sm mt-1">Wait for a real volunteer to complete their registration.</p>
                        </div>
                    )}
                    {renderList.map((volunteer) => (
                        <Card key={volunteer.id} className="overflow-hidden border border-slate-200 hover:shadow-md transition-shadow">
                            <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                                        <UserCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{volunteer.fullName || "Unnamed User"}</h3>
                                        <div className="text-sm text-slate-500">{volunteer.email} • {volunteer.phone}</div>
                                        {activeTab === "accepted" && volunteer.campaign && (
                                            <div className="mt-1 text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded inline-block border border-slate-200">
                                                Assigned: {volunteer.campaign} ({volunteer.appointmentStatus?.replace("_", " ") || "unknown"})
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto self-end sm:self-center shrink-0">
                                    <Button variant="outline" size="sm" onClick={() => setDetailsModal(volunteer)}>
                                        <Eye className="w-4 h-4 mr-2" /> Details
                                    </Button>
                                    
                                    {activeTab === "pending" && (
                                        <>
                                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" onClick={() => handleVerify(volunteer.id)}>
                                                Verify
                                            </Button>
                                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white shadow-sm" onClick={() => handleReject(volunteer.id)}>
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    
                                    {activeTab === "accepted" && (
                                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" onClick={() => setAppointModal(volunteer)}>
                                            <Calendar className="w-4 h-4 mr-2" /> Appoint
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Footer />

            {/* Details Modal */}
            {detailsModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-900 text-lg">Volunteer Registration Details</h3>
                            <button onClick={() => setDetailsModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</div>
                                <div className="text-slate-900 font-medium">{detailsModal.fullName || "N/A"}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</div>
                                    <div className="text-slate-900 font-medium break-all">{detailsModal.email || "N/A"}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</div>
                                    <div className="text-slate-900 font-medium">{detailsModal.phone || "N/A"}</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Interest Area</div>
                                <div className="text-slate-900 font-medium">{detailsModal.interest || "N/A"}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Days Available</div>
                                    <div className="text-slate-900 font-medium">{detailsModal.availableDays ? detailsModal.availableDays.join(", ") : "N/A"}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Hours / Month</div>
                                    <div className="text-slate-900 font-medium">{detailsModal.hoursPerMonth || "N/A"}</div>
                                </div>
                            </div>

                            {(detailsModal.photoUrl || detailsModal.aadhaarUrl) && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Uploaded Documents</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {detailsModal.photoUrl && (
                                            <div>
                                                <div className="text-slate-700 text-sm font-medium mb-2">Passport Photo</div>
                                                <div className="rounded-lg overflow-hidden border border-slate-200 bg-white aspect-square flex items-center justify-center p-1 shadow-sm">
                                                    <img src={detailsModal.photoUrl} alt="Volunteer Photo" className="w-full h-full object-cover rounded-md" />
                                                </div>
                                            </div>
                                        )}
                                        {detailsModal.aadhaarUrl && (
                                            <div>
                                                <div className="text-slate-700 text-sm font-medium mb-2">Aadhaar Card</div>
                                                <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center p-1 shadow-sm relative group">
                                                    <img src={detailsModal.aadhaarUrl} alt="Aadhaar Document" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                        <a href={detailsModal.aadhaarUrl} target="_blank" rel="noreferrer" className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:bg-slate-50">
                                                            View Full Document
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-center sm:hidden">
                                                    <a href={detailsModal.aadhaarUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 font-medium underline">Open Aadhaar PDF/Image</a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {detailsModal.status === "verified" && detailsModal.campaign && (
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-4 shadow-sm">
                                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Current Campaign Assignment</div>
                                    <div className="text-indigo-900 font-semibold text-base">{detailsModal.campaign}</div>
                                    <div className="text-indigo-800 text-sm mt-1 flex items-center"><Clock className="w-3 h-3 mr-1" /> {detailsModal.timeSlot}</div>
                                    <div className="mt-2 text-xs font-medium text-white px-2 py-1 bg-indigo-500 inline-block rounded uppercase tracking-wider text-[10px]">
                                        Response: {detailsModal.appointmentStatus?.replace("_", " ") || "None"}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                            <Button variant="outline" onClick={() => setDetailsModal(null)}>Close</Button>
                            {(detailsModal.status === "pending" || detailsModal.status === "pending_review") && (
                                <>
                                    <Button className="bg-red-600 hover:bg-red-700 text-white shadow-sm" onClick={() => handleReject(detailsModal.id)}>Reject</Button>
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" onClick={() => handleVerify(detailsModal.id)}>Verify</Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Appoint Modal */}
            {appointModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-indigo-100 flex justify-between items-center bg-indigo-50">
                            <h3 className="font-bold text-indigo-900 text-lg flex items-center">
                                <Calendar className="w-5 h-5 mr-2" /> Appoint to Campaign
                            </h3>
                            <button onClick={() => setAppointModal(null)} className="text-indigo-400 hover:text-indigo-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                Assigning <strong className="text-slate-900">{appointModal.fullName}</strong> to an upcoming campaign. They will receive a request to accept or decline in their dashboard.
                            </p>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Campaign</label>
                                <select 
                                    className="w-full border-slate-300 rounded-lg shadow-sm border p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    value={campaignInput}
                                    onChange={e => setCampaignInput(e.target.value)}
                                >
                                    <option value="">-- Choose Campaign --</option>
                                    {activeCampaigns.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Time & Date Slot</label>
                                <input 
                                    type="text" 
                                    className="w-full border-slate-300 rounded-lg shadow-sm border p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. Oct 24, 10:00 AM - 2:00 PM"
                                    value={timeInput}
                                    onChange={e => setTimeInput(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                            <Button variant="outline" onClick={() => setAppointModal(null)}>Cancel</Button>
                            <Button 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" 
                                onClick={handleAppoint}
                                disabled={!campaignInput || !timeInput}
                            >
                                Send Request
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
