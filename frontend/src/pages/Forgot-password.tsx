import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/constants/api";
import CircleLoader from "@/components/ui/CircleLoader";
import { useEffect } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // ---- Handle First Submit ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Reset instructions sent!");
        setEmail("");
        setIsSent(true); // Show resend option
        setCountdown(60); // Start 1-minute countdown
      }
    } catch (error: any) {
      console.error("Error in Resend:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to resend instructions"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center p-6 font-sans antialiased relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />

      {/* Forgot Password Card */}
      <div className="bg-[#0d1b2a]/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-blue-500/10 backdrop-blur-md relative overflow-hidden group">
        {/* Back Button */}
        <button
          onClick={() => navigate("/login")}
          className="absolute top-6 left-6 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all group/btn"
        >
          <ArrowLeft className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
        </button>

        <div className="text-center mb-8 pt-6">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            <Mail className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Forgot Password?
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No worries! Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 bg-[#050816] rounded-xl text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading || (isSent && countdown > 0)}
            className="w-full py-4 rounded-xl text-lg font-bold text-[#050816] bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] flex items-center justify-center gap-2 group/submit disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <CircleLoader size={24} color="#050816" />
            ) : isSent ? (
              countdown > 0 ? `Wait ${countdown}s` : "Send Again"
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* RESEND HINT */}
        {isSent && countdown > 0 && (
          <p className="mt-4 text-center text-sm text-gray-500">
            Didn't receive the email? You can resend in <span className="text-cyan-400 font-bold">{countdown}s</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
