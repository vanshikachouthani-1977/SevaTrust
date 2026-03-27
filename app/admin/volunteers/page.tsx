"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { UserCheck, Clock, CheckCircle, Calendar, Eye, X, FileText, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, query, addDoc, increment } from "firebase/firestore";
import * as XLSX from "xlsx";

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
    hoursVolunteered?: number;
    eventsAttended?: number;
    totalImpactScore?: number;
    totalRatingScore?: number;
};

export default function AdminVolunteers() {
    const { role, loading } = useAuth();
    const router = useRouter();

    const [volunteers, setVolunteers] = useState<VolunteerReq[]>([]);
    const [allAppointments, setAllAppointments] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<"pending" | "accepted">("pending");
    
    // Modal states
    const [detailsModal, setDetailsModal] = useState<VolunteerReq | null>(null);
    const [appointModal, setAppointModal] = useState<VolunteerReq | null>(null);
    const [campaignInput, setCampaignInput] = useState("");
    const [timeInput, setTimeInput] = useState("");
    
    // Admin Review Modal States
    const [reviewModalObj, setReviewModalObj] = useState<any | null>(null);
    const [reviewText, setReviewText] = useState("");
    const [hoursInput, setHoursInput] = useState<number>(0);
    const [ratingInput, setRatingInput] = useState<number>(5);
    const [impactScoreInput, setImpactScoreInput] = useState<number>(10);

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

    useEffect(() => {
        if (loading || role !== "admin") return;
        
        // Listen to all appointments for the Admin globally
        const q = query(collection(db, "appointments"));
        const unsub = onSnapshot(q, (snapshot) => {
            const data: any[] = [];
            snapshot.forEach((d) => {
                data.push({ id: d.id, ...d.data() });
            });
            data.sort((a,b) => new Date(b.dateAssigned || 0).getTime() - new Date(a.dateAssigned || 0).getTime());
            setAllAppointments(data);
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
                // Update the current status on the volunteer record
                await updateDoc(doc(db, "volunteer_applications", appointModal.id), {
                    campaign: campaignInput,
                    timeSlot: timeInput,
                    appointmentStatus: "pending_acceptance"
                });

                // Create a record in the appointments collection
                await addDoc(collection(db, "appointments"), {
                    volunteerId: appointModal.id,
                    volunteerName: appointModal.fullName || "Unnamed User",
                    userId: appointModal.userId || "",
                    campaignName: campaignInput,
                    timeSlot: timeInput,
                    status: "pending_acceptance",
                    review: "",
                    hoursAttended: 0,
                    dateAssigned: new Date().toISOString()
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

    const handleReviewSubmit = async () => {
        if (!reviewModalObj || !detailsModal) return;
        try {
            // Update the appointment 
            await updateDoc(doc(db, "appointments", reviewModalObj.id), {
                status: "completed",
                review: reviewText,
                hoursAttended: Number(hoursInput) || 0,
                rating: Number(ratingInput) || 5,
                impactScore: Number(impactScoreInput) || 0
            });
            // Increment hours and events on the volunteer application record
            await updateDoc(doc(db, "volunteer_applications", detailsModal.id), {
                hoursVolunteered: increment(Number(hoursInput) || 0),
                eventsAttended: increment(1),
                totalImpactScore: increment(Number(impactScoreInput) || 0),
                totalRatingScore: increment(Number(ratingInput) || 5)
            });
            
            setReviewModalObj(null);
            setReviewText("");
            setHoursInput(0);
            setRatingInput(5);
            setImpactScoreInput(10);
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };

    const handleViewDocument = async (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const newWindow = window.open(blobUrl, '_blank');
            if (!newWindow) {
                alert("Please allow popups for this site to view the document.");
            }
        } catch (error) {
            console.error("Failed to open document:", error);
            window.open(url, '_blank'); // Fallback
        }
    };
    
    const exportToExcel = () => {
        const exportData = allAppointments.map(app => ({
            "Volunteer Name": app.volunteerName || "Unknown",
            "Campaign Name": app.campaignName || "Unknown",
            "Time Slot Logged": app.timeSlot || "N/A",
            "Status": app.status,
            "Hours Attended": app.hoursAttended || 0,
            "Performance Rating (1-5)": app.rating || "N/A",
            "Impact Score Awarded": app.impactScore || "N/A",
            "Admin Feedback": app.review || "N/A",
            "Date Logged": new Date(app.dateAssigned).toLocaleDateString()
        }));

        if (exportData.length === 0) {
            alert("No appointments available to export.");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments History");
        XLSX.writeFile(workbook, "Volunteer_Appointments_Report.xlsx");
    };

    // "pending_review" is the status set in app/volunteer/register/page.tsx
    const pendingList = volunteers.filter(v => v.status === "pending_review" || v.status === "pending");
    const acceptedList = volunteers.filter(v => v.status === "verified");

    const renderList = activeTab === "pending" ? pendingList : acceptedList;

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-16">
            <Navbar />

            <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 bg-gradient-to-r from-teal-700 to-emerald-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 tracking-tight">Volunteer Management</h1>
                        <p className="text-teal-50 text-base sm:text-lg font-medium">Review real registrations and seamlessly assign approved volunteers to upcoming campaigns.</p>
                    </div>
                    <div className="relative z-10 shrink-0">
                        <Button 
                            onClick={exportToExcel}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 text-white shadow-lg font-bold rounded-xl"
                        >
                            <Download className="w-5 h-5 mr-2" /> Export All History
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="inline-flex bg-slate-100/80 p-1.5 rounded-2xl mb-8 border border-slate-200/50 shadow-inner overflow-x-auto w-full sm:w-auto">
                    <button 
                        onClick={() => setActiveTab("pending")}
                        className={`px-6 py-2.5 text-sm font-bold whitespace-nowrap rounded-xl transition-all duration-300 ${activeTab === "pending" ? "bg-white text-teal-700 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Pending Validations ({pendingList.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab("accepted")}
                        className={`px-6 py-2.5 text-sm font-bold whitespace-nowrap rounded-xl transition-all duration-300 ${activeTab === "accepted" ? "bg-white text-teal-700 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Accepted Volunteers ({acceptedList.length})
                    </button>
                </div>

                <div className="space-y-4">
                    {renderList.length === 0 && (
                        <div className="text-center py-16 text-slate-500 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-8 ring-white">
                                <FileText className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="font-bold text-slate-700 text-xl">No {activeTab === "pending" ? "Pending" : "Accepted"} Volunteers Found</p>
                            <p className="text-sm mt-2 max-w-xs mx-auto text-slate-500">Wait for a real volunteer to complete their registration.</p>
                        </div>
                    )}
                    {renderList.map((volunteer) => (
                        <Card key={volunteer.id} className="overflow-hidden bg-white border-0 shadow-sm ring-1 ring-slate-100 rounded-2xl hover:shadow-md transition-all duration-300 group">
                            <CardContent className="p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Left: Avatar + Info */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-50 text-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <UserCheck className="w-6 h-6" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base font-bold text-slate-900 truncate">{volunteer.fullName || "Unnamed User"}</h3>
                                            <div className="text-sm text-slate-500 font-medium truncate">{volunteer.email} • {volunteer.phone}</div>
                                            {activeTab === "accepted" && volunteer.campaign && (
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <span className="text-xs font-semibold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg border border-teal-100">
                                                        Assigned: {volunteer.campaign}
                                                    </span>
                                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg border ${volunteer.appointmentStatus === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                        {volunteer.appointmentStatus?.replace("_", " ") || "unknown"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Action Buttons */}
                                    <div className="flex items-center gap-2 flex-shrink-0 sm:ml-4">
                                        <Button variant="outline" size="sm" className="rounded-xl border-slate-200 hover:bg-slate-50 font-semibold transition-colors text-sm" onClick={() => setDetailsModal(volunteer)}>
                                            <Eye className="w-4 h-4 mr-1.5" /> Details & History
                                        </Button>
                                        
                                        {activeTab === "pending" && (
                                            <>
                                                <Button size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all font-semibold text-sm" onClick={() => handleVerify(volunteer.id)}>
                                                    <CheckCircle className="w-4 h-4 mr-1.5" /> Verify
                                                </Button>
                                                <Button size="sm" className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all font-semibold text-sm" onClick={() => handleReject(volunteer.id)}>
                                                    <X className="w-4 h-4 mr-1.5" /> Reject
                                                </Button>
                                            </>
                                        )}
                                        
                                        {activeTab === "accepted" && (
                                            <Button size="sm" className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all font-semibold text-sm" onClick={() => setAppointModal(volunteer)}>
                                                <Calendar className="w-4 h-4 mr-1.5" /> Appoint
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Details Modal */}
            {detailsModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
                    <div className="bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-right duration-300">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
                            <div>
                                <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">Volunteer Details</h3>
                                <p className="text-sm font-medium text-slate-500 mt-1">Review applicant and past performance</p>
                            </div>
                            <button onClick={() => setDetailsModal(null)} className="text-slate-400 hover:text-slate-600 bg-white p-2 border border-slate-200 rounded-full transition-colors shadow-sm">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            
                            {/* Profile Info */}
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                    <div className="col-span-2 sm:col-span-1">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</div>
                                        <div className="text-slate-900 font-bold">{detailsModal.fullName || "N/A"}</div>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number</div>
                                        <div className="text-slate-900 font-bold">{detailsModal.phone || "N/A"}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</div>
                                        <div className="text-slate-900 font-medium">{detailsModal.email || "N/A"}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Interest Area</div>
                                        <div className="text-slate-900 font-medium">{detailsModal.interest || "N/A"}</div>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Days Available</div>
                                        <div className="text-slate-900 font-medium">{detailsModal.availableDays ? detailsModal.availableDays.join(", ") : "N/A"}</div>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Hours / Month</div>
                                        <div className="text-slate-900 font-medium">{detailsModal.hoursPerMonth || "N/A"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Aggregated Stats (if existing) */}
                            {detailsModal.status === "verified" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex flex-col items-center justify-center text-center">
                                        <span className="text-3xl font-extrabold text-emerald-700">{detailsModal.hoursVolunteered || 0}</span>
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1">Total Hours</span>
                                    </div>
                                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex flex-col items-center justify-center text-center">
                                        <span className="text-3xl font-extrabold text-indigo-700">{detailsModal.eventsAttended || 0}</span>
                                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1">Events Done</span>
                                    </div>
                                </div>
                            )}

                            {/* Assignment History using Appointments Collection */}
                            {detailsModal.status === "verified" && (
                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    <h4 className="font-extrabold text-slate-900 mb-4 flex items-center">
                                        <FileText className="w-5 h-5 mr-2 text-slate-400" /> Assignment History
                                    </h4>
                                    <div className="space-y-4">
                                        {allAppointments.filter(a => a.volunteerId === detailsModal.id).length > 0 ? (
                                            allAppointments.filter(a => a.volunteerId === detailsModal.id).map(appt => (
                                                <div key={appt.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                                    {appt.status === "completed" && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>}
                                                    {appt.status === "pending_acceptance" && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>}
                                                    {appt.status === "accepted" && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>}
                                                    
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="font-bold text-slate-800">{appt.campaignName}</div>
                                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                                                            appt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                            appt.status === 'accepted' ? 'bg-indigo-100 text-indigo-700' :
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {appt.status.replace("_", " ")}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 flex items-center mb-3">
                                                        <Clock className="w-3.5 h-3.5 mr-1.5" /> {appt.timeSlot}
                                                    </div>
                                                    {appt.status === "completed" && (
                                                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 shadow-sm px-2 py-1 rounded">
                                                                    {appt.hoursAttended} hours logged
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-slate-600 italic">"Admin Review: {appt.review || "No review left."}"</p>
                                                        </div>
                                                    )}
                                                    {appt.status === "accepted" && (
                                                        <div className="mt-3">
                                                            <Button 
                                                                size="sm" 
                                                                className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-sm font-semibold rounded-lg text-xs"
                                                                onClick={() => setReviewModalObj(appt)}
                                                            >
                                                                <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Log Hours & Review Volunteer
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 text-sm">
                                                No assignments historically recorded for this volunteer.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Documents */}
                            {(detailsModal.photoUrl || detailsModal.aadhaarUrl) && (
                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    <h4 className="font-extrabold text-slate-900 mb-4 flex items-center">
                                        <UserCheck className="w-5 h-5 mr-2 text-slate-400" /> Identity Documents
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {detailsModal.photoUrl && (
                                            <div>
                                                <div className="text-slate-700 text-sm font-semibold mb-2">Passport Photo</div>
                                                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square flex items-center justify-center shadow-sm relative group">
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-0 group-hover:bg-slate-100 transition-colors">
                                                        <UserCheck className="w-8 h-8 text-slate-300 mb-2" />
                                                        <span className="text-xs text-slate-400 font-medium">Image File</span>
                                                    </div>
                                                    <img src={detailsModal.photoUrl} alt="Volunteer Photo" className="w-full h-full object-cover absolute inset-0 z-10 transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.style.opacity = '0'; }} />
                                                    <div className="absolute inset-0 z-20 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button onClick={(e) => handleViewDocument(e, detailsModal.photoUrl!)} className="text-xs text-white font-bold bg-white/20 hover:bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full transition-colors shadow-lg">
                                                            View Full Size
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {detailsModal.aadhaarUrl && (
                                            <div>
                                                <div className="text-slate-700 text-sm font-semibold mb-2">Aadhaar Card</div>
                                                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center shadow-sm relative group">
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-0 group-hover:bg-slate-100 transition-colors">
                                                        <FileText className="w-8 h-8 text-slate-300 mb-2" />
                                                        <span className="text-xs text-slate-400 font-medium">Document File</span>
                                                    </div>
                                                    <img src={detailsModal.aadhaarUrl} alt="Aadhaar Document" className="w-full h-full object-contain bg-white/50 absolute inset-0 z-10" onError={(e) => { e.currentTarget.style.opacity = '0'; }} />
                                                    <div className="absolute inset-0 z-20 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button onClick={(e) => handleViewDocument(e, detailsModal.aadhaarUrl!)} className="text-xs text-white font-bold bg-white/20 hover:bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full transition-colors shadow-lg">
                                                            Open File
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 sticky bottom-0">
                            
                            {(detailsModal.status === "pending" || detailsModal.status === "pending_review") ? (
                                <>
                                    <Button className="bg-red-600 hover:bg-red-700 text-white shadow-sm flex-1 font-bold" onClick={() => handleReject(detailsModal.id)}>Reject Registration</Button>
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex-1 font-bold" onClick={() => handleVerify(detailsModal.id)}>Approve Volunteer</Button>
                                </>
                            ) : (
                                <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white shadow-sm font-bold" onClick={() => setDetailsModal(null)}>Close View</Button>
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
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Campaign Name</label>
                                <input 
                                    type="text"
                                    className="w-full border-slate-300 rounded-lg shadow-sm border p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 placeholder:text-slate-400"
                                    placeholder="e.g. Clean Water Initiative"
                                    value={campaignInput}
                                    onChange={e => setCampaignInput(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Time & Date Slot</label>
                                <input 
                                    type="text" 
                                    className="w-full border-slate-300 rounded-lg shadow-sm border p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 placeholder:text-slate-400"
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

            {/* Admin Review Modal */}
            {reviewModalObj && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-teal-100 flex justify-between items-center bg-teal-50">
                            <h3 className="font-bold text-teal-900 text-lg flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2" /> Log Hours & Review
                            </h3>
                            <button onClick={() => setReviewModalObj(null)} className="text-teal-400 hover:text-teal-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="bg-teal-50 p-3 flex rounded-lg mb-2 border border-teal-100">
                                <p className="text-sm text-teal-800">
                                    Reviewing <strong className="font-extrabold">{detailsModal?.fullName}</strong> for <strong className="font-extrabold">{reviewModalObj.campaignName}</strong>.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Hours Volunteered (Numbers only)</label>
                                <input 
                                    type="number"
                                    min="0"
                                    className="w-full border-slate-300 rounded-lg shadow-sm border p-3 text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 bg-white"
                                    placeholder="e.g. 4"
                                    value={hoursInput || ""}
                                    onChange={e => setHoursInput(parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Performance Rating (1-5)</label>
                                    <input 
                                        type="number"
                                        min="1" max="5"
                                        className="w-full border-slate-300 rounded-lg shadow-sm border p-3 text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 bg-white"
                                        placeholder="e.g. 5"
                                        value={ratingInput || ""}
                                        onChange={e => setRatingInput(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Impact Points Awarded</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        className="w-full border-slate-300 rounded-lg shadow-sm border p-3 text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 bg-white"
                                        placeholder="e.g. 10"
                                        value={impactScoreInput || ""}
                                        onChange={e => setImpactScoreInput(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Feedback / Review Note</label>
                                <textarea 
                                    className="w-full border-slate-300 rounded-lg shadow-sm border p-3 text-sm focus:ring-teal-500 focus:border-teal-500 bg-white text-slate-900 min-h-[100px]"
                                    placeholder="Notes on volunteer performance, conduct, or general feedback..."
                                    value={reviewText}
                                    onChange={e => setReviewText(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                            <Button variant="outline" onClick={() => setReviewModalObj(null)}>Cancel</Button>
                            <Button 
                                className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm" 
                                onClick={handleReviewSubmit}
                                disabled={!hoursInput || !reviewText.trim()}
                            >
                                Submit & Complete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
