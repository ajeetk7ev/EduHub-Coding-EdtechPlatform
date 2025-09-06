import  { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CourseInfoForm from "./CourseInfoForm";
import CourseBuilder from "./CourseBuilder";


export default function CreateCourse() {
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState("");
 

  return (
    <div className="flex justify-center items-center p-8">
      <Card className="w-full max-w-2xl rounded-2xl shadow-lg bg-gradient-to-r from-[#1f2937] to-[#111827] text-white">
        <CardContent className="p-6">
          {/* Step Indicator */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            <StepIndicator step={step} />
          </div>

          {/* Render Step Components */}
          {step === 1 && <CourseInfoForm setStep={setStep} setCourseId={setCourseId} />}
          {step === 2 && <CourseBuilder courseId={courseId}  />}
        </CardContent>
      </Card>
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  const steps = ["Course Information", "Course Builder"];
  return (
    <div className="flex items-center justify-around w-full">
      {steps.map((label, index) => {
        const num = index + 1;
        const active = step === num;
        const done = step > num;
        return (
          <div key={num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold 
                ${active ? "bg-yellow-500 text-black" : done ? "bg-green-500 text-white" : "bg-gray-600"}`}
            >
              {num}
            </div>
            <span className={`${active ? "text-white" : "text-gray-400"}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
