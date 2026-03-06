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
      name: 'Foundational',
      icon: Rocket,
      gradient: 'from-slate-500 to-slate-600',
      price: 0,
      priceAnnual: 0,
      description: 'Start your journey with essential knowledge',
      features: [
        { text: 'Access to Public Lectures', included: true },
        { text: 'Foundational E-books', included: true },
        { text: 'Student Community Access', included: true },
        { text: 'Basic Progress Tracking', included: true },
        { text: 'AI Study Assistant', included: false },
        { text: 'Certification of Completion', included: false },
        { text: '1-on-1 Scholar Support', included: false },
      ],
      cta: 'Begin Learning',
      popular: false,
      badge: null,
    },
    {
      id: 'professional',
      name: 'Intensive',
      icon: Zap,
      gradient: 'from-emerald-500 to-emerald-600',
      price: 19.99,
      priceAnnual: 199.99,
      description: 'Deep dive into specialized subjects',
      features: [
        { text: 'All Foundational Content', included: true },
        { text: 'Live Weekly Seminars', included: true },
        { text: 'Advanced Course Materials', included: true },
        { text: 'Graded Assignments', included: true },
        { text: 'AI Study Assistant', included: true },
        { text: 'Verified Certifications', included: true },
        { text: 'Group Mentorship', included: true },
      ],
      cta: 'Enroll Now',
      popular: true,
      badge: 'Most Popular',
    },
    {
      id: 'premium',
      name: 'Elite',
      icon: Sparkles,
      gradient: 'from-emerald-600 to-emerald-700',
      price: 39.99,
      priceAnnual: 399.99,
      description: 'The complete academic experience',
      features: [
        { text: 'All Intensive Content', included: true },
        { text: 'Priority Seminar Seating', included: true },
        { text: 'Archived Course Access', included: true },
        { text: 'Research Paper Guidance', included: true },
        { text: 'Advanced Research Assistant', included: true },
        { text: '1-on-1 Mentorship Sessions', included: true },
        { text: 'Lifetime Access to Alumni', included: true },
      ],
      cta: 'Go Intensive',
      popular: false,
      badge: 'Elite',
    },
    {
      id: 'recruiter',
      name: 'Instructor',
      icon: Crown,
      gradient: 'from-slate-800 to-slate-900',
      price: 89.99,
      priceAnnual: 899.99,
      description: 'Tools for educators and researchers',
      features: [
        { text: 'Course Creation Tools', included: true },
        { text: 'Student Analytics Dashboard', included: true },
        { text: 'Institutional Branding', included: true },
        { text: 'Broadcast Capabilities', included: true },
        { text: 'Revenue Management', included: true },
        { text: 'Advanced Moderation', included: true },
        { text: 'Dedicated Success Manager', included: true },
      ],
      cta: 'Join Curator Team',
      popular: false,
      badge: 'Curator Team',
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
      const { data } = await apiService.subscriptions.createCheckout(tierId);
      if (data?.url) {
        window.location.href = data.url;
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
        <title>Academic Plans - One Islam Institute</title>
        <meta name="description" content="Choose the perfect study plan for your Islamic learning journey" />
      </Helmet>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A1120] pt-20">
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
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                Trusted by 10,000+ students worldwide
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Flexible Study Plans
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              Choose the depth of study that fits your schedule. All plans support our <span className="font-semibold text-emerald-600">Global Scholarship Fund</span>.
            </p>

            {/* Enhanced Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <span className={`text-base font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-text-primary dark:text-white' : 'text-text-secondary dark:text-slate-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative inline-flex h-7 w-14 items-center rounded-full bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-lg"
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
              <span className={`text-base font-semibold transition-colors ${billingCycle === 'annual' ? 'text-text-primary dark:text-white' : 'text-text-secondary dark:text-slate-500'}`}>
                Annual
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2 inline-block px-2 py-0.5 bg-emerald-600 text-white rounded-full text-xs font-bold"
                >
                  Save 15%
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
                    className={`relative group ${tier.popular
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
                        <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-lg bg-emerald-600">
                          {tier.popular && <TrendingUp className="w-4 h-4" />}
                          {tier.id === 'premium' && <Star className="w-4 h-4" />}
                          {tier.id === 'pro' && <Shield className="w-4 h-4" />}
                          {tier.badge}
                        </span>
                      </motion.div>
                    )}

                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      className={`relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 overflow-visible transition-all duration-300 pt-6 ${tier.popular
                        ? 'border-emerald-600 shadow-2xl shadow-emerald-600/20'
                        : hoveredTier === tier.id
                          ? 'border-emerald-500/50 shadow-2xl'
                          : 'border-slate-200 dark:border-slate-800'
                        }`}
                    >
                    {/* Gradient Background - Only emerald */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                    <div className="p-8 relative z-10">
                      {/* Icon - Emerald only */}
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/20"
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </motion.div>

                      {/* Tier Name & Description */}
                      <h3 className="text-2xl font-bold text-text-primary dark:text-white mb-2">
                        {tier.name}
                      </h3>
                      <p className="text-sm text-text-secondary dark:text-text-muted mb-6">
                        {tier.description}
                      </p>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-5xl font-bold text-text-primary dark:text-white">
                            ${price}
                          </span>
                          {tier.price > 0 && (
                            <span className="text-text-secondary dark:text-slate-400 ml-2 text-lg">
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
                          className={`w-full mb-6 font-semibold ${tier.popular
                            ? 'bg-workflow-primary text-white shadow-primary-glow'
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
                              <X className="w-5 h-5 text-text-muted dark:text-slate-600 mr-3 flex-shrink-0 mt-0.5" />
                            )}
                            <span
                              className={`text-sm ${feature.included
                                ? 'text-text-primary dark:text-white font-medium'
                                : 'text-text-muted dark:text-slate-500 line-through'
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
            className="bg-surface rounded-2xl shadow-xl border border-border dark:border-white/10 p-8 mb-16 overflow-hidden"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-2">
                Feature Comparison
              </h2>
              <p className="text-text-secondary dark:text-slate-400">
                Compare all features across our plans
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border dark:border-white/10">
                    <th className="text-left py-4 px-6 font-bold text-text-primary dark:text-white">Academic Feature</th>
                    <th className="text-center py-4 px-6 font-bold text-text-primary dark:text-white">Foundational</th>
                    <th className="text-center py-4 px-6 font-bold text-emerald-600">Intensive</th>
                    <th className="text-center py-4 px-6 font-bold text-emerald-600">Scholar</th>
                    <th className="text-center py-4 px-6 font-bold text-emerald-600">Instructor</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Course Access', free: 'Public Only', basic: 'Advanced', premium: 'Full Library', pro: 'Curator Team Access' },
                    { feature: 'AI Study Assistant', free: false, basic: 'Standard', premium: 'Research Grade', pro: 'Full Access' },
                    { feature: 'Certifications', free: 'Digital', basic: 'Verified', premium: 'Accredited', pro: 'Issuer Status' },
                    { feature: 'Live Seminars', free: false, basic: true, premium: true, pro: true },
                    { feature: 'Mentorship Sessions', free: false, basic: false, premium: true, pro: true },
                    { feature: 'Research Tools', free: false, basic: false, premium: true, pro: true },
                    { feature: 'Course Creation', free: false, basic: false, premium: false, pro: true },
                    { feature: 'Priority Support', free: false, basic: true, premium: true, pro: true },
                  ].map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="border-b border-border dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-4 px-6 text-text-primary dark:text-white font-semibold">{row.feature}</td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-text-muted dark:text-slate-600 mx-auto" />
                        ) : (
                          <span className="text-text-primary dark:text-white font-medium">{row.free}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.basic === 'boolean' ? (
                          row.basic ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-text-muted dark:text-slate-600 mx-auto" />
                        ) : (
                          <span className="text-emerald-600 font-semibold">{row.basic}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.premium === 'boolean' ? (
                          row.premium ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-text-muted dark:text-slate-600 mx-auto" />
                        ) : (
                          <span className="text-emerald-600 font-semibold">{row.premium}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-text-muted dark:text-slate-600 mx-auto" />
                        ) : (
                          <span className="text-emerald-600 font-semibold">{row.pro}</span>
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Everything you need to know about our academic plans
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  q: 'Can I change plans mid-semester?',
                  a: 'Yes! You can upgrade your plan at any time to access more advanced courses. Your current balance will be prorated.',
                },
                {
                  q: 'Are the certifications accredited?',
                  a: 'Our certifications are verified by the One Islam Institute curation panel and are recognized for their academic rigour.',
                },
                {
                  q: 'Is there a trial period?',
                  a: 'Yes! All plans start with a 14-day discovery period. You can explore our foundational content before committing.',
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Absolutely. We believe in voluntary learning. You can cancel your subscription at the end of any billing cycle.',
                },
                {
                  q: 'How does the Elite plan work?',
                  a: 'The Elite plan provides direct access to our mentorship network, including 1-on-1 sessions and research guidance.',
                },
                {
                  q: 'Do you offer group discounts?',
                  a: 'Yes, we have specialized plans for families and religious institutions. Contact our help desk for more information.',
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    {faq.q}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{faq.a}</p>
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
