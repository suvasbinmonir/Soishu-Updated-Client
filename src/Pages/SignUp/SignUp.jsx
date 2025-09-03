import { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  User,
  Image as ImageIcon,
  UploadCloud,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../api/userApi';
import google from '/icons/google.svg';
import { toast } from 'react-toastify';
import { useFileUploadMutation } from '../../api/fileUploadApi';

const Spinner = () => <Loader2 className="animate-spin" />;

const SignUp = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    name: '',
    image: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const [fileUpload, { isLoading: fileUploadLoading }] =
    useFileUploadMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const setValue = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, name, image, password, confirmPassword } = data;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.warn(
        'Password must be at least 8 characters, with uppercase, lowercase, number, and special character.'
      );
      return;
    }

    try {
      const res = await register({ email, name, image, password }).unwrap();
      toast.success(res ?? 'Registration successful.');
      navigate('/dashboard');
    } catch (err) {
      const message = err?.data?.message || err?.error || 'Registration failed';
      toast.error(message);
    }
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const response = await fileUpload(formData).unwrap();
      if (response?.urls?.[0]) {
        setValue('image', response.urls[0]);
        toast.success('Photo uploaded successfully!');
      }
    } catch {
      toast.error('Image upload failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[95vh] bg-white p-4">
      <div className="bg-[#f7f7f7] p-4 sm:p-8 rounded-xl w-full max-w-lg mt-44 mb-16 mx-auto">
        <h1 className="text-2xl uppercase font-bold text-center mb-6 text-[#495057]">
          Welcome to soishu!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#099885]"
              size={20}
            />
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full h-14 pl-12 pr-4 bg-[#fbfbfb] border border-[#099885] rounded-lg focus:outline-none outline-none"
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#099885]"
              size={20}
            />
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full h-14 pl-12 pr-4 bg-[#fbfbfb] border border-[#099885] rounded-lg focus:outline-none outline-none"
              required
            />
          </div>

          {/* Photo Upload (full width, clickable, preview-enabled) */}
          <div className="w-full">
            <label
              htmlFor="imageUpload"
              className="w-full h-14 bg-[#fbfbfb] border border-[#099885] rounded-lg flex items-center justify-between px-4 cursor-pointer text-[#099885] hover:bg-[#f0f0f0] transition-colors"
            >
              <div className="flex items-center gap-2">
                <UploadCloud size={20} />
                <p>Click to upload photo</p>
              </div>

              {fileUploadLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : data.image ? (
                <img
                  src={data.image}
                  alt="Uploaded preview"
                  className="w-10 h-10 object-cover rounded-full border border-[#099885]"
                />
              ) : null}
            </label>

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#099885]"
              size={20}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full h-14 pl-12 pr-12 bg-[#fbfbfb] border border-[#099885] rounded-lg focus:outline-none outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#099885] hover:text-[#00846e] cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#099885]"
              size={20}
            />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full h-14 pl-12 pr-12 bg-[#fbfbfb] border border-[#099885] rounded-lg focus:outline-none outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#099885] hover:text-[#00846e] cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-[#099885] text-white cursor-pointer text-lg font-semibold rounded-lg flex items-center justify-center hover:bg-[#00846e] disabled:bg-[#7fc8bc]"
          >
            {isLoading ? <Spinner /> : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="mt-7">
            <div className="w-full gap-3 flex justify-center items-center">
              <div className="border-t border-gray-400 w-[100px]"></div>
              <div className="text-gray-400">or</div>
              <div className="border-t border-gray-400 w-[100px]"></div>
            </div>
          </div>

          {/* Google Sign In */}
          <div>
            <button className="w-full h-14 bg-[#fbfbfb] text-[#495057] hover:text-white cursor-pointer text-xl font-semibold mt-5 border border-[#099885] rounded-lg hover:bg-[#00846e] transition-colors duration-300 flex items-center justify-center gap-2">
              <img src={google} alt="Google Logo" className="w-6 h-6" />
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm mt-4 text-[#495057]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#099885] font-medium cursor-pointer hover:underline"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
