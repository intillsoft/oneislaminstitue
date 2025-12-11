import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { apiService } from '../../lib/api';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import { formatDistanceToNow } from 'date-fns';
import AIMessageSuggestions from './components/AIMessageSuggestions';
import MessageImprovement from './components/MessageImprovement';
import { useTalentAI } from '../../hooks/useTalentAI';

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

  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
      // Poll for new messages every 3 seconds
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load AI suggestions when conversation changes or new message is typed
    if (selectedConversation && newMessage.length > 10) {
      const debounceTimer = setTimeout(() => {
        loadAISuggestions();
      }, 1000);
      return () => clearTimeout(debounceTimer);
    } else {
      setAiSuggestions([]);
    }
  }, [selectedConversation, newMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await apiService.messages.getConversations();
      if (response.data?.success) {
        setConversations(response.data.data || []);
        // Auto-select first conversation if none selected
        if (response.data.data?.length > 0 && !selectedConversation) {
          setSelectedConversation(response.data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      showError('Failed to load conversations');
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

      // Handle table not found error
      if (response.data?.code === 'TABLE_NOT_FOUND') {
        console.error('Messaging system not initialized');
        return;
      }
      if (response.data?.success) {
        const conversation = response.data.data;
        setSelectedConversation(conversation.id);
        await loadMessages();
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
    setAiSuggestions([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsTyping(true);
    setAiSuggestions([]);

    try {
      await apiService.messages.sendMessage(selectedConversation, {
        message: messageText,
        message_type: 'text',
      });

      // Reload messages and conversations
      await loadMessages();
      await loadConversations();
      success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Failed to send message');
      setNewMessage(messageText); // Restore message on error
    } finally {
      setIsTyping(false);
    }
  };

  const loadAISuggestions = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    try {
      setLoadingSuggestions(true);
      const response = await apiService.messages.getAISuggestions(
        selectedConversation,
        newMessage
      );
      if (response.data?.success) {
        setAiSuggestions(response.data.data?.suggestions || []);
      }
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleUseSuggestion = (suggestion) => {
    setNewMessage(suggestion);
    setAiSuggestions([]);
  };

  const handleImproveMessage = () => {
    if (!newMessage.trim()) return;
    setMessageToImprove(newMessage);
    setShowImproveMessage(true);
  };

  const handleMessageImproved = (improvedMessage) => {
    setNewMessage(improvedMessage);
    setShowImproveMessage(false);
    setMessageToImprove('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  /* AI TALENT FEATURES */
  const { analyzeClientVibe, suggestUpsell, loading: talentAiLoading } = useTalentAI();
  const [vibeAnalysis, setVibeAnalysis] = useState(null);
  const [upsellSuggestion, setUpsellSuggestion] = useState(null);

  const handleVibeCheck = async () => {
    if (!messages.length) return;
    // Extract last 10 messages for context
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
    // Helper to get upsell suggestions
    const recentContext = messages.slice(-5).map(m => m.message).join('\n');
    const result = await suggestUpsell(recentContext, [
      'Express Delivery',
      'Source Files',
      'Commercial Rights',
      'Additional Revision',
      'SEO Optimization'
    ]); // In real app, fetch actual services

    if (result) setUpsellSuggestion(result);
  };

  // ... (existing helper functions)

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <UnifiedSidebar />
      <div className="ml-0 lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Messages
            </h1>
            <p className="text-[#64748B] dark:text-[#8B92A3]">
              Communicate with job seekers, recruiters, talents, and team members
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
            {/* Conversations List */}
            <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg flex flex-col">
              <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E2640]">
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748B] dark:text-[#8B92A3]" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation.id)}
                      className={`w-full p-4 border-b border-[#E2E8F0] dark:border-[#1E2640] hover:bg-gray-50 dark:hover:bg-[#1A2139] transition-colors text-left ${selectedConversation === conversation.id
                        ? 'bg-workflow-primary/5 dark:bg-workflow-primary/10'
                        : ''
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {conversation.other_user_avatar ? (
                          <img
                            src={conversation.other_user_avatar}
                            alt={conversation.other_user_name}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-workflow-primary/10 flex items-center justify-center">
                            <Icon name="User" size={24} className="text-workflow-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-[#0F172A] dark:text-[#E8EAED] truncate">
                              {conversation.other_user_name || 'Unknown User'}
                            </p>
                            {conversation.unread_count > 0 && (
                              <span className="px-2 py-1 bg-workflow-primary text-white text-xs font-medium rounded-full flex-shrink-0">
                                {conversation.unread_count}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#64748B] dark:text-[#8B92A3] truncate">
                            {conversation.last_message || 'No messages yet'}
                          </p>
                          {conversation.last_message_at && (
                            <p className="text-xs text-[#64748B] dark:text-[#8B92A3] mt-1">
                              {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Icon name="MessageSquare" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
                    <p className="text-[#64748B] dark:text-[#8B92A3]">No conversations found</p>
                    <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mt-2">
                      Start a conversation from a job application or talent profile
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg flex flex-col">
              {selectedConversation && currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E2640] flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
                    <div className="flex items-center gap-3">
                      {currentConversation.other_user_avatar ? (
                        <img
                          src={currentConversation.other_user_avatar}
                          alt={currentConversation.other_user_name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-workflow-primary/10 flex items-center justify-center">
                          <Icon name="User" size={20} className="text-workflow-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#0F172A] dark:text-[#E8EAED]">
                          {currentConversation.other_user_name || 'Unknown User'}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-[#64748B] dark:text-[#8B92A3] capitalize">
                            {currentConversation.other_user_role || 'User'}
                          </p>
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        </div>
                      </div>
                    </div>

                    {/* Vibe Check Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleVibeCheck}
                        disabled={talentAiLoading}
                        className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 transition-colors"
                        title="Analyze Client Sentiment"
                      >
                        <Icon name="Activity" size={14} />
                        {talentAiLoading ? 'Analyzing...' : 'Vibe Check'}
                      </button>
                    </div>
                  </div>

                  {/* Vibe Analysis Result - Collapsible */}
                  {vibeAnalysis && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800/50 flex items-start gap-3 relative animate-in fade-in slide-in-from-top-2">
                      <div className={`p-2 rounded-full ${vibeAnalysis.risk_score > 70 ? 'bg-red-100 text-red-600' : vibeAnalysis.risk_score > 40 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                        <Icon name={vibeAnalysis.risk_score > 70 ? 'AlertTriangle' : 'CheckCircle'} size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100">Sentiment Analysis</h4>
                          <button onClick={() => setVibeAnalysis(null)} className="text-purple-400 hover:text-purple-600"><Icon name="X" size={14} /></button>
                        </div>
                        <p className="text-xs text-purple-800 dark:text-purple-200 mt-1">{vibeAnalysis.analysis}</p>
                        {vibeAnalysis.recommendation && (
                          <div className="mt-2 text-xs font-medium bg-white/50 dark:bg-black/20 p-2 rounded">
                            💡 Tip: {vibeAnalysis.recommendation}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length > 0 ? (
                      messages.map((message) => {
                        const isOwn = message.sender_id === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${isOwn
                                ? 'bg-workflow-primary text-white'
                                : 'bg-gray-100 dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]'
                                }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                              <p
                                className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-[#64748B] dark:text-[#8B92A3]'
                                  }`}
                              >
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                {isOwn && message.is_read && (
                                  <span className="ml-2">✓✓</span>
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <Icon name="MessageSquare" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
                        <p className="text-[#64748B] dark:text-[#8B92A3]">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-[#1A2139] rounded-lg p-3">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-[#64748B] dark:bg-[#8B92A3] rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-[#64748B] dark:bg-[#8B92A3] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 bg-[#64748B] dark:bg-[#8B92A3] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* AI Upsell Suggestions */}
                  {upsellSuggestion && (
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-t border-indigo-100 dark:border-indigo-800/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                          <Icon name="TrendingUp" size={12} /> Opportunity Detected
                        </span>
                        <button onClick={() => setUpsellSuggestion(null)} className="text-indigo-400 hover:text-indigo-600"><Icon name="X" size={12} /></button>
                      </div>
                      <p className="text-xs text-indigo-800 dark:text-indigo-200 mb-2">
                        {upsellSuggestion.reason}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setNewMessage(upsellSuggestion.suggestion);
                            setUpsellSuggestion(null);
                          }}
                          className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition-colors"
                        >
                          Suggest: "{upsellSuggestion.service_name}"
                        </button>
                      </div>
                    </div>
                  )}

                  {/* AI Message Suggestions */}
                  {aiSuggestions.length > 0 && !upsellSuggestion && (
                    <AIMessageSuggestions
                      suggestions={aiSuggestions}
                      onUseSuggestion={handleUseSuggestion}
                      loading={loadingSuggestions}
                    />
                  )}

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E2E8F0] dark:border-[#1E2640]">
                    <div className="flex items-end gap-2 mb-2">
                      <div className="flex-1 relative">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          rows={3}
                          className="w-full px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary resize-none"
                        />
                        <div className="absolute bottom-2 right-2 flex gap-1">
                          {/* Smart Upsell Trigger */}
                          <button
                            type="button"
                            onClick={handleSmartUpsell}
                            className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded transition-colors"
                            title="Check for Upsell Opportunities"
                          >
                            <Icon name="DollarSign" size={16} />
                          </button>

                          {newMessage.trim() && (
                            <button
                              type="button"
                              onClick={handleImproveMessage}
                              className="p-1.5 bg-workflow-primary/10 hover:bg-workflow-primary/20 rounded text-workflow-primary transition-colors"
                              title="Improve message with AI"
                            >
                              <Icon name="Sparkles" size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || isTyping}
                        className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Icon name="Send" size={20} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#8B92A3]">
                      <div className="flex items-center gap-2">
                        <Icon name="Sparkles" size={12} />
                        <span>AI-powered suggestions available</span>
                      </div>
                      <span>Press Enter to send, Shift+Enter for new line</span>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="MessageSquare" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
                    <p className="text-[#64748B] dark:text-[#8B92A3]">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message Improvement Modal */}
      {showImproveMessage && (
        <MessageImprovement
          originalMessage={messageToImprove}
          onImproved={handleMessageImproved}
          onClose={() => {
            setShowImproveMessage(false);
            setMessageToImprove('');
          }}
        />
      )}
    </div>
  );
};

export default Messages;
