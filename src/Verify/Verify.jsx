import { useState, useRef } from 'react';
import verify from './images/verify.png';
import { toast } from 'react-toastify';

export const Verify = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create refs for each input
  const inputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits or empty string

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move focus to next input
    if (value && index < 3) {
      inputsRef[index + 1].current.focus();
    }

    // If deleting and not the first input, go back
    if (!value && index > 0) {
      inputsRef[index - 1].current.focus();
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 4) {
      setError('Please enter the complete 4-digit code.');
      setSuccess('');
      return;
    }

    // TODO: Replace with your API check
    const expectedCode = '1234'; // Example correct code
    if (enteredCode === expectedCode) {
      setSuccess('Verification successful!');
      setError('');
      // Further actions like redirect can go here
    } else {
      setError('Incorrect verification code. Please try again.');
      setSuccess('');
    }
  };

  const handleResend = () => {
    toast.success('Verification code resent!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md h-[60vh] items-center justify-center  flex flex-col">
        <img src={verify} className="w-20 mx-auto" alt="Verification" />
        <h2 className="text-4xl font-bold mb-4 text-center">
          Verify your code
        </h2>
        <p className="text-gray-600 text-center">
          We have sent a verification code to your email sai****ir@gmail.com
        </p>

        <div className="flex justify-between mx-auto gap-4 my-10 w-72">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={inputsRef[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-14 h-14 text-3xl text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleVerify}
            className="bg-blue-500 text-white py-2 w-72 h-12 text-xl rounded hover:bg-blue-600 transition duration-200"
          >
            Verify
          </button>
        </div>

        <h1 className="text-gray-600 mt-4 text-center font-light text-sm">
          Didn't receive code?{' '}
          <span className="text-blue-500 cursor-pointer" onClick={handleResend}>
            Resend
          </span>
        </h1>
      </div>
    </div>
  );
};
