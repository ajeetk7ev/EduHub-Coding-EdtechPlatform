// src/components/HeroSection.tsx
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { ArrowRight } from "lucide-react";
import bgImage from '@/assets/homepage/hero-image.png'


const HeroSection = () => {
    return (
        <section className="bg-[#0d1b2a] text-gray-200 py-20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                {/* Left Content */}
                <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                        Master Coding with{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            EduHub
                        </span>
                    </h1>

                    <h2 className="text-2xl md:text-3xl font-semibold mb-6">
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
                                cursorStyle="|"
                                typeSpeed={60}
                                deleteSpeed={40}
                                delaySpeed={1500}
                            />
                        </span>
                    </h2>

                    <p className="text-gray-400 mb-8 text-lg">
                        Interactive courses, hands-on projects, and expert instructors to
                        help you achieve your learning goals.
                    </p>

                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white text-lg transition"
                    >
                        Start Learning
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* Right Image */}
                <div className="md:w-1/2 flex justify-center">
                    <img
                        src={bgImage}
                        alt="Coding illustration"
                        className="w-96 h-auto drop-shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
