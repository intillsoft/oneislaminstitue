import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

const RegisterForm = ({ onSuccess, isLoading: externalLoading }) => {
  const { signUp, signInWithOAuth } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    professionalTitle: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
    return levels?.[strength] || 'Very Weak';
  };

  const getPasswordStrengthColor = (strength) => {
    const colors = ['bg-error', 'bg-warning', 'bg-warning', 'bg-accent', 'bg-accent'];
    return colors?.[strength] || 'bg-error';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.professionalTitle?.trim()) {
      newErrors.professionalTitle = 'Professional title is required';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password is too weak. Include uppercase, lowercase, numbers, and special characters';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        professional_title: formData.professionalTitle,
      });
      success('Account created! Please check your email to verify your account.');
      if (onSuccess) {
        onSuccess({
          fullName: formData?.fullName,
          email: formData?.email,
          professionalTitle: formData?.professionalTitle
        });
      } else {
        // Wait a bit then navigate
        setTimeout(() => {
          navigate('/job-seeker-dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        general: error.message || 'Failed to create account. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
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

      {/* Full Name Field */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData?.fullName}
          onChange={handleChange}
          className={`input-field ${errors?.fullName ? 'border-error focus:ring-error' : ''}`}
          placeholder="Enter your full name"
          disabled={loading}
        />
        {errors?.fullName && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors?.fullName}
          </p>
        )}
      </div>

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

      {/* Professional Title Field */}
      <div>
        <label htmlFor="professionalTitle" className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
          Professional Title
        </label>
        <input
          type="text"
          id="professionalTitle"
          name="professionalTitle"
          value={formData?.professionalTitle}
          onChange={handleChange}
          className={`input-field ${errors?.professionalTitle ? 'border-error focus:ring-error' : ''}`}
          placeholder="e.g., Software Engineer, Product Manager"
          disabled={loading}
        />
        {errors?.professionalTitle && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors?.professionalTitle}
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
            placeholder="Create a password"
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
        {formData?.password && (
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
        {errors?.password && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors?.password}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
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
            value={formData?.confirmPassword}
            onChange={handleChange}
            className={`input-field pl-10 pr-10 ${errors?.confirmPassword ? 'border-error focus:ring-error' : ''}`}
            placeholder="Confirm your password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={loading}
          >
            <Icon 
              name={showConfirmPassword ? "EyeOff" : "Eye"} 
              size={16} 
              color="#64748B"
              className="hover:text-[#0F172A] dark:hover:text-[#E8EAED] transition-smooth" 
            />
          </button>
        </div>
        {errors?.confirmPassword && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors?.confirmPassword}
          </p>
        )}
      </div>

      {/* Terms Agreement */}
      <div>
        <label className="flex items-start">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData?.agreeToTerms}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-workflow-primary focus:ring-workflow-primary border-[#E2E8F0] dark:border-[#1E2640] rounded"
            disabled={loading}
          />
          <span className="ml-2 text-sm text-[#64748B] dark:text-[#8B92A3]">
            I agree to the{' '}
            <a href="/terms" className="text-workflow-primary hover:text-workflow-primary-600">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="/privacy" className="text-workflow-primary hover:text-workflow-primary-600">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors?.agreeToTerms && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors?.agreeToTerms}
          </p>
        )}
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
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <Icon name="UserPlus" size={16} />
            <span>Create Account</span>
          </>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
