import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { ArrowRight } from "lucide-react";
import bgImage from "@/assets/homepage/student.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050816] text-gray-200 py-24 -mt-28 pt-40">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
        {/* Left Content */}
        <div className="md:w-3/5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 glass mb-8 animate-fade-in shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium text-blue-300">New: Advanced Full Stack Course</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 tracking-tight">
            Elevate Your <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
              Coding Journey
            </span>
          </h1>

          <div className="h-10 text-xl md:text-2xl font-medium text-gray-300 mb-8">
            <Typewriter
              words={[
                "Build Production-Ready Apps",
                "Master System Design",
                "Crack Top Tech Interviews",
                "Learn from Industry Experts",
              ]}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={30}
              delaySpeed={2000}
            />
          </div>

          <p className="text-gray-400 mb-10 text-lg md:text-xl max-w-xl leading-relaxed">
            Join thousands of developers mastering high-demand skills through
            <span className="text-white font-semibold"> interactive lessons</span>,
            <span className="text-white font-semibold"> real-world industrial projects</span>,
            and <span className="text-white font-semibold">personalized mentorship</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Link
              to="/courses"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 overflow-hidden rounded-2xl bg-blue-600 text-white text-lg font-bold transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] active:scale-95 w-full sm:w-auto"
            >
              Explore Courses
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/10 glass hover:bg-white/5 text-white text-lg font-semibold transition-all duration-300 w-full sm:w-auto"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Image Container */}
        <div className="md:w-2/5 relative">
          <div className="relative z-10 group">
            <div className="relative rounded-3xl overflow-hidden glass border-white/20 p-2 shadow-2xl transition-transform duration-500 group-hover:rotate-1 group-hover:scale-[1.02]">
              <img
                src={bgImage}
                alt="EduHub Coding Platform"
                className="w-full h-auto object-cover rounded-2xl animate-top-down"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
