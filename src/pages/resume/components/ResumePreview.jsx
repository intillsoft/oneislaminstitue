import React, { useRef, useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

const ResumePreview = ({ data, template = 'modern' }) => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [scale, setScale] = useState(1);

    // Auto-Scaling Logic (Fit to Container)
    useEffect(() => {
        const calculateScale = () => {
            if (containerRef.current && contentRef.current) {
                // The available width from the parent container (Panel)
                // We access the grand-parent because containerRef is often the wrapper
                const parentElement = containerRef.current.parentElement;
                if (!parentElement) return;

                const parentWidth = parentElement.offsetWidth;
                const resumeWidth = 794; // approx 210mm @ 96dpi (A4)
                const padding = 32; // Small padding for breathing room

                // Calculate ratio
                const availableWidth = Math.max(0, parentWidth - padding);
                let newScale = availableWidth / resumeWidth;

                // Limits
                newScale = Math.min(newScale, 1.5); // Don't zoom in crazy amounts
                newScale = Math.max(newScale, 0.2); // Don't shrink to invisibility

                setScale(newScale);
            }
        };

        // 1. Initial Calculation
        calculateScale();

        // 2. Observer for container resize
        const resizeObserver = new ResizeObserver((entries) => {
            // Wrap in RAF to avoid "ResizeObserver loop limit exceeded"
            window.requestAnimationFrame(calculateScale);
        });

        if (containerRef.current?.parentElement) {
            resizeObserver.observe(containerRef.current.parentElement);
        }

        // 3. Fallback window listener
        window.addEventListener('resize', calculateScale);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', calculateScale);
        }
    }, []);

    // Print Style Injection
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                body * {
                    visibility: hidden;
                }
                #resume-preview-content, #resume-preview-content * {
                    visibility: visible;
                }
                #resume-preview-content {
                    visibility: visible !important;
                    position: absolute;
                    left: 0;
                    top: 0;
                    margin: 0;
                    padding: 0;
                    width: 210mm;
                    height: 297mm;
                    transform: none !important; /* Reset scale for print */
                }
                @page {
                    size: A4;
                    margin: 0mm;
                }
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // Choose template renderer
    const renderTemplate = () => {
        switch (template) {
            case 'professional': return <ProfessionalTemplate data={data} />;
            case 'executive': return <ExecutiveTemplate data={data} />;
            case 'creative': return <CreativeTemplate data={data} />;
            case 'technical': return <TechnicalTemplate data={data} />;
            case 'modern': default: return <ModernTemplate data={data} />;
        }
    };

    return (
        <div
            ref={containerRef}
            className="flex justify-center items-start w-full min-h-screen pt-8 pb-32 transition-all"
        >
            <div
                ref={contentRef}
                id="resume-preview-content"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    width: '210mm',
                    minHeight: '297mm',
                    height: '297mm', // Explicit height
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
                className="bg-white text-gray-900 transition-transform duration-100 ease-linear overflow-hidden print:shadow-none"
            >
                {renderTemplate()}
            </div>
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

// --- POWER TEMPLATES (ENHANCED) ---

// 1. MODERN PRO (Clean, Sidebar, Teal Accents)
const ModernTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills } = data;
    const skillsList = parseSkills(skills);

    return (
        <div className="flex h-full font-sans text-sm">
            {/* Left Sidebar */}
            <div className="w-[32%] bg-[#2D3748] text-white p-8 flex flex-col gap-8 h-full">
                <div className="text-center">
                    <div className="w-20 h-20 bg-teal-500 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-lg text-white">
                        {personalInfo?.name?.charAt(0) || 'U'}
                    </div>
                    <h2 className="text-lg font-bold text-white mb-1 leading-tight">{personalInfo?.name}</h2>
                    <p className="text-xs text-teal-300 opacity-90">{personalInfo?.title}</p>
                </div>

                {/* Contact */}
                <div className="space-y-4 text-xs">
                    <h3 className="text-teal-400 font-bold uppercase tracking-widest border-b border-gray-600 pb-2 mb-3">Contact</h3>
                    <div className="space-y-3 opacity-90">
                        {personalInfo?.email && <div className="flex items-center gap-2"><Mail size={12} /> <span className="break-all">{personalInfo.email}</span></div>}
                        {personalInfo?.phone && <div className="flex items-center gap-2"><Phone size={12} /> {personalInfo.phone}</div>}
                        {personalInfo?.location && <div className="flex items-center gap-2"><MapPin size={12} /> {personalInfo.location}</div>}
                        {personalInfo?.linkedin && <div className="flex items-center gap-2"><Linkedin size={12} /> <span className="truncate">LinkedIn</span></div>}
                    </div>
                </div>

                {/* Education */}
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

                {/* Skills */}
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

            {/* Main Content */}
            <div className="flex-1 p-8 bg-white text-slate-800 h-full">
                <header className="mb-6 pb-4 border-b border-slate-200">
                    <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight mb-1">{personalInfo?.name}</h1>
                    <p className="text-lg text-teal-600 font-medium">{personalInfo?.title}</p>
                </header>

                {summary && (
                    <section className="mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Profile</h2>
                        <p className="text-xs leading-relaxed text-slate-600 text-justify">{summary}</p>
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
                                        <h3 className="text-sm font-bold text-slate-900">{exp.company}</h3>
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{exp.startDate} – {exp.endDate || 'Present'}</span>
                                    </div>
                                    <div className="text-xs text-teal-600 font-semibold mb-1.5">{exp.title}</div>
                                    <ul className="list-disc ml-3 space-y-1 marker:text-slate-300">
                                        {(exp.bullets || []).map((b, idx) => (
                                            <li key={idx} className="text-[11px] text-slate-600 leading-relaxed pl-1 text-justify">{b}</li>
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

// 2. EXECUTIVE (Serif, High-End, Minimalist)
const ExecutiveTemplate = ({ data }) => (
    <div className="p-12 h-full bg-[#FAFAFA] font-serif text-[#1C1C1E]">
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

// 3. CREATIVE POP (Bold Color Blocks, Grids)
const CreativeTemplate = ({ data }) => {
    const skills = parseSkills(data.skills);
    return (
        <div className="h-full bg-white flex flex-col font-sans">
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

// 4. TECHNICAL (Dark Mode, Monospace, Code Editor Look)
const TechnicalTemplate = ({ data }) => {
    const skills = parseSkills(data.skills);
    return (
        <div className="h-full bg-[#1E1E1E] text-[#D4D4D4] font-mono text-xs p-8 flex flex-col">
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

// 5. PROFESSIONAL (Classic, Clean, Times New Roman style but modern)
const ProfessionalTemplate = ({ data }) => (
    <div className="h-full bg-white text-gray-800 font-serif p-10">
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

export default ResumePreview;
