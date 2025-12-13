import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Briefcase, GraduationCap, Code, Award,
    ChevronDown, Plus, Trash2, GripVertical
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
        <div className="space-y-4 pb-20">

            {/* Personal Info Section */}
            <FormSection
                id="personal"
                title="Personal Information"
                icon={User}
                isActive={activeSection === 'personal'}
                onToggle={() => setActiveSection(activeSection === 'personal' ? null : 'personal')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name" value={data.personalInfo?.name} onChange={v => updateField('personalInfo', 'name', v)} />
                    <Input label="Job Title" value={data.personalInfo?.title} onChange={v => updateField('personalInfo', 'title', v)} />
                    <Input label="Email" value={data.personalInfo?.email} onChange={v => updateField('personalInfo', 'email', v)} />
                    <Input label="Phone" value={data.personalInfo?.phone} onChange={v => updateField('personalInfo', 'phone', v)} />
                    <Input label="Location" value={data.personalInfo?.location} onChange={v => updateField('personalInfo', 'location', v)} />
                    <Input label="LinkedIn / Website" value={data.personalInfo?.website} onChange={v => updateField('personalInfo', 'website', v)} />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Professional Summary</label>
                    <textarea
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-workflow-primary h-32 text-sm"
                        value={data.summary || ''}
                        onChange={e => onChange({ ...data, summary: e.target.value })}
                        placeholder="Summarize your professional experience and key achievements..."
                    />
                </div>
            </FormSection>

            {/* Experience Section */}
            <FormSection
                id="experience"
                title="Work Experience"
                icon={Briefcase}
                isActive={activeSection === 'experience'}
                onToggle={() => setActiveSection(activeSection === 'experience' ? null : 'experience')}
            >
                <div className="space-y-6">
                    {(data.experience || []).map((exp, index) => (
                        <div key={exp.id || index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 relative group">
                            <button
                                onClick={() => removeItem('experience', index)}
                                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input label="Job Title" value={exp.title} onChange={v => updateItem('experience', index, 'title', v)} />
                                <Input label="Company" value={exp.company} onChange={v => updateItem('experience', index, 'company', v)} />
                                <Input label="Start Date" value={exp.startDate} onChange={v => updateItem('experience', index, 'startDate', v)} type="month" />
                                <Input label="End Date" value={exp.endDate} onChange={v => updateItem('experience', index, 'endDate', v)} type="month" />
                            </div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Bullet Points)</label>
                            <textarea
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-workflow-primary h-24 text-sm"
                                value={Array.isArray(exp.bullets) ? exp.bullets.join('\n') : exp.bullets || ''}
                                onChange={e => updateItem('experience', index, 'bullets', e.target.value.split('\n'))}
                                placeholder="• Achieved X result by doing Y..."
                            />
                        </div>
                    ))}
                    <button
                        onClick={() => addItem('experience', { title: '', company: '', bullets: [] })}
                        className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 hover:border-workflow-primary hover:text-workflow-primary transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Position
                    </button>
                </div>
            </FormSection>

            {/* Education Section */}
            <FormSection
                id="education"
                title="Education"
                icon={GraduationCap}
                isActive={activeSection === 'education'}
                onToggle={() => setActiveSection(activeSection === 'education' ? null : 'education')}
            >
                <div className="space-y-6">
                    {(data.education || []).map((edu, index) => (
                        <div key={edu.id || index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 relative group">
                            <button
                                onClick={() => removeItem('education', index)}
                                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="School / University" value={edu.institution} onChange={v => updateItem('education', index, 'institution', v)} />
                                <Input label="Degree" value={edu.degree} onChange={v => updateItem('education', index, 'degree', v)} />
                                <Input label="Graduation Year" value={edu.year} onChange={v => updateItem('education', index, 'year', v)} />
                                <Input label="GPA (Optional)" value={edu.gpa} onChange={v => updateItem('education', index, 'gpa', v)} />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => addItem('education', { institution: '', degree: '' })}
                        className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 hover:border-workflow-primary hover:text-workflow-primary transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Education
                    </button>
                </div>
            </FormSection>

            {/* Skills Section */}
            <FormSection
                id="skills"
                title="Skills"
                icon={Code}
                isActive={activeSection === 'skills'}
                onToggle={() => setActiveSection(activeSection === 'skills' ? null : 'skills')}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Technical Skills (Comma separated)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-workflow-primary h-20 text-sm"
                            value={Array.isArray(data.skills) ? data.skills.join(', ') : typeof data.skills === 'object' ? Object.values(data.skills).flat().join(', ') : data.skills || ''}
                            onChange={e => onChange({ ...data, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            placeholder="React, Node.js, Python, AWS..."
                        />
                    </div>
                </div>
            </FormSection>

        </div>
    );
};

const FormSection = ({ id, title, icon: Icon, isActive, onToggle, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input
            type={type}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-workflow-primary text-sm"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
        />
    </div>
);

export default ResumeForm;
