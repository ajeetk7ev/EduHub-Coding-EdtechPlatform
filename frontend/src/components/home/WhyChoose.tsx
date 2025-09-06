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
    <section className="bg-[#0d1b2a] text-gray-200 py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 text-blue-400">
          Why Choose <span className="text-white">EduHub</span>
        </h2>
        <p className="text-gray-400 mb-12">
          Discover why thousands of learners trust EduHub to upskill.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition duration-300"
            >
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
