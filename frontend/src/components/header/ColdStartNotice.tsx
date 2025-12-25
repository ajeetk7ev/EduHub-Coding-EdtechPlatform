import { useState } from "react";
import { Info, X } from "lucide-react";

export default function ColdStartNotice() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full bg-indigo-900/60 border-b border-indigo-500/40 text-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-start justify-between gap-3">

        {/* Left */}
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 mt-0.5 text-indigo-300" />
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-white">Notice:</span>{" "}
            EduHub backend is hosted on a free Render instance.
            The first request may take{" "}
            <span className="font-semibold text-white">20–30 seconds</span>{" "}
            to wake up. Please wait — everything will work smoothly after that 🚀
          </p>
        </div>

        {/* Close */}
        <button
          onClick={() => setVisible(false)}
          className="text-indigo-300 hover:text-white transition"
          aria-label="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
