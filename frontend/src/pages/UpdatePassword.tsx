import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '@/constants/api';

function UpdatePassword() {
    const { id } = useParams();
    console.log("ID IS ", id)
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

            const res = await axios.post(`${API_URL}/auth/update-password/${id}`, {password:newPassword});

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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans antialiased">
            <div className="bg-gray-800 text-white rounded-3xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-300 hover:scale-[1.01] border-2 border-transparent hover:border-blue-500">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Reset Password
                    </h2>
                    <p className="text-gray-400 mt-2 text-lg">Create a new password for your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password Field */}
                    <div className="relative">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 pr-10 bg-gray-700 rounded-lg text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            required
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-400 hover:text-white transition-colors duration-200"
                            aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                        >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Confirm New Password Field */}
                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 pr-10 bg-gray-700 rounded-lg text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            required
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-400 hover:text-white transition-colors duration-200"
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 flex items-center justify-center gap-2"
                    >
                        {isLoading && <Loader className="animate-spin h-5 w-5 text-gray-300" />}
                        {isLoading ? 'Resetting...' : 'Reset'}
                    </button>
                </form>
        </div>
        </div >
    );
}

export default UpdatePassword;
