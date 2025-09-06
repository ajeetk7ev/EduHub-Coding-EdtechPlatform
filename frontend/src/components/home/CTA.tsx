// src/components/CTA.tsx


export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-200 py-16 px-6  shadow-2xl">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-400 animate-pulse">
          Start Your Learning Journey Today 🚀
        </h2>
        <p className="text-lg md:text-xl mb-8 text-gray-400">
          Join thousands of developers who are building their future with our hands-on coding courses.
        </p>
        <a 
          href="/signup" 
          className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
        >
          Sign Up Now
        </a>
      </div>
    </section>
  );
}