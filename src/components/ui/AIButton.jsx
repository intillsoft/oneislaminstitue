import React from 'react';

const AIButton = ({ onClick, loading, children, className = "" }) => {
    return (
        <button
            className={`ai-button ${loading ? 'loading' : ''} ${className}`}
            onClick={onClick}
            disabled={loading}
            type="button"
        >
            <span className="ai-icon">✨</span>
            <span className="ai-button-text">{children}</span>
            {loading && (
                <span className="ai-spinner">
                    <svg className="spinner" viewBox="0 0 24 24">
                        <circle
                            className="spinner-circle"
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            strokeWidth="3"
                        />
                    </svg>
                </span>
            )}
        </button>
    );
};

export default AIButton;
