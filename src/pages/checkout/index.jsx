import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  ArrowLeft, 
  ShieldCheck, 
  Heart, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  Globe,
  Wallet,
  Zap,
  ChevronRight,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../lib/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ amount, courseId, type, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { error: showError } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        try {
            const { data } = await api.post('/donations/stripe/create-intent', {
                amount,
                currency: 'usd',
                course_id: courseId,
                type: type
            });

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            });

            if (result.error) {
                showError(result.error.message);
                setIsProcessing(false);
            } else {
                const verifyRes = await api.post('/donations/verify', {
                    reference: data.reference,
                    provider: 'stripe'
                });
                if (verifyRes.data.success) {
                    onSuccess();
                } else {
                    showError('Payment verification failed.');
                    setIsProcessing(false);
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            showError('An error occurred during payment processing.');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl p-6 transition-all focus-within:ring-2 focus-within:ring-emerald-500/20">
                <CardElement 
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#0f172a',
                                ':dark': { color: '#ffffff' },
                                letterSpacing: '0.025em',
                                fontFamily: 'Outfit, Inter, sans-serif',
                                '::placeholder': { color: 'rgba(100,116,139,0.5)' },
                                iconColor: '#10b981'
                            },
                            invalid: { color: '#ef4444' }
                        }
                    }} 
                />
            </div>
            
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
                {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <ShieldCheck size={16} />
                        Complete Secure Purchase • ${amount.toFixed(2)}
                    </>
                )}
            </button>
        </form>
    );
};

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthContext();
    const { success, error: showError } = useToast();

    const courseId = searchParams.get('courseId');
    const title = searchParams.get('title') || 'Course Enrollment';
    const minAmount = parseFloat(searchParams.get('minAmount') || '0.01');
    const maxAmount = parseFloat(searchParams.get('maxAmount')) || undefined;

    const [amount, setAmount] = useState(minAmount);
    const [paymentMethod, setPaymentMethod] = useState('paystack');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: location.pathname + location.search } });
            return;
        }

        const checkEnrollment = async () => {
            if (courseId) {
                try {
                    const { data } = await api.get(`/enrollments?course_id=${courseId}`);
                    if (data.success && data.data.some(app => app.job_id === courseId || app.course_id === courseId)) {
                        setIsEnrolled(true);
                    }
                } catch (err) {
                    console.error('Error checking enrollment:', err);
                } finally {
                    setIsCheckingEnrollment(false);
                }
            } else {
                setIsCheckingEnrollment(false);
            }
        };
        checkEnrollment();
    }, [user, courseId, navigate, location]);

    const handleAmountChange = (e) => {
        let val = parseFloat(e.target.value);
        if (isNaN(val)) val = 0;
        setAmount(val);
    };

    const handleSuccess = () => {
        success('BarakAllah! Enrollment confirmed.');
        if (courseId) {
            navigate(`/courses/${courseId}/onboarding`);
        } else {
            navigate('/dashboard');
        }
    };

    const handlePaystack = async () => {
        if (amount < minAmount) {
            showError(`Minimum donation for this course is $${minAmount}`);
            return;
        }
        setIsProcessing(true);
        try {
            const { data } = await api.post('/donations/paystack/initialize', {
                amount,
                email: user.email,
                currency: 'USD',
                course_id: courseId,
                type: courseId ? 'course_enrollment' : 'general'
            });
            window.location.href = data.authorization_url;
        } catch (error) {
            console.error('Paystack error:', error);
            showError('Could not initialize payment gateway.');
            setIsProcessing(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A1120] selection:bg-emerald-500/30">
            {/* Standard Background Accents from CourseDetail */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                    <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
                    <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
                </div>
            </div>

            <section className="relative z-10 pt-24 sm:pt-[calc(var(--header-height)+2rem)] pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8"
                    >
                        <button 
                            onClick={() => navigate(-1)} 
                            className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
                        >
                            <ArrowLeft size={16} className="text-slate-500 dark:text-slate-400" />
                        </button>
                        <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                            Secure Checkout
                        </span>
                    </motion.div>

                    <div className="grid lg:grid-cols-[1fr,380px] gap-8 lg:gap-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight tracking-tight">
                                Confirm Your <span className="text-emerald-600">Enrollment.</span>
                            </h1>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                                <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-2 sm:mb-0">
                                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">One Islam Institute</span>
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 px-2 border-l border-slate-200 dark:border-slate-700">
                                    Trusted Secure Entry
                                </span>
                            </div>

                            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mb-12">
                                Your contribution ensures the ongoing development of world-class Islamic software and research. 
                                We are honored to have you as part of our learning community.
                            </p>

                            {/* Contribution Selector - Same style as CourseDetail sidebar elements */}
                            <div className="bg-white dark:bg-[#0f1429] rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-8 shadow-2xl relative overflow-hidden group mb-8">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
                                
                                <div className="relative z-10">
                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Mastery Access Selection</p>
                                     <div className="flex items-start gap-4 mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                            <Sparkles size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold leading-tight">{title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Curriculum</span>
                                            </div>
                                        </div>
                                     </div>

                                     <div className="space-y-4 pt-8 border-t border-slate-100 dark:border-white/5">
                                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                                    <Heart size={20} />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-black uppercase tracking-widest text-slate-500 block">Sadaqah / Fee</span>
                                                    <span className="text-[10px] text-slate-400">Set your amount</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-black text-emerald-600">$</span>
                                                <input
                                                    type="number"
                                                    min={minAmount}
                                                    value={amount}
                                                    onChange={handleAmountChange}
                                                    className="bg-transparent text-3xl font-black text-slate-900 dark:text-white outline-none w-24 tracking-tighter"
                                                    step="0.01"
                                                />
                                            </div>
                                        </div>
                                        {amount < minAmount && (
                                            <motion.div 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest pl-2"
                                            >
                                                <Zap size={12} fill="currentColor" />
                                                Minimum required for this course: ${minAmount}
                                            </motion.div>
                                        )}
                                     </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <Globe size={20} className="text-emerald-500 mb-4" />
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Global Access</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Join students from 120+ countries.</p>
                                </div>
                                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <ShieldCheck size={20} className="text-emerald-500 mb-4" />
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Lifetime Updates</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Access all future revisions.</p>
                                </div>
                            </div>
                        </motion.div>

                        <aside>
                            <div className="sticky top-28 space-y-6">
                                <div className="bg-white dark:bg-[#0f1429] rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-7 shadow-2xl shadow-emerald-500/5 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-8 -mt-8" />
                                    
                                    <div className="mb-8 relative z-10">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Payment Method</p>
                                        <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                                            <button
                                                onClick={() => setPaymentMethod('paystack')}
                                                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${paymentMethod === 'paystack' ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-lg' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                            >
                                                <Smartphone size={14} />
                                                Local
                                            </button>
                                            <button
                                                onClick={() => setPaymentMethod('stripe')}
                                                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${paymentMethod === 'stripe' ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-lg' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                            >
                                                <CreditCard size={14} />
                                                Global
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative z-10 min-h-[140px]">
                                        {isCheckingEnrollment ? (
                                            <div className="flex flex-col items-center justify-center py-12">
                                                <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                                                <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verifying Status...</p>
                                            </div>
                                        ) : isEnrolled ? (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mx-auto mb-6">
                                                    <CheckCircle2 size={32} />
                                                </div>
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Already Enrolled</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 px-4">You have already secured access to this curriculum. Welcome back!</p>
                                                <button
                                                    onClick={() => navigate(`/courses/${courseId}/learn`)}
                                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                                >
                                                    Enter Classroom
                                                    <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <AnimatePresence mode="wait">
                                                {paymentMethod === 'stripe' ? (
                                                    <motion.div
                                                        key="stripe"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                    >
                                                        <Elements stripe={stripePromise}>
                                                            <CheckoutForm 
                                                                amount={amount} 
                                                                courseId={courseId} 
                                                                type={courseId ? 'course_enrollment' : 'general'}
                                                                onSuccess={handleSuccess} 
                                                            />
                                                        </Elements>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="paystack"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        className="space-y-4"
                                                    >
                                                        <button
                                                            onClick={handlePaystack}
                                                            disabled={isProcessing || amount < minAmount}
                                                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
                                                        >
                                                            {isProcessing ? (
                                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            ) : (
                                                                <>
                                                                    Mobile Checkout
                                                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                                </>
                                                            )}
                                                        </button>
                                                        
                                                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                                                                Optimized for MoMo, Card, and Bank transfers. Encrypted by Paystack.
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
                                            <Globe size={18} />
                                            <ShieldCheck size={18} />
                                            <Lock size={18} />
                                        </div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Lock size={10} className="text-emerald-500" />
                                            SSL Secured Pipe
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 bg-emerald-50 dark:bg-emerald-500/5 rounded-3xl border border-emerald-100 dark:border-emerald-500/20">
                                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-400 mb-2 flex items-center gap-2">
                                        <CheckCircle size={16} />
                                        Auto-Enrollment
                                    </h4>
                                    <p className="text-[11px] text-emerald-700/70 dark:text-emerald-400/60 leading-relaxed font-medium">
                                        You will be redirected to your scholarship classroom immediately upon payment confirmation.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Checkout;
