import React, { useState } from 'react';

const SectionCard = ({
    title,
    icon,
    children,
    defaultOpen = true,
    rightActions = null
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="section-card">
            <div className="section-header">
                <button
                    className="flex items-center gap-3 flex-1 bg-transparent border-none p-0 cursor-pointer text-left"
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                >
                    <div className="section-header-left">
                        {icon && <span className="section-icon">{icon}</span>}
                        <h3 className="section-title">{title}</h3>
                    </div>
                    <svg
                        className={`section-chevron ${isOpen ? 'open' : ''}`}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                {rightActions && (
                    <div className="ml-4" onClick={(e) => e.stopPropagation()}>
                        {rightActions}
                    </div>
                )}
            </div>

            <div
                className={`section-content ${isOpen ? 'open' : 'closed'}`}
                style={{
                    maxHeight: isOpen ? '2000px' : '0',
                    opacity: isOpen ? 1 : 0
                }}
            >
                <div className="section-inner">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SectionCard;
