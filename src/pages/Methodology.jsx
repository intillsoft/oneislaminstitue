import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Settings, Zap, Globe, Shield, Sparkles, Filter, Layout, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/ui/Footer';

const Methodology = () => {
    const navigate = useNavigate();

    const processSteps = [
        {
            icon: Filter,
            title: "Authentic Sourcing",
            desc: "We exclusively source content from world-renowned, verified platforms and institutions like Yaqeen Institute, Toward Eternity, and traditional academic repositories. Our team of learned researchers ensures that every seed of knowledge has a sound root."
        },
        {
            icon: Layout,
            title: "Pedagogical Structuring",
            desc: "Information is not knowledge. We take raw lectures and research papers and restructure them into a cohesive academic curriculum. We break down complex concepts into digestible modules with clear learning objectives."
        },
        {
            icon: Cpu,
            title: "Modern Delivery",
            desc: "We leverage cutting-edge educational technology to transform traditional texts into interactive experiences. Our platform uses active recall, spaced repetition, and digital assessments to ensure retention."
        },
        {
            icon: Shield,
            title: "Peer Review",
            desc: "Before a course goes live, it undergoes a rigorous review process by our internal board of educators to ensure clarity, theological accuracy, and pedagogical excellence."
        }
    ];

    const sources = [
        "Yaqeen Institute",
        "Toward Eternity",
        "Traditional Manuscripts",
        "Verified Academic Journals",
        "Classical Scholarly Works",
        "Authenticated Hadith Repositories"
    ];

    return (
        <div 
            className="min-h-screen bg-slate-50/40 text-[#0F172A] overflow-x-hidden safe-area-inset relative"
            style={{
                backgroundImage: 'radial-gradient(rgba(0, 120, 212, 0.04) 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
            }}
        >
            
            {/* 1. HERO */}
            <section className="relative pt-16 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 overflow-hidden">
                {/* Background Gradient Orb */}
                <div className="absolute top-4 sm:top-10 left-1/2 -translate-x-1/2 w-72 sm:w-96 md:w-[600px] h-72 sm:h-96 md:h-[600px] bg-[#EFF6FF] rounded-full blur-[90px] sm:blur-[110px] md:blur-[128px] pointer-events-none" />
                
                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-3 sm:mb-4"
                    >
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#EFF6FF] border border-[#C8E0F4] text-[#0078D4] font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                            <Settings size={14} /> Science of Curation
                        </div>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-center"
                    >
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-3 tracking-tight leading-tight uppercase font-display">
                            How We <br className="hidden sm:block" />
                            <span className="text-[#0078D4]">Build Curricula</span>
                        </h1>
                        
                        <p className="text-sm sm:text-base md:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto font-light">
                            From authentic sources to interactive learning experiences—our methodology bridges classical scholarship with modern pedagogical science.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. THE CURATION PIPELINE */}
            <section className="py-16 sm:py-20 px-4 relative overflow-hidden bg-white/40 backdrop-blur-md border-y border-[#E2E8F0]">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-3 text-[#0F172A]">From Source to Student</h2>
                        <div className="h-1.5 w-24 bg-[#0078D4] mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {processSteps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0078D4]/20 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mb-4 border border-[#C8E0F4] group-hover:scale-110 transition-transform">
                                    <step.icon className="w-7 h-7 text-[#0078D4]" />
                                </div>
                                <h3 className="text-lg font-extrabold mb-3 tracking-tight uppercase italic text-[#0F172A]">{step.title}</h3>
                                <p className="text-[#475569] leading-relaxed">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. TRUSTED SOURCES DISPLAY */}
            <section className="py-16 sm:py-20 bg-white/40 backdrop-blur-md border-b border-[#E2E8F0] relative">
                <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
                    <h3 className="text-xs font-bold text-[#0078D4] uppercase tracking-[0.3em] mb-8">Authorized Base Sources</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {sources.map((source, idx) => (
                            <div key={idx} className="px-6 py-3 rounded-xl bg-white border border-[#E2E8F0] font-bold text-[#475569] hover:text-[#0078D4] hover:border-[#0078D4] hover:shadow-lg hover:shadow-[var(--color-primary)]/5 transition-all cursor-default duration-300">
                                {source}
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-[#94A3B8] text-xs max-w-2xl mx-auto italic">
                        *While we curate content from these institutions, Hope Dawah Institute is an independent entity focused on pedagogical structuring.
                    </p>
                </div>
            </section>

            {/* 4. CTA */}
            <section className="py-16 sm:py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tighter uppercase italic text-[#0F172A]">Ready to see the results?</h2>
                    <p className="text-[#475569] text-base mb-8 max-w-xl mx-auto">
                        Experience our methodology firsthand in any of our curated learning paths.
                    </p>
                    <button 
                        onClick={() => navigate('/courses')}
                        className="px-10 py-5 bg-[#0078D4] hover:bg-[#005A9E] text-white rounded-2xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 mx-auto" style={{ boxShadow: '0 4px 16px rgba(0,120,212,0.3)' }}
                    >
                        <span>Browse Courses</span>
                        <Zap size={18} className="fill-white" />
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Methodology;
