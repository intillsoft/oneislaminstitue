import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { apiService } from '../../../lib/api';
import { motion } from 'framer-motion';

const AIMessageSuggestions = ({ conversationId, context, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

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
            }
        } catch (error) {
            console.error('Failed to fetch AI suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex gap-3 px-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 w-32 bg-white/5 rounded-full animate-pulse border border-white/5" />
                ))}
            </div>
        );
    }

    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div className="flex items-center gap-4 px-2">
            <div className="flex items-center gap-2 pr-4 border-r border-white/5 h-6">
                <Icon name="Sparkles" className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">Neural Suggests</span>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                {suggestions.map((suggestion, index) => (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelect(suggestion)}
                        className="text-[11px] font-bold px-5 py-2 white-space-nowrap bg-white/5 border border-white/5 rounded-2xl hover:bg-blue-600/20 hover:border-blue-500/50 hover:text-white text-slate-400 transition-all duration-300 shadow-sm hover:shadow-glow whitespace-nowrap"
                    >
                        {suggestion}
                    </motion.button>
                ))}
                <button
                    onClick={fetchSuggestions}
                    className="p-2 text-slate-600 hover:text-blue-400 transition-colors"
                    title="Regenerate"
                >
                    <Icon name="RefreshCw" size={14} />
                </button>
            </div>
        </div>
    );
};

export default AIMessageSuggestions;
