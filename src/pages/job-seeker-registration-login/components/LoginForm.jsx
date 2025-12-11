import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

const LoginForm = ({ onSuccess, isLoading: externalLoading }) => {
  const { signIn, signInWithOAuth } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signIn(formData.email, formData.password);
      success('Successfully signed in!');
      if (onSuccess) {
        onSuccess({ email: formData.email });
      } else {
        navigate('/job-seeker-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: error.message || 'Invalid email or password. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      setIsLoading(true);
      await signInWithOAuth(provider);
      // OAuth will redirect, so we don't need to navigate
    } catch (error) {
      console.error('OAuth error:', error);
      showError(`Failed to sign in with ${provider}. Please try again.`);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors?.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const loading = isLoading || externalLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* General Error */}
      {errors?.general && (
        <div className="bg-error-50 dark:bg-error-900/20 border border-error-100 dark:border-error-800 rounded-md p-3">
          <div className="flex items-start">
            <Icon name="AlertCircle" size={16} color="var(--color-error)" className="mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-error-600 dark:text-error-400">{errors?.general}</p>
          </div>
        </div>
      )}

      {/* Email Field */}
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
            name="email"
            value={formData?.email}
            onChange={handleChange}
            className={`input-field pl-10 ${errors?.email ? 'border-error focus:ring-error' : ''}`}
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>
        {errors?.email && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors?.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Lock" size={16} color="#64748B" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData?.password}
            onChange={handleChange}
            className={`input-field pl-10 pr-10 ${errors?.password ? 'border-error focus:ring-error' : ''}`}
            placeholder="Enter your password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={loading}
          >
            <Icon 
              name={showPassword ? "EyeOff" : "Eye"} 
              size={16} 
              color="#64748B"
              className="hover:text-[#0F172A] dark:hover:text-[#E8EAED] transition-smooth" 
            />
          </button>
        </div>
        {errors?.password && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors?.password}
          </p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData?.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 text-workflow-primary focus:ring-workflow-primary border-[#E2E8F0] dark:border-[#1E2640] rounded"
            disabled={loading}
          />
          <span className="ml-2 text-sm text-[#64748B] dark:text-[#8B92A3]">Remember me</span>
        </label>
        <Link 
          to="/forgot-password" 
          className="text-sm text-workflow-primary hover:text-workflow-primary-600 transition-smooth"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary flex items-center justify-center space-x-2 min-h-touch disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <Icon name="LogIn" size={16} />
            <span>Sign In</span>
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E2E8F0] dark:border-[#1E2640]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-[#0A0E27] text-[#64748B] dark:text-[#8B92A3]">Or continue with</span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuthLogin('google')}
          disabled={loading}
          className="flex items-center justify-center space-x-2 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] transition-colors disabled:opacity-50"
        >
          <Icon name="Chrome" size={18} />
          <span className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">Google</span>
        </button>
        <button
          type="button"
          onClick={() => handleOAuthLogin('github')}
          disabled={loading}
          className="flex items-center justify-center space-x-2 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] transition-colors disabled:opacity-50"
        >
          <Icon name="Github" size={18} />
          <span className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">GitHub</span>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
