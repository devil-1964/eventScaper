import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

const EmailModal = ({ onClose, eventUrl }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'success'

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!isEmailValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // First, store email and event data
      const emailResponse = await fetch(`${import.meta.env.VITE_API_URL}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, eventUrl }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        throw new Error(errorData.message || 'Failed to store email');
      }

      // Then send OTP
      const otpResponse = await fetch(`${import.meta.env.VITE_API_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!otpResponse.ok) {
        const errorData = await otpResponse.json();
        throw new Error(errorData.message || 'Failed to send OTP');
      }
      
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid OTP');
      }
      
      setStep('success');
      setSuccess(true);
      setTimeout(() => {
        window.location.href = eventUrl;
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend OTP');
      }
      
      setOtp('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBackToEmail = () => {
    setStep('email');
    setOtp('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl max-w-md w-full relative shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        {step === 'success' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Verified!</h2>
            <p className="text-gray-600">Redirecting you to tickets...</p>
          </div>
        ) : step === 'email' ? (
          <>
            <h2 className="text-2xl font-bold mb-1">Get Tickets</h2>
            <p className="text-gray-500 mb-6">Enter your email to continue</p>
            
            <form onSubmit={sendOtp}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                  disabled={isSubmitting}
                />
                {!isEmailValid && email && (
                  <p className="mt-2 text-sm text-red-600">Please enter a valid email</p>
                )}
              </div>
              
              {error && (
                <p className="mb-4 text-sm text-red-600">{error}</p>
              )}
              
              <button
                type="submit"
                disabled={!isEmailValid || isSubmitting}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2 transition-colors ${
                  (!isEmailValid || isSubmitting) 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-1">Verify Email</h2>
            <p className="text-gray-500 mb-2">We sent a 6-digit code to</p>
            <p className="text-sm font-medium text-gray-800 mb-6">{email}</p>
            
            <form onSubmit={verifyOtp}>
              <div className="mb-6">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg font-mono tracking-widest"
                  placeholder="123456"
                  maxLength="6"
                  required
                  disabled={isSubmitting}
                />
                {otp && otp.length !== 6 && (
                  <p className="mt-2 text-sm text-red-600">Please enter a 6-digit code</p>
                )}
              </div>
              
              {error && (
                <p className="mb-4 text-sm text-red-600">{error}</p>
              )}
              
              <button
                type="submit"
                disabled={otp.length !== 6 || isSubmitting}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2 transition-colors mb-4 ${
                  (otp.length !== 6 || isSubmitting) 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </button>
            </form>
            
            <div className="text-center space-y-2">
              <button
                onClick={resendOtp}
                disabled={isSubmitting}
                className="text-sm text-purple-600 hover:text-purple-700 transition-colors disabled:text-gray-400"
              >
                Resend Code
              </button>
              <br />
              <button
                onClick={goBackToEmail}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Change Email Address
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailModal;