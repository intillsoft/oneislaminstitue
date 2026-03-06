import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Globe, Award, CheckCircle2, ArrowRight, UserPlus, FileText, Upload, Mic2, User, Mail, Book, MessageSquare, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { teamService } from '../services/teamService';
import { useToast } from '../components/ui/Toast';
import Footer from '../components/ui/Footer';

const JoinTeam = () => {
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

    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const benefits = [
        {
            icon: Globe,
            title: "Global Reach",
            desc: "Teach students from over 40 countries without leaving your study. Amplify your impact."
        },
        {
            icon: Users,
            title: "Dedicated Support",
            desc: "Our team handles the technology, marketing, and student administration. You focus on teaching."
        },
        {
            icon: Mic2,
            title: "World-Class Tools",
            desc: "Use our 'Lesson Architect' and studio-grade streaming tools to deliver pristine content."
        },
        {
            icon: Award,
            title: "Preserve Your Legacy",
            desc: "Digitize your knowledge into a structured curriculum that benefits generations to come."
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A1120] selection:bg-emerald-500/30">
            {/* Hero */}
            <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 overflow-hidden bg-slate-50 dark:bg-[#080d1a]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy-dark.png')] opacity-[0.03]" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-4 sm:mb-6 border border-emerald-100 dark:border-emerald-500/20">
                            Research & Curation
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight leading-[1.2] sm:leading-[1.1]">
                            Build the Ultimate <br className="hidden sm:block" />
                            <span className="text-emerald-600 dark:text-emerald-500">Learning Platform</span>
                        </h1>
                        <p className="text-sm sm:text-base md:text-xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
                            We are looking for dedicated individuals to join our team. Whether you're a learned instructor, a curriculum designer, a skilled software engineer, or a community builder, help us structure and distribute authentic Islamic content globally.
                        </p>
                        
                        <div className="flex justify-center sm:flex-row flex-col gap-3 px-4 sm:px-0">
                            <button 
                                onClick={scrollToForm}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl sm:rounded-2xl font-black transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] sm:text-xs"
                            >
                                <UserPlus size={16} className="sm:w-[18px] sm:h-[18px]" /> Apply to Join
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 transition-colors group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Application Steps */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Application Process</h2>
                        <p className="text-slate-500 dark:text-slate-400">Our vetting process ensures the highest standard of instruction.</p>
                    </div>

                    <div className="space-y-12 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 z-0" />

                        {[
                            {
                                step: 1,
                                title: "Verified Competency",
                                desc: "Submit your academic background in Islamic Sciences to ensure you can identify authentic sources."
                            },
                            {
                                step: 2,
                                title: "Methodology Review",
                                desc: "A discussion on our curation standards: how we source from platforms like Yaqeen and Towards Eternity."
                            },
                            {
                                step: 3,
                                title: "Curation Sample",
                                desc: "Structure a specific topic into a learning module following our 'Lesson Architect' guidelines."
                            },
                            {
                                step: 4,
                                title: "Deployment",
                                desc: "Join the team and start building courses that will reach thousands of students globally."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="relative z-10 flex gap-6">
                                <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-black flex items-center justify-center font-black text-xl text-emerald-600 shadow-sm flex-shrink-0">
                                    {item.step}
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 max-w-lg">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements Box */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-8">Role Requirements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                            {[
                                "Passion for the mission and strong competency in your field",
                                "For curators: Familiarity with platforms like Yaqeen Institute",
                                "For engineers/designers: High technical ability and design sense",
                                "Alignment with Ahlu as-Sunnah wa'l-Jama'ah",
                                "Attention to detail and a spirit of excellence (Ihsan)",
                                "Willingness to collaborate in a high-impact environment"
                            ].map((req, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                    <span className="text-sm font-medium">{req}</span>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={scrollToForm}
                            className="mt-12 px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Application Form */}
            <section id="apply-form" className="py-24 px-4 bg-[#0A1120] border-t border-slate-800">
                <div className="max-w-4xl mx-auto">
                    {isSubmitted ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 border border-emerald-500/30 p-10 rounded-[3rem] text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4 uppercase italic">JazakAllah Khair</h2>
                            <p className="text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto">
                                Your application to join the team has been received. Our team will review your profile and reach out via <span className="text-white font-bold">{formData.email}</span> within 5-7 business days.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-[3.5rem] shadow-2xl"
                        >
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-black text-white mb-4 uppercase">Submit Application</h2>
                            </div>
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
                                                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-14 pr-6 focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-600 text-white"
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
                                                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-14 pr-6 focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-600 text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Area of Expertise / Role</label>
                                    <div className="relative">
                                        <Book className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input 
                                            required
                                            type="text"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            placeholder="e.g. Instructor, Software Engineer, Curriculum Designer"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-14 pr-6 focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-600 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Select Experience Level</label>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {['Academic', 'Engineer', 'Designer', 'Creative'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, experience: type.toLowerCase() })}
                                                className={`py-3 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all ${formData.experience === type.toLowerCase() ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-emerald-500/50'}`}
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
                                            placeholder="Tell us about your background and how you want to contribute to our mission..."
                                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-14 pr-6 focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-600 text-white resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button 
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <span className="animate-pulse">Processing...</span> : (
                                            <React.Fragment>
                                                <span>Send Application</span>
                                                <Send size={18} />
                                            </React.Fragment>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default JoinTeam;
