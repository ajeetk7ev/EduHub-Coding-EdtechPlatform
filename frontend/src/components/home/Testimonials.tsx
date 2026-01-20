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
    <section className="bg-[#050816] text-gray-200 py-24 px-6 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Loved by <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
              Thousands of Learners
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Join a global community of developers who have transformed their careers and achieved their goals with EduHub.
          </p>
        </div>

        {/* Auto-scrolling container */}
        <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-gradient-to-r before:from-[#050816] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-gradient-to-l after:after:from-[#050816] after:to-transparent">
          <div className="max-w-7xl mx-auto flex animate-marquee gap-8 py-4">
            {testimonials.concat(testimonials).map((testi, idx) => (
              <div
                key={idx}
                className="glass rounded-[2rem] p-8 border-white/10 flex-shrink-0 w-[400px] flex flex-col hover:border-blue-500/30 transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={testi.avatar}
                      alt={testi.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-white/10"
                    />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center border-2 border-[#050816]">
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white leading-none mb-1">{testi.name}</h3>
                    <p className="text-blue-400 text-sm font-medium tracking-wide">{testi.course}</p>
                  </div>
                </div>

                <p className="text-gray-300 italic mb-8 leading-relaxed text-lg">
                  "{testi.feedback}"
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(testi.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-600"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-500">Verified Review</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}