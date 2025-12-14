import React, { useRef, useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

const ResumePreview = ({ data, template = 'modern' }) => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);

    // Auto-Scaling Logic (Fit to Container)
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const parentWidth = containerRef.current.parentElement?.offsetWidth || 800;
                const resumeWidth = 794; // approx 210mm @ 96dpi (A4)
                const padding = 64; // 32px padding on each side

                // Calculate scale to fit parent width minus padding
                let newScale = (parentWidth - padding) / resumeWidth;

                // Cap scale at 1.2 for readability on large screens, allow shrinking
                newScale = Math.min(newScale, 1.2);
                setScale(newScale);
            }
        };

        // Initial sizing
        handleResize();

        // Listen for resizing
        const resizeObserver = new ResizeObserver(() => {
            window.requestAnimationFrame(handleResize);
        });

        if (containerRef.current?.parentElement) {
            resizeObserver.observe(containerRef.current.parentElement);
        }

        return () => resizeObserver.disconnect();
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
        <div ref={containerRef} className="flex justify-center items-start min-h-screen py-8">
            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    width: '210mm', // Fixed A4 width
                    minHeight: '297mm' // Fixed A4 height ratio
                }}
                className="bg-white text-gray-900 shadow-2xl transition-transform duration-200 ease-out"
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

// --- POWER TEMPLATES ---

// 1. MODERN PRO (Clean, Sidebar, Teal Accents)
const ModernTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills } = data;
    const skillsList = parseSkills(skills);

    return (
        <div className="flex h-full min-h-[297mm] font-sans">
            {/* Left Sidebar */}
            <div className="w-[32%] bg-[#1A202C] text-white p-8 flex flex-col gap-8">
                <div className="text-center">
                    <div className="w-24 h-24 bg-teal-500 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
                        {personalInfo?.name?.charAt(0) || 'U'}
                    </div>
                </div>

                {/* Contact */}
                <div className="space-y-4 text-sm">
                    <h3 className="text-teal-400 text-xs font-bold uppercase tracking-widest border-b border-gray-700 pb-2">Contact</h3>
                    <div className="space-y-3 opacity-90">
                        {personalInfo?.email && <div className="flex items-center gap-3"><Mail size={14} /> <span className="break-all">{personalInfo.email}</span></div>}
                        {personalInfo?.phone && <div className="flex items-center gap-3"><Phone size={14} /> {personalInfo.phone}</div>}
                        {personalInfo?.location && <div className="flex items-center gap-3"><MapPin size={14} /> {personalInfo.location}</div>}
                        {personalInfo?.linkedin && <div className="flex items-center gap-3"><Linkedin size={14} /> <span className="truncate">LinkedIn</span></div>}
                    </div>
                </div>

                {/* Education */}
                {education?.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-teal-400 text-xs font-bold uppercase tracking-widest border-b border-gray-700 pb-2">Education</h3>
                        {education.map((edu, i) => (
                            <div key={i}>
                                <div className="font-bold text-sm">{edu.institution}</div>
                                <div className="text-xs text-gray-400">{edu.degree}</div>
                                <div className="text-xs text-teal-500 mt-1">{edu.year}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Skills */}
                {skillsList.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-teal-400 text-xs font-bold uppercase tracking-widest border-b border-gray-700 pb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {skillsList.slice(0, 15).map((s, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-700 rounded text-xs font-medium">{typeof s === 'string' ? s : s.name || 'Skill'}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 bg-white text-slate-800">
                <header className="mb-8 pb-6 border-b-2 border-slate-100">
                    <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">{personalInfo?.name}</h1>
                    <p className="text-xl text-teal-600 font-medium">{personalInfo?.title}</p>
                </header>

                {summary && (
                    <section className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Profile</h2>
                        <p className="text-sm leading-relaxed text-slate-600">{summary}</p>
                    </section>
                )}

                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">Experience</h2>
                        <div className="space-y-8">
                            {experience.map((exp, i) => (
                                <div key={i} className="relative pl-6 border-l-2 border-slate-200">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white"></div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-bold text-slate-900">{exp.company}</h3>
                                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{exp.startDate} – {exp.endDate || 'Present'}</span>
                                    </div>
                                    <div className="text-medium text-teal-600 font-semibold mb-2">{exp.title}</div>
                                    <ul className="list-disc ml-4 space-y-1.5 marker:text-slate-400">
                                        {(exp.bullets || []).map((b, idx) => (
                                            <li key={idx} className="text-sm text-slate-600 leading-relaxed pl-1">{b}</li>
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
    <div className="p-16 h-full min-h-[297mm] bg-[#FAFAFA] font-serif text-[#1C1C1E]">
        <header className="text-center mb-12 relative">
            <h1 className="text-5xl font-serif font-bold mb-3 tracking-tight">{data.personalInfo?.name}</h1>
            <p className="text-lg text-slate-500 uppercase tracking-widest font-sans text-xs">{data.personalInfo?.title}</p>
            <div className="flex justify-center gap-6 mt-6 text-sm font-sans text-slate-500 border-t border-slate-200 pt-6 max-w-lg mx-auto">
                <span>{data.personalInfo?.email}</span>
                <span>{data.personalInfo?.phone}</span>
                <span>{data.personalInfo?.location}</span>
            </div>
        </header>

        {data.summary && (
            <section className="mb-10 text-center max-w-2xl mx-auto">
                <p className="text-lg italic leading-relaxed text-slate-700">{data.summary}</p>
            </section>
        )}

        {data.experience?.length > 0 && (
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <span className="flex-1 h-px bg-slate-200"></span>
                    <h2 className="uppercase tracking-widest text-xs font-bold text-slate-400 font-sans">Experience</h2>
                    <span className="flex-1 h-px bg-slate-200"></span>
                </div>

                <div className="space-y-10">
                    {data.experience.map((exp, i) => (
                        <div key={i} className="grid grid-cols-[120px_1fr] gap-8">
                            <div className="text-right text-xs font-sans font-bold text-slate-400 pt-1">
                                {exp.startDate}<br />{exp.endDate || 'Present'}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">{exp.company}</h3>
                                <div className="text-slate-600 italic mb-3 text-sm">{exp.title}</div>
                                <ul className="space-y-2">
                                    {(exp.bullets || []).map((b, idx) => (
                                        <li key={idx} className="text-sm leading-relaxed text-slate-700 font-sans relative pl-3">
                                            <span className="absolute left-0 top-2 w-1 h-1 bg-slate-300 rounded-full"></span>
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
        <div className="h-full min-h-[297mm] bg-white flex flex-col font-sans">
            <div className="bg-indigo-600 text-white p-12">
                <h1 className="text-6xl font-black tracking-tighter mb-2">{data.personalInfo?.name}</h1>
                <p className="text-2xl font-light opacity-80">{data.personalInfo?.title}</p>
            </div>

            <div className="flex flex-1">
                <div className="w-1/3 p-10 bg-slate-50 border-r border-slate-100 flex flex-col gap-10">
                    <div className="space-y-4">
                        <h3 className="font-black text-indigo-600 uppercase tracking-widest text-sm">Contact</h3>
                        <div className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                            <span className="truncate">{data.personalInfo?.email}</span>
                            <span>{data.personalInfo?.phone}</span>
                            <span>{data.personalInfo?.location}</span>
                        </div>
                    </div>

                    {data.education && (
                        <div className="space-y-4">
                            <h3 className="font-black text-indigo-600 uppercase tracking-widest text-sm">Education</h3>
                            {data.education.map((e, i) => (
                                <div key={i}>
                                    <div className="font-bold text-slate-800">{e.institution}</div>
                                    <div className="text-xs text-slate-500">{e.degree}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {skills.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-black text-indigo-600 uppercase tracking-widest text-sm">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((s, i) => (
                                    <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">{typeof s === 'string' ? s : s.name}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-2/3 p-12 space-y-12">
                    {data.summary && (
                        <p className="text-xl font-medium leading-relaxed text-slate-700 border-l-4 border-indigo-500 pl-4">{data.summary}</p>
                    )}

                    {data.experience?.map((exp, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between items-center group">
                                <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{exp.company}</h3>
                                <span className="text-xs font-bold bg-slate-900 text-white px-3 py-1 rounded-full">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="text-lg font-bold text-indigo-500">{exp.title}</div>
                            <p className="text-sm text-slate-600 leading-relaxed">
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
        <div className="h-full min-h-[297mm] bg-[#1E1E1E] text-[#D4D4D4] font-mono text-sm p-8 flex flex-col">
            <div className="border border-[#333] flex-1 p-8 rounded bg-[#252526] shadow-xl">
                <header className="mb-10 border-b border-[#333] pb-6">
                    <div className="text-[#569CD6] mb-1">class <span className="text-[#4EC9B0] font-bold text-xl">{data.personalInfo?.name?.replace(/\s/g, '') || 'Developer'}</span> extends <span className="text-[#4EC9B0]">Engineer</span> {'{'}</div>
                    <div className="pl-6 space-y-1 mt-2">
                        <div className="text-[#9CDCFE]">role <span className="text-[#D4D4D4]">=</span> <span className="text-[#CE9178]">"{data.personalInfo?.title}"</span>;</div>
                        <div className="text-[#9CDCFE]">email <span className="text-[#D4D4D4]">=</span> <span className="text-[#CE9178]">"{data.personalInfo?.email}"</span>;</div>
                        <div className="text-[#9CDCFE]">location <span className="text-[#D4D4D4]">=</span> <span className="text-[#CE9178]">"{data.personalInfo?.location}"</span>;</div>
                    </div>
                </header>

                <div className="grid grid-cols-[1fr_250px] gap-8">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-[#C586C0] font-bold mb-4">// Experience</h3>
                            {data.experience?.map((exp, i) => (
                                <div key={i} className="mb-6 pl-4 border-l border-[#404040] hover:border-[#569CD6] transition-colors">
                                    <div className="flex gap-2 items-center mb-1">
                                        <span className="text-[#4EC9B0] font-bold">{exp.company}</span>
                                        <span className="text-[#6A9955] text-xs">/* {exp.startDate} - {exp.endDate} */</span>
                                    </div>
                                    <div className="text-[#569CD6] mb-2">{exp.title}</div>
                                    <ul className="space-y-1 pl-4 list-disc marker:text-[#569CD6]">
                                        {(exp.bullets || []).map((b, idx) => (
                                            <li key={idx} className="text-[#CCCCCC] opacity-90 text-xs leading-relaxed">{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-[#C586C0] font-bold mb-4">// Stack</h3>
                            <div className="flex flex-col gap-1">
                                {skills.map((s, i) => (
                                    <div key={i} className="text-[#CE9178] hover:bg-[#333] px-1 rounded cursor-default">
                                        <span className="text-[#D4D4D4] mr-2 text-xs">{i + 1}.</span>
                                        "{typeof s === 'string' ? s : s.name}"
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-6 text-[#6A9955] text-xs text-center border-t border-[#333]">
                    {'}'} // End of Class
                </div>
            </div>
        </div>
    );
};

// 5. PROFESSIONAL (Classic, Clean, Times New Roman style but modern)
const ProfessionalTemplate = ({ data }) => (
    <div className="h-full min-h-[297mm] bg-white text-gray-800 font-serif p-12">
        <header className="border-b-2 border-black pb-4 mb-8">
            <h1 className="text-3xl font-bold uppercase tracking-widest text-center mb-2 text-black">{data.personalInfo?.name}</h1>
            <div className="flex justify-center gap-4 text-sm text-gray-600 font-sans separator-dots">
                <span>{data.personalInfo?.email}</span>
                <span>{data.personalInfo?.phone}</span>
                <span>{data.personalInfo?.location}</span>
            </div>
        </header>

        {data.experience?.length > 0 && (
            <section className="mb-6">
                <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-4 pb-1 font-sans text-gray-500">Professional Experience</h2>
                <div className="space-y-6">
                    {data.experience.map((exp, i) => (
                        <div key={i}>
                            <div className="flex justify-between font-bold text-lg mb-0.5">
                                <span>{exp.company}</span>
                                <span className="font-normal text-base font-sans italic text-gray-600">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="text-md italic text-gray-700 mb-2">{exp.title}</div>
                            <ul className="list-disc ml-5 space-y-1">
                                {(exp.bullets || []).map((b, idx) => (
                                    <li key={idx} className="text-sm leading-snug text-gray-800">{b}</li>
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
