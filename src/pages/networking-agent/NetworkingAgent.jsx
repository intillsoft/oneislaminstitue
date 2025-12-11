import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Send, Copy, Check, CheckCircle, Linkedin, Mail, Twitter, Loader2, Sparkles, UserPlus } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';
import { useAIValidator } from '../../hooks/useAIValidator';
import { ValidationFeedback } from '../../components/ai/ValidationFeedback';

const NetworkingAgent = () => {
    const [formData, setFormData] = useState({
        recipientName: '',
        roleCompany: '',
        platform: 'linkedin',
        goal: 'advice',
        tone: 'professional',
        context: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const { success, error: showError } = useToast();
    const { validate, isValidating, validationResult, resetValidation } = useAIValidator();

    const handleGenerate = async () => {
        if (!formData.recipientName || !formData.roleCompany) {
            showError('Please fill in who you are contacting.');
            return;
        }

        // --- AI GUARD ---
        const validation = await validate('networking_message_context',
            `Recipient: ${formData.recipientName}, Role: ${formData.roleCompany}, Goal: ${formData.goal}, Context: ${formData.context}`
        );
        if (!validation.isValid) return;
        // ----------------

        setIsLoading(true);
        setMessage('');

        const prompt = `
      Write a networking outreach message for me.
      
      TARGET:
      Name: ${formData.recipientName}, Role/Company: ${formData.roleCompany}
      
      PLATFORM: ${formData.platform} (Limit length accordingly).
      GOAL: ${formData.goal} (e.g., coffee chat, referral, advice).
      TONE: ${formData.tone}.
      MY CONTEXT/HOOK: ${formData.context || "Standard professional introduction"}
      
      Output ONLY the message body, ready to copy-paste. No subject lines unless it's email.
    `;

        try {
            // Use lower temperature for more professional, templated output
            const result = await aiService.generateCompletion(prompt, {
                systemMessage: "You are an expert networking strategist.",
                temperature: 0.6
            });
            setMessage(result);
            success('Message generated!');
        } catch (err) {
            console.error('Generation failed:', err);
            showError('Failed to generate message.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(message);
        setCopied(true);
        success('Message copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Background Network Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
                <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
                <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                {/* Left Column: Input */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30"
                        >
                            <Share2 className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Networking <span className="text-purple-600 dark:text-purple-400">Agent</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                            Generate high-conversion outreach messages tailored for any platform.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-[#13182E] rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-800 space-y-8"
                    >
                        <ValidationFeedback
                            result={validationResult}
                            onDismiss={resetValidation}
                            onApplyFix={() => { }} // No auto-fix for context usually
                        />
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Contact</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={formData.recipientName}
                                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                        placeholder="Name (e.g. Jane)"
                                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                                    />
                                    <input
                                        type="text"
                                        value={formData.roleCompany}
                                        onChange={(e) => setFormData({ ...formData, roleCompany: e.target.value })}
                                        placeholder="Role @ Company"
                                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'linkedin', icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'hover:border-blue-500' },
                                        { id: 'email', icon: Mail, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'hover:border-amber-500' },
                                        { id: 'twitter', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'hover:border-sky-500' }
                                    ].map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => setFormData({ ...formData, platform: p.id })}
                                            className={`py-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${formData.platform === p.id
                                                ? `border-current ${p.color} ${p.bg} shadow-md scale-105`
                                                : `border-transparent bg-slate-50 dark:bg-[#1A2139] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${p.border}`
                                                }`}
                                        >
                                            <p.icon className={`w-6 h-6 ${formData.platform === p.id ? 'current-color' : ''}`} />
                                            <span className="capitalize text-xs font-bold">{p.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Goal</label>
                                    <select
                                        value={formData.goal}
                                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none font-medium text-sm"
                                    >
                                        <option value="advice">Seek Career Advice</option>
                                        <option value="referral">Request a Referral</option>
                                        <option value="sales">Pitch a Service/Product</option>
                                        <option value="connect">General Connection</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Tone</label>
                                    <select
                                        value={formData.tone}
                                        onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none font-medium text-sm"
                                    >
                                        <option value="professional">Professional</option>
                                        <option value="casual">Friendly & Casual</option>
                                        <option value="enthusiastic">Enthusiastic</option>
                                        <option value="direct">Direct</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Context / Hook</label>
                                <textarea
                                    value={formData.context}
                                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                                    placeholder="Examples: We met at X event, I read your article on Y, simple introduction..."
                                    className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm resize-none font-medium"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || isValidating || !formData.recipientName}
                            className="group relative w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative flex items-center justify-center gap-2">
                                {isLoading || isValidating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {isValidating ? 'Validating Context...' : 'Crafting Message...'}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Generate Outreach
                                    </>
                                )}
                            </span>
                        </button>
                    </motion.div>
                </div>

                {/* Right Column: Output */}
                <div className="lg:col-span-7 space-y-6 flex flex-col justify-center">
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {/* Preview Header */}
                        <div className="absolute -top-12 left-0 flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${message ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                {message ? 'Live Preview' : 'Waiting for input'}
                            </span>
                        </div>

                        <div className={`relative bg-white dark:bg-[#1A2139] rounded-3xl shadow-2xl border-4 transition-all duration-500 overflow-hidden min-h-[500px] flex flex-col ${formData.platform === 'linkedin' ? 'border-[#0077b5]/20 dark:border-[#0077b5]/20' :
                            formData.platform === 'twitter' ? 'border-[#1DA1F2]/20 dark:border-[#1DA1F2]/20' :
                                'border-amber-500/20 dark:border-amber-500/20'
                            }`}>

                            {/* Mock Platform Header */}
                            <div className={`w-full p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 ${formData.platform === 'linkedin' ? 'bg-[#0077b5] text-white' :
                                formData.platform === 'twitter' ? 'bg-[#1DA1F2] text-white' :
                                    'bg-amber-600 text-white'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                        {formData.platform === 'linkedin' && <Linkedin className="w-5 h-5" />}
                                        {formData.platform === 'email' && <Mail className="w-5 h-5" />}
                                        {formData.platform === 'twitter' && <Twitter className="w-5 h-5" />}
                                    </div>
                                    <span className="font-bold text-sm tracking-wide">
                                        {formData.platform === 'linkedin' ? 'LinkedIn Message' :
                                            formData.platform === 'twitter' ? 'New Tweet / DM' : 'Compose Email'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="flex-1 p-8 flex flex-col">
                                {!message ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 space-y-4">
                                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                                        <div className="w-3/4 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                        <div className="w-1/2 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                ME
                                            </div>
                                            <div className="flex-1 bg-slate-50 dark:bg-[#0A0E27] p-6 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm relative group/msg">
                                                <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-7">
                                                    {message}
                                                </div>

                                                <button
                                                    onClick={copyToClipboard}
                                                    className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 opacity-0 group-hover/msg:opacity-100 transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
                                                    title="Copy"
                                                >
                                                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Bar */}
                            <div className="p-6 bg-slate-50 dark:bg-[#0F1325] border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                {message && (
                                    <>
                                        <button className="px-6 py-2 text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition-colors">
                                            Refine Draft
                                        </button>
                                        <button
                                            onClick={() => {
                                                const url = formData.platform === 'linkedin' ? 'https://www.linkedin.com/messaging/' :
                                                    formData.platform === 'twitter' ? 'https://twitter.com/compose/tweet' : 'mailto:';
                                                window.open(url, '_blank');
                                            }}
                                            className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                                        >
                                            <Send className="w-4 h-4" />
                                            Send Now
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div >
    );
};



export default NetworkingAgent;
