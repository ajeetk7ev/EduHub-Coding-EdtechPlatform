// src/components/BecomeInstructor.tsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import instructorImage from '../../assets/homepage/instructor.png'

export default function BecomeInstructor() {
  return (
    <section className="bg-[#050816] py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 lg:gap-24">

        {/* Left Image */}
        <div className="md:w-1/2 relative">
          <div className="relative z-10 glass p-3 rounded-[2.5rem] border-white/10 shadow-2xl transition-transform duration-500 hover:-rotate-2 hover:scale-[1.02]">
            <img
              src={instructorImage}
              alt="Become Instructor"
              className="w-full h-auto rounded-[2rem] object-cover"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl -z-10" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl -z-10" />
        </div>

        {/* Right Text */}
        <div className="md:w-1/2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 mb-8">
            <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">Join our Team</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white leading-[1.2]">
            Become an <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent italic">Instructor</span>
          </h2>

          <p className="text-gray-400 mb-10 text-lg md:text-xl leading-relaxed">
            Share your expertise with a global audience. We provide the platform, the community, and the tools to help you create world-class learning experiences.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              to="/instructor/signup"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95 w-full sm:w-auto"
            >
              Start Teaching Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
