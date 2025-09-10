import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/constants/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

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
        setIsSent(true); // Show resend option
      }
    } catch (error: any) {
      console.error("Error in ForgotPassword:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to send reset instructions"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Handle Resend ----
  const handleResend = async () => {
    if (!email) return;
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });

      if (res.data.success) {
        toast.success("Instructions resent to your email!");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">
          Reset your password
        </h2>
        <p className="text-gray-300 mb-6">
          Enter your email address and we’ll send you instructions to reset your password.
          If you don’t have access to your email, you can try account recovery.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-gray-200 mb-1"
              htmlFor="email"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <Loader className="animate-spin h-5 w-5 text-gray-300" />
            )}
            {isLoading ? "Sending..." : isSent ? "Sent" : "Send"}
          </button>
        </form>

        {/* RESEND */}
        {isSent && (
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="mt-4 w-full py-3 px-4 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg focus:outline-none flex items-center justify-center gap-2"
          >
            {isLoading && (
              <Loader className="animate-spin h-5 w-5 text-gray-300" />
            )}
            Resend Instructions
          </button>
        )}

        {/* BACK */}
        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-gray-300 hover:text-white flex items-center gap-1"
        >
          &larr; Back To Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
