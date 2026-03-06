import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, Globe, Sparkles, CheckCircle2, ArrowRight, CreditCard, Gift, Coffee, BookOpen, Users, Building, Crown, Trophy, Star, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../components/ui/Footer';

const Donate = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedAmount, setSelectedAmount] = useState(50);
    const [donationType, setDonationType] = useState('monthly'); // 'monthly' or 'one-time'
    const [showSuccess, setShowSuccess] = useState(searchParams.get('success') === 'true');


    // Impact Tiers for Slider
    const getTier = (amount) => {
        if (amount < 50) return { name: "Supporter", icon: Heart, color: "text-slate-500" };
        if (amount < 200) return { name: "Seeker Sponsor", icon: Users, color: "text-emerald-500" };
        if (amount < 1000) return { name: "Knowledge Patron", icon: BookOpen, color: "text-sky-500" };
        return { name: "Legacy Builder", icon: Crown, color: "text-amber-500" };
    };

    const currentTier = getTier(selectedAmount);

    const waqfOptions = [
        {
            id: 'student',
            title: "Sponsor a Seeker",
            desc: "Provide resources and platform access for a dedicated student.",
            icon: Users,
            cost: 50,
            color: "emerald"
        },
        {
            id: 'library',
            title: "Curate Knowledge",
            desc: "Fund the team structuring authentic works into modern courses.",
            icon: BookOpen,
            cost: 100,
            color: "blue"
        },
        {
            id: 'scholar',
            title: "Resource Research",
            desc: "Help us license and access the world's most authentic platforms.",
            icon: Sparkles,
            cost: 250,
            color: "purple"
        },
        {
            id: 'infrastructure',
            title: "Global Platform",
            desc: "Scale our infrastructure to reach millions globally.",
            icon: Building,
            cost: 1000,
            color: "amber"
        }
    ];

    const handleDonation = () => {
        navigate(`/checkout?title=General Platform Donation (${donationType})&minAmount=${selectedAmount}&isDonation=true`);
    };

    return (
        <div className="min-h-screen bg-[#0A1120] text-white selection:bg-emerald-500/30 overflow-x-hidden safe-area-inset">
            
            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-slate-900 border border-emerald-500/30 p-6 sm:p-8 rounded-2xl sm:rounded-3xl max-w-md w-full text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                            <button 
                                onClick={() => {
                                    setShowSuccess(false);
                                    setSearchParams({});
                                }}
                                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg touch-manipulation"
                            >
                                <X size={24} className="sm:w-5 sm:h-5" />
                            </button>

                            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-emerald-500">
                                <CheckCircle2 size={40} className="sm:w-12 sm:h-12" />
                            </div>

                            <h2 className="text-xl sm:text-2xl font-black mb-2 uppercase tracking-tight">JazakAllah Khair!</h2>
                            <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8">
                                Your contribution has been received. 
                                We are already putting it to work for the Ummah.
                            </p>

                            <button 
                                onClick={() => {
                                    setShowSuccess(false);
                                    setSearchParams({});
                                }}
                                className="w-full py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all active:bg-emerald-700 touch-manipulation min-h-[44px]"
                            >
                                Back to Platform
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. HERO: The "Akhira Portfolio" Concept */}
            <section className="relative pt-16 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 overflow-hidden">
                {/* Background Gradient Orb */}
                <div className="absolute top-4 sm:top-10 right-0 w-72 sm:w-96 md:w-[600px] h-72 sm:h-96 md:h-[600px] bg-emerald-600/15 rounded-full blur-[90px] sm:blur-[110px] md:blur-[128px] pointer-events-none" />
                
                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-3 sm:mb-4"
                    >
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                            <Sparkles size={14} /> Sadaqah Jariyah
                        </div>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-center"
                    >
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 sm:mb-3 tracking-tight leading-tight uppercase font-display">
                            Build Your <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300">Eternal Legacy</span>
                        </h1>
                        
                        <p className="text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-light">
                            Support authentic Islamic scholarship structured for modern learners. Your contribution funds the curation, research, and delivery of world-class Islamic education.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. INTERACTIVE WAQF BUILDER */}
            <section className="py-12 -mt-10 px-4 relative z-20 pb-20">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12">
                            
                            {/* LEFT: The "Game Board" / Selection */}
                            <div className="lg:col-span-7 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-700">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm">1</span>
                                    Select Your Impact Area
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                    {waqfOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setSelectedAmount(option.cost)}
                                            className={`p-5 rounded-2xl border text-left transition-all duration-300 group hover:scale-[1.02] ${
                                                selectedAmount === option.cost 
                                                ? `bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]` 
                                                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                                            }`}
                                        >
                                            <div className={`w-11 h-11 rounded-xl mb-3 flex items-center justify-center transition-colors ${
                                                selectedAmount === option.cost ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-emerald-400'
                                            }`}>
                                                <option.icon size={22} />
                                            </div>
                                            <h4 className={`font-bold text-base mb-1 ${selectedAmount === option.cost ? 'text-white' : 'text-slate-300'}`}>{option.title}</h4>
                                            <p className="text-xs text-slate-500">{option.desc}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Amount Slider */}
                                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
                                    <div className="flex justify-between mb-3">
                                        <label className="font-bold text-slate-400 text-xs uppercase tracking-wider">Custom Contribution</label>
                                        <div className="flex items-center gap-1 text-emerald-400 font-bold">
                                            <span>$</span>
                                            <input 
                                                type="number"
                                                value={selectedAmount}
                                                onChange={(e) => setSelectedAmount(parseInt(e.target.value) || 0)}
                                                className="bg-transparent w-20 outline-none text-right font-mono"
                                            />
                                        </div>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="10" 
                                        max="2000" 
                                        step="10"
                                        value={selectedAmount} 
                                        onChange={(e) => setSelectedAmount(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <div className="flex justify-between mt-2 text-xs text-slate-600 font-mono">
                                        <span>$10</span>
                                        <span>$2000+</span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: The "Impact Visualization" & Payment */}
                            <div className="lg:col-span-5 p-6 md:p-10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900/20 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm">2</span>
                                            Finalize Info
                                        </h3>
                                        {/* Tier Badge */}
                                        <div className={`px-3 py-1 rounded-full border ${currentTier.color.replace('text', 'border')} ${currentTier.color.replace('text', 'bg')}/10 flex items-center gap-2`}>
                                            <currentTier.icon size={14} className={currentTier.color} />
                                            <span className={`text-xs font-black uppercase ${currentTier.color}`}>{currentTier.name}</span>
                                        </div>
                                    </div>

                                    {/* Real-time Impact Card */}
                                    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 shadow-xl mb-6 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-all duration-500" />
                                        
                                        <div className="relative z-10">
                                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Empowering Digital Da'wah</p>
                                            <div className="flex items-end gap-2 mb-3">
                                                <span className="text-4xl font-black text-white">{Math.floor(selectedAmount / 20)}</span>
                                                <span className="text-lg font-bold text-emerald-400 mb-1">Growth Units</span>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed">
                                                By funding <span className="text-white font-bold">${selectedAmount}</span>, you allow our curators to extract and structure authentic insights for roughly {Math.floor(selectedAmount / 20)} new seekers.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Recurring Toggle */}
                                    <div className="flex p-1 bg-slate-800 rounded-xl mb-6">
                                        <button 
                                            onClick={() => setDonationType('monthly')}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${donationType === 'monthly' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Monthly (Recommended)
                                        </button>
                                        <button 
                                            onClick={() => setDonationType('one-time')}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${donationType === 'one-time' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            One-time
                                        </button>
                                    </div>
                                </div>

                                {/* Checkout Buttons */}
                                <div className="space-y-3">
                                    <button 
                                        onClick={handleDonation}
                                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:text-slate-400 text-white rounded-xl font-bold text-base shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <>
                                            <span>Continue to Checkout ${selectedAmount}</span>
                                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    </button>
                                </div>
                                <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-[0.2em]">
                                    256-Bit SSL Secured • Instant Tax Receipt
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

             {/* Transparency Section */}
             <section className="py-16 sm:py-20 border-t border-slate-800/50 bg-[#080d1a]">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-black mb-8 tracking-tight uppercase italic">Our Content Philosophy</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                           <Globe size={28} className="text-emerald-500 mb-4" />
                           <h4 className="font-bold text-lg mb-2">Global Curation</h4>
                           <p className="text-slate-400 text-xs leading-relaxed">
                               We don't claim to be primary scholars. We are learned curators who utilize verified work from established authorities like **Yaqeen Institute**, **Toward Eternity**, and high-level academic platforms.
                           </p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                           <Shield size={28} className="text-emerald-500 mb-4" />
                           <h4 className="font-bold text-lg mb-2">Structured Path</h4>
                           <p className="text-slate-400 text-xs leading-relaxed">
                               We bridge the gap between "consuming videos" and "structured seeking." We take authentic source material and organize it into curricula designed for modern attention spans.
                           </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Donate;
