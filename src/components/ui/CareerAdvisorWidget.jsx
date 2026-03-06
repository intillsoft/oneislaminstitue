import React, { useState, useEffect, useRef } from 'react';
import Icon from 'components/AppIcon';
import { aiService } from '../../services/aiService';
import { useAuthContext } from '../../contexts/AuthContext';
import TypingIndicator from './TypingIndicator';
import AIMessage from './AIMessage';

const CareerAdvisorWidget = () => {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user && isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hi ${user.email?.split('@')[0] || 'there'}! I'm your AI Career Advisor. I can help you with:\n\n• Career guidance and advice\n• Job application strategies\n• Interview preparation tips\n• Resume optimization\n• Skill development recommendations\n\nWhat would you like to know?`,
        timestamp: new Date()
      }]);
    }
  }, [user, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (message = input) => {
    if (!message?.trim() || isTyping) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
      id: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const result = await aiService.chatWithAdvisor(message, conversationHistory);

      const aiResponse = {
        role: 'assistant',
        content: result?.response || result?.data?.response || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI advisor error:', error);
      const aiResponse = {
        role: 'assistant',
        content: `I'm having trouble connecting right now. ${error.message || 'Please try again in a moment.'}`,
        timestamp: new Date(),
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      {isMinimized && (
        <div className="fixed right-8 bottom-28 z-[100] flex flex-col items-end gap-3 group">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-workflow-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl mb-1">
            AI Career Advisor
          </div>
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="w-16 h-16 bg-workflow-primary text-white rounded-full shadow-[0_0_30px_rgba(0,70,255,0.4)] hover:shadow-[0_0_50px_rgba(0,70,255,0.6)] transition-all flex items-center justify-center hover:scale-110 border border-white/10"
            aria-label="Open Career Advisor"
          >
            <Icon name="Sparkles" size={28} className="fill-white" />
          </button>
        </div>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed right-8 bottom-28 z-[100] w-96 h-[600px] bg-white dark:bg-[#030712] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col overflow-hidden backdrop-blur-3xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border dark:border-[#1E2640] bg-workflow-primary text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Icon name="MessageCircle" size={20} />
              <div>
                <h3 className="text-sm font-semibold">AI Career Advisor</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                  <span className="text-xs opacity-90">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setIsMinimized(true);
                  setIsOpen(false);
                }}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Minimize"
              >
                <Icon name="Minus" size={18} />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(true);
                }}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <Icon name="X" size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <AIMessage
                key={message.id || message.timestamp}
                message={message}
                role={message.role}
                onEdit={async (newContent, shouldRegenerate) => {
                  setMessages(prev => prev.map(msg =>
                    msg.id === message.id ? { ...msg, content: newContent } : msg
                  ));

                  // Regenerate AI response if user edited their message
                  if (shouldRegenerate && message.role === 'user') {
                    setIsTyping(true);
                    try {
                      const conversationHistory = messages.map(msg => ({
                        role: msg.role,
                        content: msg.id === message.id ? newContent : msg.content,
                      }));

                      const result = await aiService.chatWithAdvisor(newContent, conversationHistory);

                      const aiResponse = {
                        role: 'assistant',
                        content: result?.response || result?.data?.response || 'I apologize, but I encountered an error. Please try again.',
                        timestamp: new Date(),
                        id: Date.now() + 1
                      };
                      setMessages(prev => [...prev, aiResponse]);
                    } catch (error) {
                      console.error('AI regeneration error:', error);
                    } finally {
                      setIsTyping(false);
                    }
                  }
                }}
              />
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-surface dark:bg-[#1A2139] rounded-lg p-3">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border dark:border-[#1E2640]">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-border dark:border-[#1E2640] rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input?.trim()}
                className="btn-primary flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed px-3"
              >
                <Icon name="Send" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CareerAdvisorWidget;
