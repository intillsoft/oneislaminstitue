import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import { auth } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';

const ForgotPassword = () => {
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      await auth.resetPassword(email);
      setIsSubmitted(true);
      success('Password reset link sent! Check your email.');
    } catch (error) {
      console.error('Reset password error:', error);
      showError(error.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Forgot Password', path: '/forgot-password', isLast: true }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb customItems={breadcrumbItems} />
        
        <div className="mt-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-workflow-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={32} color="white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Forgot Password?
            </h1>
            <p className="text-[#64748B] dark:text-[#8B92A3]">
              {isSubmitted 
                ? 'Check your email for reset instructions'
                : 'Enter your email and we\'ll send you a reset link'
              }
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="Mail" size={16} color="#64748B" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`input-field pl-10 ${errors.email ? 'border-error focus:ring-error' : ''}`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400 flex items-center">
                    <Icon name="AlertCircle" size={14} className="mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center space-x-2 min-h-touch disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={16} />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/job-seeker-registration-login"
                  className="text-sm text-workflow-primary hover:text-workflow-primary-600 transition-smooth"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          ) : (
            <div className="bg-workflow-primary-50 dark:bg-workflow-primary-900/20 border border-workflow-primary-200 dark:border-workflow-primary-800 rounded-lg p-6 text-center">
              <Icon name="CheckCircle" size={48} className="text-workflow-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">
                Check Your Email
              </h2>
              <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-4">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-xs text-[#64748B] dark:text-[#8B92A3] mb-4">
                The link will expire in 1 hour. If you don't see the email, check your spam folder.
              </p>
              <Link
                to="/job-seeker-registration-login"
                className="text-sm text-workflow-primary hover:text-workflow-primary-600 transition-smooth"
              >
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

