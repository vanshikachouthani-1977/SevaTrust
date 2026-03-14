"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Target, Eye, Users, HeartHandshake, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function HomePage() {
  const [stats, setStats] = useState({
    livesImpacted: "10,000+",
    yearsActive: "15+",
    activeProjects: "50+",
    volunteers: "2K+"
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const docRef = doc(db, "site_config", "homepage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStats(prev => ({
            livesImpacted: data.livesImpacted || prev.livesImpacted,
            yearsActive: data.yearsActive || prev.yearsActive,
            activeProjects: data.activeProjects || prev.activeProjects,
            volunteers: data.volunteers || prev.volunteers
          }));
        }
      } catch (error) {
        console.error("Error fetching homepage stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-teal-100 selection:text-teal-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-orange-50 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left: Description */}
            <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="inline-flex items-center space-x-2 bg-teal-100/50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                </span>
                <span>Empowering Communities</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-slate-900 leading-[1.1] mb-6 tracking-tight">
                Together We Can Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">Lasting Change.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
                UnityConnect is dedicated to uplifting underprivileged communities through education, healthcare, and sustainable living initiatives. Join our mission to build a brighter future where everyone has the opportunity to thrive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="inline-flex justify-center items-center px-8 py-3.5 text-base font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Join Us Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/donate"
                  className="inline-flex justify-center items-center px-8 py-3.5 text-base font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-full transition-all"
                >
                  Make a Donation
                </Link>
              </div>
            </div>

            {/* Right: NGO Image */}
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
                <img
                  src="/hero_image_collage.png"
                  alt="Volunteers helping children"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg inline-block">
                    <p className="text-teal-700 font-bold text-2xl font-heading">{stats.livesImpacted}</p>
                    <p className="text-slate-600 text-sm font-medium">Lives Impacted</p>
                  </div>
                </div>
              </div>

              {/* Decorative blobs */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl -z-10"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading text-slate-900 mb-4">Our Driving Force</h2>
            <div className="h-1.5 w-24 bg-teal-500 rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Vision */}
            <div className="bg-teal-50 rounded-3xl p-8 lg:p-12 border border-teal-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center text-white mb-6 transform -rotate-6">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 font-heading">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To create an equitable society where every individual, regardless of their background, has access to fundamental necessities, quality education, and the opportunity to lead a dignified and fulfilling life.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-orange-50 rounded-3xl p-8 lg:p-12 border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-6 transform rotate-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 font-heading">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To mobilize resources, empower local communities, and establish sustainable programs that eradicate poverty, provide comprehensive healthcare, and ensure inclusive education for marginalized groups across the nation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="/impact_education.png" alt="Community support" className="rounded-2xl shadow-md w-full h-48 object-cover" />
                <img src="/impact_clean_water.png" alt="Clean Water" className="rounded-2xl shadow-md w-full h-48 object-cover mt-8" />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold font-heading text-slate-900 mb-6">About UnityConnect</h2>
              <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                Founded in 2015, UnityConnect started with a simple belief: that collective action can solve the most complex social challenges. We are a registered non-profit organization driven by a network of passionate volunteers, generous donors, and dedicated field workers.
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                Over the past decade, we have grown from a small neighborhood initiative to a nationwide movement. Our core philosophy is not just to provide charity, but to enable self-reliance and build resilient communities from the ground up.
              </p>

              <div className="grid grid-cols-3 gap-6 text-center border-t border-slate-200 pt-8">
                <div>
                  <div className="text-3xl font-bold text-teal-600 font-heading">{stats.yearsActive}</div>
                  <div className="text-sm font-semibold text-slate-500 mt-1">Years Active</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500 font-heading">{stats.activeProjects}</div>
                  <div className="text-sm font-semibold text-slate-500 mt-1">Active Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600 font-heading">{stats.volunteers}</div>
                  <div className="text-sm font-semibold text-slate-500 mt-1">Volunteers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading text-slate-900 mb-4">Our Impact Areas</h2>
            <p className="text-slate-600 text-lg">We focus our efforts where they are needed most, creating profound and measurable changes in society.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Education for All</h3>
              <p className="text-slate-600 leading-relaxed">Providing free schooling, digital literacy programs, and scholarship funds to ensure no child is left behind due to financial constraints.</p>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Healthcare Support</h3>
              <p className="text-slate-600 leading-relaxed">Organizing free medical camps, distributing essential medicines, and raising awareness about nutrition and sanitation in rural areas.</p>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community Empowerment</h3>
              <p className="text-slate-600 leading-relaxed">Skill development workshops, micro-finance support for women entrepreneurs, and disaster relief operations during critical times.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/campaigns" className="inline-flex items-center text-teal-600 font-bold hover:text-teal-700 hover:underline decoration-2 underline-offset-4">
              View Our Current Campaigns <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
