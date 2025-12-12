import { useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Code, Layers, Database } from "lucide-react";
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
    <section className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Explore{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Categories
          </span>
        </h2>

        <p className="text-gray-400 mb-12">
          Choose a category to explore courses 🚀
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categoryLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-800 rounded-2xl animate-pulse"
                />
              ))
            : categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => navigate(`/courses?category=${cat._id}`)}
                  className="group w-full text-left bg-[#1f2453] hover:bg-[#23295f]
                             transition-all duration-300 rounded-2xl p-6 shadow-md 
                             hover:shadow-xl border border-transparent 
                             hover:border-purple-500"
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4
                               bg-gradient-to-br ${
                                 categoryBg[cat.name] ||
                                 "from-gray-500/20 to-gray-700/20"
                               }
                               group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-purple-300">
                      {categoryIcons[cat.name] || <Globe className="w-7 h-7" />}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {cat.name}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {cat.description?.slice(0, 90) ||
                      "Explore courses under this category."}
                  </p>

                  <div className="mt-4 text-purple-300 font-medium">
                    Explore →
                  </div>
                </button>
              ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCategories;
