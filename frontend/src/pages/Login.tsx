import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans antialiased">
      <div className="bg-gray-800 text-white rounded-3xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-300 hover:scale-[1.01] border-2 border-transparent hover:border-blue-500">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome Back!
          </h2>
          <p className="text-gray-400 mt-2 text-lg">Log in to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
              placeholder="you@example.com"
            />
          </div>

          {/* Password with toggle */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-10 bg-gray-700 rounded-lg text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-5 flex items-center pr-3 text-gray-400 hover:text-white transition-colors duration-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right -mt-5 ">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 transition-colors duration-200"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 flex items-center justify-center gap-2"
            disabled={authIsLoading}
          >
            {authIsLoading && <Loader className="animate-spin h-5 w-5 text-white" />}
            {authIsLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {/* Navigate to signup option */}
        <div className="text-center mt-6 text-gray-400">
          <p>Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 transition-colors duration-200"
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