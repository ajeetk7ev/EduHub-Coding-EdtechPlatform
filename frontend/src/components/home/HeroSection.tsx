import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { ArrowRight } from "lucide-react";
import bgImage from "@/assets/homepage/student.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[rgb(13,27,42)] text-gray-200 py-16 lg:py-24">
      {/* 1.Main Content Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-2 tracking-tight">
            Master Coding with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
              EduHub
            </span>
          </h1>

          <h2 className="h-16 text-2xl md:text-3xl font-semibold mb-2 flex items-center justify-center md:justify-start">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              <Typewriter
                words={[
                  "Learn Full Stack Development",
                  "Crack Your Next Interview",
                  "Build Real World Projects",
                  "Upskill with Experts",
                ]}
                loop={true}
                cursor
                cursorStyle="_"
                typeSpeed={60}
                deleteSpeed={40}
                delaySpeed={1500}
              />
            </span>
          </h2>

          <p className="text-gray-400 mb-10 text-xl max-w-lg mx-auto md:mx-0 leading-relaxed">
            Interactive courses, hands-on projects, and expert instructors to
            help you achieve your learning goals and land your dream role.
          </p>

          <Link
            to="/courses"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-bold shadow-lg shadow-blue-500/40 transition duration-300 hover:scale-[1.05]"
          >
            Start Learning Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right Image: Enhanced with 3D-like container and glow */}
        <div className="md:w-1/2 flex justify-center relative mt-10 md:mt-0">
          {/* Decorative glow ring behind the image */}
          <div className="absolute inset-4 -z-10 bg-gradient-to-tr from-blue-500/30 to-purple-500/30 rounded-3xl blur-3xl opacity-70"></div>

          <div>
            <img
              src={bgImage}
              alt="A stylized illustration of coding on a computer screen, representing learning and development"
              className="w-full h-full object-cover animate-top-down"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
