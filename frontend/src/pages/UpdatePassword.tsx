import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '@/constants/api';

function UpdatePassword() {
    const { id } = useParams();

    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');


    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();



    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setIsLoading(true);



        try {

            if (newPassword !== confirmPassword) {
                toast.error('New passwords do not match.');
                return;
            }

            const res = await axios.post(`${API_URL}/auth/update-password/${id}`, { password: newPassword });

            if (res.data.success) {
                toast.success(res.data.message);
                setNewPassword('');
                setConfirmPassword('');
                navigate('/login');

            }
        } catch (error: any) {
            console.log("Error in UpdatePassword ", error);
            toast.error(error.response?.data.message || error.message || "Failed to update password")
        } finally {
            setIsLoading(false)
        }


    };

    return (
        <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center p-6 font-sans antialiased relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -z-10 animate-pulse delay-1000" />

            {/* Update Password Card */}
            <div className="bg-[#0d1b2a]/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full border border-purple-500/10 backdrop-blur-md relative overflow-hidden group">
                <div className="text-center mb-10 pt-4">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Eye className="w-8 h-8 text-purple-500" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                        Reset Password
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] mx-auto">
                        Please enter your new password below to regain access to your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password Field */}
                    <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-[#050816] rounded-xl text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-600"
                                required
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password Field */}
                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-[#050816] rounded-xl text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-600"
                                required
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] flex items-center justify-center gap-2 group/submit"
                    >
                        {isLoading ? (
                            <Loader className="animate-spin h-5 w-5" />
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdatePassword;
