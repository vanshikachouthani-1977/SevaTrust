import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Calendar, MapPin, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen font-sans text-slate-900 bg-white">
      <Navbar />
      <div className="pt-20">
        <Hero />

        {/* Impact & History Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 text-xs font-semibold text-teal-700 uppercase tracking-wide bg-teal-50 border border-teal-100 rounded-full">
                Our Journey
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
                Impact & History
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Explore our past achievements and see how we've transformed communities through dedicated action
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Clean Water", value: "15K+", label: "People served", image: "/impact_clean_water.png" },
                { title: "Education", value: "3,200", label: "Students enrolled", image: "/impact_education.png" },
                { title: "Food Security", value: "8K", label: "Meals distributed", image: "/hero_image_collage.png" }, // Fallback to collage for now
                { title: "Healthcare", value: "12K", label: "Checkups completed", image: "/impact_clean_water.png" }, // Reuse for demo
              ].map((item, index) => (
                <Card key={index} className="border-none shadow-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0 flex flex-col items-center">
                    <div className="relative w-40 h-40 mt-8 mb-6 rounded-full overflow-hidden border-4 border-teal-100 shadow-inner group">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="w-full bg-white p-6 rounded-b-xl border-t border-slate-50 text-center">
                      <h3 className="text-teal-900 font-bold text-lg mb-1">{item.title}</h3>
                      <div className="text-3xl font-bold text-teal-600 mb-2">{item.value}</div>
                      <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">{item.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Current Events Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 text-xs font-semibold text-teal-700 uppercase tracking-wide bg-teal-50 border border-teal-100 rounded-full">
                Our Campaigns
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">
                Current Events
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Join our active campaigns and help us reach our goals. Every contribution makes a difference.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Clean Water Initiative",
                  desc: "Providing clean drinking water access to rural communities. This initiative aims to install water purification systems in 10 villages.",
                  raised: "₹325,000",
                  goal: "₹500,000",
                  progress: 65,
                  image: "/impact_clean_water.png"
                },
                {
                  title: "Digital Education Program",
                  desc: "Equipping schools with computers and digital learning tools to bridge the technology gap for underprivileged students.",
                  raised: "₹480,000",
                  goal: "₹750,000",
                  progress: 44,
                  image: "/impact_education.png"
                }
              ].map((campaign, idx) => (
                <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                      <Button fullWidth size="lg">Support This Cause</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
