import React from 'react';
import { User, Briefcase, GraduationCap, Code, Plus, Trash2 } from 'lucide-react';
import ModernInput from '../../../components/ui/ModernInput';
import SectionCard from '../../../components/ui/SectionCard';
import AIButton from '../../../components/ui/AIButton';

const ResumeForm = ({ data, onChange, activeSection, setActiveSection }) => {

    const updateField = (section, field, value) => {
        onChange({
            ...data,
            [section]: {
                ...data[section],
                [field]: value
            }
        });
    };

    const updateList = (section, newList) => {
        onChange({
            ...data,
            [section]: newList
        });
    };

    const addItem = (section, initialItem) => {
        const newList = [...(data[section] || []), { id: Date.now(), ...initialItem }];
        updateList(section, newList);
    };

    const removeItem = (section, index) => {
        const newList = [...(data[section] || [])];
        newList.splice(index, 1);
        updateList(section, newList);
    };

    const updateItem = (section, index, field, value) => {
        const newList = [...(data[section] || [])];
        newList[index] = { ...newList[index], [field]: value };
        updateList(section, newList);
    };

    return (
        <div className="space-y-4">

            {/* Personal Info Section */}
            <SectionCard
                title="Personal Information"
                icon={<User className="w-5 h-5 text-blue-600" />}
                defaultOpen={true}
            >
                <div className="grid grid-cols-1 gap-4">
                    <ModernInput label="Full Name" value={data.personalInfo?.name} onChange={e => updateField('personalInfo', 'name', e.target.value)} />
                    <ModernInput label="Job Title" value={data.personalInfo?.title} onChange={e => updateField('personalInfo', 'title', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                        <ModernInput label="Email" value={data.personalInfo?.email} onChange={e => updateField('personalInfo', 'email', e.target.value)} />
                        <ModernInput label="Phone" value={data.personalInfo?.phone} onChange={e => updateField('personalInfo', 'phone', e.target.value)} />
                    </div>
                    <ModernInput label="Location" value={data.personalInfo?.location} onChange={e => updateField('personalInfo', 'location', e.target.value)} />
                    <ModernInput label="LinkedIn / Website" value={data.personalInfo?.website} onChange={e => updateField('personalInfo', 'website', e.target.value)} />
                </div>
                <div className="mt-4">
                    <label className="input-label">Professional Summary</label>
                    <div className="relative">
                        <textarea
                            className="modern-input h-32 py-3 resize-none"
                            value={data.summary || ''}
                            onChange={e => onChange({ ...data, summary: e.target.value })}
                            placeholder="Summarize your professional experience and key achievements..."
                        />
                        <div className="absolute bottom-3 right-3">
                            <AIButton onClick={() => { }} className="text-xs py-1 px-3">
                                Enhance
                            </AIButton>
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* Experience Section */}
            <SectionCard
                title="Work Experience"
                icon={<Briefcase className="w-5 h-5 text-blue-600" />}
                defaultOpen={activeSection === 'experience'}
            >
                <div className="space-y-6">
                    {(data.experience || []).map((exp, index) => (
                        <div key={exp.id || index} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group hover:shadow-md transition-shadow">
                            <button
                                onClick={() => removeItem('experience', index)}
                                className="absolute top-3 right-3 p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <ModernInput label="Job Title" value={exp.title} onChange={e => updateItem('experience', index, 'title', e.target.value)} />
                                <ModernInput label="Company" value={exp.company} onChange={e => updateItem('experience', index, 'company', e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <ModernInput label="Start Date" value={exp.startDate} onChange={e => updateItem('experience', index, 'startDate', e.target.value)} type="month" />
                                    <ModernInput label="End Date" value={exp.endDate} onChange={e => updateItem('experience', index, 'endDate', e.target.value)} type="month" />
                                </div>
                            </div>
                            <label className="input-label">Description (Bullet Points)</label>
                            <textarea
                                className="modern-input h-24 py-3 resize-none"
                                value={Array.isArray(exp.bullets) ? exp.bullets.join('\n') : exp.bullets || ''}
                                onChange={e => updateItem('experience', index, 'bullets', e.target.value.split('\n'))}
                                placeholder="• Achieved X result by doing Y..."
                            />
                        </div>
                    ))}
                    <button
                        onClick={() => addItem('experience', { title: '', company: '', bullets: [] })}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all font-medium flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Position
                    </button>
                </div>
            </SectionCard>

            {/* Education Section */}
            <SectionCard
                title="Education"
                icon={<GraduationCap className="w-5 h-5 text-blue-600" />}
                defaultOpen={activeSection === 'education'}
            >
                <div className="space-y-6">
                    {(data.education || []).map((edu, index) => (
                        <div key={edu.id || index} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group hover:shadow-md transition-shadow">
                            <button
                                onClick={() => removeItem('education', index)}
                                className="absolute top-3 right-3 p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 gap-4">
                                <ModernInput label="School / University" value={edu.institution} onChange={e => updateItem('education', index, 'institution', e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <ModernInput label="Degree" value={edu.degree} onChange={e => updateItem('education', index, 'degree', e.target.value)} />
                                    <ModernInput label="Graduation Year" value={edu.year} onChange={e => updateItem('education', index, 'year', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => addItem('education', { institution: '', degree: '' })}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all font-medium flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Education
                    </button>
                </div>
            </SectionCard>

            {/* Skills Section */}
            <SectionCard
                title="Skills"
                icon={<Code className="w-5 h-5 text-blue-600" />}
                defaultOpen={activeSection === 'skills'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="input-label">
                            Technical Skills (Comma separated)
                        </label>
                        <textarea
                            className="modern-input h-20 py-3 resize-none"
                            value={Array.isArray(data.skills) ? data.skills.join(', ') : typeof data.skills === 'object' ? Object.values(data.skills).flat().join(', ') : data.skills || ''}
                            onChange={e => onChange({ ...data, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            placeholder="React, Node.js, Python, AWS..."
                        />
                    </div>
                </div>
            </SectionCard>

        </div>
    );
};

export default ResumeForm;
