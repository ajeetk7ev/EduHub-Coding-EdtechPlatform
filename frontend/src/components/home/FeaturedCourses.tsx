import { useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Code, Layers, Database, ArrowRight } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";

//index signature added
const categoryIcons: Record<string, JSX.Element> = {
  "Web Development": <Globe className="w-7 h-7" />,
  "Programming Languages": <Code className="w-7 h-7" />,
  DevOps: <Layers className="w-7 h-7" />,
  DSA: <Database className="w-7 h-7" />,
};

// BG for each category
const categoryBg: Record<string, string> = {
  "Web Development": "from-blue-500/20 to-blue-700/20",
  "Programming Languages": "from-purple-500/20 to-purple-700/20",
  DevOps: "from-green-500/20 to-green-700/20",
  DSA: "from-orange-500/20 to-orange-700/20",
};

function FeaturedCategories() {
  const navigate = useNavigate();
  const { categories, fetchAllCategories, categoryLoading } =
    useCategoryStore();

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  return (
    <section className="bg-[#050816] text-white py-24 px-6 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Master the Most <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
              In-Demand Skills
            </span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Curated categories to help you navigate through our comprehensive course library and find your path to success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryLoading
            ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-64 glass rounded-3xl animate-pulse border-white/5"
              />
            ))
            : categories?.map((cat) => (
              <button
                key={cat._id}
                onClick={() => navigate(`/courses?category=${cat._id}`)}
                className="group relative flex flex-col p-8 rounded-[2rem] glass border-white/10 hover:border-blue-500/50 transition-all duration-500 text-left hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg 
                               bg-gradient-to-br ${categoryBg[cat.name] ||
                    "from-gray-500/20 to-gray-700/20"
                    }`}
                >
                  <span className="text-white">
                    {categoryIcons[cat.name] || <Globe className="w-8 h-8" />}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {cat.description || "Master the latest industry standards and modern practices in this domain."}
                </p>

                <div className="mt-auto flex items-center gap-2 text-blue-400 font-bold text-sm tracking-wider uppercase">
                  Explore Now
                  <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCategories;
