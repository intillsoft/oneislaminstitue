import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { apiService } from '../../lib/api';
import Button from 'components/ui/Button';
import { Check, X, Sparkles, Zap, Shield, Crown, Rocket, TrendingUp, ArrowRight, Star } from 'lucide-react';
import FAQAIAssistant from '../../components/ui/FAQAIAssistant';

const Pricing = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [hoveredTier, setHoveredTier] = useState(null);

  const tiers = [
    {
      id: 'free',
      name: 'Free',
      icon: Rocket,
      gradient: 'from-gray-500 to-gray-600',
      price: 0,
      priceAnnual: 0,
      description: 'Perfect for getting started',
      features: [
        { text: '1 Resume', included: true },
        { text: '10 Applications/month', included: true },
        { text: '20 Saved Jobs', included: true },
        { text: 'Basic Application Tracking', included: true },
        { text: 'AI Job Matching', included: false },
        { text: 'Advanced Search', included: false },
        { text: 'Email Alerts', included: false },
        { text: 'Priority Support', included: false },
        { text: 'API Access', included: false },
        { text: 'Unlimited Resumes', included: false },
      ],
      cta: 'Get Started',
      popular: false,
      badge: null,
    },
    {
      id: 'basic',
      name: 'Basic',
      icon: Zap,
      gradient: 'from-blue-500 to-blue-600',
      price: 4.99,
      priceAnnual: 49.99,
      description: 'For serious job seekers',
      features: [
        { text: '3 Resumes', included: true },
        { text: '50 Applications/month', included: true },
        { text: '100 Saved Jobs', included: true },
        { text: 'Application Tracking', included: true },
        { text: 'AI Job Matching', included: true },
        { text: 'Advanced Search', included: true },
        { text: 'Email Alerts', included: true },
        { text: 'Priority Support', included: false },
        { text: 'API Access', included: false },
        { text: 'Unlimited Resumes', included: false },
      ],
      cta: 'Start Free Trial',
      popular: true,
      badge: 'Most Popular',
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Sparkles,
      gradient: 'from-purple-500 to-pink-500',
      price: 9.99,
      priceAnnual: 99.99,
      description: 'For power users',
      features: [
        { text: '10 Resumes', included: true },
        { text: '200 Applications/month', included: true },
        { text: '500 Saved Jobs', included: true },
        { text: 'Application Tracking', included: true },
        { text: 'AI Job Matching', included: true },
        { text: 'Advanced Search', included: true },
        { text: 'Email Alerts', included: true },
        { text: 'Priority Support', included: true },
        { text: 'API Access', included: false },
        { text: 'Unlimited Resumes', included: false },
      ],
      cta: 'Start Free Trial',
      popular: false,
      badge: 'Best Value',
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Crown,
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      price: 19.99,
      priceAnnual: 199.99,
      description: 'For professionals and teams',
      features: [
        { text: 'Unlimited Resumes', included: true },
        { text: 'Unlimited Applications', included: true },
        { text: 'Unlimited Saved Jobs', included: true },
        { text: 'Application Tracking', included: true },
        { text: 'AI Job Matching', included: true },
        { text: 'Advanced Search', included: true },
        { text: 'Email Alerts', included: true },
        { text: 'Priority Support', included: true },
        { text: 'API Access', included: true },
        { text: 'All Features', included: true },
      ],
      cta: 'Start Free Trial',
      popular: false,
      badge: 'Enterprise',
    },
  ];

  const handleSelectPlan = async (tierId) => {
    if (tierId === 'free') {
      if (!user) {
        navigate('/login');
      } else {
        success('You are already on the Free plan');
      }
      return;
    }

    if (!user) {
      navigate('/login?redirect=/pricing');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.subscriptions.createCheckout(tierId);
      if (response.url) {
        window.location.href = response.url;
      } else {
        showError('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showError('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Pricing', path: '/pricing', isLast: true },
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - Workflow</title>
        <meta name="description" content="Choose the perfect plan for your job search journey" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-background via-surface-50 to-background dark:from-[#0A0E27] dark:via-[#13182E] dark:to-[#0A0E27] pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Breadcrumb customItems={breadcrumbItems} />

          {/* Enhanced Header - Reduced Height */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 mt-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-3"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-workflow-primary/10 dark:bg-workflow-primary/20 text-workflow-primary rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                Trusted by thousands of job seekers
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-workflow-primary mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg md:text-xl text-text-secondary dark:text-[#8B92A3] mb-6 max-w-2xl mx-auto">
              Choose the plan that's right for you. All plans include a <span className="font-semibold text-workflow-primary">14-day free trial</span>.
            </p>

            {/* Enhanced Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <span className={`text-base font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-text-primary dark:text-[#E8EAED]' : 'text-text-secondary dark:text-[#8B92A3]'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative inline-flex h-7 w-14 items-center rounded-full bg-workflow-primary transition-colors focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:ring-offset-2 shadow-lg"
              >
                <motion.span
                  layout
                  className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg"
                  animate={{
                    x: billingCycle === 'annual' ? 32 : 4,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-base font-semibold transition-colors ${billingCycle === 'annual' ? 'text-text-primary dark:text-[#E8EAED]' : 'text-text-secondary dark:text-[#8B92A3]'}`}>
                Annual
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2 inline-block px-2 py-0.5 bg-workflow-primary text-white rounded-full text-xs font-bold"
                >
                  Save 17%
                </motion.span>
              </span>
            </motion.div>
          </motion.div>

          {/* Enhanced Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative">
            {tiers.map((tier, index) => {
              const IconComponent = tier.icon;
              const price = billingCycle === 'annual' ? tier.priceAnnual : tier.price;
              const savings = billingCycle === 'annual' && tier.price > 0 
                ? Math.round(((tier.price * 12 - tier.priceAnnual) / (tier.price * 12)) * 100)
                : 0;

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredTier(tier.id)}
                  onHoverEnd={() => setHoveredTier(null)}
                  className={`relative group ${
                    tier.popular
                      ? 'md:scale-105 lg:scale-110'
                      : ''
                  }`}
                >
                  {/* Badge - Positioned outside card to prevent clipping */}
                  {tier.badge && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20"
                    >
                      <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-lg bg-workflow-primary">
                        {tier.badge === 'Most Popular' && <TrendingUp className="w-4 h-4" />}
                        {tier.badge === 'Best Value' && <Star className="w-4 h-4" />}
                        {tier.badge === 'Enterprise' && <Shield className="w-4 h-4" />}
                        {tier.badge}
                      </span>
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`relative bg-white dark:bg-[#13182E] rounded-2xl shadow-xl border-2 overflow-visible transition-all duration-300 pt-6 ${
                      tier.popular
                        ? 'border-workflow-primary shadow-2xl shadow-workflow-primary/20'
                        : hoveredTier === tier.id
                        ? 'border-workflow-primary/50 shadow-2xl'
                        : 'border-[#E2E8F0] dark:border-[#1E2640]'
                    }`}
                  >
                    {/* Gradient Background - Only blue */}
                    <div className="absolute inset-0 bg-gradient-to-br from-workflow-primary/5 to-workflow-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                    <div className="p-8 relative z-10">
                      {/* Icon - Blue only */}
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-workflow-primary to-workflow-primary-600 flex items-center justify-center mb-6 shadow-lg"
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </motion.div>

                      {/* Tier Name & Description */}
                      <h3 className="text-2xl font-bold text-text-primary dark:text-[#E8EAED] mb-2">
                        {tier.name}
                      </h3>
                      <p className="text-sm text-text-secondary dark:text-[#8B92A3] mb-6">
                        {tier.description}
                      </p>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-5xl font-bold text-text-primary dark:text-[#E8EAED]">
                            ${price}
                          </span>
                          {tier.price > 0 && (
                            <span className="text-text-secondary dark:text-[#8B92A3] ml-2 text-lg">
                              /{billingCycle === 'annual' ? 'year' : 'month'}
                            </span>
                          )}
                        </div>
                        {savings > 0 && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-workflow-primary mt-2 font-semibold flex items-center gap-1"
                          >
                            <TrendingUp className="w-4 h-4" />
                            Save {savings}% with annual billing
                          </motion.p>
                        )}
                      </div>

                      {/* CTA Button */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => handleSelectPlan(tier.id)}
                          disabled={loading}
                          variant={tier.popular ? 'primary' : 'outline'}
                          className={`w-full mb-6 font-semibold ${
                            tier.popular
                              ? 'bg-gradient-to-r from-workflow-primary to-workflow-primary-600 shadow-lg shadow-workflow-primary/30'
                              : ''
                          }`}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              {tier.cta}
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          )}
                        </Button>
                      </motion.div>

                      {/* Features List */}
                      <ul className="space-y-3">
                        {tier.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 + idx * 0.05 }}
                            className="flex items-start"
                          >
                            {feature.included ? (
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Check className="w-5 h-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                              </motion.div>
                            ) : (
                              <X className="w-5 h-5 text-[#CBD5E1] dark:text-[#475569] mr-3 flex-shrink-0 mt-0.5" />
                            )}
                            <span
                              className={`text-sm ${
                                feature.included
                                  ? 'text-text-primary dark:text-[#E8EAED] font-medium'
                                  : 'text-[#94A3B8] dark:text-[#64748B] line-through'
                              }`}
                            >
                              {feature.text}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Enhanced Feature Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-[#13182E] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#1E2640] p-8 mb-16 overflow-hidden"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-primary dark:text-[#E8EAED] mb-2">
                Feature Comparison
              </h2>
              <p className="text-text-secondary dark:text-[#8B92A3]">
                Compare all features across our plans
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#E2E8F0] dark:border-[#1E2640]">
                    <th className="text-left py-4 px-6 font-bold text-text-primary dark:text-[#E8EAED]">Feature</th>
                    <th className="text-center py-4 px-6 font-bold text-text-primary dark:text-[#E8EAED]">Free</th>
                    <th className="text-center py-4 px-6 font-bold text-workflow-primary">Basic</th>
                    <th className="text-center py-4 px-6 font-bold text-workflow-primary">Premium</th>
                    <th className="text-center py-4 px-6 font-bold text-workflow-primary">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Resumes', free: '1', basic: '3', premium: '10', pro: 'Unlimited' },
                    { feature: 'Applications/month', free: '10', basic: '50', premium: '200', pro: 'Unlimited' },
                    { feature: 'Saved Jobs', free: '20', basic: '100', premium: '500', pro: 'Unlimited' },
                    { feature: 'AI Job Matching', free: false, basic: true, premium: true, pro: true },
                    { feature: 'Advanced Search', free: false, basic: true, premium: true, pro: true },
                    { feature: 'Email Alerts', free: false, basic: true, premium: true, pro: true },
                    { feature: 'Priority Support', free: false, basic: false, premium: true, pro: true },
                    { feature: 'API Access', free: false, basic: false, premium: false, pro: true },
                  ].map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="border-b border-[#E2E8F0] dark:border-[#1E2640] hover:bg-surface-50 dark:hover:bg-[#1A2139] transition-colors"
                    >
                      <td className="py-4 px-6 text-text-primary dark:text-[#E8EAED] font-semibold">{row.feature}</td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? <Check className="w-5 h-5 text-workflow-primary mx-auto" /> : <X className="w-5 h-5 text-[#CBD5E1] dark:text-[#475569] mx-auto" />
                        ) : (
                          <span className="text-text-primary dark:text-[#E8EAED] font-medium">{row.free}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.basic === 'boolean' ? (
                          row.basic ? <Check className="w-5 h-5 text-workflow-primary mx-auto" /> : <X className="w-5 h-5 text-[#CBD5E1] dark:text-[#475569] mx-auto" />
                        ) : (
                          <span className="text-workflow-primary font-semibold">{row.basic}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.premium === 'boolean' ? (
                          row.premium ? <Check className="w-5 h-5 text-workflow-primary mx-auto" /> : <X className="w-5 h-5 text-[#CBD5E1] dark:text-[#475569] mx-auto" />
                        ) : (
                          <span className="text-workflow-primary font-semibold">{row.premium}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? <Check className="w-5 h-5 text-workflow-primary mx-auto" /> : <X className="w-5 h-5 text-[#CBD5E1] dark:text-[#475569] mx-auto" />
                        ) : (
                          <span className="text-workflow-primary font-semibold">{row.pro}</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Enhanced FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary dark:text-[#E8EAED] mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-text-secondary dark:text-[#8B92A3]">
                Everything you need to know about our pricing
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  q: 'Can I change plans later?',
                  a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards, debit cards, and PayPal through our secure Stripe payment processor.',
                },
                {
                  q: 'Is there a free trial?',
                  a: 'Yes! All paid plans include a 14-day free trial. No credit card required to start.',
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Absolutely. You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
                },
                {
                  q: 'What happens if I exceed my limits?',
                  a: 'You\'ll receive a notification when you\'re approaching your limits. You can upgrade your plan or wait until the next billing cycle.',
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white dark:bg-[#13182E] rounded-xl border border-[#E2E8F0] dark:border-[#1E2640] p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <h3 className="font-bold text-lg text-text-primary dark:text-[#E8EAED] mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-workflow-primary" />
                    {faq.q}
                  </h3>
                  <p className="text-sm text-text-secondary dark:text-[#8B92A3] leading-relaxed mb-3">{faq.a}</p>
                  <FAQAIAssistant question={faq.q} answer={faq.a} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
