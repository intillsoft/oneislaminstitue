import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, X, FileText, Check, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { resumeService } from '../../services/resumeService';
// Import only what's needed to avoid circular deps if any

const JobTailorModal = ({ isOpen, onClose, jobDescription, jobTitle, initialResumeId, onResumeCreated }) => {
    const [step, setStep] = useState(1); // 1: Select Resume, 2: Analyzing/Creating
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState(initialResumeId || null);
    const [loading, setLoading] = useState(false);
    const [customJobDesc, setCustomJobDesc] = useState(jobDescription || '');

    useEffect(() => {
        if (isOpen) {
            loadResumes();
        }
    }, [isOpen]);

    const loadResumes = async () => {
        try {
            const data = await resumeService.getAll();
            setResumes(data);
            if (!selectedResumeId && data.length > 0) {
                setSelectedResumeId(data[0].id);
            }
        } catch (err) {
            console.error('Failed to load resumes', err);
        }
    };

    const handleTailor = async () => {
        if (!selectedResumeId || !customJobDesc) return;

        setLoading(true);
        setStep(2);

        try {
            // 1. Get base resume
            const baseResume = resumes.find(r => r.id === selectedResumeId);
            if (!baseResume) throw new Error('Resume not found');

            // 2. Call backend to tailor (simulated for now, normally would use aiResumeService.tailor)
            // In a real implementation, this would call specific endpoint: /api/ai-resume/tailor

            // Simulating AI delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 3. Create NEW resume based on optimization
            const newTitle = `Resume for ${jobTitle || 'Job Application'}`;

            // Copy content + modify slightly (Mocking AI modification)
            const tailoredContent = { ...baseResume.content_json };
            if (tailoredContent.summary) {
                tailoredContent.summary = `(Tailored for ${jobTitle}) ${tailoredContent.summary}`;
            }

            const newResume = await resumeService.create({
                title: newTitle,
                content: tailoredContent,
                template: baseResume.template_id,
                // job_id: ... link to job match table
            });

            // 4. Callback to redirect
            if (onResumeCreated) {
                onResumeCreated(newResume.id);
            } else {
                // Fallback global redirect or alert
                window.location.href = `/resume/edit/${newResume.id}`;
            }

        } catch (error) {
            console.error('Tailoring failed:', error);
            // Show error state
            setStep(1);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg">
                                <Wand2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tailor Resume</h2>
                                <p className="text-sm text-gray-500">Optimize for {jobTitle || 'this job'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex-1 overflow-y-auto">
                        {step === 1 ? (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Job Description
                                    </label>
                                    <textarea
                                        value={customJobDesc}
                                        onChange={(e) => setCustomJobDesc(e.target.value)}
                                        className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-purple-500 resize-none"
                                        placeholder="Paste job description here..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Select Base Resume
                                    </label>
                                    <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto custom-scrollbar">
                                        {resumes.map(resume => (
                                            <div
                                                key={resume.id}
                                                onClick={() => setSelectedResumeId(resume.id)}
                                                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedResumeId === resume.id
                                                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                                        : 'border-transparent bg-gray-50 dark:bg-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-full mr-3 ${selectedResumeId === resume.id ? 'bg-purple-200 text-purple-700' : 'bg-gray-200 text-gray-500'}`}>
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{resume.title}</h4>
                                                    <p className="text-xs text-gray-500">{new Date(resume.updated_at).toLocaleDateString()}</p>
                                                </div>
                                                {selectedResumeId === resume.id && <Check className="w-5 h-5 text-purple-600" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                                <div className="relative w-24 h-24">
                                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                    <Wand2 className="absolute inset-0 m-auto w-10 h-10 text-purple-600 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Optimizing Resume...</h3>
                                    <p className="text-gray-500 mt-2">Analyzing keywords and matching skills to job requirements.</p>
                                </div>
                                <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 2 }}
                                        className="h-full bg-purple-600"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {step === 1 && (
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button
                                onClick={handleTailor}
                                disabled={!selectedResumeId || !customJobDesc || loading}
                                className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                            >
                                Tailor Resume <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default JobTailorModal;
