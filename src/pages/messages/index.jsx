import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { apiService } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import AIMessageSuggestions from './components/AIMessageSuggestions';
import MessageImprovement from './components/MessageImprovement';
import { useTalentAI } from '../../hooks/useTalentAI';
import { EliteCard, ElitePageHeader } from '../../components/ui/EliteCard';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showImproveMessage, setShowImproveMessage] = useState(false);
  const [messageToImprove, setMessageToImprove] = useState('');
  const messagesEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // AI TALENT FEATURES
  const { analyzeClientVibe, suggestUpsell, loading: talentAiLoading } = useTalentAI();
  const [vibeAnalysis, setVibeAnalysis] = useState(null);
  const [upsellSuggestion, setUpsellSuggestion] = useState(null);

  useEffect(() => {
    loadConversations();
    const userId = searchParams.get('user');
    const conversationId = searchParams.get('conversation');
    if (conversationId) {
      setSelectedConversation(conversationId);
    } else if (userId) {
      handleStartConversation(userId);
    }
  }, []);

  // REAL-TIME SUBSCRIPTION
  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          const newMessage = payload.new;

          // If message belongs to current conversation, add it
          if (newMessage.conversation_id === selectedConversation) {
            setMessages(prev => [...prev, newMessage]);
            // Mark as read
            apiService.messages.markAsRead(newMessage.id).catch(console.error);
          }

          // Always refresh conversations list to show new last message/unread count
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      if (!conversations.length) setLoading(true);
      const response = await apiService.messages.getConversations();
      if (response.data?.success) {
        setConversations(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedConversation) return;
    try {
      const response = await apiService.messages.getMessages(selectedConversation);
      if (response.data?.success) {
        setMessages(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleStartConversation = async (userId) => {
    try {
      const response = await apiService.messages.getConversation(userId);
      if (response.data?.success) {
        const conversation = response.data.data;
        setSelectedConversation(conversation.id);
        await loadConversations();
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      showError('Failed to start conversation');
    }
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedConversation(conversationId);
    setNewMessage('');
    setVibeAnalysis(null);
    setUpsellSuggestion(null);
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    // Optimistic UI
    const tempId = Date.now();
    const tempMsg = {
      id: tempId,
      sender_id: user.id,
      message: messageText,
      created_at: new Date().toISOString(),
      is_read: false
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      await apiService.messages.sendMessage(selectedConversation, {
        message: messageText,
        message_type: 'text',
      });
      loadConversations(); // Refresh last message preview
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Failed to send message');
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setNewMessage(messageText);
    }
  };

  const handleVibeCheck = async () => {
    if (!messages.length) return;
    const recentMessages = messages.slice(-10).map(m => ({
      sender: m.sender_id === user.id ? 'me' : 'client',
      text: m.message
    }));

    const result = await analyzeClientVibe(recentMessages, {
      name: currentConversation?.other_user_name,
      role: currentConversation?.other_user_role
    });

    if (result) setVibeAnalysis(result);
  };

  const handleSmartUpsell = async () => {
    const recentContext = messages.slice(-5).map(m => m.message).join('\n');
    const result = await suggestUpsell(recentContext, [
      'Express Delivery',
      'Source Files',
      'Priority Support',
      'Strategic Consulting'
    ]);
    if (result) setUpsellSuggestion(result);
  };

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);
  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !conversations.length) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <div className="max-w-[1800px] mx-auto min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 py-8">
        <ElitePageHeader
          title="Neural Gateway"
          description="Advanced cryptographic messaging & stakeholder coordination"
          badge="High Privacy Level"
        />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 h-[calc(100vh-280px)]">
          {/* Sidebar - Conversations List */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5">
              <div className="relative group">
                <Icon name="Search" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="SEARCH PROTOCOLS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full group p-6 rounded-[2rem] transition-all duration-500 flex items-center gap-5 border ${selectedConversation === conv.id
                      ? 'bg-blue-600 border-blue-500 shadow-2xl shadow-blue-500/20'
                      : 'bg-white/5 border-transparent hover:border-white/10 hover:bg-white/[0.07]'
                    }`}
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 p-1 bg-white/5">
                      <img
                        src={conv.other_user_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${conv.other_user_id}`}
                        className="w-full h-full object-cover rounded-xl"
                        alt=""
                      />
                    </div>
                    {conv.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center border-2 border-[#0D1929] animate-pulse">
                        <span className="text-[10px] font-black">{conv.unread_count}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-start">
                      <h4 className={`text-sm font-black uppercase tracking-tight truncate ${selectedConversation === conv.id ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                        {conv.other_user_name}
                      </h4>
                      <span className={`text-[10px] font-black uppercase opacity-50 ${selectedConversation === conv.id ? 'text-white' : 'text-slate-400'}`}>
                        {conv.last_message_at ? formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: false }).replace('about ', '') : ''}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 truncate ${selectedConversation === conv.id ? 'text-blue-100' : 'text-slate-500'}`}>
                      {conv.last_message || 'SECURE CONNECTION ACTIVE'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden relative">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 p-0.5 bg-white/5">
                      <img
                        src={currentConversation?.other_user_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentConversation?.other_user_id}`}
                        className="w-full h-full object-cover rounded-xl"
                        alt=""
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-3">
                        {currentConversation?.other_user_name}
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                      </h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-0.5">
                        {currentConversation?.other_user_role} registry // verified status
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleVibeCheck}
                      disabled={talentAiLoading}
                      className="px-6 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Icon name="Activity" size={14} />
                      Neural Vibe Check
                    </button>
                    <button className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl border border-white/5 transition-all">
                      <Icon name="MoreVertical" size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar relative">
                  <AnimatePresence>
                    {messages.map((msg, i) => {
                      const isOwn = msg.sender_id === user.id;
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          key={msg.id || i}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[75%] lg:max-w-[60%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                            <div className={`px-8 py-5 rounded-[2rem] text-sm leading-relaxed ${isOwn
                                ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-500/20'
                                : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5 backdrop-blur-md'
                              }`}>
                              {msg.message}
                            </div>
                            <span className="text-[9px] font-black text-slate-600 uppercase mt-2 tracking-widest px-2">
                              {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                              {isOwn && msg.is_read && <span className="ml-2 text-blue-500">✓ DELIVERED</span>}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Overlays */}
                <AnimatePresence>
                  {vibeAnalysis && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute top-32 right-8 w-80 z-20"
                    >
                      <EliteCard className="p-6 border-purple-500/30 bg-purple-950/20 backdrop-blur-3xl shadow-2xl shadow-purple-500/10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                              <Icon name="Cpu" size={16} />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-300">Sentience Report</h4>
                          </div>
                          <button onClick={() => setVibeAnalysis(null)} className="text-slate-500 hover:text-white"><Icon name="X" size={14} /></button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-purple-500/50 pl-4 mb-4">
                          "{vibeAnalysis.analysis}"
                        </p>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                          <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Strategic Advice</p>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{vibeAnalysis.recommendation}</p>
                        </div>
                      </EliteCard>
                    </motion.div>
                  )}

                  {upsellSuggestion && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-36 left-8 right-8 z-20"
                    >
                      <EliteCard className="p-6 border-emerald-500/30 bg-emerald-950/20 backdrop-blur-3xl flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                            <Icon name="TrendingUp" size={24} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-300">Revenue Opportunity Detected</h4>
                            <p className="text-[11px] text-slate-400 mt-1">{upsellSuggestion.reason}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setNewMessage(upsellSuggestion.suggestion);
                              setUpsellSuggestion(null);
                            }}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                          >
                            Use Suggestion: {upsellSuggestion.service_name}
                          </button>
                          <button onClick={() => setUpsellSuggestion(null)} className="p-3 text-slate-500 hover:text-white"><Icon name="X" size={18} /></button>
                        </div>
                      </EliteCard>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input Area */}
                <div className="p-8 border-t border-white/5 bg-white/[0.02]">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="ENTER NEURAL COMMAND..."
                        rows={2}
                        className="w-full pl-6 pr-32 py-5 bg-white/5 border border-white/5 rounded-3xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none custom-scrollbar placeholder:text-slate-600"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button
                          onClick={handleSmartUpsell}
                          className="p-3 bg-white/5 hover:bg-white/10 text-emerald-500 rounded-xl transition-all"
                          title="Strategic Upsell"
                        >
                          <Icon name="DollarSign" size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setMessageToImprove(newMessage);
                            setShowImproveMessage(true);
                          }}
                          disabled={!newMessage.trim()}
                          className="p-3 bg-white/5 hover:bg-white/10 text-blue-400 rounded-xl transition-all disabled:opacity-30"
                          title="Neural Enhancement"
                        >
                          <Icon name="Sparkles" size={18} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="px-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:scale-100 active:scale-95 text-white rounded-[2rem] transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3"
                    >
                      <span className="font-black uppercase tracking-widest text-xs hidden sm:inline">Transmit</span>
                      <Icon name="Send" size={18} />
                    </button>
                  </div>

                  {/* AI Suggestions Row */}
                  <div className="mt-4 overflow-x-auto h-12 flex items-center">
                    <AIMessageSuggestions
                      conversationId={selectedConversation}
                      onSelect={(val) => setNewMessage(val)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-20 text-center">
                <div className="max-w-md">
                  <div className="w-32 h-32 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center mx-auto mb-10 group hover:border-blue-500/50 transition-all duration-700">
                    <Icon name="MessageSquare" size={48} className="text-slate-700 group-hover:text-blue-500 transition-colors duration-700" />
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">Awaiting Signal</h2>
                  <p className="text-sm text-slate-500 uppercase tracking-widest leading-relaxed">
                    Select a neural frequency from the lateral registry to initiate secure stakeholder communication.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showImproveMessage && (
          <MessageImprovement
            originalMessage={messageToImprove}
            onImproved={(val) => {
              setNewMessage(val);
              setShowImproveMessage(false);
            }}
            onClose={() => setShowImproveMessage(false)}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #059669;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #047857;
        }
      `}</style>
    </div>
  );
};

export default Messages;
