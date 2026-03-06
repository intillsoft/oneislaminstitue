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
        experience: 'intermediate'
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
            <div className="min-h-screen bg-[#0A1120] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-slate-900 border border-emerald-500/30 p-10 rounded-[3rem] text-center shadow-2xl"
                >
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 uppercase italic">JazakAllah Khair</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Your application to join the One Islam Curator Team has been received. Our team will review your profile and reach out via <span className="text-white font-bold">{formData.email}</span> within 5-7 business days.
                    </p>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all"
                    >
                        Back to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A1120] text-white selection:bg-emerald-500/30">
            <section className="relative pt-32 pb-20 px-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none" />
                
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-6 border border-emerald-500/20">
                                Join the Mission
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight uppercase font-display italic">
                                Curator Team <span className="text-emerald-500">Application</span>
                            </h1>
                            <p className="text-slate-400 max-w-xl mx-auto">
                                Help us curate and structure the world's most authentic knowledge for the next generation of seekers.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-[3.5rem] shadow-2xl"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input 
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Abdullah ibn Masud"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-14 pr-6 focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input 
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="abdullah@example.com"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-14 pr-6 focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Area of Expertise / Interest</label>
                                <div className="relative">
                                    <Book className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input 
                                        required
                                        type="text"
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        placeholder="e.g. Fiqh, Seerah, Modern Islamic Finance, Curriculum Design"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-14 pr-6 focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Select Experience Level</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['Academic', 'Teacher', 'Researcher', 'Creative'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, experience: type.toLowerCase() })}
                                            className={`py-3 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all ${formData.experience === type.toLowerCase() 
                                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-emerald-500/50'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Why do you want to join us?</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-5 top-5 text-slate-500" size={18} />
                                    <textarea 
                                        required
                                        name="motivation"
                                        value={formData.motivation}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Tell us about your background and how you want to contribute to our methodology..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-14 pr-6 focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-600 resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button 
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? <span className="animate-pulse">Processing...</span> : (
                                        <>
                                            <span>Send Application</span>
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[10px] text-slate-500 mt-6 uppercase font-bold tracking-widest">
                                    By submitting, you agree to our Terms of Curation and Peer Review.
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default ApplyTeam;
