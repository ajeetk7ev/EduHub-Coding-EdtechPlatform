import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import Navbar from "@/components/header/Navbar";

export default function ContactUsPage() {
  return (
    <div className="bg-gray-700 text-gray-200 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center px-6 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Let’s{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
            Connect
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Have a question, feedback, or collaboration idea?  
          Reach out — we’d love to hear from you!
        </p>
      </section>

      {/* Contact Grid */}
      <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 px-6 pb-20">
        {/* Left: Contact Form */}
        <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 shadow-xl rounded-2xl hover:shadow-blue-500/10 transition">
          <CardContent className="p-10">
            <h2 className="text-3xl font-bold mb-8 text-white text-center">
              Send Us a Message
            </h2>
            <form className="space-y-6">
              <div className="relative">
                <Input
                  placeholder="Your Name"
                  className="bg-gray-800 border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 transition rounded-xl px-4 py-3"
                />
              </div>
              <div className="relative">
                <Input
                  placeholder="Your Email"
                  type="email"
                  className="bg-gray-800 border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 transition rounded-xl px-4 py-3"
                />
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Your Message"
                  rows={5}
                  className="bg-gray-800 border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 transition rounded-xl px-4 py-3"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.03] transition-transform duration-200 rounded-xl text-lg py-6 font-semibold">
                🚀 Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right: Info Cards */}
        <div className="space-y-6">
          <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-800 shadow-lg hover:shadow-blue-500/20 transition rounded-xl">
            <CardContent className="p-6 text-center">
              <Mail className="mx-auto w-10 h-10 text-blue-400 mb-3" />
              <h3 className="text-xl font-semibold text-white">Email</h3>
              <p className="text-gray-300">support@learnify.com</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-800 shadow-lg hover:shadow-green-500/20 transition rounded-xl">
            <CardContent className="p-6 text-center">
              <Phone className="mx-auto w-10 h-10 text-green-400 mb-3" />
              <h3 className="text-xl font-semibold text-white">Call</h3>
              <p className="text-gray-300">+91 98765 43210</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-800 shadow-lg hover:shadow-purple-500/20 transition rounded-xl">
            <CardContent className="p-6 text-center">
              <MapPin className="mx-auto w-10 h-10 text-purple-400 mb-3" />
              <h3 className="text-xl font-semibold text-white">Visit Us</h3>
              <p className="text-gray-300">Bangalore, India</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
