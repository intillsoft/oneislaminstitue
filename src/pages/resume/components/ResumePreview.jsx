import React, { useRef, useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink, Maximize2, X, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const ResumePreview = ({ data, resumeData, template = 'modern', isGenerating = false, onUpdate }) => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Support both prop names for backward compatibility and robustness
    const activeData = data || resumeData;

    // Auto-Scaling Logic (Fit to Container)
    useEffect(() => {
        const calculateScale = () => {
            if (!containerRef.current || !contentRef.current) return;
            if (isFullScreen) return; // Handled by fullscreen logic

            const parentElement = containerRef.current.parentElement;
            if (!parentElement) return;

            const parentWidth = parentElement.offsetWidth;
            const resumeWidth = 794; // approx 210mm @ 96dpi (A4)
            const padding = parentWidth < 600 ? 16 : 48; // More breathing room

            const availableWidth = Math.max(0, parentWidth - padding);
            let newScale = availableWidth / resumeWidth;

            // Clamping
            newScale = Math.min(newScale, 1.5);
            newScale = Math.max(newScale, 0.2);

            setScale(newScale);
        };

        calculateScale();
        const resizeObserver = new ResizeObserver(() => window.requestAnimationFrame(calculateScale));
        if (containerRef.current?.parentElement) resizeObserver.observe(containerRef.current.parentElement);
        window.addEventListener('resize', calculateScale);

        return () => {
            if (resizeObserver) resizeObserver.disconnect();
            window.removeEventListener('resize', calculateScale);
        }
    }, [isFullScreen]);

    // Print Style Injection
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                body * { visibility: hidden; }
                #resume-preview-content, #resume-preview-content * { visibility: visible; }
                #resume-preview-content {
                    visibility: visible !important;
                    position: absolute; left: 0; top: 0;
                    margin: 0; padding: 0;
                    width: 210mm; height: 297mm;
                    transform: none !important;
                    box-shadow: none !important;
                }
                @page { size: A4; margin: 0mm; }
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // Data Update Helper (Deep Set)
    const updateData = (path, value) => {
        if (!onUpdate || !activeData) return;
        const newData = JSON.parse(JSON.stringify(activeData));

        const keys = path.split('.');
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        onUpdate(newData);
    };

    const renderTemplate = () => {
        if (!activeData) return (
            <div className="h-full flex items-center justify-center p-12 text-center bg-slate-50">
                <div className="max-w-xs">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <X className="text-slate-300" />
                    </div>
                    <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Data Payload</h3>
                    <p className="text-[10px] text-slate-400 mt-2">Initialize document parameters to begin blueprint rendering.</p>
                </div>
            </div>
        );

        const props = { data: activeData, onEdit: updateData };
        switch (template) {
            case 'professional': return <ProfessionalTemplate {...props} />;
            case 'executive': return <ExecutiveTemplate {...props} />;
            case 'creative': return <CreativeTemplate {...props} />;
            case 'technical': return <TechnicalTemplate {...props} />;
            case 'openai': return <OpenAIMtemplate {...props} />;
            case 'google': return <GoogleTemplate {...props} />;
            case 'modern': default: return <ModernTemplate {...props} />;
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col bg-slate-900/5 dark:bg-[#0B1121] overflow-hidden group">

            {/* --- CONTROLS OVERLAY --- */}
            <div className="absolute top-4 right-4 z-40 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => setIsFullScreen(true)}
                    className="p-2.5 bg-slate-900/80 text-white backdrop-blur-md rounded-full hover:bg-slate-800 shadow-lg hover:scale-110 transition-all border border-white/10"
                    title="Enter Full Screen"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
            </div>

            {/* --- MAIN PREVIEW AREA --- */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto custom-scrollbar flex justify-center items-start pt-8 pb-32"
            >
                <div
                    ref={contentRef}
                    id="resume-preview-content"
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        width: '210mm',
                        minHeight: '297mm', // A4 Minimum
                        height: 'auto', // Grow with content
                    }}
                    className="bg-white text-gray-900 shadow-2xl origin-top transition-transform duration-200 ease-out cursor-pointer hover:shadow-indigo-500/20 relative"
                >
                    {/* AI Generation Overlay */}
                    <AnimatePresence>
                        {isGenerating && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-sm"
                            >
                                <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-100">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-xl bg-workflow-primary flex items-center justify-center animate-spin">
                                            <Sparkles size={16} className="text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full border-2 border-white animate-pulse" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">AI Architect Active</span>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Constructing Layout...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {renderTemplate()}
                </div>
            </div>

            {/* --- FULL SCREEN MODAL --- */}
            <AnimatePresence>
                {isFullScreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                <Maximize2 className="w-5 h-5 text-indigo-400" /> Full Screen Preview
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="flex bg-black/20 rounded-lg p-1">
                                    <button onClick={() => setScale(s => Math.max(0.3, s - 0.1))} className="p-2 hover:bg-white/10 rounded-md text-white"><ZoomOut className="w-4 h-4" /></button>
                                    <span className="px-3 py-2 text-xs font-mono text-white/50 w-16 text-center">{(scale * 100).toFixed(0)}%</span>
                                    <button onClick={() => setScale(s => Math.min(2.5, s + 0.1))} className="p-2 hover:bg-white/10 rounded-md text-white"><ZoomIn className="w-4 h-4" /></button>
                                </div>
                                <button
                                    onClick={() => setIsFullScreen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-auto p-12 flex justify-center bg-dots-pattern">
                            <div
                                style={{
                                    transform: `scale(${scale})`,
                                    transformOrigin: 'top center',
                                    width: '210mm',
                                    minHeight: '297mm',
                                    height: 'auto', // Grow with content
                                }}
                                className="bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                            >
                                {renderTemplate()}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- UTILS ---
const parseSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'object') {
        const all = [];
        Object.values(skills).forEach(v => Array.isArray(v) && all.push(...v));
        return all;
    }
    return [skills];
};

// --- TEMPLATES (Re-using existing exact implementations for consistency) ---

// --- EDITABLE HELPERS ---
const EditableText = ({ value, onChange, className, tagName = 'div', placeholder = '...' }) => {
    return React.createElement(tagName, {
        className: `${className} outline-none focus:outline-none focus:bg-blue-50/20 hover:bg-black/5 rounded transition-all cursor-text empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300`,
        'data-placeholder': placeholder,
        contentEditable: true,
        suppressContentEditableWarning: true,
        onBlur: (e) => {
            const text = e.currentTarget.innerText;
            if (text !== value && onChange) onChange(text);
        },
        dangerouslySetInnerHTML: { __html: value || '' }
    });
};

const ModernTemplate = ({ data = {}, onEdit }) => {
    const { personalInfo = {}, summary = '', experience = [], education = [], skills = [] } = data;
    const skillsList = parseSkills(skills);

    return (
        <div className="flex min-h-[297mm] h-auto font-sans text-sm">
            <div className="w-[32%] bg-[#2D3748] text-white p-8 flex flex-col gap-8 h-auto pb-20">
                <div className="text-center">
                    <div className="w-20 h-20 bg-teal-500 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-lg text-white">
                        {personalInfo?.name?.charAt(0) || 'U'}
                    </div>
                    <EditableText
                        value={personalInfo?.name}
                        onChange={(v) => onEdit?.('personalInfo.name', v)}
                        tagName="h2"
                        className="text-lg font-bold text-white mb-1 leading-tight"
                        placeholder="NAME"
                    />
                    <EditableText
                        value={personalInfo?.title}
                        onChange={(v) => onEdit?.('personalInfo.title', v)}
                        tagName="p"
                        className="text-xs text-teal-300 opacity-90"
                        placeholder="Job Title"
                    />
                </div>
                <div className="space-y-4 text-xs">
                    <h3 className="text-teal-400 font-bold uppercase tracking-widest border-b border-gray-600 pb-2 mb-3">Contact</h3>
                    <div className="space-y-3 opacity-90">
                        {personalInfo?.email && <div className="flex items-center gap-2"><Mail size={12} /> <span className="break-all">{personalInfo.email}</span></div>}
                        {personalInfo?.phone && <div className="flex items-center gap-2"><Phone size={12} /> {personalInfo.phone}</div>}
                        {personalInfo?.location && <div className="flex items-center gap-2"><MapPin size={12} /> {personalInfo.location}</div>}
                        {personalInfo?.linkedin && <div className="flex items-center gap-2"><Linkedin size={12} /> <span className="truncate">LinkedIn</span></div>}
                    </div>
                </div>
                {education?.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-teal-400 text-xs font-bold uppercase tracking-widest border-b border-gray-600 pb-2">Education</h3>
                        {education.map((edu, i) => (
                            <div key={i}>
                                <div className="font-bold text-white text-xs">{edu.institution}</div>
                                <div className="text-[10px] text-gray-300">{edu.degree}</div>
                                <div className="text-[10px] text-teal-500 mt-0.5">{edu.year}</div>
                            </div>
                        ))}
                    </div>
                )}
                {skillsList.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-teal-400 text-xs font-bold uppercase tracking-widest border-b border-gray-600 pb-2">Skills</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {skillsList.slice(0, 15).map((s, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-700/50 rounded-full text-[10px] font-medium border border-gray-600">{typeof s === 'string' ? s : s.name || 'Skill'}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-1 p-8 bg-white text-slate-800 h-auto">
                <header className="mb-6 pb-4 border-b border-slate-200">
                    <EditableText
                        value={personalInfo?.name}
                        onChange={(v) => onEdit?.('personalInfo.name', v)}
                        tagName="h1"
                        className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight mb-1"
                        placeholder="YOUR NAME"
                    />
                    <EditableText
                        value={personalInfo?.title}
                        onChange={(v) => onEdit?.('personalInfo.title', v)}
                        tagName="p"
                        className="text-lg text-teal-600 font-medium"
                        placeholder="Professional Title"
                    />
                </header>
                {summary && (
                    <section className="mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Profile</h2>
                        <EditableText
                            value={summary}
                            onChange={(v) => onEdit?.('summary', v)}
                            tagName="p"
                            className="text-xs leading-relaxed text-slate-600 text-justify"
                            placeholder="Summary of your professional background..."
                        />
                    </section>
                )}
                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Experience</h2>
                        <div className="space-y-6">
                            {experience.map((exp, i) => (
                                <div key={i} className="relative pl-4 border-l-2 border-slate-200">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white"></div>
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <EditableText
                                            value={exp.company}
                                            onChange={(v) => onEdit?.(`experience.${i}.company`, v)}
                                            tagName="h3"
                                            className="text-sm font-bold text-slate-900"
                                            placeholder="Company Name"
                                        />
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{exp.startDate} – {exp.endDate || 'Present'}</span>
                                    </div>
                                    <EditableText
                                        value={exp.title}
                                        onChange={(v) => onEdit?.(`experience.${i}.title`, v)}
                                        tagName="div"
                                        className="text-xs text-teal-600 font-semibold mb-1.5"
                                        placeholder="Job Title"
                                    />
                                    <ul className="list-disc ml-3 space-y-1 marker:text-slate-300">
                                        {(exp.bullets || []).map((b, idx) => (
                                            <li key={idx} className="text-[11px] text-slate-600 leading-relaxed pl-1 text-justify">
                                                <EditableText
                                                    value={b}
                                                    onChange={(v) => onEdit?.(`experience.${i}.bullets.${idx}`, v)}
                                                    tagName="span"
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

const ExecutiveTemplate = ({ data = {} }) => (
    <div className="p-12 min-h-[297mm] h-auto bg-[#FAFAFA] font-serif text-[#1C1C1E] pb-20">
        <header className="text-center mb-8 relative">
            <h1 className="text-4xl font-serif font-bold mb-2 tracking-tight text-gray-900">{data.personalInfo?.name}</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-sans">{data.personalInfo?.title}</p>
            <div className="flex justify-center gap-4 mt-4 text-[10px] uppercase tracking-wide font-sans text-slate-500 border-t border-slate-200 pt-4 max-w-md mx-auto">
                <span>{data.personalInfo?.email}</span>
                <span className="text-slate-300">•</span>
                <span>{data.personalInfo?.phone}</span>
                <span className="text-slate-300">•</span>
                <span>{data.personalInfo?.location}</span>
            </div>
        </header>
        {data.summary && (
            <section className="mb-8 text-center max-w-xl mx-auto">
                <p className="text-sm italic leading-relaxed text-slate-600">{data.summary}</p>
            </section>
        )}
        {data.experience?.length > 0 && (
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <span className="flex-1 h-px bg-slate-300"></span>
                    <h2 className="uppercase tracking-widest text-[10px] font-bold text-slate-400 font-sans">Professional Experience</h2>
                    <span className="flex-1 h-px bg-slate-300"></span>
                </div>
                <div className="space-y-8">
                    {data.experience.map((exp, i) => (
                        <div key={i} className="grid grid-cols-[100px_1fr] gap-6">
                            <div className="text-right text-[10px] font-sans font-bold text-slate-400 pt-1 uppercase">
                                {exp.startDate}<br />{exp.endDate || 'Present'}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-0.5 text-gray-900">{exp.company}</h3>
                                <div className="text-slate-600 italic mb-2 text-xs">{exp.title}</div>
                                <ul className="space-y-1.5">
                                    {(exp.bullets || []).map((b, idx) => (
                                        <li key={idx} className="text-[11px] leading-relaxed text-slate-700 font-sans relative pl-3 text-justify">
                                            <span className="absolute left-0 top-1.5 w-1 h-1 bg-slate-300 rounded-full"></span>
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}
    </div>
);

const CreativeTemplate = ({ data = {} }) => {
    const skills = parseSkills(data?.skills);
    return (
        <div className="min-h-[297mm] h-auto bg-white flex flex-col font-sans pb-20">
            <div className="bg-indigo-600 text-white p-8">
                <h1 className="text-5xl font-black tracking-tighter mb-2">{data.personalInfo?.name}</h1>
                <p className="text-xl font-light opacity-80">{data.personalInfo?.title}</p>
            </div>
            <div className="flex flex-1">
                <div className="w-1/3 p-8 bg-slate-50 border-r border-slate-100 flex flex-col gap-8">
                    <div className="space-y-3">
                        <h3 className="font-black text-indigo-600 uppercase tracking-widest text-[10px]">Contact</h3>
                        <div className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
                            <span className="truncate">{data.personalInfo?.email}</span>
                            <span>{data.personalInfo?.phone}</span>
                            <span>{data.personalInfo?.location}</span>
                        </div>
                    </div>
                    {data.education && (
                        <div className="space-y-3">
                            <h3 className="font-black text-indigo-600 uppercase tracking-widest text-[10px]">Education</h3>
                            {data.education.map((e, i) => (
                                <div key={i}>
                                    <div className="font-bold text-slate-800 text-xs">{e.institution}</div>
                                    <div className="text-[10px] text-slate-500">{e.degree}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {skills.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-black text-indigo-600 uppercase tracking-widest text-[10px]">Skills</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {skills.map((s, i) => (
                                    <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-indigo-100">{typeof s === 'string' ? s : s.name}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-2/3 p-8 space-y-8">
                    {data.summary && (
                        <p className="text-sm font-medium leading-relaxed text-slate-700 border-l-4 border-indigo-500 pl-4 py-1 bg-slate-50/50">{data.summary}</p>
                    )}
                    {data.experience?.map((exp, i) => (
                        <div key={i} className="space-y-1.5">
                            <div className="flex justify-between items-center group border-b border-indigo-100 pb-1 mb-2">
                                <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{exp.company}</h3>
                                <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-full">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="text-sm font-bold text-indigo-500">{exp.title}</div>
                            <p className="text-[11px] text-slate-600 leading-relaxed text-justify">
                                {(exp.bullets || []).join(' ')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TechnicalTemplate = ({ data = {} }) => {
    const skills = parseSkills(data?.skills);
    return (
        <div className="min-h-[297mm] h-auto bg-[#1E1E1E] text-[#D4D4D4] font-mono text-xs p-8 flex flex-col pb-20">
            <div className="border border-[#333] flex-1 p-6 rounded bg-[#252526] shadow-none print:shadow-none print:border-none">
                <header className="mb-8 border-b border-[#333] pb-4">
                    <div className="text-[#569CD6] mb-1">class <span className="text-[#4EC9B0] font-bold text-lg">{data.personalInfo?.name?.replace(/\s/g, '') || 'Developer'}</span> extends <span className="text-[#4EC9B0]">Engineer</span> {'{'}</div>
                    <div className="pl-4 space-y-0.5 mt-2">
                        <div className="text-[#9CDCFE]">role <span className="text-[#D4D4D4]">=</span> <span className="text-[#CE9178]">"{data.personalInfo?.title}"</span>;</div>
                        <div className="text-[#9CDCFE]">email <span className="text-[#D4D4D4]">=</span> <span className="text-[#CE9178]">"{data.personalInfo?.email}"</span>;</div>
                        <div className="text-[#9CDCFE]">location <span className="text-[#D4D4D4]">=</span> <span className="text-[#CE9178]">"{data.personalInfo?.location}"</span>;</div>
                    </div>
                </header>
                <div className="grid grid-cols-[1fr_200px] gap-6">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-[#C586C0] font-bold mb-3">// Experience</h3>
                            {data.experience?.map((exp, i) => (
                                <div key={i} className="mb-4 pl-4 border-l border-[#404040]">
                                    <div className="flex gap-2 items-center mb-0.5">
                                        <span className="text-[#4EC9B0] font-bold">{exp.company}</span>
                                        <span className="text-[#6A9955] text-[10px]">/* {exp.startDate} - {exp.endDate} */</span>
                                    </div>
                                    <div className="text-[#569CD6] mb-1.5">{exp.title}</div>
                                    <ul className="space-y-0.5 pl-3 list-disc marker:text-[#569CD6]">
                                        {(exp.bullets || []).map((b, idx) => (
                                            <li key={idx} className="text-[#CCCCCC] opacity-90 text-[10px] leading-snug">{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-[#C586C0] font-bold mb-3">// Stack</h3>
                            <div className="flex flex-col gap-0.5">
                                {skills.map((s, i) => (
                                    <div key={i} className="text-[#CE9178] px-1 rounded cursor-default flex">
                                        <span className="text-[#D4D4D4] mr-2 text-[10px] opacity-50">{i + 1}.</span>
                                        "{typeof s === 'string' ? s : s.name}"
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-auto pt-4 text-[#6A9955] text-[10px] text-center border-t border-[#333]">
                    {'}'} // End of Class
                </div>
            </div>
        </div>
    );
};

const ProfessionalTemplate = ({ data = {} }) => (
    <div className="min-h-[297mm] h-auto bg-white text-gray-800 font-serif p-10 pb-20">
        <header className="border-b-2 border-black pb-4 mb-6">
            <h1 className="text-3xl font-bold uppercase tracking-widest text-center mb-2 text-black">{data.personalInfo?.name}</h1>
            <div className="flex justify-center gap-4 text-xs text-gray-600 font-sans separator-dots">
                <span>{data.personalInfo?.email}</span>
                <span>{data.personalInfo?.phone}</span>
                <span>{data.personalInfo?.location}</span>
            </div>
        </header>
        {data.experience?.length > 0 && (
            <section className="mb-6">
                <h2 className="text-xs font-bold uppercase border-b border-gray-300 mb-3 pb-1 font-sans text-gray-500">Professional Experience</h2>
                <div className="space-y-5">
                    {data.experience.map((exp, i) => (
                        <div key={i}>
                            <div className="flex justify-between font-bold text-base mb-0.5 text-black">
                                <span>{exp.company}</span>
                                <span className="font-normal text-sm font-sans italic text-gray-600">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="text-sm italic text-gray-700 mb-1.5">{exp.title}</div>
                            <ul className="list-disc ml-4 space-y-0.5">
                                {(exp.bullets || []).map((b, idx) => (
                                    <li key={idx} className="text-xs leading-snug text-gray-800 text-justify">{b}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        )}
    </div>
);

const OpenAIMtemplate = ({ data = {} }) => {
    const { personalInfo = {}, summary = '', experience = [], education = [], skills = [] } = data || {};
    const skillsList = parseSkills(skills);

    return (
        <div className="theme-openai min-h-[297mm] h-auto bg-white flex flex-col p-12 pb-20">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-black tracking-[-0.05em] text-slate-900 mb-2">{personalInfo?.name}</h1>
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-4">{personalInfo?.title}</p>
                <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-tight opacity-70">
                    <span>{personalInfo?.email}</span>
                    <span>{personalInfo?.phone}</span>
                    <span>{personalInfo?.location}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-12 flex-1">
                {summary && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Executive Overview
                        </h2>
                        <p className="text-sm leading-relaxed text-slate-700 font-medium text-justify">{summary}</p>
                    </section>
                )}

                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Deployment History
                        </h2>
                        <div className="space-y-8">
                            {experience.map((exp, i) => (
                                <div key={i} className="group transition-all">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <div className="flex flex-col">
                                            <h3 className="text-lg font-[900] text-slate-900 leading-tight">{exp.company}</h3>
                                            <div className="text-xs font-black text-indigo-600 uppercase tracking-tight">{exp.title}</div>
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">{exp.startDate} — {exp.endDate || 'Current'}</div>
                                    </div>
                                    <ul className="space-y-2 mt-3">
                                        {(exp.bullets || []).map((b, idx) => (
                                            <li key={idx} className="text-[11px] leading-relaxed text-slate-600 font-medium relative pl-4 text-justify">
                                                <span className="absolute left-0 top-1.5 w-1 h-1 bg-indigo-500/30 rounded-full group-hover:bg-indigo-500 transition-colors"></span>
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-2 gap-12">
                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Academic Node
                            </h2>
                            <div className="space-y-4">
                                {education.map((edu, i) => (
                                    <div key={i}>
                                        <div className="text-sm font-black text-slate-900">{edu.institution}</div>
                                        <div className="text-xs font-bold text-slate-500">{edu.degree}</div>
                                        <div className="text-[10px] font-black text-indigo-500 mt-1 uppercase tracking-widest">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {skillsList.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Neural Stack
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skillsList.map((s, i) => (
                                    <span key={i} className="px-2 py-1 bg-slate-50 text-slate-700 rounded-md text-[10px] font-black uppercase tracking-tighter border border-slate-100 hover:border-indigo-500 transition-colors">
                                        {typeof s === 'string' ? s : s.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

const GoogleTemplate = ({ data = {} }) => {
    const { personalInfo = {}, summary = '', experience = [], education = [], skills = [] } = data || {};
    const skillsList = parseSkills(skills);

    return (
        <div className="theme-google min-h-[297mm] h-auto bg-white flex flex-col p-16 font-sans pb-20">
            <header className="mb-12">
                <h1 className="text-5xl font-[300] tracking-tight text-slate-800 mb-3">{personalInfo?.name}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="font-bold text-slate-900 border-r border-slate-200 pr-4">{personalInfo?.title}</span>
                    <span>{personalInfo?.email}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span>{personalInfo?.phone}</span>
                </div>
            </header>

            <div className="space-y-12">
                {summary && (
                    <section>
                        <p className="text-base text-slate-600 leading-relaxed font-[300] max-w-3xl text-justify">{summary}</p>
                    </section>
                )}

                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Professional Experience</h2>
                        <div className="space-y-10">
                            {experience.map((exp, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-medium text-slate-900">{exp.company}</h3>
                                        <span className="text-sm text-slate-400">{exp.startDate} — {exp.endDate || 'Present'}</span>
                                    </div>
                                    <div className="text-lg text-indigo-600 font-medium mb-2">{exp.title}</div>
                                    <ul className="space-y-3">
                                        {(exp.bullets || []).map((b, idx) => (
                                            <li key={idx} className="text-[13px] leading-relaxed text-slate-500 font-[300] relative pl-6 text-justify">
                                                <span className="absolute left-0 top-[10px] w-1.5 h-[1px] bg-indigo-200"></span>
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-[1fr_250px] gap-16 pt-12 border-t border-slate-100">
                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Education</h2>
                            <div className="space-y-6">
                                {education.map((edu, i) => (
                                    <div key={i}>
                                        <div className="text-lg font-medium text-slate-900">{edu.institution}</div>
                                        <div className="text-sm text-slate-500">{edu.degree} · {edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {skillsList.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Key Skills</h2>
                            <div className="flex flex-wrap gap-x-6 gap-y-3">
                                {skillsList.map((s, i) => (
                                    <span key={i} className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors cursor-default">
                                        {typeof s === 'string' ? s : s.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;
