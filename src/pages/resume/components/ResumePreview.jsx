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

// ... Placeholder for other templates to keep file size managed ...
const ExecutiveTemplate = ({ data }) => <ProfessionalTemplate data={data} />;
const CreativeTemplate = ({ data }) => <ModernTemplate data={data} />;
const TechnicalTemplate = ({ data }) => <ModernTemplate data={data} />;

export default ResumePreview;
