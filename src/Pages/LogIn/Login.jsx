import { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useGetUserMeQuery, useLoginMutation } from '../../api/userApi';
import { Link, useNavigate } from 'react-router-dom';
import google from '/icons/google.svg';
import { toast } from 'react-toastify';

const Spinner = () => <Loader2 className="animate-spin" />;

export const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { data: user, isLoading: isUserLoading } = useGetUserMeQuery();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  useEffect(() => {
    if (!isUserLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isUserLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(loginData);
      toast.success(res?.data?.message);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[95vh] bg-gray-100 p-4">
      <div className="bg-white p-4 sm:p-8 rounded-xl w-full max-w-lg mx-auto mt-44 mb-10">
        <h1 className="text-2xl font-bold text-center mb-6 uppercase text-[#495057]">
          Welcome Back!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#099885]"
              size={20}
            />
            <input
              type="text"
              name="identifier"
              value={loginData.identifier}
              onChange={handleChange}
              placeholder="Email or Phone"
              className="w-full h-14 pl-12 pr-4 bg-[#fbfbfb] border border-[#099885] rounded-lg focus:outline-none outline-none"
              required
            />
          </div>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#099885]"
              size={20}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full h-14 pl-12 pr-12 bg-[#fbfbfb] border border-[#099885] rounded-lg focus:outline-none outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#099885] hover:text-[#099885] cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full h-14 bg-[#099885] text-white cursor-pointer text-lg font-semibold rounded-lg flex items-center justify-center hover:bg-[#00846e] disabled:bg-[#099885]"
          >
            {isLoggingIn ? <Spinner /> : 'Log In'}
          </button>

          <div className="mt-7">
            <div className="w-full gap-3 flex justify-center items-center">
              <div className="border-t border-gray-400 w-[100px]"></div>
              <div className="text-gray-400">or</div>
              <div className="border-t border-gray-400 w-[100px]"></div>
            </div>
          </div>

          <div>
            <button className="w-full h-14 bg-[#fbfbfb] text-[#495057] hover:text-white cursor-pointer text-xl font-semibold mt-5 border border-[#099885] rounded-lg hover:bg-[#00846e] transition-colors duration-300 flex items-center justify-center gap-2">
              <img src={google} alt="Google Logo" className="w-6 h-6" />
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm mt-4 text-[#495057]">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-[#099885] font-medium cursor-pointer hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
