// src/components/CTA.tsx


export default function CTA() {
  return (
    <section className="bg-[#050816] py-24 px-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-blue-600/10 rounded-full blur-[150px] -z-10" />

      <div className="max-w-5xl mx-auto glass p-12 md:p-20 rounded-[3rem] border-white/10 relative overflow-hidden text-center">
        {/* Inner Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-white leading-tight">
            Ready to Build Your <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
              Future in Tech?
            </span>
          </h2>

          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Join 50,000+ developers learning and growing with EduHub. Start your journey today and get access to premium resources.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="/signup"
              className="group relative inline-flex items-center justify-center gap-2 px-10 py-5 overflow-hidden rounded-[1.5rem] bg-white text-[#050816] text-xl font-black transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95 w-full sm:w-auto"
            >
              Sign Up For Free
              <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </a>

            <a
              href="/courses"
              className="px-10 py-5 rounded-[1.5rem] border border-white/20 glass hover:bg-white/5 text-white text-xl font-bold transition-all duration-300 active:scale-95 w-full sm:w-auto"
            >
              Browse Catalog
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}