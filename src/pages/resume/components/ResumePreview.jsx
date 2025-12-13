import React, { useRef } from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

const ResumePreview = ({ data, template = 'modern' }) => {
    const containerRef = useRef(null);

    // Choose template renderer
    const renderTemplate = () => {
        switch (template) {
            case 'professional':
                return <ProfessionalTemplate data={data} />;
            case 'executive':
                return <ExecutiveTemplate data={data} />;
            case 'creative':
                return <CreativeTemplate data={data} />;
            case 'technical':
                return <TechnicalTemplate data={data} />;
            case 'modern':
            default:
                return <ModernTemplate data={data} />;
        }
    };

    return (
        <div
            ref={containerRef}
            className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-2xl mx-auto overflow-hidden print:shadow-none bg-white"
            style={{ pageBreakAfter: 'always' }}
        >
            {renderTemplate()}
        </div>
    );
};

// --- TEMPLATES ---

const parseSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'object') {
        const allSkills = [];
        if (skills.technical && Array.isArray(skills.technical)) allSkills.push(...skills.technical);
        if (skills.soft && Array.isArray(skills.soft)) allSkills.push(...skills.soft);
        if (skills.tools && Array.isArray(skills.tools)) allSkills.push(...skills.tools);
        // Fallback for other keys
        Object.keys(skills).forEach(key => {
            if (['technical', 'soft', 'tools', 'languages'].includes(key)) return;
            if (Array.isArray(skills[key])) allSkills.push(...skills[key]);
        });
        return allSkills;
    }
    return [skills];
};

const ModernTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills } = data;
    const skillsList = parseSkills(skills);

    return (
        <div className="flex h-full min-h-[297mm]">
            {/* Sidebar */}
            <div className="w-1/3 bg-slate-900 text-white p-8 space-y-8">
                <div className="space-y-4">
                    <div className="w-32 h-32 bg-slate-700 rounded-full mx-auto flex items-center justify-center text-4xl font-bold">
                        {personalInfo?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold border-b border-slate-700 pb-2 mb-4">Contact</h2>
                        {/* ... Contact details ... */}
                        <div className="space-y-3 text-sm text-slate-300">
                            {personalInfo?.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 shrink-0" /> <span className="break-all">{personalInfo.email}</span>
                                </div>
                            )}
                            {personalInfo?.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 shrink-0" /> {personalInfo.phone}
                                </div>
                            )}
                            {personalInfo?.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 shrink-0" /> {personalInfo.location}
                                </div>
                            )}
                            {personalInfo?.website && (
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 shrink-0" /> <span className="break-all">{personalInfo.website}</span>
                                </div>
                            )}
                            {/* LinkedIn Support added */}
                            {personalInfo?.linkedin && (
                                <div className="flex items-center gap-2">
                                    <Linkedin className="w-4 h-4 shrink-0" /> <span className="break-all">{personalInfo.linkedin}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {skillsList.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold border-b border-slate-700 pb-2 mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {skillsList.map((skill, i) => (
                                <span key={i} className="bg-slate-700 px-3 py-1 rounded-full text-xs">
                                    {typeof skill === 'string' ? skill : JSON.stringify(skill)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {education && education.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold border-b border-slate-700 pb-2 mb-4">Education</h2>
                        <div className="space-y-4">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <div className="font-bold text-sm">{edu.institution}</div>
                                    <div className="text-xs text-slate-400">{edu.degree}</div>
                                    <div className="text-xs text-slate-500">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="w-2/3 p-8 space-y-8 bg-white text-gray-800">
                <header className="border-b-2 border-slate-900 pb-6">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 uppercase">{personalInfo?.name || 'Your Name'}</h1>
                    <p className="text-xl text-slate-600 mt-2 font-light">{personalInfo?.title || 'Professional Title'}</p>
                </header>

                {summary && (
                    <section>
                        <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                            <span className="w-1 h-6 bg-slate-900 block"></span> Professional Profile
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600">{summary}</p>
                    </section>
                )}

                {experience && experience.length > 0 && (
                    <section>
                        <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-slate-900 block"></span> Experience
                        </h3>
                        <div className="space-y-6">
                            {experience.map((exp, i) => (
                                <div key={i} className="relative pl-4 border-l-2 border-slate-100">
                                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-900"></div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-slate-900">{exp.title}</h4>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">{exp.startDate} - {exp.endDate || 'Present'}</span>
                                    </div>
                                    <div className="text-sm font-medium text-slate-600 mb-2">{exp.company}</div>
                                    <ul className="list-disc list-outside ml-4 space-y-1">
                                        {(exp.bullets || []).map((bullet, idx) => (
                                            <li key={idx} className="text-xs text-gray-600 leading-snug">{bullet}</li>
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

const ProfessionalTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills } = data;
    const skillsList = parseSkills(skills);

    return (
        <div className="p-10 max-w-none h-full bg-white text-gray-900 font-serif">
            <header className="text-center border-b-2 border-gray-900 pb-6 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-widest">{personalInfo?.name}</h1>
                <p className="text-lg italic text-gray-600 mb-4">{personalInfo?.title}</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 font-sans">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo?.location && <span>• {personalInfo.location}</span>}
                    {personalInfo?.website && <span>• {personalInfo.website}</span>}
                    {personalInfo?.linkedin && <span>• {personalInfo.linkedin}</span>}
                </div>
            </header>

            {summary && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-3 pb-1 font-sans text-gray-500">Professional Summary</h2>
                    <p className="text-sm leading-relaxed text-gray-800">{summary}</p>
                </section>
            )}

            {experience && experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-4 pb-1 font-sans text-gray-500">Experience</h2>
                    <div className="space-y-6">
                        {experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-lg text-gray-900">{exp.company}</h3>
                                    <span className="text-sm text-gray-600 font-sans italic">{exp.startDate} – {exp.endDate || 'Present'}</span>
                                </div>
                                <div className="text-md font-medium text-gray-700 italic mb-2">{exp.title}</div>
                                <ul className="list-disc ml-5 space-y-1">
                                    {(exp.bullets || []).map((b, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 leading-relaxed">{b}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-8">
                {education && education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-3 pb-1 font-sans text-gray-500">Education</h2>
                        {education.map((edu, i) => (
                            <div key={i} className="mb-3">
                                <div className="font-bold">{edu.institution}</div>
                                <div className="text-sm italic">{edu.degree}</div>
                                <div className="text-xs text-gray-500 font-sans">{edu.year}</div>
                            </div>
                        ))}
                    </section>
                )}

                {skillsList.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-3 pb-1 font-sans text-gray-500">Skills</h2>
                        <div className="text-sm leading-relaxed">
                            {/* Join with dots if they fit, otherwise standard list */}
                            {skillsList.map(s => typeof s === 'string' ? s : '').filter(Boolean).join(' • ')}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

// --- Executive Template (Serif, Elegant, Traditional) ---
const ExecutiveTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills } = data;
    const skillsList = parseSkills(skills);

    return (
        <div className="p-12 max-w-none h-full bg-white text-slate-900 font-serif border-t-8 border-slate-900">
            <header className="border-b-2 border-slate-200 pb-8 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-bold text-slate-900 mb-2 tracking-tight">{personalInfo?.name}</h1>
                    <p className="text-xl text-slate-600 font-sans tracking-wide uppercase">{personalInfo?.title}</p>
                </div>
                <div className="text-right text-sm text-slate-600 font-sans space-y-1">
                    {personalInfo?.email && <div className="flex items-center justify-end gap-2">{personalInfo.email} <Mail className="w-3 h-3" /></div>}
                    {personalInfo?.phone && <div className="flex items-center justify-end gap-2">{personalInfo.phone} <Phone className="w-3 h-3" /></div>}
                    {personalInfo?.linkedin && <div className="flex items-center justify-end gap-2">{personalInfo.linkedin} <Linkedin className="w-3 h-3" /></div>}
                </div>
            </header>

            {summary && (
                <section className="mb-10">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 font-sans">Executive Profile</h2>
                    <p className="text-lg leading-relaxed text-slate-800 italic border-l-4 border-slate-200 pl-4">{summary}</p>
                </section>
            )}

            {experience && experience.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 font-sans border-b border-slate-200 pb-2">Professional Experience</h2>
                    <div className="space-y-8">
                        {experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="font-bold text-xl text-slate-900">{exp.company}</h3>
                                    <span className="text-sm font-sans text-slate-500">{exp.startDate} – {exp.endDate || 'Present'}</span>
                                </div>
                                <div className="text-lg font-medium text-slate-700 mb-3">{exp.title}</div>
                                <ul className="list-disc ml-5 space-y-2">
                                    {(exp.bullets || []).map((b, idx) => (
                                        <li key={idx} className="text-base text-slate-700 leading-relaxed font-sans">{b}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-12">
                {skillsList.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 font-sans border-b border-slate-200 pb-2">Core Competencies</h2>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm text-slate-700">
                            {/* Two column list look */}
                            {skillsList.map((skill, i) => (
                                <span key={i} className="w-[45%]">• {typeof skill === 'string' ? skill : skill.name || JSON.stringify(skill)}</span>
                            ))}
                        </div>
                    </section>
                )}

                {education && education.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 font-sans border-b border-slate-200 pb-2">Education</h2>
                        {education.map((edu, i) => (
                            <div key={i} className="mb-4">
                                <div className="font-bold text-lg">{edu.institution}</div>
                                <div className="text-slate-600">{edu.degree}</div>
                                <div className="text-slate-400 text-sm font-sans">{edu.year}</div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
};

// --- Creative Template (Bold Colors, Modern Layout) ---
const CreativeTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills } = data;
    const skillsList = parseSkills(skills);

    return (
        <div className="h-full min-h-[297mm] bg-white flex flex-col">
            {/* Bold Header */}
            <div className="bg-[#FF3366] text-white p-10">
                <h1 className="text-6xl font-black tracking-tighter mb-4">{personalInfo?.name}</h1>
                <p className="text-2xl font-light opacity-90">{personalInfo?.title}</p>
            </div>

            <div className="flex flex-1">
                {/* Left Column */}
                <div className="w-[35%] bg-slate-50 p-8 border-r border-slate-100">
                    <div className="space-y-8">
                        <div>
                            <h3 className="font-black text-slate-900 uppercase tracking-widest mb-4">Contact</h3>
                            <div className="space-y-3 text-sm font-medium text-slate-600">
                                {personalInfo?.email && <div className="break-all">@{personalInfo.email.split('@')[0]}</div>}
                                {personalInfo?.phone && <div>{personalInfo.phone}</div>}
                                {personalInfo?.website && <div className="break-all">{personalInfo.website}</div>}
                            </div>
                        </div>

                        {education && education.length > 0 && (
                            <div>
                                <h3 className="font-black text-slate-900 uppercase tracking-widest mb-4">Education</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="mb-4">
                                        <div className="font-bold">{edu.institution}</div>
                                        <div className="text-xs text-[#FF3366] font-bold uppercase">{edu.degree}</div>
                                        <div className="text-xs text-slate-400">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {skillsList.length > 0 && (
                            <div>
                                <h3 className="font-black text-slate-900 uppercase tracking-widest mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skillsList.map((skill, i) => (
                                        <span key={i} className="bg-white border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
                                            {typeof skill === 'string' ? skill : JSON.stringify(skill)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex-1 p-10 space-y-10">
                    {summary && (
                        <section>
                            <p className="text-xl leading-relaxed text-slate-800 font-medium">{summary}</p>
                        </section>
                    )}

                    {experience && experience.length > 0 && (
                        <section>
                            {experience.map((exp, i) => (
                                <div key={i} className="mb-8 relative pl-6 border-l-2 border-[#FF3366]">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-black text-2xl text-slate-900">{exp.company}</h3>
                                    </div>
                                    <div className="mb-3 flex items-center gap-3">
                                        <span className="text-lg font-bold text-[#FF3366]">{exp.title}</span>
                                        <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {(exp.bullets || []).map((b, idx) => (
                                            <li key={idx} className="text-sm text-slate-600 font-medium leading-relaxed">{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Technical Template (Monospace, Developer Focused) ---
const TechnicalTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills } = data;
    const skillsList = parseSkills(skills);

    return (
        <div className="p-10 max-w-none h-full bg-[#1E1E1E] text-[#D4D4D4] font-mono text-sm">
            <header className="mb-8 border-b border-[#333] pb-6">
                <div className="text-[#569CD6] mb-2">{`class ${personalInfo?.name?.replace(/\s+/g, '') || 'Developer'} extends Human {`}</div>
                <div className="pl-4">
                    <div className="text-[#CE9178]"><span className="text-[#9CDCFE]">role</span> = "{personalInfo?.title}";</div>
                    <div className="text-[#CE9178]"><span className="text-[#9CDCFE]">email</span> = "{personalInfo?.email}";</div>
                    <div className="text-[#CE9178]"><span className="text-[#9CDCFE]">stack</span> = ["{skillsList.slice(0, 3).join('", "')}"];</div>
                </div>
                <div className="text-[#569CD6]">}</div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* Main Column */}
                <div className="col-span-8 space-y-8">
                    {experience && experience.length > 0 && (
                        <section>
                            <h2 className="text-[#569CD6] text-lg font-bold mb-4">// Work Experience</h2>
                            {experience.map((exp, i) => (
                                <div key={i} className="mb-6 pl-4 border-l border-[#333]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[#4EC9B0] font-bold text-lg">{exp.company}</span>
                                        <span className="text-[#6A9955] text-xs">/* {exp.startDate} - {exp.endDate || 'Now'} */</span>
                                    </div>
                                    <div className="text-[#9CDCFE] mb-2">{exp.title}</div>
                                    <ul className="list-disc ml-4 space-y-1 text-[#D4D4D4]">
                                        {(exp.bullets || []).map((b, idx) => (
                                            <li key={idx} className="leading-relaxed opacity-90">{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="col-span-4 space-y-8">
                    {skillsList.length > 0 && (
                        <section>
                            <h2 className="text-[#C586C0] text-lg font-bold mb-4">// Tech Stack</h2>
                            <div className="flex flex-col gap-1">
                                {skillsList.map((skill, i) => (
                                    <div key={i} className="text-[#CE9178]">
                                        <span className="text-[#D4D4D4]">{i < 9 ? `0${i + 1}` : i + 1} </span>
                                        "{typeof skill === 'string' ? skill : JSON.stringify(skill)}"
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {education && education.length > 0 && (
                        <section>
                            <h2 className="text-[#C586C0] text-lg font-bold mb-4">// Education</h2>
                            {education.map((edu, i) => (
                                <div key={i} className="mb-4 text-[#D4D4D4]">
                                    <div className="font-bold text-[#4EC9B0]">{edu.institution}</div>
                                    <div className="text-xs">{edu.degree}</div>
                                    <div className="text-[#6A9955] text-xs">// {edu.year}</div>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>

            <footer className="mt-8 pt-4 border-t border-[#333] text-center text-[#6A9955] text-xs">
                 /* Generated by Workflow AI */
            </footer>
        </div>
    );
};

export default ResumePreview;
