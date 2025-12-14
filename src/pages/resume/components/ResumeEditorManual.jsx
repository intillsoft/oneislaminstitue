import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { User, Briefcase, GraduationCap, Code, Plus, Trash2, GripVertical, ChevronDown, Sparkles, FolderKanban, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIContextToolbar from './AIContextToolbar';
import { aiResumeService } from '../../../services/aiResumeService';

const ResumeEditorManual = ({ data, onChange }) => {
    // Selection State
    const [selection, setSelection] = useState(null);
    const editorRef = useRef(null);
    const [activeSection, setActiveSection] = useState(null); // Track active AI section

    // Default Sections Order (If not in data)
    const [sections, setSections] = useState(data.layout || [
        'personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'
    ]);

    // Sync internal order if data.layout changes externally
    useEffect(() => {
        if (data.layout && JSON.stringify(data.layout) !== JSON.stringify(sections)) {
            setSections(data.layout);
        }
    }, [data.layout]);

    // Handle Drag End
    const onDragEnd = (result) => {
        if (!result.destination) return;
        const newSections = Array.from(sections);
        const [reorderedItem] = newSections.splice(result.source.index, 1);
        newSections.splice(result.destination.index, 0, reorderedItem);
        setSections(newSections);
        // Save layout to resume data
        onChange({ ...data, layout: newSections });
    };

    // AI Action Handlers
    const handleAIAction = async (actionId, text, fieldPath) => {
        console.log(`AI Action: ${actionId} on "${text}" at ${fieldPath}`);
        // ... (Existing logic or trigger AI Panel)
        // For contextual buttons, we might want to populate the Chat Panel input
        // But for now, let's keep the existing toolbar logic

        // If clicking "Optimize Section", we might want to open the panel
        if (actionId === 'optimize_section') {
            // This would ideally signal the parent to set the chat input
            // For now, we'll just log
            window.alert(`AI Optimization for ${fieldPath} requested. Check AI Copilot.`);
        }
    };

    const sectionConfig = {
        personal: { title: "Personal Info", icon: User, fixed: true },
        summary: { title: "Professional Summary", icon: User, fixed: false },
        experience: { title: "Work Experience", icon: Briefcase, fixed: false },
        education: { title: "Education", icon: GraduationCap, fixed: false },
        skills: { title: "Skills", icon: Code, fixed: false },
        projects: { title: "Projects", icon: FolderKanban, fixed: false },
        certifications: { title: "Certifications", icon: Award, fixed: false },
    };

    const renderSectionContent = (id) => {
        switch (id) {
            case 'personal':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Full Name" value={data.personalInfo?.name} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, name: v } })} />
                        <InputField label="Job Title" value={data.personalInfo?.title} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, title: v } })} />
                        <InputField label="Email" value={data.personalInfo?.email} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, email: v } })} />
                        <InputField label="Phone" value={data.personalInfo?.phone} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, phone: v } })} />
                        <InputField label="Location" value={data.personalInfo?.location} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, location: v } })} />
                        <InputField label="Links" value={data.personalInfo?.linkedin} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, linkedin: v } })} />
                    </div>
                );
            case 'summary':
                return (
                    <RichTextArea
                        value={data.summary}
                        onChange={v => onChange({ ...data, summary: v })}
                        onSelect={(e) => handleTextSelect(e, 'summary')}
                        placeholder="Briefly summarize your career..."
                    />
                );
            case 'experience':
                return (
                    <div className="space-y-6">
                        {(data.experience || []).map((exp, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 relative group">
                                <button onClick={() => { const newExp = [...data.experience]; newExp.splice(idx, 1); onChange({ ...data, experience: newExp }); }} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <InputField label="Title" value={exp.title} onChange={v => { const newExp = [...data.experience]; newExp[idx].title = v; onChange({ ...data, experience: newExp }); }} />
                                    <InputField label="Company" value={exp.company} onChange={v => { const newExp = [...data.experience]; newExp[idx].company = v; onChange({ ...data, experience: newExp }); }} />
                                    <InputField label="Start" type="month" value={exp.startDate} onChange={v => { const newExp = [...data.experience]; newExp[idx].startDate = v; onChange({ ...data, experience: newExp }); }} />
                                    <InputField label="End" type="month" value={exp.endDate} onChange={v => { const newExp = [...data.experience]; newExp[idx].endDate = v; onChange({ ...data, experience: newExp }); }} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Achievements</label>
                                    {(exp.bullets || []).map((bullet, bIdx) => (
                                        <div key={bIdx} className="flex gap-2">
                                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                                            <RichTextArea value={bullet} onChange={v => { const newExp = [...data.experience]; newExp[idx].bullets[bIdx] = v; onChange({ ...data, experience: newExp }); }} onSelect={(e) => handleTextSelect(e, `experience[${idx}].bullets[${bIdx}]`)} rows={2} className="text-sm bg-white dark:bg-slate-900 border-none shadow-sm" />
                                            <button onClick={() => { const newExp = [...data.experience]; newExp[idx].bullets.splice(bIdx, 1); onChange({ ...data, experience: newExp }); }} className="text-slate-300 hover:text-red-400 flex-shrink-0"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => { const newExp = [...data.experience]; if (!newExp[idx].bullets) newExp[idx].bullets = []; newExp[idx].bullets.push(''); onChange({ ...data, experience: newExp }); }} className="text-xs text-indigo-500 font-bold hover:underline pl-4 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Achievement</button>
                                </div>
                            </div>
                        ))}
                        <Button onClick={() => { const newExp = [...(data.experience || []), { title: 'New Position', bullets: [''] }]; onChange({ ...data, experience: newExp }); }}>Add Experience</Button>
                    </div>
                );
            case 'education':
                return (
                    <div className="space-y-4">
                        {(data.education || []).map((edu, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 relative">
                                <button onClick={() => { const newEdu = [...data.education]; newEdu.splice(idx, 1); onChange({ ...data, education: newEdu }); }} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Institution" value={edu.institution} onChange={v => { const newEdu = [...data.education]; newEdu[idx].institution = v; onChange({ ...data, education: newEdu }); }} />
                                    <InputField label="Degree" value={edu.degree} onChange={v => { const newEdu = [...data.education]; newEdu[idx].degree = v; onChange({ ...data, education: newEdu }); }} />
                                    <InputField label="Year" value={edu.year} onChange={v => { const newEdu = [...data.education]; newEdu[idx].year = v; onChange({ ...data, education: newEdu }); }} />
                                </div>
                            </div>
                        ))}
                        <Button onClick={() => { const newEdu = [...(data.education || []), { institution: '', degree: '' }]; onChange({ ...data, education: newEdu }); }}>Add Education</Button>
                    </div>
                );
            case 'skills':
                return (
                    <RichTextArea
                        value={Array.isArray(data.skills) ? data.skills.join(', ') : ''}
                        onChange={v => onChange({ ...data, skills: v.split(',').map(s => s.trim()) })}
                        placeholder="React, Node.js, Python, Leadership..."
                        label="Skills (Comma Separated)"
                    />
                );
            case 'projects': // Added Projects
                return (
                    <div className="text-sm text-slate-500 italic p-4 text-center">Projects section coming soon. Use "Add Custom Section" for now.</div>
                );
            default:
                return null;
        }
    };

    // Text Selection Handler (Existing)
    const handleTextSelect = (e, fieldPath) => {
        const selectionObj = window.getSelection();
        if (selectionObj.toString().length > 3) {
            const range = selectionObj.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setSelection({ text: selectionObj.toString(), position: { top: rect.top, left: rect.left + (rect.width / 2) }, fieldPath });
        }
    };

    // Close toolbar
    useEffect(() => {
        const handleClick = () => setSelection(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="space-y-4 pb-32" ref={editorRef}>
            <AIContextToolbar visible={!!selection} position={selection?.position} onAction={(id) => handleAIAction(id, selection.text, selection.fieldPath)} />

            {/* Fixed Sections (Personal Info) */}
            <SectionWrapper title="Personal Info" icon={User} defaultOpen onAI={() => handleAIAction('optimize', null, 'personal')}>
                {renderSectionContent('personal')}
            </SectionWrapper>

            {/* Draggable Sections */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="resume-sections">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                            {sections.filter(id => id !== 'personal').map((id, index) => {
                                const config = sectionConfig[id] || { title: id, icon: FolderKanban };
                                return (
                                    <Draggable key={id} draggableId={id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={{ ...provided.draggableProps.style }}
                                            >
                                                <SectionWrapper
                                                    title={config.title}
                                                    icon={config.icon}
                                                    defaultOpen={id === 'summary' || id === 'experience'}
                                                    dragHandleProps={provided.dragHandleProps}
                                                    isDragging={snapshot.isDragging}
                                                    onAI={() => handleAIAction('optimize_section', null, id)}
                                                >
                                                    {renderSectionContent(id)}
                                                </SectionWrapper>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

// UI Helpers
const SectionWrapper = ({ title, icon: Icon, children, defaultOpen = false, dragHandleProps, isDragging, onAI }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border transition-all overflow-hidden ${isDragging ? 'border-indigo-500 shadow-xl scale-[1.02] z-50' : 'border-slate-200 dark:border-slate-800'}`}>
            <div className={`w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isDragging ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>

                {/* Left: Drag Handle & Title */}
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <div {...dragHandleProps} className="cursor-grab text-slate-300 hover:text-slate-500 touch-none flex items-center justify-center p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                        <GripVertical className="w-5 h-5" />
                    </div>

                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 flex-1 text-left">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h3>
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* AI Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onAI?.(); }}
                        className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all group relative"
                        title="AI Assist"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">AI Assist</span>
                    </button>

                    <button onClick={() => setIsOpen(!isOpen)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 border-t border-slate-200 dark:border-slate-800">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const InputField = ({ label, value, onChange, type = 'text' }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
        <input
            type={type}
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition-colors rounded-t-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white"
        />
    </div>
);

const RichTextArea = ({ value, onChange, onSelect, rows = 4, className, placeholder }) => (
    <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onSelect={onSelect}
        onClick={(e) => e.stopPropagation()}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none text-slate-700 dark:text-slate-200 leading-relaxed text-sm ${className}`}
    />
);

const Button = ({ children, onClick }) => (
    <button onClick={onClick} className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 font-bold hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2 text-sm">
        <Plus className="w-4 h-4" /> {children}
    </button>
);

export default ResumeEditorManual;
