import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CircleLoader from '@/components/ui/CircleLoader';


function Login() {
  const { authIsLoading, login, loadUser } = useAuthStore()
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = await login(email, password)

    if (result.success) {
      loadUser();
      toast.success(result.message);
      navigate('/')
    } else {
      toast.error(result.error);
    }
  };

  return (

    <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center p-2 sm:p-6 font-sans antialiased">

      {/* Login Card */}
      <div className="bg-[#0d1b2a]/50 p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full border border-blue-500/10 backdrop-blur-md relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-300 ml-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#050816] rounded-xl text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-600"
              required
              placeholder="name@company.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-[#050816] rounded-xl text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-600"
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            disabled={authIsLoading}
          >
            {authIsLoading ? (
              <div className="flex items-center justify-center gap-2">
                <CircleLoader size={20} color="white" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-500 font-bold hover:text-blue-400 transition-colors ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;