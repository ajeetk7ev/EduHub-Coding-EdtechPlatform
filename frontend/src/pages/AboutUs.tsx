import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Globe, Target } from "lucide-react";
import Navbar from "@/components/header/Navbar";

export default function AboutPage() {
  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white">
          About <span className="text-blue-500">EduHub</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
          We’re on a mission to make world-class education accessible, affordable,
          and engaging for everyone. Our platform blends interactive learning,
          expert instructors, and cutting-edge technology to empower learners.
        </p>
      </section>

      {/* Mission, Vision, Values */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 py-12">
        <Card className="bg-gray-900 border-gray-800 rounded-2xl shadow-lg hover:shadow-blue-500/10 transition">
          <CardContent className="p-6 text-center">
            <Target className="mx-auto w-12 h-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-200">Our Mission</h2>
            <p className="text-gray-400">
              To democratize education by providing learners with accessible,
              affordable, and impactful courses built by top educators.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 rounded-2xl shadow-lg hover:shadow-blue-500/10 transition">
          <CardContent className="p-6 text-center">
            <Globe className="mx-auto w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-200">Our Vision</h2>
            <p className="text-gray-400">
              To become the world’s most trusted learning platform that shapes
              careers and empowers the next generation of innovators.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 rounded-2xl shadow-lg hover:shadow-blue-500/10 transition">
          <CardContent className="p-6 text-center">
            <BookOpen className="mx-auto w-12 h-12 text-purple-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-200">Our Values</h2>
            <p className="text-gray-400">
              Innovation, inclusivity, and integrity are the foundation of
              everything we do. We believe in lifelong learning for everyone.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Meet the Team */}
      <section className="bg-gray-900 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Meet Our Team</h2>
          <p className="text-gray-400 mt-2">
            A passionate group of educators, developers, and creators working
            together to redefine online learning.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Ajeet Kumar", role: "Founder & Developer", img: "https://github.com/shadcn.png" },
            { name: "Priya Sharma", role: "Instructor", img: "https://randomuser.me/api/portraits/women/44.jpg" },
            { name: "Rahul Mehta", role: "Content Strategist", img: "https://randomuser.me/api/portraits/men/46.jpg" },
            { name: "Ananya Gupta", role: "UI/UX Designer", img: "https://randomuser.me/api/portraits/women/48.jpg" },
          ].map((member, i) => (
            <Card
              key={i}
              className="bg-gray-800 border-gray-700 rounded-xl text-center p-6 hover:shadow-lg hover:shadow-blue-500/10 transition"
            >
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={member.img} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold text-gray-200">{member.name}</h3>
              <p className="text-sm text-gray-400">{member.role}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-6xl mx-auto text-center px-6 py-16">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to start your learning journey?
        </h2>
        <p className="text-gray-400 mb-6">
          Join thousands of learners who are upgrading their skills with us.
        </p>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-lg px-8 py-6">
          Explore Courses
        </Button>
      </section>
    </div>
  );
}
