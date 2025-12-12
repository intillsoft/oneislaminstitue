import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import { auth } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';

const ResetPassword = () => {
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we have a valid token from URL
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    if (!token || type !== 'recovery') {
      showError('Invalid or expired reset link');
      setTimeout(() => navigate('/forgot-password'), 2000);
    }
  }, [searchParams, navigate, showError]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return levels[strength] || 'Very Weak';
  };

  const getPasswordStrengthColor = (strength) => {
    const colors = ['bg-error', 'bg-warning', 'bg-warning', 'bg-accent', 'bg-accent'];
    return colors[strength] || 'bg-error';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password is too weak. Include uppercase, lowercase, numbers, and special characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await auth.updatePassword(formData.password);
      success('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      showError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Reset Password', path: '/reset-password', isLast: true }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb customItems={breadcrumbItems} />
        
        <div className="mt-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-workflow-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Key" size={32} color="white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Reset Password
            </h1>
            <p className="text-[#64748B] dark:text-[#8B92A3]">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6 space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Lock" size={16} color="#64748B" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-error focus:ring-error' : ''}`}
                  placeholder="Enter new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  <Icon 
                    name={showPassword ? "EyeOff" : "Eye"} 
                    size={16} 
                    color="#64748B"
                    className="hover:text-[#0F172A] dark:hover:text-[#E8EAED] transition-smooth" 
                  />
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-[#E2E8F0] dark:bg-[#1E2640] rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${getPasswordStrengthColor(passwordStrength)}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#64748B] dark:text-[#8B92A3]">
                      {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400 flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Lock" size={16} color="#64748B" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-error focus:ring-error' : ''}`}
                  placeholder="Confirm new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  <Icon 
                    name={showConfirmPassword ? "EyeOff" : "Eye"} 
                    size={16} 
                    color="#64748B"
                    className="hover:text-[#0F172A] dark:hover:text-[#E8EAED] transition-smooth" 
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400 flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {errors.confirmPassword}
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
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <Icon name="Check" size={16} />
                  <span>Reset Password</span>
                </>
              )}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-workflow-primary hover:text-workflow-primary-600 transition-smooth"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

