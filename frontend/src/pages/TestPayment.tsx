import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCoursesStore } from "@/store/courseStore";
import { API_URL } from "@/constants/api";
import axios from "axios";
import toast from "react-hot-toast";
import {
    ShieldCheck,
    CreditCard,
    Loader2,
    IndianRupee,
    ArrowLeft,
    CheckCircle2,
    Smartphone,
    Building2,
    Wallet,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/header/Navbar";
import { Input } from "@/components/ui/input";

const TestPayment = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const { courseDetails, fetchCourseDetails } = useCoursesStore();
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    // Form States
    const [upiId, setUpiId] = useState("");
    const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
    const [selectedBank, setSelectedBank] = useState("");

    useEffect(() => {
        if (courseId) {
            fetchCourseDetails(courseId);
        }
    }, [courseId, fetchCourseDetails]);

    const isFormValid = () => {
        if (selectedMethod === "upi") return upiId.includes("@");
        if (selectedMethod === "card") return cardDetails.number.length >= 16 && cardDetails.expiry.length >= 4 && cardDetails.cvv.length >= 3;
        if (selectedMethod === "netbanking") return selectedBank !== "";
        if (selectedMethod === "wallet") return true;
        return false;
    };

    const handleEnrollment = async () => {
        if (!isFormValid()) {
            toast.error("Please fill in the required details correctly");
            return;
        }

        if (!token) {
            toast.error("Session expired. Please login again.");
            navigate("/login");
            return;
        }

        setLoading(true);
        try {
            // Simulate network delay for verification
            await new Promise(resolve => setTimeout(resolve, 2000));

            const res = await axios.post(
                `${API_URL}/course/buy`,
                { courseId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success("Payment Received! Welcome to the course.");
                navigate("/dashboard/enrolled-courses");
            }
        } catch (error: any) {
            console.error("Enrollment Error:", error);
            toast.error(error.response?.data?.message || "Transaction failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!courseDetails) {
        return (
            <div className="min-h-screen bg-[#050816] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    const paymentMethods = [
        { id: "upi", name: "UPI", icon: Smartphone, description: "Google Pay, PhonePe, Paytm" },
        { id: "card", name: "Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
        { id: "netbanking", name: "Net Banking", icon: Building2, description: "All major banks" },
        { id: "wallet", name: "Wallet", icon: Wallet, description: "MobiKwik, Freecharge" },
    ];

    const banks = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Bank"];

    return (
        <div className="min-h-screen bg-[#050816] text-white">
            <Navbar />

            <div className="max-w-5xl mx-auto py-16 px-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Back to Course</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Order Summary - Left Side (2 cols) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                Checkout
                            </div>
                            <h1 className="text-4xl font-black leading-tight">{courseDetails.courseName}</h1>
                        </div>

                        <div className="glass p-8 rounded-[2rem] border-white/5 space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-gray-500">
                                    <span>Price</span>
                                    <span className="text-white flex items-center gap-1">
                                        <IndianRupee className="w-3 h-3" />
                                        {courseDetails.price}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-gray-500">
                                    <span>GST (0%)</span>
                                    <span className="text-white">₹0</span>
                                </div>
                            </div>

                            <div className="h-px bg-white/5" />

                            <div className="flex justify-between items-center text-2xl font-black">
                                <span className="text-gray-300">Total</span>
                                <span className="text-blue-500 flex items-center">
                                    <IndianRupee className="w-5 h-5" />
                                    {courseDetails.price}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
                            <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                            <div>
                                <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Sandbox Environment</p>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Enter any value in the fields to simulate the flow. We don't save or process actual payment credentials.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Interface - Right Side (3 cols) */}
                    <div className="lg:col-span-3">
                        <div className="glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                            {/* Header */}
                            <div className="bg-white/5 p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black italic text-xl shadow-lg">R</div>
                                    <div>
                                        <p className="font-black text-lg leading-none">Razorpay</p>
                                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Test Integration</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Amount to Pay</p>
                                    <p className="text-xl font-black text-white">₹{courseDetails.price}</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Method Selection Overlay or Inline? Let's do inline for better UX */}
                                {!selectedMethod ? (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Payment Options</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {paymentMethods.map((method) => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setSelectedMethod(method.id)}
                                                    className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center gap-5 text-left"
                                                >
                                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-400 transition-colors">
                                                        <method.icon className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-gray-200 group-hover:text-white">{method.name}</p>
                                                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{method.description}</p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="flex items-center gap-4 py-2 border-b border-white/5">
                                            <button
                                                onClick={() => setSelectedMethod(null)}
                                                className="p-2 -ml-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                            </button>
                                            <h3 className="font-black text-lg flex items-center gap-2">
                                                {paymentMethods.find(m => m.id === selectedMethod)?.name}
                                            </h3>
                                        </div>

                                        {/* Dynamic Inputs */}
                                        <div className="space-y-6">
                                            {selectedMethod === "upi" && (
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">UPI ID (VPA)</label>
                                                    <Input
                                                        value={upiId}
                                                        onChange={(e) => setUpiId(e.target.value)}
                                                        placeholder="username@bank"
                                                        className="h-14 bg-white/5 border-white/10 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-lg tabular-nums"
                                                    />
                                                </div>
                                            )}

                                            {selectedMethod === "card" && (
                                                <div className="space-y-6">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Card Number</label>
                                                        <Input
                                                            value={cardDetails.number}
                                                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                                                            placeholder="0000 0000 0000 0000"
                                                            className="h-14 bg-white/5 border-white/10 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-lg tracking-widest tabular-nums"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Expiry</label>
                                                            <Input
                                                                value={cardDetails.expiry}
                                                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                                                placeholder="MM/YY"
                                                                className="h-14 bg-white/5 border-white/10 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-lg tabular-nums"
                                                            />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">CVV</label>
                                                            <Input
                                                                type="password"
                                                                value={cardDetails.cvv}
                                                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                                                                placeholder="000"
                                                                className="h-14 bg-white/5 border-white/10 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-lg tabular-nums"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedMethod === "netbanking" && (
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Choose your Bank</label>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {banks.map(bank => (
                                                            <button
                                                                key={bank}
                                                                onClick={() => setSelectedBank(bank)}
                                                                className={`p-4 rounded-xl border text-left text-sm font-bold transition-all ${selectedBank === bank
                                                                    ? "bg-blue-600 border-blue-500 text-white"
                                                                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                                                                    }`}
                                                            >
                                                                {bank}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {selectedMethod === "wallet" && (
                                                <div className="p-8 rounded-3xl bg-blue-500/5 border border-dashed border-blue-500/20 text-center space-y-4">
                                                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-400">
                                                        <Wallet className="w-8 h-8" />
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-300">Wallet balance will be automatically checked after clicking Pay.</p>
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            onClick={handleEnrollment}
                                            disabled={loading || !isFormValid()}
                                            className={`w-full h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${isFormValid()
                                                ? "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_20px_40px_rgba(59,130,246,0.3)]"
                                                : "bg-white/5 text-gray-500 cursor-not-allowed"
                                                }`}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                    <span>Verifying Transaction...</span>
                                                </>
                                            ) : (
                                                <>
                                                    Pay ₹{courseDetails.price}
                                                    <CheckCircle2 className="w-5 h-5 ml-1" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}

                                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                                    <div className="flex items-center justify-center gap-6 opacity-30">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/RuPay.svg" alt="RuPay" className="h-4" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 mt-6">
                                        PCI DSS Compliant • Secure 256-bit SSL
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPayment;
