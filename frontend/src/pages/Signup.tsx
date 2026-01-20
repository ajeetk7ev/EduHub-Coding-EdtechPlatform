import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import CircleLoader from '@/components/ui/CircleLoader';
// Define a type for the user role
type UserRole = 'student' | 'instructor';


function Signup() {
  const { authIsLoading, register } = useAuthStore();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await register(firstName, lastName, email, password);


    if (result.success) {
      toast.success(result.message);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      navigate('/login')

    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center p-4 font-sans antialiased">

      {/* Signup Card */}
      <div className="bg-[#0d1b2a]/50 p-6 md:p-10 rounded-[2rem] shadow-xl max-w-md w-full border border-purple-500/10 backdrop-blur-md relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400 text-xs md:text-sm">Join our community of developers</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-xl bg-[#050816] border border-gray-700/50">
            <button
              onClick={() => setRole('student')}
              className={`px-6 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${role === 'student'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole('instructor')}
              className={`px-6 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${role === 'instructor'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              Instructor
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-1">
              <label htmlFor="firstName" className="text-xs font-medium text-gray-400 ml-1">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#050816] rounded-xl text-white text-sm border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-700"
                required
                placeholder="John"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label htmlFor="lastName" className="text-xs font-medium text-gray-400 ml-1">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#050816] rounded-xl text-white text-sm border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-700"
                required
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-medium text-gray-400 ml-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#050816] rounded-xl text-white text-sm border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-700"
              required
              placeholder="name@company.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-medium text-gray-400 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 bg-[#050816] rounded-xl text-white text-sm border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-700"
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98]"
            disabled={authIsLoading}
          >
            {authIsLoading ? (
              <div className="flex items-center justify-center gap-2">
                <CircleLoader size={18} color="white" />
                <span>Creating...</span>
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-xs font-medium">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-500 font-bold hover:text-purple-400 transition-colors ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


export default Signup;