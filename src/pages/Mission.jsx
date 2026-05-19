import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Users, Globe, ArrowRight, Heart, Sparkles, AlertTriangle, CheckCircle2, Scale, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/ui/Footer';

const Mission = () => {
    const navigate = useNavigate();

    const pillars = [
        {
            icon: Shield,
            title: "Authentic Curation",
            desc: "We don't claim to be a house of scholars. Our team of learned Muslims meticulously curates resources from verified platforms such as Yaqeen Institute, Towards Eternity, and other authentic sources, structuring them into a cohesive curriculum."
        },
        {
            icon: Sparkles,
            title: "Designed for Growth",
            desc: "We take scattered sacred knowledge and design it into beautiful, structured, and institutional courses. Our mission is to make the path of seeking knowledge clear and visually engaging for the modern student."
        },
        {
            icon: Heart,
            title: "Stewardship of Truth",
            desc: "By aggregating the best research and scholarly works, we ensure that you are learning from the most reliable voices in the Ummah, presented through a rigorous educational framework."
        }
    ];

    const visionPoints = [
        {
            title: "The Information Crisis",
            desc: "Knowledge is currently scattered across thousands of disconnected videos and articles. We consolidate, verify, and structure it."
        },
        {
            title: "Authentic Sourcing",
            desc: "We rely on giants of research. Our team identifies authentic material, ensures it meets our high standards, and builds it into your learning path."
        },
        {
            title: "Building the Next Generation",
            desc: "Our vision is to raise a generation of Muslims who are grounded in their tradition through the best existing scholarly resources."
        }
    ];

    return (
        <div 
            className="min-h-screen bg-slate-50/40 text-[#0F172A] overflow-x-hidden safe-area-inset relative"
            style={{
                backgroundImage: 'radial-gradient(rgba(0, 120, 212, 0.04) 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
            }}
        >
            
            {/* Hero Section */}
            <section className="relative pt-16 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 overflow-hidden">
                {/* Background Gradient Orb */}
                <div className="absolute top-4 sm:top-8 right-0 w-72 sm:w-96 md:w-[500px] h-72 sm:h-96 md:h-[500px] bg-[#EFF6FF] rounded-full blur-[90px] sm:blur-[100px] md:blur-[110px] pointer-events-none" />
                
                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-3 sm:mb-4 md:mb-6"
                    >
                        <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#EFF6FF] text-[#0078D4] text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest border border-[#C8E0F4]">
                            ✦ Our Mission
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-center"
                    >
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-2 sm:mb-3 md:mb-4 tracking-tight leading-tight uppercase font-display">
                            Structuring the <br className="hidden sm:block" />
                            <span className="text-[#0078D4]">Ummah's Wisdom</span>
                        </h1>
                        
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#475569] leading-snug max-w-2xl mx-auto font-light px-2">
                            A global platform transforming verified Islamic research into structured, world-class education.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* The Vision Logic */}
            <section className="py-12 sm:py-16 md:py-20 bg-white/40 backdrop-blur-md border-y border-[#E2E8F0] relative">
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-600/5 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {pillars.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="text-center group p-6 sm:p-8 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E2E8F0] hover:border-[#0078D4]/20 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-300"
                            >
                                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-4 mx-auto group-hover:bg-[#DEEEFF] transition-all border border-[#C8E0F4]">
                                    <item.icon className="w-6 sm:w-7 h-6 sm:h-7 text-[var(--color-primary)]" />
                                </div>
                                <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] mb-3 uppercase tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-[#475569] leading-relaxed text-xs sm:text-sm">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The "Why" - Detailed */}
            <section className="py-16 sm:py-20 md:py-24 bg-white/30 backdrop-blur-md relative">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-start lg:items-center">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-[var(--color-primary)]/10 blur-2xl rounded-[3rem] hidden sm:block" />
                            <div className="relative aspect-[4/5] bg-[#003D6B] border border-[#005A9E] rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-6 sm:p-8 md:p-12 flex flex-col justify-end overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="relative z-10">
                                    <Globe className="text-[var(--color-primary)] w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 mb-4 sm:mb-6" />
                                    <blockquote className="text-lg sm:text-xl md:text-2xl font-bold italic text-white mb-4 sm:mb-6">
                                        "Knowledge is the soul of Islam. It is the light that prevents the Ummah from falling into the darkness of ignorance."
                                    </blockquote>
                                    <p className="text-[var(--color-primary)] font-bold uppercase tracking-widest text-[10px] sm:text-xs">The Vision for 2030</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4 sm:mb-6 tracking-tighter uppercase italic">Solving the Knowledge Gap</h2>
                            <div className="space-y-6">
                                {visionPoints.map((point, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="text-[#C8E0F4] text-3xl font-extrabold italic flex-shrink-0">0{idx + 1}</div>
                                        <div>
                                            <h4 className="text-lg font-extrabold text-[#0F172A] mb-1 uppercase">{point.title}</h4>
                                            <p className="text-[#475569] leading-snug text-sm">{point.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 sm:py-20 bg-[var(--color-primary)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter">Support the Eternal Legacy</h2>
                    <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto font-bold">
                        We are a 100% donation-funded platform. Every contribution directly funds the curation and development of our curricula.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => navigate('/donate')}
                            className="px-10 py-5 bg-white text-[var(--color-primary)] rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl w-full sm:w-auto hover:brightness-110"
                        >
                            Become a Supporter
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Mission;
