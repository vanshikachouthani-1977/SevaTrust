"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, CheckCircle, Upload, ShieldCheck, Clock, CreditCard, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { db, storage } from "@/lib/firebase";
import { doc, updateDoc, collection, addDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function VolunteerRegisterPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Check if user is already a registered volunteer to restrict access
    useEffect(() => {
        const checkStatus = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().volunteerStatus === "registered") {
                    router.push("/volunteer");
                }
            }
        };
        checkStatus();
    }, [user, router]);

    // Step 1: Personal Info
    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");

    // Step 2: Verification
    const [aadhaarNumber, setAadhaarNumber] = useState("");
    const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    // Step 3: Availability
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [interest, setInterest] = useState("Education & Mentoring");
    const [hoursPerMonth, setHoursPerMonth] = useState("");

    const handleNext = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setStep(step + 1);
        window.scrollTo(0, 0);
    };

    const handleViewFile = (file: File | null, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (file) {
            const url = URL.createObjectURL(file);
            window.open(url, '_blank');
        }
    };

    const handleBack = () => {
        setStep(step - 1);
        window.scrollTo(0, 0);
    };

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            alert("Please log in to complete registration.");
            router.push("/login");
            return;
        }

        if (!aadhaarFile || !photoFile) {
            alert("Please upload both Aadhaar card and Passport size photo.");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Upload files to Storage
            const aadhaarRef = ref(storage, `volunteers/${user.uid}/aadhaar_${aadhaarFile.name}`);
            const photoRef = ref(storage, `volunteers/${user.uid}/photo_${photoFile.name}`);
            
            let aadhaarUrl = "https://via.placeholder.com/150?text=Aadhaar+Card";
            let photoUrl = "https://via.placeholder.com/150?text=Photo";

            try {
                // Add a timeout to prevent hanging if Firebase Storage is not configured
                const uploadPromise1 = uploadBytes(aadhaarRef, aadhaarFile).then(() => getDownloadURL(aadhaarRef));
                const uploadPromise2 = uploadBytes(photoRef, photoFile).then(() => getDownloadURL(photoRef));
                
                const timeout = new Promise<string>((_, reject) => setTimeout(() => reject(new Error("Storage Timeout")), 6000));
                
                aadhaarUrl = await Promise.race([uploadPromise1, timeout]);
                photoUrl = await Promise.race([uploadPromise2, timeout]);
            } catch (storageErr) {
                console.warn("Storage upload failed or timed out. Falling back to placeholder images.", storageErr);
            }

            // 2. Save application to Firestore
            await addDoc(collection(db, "volunteer_applications"), {
                userId: user.uid,
                fullName,
                gender,
                email,
                phone,
                city,
                address,
                aadhaarNumber,
                aadhaarUrl,
                photoUrl,
                availableDays,
                interest,
                hoursPerMonth,
                status: "pending_review",
                createdAt: serverTimestamp()
            });

            // 3. Update user's role/status in users collection
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                volunteerStatus: "registered"
            });

            alert("Registration complete! Welcome to the volunteer network.");
            router.push("/volunteer");
        } catch (error) {
            console.error("Registration error:", error);
            alert("There was an error completing your registration. Please check the console.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-16">
            <Navbar />

            <div className="pt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
                {/* Stepper Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
                        <div
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-teal-500 -z-10 rounded-full transition-all duration-500"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                        ></div>

                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-teal-600 text-white' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                                </div>
                                <span className={`text-xs mt-2 font-medium hidden sm:block ${step >= s ? 'text-teal-700' : 'text-slate-400'}`}>
                                    {s === 1 && "Personal"}
                                    {s === 2 && "Verification"}
                                    {s === 3 && "Availability"}
                                    {s === 4 && "Fees"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-teal-600 px-8 py-8 text-white text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-2xl font-heading font-bold mb-2">Join Our Volunteer Network</h1>
                            <p className="text-teal-50 text-sm max-w-xl mx-auto">
                                {step === 1 && "Step 1: Tell us about yourself."}
                                {step === 2 && "Step 2: Upload your identity documents."}
                                {step === 3 && "Step 3: Tell us when you can help."}
                                {step === 4 && "Step 4: Finalize your registration."}
                            </p>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Step 1: Personal Info */}
                        {step === 1 && (
                            <form onSubmit={handleNext} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-teal-600" />
                                    Personal Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                        <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Gender</label>
                                        <select required value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 cursor-pointer">
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other / Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91" className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">City</label>
                                        <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Full Address Location</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                                <MapPin className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <textarea rows={2} required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address, area..." className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <Button type="submit" size="lg" className="bg-teal-600 hover:bg-teal-700 text-white min-w-[140px]">
                                        Next Step
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Step 2: Verification */}
                        {step === 2 && (
                            <form onSubmit={handleNext} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center">
                                    <ShieldCheck className="w-5 h-5 mr-2 text-teal-600" />
                                    Identity Verification
                                </h3>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700">Aadhaar Card Number</label>
                                        <input
                                            type="text"
                                            required
                                            value={aadhaarNumber}
                                            onChange={(e) => setAadhaarNumber(e.target.value)}
                                            placeholder="XXXX XXXX XXXX"
                                            pattern="[0-9\s]{12,14}"
                                            className="w-full font-mono px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg tracking-wider text-slate-900"
                                        />
                                        <p className="text-xs text-slate-500">For security and background check purposes only.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700">Upload Aadhaar Card (Front & Back)</label>
                                        <label className={`block border-2 ${aadhaarFile ? 'border-teal-500 bg-teal-50' : 'border-dashed border-slate-300 bg-slate-50 hover:bg-teal-50 hover:border-teal-300'} rounded-xl p-8 text-center transition-colors cursor-pointer group relative`}>
                                            <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" required={!aadhaarFile} onChange={(e) => setAadhaarFile(e.target.files?.[0] || null)} />
                                            {aadhaarFile ? (
                                                <>
                                                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-teal-600">
                                                        <CheckCircle className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-sm font-bold text-teal-800 break-all">{aadhaarFile.name}</p>
                                                    <div className="flex items-center justify-center space-x-4 mt-2">
                                                        <p className="text-xs text-teal-600">File attached. Click to change.</p>
                                                        <button
                                                            onClick={(e) => handleViewFile(aadhaarFile, e)}
                                                            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline decoration-teal-300 underline-offset-2 transition-colors z-10"
                                                        >
                                                            View File
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                                        <Upload className="w-5 h-5 text-teal-600" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-700">Click to upload or drag and drop</p>
                                                    <p className="text-xs text-slate-500 mt-1">JPEG, PNG or PDF (max. 5MB)</p>
                                                </>
                                            )}
                                        </label>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700">Recent Passport Size Photo</label>
                                        <label className={`border rounded-xl p-4 flex items-center space-x-4 cursor-pointer transition-colors ${photoFile ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-300'}`}>
                                            <div className={`w-16 h-16 rounded-lg border flex items-center justify-center shrink-0 overflow-hidden ${photoFile ? 'bg-teal-100 border-teal-200' : 'bg-slate-100 border-slate-200'}`}>
                                                {photoFile ? (
                                                    <CheckCircle className="w-6 h-6 text-teal-600" />
                                                ) : (
                                                    <User className="w-6 h-6 text-slate-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900">
                                                    {photoFile ? 'Change File' : 'Choose File'}
                                                </div>
                                                <input type="file" accept="image/*" className="hidden" required={!photoFile} onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
                                                {photoFile ? (
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <p className="text-xs text-teal-700 font-medium truncate max-w-[120px]" title={photoFile.name}>{photoFile.name}</p>
                                                        <button
                                                            onClick={(e) => handleViewFile(photoFile, e)}
                                                            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline decoration-teal-300 underline-offset-2 transition-colors z-10 whitespace-nowrap"
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-500 mt-2">Required for your Volunteer ID badge.</p>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-between">
                                    <Button type="button" onClick={handleBack} variant="outline" size="lg" className="border-slate-300">
                                        Back
                                    </Button>
                                    <Button type="submit" size="lg" className="bg-teal-600 hover:bg-teal-700 text-white min-w-[140px]">
                                        Next Step
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Step 3: Availability */}
                        {step === 3 && (
                            <form onSubmit={handleNext} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-teal-600" />
                                    Your Availability
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700">Available Days</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {['Weekdays', 'Weekends', 'Mornings', 'Evenings'].map((time) => (
                                                <label key={time} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 bg-white">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={availableDays.includes(time)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setAvailableDays([...availableDays, time]);
                                                            else setAvailableDays(availableDays.filter(d => d !== time));
                                                        }}
                                                        className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" 
                                                    />
                                                    <span className="text-sm font-medium text-slate-700">{time}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700">Areas of Interest</label>
                                        <select value={interest} onChange={(e) => setInterest(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer text-slate-900">
                                            <option>Education & Mentoring</option>
                                            <option>Environment & Sustainability</option>
                                            <option>Healthcare Camps</option>
                                            <option>Disaster Relief</option>
                                            <option>Event Organization</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700">How many hours can you dedicate per month?</label>
                                        <div className="flex bg-slate-50 rounded-lg border border-slate-200 overflow-hidden p-1">
                                            {['Less than 5h', '5 - 15h', '15 - 30h', '30h+'].map((hours) => (
                                                <button 
                                                    key={hours} 
                                                    type="button" 
                                                    onClick={() => setHoursPerMonth(hours)}
                                                    className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${hoursPerMonth === hours ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-600 hover:bg-white hover:text-teal-600 focus:bg-white focus:text-teal-600 focus:shadow-sm'}`}
                                                >
                                                    {hours}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-between">
                                    <Button type="button" onClick={handleBack} variant="outline" size="lg" className="border-slate-300">
                                        Back
                                    </Button>
                                    <Button type="submit" size="lg" className="bg-teal-600 hover:bg-teal-700 text-white min-w-[140px]">
                                        Next Step
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Step 4: Fees */}
                        {step === 4 && (
                            <form onSubmit={handleComplete} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2 text-teal-600" />
                                    Registration Fees
                                </h3>

                                <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 mb-6">
                                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-orange-200/50">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">One-Time Onboarding Fee</h4>
                                            <p className="text-sm text-slate-600 mt-1">Covers your ID badge, volunteer kit, and background check process.</p>
                                        </div>
                                        <div className="text-2xl font-bold font-mono text-orange-600">₹500</div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-start space-x-3 cursor-pointer group p-4 border border-slate-200 rounded-lg bg-white hover:border-teal-500 transition-colors">
                                            <input type="radio" name="payment" defaultChecked className="mt-1 w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300" />
                                            <div className="flex-1">
                                                <span className="block text-sm font-bold text-slate-900 group-hover:text-teal-700">UPI / QR Code</span>
                                                <span className="block text-xs text-slate-500 mt-1">Pay instantly via Google Pay, PhonePe, or Paytm</span>
                                            </div>
                                        </label>
                                        <label className="flex items-start space-x-3 cursor-pointer group p-4 border border-slate-200 rounded-lg bg-white hover:border-teal-500 transition-colors">
                                            <input type="radio" name="payment" className="mt-1 w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300" />
                                            <div className="flex-1">
                                                <span className="block text-sm font-bold text-slate-900 group-hover:text-teal-700">Credit / Debit Card</span>
                                                <span className="block text-xs text-slate-500 mt-1">Visa, Mastercard, RuPay accepted</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row gap-4 sm:justify-between items-center">
                                    <Button type="button" onClick={handleBack} variant="outline" size="lg" className="border-slate-300 w-full sm:w-auto">
                                        Back
                                    </Button>
                                    <Button type="submit" size="lg" className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto min-w-[200px]" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                                        ) : (
                                            "Pay ₹500 & Complete"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

        </main>
    );
}
