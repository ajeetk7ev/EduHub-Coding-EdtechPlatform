import { useState } from "react";
import CourseInfoForm from "./CourseInfoForm";
import CourseBuilder from "./CourseBuilder";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState("");

  return (
    <div className="p-4 sm:p-10 space-y-12 relative overflow-hidden min-h-screen">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] -z-10" />

      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
          Create <span className="text-blue-500">Course</span>
        </h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
          Bring your expertise to life with our seamless course builder
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-4xl space-y-10">
          {/* Step Indicator */}
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-3xl">
            <StepIndicator step={step} />
          </div>

          {/* Render Step Components */}
          <div className="glass p-8 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.02] to-purple-600/[0.02] -z-10" />
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {step === 1 && <CourseInfoForm setStep={setStep} setCourseId={setCourseId} />}
                {step === 2 && <CourseBuilder courseId={courseId} onClose={() => navigate("/dashboard/my-courses")} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  const steps = ["Course Information", "Course Builder"];
  return (
    <div className="flex items-center justify-between w-full relative px-4 md:px-10">
      {/* Connector Line */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 mx-16 md:mx-24 -z-10" />
      <div
        className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 mx-16 md:mx-24 -z-10 transition-all duration-700"
        style={{ width: `${(step - 1) * 100}%` }}
      />

      {steps.map((label, index) => {
        const num = index + 1;
        const active = step === num;
        const done = step > num;
        return (
          <div key={num} className="flex flex-col items-center gap-4 relative">
            <motion.div
              animate={{
                scale: active ? 1.1 : 1,
                backgroundColor: active ? "#2563eb" : done ? "#10b981" : "#1e293b"
              }}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-lg transition-colors border shadow-2xl
                ${active ? "border-blue-400 text-white shadow-blue-600/40" : done ? "border-emerald-400 text-white" : "border-white/5 text-gray-500"}`}
            >
              {done ? <Check size={20} className="stroke-[3]" /> : num}
            </motion.div>
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors
              ${active ? "text-blue-400" : done ? "text-emerald-400" : "text-gray-500"}`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
