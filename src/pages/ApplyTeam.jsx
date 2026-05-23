import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Book, MessageSquare, Send, CheckCircle2, ChevronRight, Sparkles, Shield, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { teamService } from '../services/teamService';
import { useToast } from '../components/ui/Toast';
import Footer from '../components/ui/Footer';

const ApplyTeam = () => {
    const navigate = useNavigate();
    const { success: toastSuccess, error: toastError } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialization: '',
        motivation: '',
        experience: 'academic'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await teamService.submitApplication(formData);
            if (result.success) {
                setIsSubmitted(true);
                toastSuccess("Application submitted! Check your email.");
            }
        } catch (err) {
            toastError("Failed to submit. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#070b19] flex items-center justify-center p-4 transition-colors duration-300">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white dark:bg-[#0f152d] border border-slate-200 dark:border-white/10 p-10 rounded-[3rem] text-center shadow-2xl"
                >
                    <div className="w-20 h-20 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-8 text-[var(--color-primary)] shadow-inner">
                        <CheckCircle2 size={48} className="animate-bounce" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-foreground dark:text-white mb-4 uppercase tracking-tight">JazakAllah Khair</h2>
                    <p className="text-muted-foreground mb-8 leading-relaxed text-sm font-light">
                        Your application to join the Curator Team has been received. Our team will review your profile and reach out via <span className="text-foreground dark:text-white font-bold">{formData.email}</span> within 5-7 business days.
                    </p>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all active:scale-[0.98] shadow-md"
                    >
                        Back to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#070b19] text-foreground selection:bg-[var(--color-primary)]/20 transition-colors duration-300 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
            
            <section className="relative pt-36 pb-20 px-4 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.25em] mb-6">
                            <Sparkles size={13} /> Join Curation Team
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight uppercase">
                            Curator Team <span className="text-[var(--color-primary)]">Application</span>
                        </h1>
                        <p className="text-muted-foreground max-w-xl mx-auto text-sm font-light leading-relaxed">
                            Help us structure and organize classical Islamic insights into progressive, beautifully designed curriculums for students globally.
                        </p>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-[#0f152d]/80 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 p-8 sm:p-12 rounded-[3rem] shadow-xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    <input 
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Abdullah ibn Masud"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/20 outline-none transition-all font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 text-foreground dark:text-white text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    <input 
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="abdullah@example.com"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/20 outline-none transition-all font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 text-foreground dark:text-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Area of Expertise / Focus Domain</label>
                            <div className="relative">
                                <Book className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input 
                                    required
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    placeholder="e.g. Fiqh, Seerah, Arabic Grammar, Curriculum Design, software"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/20 outline-none transition-all font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 text-foreground dark:text-white text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Select Focus Domain</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['Academic', 'Teacher', 'Researcher', 'Creative'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, experience: type.toLowerCase() })}
                                        className={`py-3 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all active:scale-[0.98] ${formData.experience === type.toLowerCase() 
                                            ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-md' 
                                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-muted-foreground hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Why do you want to join us?</label>
                            <div className="relative">
                                <MessageSquare className="absolute left-5 top-5 text-muted-foreground" size={16} />
                                <textarea 
                                    required
                                    name="motivation"
                                    value={formData.motivation}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Describe your background and how you wish to contribute to our academic or design methodology..."
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/20 outline-none transition-all font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 text-foreground dark:text-white resize-none text-sm leading-relaxed h-32"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full py-4.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 shadow-md shadow-emerald-950/10 disabled:opacity-50 min-h-[48px]"
                            >
                                {isSubmitting ? <span className="animate-pulse">Processing...</span> : (
                                    <>
                                        <span>Send Application</span>
                                        <Send size={15} />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[9px] text-muted-foreground mt-4 uppercase font-bold tracking-widest leading-none">
                                By submitting, you agree to our Terms of Curation and Collaborative Peer Review standards.
                            </p>
                        </div>
                    </form>
                </motion.div>
            </section>
            <Footer />
        </div>
    );
};

export default ApplyTeam;
