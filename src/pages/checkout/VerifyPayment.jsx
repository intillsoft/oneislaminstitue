import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, XCircle, ArrowRight } from 'lucide-react';
import api from '../../lib/api';
import { useToast } from '../../components/ui/Toast';

const VerifyPayment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { success, error: showError } = useToast();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Please wait while we confirm your payment...');

    const reference = searchParams.get('reference') || searchParams.get('trxref') || searchParams.get('trs_ref');
    const provider = searchParams.get('provider') || 'paystack';
    const courseId = searchParams.get('courseId');

    useEffect(() => {
        const verify = async () => {
            if (!reference || reference === '{{reference}}' || reference === '{{trxref}}') {
                setStatus('error');
                setMessage('Invalid payment reference received. Please try again.');
                return;
            }

            try {
                const { data } = await api.post('/donations/verify', {
                    reference,
                    provider
                });

                if (data.success) {
                    setStatus('success');
                    setMessage('Payment verified successfully! JazakAllah Khair.');
                    success('Payment successful! You are now enrolled.');
                    
                    // Delay redirect to show success state
                    setTimeout(() => {
                        if (courseId) {
                            navigate(`/courses/${courseId}/onboarding`);
                        } else {
                            navigate('/dashboard');
                        }
                    }, 2000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Payment verification failed.');
                }
            } catch (err) {
                console.error('Verification error:', err);
                setStatus('error');
                // Extract more specific error if available
                const errorDetail = err.response?.data?.error || err.response?.data?.message || err.message;
                setMessage(`Verification failed: ${errorDetail}`);
            }
        };

        verify();
    }, [reference, provider, courseId, navigate, success]);

    return (
        <div className="min-h-screen bg-[#0A1120] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 animate-pulse" />
                
                <div className="relative z-10">
                    {status === 'verifying' && (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Verifying Payment</h1>
                            <p className="text-slate-400">{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">BarakAllah!</h1>
                            <p className="text-slate-400 mb-8">{message}</p>
                            <button 
                                onClick={() => navigate(courseId ? `/courses/${courseId}/onboarding` : '/dashboard')}
                                className="flex items-center gap-2 text-emerald-500 font-bold hover:text-emerald-400 transition-colors"
                            >
                                Start Onboarding <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6">
                                <XCircle className="w-10 h-10 text-rose-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                            <p className="text-slate-400 mb-8">{message}</p>
                            <button 
                                onClick={() => navigate('/checkout')}
                                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
                            >
                                Back to Checkout
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyPayment;
