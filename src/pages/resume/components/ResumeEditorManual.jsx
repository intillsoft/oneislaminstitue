import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { User, Briefcase, GraduationCap, Code, Plus, Trash2, GripVertical, ChevronDown, Sparkles, FolderKanban, Award, FileText, Layers, X, Info } from 'lucide-react';
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
        const newSections = [...sections, id];
        setSections(newSections);
        onChange({
            ...data,
            layout: newSections,
            [id]: { title: newSectionName, content: '' }
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

    const sectionConfig = {
        personal: { title: "Personal Identity", icon: User, fixed: true },
        summary: { title: "Executive Summary", icon: Info, fixed: false },
        experience: { title: "Work Experience", icon: Briefcase, fixed: false },
        education: { title: "Education", icon: GraduationCap, fixed: false },
        skills: { title: "Skill Matrix", icon: Code, fixed: false },
        projects: { title: "Key Projects", icon: FolderKanban, fixed: false },
        certifications: { title: "Certifications", icon: Award, fixed: false },
    };

    const renderSectionContent = (id) => {
        if (!sectionConfig[id]) {
            const customData = data[id] || { title: id, content: '' };
            return (
                <div className="space-y-3">
                    <InputField label="Section Title" value={customData.title} onChange={v => onChange({ ...data, [id]: { ...customData, title: v } })} />
                    <RichTextArea value={customData.content} onChange={v => onChange({ ...data, [id]: { ...customData, content: v } })} placeholder="Section detail..." />
                    <button onClick={() => {
                        const newSections = sections.filter(s => s !== id);
                        setSections(newSections);
                        onChange({ ...data, layout: newSections });
                    }} className="text-[10px] font-black uppercase text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors">
                        <Trash2 size={12} /> Remove
                    </button>
                </div>
            );
        }

        switch (id) {
            case 'personal':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <InputField label="Name" value={data.personalInfo?.name} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, name: v } })} />
                        <InputField label="Role" value={data.personalInfo?.title} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, title: v } })} />
                        <InputField label="Email" value={data.personalInfo?.email} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, email: v } })} />
                        <InputField label="Phone" value={data.personalInfo?.phone} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, phone: v } })} />
                        <InputField label="Location" value={data.personalInfo?.location} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, location: v } })} />
                        <InputField label="Web/Social" value={data.personalInfo?.linkedin} onChange={v => onChange({ ...data, personalInfo: { ...data.personalInfo, linkedin: v } })} />
                    </div>
                );
            case 'summary':
                return <RichTextArea value={data.summary} onChange={v => onChange({ ...data, summary: v })} onSelect={(e) => handleTextSelect(e, 'summary')} placeholder="High-level professional trajectory..." />;
            case 'experience':
                return (
                    <div className="space-y-4">
                        {(data.experience || []).map((exp, idx) => (
                            <div key={idx} className="p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 relative group">
                                <button onClick={() => { const newExp = [...data.experience]; newExp.splice(idx, 1); onChange({ ...data, experience: newExp }); }} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <InputField label="Title" value={exp.title} onChange={v => { const newExp = [...data.experience]; newExp[idx].title = v; onChange({ ...data, experience: newExp }); }} />
                                    <InputField label="Company" value={exp.company} onChange={v => { const newExp = [...data.experience]; newExp[idx].company = v; onChange({ ...data, experience: newExp }); }} />
                                    <InputField label="Start" type="text" placeholder="Jan 2022" value={exp.startDate} onChange={v => { const newExp = [...data.experience]; newExp[idx].startDate = v; onChange({ ...data, experience: newExp }); }} />
                                    <InputField label="End" type="text" placeholder="Present" value={exp.endDate} onChange={v => { const newExp = [...data.experience]; newExp[idx].endDate = v; onChange({ ...data, experience: newExp }); }} />
                                </div>
                                <div className="space-y-2">
                                    {(exp.bullets || []).map((bullet, bIdx) => (
                                        <div key={bIdx} className="flex gap-2 group/bullet">
                                            <RichTextArea value={bullet} onChange={v => { const newExp = [...data.experience]; newExp[idx].bullets[bIdx] = v; onChange({ ...data, experience: newExp }); }} onSelect={(e) => handleTextSelect(e, `experience[${idx}].bullets[${bIdx}]`)} rows={1} className="text-xs bg-transparent border-none p-0 focus:ring-0" />
                                            <button onClick={() => { const newExp = [...data.experience]; newExp[idx].bullets.splice(bIdx, 1); onChange({ ...data, experience: newExp }); }} className="text-slate-300 hover:text-red-400 opacity-0 group-hover/bullet:opacity-100"><X size={12} /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => { const newExp = [...data.experience]; if (!newExp[idx].bullets) newExp[idx].bullets = []; newExp[idx].bullets.push(''); onChange({ ...data, experience: newExp }); }} className="text-[10px] font-black uppercase text-workflow-primary hover:underline flex items-center gap-1"><Plus size={10} /> Add Node</button>
                                </div>
                            </div>
                        ))}
                        <Button onClick={() => { const newExp = [...(data.experience || []), { title: 'Position', bullets: [''] }]; onChange({ ...data, experience: newExp }); }}>Add Experience Segment</Button>
                    </div>
                );
            case 'education':
                return (
                    <div className="space-y-3">
                        {(data.education || []).map((edu, idx) => (
                            <div key={idx} className="p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 relative">
                                <button onClick={() => { const newEdu = [...data.education]; newEdu.splice(idx, 1); onChange({ ...data, education: newEdu }); }} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                                <div className="grid grid-cols-3 gap-2">
                                    <InputField label="Institution" value={edu.institution} onChange={v => { const newEdu = [...data.education]; newEdu[idx].institution = v; onChange({ ...data, education: newEdu }); }} />
                                    <InputField label="Degree" value={edu.degree} onChange={v => { const newEdu = [...data.education]; newEdu[idx].degree = v; onChange({ ...data, education: newEdu }); }} />
                                    <InputField label="Year" value={edu.year} onChange={v => { const newEdu = [...data.education]; newEdu[idx].year = v; onChange({ ...data, education: newEdu }); }} />
                                </div>
                            </div>
                        ))}
                        <Button onClick={() => { const newEdu = [...(data.education || []), { institution: '', degree: '' }]; onChange({ ...data, education: newEdu }); }}>Add Education Segment</Button>
                    </div>
                );
            case 'skills':
                return <RichTextArea value={Array.isArray(data.skills) ? data.skills.join(', ') : ''} onChange={v => onChange({ ...data, skills: v.split(',').map(s => s.trim()) })} placeholder="React, Python, AWS..." label="Skill Tokens (Comma separated)" />;
            case 'projects':
                return (
                    <div className="space-y-3">
                        {(data.projects || []).map((proj, idx) => (
                            <div key={idx} className="p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 relative">
                                <button onClick={() => { const newProj = [...(data.projects || [])]; newProj.splice(idx, 1); onChange({ ...data, projects: newProj }); }} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                                <InputField label="Project ID" value={proj.name} onChange={v => { const newProj = [...(data.projects || [])]; newProj[idx].name = v; onChange({ ...data, projects: newProj }); }} />
                                <RichTextArea value={proj.description} onChange={v => { const newProj = [...(data.projects || [])]; newProj[idx].description = v; onChange({ ...data, projects: newProj }); }} rows={1} placeholder="Contribution..." />
                            </div>
                        ))}
                        <Button onClick={() => { const newProj = [...(data.projects || []), { name: '', description: '' }]; onChange({ ...data, projects: newProj }); }}>Add Project Node</Button>
                    </div>
                );
            case 'certifications':
                return (
                    <div className="space-y-3">
                        {(data.certifications || []).map((cert, idx) => (
                            <div key={idx} className="p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 relative">
                                <button onClick={() => { const newCert = [...(data.certifications || [])]; newCert.splice(idx, 1); onChange({ ...data, certifications: newCert }); }} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                                <div className="grid grid-cols-2 gap-2">
                                    <InputField label="Certification" value={cert.name} onChange={v => { const newCert = [...(data.certifications || [])]; newCert[idx].name = v; onChange({ ...data, certifications: newCert }); }} />
                                    <InputField label="Validity" value={cert.date} onChange={v => { const newCert = [...(data.certifications || [])]; newCert[idx].date = v; onChange({ ...data, certifications: newCert }); }} />
                                </div>
                            </div>
                        ))}
                        <Button onClick={() => { const newCert = [...(data.certifications || []), { name: '', date: '' }]; onChange({ ...data, certifications: newCert }); }}>Add Certification Node</Button>
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
        <div className="space-y-3 pb-32" ref={editorRef}>
            <AIContextToolbar visible={!!selection} position={selection?.position} onAction={(id) => handleAIAction(id, selection.text, selection.fieldPath)} />

            <SectionWrapper title="Personal Identity" icon={User} defaultOpen onAI={() => handleAIAction('optimize', null, 'personal')}>
                {renderSectionContent('personal')}
            </SectionWrapper>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="resume-sections">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
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
            <div className="pt-2">
                {isAddingSection ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl shadow-2xl">
                        <label className="block text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2">Initialize New Node</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                autoFocus
                                value={newSectionName}
                                onChange={(e) => setNewSectionName(e.target.value)}
                                placeholder="e.g. Publications..."
                                className="flex-1 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border-none outline-none text-xs focus:ring-1 ring-workflow-primary font-bold"
                            />
                            <button onClick={handleAddSection} className="px-4 py-1.5 bg-workflow-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Add</button>
                            <button onClick={() => setIsAddingSection(false)} className="p-1.5 text-slate-400 hover:bg-black/5 rounded-lg"><X size={14} /></button>
                        </div>
                    </motion.div>
                ) : (
                    <button
                        onClick={() => setIsAddingSection(true)}
                        className="w-full py-3 rounded-xl border border-dashed border-slate-300 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-workflow-primary hover:border-workflow-primary/50 hover:bg-workflow-primary/5 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={14} /> Add System Node
                    </button>
                )}
            </div>
        </div>
    );
};

const SectionWrapper = ({ title, icon: Icon, children, defaultOpen = false, dragHandleProps, isDragging, onAI }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className={`bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-3xl rounded-xl border transition-all overflow-hidden ${isDragging ? 'border-workflow-primary shadow-2xl scale-[1.01] z-50 bg-white dark:bg-[#0f172a]' : 'border-black/5 dark:border-white/5'}`}>
            <div className={`w-full px-3 py-2 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isDragging ? 'bg-workflow-primary/5' : ''}`}>
                <div className="flex items-center gap-2 flex-1 overflow-hidden">
                    <div {...dragHandleProps} className="cursor-grab text-slate-300 dark:text-slate-600 hover:text-workflow-primary transition-colors">
                        <GripVertical size={16} />
                    </div>
                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 flex-1 text-left">
                        <div className="w-6 h-6 rounded-lg bg-workflow-primary/10 flex items-center justify-center text-workflow-primary">
                            <Icon size={12} />
                        </div>
                        <h3 className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-widest truncate">{title}</h3>
                    </button>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); onAI?.(); }} className="p-1.5 text-workflow-primary/60 hover:text-workflow-primary hover:bg-workflow-primary/10 rounded-lg transition-all group">
                        <Sparkles size={12} className="group-hover:animate-pulse" />
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)} className="p-1 text-slate-300 hover:text-slate-600 dark:hover:text-white transition-colors"><ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-workflow-primary' : ''}`} /></button>
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-4 pt-1 border-t border-black/5 dark:border-white/5 bg-white/20 dark:bg-transparent">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const InputField = ({ label, value, onChange, type = 'text', placeholder }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{label}</label>
        <input
            type={type}
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-2 py-1.5 bg-black/5 dark:bg-white/5 border border-transparent focus:border-workflow-primary/30 outline-none transition-all rounded-lg text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400"
        />
    </div>
);

const RichTextArea = ({ value, onChange, onSelect, rows = 3, className, placeholder, label }) => (
    <div className="flex flex-col gap-1">
        {label && <label className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{label}</label>}
        <textarea
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            onSelect={onSelect}
            onClick={(e) => e.stopPropagation()}
            rows={rows}
            placeholder={placeholder}
            className={`w-full px-2 py-1.5 bg-black/5 dark:bg-white/5 rounded-lg border border-transparent focus:border-workflow-primary/30 outline-none transition-all resize-none text-slate-800 dark:text-slate-200 text-xs font-medium leading-relaxed ${className}`}
        />
    </div>
);

const Button = ({ children, onClick }) => (
    <button onClick={onClick} className="w-full py-2 border border-dashed border-slate-300 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-workflow-primary hover:border-workflow-primary/50 hover:bg-workflow-primary/5 transition-all flex items-center justify-center gap-2">
        <Plus size={12} /> {children}
    </button>
);

export default ResumeEditorManual;
