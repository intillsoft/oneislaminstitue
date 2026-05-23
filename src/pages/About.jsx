import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Heart, Globe, ArrowRight, BookOpen, Settings, Filter, Layout, Cpu, CheckCircle2, Award, Info, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/ui/Footer';

const About = () => {
  const navigate = useNavigate();

  // Core Pillars of the Institute
  const pillars = [
    {
      icon: Shield,
      title: "Authentic Curation",
      desc: "We curate high-fidelity study paths. Our team of dedicated learned Muslims structures scattered resources from verified traditional databases, classical texts, and academic repositories into a cohesive, progressive curriculum."
    },
    {
      icon: Sparkles,
      title: "Designed for Growth",
      desc: "We synthesize raw traditional texts and digital lectures into beautiful, structured, and institutional course paths. Our mission is to make seekings of sacred knowledge visually clear, structured, and engaging."
    },
    {
      icon: Heart,
      title: "Stewardship of Truth",
      desc: "By aggregating the most trusted research and scholarly outputs in the Ummah, we ensure you learn from authentic classical frameworks, cross-referenced and structured with pedagogical excellence."
    }
  ];

  // Pedagogical Structuring Pipeline
  const pipelineSteps = [
    {
      icon: Filter,
      title: "Authentic Sourcing",
      desc: "We exclusively source curriculum materials from world-renowned, verified platforms and traditional academic databases. Every seed of knowledge has a validated, authentic root."
    },
    {
      icon: Layout,
      title: "Pedagogical Structuring",
      desc: "We compile scattered video essays and articles into cohesive, progressive academic roadmaps, breaking down deep theological concepts into sequential, digestible modules."
    },
    {
      icon: Cpu,
      title: "Modern Delivery",
      desc: "Traditional sciences are integrated into interactive digital environments. Our platforms leverage active recall, progress tracking, and secure knowledge checkpoints."
    },
    {
      icon: Shield,
      title: "Internal Vetting Board",
      desc: "Before any curriculum pathway is published to the public, it undergoes rigorous internal review to guarantee theological accuracy, educational clarity, and academic integrity."
    }
  ];

  // Core Authorized Bases
  const baseSources = [
    "Classical Manuscripts",
    "Verified Scholarly Databases",
    "Traditional Commentaries",
    "Verified Academic Journals",
    "Classical Scholarly Works",
    "Authenticated Hadith Repositories"
  ];

  // Vision Statements
  const visionPoints = [
    {
      title: "Addressing Scattered Data",
      desc: "Knowledge is currently scattered across thousands of disconnected channels. We consolidate, verify, and structure it."
    },
    {
      title: "Rigorous Aggregation",
      desc: "We rely on giants of research. Our team identifies authentic material, ensures it meets high criteria, and constructs it into your path."
    },
    {
      title: "Future of Digital Seekers",
      desc: "Our mission is to foster a globally accessible academic standard that is completely free of ads, paywalls, or premium commercial friction."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070b19] text-foreground overflow-x-hidden relative selection:bg-primary/20 transition-colors duration-300">
      
      {/* Background Subtle Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-4 md:px-8 max-w-7xl mx-auto text-center">
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 uppercase"
        >
          Preserving Legacy through <br />
          <span className="text-[var(--color-primary)]">Pedagogical Excellence</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light"
        >
          Hope Dawah Institute bridges classical traditional Islamic scholarship with modern educational frameworking, converting verified research into clean, structural learning pathways.
        </motion.p>
      </section>

      {/* Core Pillars Section */}
      <section className="py-20 bg-slate-50 dark:bg-[#0c1228]/40 border-y border-slate-100 dark:border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-[0.3em] mb-3 block">Our Core Pillars</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">The Foundation of Our Mission</h3>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {pillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-8 rounded-3xl bg-white dark:bg-[#0f152d]/60 backdrop-blur-md border border-slate-100 dark:border-white/5 hover:border-[var(--color-primary)]/20 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <pillar.icon className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h4 className="text-base font-extrabold uppercase tracking-wide mb-3 group-hover:text-[var(--color-primary)] transition-colors">{pillar.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed font-light">{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solving the Knowledge Gap (Editorial Asymmetric Section) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-[var(--color-primary)]/5 blur-2xl rounded-[3rem] pointer-events-none" />
            <div className="relative overflow-hidden bg-slate-50 dark:bg-[#0c1228] border border-slate-200/80 dark:border-white/5 rounded-[2.5rem] p-8 sm:p-12 flex flex-col justify-between shadow-lg dark:shadow-2xl hover:shadow-[0_20px_50px_rgba(4,120,87,0.15)] transition-all duration-500 group min-h-[420px]">
              {/* Soft overlay gradients */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/10 via-transparent to-emerald-500/5 opacity-80" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-primary)]/20 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-700" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Elegant Geometric Background Accent */}
              <div className="absolute top-6 right-8 opacity-[0.07] dark:opacity-[0.03] select-none pointer-events-none">
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-900 dark:text-white">
                  <path d="M50 0 L100 50 L50 100 L0 50 Z" stroke="currentColor" strokeWidth="1" fill="none" />
                  <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>

              {/* Icon Container */}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-emerald-500/10 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] shadow-inner mb-8 group-hover:rotate-6 transition-transform duration-300">
                  <Globe size={22} className="animate-pulse" />
                </div>
              </div>

              {/* Quote Block */}
              <div className="relative z-10 space-y-6">
                <span className="text-6xl font-serif text-[var(--color-primary)]/20 absolute -top-10 -left-4 select-none">“</span>
                <blockquote className="text-lg sm:text-xl md:text-2xl font-medium italic text-slate-800 dark:text-white/95 leading-relaxed tracking-wide">
                  "Knowledge is the soul of traditional heritage. It is the light that prevents the seeking heart from falling into ignorance."
                </blockquote>
                
                {/* Author Info */}
                <div className="border-t border-slate-200 dark:border-white/10 pt-5 flex items-center justify-between">
                  <div>
                    <p className="text-[var(--color-primary)] font-black uppercase tracking-[0.25em] text-[10px] sm:text-[11px]">Legacy of Wisdom</p>
                    <p className="text-slate-500 dark:text-white/60 text-[10px] mt-1 uppercase tracking-wider">Authentic Preservation, Digital Delivery</p>
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 dark:text-white/40 uppercase tracking-widest border border-slate-200 dark:border-white/10 rounded-full px-3 py-1 bg-slate-100 dark:bg-white/5 backdrop-blur-md">
                    Sunnah Creed
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-[0.3em] block">Solving the Knowledge Gap</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase leading-snug">A Unified Framework For Lifelong Seekers</h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
              We seek to address the modern digital overload. Instead of seeking scattered, raw resources across various feeds, seeking scholars are guided through progressive paths designed for deep, authentic retention.
            </p>
            <div className="space-y-6">
              {visionPoints.map((point, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="text-[var(--color-primary)]/30 text-2xl font-black italic leading-none">0{idx + 1}</div>
                  <div>
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground mb-1">{point.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed font-light">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Methodology Pipeline Section */}
      <section className="py-20 bg-slate-50 dark:bg-[#0c1228]/40 border-y border-slate-100 dark:border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-[0.3em] mb-3 block">Our Methodology</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">From Verified Source to Seeking Seeker</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pipelineSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="p-8 rounded-3xl bg-white dark:bg-[#0f152d] border border-slate-100 dark:border-white/5 hover:border-[var(--color-primary)]/20 shadow-sm hover:shadow-md transition-all duration-300 group flex gap-6"
              >
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <step.icon className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold uppercase tracking-wider mb-2 group-hover:text-[var(--color-primary)] transition-colors">{step.title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed font-light">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Vetted Platforms */}
      <section className="py-20 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-[0.3em] block">Verified Scholarly Foundations</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">Bases of Academic Aggregation</h3>
          
          <div className="flex flex-wrap justify-center gap-3">
            {baseSources.map((source, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03, y: -1 }}
                className="px-5 py-3 rounded-2xl bg-white dark:bg-[#0f152d] border border-slate-100 dark:border-white/5 text-foreground font-bold text-xs uppercase tracking-wider hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] shadow-sm cursor-default duration-300"
              >
                {source}
              </motion.div>
            ))}
          </div>
          
          <p className="text-muted-foreground text-[10px] italic max-w-xl mx-auto pt-4 leading-relaxed font-light">
            *Hope Dawah Institute operates as an independent academic curation entity. We specialize in pedagogical design, structuring authenticated learning tracks derived from these highly respected references.
          </p>
        </motion.div>
      </section>

      {/* High-Impact CTA Section - Floating Clean Card Style */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-50 dark:bg-[#0c1228]/80 border border-slate-200/80 dark:border-white/[0.04] p-8 sm:p-12 md:p-16 text-center shadow-lg dark:shadow-2xl">
          
          {/* Subtle glowing mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 dark:from-[#0A3D25]/30 to-transparent dark:to-slate-950 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <HeartHandshake size={22} />
              </div>
            </div>
            
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)] block">Support seeking knowledge</span>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight leading-none">
              Empower Global Seeking
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-light">
              Hope Dawah Institute is entirely funded through community sponsorships and donations. We pay zero premium commissions, allowing every single contribution to directly empower curriculum design and open-access education globally.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button 
                onClick={() => navigate('/courses')}
                className="px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-2xl font-bold uppercase tracking-wider text-xs w-full sm:w-auto shadow-lg shadow-emerald-950/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Browse Curricula
                <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => navigate('/donate')}
                className="px-8 py-4 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white border border-slate-300 dark:border-white/10 rounded-2xl font-bold uppercase tracking-wider text-xs w-full sm:w-auto transition-all active:scale-95"
              >
                Become a Supporter
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
