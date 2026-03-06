import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Search, MoreVertical, Phone, Video, Info,
    Smile, Paperclip, Image as ImageIcon, Mic,
    Check, CheckCheck, Clock, Sparkles, X,
    MessageSquare, User, Bot, Zap, Filter,
    ChevronLeft, Settings, Bell, Trash2, Globe, Plus
} from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { apiService } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';
import ReactMarkdown from 'react-markdown';

const MessagingPanel = () => {
    const { user } = useAuthContext();
    const { success, error: showError } = useToast();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user) {
            loadConversations();
            subscribeToConversations();
        }
    }, [user]);

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id);
            subscribeToMessages(selectedConversation.id);
            fetchAiSuggestions(selectedConversation.id);
        }
    }, [selectedConversation]);

    useEffect(() => {
        if (searchQuery.length > 1) {
            handleSearchUsers();
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadConversations = async () => {
        try {
            setLoading(true);
            const response = await apiService.messages.getConversations();
            setConversations(response.data?.data || []);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchUsers = async () => {
        try {
            setIsSearching(true);
            const response = await apiService.messages.searchUsers(searchQuery);
            setSearchResults(response.data?.data || []);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const startConversation = async (recipientId) => {
        try {
            const response = await apiService.messages.initializeConversation(recipientId);
            const conv = response.data?.data;
            if (conv) {
                // Refresh conversations and select the new one
                await loadConversations();
                setSelectedConversation(conv);
                setShowNewChatModal(false);
                setSearchQuery('');
            }
        } catch (error) {
            showError('Failed to initialize conversation');
        }
    };

    const loadMessages = async (conversationId) => {
        try {
            const response = await apiService.get(`/messages/${conversationId}`);
            setMessages(response.data?.data || []);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const subscribeToConversations = () => {
        const channel = supabase
            .channel('public:messaging_conversations')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'messaging_conversations',
                filter: `participant_ids=cs.{${user.id}}`
            }, payload => {
                loadConversations();
            })
            .subscribe();
        return () => supabase.removeChannel(channel);
    };

    const subscribeToMessages = (conversationId) => {
        const channel = supabase
            .channel(`public:messaging_messages:${conversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messaging_messages',
                filter: `conversation_id=eq.${conversationId}`
            }, payload => {
                setMessages(prev => {
                    if (prev.find(m => m.id === payload.new.id)) return prev;
                    return [...prev, payload.new];
                });
            })
            .subscribe();
        return () => supabase.removeChannel(channel);
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const messageContent = newMessage;
        setNewMessage('');

        try {
            await apiService.post('/messages/send', {
                conversationId: selectedConversation.id,
                content: messageContent
            });
            fetchAiSuggestions(selectedConversation.id);
        } catch (error) {
            showError('Failed to send message.');
        }
    };

    const fetchAiSuggestions = async (conversationId) => {
        try {
            const lastFew = messages.slice(-5);
            const response = await apiService.post('/messages/ai/suggestions', {
                conversationId,
                lastMessages: lastFew
            });
            setAiSuggestions(response.data?.data || []);
        } catch (error) {
            setAiSuggestions([]);
        }
    };

    const useAiSuggestion = (suggestion) => {
        setNewMessage(suggestion);
    };

    return (
        <div className="flex h-screen bg-[#0F172A] overflow-hidden">
            {/* Sidebar: Conversations List */}
            <div className="w-full md:w-80 lg:w-96 border-r border-white/5 flex flex-col bg-[#0F172A]">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Messages</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowNewChatModal(true)}
                                className="p-2 rounded-xl bg-workflow-primary/20 text-workflow-primary hover:bg-workflow-primary/30 transition-all border border-workflow-primary/20"
                                title="New Conversation"
                            >
                                <Plus size={18} />
                            </button>
                            <button className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all">
                                <Settings size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter conversations..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-workflow-primary/20 focus:border-workflow-primary/40 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        [1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="p-4 flex gap-4 animate-pulse border-b border-white/[0.02]">
                                <div className="w-12 h-12 rounded-full bg-white/5 shrink-0" />
                                <div className="flex-1 space-y-2 mt-1">
                                    <div className="h-4 w-24 bg-white/5 rounded" />
                                    <div className="h-3 w-full bg-white/5 rounded" />
                                </div>
                            </div>
                        ))
                    ) : conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4 text-slate-500">
                                <MessageSquare size={32} />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">No active signals</p>
                            <button
                                onClick={() => setShowNewChatModal(true)}
                                className="text-xs font-black text-workflow-primary uppercase tracking-wider hover:underline"
                            >
                                Start First Transmission
                            </button>
                        </div>
                    ) : (
                        conversations.map(conv => {
                            const otherParticipant = conv.participant_ids?.find(id => id !== user.id);
                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={`w-full p-4 flex gap-4 text-left transition-all border-b border-white/[0.02] hover:bg-white/[0.02] ${selectedConversation?.id === conv.id ? 'bg-workflow-primary/10 border-l-4 border-l-workflow-primary' : ''}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400">
                                            <User size={24} />
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0F172A]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-sm font-black text-white truncate uppercase tracking-tight">
                                                {conv.metadata?.recipient_name || "Agent Connection"}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-600 uppercase">
                                                {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'NEW'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate font-medium">
                                            {conv.last_message_text || "Initialize secure channel..."}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 flex flex-col bg-[#020617] relative">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 border-b border-white/5 bg-[#0F172A]/50 backdrop-blur-xl px-8 flex items-center justify-between z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400">
                                    <User size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-white uppercase tracking-wider">
                                        {selectedConversation.metadata?.recipient_name || "Intelligent Node"}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Intelligence</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"><Phone size={18} /></button>
                                <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"><Video size={18} /></button>
                                <div className="w-px h-6 bg-white/10 mx-1" />
                                <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"><MoreVertical size={18} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar scroll-smooth bg-[radial-gradient(circle_at_top_right,rgba(0,70,255,0.03)_0%,transparent_50%)]">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <Bot size={48} className="text-workflow-primary/20 mb-4" />
                                    <h4 className="text-lg font-black text-white uppercase tracking-wider mb-2">Secure Link Established</h4>
                                    <p className="text-sm text-slate-500 max-w-xs mx-auto italic">Start the transmission below. AI Smart Suggestion will activate once the first signal is processed.</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] group`}>
                                            <div className={`p-4 rounded-2xl shadow-2xl ${msg.sender_id === user.id
                                                ? 'bg-workflow-primary text-white rounded-tr-sm'
                                                : 'bg-white/[0.03] border border-white/5 text-slate-200 rounded-tl-sm'
                                                }`}>
                                                <div className="text-sm leading-relaxed font-medium">
                                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-2 mt-2 px-1 ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {msg.sender_id === user.id && (
                                                    <div className="text-workflow-primary flex items-center">
                                                        {msg.is_read ? <CheckCheck size={12} /> : <Check size={12} />}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-8 border-t border-white/5 bg-[#0F172A]/30">
                            {/* AI Suggestions Chips */}
                            <AnimatePresence>
                                {aiSuggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="flex flex-wrap gap-2 mb-4"
                                    >
                                        <div className="w-full flex items-center gap-2 mb-1 px-1">
                                            <Sparkles size={12} className="text-workflow-primary" />
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">AI Intelligence Suggestions</span>
                                        </div>
                                        {aiSuggestions.map((suggestion, i) => (
                                            <button
                                                key={i}
                                                onClick={() => useAiSuggestion(suggestion)}
                                                className="px-4 py-2 rounded-xl bg-workflow-primary/10 border border-workflow-primary/20 text-workflow-primary text-[11px] font-bold hover:bg-workflow-primary/20 transition-all flex items-center gap-2"
                                            >
                                                <Zap size={12} />
                                                {suggestion}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSendMessage} className="relative group">
                                <div className="absolute inset-0 bg-workflow-primary/5 rounded-[2rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                <div className="relative bg-[#1E293B] border border-white/5 rounded-2xl shadow-2xl flex items-end p-2 transition-all focus-within:border-workflow-primary/40 focus-within:ring-4 focus-within:ring-workflow-primary/5">
                                    <button type="button" className="p-3 text-slate-500 hover:text-white transition-colors"><Paperclip size={20} /></button>
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                        placeholder="Transmit strategic message..."
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-600 px-4 py-3 min-h-[50px] max-h-[150px] resize-none text-[14px] font-medium leading-relaxed"
                                        rows={1}
                                    />
                                    <div className="flex items-center gap-1 mb-1 mr-1">
                                        <button type="button" className="p-3 text-slate-500 hover:text-white transition-colors"><Smile size={20} /></button>
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="p-3.5 bg-workflow-primary hover:bg-workflow-primary/90 text-white rounded-xl shadow-lg shadow-workflow-primary/30 disabled:opacity-30 disabled:shadow-none transition-all active:scale-95"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-24 h-24 rounded-full bg-white/[0.02] flex items-center justify-center mb-10 border border-white/5 shadow-2xl"
                        >
                            <MessageSquare size={40} className="text-slate-800" />
                        </motion.div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Neural Communication Link</h3>
                        <p className="max-w-md text-slate-500 font-medium text-sm leading-relaxed mb-10 italic"> Select an intelligence record from the inbox or start a new transmission to initialize a collaborative sequence.</p>

                        <div className="flex gap-4 opacity-10 filter grayscale pointer-events-none">
                            <Bot size={24} />
                            <Zap size={24} />
                            <Settings size={24} />
                            <Globe size={24} />
                        </div>
                    </div>
                )}
            </div>

            {/* New Chat Modal / Search Overlay */}
            <AnimatePresence>
                {showNewChatModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-lg bg-[#0F172A] border border-white/10 rounded-2xl shadow-3xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Initialize New Link</h3>
                                <button
                                    onClick={() => setShowNewChatModal(false)}
                                    className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="relative mb-6">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for intelligence nodes (names, roles...)"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-workflow-primary/20 focus:border-workflow-primary/40 transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                                    {isSearching ? (
                                        <div className="flex flex-col items-center justify-center p-12 text-slate-600">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-workflow-primary mb-4" />
                                            <p className="text-xs font-bold uppercase tracking-widest">Scanning Grid...</p>
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-600 opacity-40">
                                            <User size={48} className="mb-4" />
                                            <p className="text-xs font-bold uppercase tracking-widest">No matching nodes discovered</p>
                                        </div>
                                    ) : (
                                        searchResults.map(match => (
                                            <button
                                                key={match.id}
                                                onClick={() => startConversation(match.id)}
                                                className="w-full p-4 flex items-center gap-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all text-left group"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-workflow-primary/20 group-hover:text-workflow-primary transition-all">
                                                    <User size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{match.full_name}</h4>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{match.role || 'Personnel'}</p>
                                                </div>
                                                <ChevronLeft className="text-slate-700 rotate-180 group-hover:text-workflow-primary transition-all" size={20} />
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MessagingPanel;
