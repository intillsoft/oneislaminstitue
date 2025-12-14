import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { User, Briefcase, GraduationCap, Code, Plus, Trash2, GripVertical, ChevronDown, Sparkles, FolderKanban, Award, FileText, Layers, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIContextToolbar from './AIContextToolbar';

const ResumeEditorManual = ({ data, onChange, onAIAction }) => {
    // Selection State
    const [selection, setSelection] = useState(null);
    const editorRef = useRef(null);

    // Default Sections Order
    const [sections, setSections] = useState(data.layout || [
        'personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'
    ]);

    // Custom Section Modal State
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');

    useEffect(() => {
        if (data.layout && JSON.stringify(data.layout) !== JSON.stringify(sections)) {
            setSections(data.layout);
        }
    }, [data.layout]);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const newSections = Array.from(sections);
        const [reorderedItem] = newSections.splice(result.source.index, 1);
        newSections.splice(result.destination.index, 0, reorderedItem);
        setSections(newSections);
        onChange({ ...data, layout: newSections });
    };

    const handleAddSection = () => {
        if (!newSectionName.trim()) return;
        const id = newSectionName.toLowerCase().replace(/\s+/g, '_');

        // Add to sections list
        const newSections = [...sections, id];
        setSections(newSections);

        // Initialize data for this section
        onChange({
            ...data,
            layout: newSections,
            [id]: { title: newSectionName, content: '' } // Default structure for custom section
        });

        setIsAddingSection(false);
        setNewSectionName('');
    };

    const handleAIAction = async (actionId, text, fieldPath) => {
        let prompt = "";
        if (actionId === 'optimize') {
            prompt = `Rewrite to be professional and concise:\n"${text}"`;
        } else if (actionId === 'expand') {
            prompt = `Expand with more detail:\n"${text}"`;
        } else if (actionId === 'optimize_section') {
            const sectionName = fieldPath;
            const content = JSON.stringify(data[sectionName] || data.experience || "");
            prompt = `Optimize my ${sectionName} section. Content:\n${content}\n\nImprove clarity and impact.`;
        }

        if (prompt && onAIAction) onAIAction(prompt);
    };

    // Configuration for Standard Sections
    const sectionConfig = {
        personal: { title: "Personal Info", icon: User, fixed: true },
        summary: { title: "Professional Summary", icon: FileText, fixed: false },
        experience: { title: "Work Experience", icon: Briefcase, fixed: false },
        education: { title: "Education", icon: GraduationCap, fixed: false },
        skills: { title: "Skills", icon: Code, fixed: false },
        projects: { title: "Projects", icon: FolderKanban, fixed: false },
        certifications: { title: "Certifications", icon: Award, fixed: false },
    };

    const renderSectionContent = (id) => {
        // 1. Custom Sections (Dynamic)
        if (!sectionConfig[id]) {
            const customData = data[id] || { title: id, content: '' };
            return (
                <div className="space-y-4">
                    <InputField
                        label="Section Title"
                        value={customData.title}
                        onChange={v => onChange({ ...data, [id]: { ...customData, title: v } })}
                    />
                    <RichTextArea
                        label="Content"
                        value={customData.content}
                        onChange={v => onChange({ ...data, [id]: { ...customData, content: v } })}
                        placeholder="Add details, bullet points, or descriptions..."
                    />
                    <button
                        onClick={() => {
                            const newSections = sections.filter(s => s !== id);
                            setSections(newSections);
                            onChange({ ...data, layout: newSections });
                        }}
                        className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                        <Trash2 className="w-3 h-3" /> Remove Section
                    </button>
                </div>
            );
        }

        // 2. Standard Sections
        switch (id) {
            case 'personal':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Full Name" value={data.personalInfo?.name} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, name: v } })} />
                        <InputField label="Job Title" value={data.personalInfo?.title} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, title: v } })} />
                        <InputField label="Email" value={data.personalInfo?.email} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, email: v } })} />
                        <InputField label="Phone" value={data.personalInfo?.phone} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, phone: v } })} />
                        <InputField label="Location" value={data.personalInfo?.location} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, location: v } })} />
                        <InputField label="Linkedin / Portfolio" value={data.personalInfo?.linkedin} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, linkedin: v } })} />
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
                            <div key={idx} className="p-4 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 relative group transition-colors hover:border-indigo-500/30">
                                <button onClick={() => { const newExp = [...data.experience]; newExp.splice(idx, 1); onChange({ ...data, experience: newExp }); }} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <InputField label="Title" value={exp.title} onChange={v => { const newExp = [...data.experience]; newExp[idx].title = v; onChange({ ...data, experience: newExp }); }} />
                                    <InputField label="Company" value={exp.company} onChange={v => { const newExp = [...data.experience]; newExp[idx].company = v; onChange({ ...data, experience: newExp }); }} />
                                    <InputField label="Start" type="month" value={exp.startDate} onChange={v => { const newExp = [...data.experience]; newExp[idx].startDate = v; onChange({ ...data, experience: newExp }); }} />
                                    <InputField label="End" type="month" value={exp.endDate} onChange={v => { const newExp = [...data.experience]; newExp[idx].endDate = v; onChange({ ...data, experience: newExp }); }} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Achievements</label>
                                    {(exp.bullets || []).map((bullet, bIdx) => (
                                        <div key={bIdx} className="flex gap-2">
                                            <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-indigo-500/50 flex-shrink-0" />
                                            <RichTextArea value={bullet} onChange={v => { const newExp = [...data.experience]; newExp[idx].bullets[bIdx] = v; onChange({ ...data, experience: newExp }); }} onSelect={(e) => handleTextSelect(e, `experience[${idx}].bullets[${bIdx}]`)} rows={2} className="text-sm bg-white dark:bg-black/20 border-none shadow-sm" />
                                            <button onClick={() => { const newExp = [...data.experience]; newExp[idx].bullets.splice(bIdx, 1); onChange({ ...data, experience: newExp }); }} className="text-slate-300 hover:text-red-400 flex-shrink-0"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => { const newExp = [...data.experience]; if (!newExp[idx].bullets) newExp[idx].bullets = []; newExp[idx].bullets.push(''); onChange({ ...data, experience: newExp }); }} className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline pl-4 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Achievement</button>
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
                            <div key={idx} className="p-4 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 relative transition-colors hover:border-indigo-500/30">
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
                        label="Skills (Comma start)"
                    />
                );
            case 'projects':
                return (
                    <div className="space-y-4">
                        {(data.projects || []).map((proj, idx) => (
                            <div key={idx} className="p-4 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 relative">
                                <button onClick={() => { const newProj = [...(data.projects || [])]; newProj.splice(idx, 1); onChange({ ...data, projects: newProj }); }} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                <InputField label="Project Name" value={proj.name} onChange={v => { const newProj = [...(data.projects || [])]; newProj[idx].name = v; onChange({ ...data, projects: newProj }); }} />
                                <RichTextArea label="Description" value={proj.description} onChange={v => { const newProj = [...(data.projects || [])]; newProj[idx].description = v; onChange({ ...data, projects: newProj }); }} rows={2} />
                            </div>
                        ))}
                        <Button onClick={() => { const newProj = [...(data.projects || []), { name: 'New Project', description: '' }]; onChange({ ...data, projects: newProj }); }}>Add Project</Button>
                    </div>
                );
            case 'certifications':
                return (
                    <div className="space-y-4">
                        {(data.certifications || []).map((cert, idx) => (
                            <div key={idx} className="p-4 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 relative">
                                <button onClick={() => { const newCert = [...(data.certifications || [])]; newCert.splice(idx, 1); onChange({ ...data, certifications: newCert }); }} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                <InputField label="Certification Name" value={cert.name} onChange={v => { const newCert = [...(data.certifications || [])]; newCert[idx].name = v; onChange({ ...data, certifications: newCert }); }} />
                                <InputField label="Date" value={cert.date} onChange={v => { const newCert = [...(data.certifications || [])]; newCert[idx].date = v; onChange({ ...data, certifications: newCert }); }} />
                            </div>
                        ))}
                        <Button onClick={() => { const newCert = [...(data.certifications || []), { name: '', date: '' }]; onChange({ ...data, certifications: newCert }); }}>Add Certification</Button>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleTextSelect = (e, fieldPath) => {
        const selectionObj = window.getSelection();
        if (selectionObj.toString().length > 3) {
            const range = selectionObj.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setSelection({ text: selectionObj.toString(), position: { top: rect.top, left: rect.left + (rect.width / 2) }, fieldPath });
        }
    };

    useEffect(() => {
        const handleClick = () => setSelection(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="space-y-4 pb-32" ref={editorRef}>
            <AIContextToolbar visible={!!selection} position={selection?.position} onAction={(id) => handleAIAction(id, selection.text, selection.fieldPath)} />

            <SectionWrapper title="Personal Info" icon={User} defaultOpen onAI={() => handleAIAction('optimize', null, 'personal')}>
                {renderSectionContent('personal')}
            </SectionWrapper>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="resume-sections">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                            {sections.filter(id => id !== 'personal').map((id, index) => {
                                const config = sectionConfig[id] || { title: data[id]?.title || id, icon: Layers };
                                return (
                                    <Draggable key={id} draggableId={id} index={index}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} style={{ ...provided.draggableProps.style }}>
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

            {/* --- ADD CUSTOM SECTION BUTTON --- */}
            <div className="pt-4">
                {isAddingSection ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">New Section Name</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                autoFocus
                                value={newSectionName}
                                onChange={(e) => setNewSectionName(e.target.value)}
                                placeholder="e.g. Publications, Volunteering..."
                                className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 ring-indigo-500"
                            />
                            <button onClick={handleAddSection} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Add</button>
                            <button onClick={() => setIsAddingSection(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
                        </div>
                    </motion.div>
                ) : (
                    <button
                        onClick={() => setIsAddingSection(true)}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/10 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all font-bold flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add Custom Section
                    </button>
                )}
            </div>
        </div>
    );
};

const SectionWrapper = ({ title, icon: Icon, children, defaultOpen = false, dragHandleProps, isDragging, onAI }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className={`bg-white dark:bg-[#1E293B]/80 backdrop-blur-sm rounded-2xl shadow-sm border transition-all overflow-hidden ${isDragging ? 'border-indigo-500 shadow-xl scale-[1.02] z-50' : 'border-slate-200 dark:border-white/5'}`}>
            <div className={`w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${isDragging ? 'bg-indigo-50 dark:bg-indigo-500/10' : ''}`}>
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <div {...dragHandleProps} className="cursor-grab text-slate-300 dark:text-slate-600 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 p-1 rounded-md transition-colors">
                        <GripVertical className="w-5 h-5" />
                    </div>
                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 flex-1 text-left">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-300">
                            <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-wide">{title}</h3>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onAI?.(); }} className="p-1.5 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-lg transition-all group relative">
                        <Sparkles className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)} className="p-1 text-slate-400"><ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-5 border-t border-slate-200 dark:border-white/5 bg-slate-50/30 dark:bg-transparent">
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
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
        <input
            type={type}
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B1121] border-b-2 border-slate-200 dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors rounded-t-lg text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400"
        />
    </div>
);

const RichTextArea = ({ value, onChange, onSelect, rows = 4, className, placeholder, label }) => (
    <div>
        {label && <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>}
        <textarea
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            onSelect={onSelect}
            onClick={(e) => e.stopPropagation()}
            rows={rows}
            placeholder={placeholder}
            className={`w-full px-4 py-3 bg-slate-50 dark:bg-[#0B1121] rounded-xl border border-transparent focus:bg-white dark:focus:bg-[#0B1121] focus:border-indigo-500 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none text-slate-700 dark:text-slate-200 leading-relaxed text-sm ${className}`}
        />
    </div>
);

const Button = ({ children, onClick }) => (
    <button onClick={onClick} className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl text-slate-500 dark:text-slate-400 font-bold hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-2 text-sm">
        <Plus className="w-4 h-4" /> {children}
    </button>
);

export default ResumeEditorManual;
