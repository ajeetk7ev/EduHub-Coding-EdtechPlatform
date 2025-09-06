// src/components/Testimonials.tsx
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rohan Sharma",
    course: "Full Stack Development",
    feedback:
      "EduHub helped me land my first developer job! The projects and instructors were amazing.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Singh",
    course: "Data Science",
    feedback:
      "The hands-on projects made learning so much easier. Highly recommended for beginners.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Ankit Verma",
    course: "Frontend Development",
    feedback:
      "The courses are structured and practical. I feel confident in real-world projects now.",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Sana Khan",
    course: "Backend Development",
    feedback:
      "EduHub’s courses gave me the confidence to work on real projects and level up my skills.",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-900 text-gray-200 py-16 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-blue-400">
            What Our Students Say
          </h2>
          <p className="text-gray-400">
            Hear from learners who transformed their careers with EduHub.
          </p>
        </div>

        {/* Auto-scrolling container */}
        <div className="relative w-full overflow-hidden">
          <div className="max-w-7xl mx-auto flex animate-marquee gap-8">
            {testimonials.concat(testimonials).map((testi, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-xl p-6 shadow-md flex-shrink-0 w-80 flex flex-col items-center"
              >
                <img
                  src={testi.avatar}
                  alt={testi.name}
                  className="w-20 h-20 rounded-full mb-4 border-2 border-blue-400"
                />
                <h3 className="text-xl font-semibold mb-1">{testi.name}</h3>
                <p className="text-blue-400 text-sm mb-2">{testi.course}</p>
                <p className="text-gray-300 mb-4 text-center">{testi.feedback}</p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(testi.rating)
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}