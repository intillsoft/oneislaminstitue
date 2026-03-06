import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Users, UserCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import Header from '../../components/ui/Header';

const Register = () => {
  const { signUp } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'job-seeker',
      title: 'Student',
      description: 'Discover academic courses and advance your learning',
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500',
      features: ['Browse academic catalog', 'AI-powered course matching', 'Transcript builder', 'Enrollment tracking']
    },
    {
      id: 'recruiter',
      title: 'Instructor',
      description: 'Deploy curriculums and guide the next generation',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      features: ['Create unlimited courses', 'Manage student roster', 'Academic analytics', 'Curator Team profile']
    },
    {
      id: 'talent',
      title: 'Scholar',
      description: 'Share expert knowledge and grow your academic achievements',
      icon: UserCheck,
      color: 'from-green-500 to-emerald-500',
      features: ['Host specialized seminars', 'Manage academic projects', 'Contribute research', 'Build your academic profile']
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedRole) {
      newErrors.role = 'Please select a role';
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const signUpResult = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        name: formData.fullName,
        role: selectedRole, // Set role immediately in metadata
      });
      
      success(`Account created successfully! Welcome as a ${roles.find(r => r.id === selectedRole)?.title}.`);
      
      // Send registration welcome notification
      try {
        const { sendRegistrationWelcomeNotification } = await import('../../services/notificationTriggers');
        const userId = signUpResult?.user?.id || formData.email;
        await sendRegistrationWelcomeNotification(
          userId,
          formData.email,
          formData.fullName
        );
      } catch (notifError) {
        console.log('Registration notification sent or skipped');
      }
      
      // Navigate based on role
      setTimeout(() => {
        switch (selectedRole) {
          case 'job-seeker':
            navigate('/dashboard/student');
            break;
          case 'recruiter':
            navigate('/instructor/dashboard');
            break;
          case 'talent':
            navigate('/talent/dashboard');
            break;
          default:
            navigate('/');
        }
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      showError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-workflow-primary to-workflow-primary-600 rounded-2xl mb-6 shadow-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary dark:text-dark-text mb-4">
              Create Your Account
            </h1>
            <p className="text-lg text-text-secondary dark:text-dark-text-secondary">
              Choose your role and start your journey with One Islam Institute
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-text-primary dark:text-dark-text mb-4">
              I want to be a:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => {
                const IconComponent = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <motion.button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.id);
                      setErrors(prev => ({ ...prev, role: '' }));
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      p-6 rounded-xl border-2 transition-all duration-300 text-left
                      ${isSelected
                        ? 'border-workflow-primary bg-workflow-primary/10 dark:bg-workflow-primary/20 shadow-card-hover'
                        : 'border-border dark:border-dark-border bg-surface-elevated dark:bg-dark-surface-elevated hover:border-workflow-primary/50'
                      }
                    `}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} p-3 mb-4 flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text mb-2">
                      {role.title}
                    </h3>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
                      {role.description}
                    </p>
                    <ul className="space-y-2">
                      {role.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-text-muted dark:text-dark-text-muted flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-workflow-primary"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.button>
                );
              })}
            </div>
            {errors.role && (
              <p className="mt-2 text-sm text-error-500">{errors.role}</p>
            )}
          </div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface-elevated dark:bg-dark-surface-elevated rounded-xl shadow-card border border-border dark:border-dark-border p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-error-500">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-error-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error-500">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded border-border dark:border-dark-border text-workflow-primary focus:ring-workflow-primary"
                />
                <label className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  I agree to the{' '}
                  <Link to="/terms" className="text-workflow-primary hover:underline">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-workflow-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-error-500">{errors.agreeToTerms}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-soft hover:shadow-card-hover font-medium flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                Already have an account?{' '}
                <Link to="/login" className="text-workflow-primary hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

