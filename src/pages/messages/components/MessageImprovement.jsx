import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { apiService } from '../../../lib/api';

const MessageImprovement = ({ message, onImprove }) => {
    const [improving, setImproving] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    if (!message || message.length < 5) return null;

    const handleImprove = async (type) => {
        setImproving(true);
        setShowOptions(false);
        try {
            const response = await apiService.messages.improveMessage(message, type);
            if (response.data && response.data.improved) {
                onImprove(response.data.improved);
            }
        } catch (error) {
            console.error('Failed to improve message:', error);
        } finally {
            setImproving(false);
        }
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setShowOptions(!showOptions)}
                className={`p-1.5 rounded-full transition-all duration-300 ${improving
                        ? 'bg-workflow-primary-100 text-workflow-primary-600 animate-pulse'
                        : 'text-text-muted hover:text-workflow-primary-500 hover:bg-workflow-primary-50 dark:hover:bg-workflow-primary-900/30'
                    }`}
                title="Improve with AI"
                disabled={improving}
            >
                <Icon name="Wand2" className="w-4 h-4" />
            </button>

            {showOptions && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-surface-800 rounded-xl shadow-glass border border-white/20 backdrop-blur-md p-1 z-50 animate-scale-in origin-bottom-right overflow-hidden">
                    <div className="text-[10px] font-semibold text-text-muted px-3 py-1 uppercase tracking-wider">
                        Improve Tone
                    </div>
                    <button
                        onClick={() => handleImprove('professional')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Icon name="Briefcase" className="w-3 h-3 text-blue-500" />
                        Professional
                    </button>
                    <button
                        onClick={() => handleImprove('friendly')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Icon name="Smile" className="w-3 h-3 text-green-500" />
                        Friendly
                    </button>
                    <button
                        onClick={() => handleImprove('concise')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Icon name="Scissors" className="w-3 h-3 text-orange-500" />
                        Concise
                    </button>
                </div>
            )}
        </div>
    );
};

export default MessageImprovement;
