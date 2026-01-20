import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from "lucide-react";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";

export default function ContactUsPage() {
  return (
    <div className="bg-[#050816] text-gray-200 min-h-screen font-sans selection:bg-purple-500/30">
      <Navbar />

      <main className="relative overflow-hidden pt-20">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -z-10 animate-pulse delay-1000" />

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center px-6 py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-8">
            <MessageCircle className="w-4 h-4" />
            <span>Support 24/7</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-white tracking-tight">
            Let’s build something <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Great</span> together
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Have a question about our courses, or just want to say hi?
            Our team is here to help you navigate your learning journey.
          </p>
        </section>

        {/* Contact Grid */}
        <section className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 px-6 pb-32">
          {/* Left: Info Cards (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            {[
              {
                title: "Email Us",
                detail: "support@eduhub.com",
                icon: Mail,
                color: "text-blue-400",
                hover: "hover:shadow-blue-500/10"
              },
              {
                title: "Call Us",
                detail: "+91 98765 43210",
                icon: Phone,
                color: "text-green-400",
                hover: "hover:shadow-green-500/10"
              },
              {
                title: "Our Location",
                detail: "Tech Park, Bangalore, India",
                icon: MapPin,
                color: "text-purple-400",
                hover: "hover:shadow-purple-500/10"
              },
              {
                title: "Office Hours",
                detail: "Mon - Fri, 9AM - 6PM",
                icon: Clock,
                color: "text-orange-400",
                hover: "hover:shadow-orange-500/10"
              },
            ].map((info, idx) => (
              <div
                key={idx}
                className={`p-6 bg-[#0d1b2a]/40 border border-white/5 rounded-3xl backdrop-blur-md transition-all ${info.hover} group`}
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <info.icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest leading-none mb-1">{info.title}</h3>
                    <p className="text-lg font-bold text-white leading-tight">{info.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Contact Form (8 columns) */}
          <div className="lg:col-span-8">
            <div className="bg-[#0d1b2a]/30 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
              <h2 className="text-3xl font-bold mb-10 text-white">Send us a message</h2>
              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                    <Input
                      placeholder="John Doe"
                      className="h-14 bg-[#050816]/50 border-white/10 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all rounded-2xl px-6 text-lg placeholder:text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                    <Input
                      placeholder="john@company.com"
                      type="email"
                      className="h-14 bg-[#050816]/50 border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all rounded-2xl px-6 text-lg placeholder:text-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                  <Input
                    placeholder="How can we help?"
                    className="h-14 bg-[#050816]/50 border-white/10 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all rounded-2xl px-6 text-lg placeholder:text-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Your Message</label>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="bg-[#050816]/50 border-white/10 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all rounded-[1.5rem] px-6 py-5 text-lg placeholder:text-gray-700 resize-none"
                  />
                </div>

                <Button className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xl rounded-2xl shadow-xl shadow-purple-900/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-3">
                  <Send className="w-6 h-6" />
                  <span>Send Message</span>
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

