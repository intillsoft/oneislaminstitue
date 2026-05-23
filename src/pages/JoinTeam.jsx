import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Users, Globe, Award, CheckCircle2, ArrowRight, UserPlus, FileText, Upload, Mic2, User, Mail, Book, MessageSquare, Send, Sparkles, Shield, HeartHandshake } from 'lucide-react';
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

    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const benefits = [
        {
            icon: Globe,
            title: "Global Distribution",
            desc: "Reach and structure educational paths for seekers in over 40 countries, maximizing long-term legacy."
        },
        {
            icon: Users,
            title: "Dedicated Administration",
            desc: "Our platform takes care of infrastructure, systems, and active study tracking. You focus entirely on knowledge design."
        },
        {
            icon: Mic2,
            title: "Professional Architecture",
            desc: "Leverage our premium lesson builder and modular text systems to structure pristine, beautiful study modules."
        },
        {
            icon: Award,
            title: "Preserve Academic Legacy",
            desc: "Digitize classical insights into progressive curriculums designed to benefit students for generations."
        }
    ];

    const timelineSteps = [
        {
            step: 1,
            title: "Verified Competency",
            desc: "Provide details of your academic background in Islamic Sciences or secondary disciplines (engineering, design) to establish verified baseline capability."
        },
        {
            step: 2,
            title: "Methodology Alignment",
            desc: "Participate in a collaborative review regarding our academic curation standards, highlighting peer-validation and pedagogical integrity."
        },
        {
            step: 3,
            title: "Curation & Design Sample",
            desc: "Receive a topic framework and structure it into a progressive lesson module following our clean institutional guidelines."
        },
        {
            step: 4,
            title: "Active Integration",
            desc: "Formally join the curation team, coordinate with colleagues, and begin designing public learning paths."
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#070b19] text-foreground selection:bg-[var(--color-primary)]/20 transition-colors duration-300 overflow-x-hidden relative">
            
            {/* Background Mesh Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
            <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

            {/* Hero Section */}
            <section className="relative pt-36 pb-20 px-4 md:px-8 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.25em] mb-8">
                        <Sparkles size={13} /> Join Academic Curation
                    </span>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 uppercase">
                        Shape the Future of <br className="hidden sm:block" />
                        <span className="text-[var(--color-primary)]">Islamic Curation</span>
                    </h1>
                    
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light mb-10">
                        Help us preserve, structure, and distribute authenticated Islamic content to modern seekers globally. We look for passionate educators, curriculum designers, software engineers, and community organizers.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={scrollToForm}
                            className="px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-2xl font-bold uppercase tracking-wider text-xs w-full sm:w-auto shadow-lg shadow-emerald-950/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <UserPlus size={15} />
                            Apply to Curation Team
                        </button>
                        <button 
                            onClick={() => navigate('/about')}
                            className="px-8 py-4 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-foreground dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl font-bold uppercase tracking-wider text-xs w-full sm:w-auto transition-all active:scale-95"
                        >
                            Learn Our Methodology
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Benefits Grid */}
            <section className="py-20 bg-slate-50 dark:bg-[#0c1228]/40 border-y border-slate-100 dark:border-white/5 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-[0.3em] mb-3 block">Why Curate With Us</span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">The Power of Structural Design</h3>
                    </div>

                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {benefits.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                className="p-8 rounded-3xl bg-white dark:bg-[#0f152d]/60 backdrop-blur-md border border-slate-200/60 dark:border-white/5 hover:border-[var(--color-primary)]/20 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col items-center text-center"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                                    <item.icon className="w-6 h-6 text-[var(--color-primary)]" />
                                </div>
                                <h4 className="text-base font-extrabold uppercase tracking-wide mb-3 group-hover:text-[var(--color-primary)] transition-colors">{item.title}</h4>
                                <p className="text-muted-foreground text-xs leading-relaxed font-light">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Application Steps (Sleek timeline) */}
            <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-[0.3em] mb-3 block">Timeline & Road</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">Our Curation Vetting Pipeline</h3>
                    <p className="text-muted-foreground text-sm font-light mt-3 max-w-xl mx-auto">
                        To maintain rigorous academic integrity, our pipeline ensures that all curators meet professional standards.
                    </p>
                </div>

                <div className="space-y-12 relative">
                    {/* Connecting Timeline Line */}
                    <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-slate-100 dark:bg-white/5 z-0" />

                    {timelineSteps.map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="relative z-10 flex gap-6 sm:gap-8 group"
                        >
                            <div className="w-14 h-14 rounded-full bg-white dark:bg-[#0f152d] border-4 border-slate-50 dark:border-[#070b19] flex items-center justify-center font-black text-lg text-[var(--color-primary)] shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0">
                                {item.step}
                            </div>
                            <div className="pt-2">
                                <h4 className="text-base font-extrabold uppercase tracking-wider text-foreground mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                    {item.title}
                                </h4>
                                <p className="text-muted-foreground text-xs sm:text-sm font-light leading-relaxed max-w-2xl">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

             {/* Vetting Panel Info */}
             <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-50 dark:bg-[#0c1228]/80 border border-slate-200/80 dark:border-white/[0.04] p-8 sm:p-12 md:p-16 text-center shadow-lg dark:shadow-2xl">
                     {/* Soft glowing mesh */}
                     <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 dark:from-[#0A3D25]/30 to-transparent dark:to-slate-950 pointer-events-none" />
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-[80px] pointer-events-none" />
 
                     <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                         <div className="flex justify-center mb-2">
                             <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                 <Shield size={22} className="animate-pulse" />
                             </div>
                         </div>
                         
                         <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)] block">Rigorous Academic Standards</span>
                         <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                             Curation Requirements
                         </h3>
 
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto pt-6">
                             {[
                                 "Deep competence, academic credentials, or high technical capacity",
                                 "Commitment to strict accuracy, verification, and referencing",
                                 "Attention to pedagogical detail and digital learning standards",
                                 "High alignment with traditional creed and consensus values",
                                 "Capacity for collaboration and constructive peer-review editing",
                                 "Willingness to contribute in a high-impact, non-commercial environment"
                             ].map((req, i) => (
                                 <div key={i} className="flex items-start gap-3 bg-white/60 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                                     <CheckCircle2 size={16} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                                     <span className="text-slate-700 dark:text-white/80 text-xs font-light leading-relaxed">{req}</span>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
             </section>

            {/* Application Form Section (Highly polished, fully theme-adaptive) */}
            <section id="apply-form" className="py-24 bg-slate-50 dark:bg-[#0c1228]/40 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4">
                    <AnimatePresence mode="wait">
                        {isSubmitted ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white dark:bg-[#0f152d]/90 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 p-10 rounded-[3rem] text-center shadow-2xl"
                            >
                                <div className="w-20 h-20 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-8 text-[var(--color-primary)] shadow-inner">
                                    <CheckCircle2 size={48} className="animate-bounce" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-foreground dark:text-white mb-4 uppercase tracking-tight">JazakAllah Khair</h2>
                                <p className="text-muted-foreground mb-8 leading-relaxed max-w-lg mx-auto font-light text-sm">
                                    Your application has been received. Our vetting board will review your background and reach out via <span className="text-foreground dark:text-white font-bold">{formData.email}</span> within 5-7 business days.
                                </p>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95 shadow-md"
                                >
                                    Back to Home
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-[#0f152d]/80 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 p-8 sm:p-12 rounded-[3rem] shadow-xl"
                            >
                                <div className="text-center mb-10">
                                    <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-[0.3em] mb-2 block">Application Form</span>
                                    <h2 className="text-3xl font-extrabold text-foreground dark:text-white uppercase tracking-tight">Apply for Curator Role</h2>
                                    <p className="text-muted-foreground text-xs sm:text-sm font-light mt-2">Submit details of your academic or professional capability.</p>
                                </div>
                                
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
                                                    placeholder="e.g. Abdullah ibn Masud"
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
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Area of Expertise / Intended Field</label>
                                        <div className="relative">
                                            <Book className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                            <input 
                                                required
                                                type="text"
                                                name="specialization"
                                                value={formData.specialization}
                                                onChange={handleChange}
                                                placeholder="e.g. Fiqh, Seerah, Arabic Grammar, Curriculum Design, Engineering"
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/20 outline-none transition-all font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 text-foreground dark:text-white text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Focus Domain</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {['Academic', 'Engineer', 'Designer', 'Creative'].map((type) => (
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
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Motivation & Background Details</label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-5 top-5 text-muted-foreground" size={16} />
                                            <textarea 
                                                required
                                                name="motivation"
                                                value={formData.motivation}
                                                onChange={handleChange}
                                                rows="4"
                                                placeholder="Describe your credentials, academic focus, or design background and how you want to contribute..."
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
                        )}
                    </AnimatePresence>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default JoinTeam;
