// src/components/BecomeInstructor.tsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import instructorImage from '../../assets/homepage/instructor.png'

export default function BecomeInstructor() {
  return (
    <section className="bg-[#0d1b2a] py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Image */}
        <div className="md:w-1/2 relative flex justify-center">
         
          <img
            src={instructorImage} 
            alt="Become Instructor"
            className=" h-auto rounded-xl shadow-lg relative z-10"
          />
        </div>

        {/* Right Text */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-4 text-slate-100">
            Become an <span className="text-blue-400">instructor</span>
          </h2>
          <p className="text-gray-400 mb-6 text-lg">
            Instructors from around the world teach millions of students on EduHub. 
            We provide the tools and skills to teach what you love.
          </p>
          <Link
            to="/instructor/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-lg font-semibold transition"
          >
            Start Teaching Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
