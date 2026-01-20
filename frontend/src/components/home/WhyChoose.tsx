// src/components/WhyChoose.tsx
import { BookOpen, Users, Clock, Trophy } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Expert Instructors",
    description: "Learn from industry professionals with real-world experience.",
    icon: <Users className="w-12 h-12 text-blue-400 mb-4" />,
  },
  {
    id: 2,
    title: "Flexible Learning",
    description: "Study at your own pace with 24/7 course access.",
    icon: <Clock className="w-12 h-12 text-green-400 mb-4" />,
  },
  {
    id: 3,
    title: "Hands-On Projects",
    description: "Gain practical experience by building real projects.",
    icon: <BookOpen className="w-12 h-12 text-purple-400 mb-4" />,
  },
  {
    id: 4,
    title: "Certification",
    description: "Get certified to showcase your skills to employers.",
    icon: <Trophy className="w-12 h-12 text-pink-400 mb-4" />,
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-[#050816] text-gray-200 py-24 px-6 relative overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Why Learn with <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
              EduHub
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We provide the tools, community, and expert guidance you need to turn your curiosity into a career.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative p-8 rounded-[2.5rem] glass border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
            >
              {/* Card Background Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl glass border-white/10 shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
