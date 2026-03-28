"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

import { useAuth } from "@/lib/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CampaignsPage() {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !role) {
            router.push("/login");
        }
    }, [role, loading, router]);

    const [campaigns, setCampaigns] = useState<any[]>([]);

    const [newCampaign, setNewCampaign] = useState({
        title: "",
        desc: "",
        raised: "",
        goal: "",
        image: ""
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const q = query(collection(db, "campaigns"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCampaigns(data);
        });
        return () => unsubscribe();
    }, []);

    const handleAddCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const raisedNum = Number(newCampaign.raised.replace(/[^0-9.-]+/g, ""));
            const goalNum = Number(newCampaign.goal.replace(/[^0-9.-]+/g, ""));
            const progress = goalNum > 0 ? Math.min(Math.round((raisedNum / goalNum) * 100), 100) : 0;

            let imageUrl = newCampaign.image;
            if (imageFile) {
                // Bypass Firebase Storage to avoid hanging if the storage bucket isn't fully initialized.
                // Convert to compressed base64 for Firestore instead.
                imageUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new window.Image();
                        img.onload = () => {
                            const canvas = document.createElement("canvas");
                            const MAX_WIDTH = 800;
                            let width = img.width;
                            let height = img.height;
                            
                            if (width > MAX_WIDTH) {
                                height = Math.round(height * (MAX_WIDTH / width));
                                width = MAX_WIDTH;
                            }
                            canvas.width = width;
                            canvas.height = height;
                            
                            const ctx = canvas.getContext("2d");
                            ctx?.drawImage(img, 0, 0, width, height);
                            // Compress as JPEG
                            resolve(canvas.toDataURL("image/jpeg", 0.7));
                        };
                        img.onerror = reject;
                        if (event.target?.result) {
                            img.src = event.target.result as string;
                        }
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(imageFile);
                });
            } else if (!editingId && !imageUrl) {
                alert("Please select an image");
                setIsSubmitting(false);
                return;
            }

            const finalCampaign = {
                title: newCampaign.title,
                desc: newCampaign.desc,
                progress,
                raised: newCampaign.raised.startsWith("₹") ? newCampaign.raised : `₹${newCampaign.raised}`,
                goal: newCampaign.goal.startsWith("₹") ? newCampaign.goal : `₹${newCampaign.goal}`,
                image: imageUrl
            };

            if (editingId) {
                await updateDoc(doc(db, "campaigns", editingId), finalCampaign);
                alert("Campaign updated successfully!");
                setEditingId(null);
            } else {
                await addDoc(collection(db, "campaigns"), {
                    ...finalCampaign,
                    createdAt: serverTimestamp()
                });
                alert("Campaign added successfully!");
            }

            setNewCampaign({ title: "", desc: "", raised: "", goal: "", image: "" });
            setImageFile(null);
            setShowForm(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Error saving campaign: ", error);
            alert("Failed to save campaign. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (id: string) => {
        const campaignToEdit = campaigns.find(c => c.id === id);
        if (campaignToEdit) {
            setNewCampaign({
                title: campaignToEdit.title,
                desc: campaignToEdit.desc,
                raised: campaignToEdit.raised,
                goal: campaignToEdit.goal,
                image: campaignToEdit.image
            });
            setImageFile(null);
            setEditingId(id);
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this campaign?")) {
            try {
                await deleteDoc(doc(db, "campaigns", id));
                if (editingId === id) {
                    setEditingId(null);
                    setShowForm(false);
                    setNewCampaign({ title: "", desc: "", raised: "", goal: "", image: "" });
                    setImageFile(null);
                }
            } catch (error) {
                console.error("Error deleting campaign:", error);
                alert("Failed to delete campaign.");
            }
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const objectUrl = URL.createObjectURL(file);
            setNewCampaign({ ...newCampaign, image: objectUrl });
        }
    };

    if (loading || !role) return null;

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
                <div className="mb-10 bg-gradient-to-r from-teal-700 to-emerald-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mb-3 tracking-tight">Our Campaigns</h1>
                        <p className="text-teal-50 text-base sm:text-lg font-medium">Explore our active campaigns and find ways to get involved. Every contribution makes a difference.</p>
                    </div>
                </div>

                {role === "admin" && (
                    <div className="mb-8 flex flex-col items-start gap-4">
                        {!showForm ? (
                            <Button
                                onClick={() => {
                                    setEditingId(null);
                                    setNewCampaign({ title: "", desc: "", raised: "", goal: "", image: "" });
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                    setShowForm(true);
                                }}
                                className="bg-teal-600 hover:bg-teal-700 shadow-md"
                                leftIcon={<Plus className="w-5 h-5" />}
                            >
                                Add New Campaign
                            </Button>
                        ) : (
                            <Card className="w-full border-teal-100 bg-teal-50/30 relative">
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                        setNewCampaign({ title: "", desc: "", raised: "", goal: "", image: "" });
                                        setImageFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <CardContent className="p-8">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <Plus className="w-6 h-6 text-teal-600" /> {editingId ? "Edit Campaign" : "Create New Campaign"}
                                    </h2>
                                    <form onSubmit={handleAddCampaign} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Title</label>
                                                <input required type="text" value={newCampaign.title} onChange={e => setNewCampaign({ ...newCampaign, title: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900" placeholder="E.g. Food for All" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Photo</label>
                                                <input
                                                    required={!editingId && !newCampaign.image}
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    onChange={handleImageUpload}
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Funds Required (Goal)</label>
                                                <input required type="text" value={newCampaign.goal} onChange={e => setNewCampaign({ ...newCampaign, goal: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900" placeholder="E.g. 500000" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Funds Raised So Far</label>
                                                <input required type="text" value={newCampaign.raised} onChange={e => setNewCampaign({ ...newCampaign, raised: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900" placeholder="E.g. 100000" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                                <textarea required rows={3} value={newCampaign.desc} onChange={e => setNewCampaign({ ...newCampaign, desc: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900" placeholder="Describe the campaign..." />
                                            </div>
                                        </div>

                                        {newCampaign.image && (
                                            <div className="mt-4 p-4 border border-slate-200 rounded-lg bg-white flex items-center gap-4">
                                                <p className="text-sm font-medium text-slate-700">Image Preview:</p>
                                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-100">
                                                    <Image src={newCampaign.image} alt="Preview" fill className="object-cover" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-2">
                                            <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
                                                {isSubmitting ? "Processing..." : (editingId ? "Update Campaign" : "Publish Campaign")}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {campaigns.map((campaign) => (
                        <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
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
                                    {role === "admin" ? (
                                        <div className="flex gap-4">
                                            <Button
                                                onClick={() => handleEdit(campaign.id)}
                                                fullWidth
                                                size="lg"
                                                variant="outline"
                                                className="border-teal-600 text-teal-700 hover:bg-teal-50"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(campaign.id)}
                                                fullWidth
                                                size="lg"
                                                variant="outline"
                                                className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button fullWidth size="lg">Support This Cause</Button>
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
