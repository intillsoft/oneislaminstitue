import React from 'react';

const ModernSelect = ({
    label,
    value,
    onChange,
    options,
    name,
    className = ""
}) => {
    return (
        <div className={`select-group ${className}`}>
            {label && <label className="select-label">{label}</label>}
            <div className="select-wrapper">
                <select
                    className="modern-select"
                    value={value}
                    onChange={onChange}
                    name={name}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <svg className="select-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
        </div>
    );
};

export default ModernSelect;
