import { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import {
  useGetUserMeQuery,
  useResendOtpMutation,
  useVerifyOtpMutation,
} from '../../api/userApi';
import { toast } from 'react-toastify';

const Spinner = () => <Loader2 className="animate-spin" />;

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef([]);
  const { data: user, isLoading, refetch } = useGetUserMeQuery();

  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  // Start countdown from backend-provided otpExpires
  useEffect(() => {
    if (user?.otpExpires) {
      const expiresAt = new Date(user.otpExpires).getTime();
      const now = Date.now();
      const diff = Math.max(Math.floor((expiresAt - now) / 1000), 0);
      setCountdown(diff);
    }
  }, [user]);

  // Countdown interval
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (/^[0-9]{6}$/.test(pasteData)) {
      setOtp(pasteData.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      toast.warn('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    try {
      await verifyOtp({ email: user.email, otp: enteredOtp }).unwrap();
      toast.success('OTP Verified Successfully!');
      window.location.href = '/dashboard/products';
    } catch {
      toast.error('Invalid or expired OTP.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ email: user.email }).unwrap();
      toast.success('A new OTP has been sent to your email.');
      setOtp(['', '', '', '', '', '']);
      refetch();
    } catch {
      toast.error('Failed to resend OTP.');
    }
  };

  const formattedTime = `${String(Math.floor(countdown / 60)).padStart(
    2,
    '0'
  )}:${String(countdown % 60).padStart(2, '0')}`;

  if (isLoading)
    return (
      <p className="text-center h-[70vh] flex items-center justify-center">
        Loading user info...
      </p>
    );

  return (
    <div className="min-h-[95vh] bg-gray-100 p-4">
      <div className="bg-white p-8 sm:p-12 rounded-xl w-full max-w-md mt-44 mb-16 mx-auto">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-[#face82]/40 to-[#f1aa2e]/30">
            <ShieldCheck className="w-12 h-12 text-[#f1aa2e]" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-700">
          Verify Your OTP
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Enter the 6-digit code sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div
            className="flex justify-center gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-[#fff8ed] border border-[#face82] rounded-lg focus:ring-2 focus:ring-[#face82] outline-none transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full h-14 bg-[#face82] text-gray-800 cursor-pointer text-lg font-semibold rounded-lg flex items-center justify-center hover:bg-[#f1aa2e] disabled:bg-[#face82]"
          >
            {isVerifying ? <Spinner /> : 'Verify OTP'}
          </button>
        </form>

        <div className="text-center text-gray-600 mt-6">
          <p>Didn't receive the code?</p>
          {countdown > 0 ? (
            <p className="mt-2 text-sm">
              Resend OTP in{' '}
              <span className="font-medium text-[#f1aa2e]">
                {formattedTime}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="mt-2 text-[#f1aa2e] font-semibold hover:underline transition"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
