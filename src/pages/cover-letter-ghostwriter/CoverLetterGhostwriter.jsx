import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, FileText, Download, Copy, RefreshCw, Loader2, Sparkles, Check } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';
import { jsPDF } from "jspdf";

const CoverLetterGhostwriter = () => {
    const [formData, setFormData] = useState({
        jobDescription: '',
        resumeText: '',
        companyName: '',
        roleTitle: '',
        tone: 'professional'
    });
    const [coverLetter, setCoverLetter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const { success, error: showError } = useToast();

    const handleGenerate = async () => {
        if (!formData.jobDescription || !formData.resumeText) {
            showError('Please provide both Job Description and Resume content.');
            return;
        }

        setIsLoading(true);
        setCoverLetter('');

        const prompt = `
      Write a compelling cover letter for:
      Role: ${formData.roleTitle || "this role"} at ${formData.companyName || "the company"}.
      
      Job Description:
      ${formData.jobDescription}
      
      My Resume Info:
      ${formData.resumeText}
      
      Tone: ${formData.tone} (e.g., Professional, Creative, Passionate).
      
      Structure:
      1. Strong opening hook connecting my passion/skill to their mission.
      2. 2-3 body paragraphs proving my fit with specific examples from my resume.
      3. Confident closing.
      
      Output ONLY the body of the letter (no placeholders like [Your Name] unless absolutely necessary, infer from resume if possible).
    `;

        try {
            const result = await aiService.generateCompletion(prompt, {
                systemMessage: "You are a professional copywriter for executive career documents.",
                temperature: 0.7
            });
            setCoverLetter(result);
            success('Cover letter generated!');
        } catch (err) {
            console.error('Generation Error:', err);
            showError('Failed to generate cover letter.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        success('Copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadPDF = () => {
        if (!coverLetter) return;
        const doc = new jsPDF();

        // Split text to fit page
        const splitText = doc.splitTextToSize(coverLetter, 180);
        doc.text(splitText, 15, 20);
        doc.save('cover_letter.pdf');
        success('PDF Downloaded');
    };

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-[#0A0E27] p-6 pt-24 font-sans">
            <div className="max-w-7xl mx-auto h-[85vh] flex gap-6">

                {/* Left Controls */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-1/3 bg-white dark:bg-[#13182E] rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-8 overflow-y-auto"
                >
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 rounded-2xl bg-teal-500 text-white shadow-lg shadow-teal-500/30">
                                    <PenTool className="w-6 h-6" />
                                </div>
                                <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">Ghostwriter <span className="text-teal-500">2.0</span></h1>
                            </div>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                                Configure the AI to capture your voice perfectly.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 block">Context</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            placeholder="Company Name"
                                            className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-[#0A0E27] text-neutral-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none font-bold text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={formData.roleTitle}
                                            onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                                            placeholder="Role Title"
                                            className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-[#0A0E27] text-neutral-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none font-bold text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 block">Voice & Tone</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['professional', 'passionate', 'concise', 'creative'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setFormData({ ...formData, tone: t })}
                                                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all border-2 ${formData.tone === t
                                                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-300 border-teal-500'
                                                    : 'bg-neutral-50 dark:bg-[#0A0E27] text-neutral-500 dark:text-neutral-400 border-transparent hover:border-neutral-200'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 block flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Job Description
                                    </label>
                                    <textarea
                                        value={formData.jobDescription}
                                        onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                        placeholder="Paste JD details..."
                                        className="w-full h-32 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-[#0A0E27] text-neutral-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none resize-none text-xs font-medium leading-relaxed"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 block flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Your Resume
                                    </label>
                                    <textarea
                                        value={formData.resumeText}
                                        onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                                        placeholder="Paste resume content..."
                                        className="w-full h-32 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-[#0A0E27] text-neutral-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none resize-none text-xs font-medium leading-relaxed"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !formData.jobDescription}
                                className="w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Ghostwriting...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" /> Generate Draft
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Right Preview - Document Style */}
                <motion.div
                    className="flex-1 bg-white dark:bg-[#13182E] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden relative"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    {/* Toolbar */}
                    <div className="h-16 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between px-6 bg-neutral-50/50 dark:bg-[#1A2139]/50 backdrop-blur-sm">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                disabled={!coverLetter}
                                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-500 transition-colors"
                                title="Copy"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                disabled={!coverLetter}
                                className="flex items-center gap-2 px-4 py-1.5 bg-teal-500 text-white rounded-lg text-xs font-bold hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20"
                            >
                                <Download className="w-3 h-3" /> Export PDF
                            </button>
                        </div>
                    </div>

                    {/* Paper Area */}
                    <div className="flex-1 bg-neutral-100 dark:bg-[#0A0E27] p-8 overflow-y-auto flex justify-center">
                        <div className="w-full max-w-[210mm] bg-white dark:bg-white text-neutral-900 shadow-xl min-h-full p-[20mm]">
                            {coverLetter ? (
                                <div className="prose max-w-none font-serif whitespace-pre-wrap text-sm leading-loose">
                                    {coverLetter}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-neutral-300 space-y-4">
                                    <PenTool className="w-12 h-12 opacity-20" />
                                    <p className="font-bold uppercase tracking-widest text-xs opacity-50">Document is empty</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default CoverLetterGhostwriter;
