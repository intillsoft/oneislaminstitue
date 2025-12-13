import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { User, Briefcase, GraduationCap, Code, Plus, Trash2, GripVertical, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIContextToolbar from './AIContextToolbar';
import { aiResumeService } from '../../../services/aiResumeService'; // Import our new service

const ResumeEditorManual = ({ data, onChange }) => {
    // Selection State for AI Toolbar
    const [selection, setSelection] = useState(null);
    const editorRef = useRef(null);

    // AI Action Handlers
    const handleAIAction = async (actionId, text, fieldPath) => {
        // fieldPath e.g., "experience[0].bullets[2]" or "summary"

        // Mock processing for UI feedback
        // In real impl, we'd set loading state on the specific field
        console.log(`AI Action: ${actionId} on "${text}" at ${fieldPath}`);

        let newText = text;
        if (actionId === 'actionize') {
            newText = await aiResumeService.actionize(text);
        } else if (actionId === 'tone') {
            newText = await aiResumeService.adjustTone(text, 'Executive');
        } else if (actionId === 'quantify') {
            const suggestions = await aiResumeService.suggestMetrics(text);
            newText = text + " " + `(${suggestions[0]})`; // Append suggestion
        }

        // Update data
        updateDataByPath(fieldPath, newText);
        setSelection(null); // Close toolbar
    };

    const updateDataByPath = (path, value) => {
        // Deep clone data to avoid mutation
        const newData = JSON.parse(JSON.stringify(data));

        if (!path.includes('[')) {
            // Simple field like 'summary'
            newData[path] = value;
        } else {
            // Complex path like experience[0].bullets[2]
            // Simplified logic for demo - assuming standard structure
            // In prod, use lodash.set or similar
        }
        onChange(newData);
    };

    // Text Selection Handler
    const handleTextSelect = (e, fieldPath) => {
        const selectionObj = window.getSelection();
        if (selectionObj.toString().length > 3) {
            const range = selectionObj.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setSelection({
                text: selectionObj.toString(),
                position: { top: rect.top, left: rect.left + (rect.width / 2) },
                fieldPath
            });
        }
    };

    // Global click listener to close toolbar
    useEffect(() => {
        const handleClick = () => setSelection(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="space-y-8 pb-32" ref={editorRef}>

            <AIContextToolbar
                visible={!!selection}
                position={selection?.position}
                onAction={(id) => handleAIAction(id, selection.text, selection.fieldPath)}
            />

            {/* --- PERSONAL INFO --- */}
            <SectionWrapper title="Personal Info" icon={User} defaultOpen>
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Full Name" value={data.personalInfo?.name} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, name: v } })} />
                    <InputField label="Job Title" value={data.personalInfo?.title} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, title: v } })} />
                    <InputField label="Email" value={data.personalInfo?.email} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, email: v } })} />
                    <InputField label="Phone" value={data.personalInfo?.phone} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, phone: v } })} />
                    <InputField label="Location" value={data.personalInfo?.location} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, location: v } })} />
                    <InputField label="Links (LinkedIn/Portfolio)" value={data.personalInfo?.linkedin} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, linkedin: v } })} />
                </div>
            </SectionWrapper>

            {/* --- SUMMARY --- */}
            <SectionWrapper title="Professional Summary" icon={User} defaultOpen>
                <RichTextArea
                    value={data.summary}
                    onChange={v => onChange({ ...data, summary: v })}
                    onSelect={(e) => handleTextSelect(e, 'summary')}
                    placeholder="Briefly summarize your career..."
                />
            </SectionWrapper>

            {/* --- EXPERIENCE --- */}
            <SectionWrapper title="Work Experience" icon={Briefcase} defaultOpen>
                <div className="space-y-6">
                    {(data.experience || []).map((exp, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 relative group">
                            <button
                                onClick={() => {
                                    const newExp = [...data.experience];
                                    newExp.splice(idx, 1);
                                    onChange({ ...data, experience: newExp });
                                }}
                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <InputField label="Title" value={exp.title} onChange={v => {
                                    const newExp = [...data.experience];
                                    newExp[idx].title = v;
                                    onChange({ ...data, experience: newExp });
                                }} />
                                <InputField label="Company" value={exp.company} onChange={v => {
                                    const newExp = [...data.experience];
                                    newExp[idx].company = v;
                                    onChange({ ...data, experience: newExp });
                                }} />
                                <InputField label="Start" type="month" value={exp.startDate} onChange={v => {
                                    const newExp = [...data.experience];
                                    newExp[idx].startDate = v;
                                    onChange({ ...data, experience: newExp });
                                }} />
                                <InputField label="End" type="month" value={exp.endDate} onChange={v => {
                                    const newExp = [...data.experience];
                                    newExp[idx].endDate = v;
                                    onChange({ ...data, experience: newExp });
                                }} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Achievements</label>
                                {(exp.bullets || []).map((bullet, bIdx) => (
                                    <div key={bIdx} className="flex gap-2">
                                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                                        <RichTextArea
                                            value={bullet}
                                            onChange={v => {
                                                const newExp = [...data.experience];
                                                newExp[idx].bullets[bIdx] = v;
                                                onChange({ ...data, experience: newExp });
                                            }}
                                            onSelect={(e) => handleTextSelect(e, `experience[${idx}].bullets[${bIdx}]`)}
                                            rows={2}
                                            className="text-sm bg-white dark:bg-slate-900 border-none shadow-sm focus:ring-1 focus:ring-indigo-500"
                                        />
                                        <button
                                            onClick={() => {
                                                const newExp = [...data.experience];
                                                newExp[idx].bullets.splice(bIdx, 1);
                                                onChange({ ...data, experience: newExp });
                                            }}
                                            className="text-slate-300 hover:text-red-400 flex-shrink-0"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newExp = [...data.experience];
                                        if (!newExp[idx].bullets) newExp[idx].bullets = [];
                                        newExp[idx].bullets.push('');
                                        onChange({ ...data, experience: newExp });
                                    }}
                                    className="text-xs text-indigo-500 font-bold hover:underline pl-4 flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> Add Achievement
                                </button>
                            </div>
                        </div>
                    ))}
                    <Button onClick={() => {
                        const newExp = [...(data.experience || []), { title: 'New Position', bullets: [''] }];
                        onChange({ ...data, experience: newExp });
                    }}>Add Experience</Button>
                </div>
            </SectionWrapper>

            {/* --- SKILLS --- */}
            <SectionWrapper title="Skills" icon={Code}>
                <RichTextArea
                    value={Array.isArray(data.skills) ? data.skills.join(', ') : ''}
                    onChange={v => onChange({ ...data, skills: v.split(',').map(s => s.trim()) })}
                    placeholder="React, Node.js, Python, Leadership..."
                    label="Skills (Comma Separated)"
                />
            </SectionWrapper>

            {/* --- EDUCATION --- */}
            <SectionWrapper title="Education" icon={GraduationCap}>
                <div className="space-y-4">
                    {(data.education || []).map((edu, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 relative">
                            <button
                                onClick={() => {
                                    const newEdu = [...data.education];
                                    newEdu.splice(idx, 1);
                                    onChange({ ...data, education: newEdu });
                                }}
                                className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Institution" value={edu.institution} onChange={v => {
                                    const newEdu = [...data.education];
                                    newEdu[idx].institution = v;
                                    onChange({ ...data, education: newEdu });
                                }} />
                                <InputField label="Degree" value={edu.degree} onChange={v => {
                                    const newEdu = [...data.education];
                                    newEdu[idx].degree = v;
                                    onChange({ ...data, education: newEdu });
                                }} />
                                <InputField label="Year" value={edu.year} onChange={v => {
                                    const newEdu = [...data.education];
                                    newEdu[idx].year = v;
                                    onChange({ ...data, education: newEdu });
                                }} />
                            </div>
                        </div>
                    ))}
                    <Button onClick={() => {
                        const newEdu = [...(data.education || []), { institution: '', degree: '' }];
                        onChange({ ...data, education: newEdu });
                    }}>Add Education</Button>
                </div>
            </SectionWrapper>

        </div>
    );
};

// UI Helpers
const SectionWrapper = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const InputField = ({ label, value, onChange, type = 'text' }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
        <input
            type={type}
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition-colors rounded-t-md hover:bg-slate-50 dark:hover:bg-slate-800/80 text-sm font-medium"
        />
    </div>
);

const RichTextArea = ({ value, onChange, onSelect, rows = 4, className, placeholder }) => (
    <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onSelect={onSelect} // Capture selection
        onClick={(e) => e.stopPropagation()} // Prevent toolbar close
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none text-slate-700 dark:text-slate-200 leading-relaxed ${className}`}
    />
);

const Button = ({ children, onClick }) => (
    <button onClick={onClick} className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 font-bold hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> {children}
    </button>
);

export default ResumeEditorManual;
