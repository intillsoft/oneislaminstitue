import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { apiService } from '../../../lib/api';

const AIMessageSuggestions = ({ conversationId, context, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (conversationId) {
            fetchSuggestions();
        }
    }, [conversationId]);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const response = await apiService.messages.getAISuggestions(conversationId, context);
            if (response.data && response.data.suggestions) {
                setSuggestions(response.data.suggestions);
                setShow(true);
            }
        } catch (error) {
            console.error('Failed to fetch AI suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex gap-2 mt-2 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 w-24 bg-surface-200 dark:bg-surface-700 rounded-full opacity-50"></div>
                ))}
            </div>
        );
    }

    if (!show || suggestions.length === 0) return null;

    return (
        <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between text-xs text-text-muted px-1">
                <span className="flex items-center gap-1">
                    <Icon name="Sparkles" className="w-3 h-3 text-workflow-primary-500" />
                    AI Suggestions
                </span>
                <button
                    onClick={fetchSuggestions}
                    className="hover:text-workflow-primary-500 transition-colors flex items-center gap-1"
                >
                    <Icon name="RefreshCw" className="w-3 h-3" />
                    Regenerate
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(suggestion)}
                        className="text-xs px-3 py-1.5 bg-white/50 dark:bg-surface-800/50 backdrop-blur-md border border-workflow-primary-100 dark:border-workflow-primary-900/30 rounded-full hover:bg-workflow-primary-50 dark:hover:bg-workflow-primary-900/50 hover:border-workflow-primary-200 dark:hover:border-workflow-primary-800 transition-all duration-300 shadow-sm hover:shadow-glow hover:-translate-y-0.5 text-left animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AIMessageSuggestions;
