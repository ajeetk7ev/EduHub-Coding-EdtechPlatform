import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-center text-white px-4">
      {/* Animated 404 */}
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-8xl md:text-9xl font-extrabold text-amber-400 drop-shadow-lg"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-4 text-lg md:text-xl text-gray-300"
      >
        Oops! The page you’re looking for doesn’t exist.
      </motion.p>

      {/* Go Home Button */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Button
          onClick={() => navigate("/")}
          className="px-6 py-3 text-lg font-semibold rounded-xl bg-amber-400 hover:bg-amber-500 text-black shadow-lg transition-transform transform hover:scale-105"
        >
          Go to Home Page
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
