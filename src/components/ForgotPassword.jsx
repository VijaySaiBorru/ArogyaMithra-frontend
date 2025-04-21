import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP
  const [email, setEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleEmailSubmit = (data) => {
    // Simulate sending OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setEmail(data.email);

    setTimeout(() => {
      Swal.fire({
        title: 'OTP Sent',
        text: `An OTP has been sent to ${data.email}. (Mock OTP: ${otp})`,
        icon: 'info',
        confirmButtonText: 'OK',
      });
      setStep(2);
    }, 1000);
  };

  const handleOtpSubmit = (data) => {
    if (data.otp === generatedOtp) {
      Swal.fire({
        title: 'Login Successful',
        text: 'OTP verified successfully. You are now logged in!',
        icon: 'success',
        confirmButtonText: 'Continue',
      });
      // Redirect to dashboard or home
    } else {
      Swal.fire({
        title: 'Invalid OTP',
        text: 'Please enter the correct OTP sent to your email.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          {step === 1 ? 'Forgot Password' : 'Enter OTP'}
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          {step === 1
            ? "We'll send a one-time password (OTP) to your email."
            : `Enter the 6-digit OTP sent to ${email}`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSubmit(handleEmailSubmit)} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Enter a valid email address',
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                {...register('otp', {
                  required: 'OTP is required',
                  minLength: { value: 6, message: 'OTP must be 6 digits' },
                  maxLength: { value: 6, message: 'OTP must be 6 digits' },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter 6-digit OTP"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Verify OTP & Login
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <a href="/login" className="text-blue-600 hover:underline text-sm">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
