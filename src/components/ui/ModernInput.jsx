import React from 'react';
/* The styles are imported globally from resume-layout.css, 
   but we can also import them here if we were using modules.
   For now, we rely on the global strict styles we just created. 
*/

const ModernInput = ({
    label,
    value,
    onChange,
    placeholder,
    icon,
    type = "text",
    name,
    className = ""
}) => {
    return (
        <div className={`input-group ${className}`}>
            {label && (
                <label className="input-label">
                    {label}
                </label>
            )}
            <div className="input-wrapper">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`modern-input ${!icon ? 'no-icon' : ''}`}
                />
            </div>
        </div>
    );
};

export default ModernInput;
