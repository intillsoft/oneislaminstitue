/**
 * Custom Resume Components
 * Date picker, skills input, achievements input
 */

import React, { useState } from 'react';
import { Calendar, X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

/**
 * Date Range Component
 */
export const DateRangePicker = ({ value, onChange, label = 'Date Range' }) => {
  const [startDate, setStartDate] = useState(value?.start || '');
  const [endDate, setEndDate] = useState(value?.end || '');
  const [isPresent, setIsPresent] = useState(value?.isPresent || false);

  const handleChange = (start, end, present) => {
    onChange({
      start,
      end,
      isPresent: present,
      display: present ? `${start} - Present` : `${start} - ${end}`,
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="month"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            handleChange(e.target.value, endDate, isPresent);
          }}
          className="input-field flex-1"
        />
        <span className="text-[#64748B] dark:text-[#8B92A3]">to</span>
        {!isPresent ? (
          <input
            type="month"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              handleChange(startDate, e.target.value, isPresent);
            }}
            className="input-field flex-1"
          />
        ) : (
          <span className="text-[#64748B] dark:text-[#8B92A3] px-3 py-2">Present</span>
        )}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPresent}
            onChange={(e) => {
              setIsPresent(e.target.checked);
              handleChange(startDate, endDate, e.target.checked);
            }}
            className="rounded border-[#E2E8F0] dark:border-[#1E2640]"
          />
          <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">Present</span>
        </label>
      </div>
    </div>
  );
};

/**
 * Skills Input Component
 */
export const SkillsInput = ({ value = [], onChange, label = 'Skills' }) => {
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeSkill = (skill) => {
    onChange(value.filter(s => s !== skill));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a skill..."
          className="input-field flex-1"
        />
        <Button variant="primary" size="sm" onClick={addSkill}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((skill, index) => (
          <motion.span
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-workflow-primary-50 dark:bg-workflow-primary-900/20 text-workflow-primary rounded-full text-sm"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="hover:text-workflow-primary-700"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.span>
        ))}
      </div>
    </div>
  );
};

/**
 * Achievements Input Component
 */
export const AchievementsInput = ({ value = [], onChange, label = 'Achievements' }) => {
  const [achievements, setAchievements] = useState(value);

  const addAchievement = () => {
    const newAchievements = [...achievements, { text: '', metric: '' }];
    setAchievements(newAchievements);
    onChange(newAchievements);
  };

  const updateAchievement = (index, field, newValue) => {
    const updated = achievements.map((ach, i) =>
      i === index ? { ...ach, [field]: newValue } : ach
    );
    setAchievements(updated);
    onChange(updated);
  };

  const removeAchievement = (index) => {
    const updated = achievements.filter((_, i) => i !== index);
    setAchievements(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">
          {label}
        </label>
        <Button variant="ghost" size="sm" onClick={addAchievement}>
          <Plus className="w-4 h-4 mr-2" />
          Add Achievement
        </Button>
      </div>
      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-[#F8FAFC] dark:bg-[#1A2139]"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-[#64748B] dark:text-[#8B92A3]">
                Achievement {index + 1}
              </span>
              <button
                onClick={() => removeAchievement(index)}
                className="text-error hover:text-error-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={achievement.text}
              onChange={(e) => updateAchievement(index, 'text', e.target.value)}
              placeholder="Achievement description..."
              className="input-field mb-2"
            />
            <input
              type="text"
              value={achievement.metric}
              onChange={(e) => updateAchievement(index, 'metric', e.target.value)}
              placeholder="Metric (e.g., 'Increased revenue by 40%')"
              className="input-field"
            />
          </motion.div>
        ))}
        {achievements.length === 0 && (
          <div className="text-center py-8 text-[#64748B] dark:text-[#8B92A3]">
            <p className="text-sm">No achievements added yet.</p>
            <Button variant="ghost" size="sm" onClick={addAchievement} className="mt-2">
              Add First Achievement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Component Insert Modal
 */
export const ComponentInsertModal = ({ isOpen, onClose, onInsert, componentType }) => {
  const [dateValue, setDateValue] = useState(null);
  const [skills, setSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const handleInsert = () => {
    let content = '';
    
    switch (componentType) {
      case 'date':
        content = dateValue?.display || '[Date Range]';
        break;
      case 'skill':
        content = skills.length > 0 ? skills.join(', ') : '[Skills]';
        break;
      case 'achievement':
        content = achievements.map(a => 
          `${a.text}${a.metric ? ` (${a.metric})` : ''}`
        ).join('; ') || '[Achievements]';
        break;
      default:
        return;
    }

    onInsert(content);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Insert ${componentType}`} size="md">
      <div className="space-y-4">
        {componentType === 'date' && (
          <DateRangePicker value={dateValue} onChange={setDateValue} />
        )}
        {componentType === 'skill' && (
          <SkillsInput value={skills} onChange={setSkills} />
        )}
        {componentType === 'achievement' && (
          <AchievementsInput value={achievements} onChange={setAchievements} />
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleInsert}>
            Insert
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default {
  DateRangePicker,
  SkillsInput,
  AchievementsInput,
  ComponentInsertModal,
};

