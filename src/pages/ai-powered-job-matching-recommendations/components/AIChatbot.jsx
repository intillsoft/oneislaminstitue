import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AIChatbot = ({ onClose, userProfile }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${userProfile?.name || 'there'}! I'm your AI Career Advisor. I can help you with:\n\n• Career guidance and advice\n• Job application strategies\n• Interview preparation tips\n• Resume optimization\n• Skill development recommendations\n\nWhat would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    { icon: 'Briefcase', text: 'How do I improve my application success rate?' },
    { icon: 'TrendingUp', text: 'What skills should I learn next?' },
    { icon: 'Target', text: 'How can I negotiate a better salary?' },
    { icon: 'FileText', text: 'Review my resume strategy' }
  ];

  const handleSend = async (message = input) => {
    if (!message?.trim()) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Use real AI career advisor chat
      const { aiService } = await import('../../../services/aiService');

      // Build conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const result = await aiService.chatWithAdvisor(message, conversationHistory);

      const aiResponse = {
        role: 'assistant',
        content: result?.response || result?.data?.response || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI advisor error:', error);
      // Fallback to helpful error message
      const aiResponse = {
        role: 'assistant',
        content: `I'm having trouble connecting right now. ${error.message || 'Please try again in a moment.'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const getAIResponse = (question) => {
    const responses = {
      default: "That's a great question! Based on your profile and current market trends, I'd recommend focusing on:\n\n1. Building strong technical fundamentals\n2. Showcasing measurable achievements\n3. Networking with industry professionals\n\nWould you like more specific guidance on any of these areas?"
    };

    if (question?.toLowerCase()?.includes('skill')) {
      return "Based on your current skill set and market demand, I recommend learning:\n\n1. **Kubernetes** - High demand (↑45% this quarter)\n2. **GraphQL** - Increasing adoption\n3. **TypeScript** - Industry standard\n\nThese skills will increase your market value by approximately 15-20% and open up 300+ new opportunities.";
    }

    if (question?.toLowerCase()?.includes('salary') || question?.toLowerCase()?.includes('negotiate')) {
      return "Great question about salary negotiation! Here are my top tips:\n\n1. **Research Market Rates**: Your role averages $130k-$180k\n2. **Timing is Key**: Negotiate after receiving the offer\n3. **Quantify Your Value**: Use specific achievements\n4. **Be Confident**: Your skills are in high demand\n\nWould you like a personalized salary negotiation script?";
    }

    if (question?.toLowerCase()?.includes('resume')) {
      return "Let me help optimize your resume strategy:\n\n✅ **Current Strengths:**\n- Strong technical skill set\n- Relevant experience level\n\n📈 **Improvement Areas:**\n- Add quantifiable achievements\n- Include action verbs\n- Optimize for ATS systems\n\nWould you like me to review your resume sections in detail?";
    }

    if (question?.toLowerCase()?.includes('application') || question?.toLowerCase()?.includes('success')) {
      return "To improve your application success rate:\n\n1. **Tailor Each Application** (↑40% response rate)\n2. **Apply Within 48 Hours** of posting\n3. **Use Keywords** from job description\n4. **Follow Up** after 1 week\n\nYour current profile has an 82% success prediction. Let's aim for 90%!";
    }

    return responses?.default;
  };

  const handleQuickPrompt = (prompt) => {
    handleSend(prompt);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background dark:bg-[#13182E] rounded-lg shadow-xl max-w-2xl w-full h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-[#1E2640]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="MessageCircle" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary dark:text-[#E8EAED]">AI Career Advisor</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-xs text-text-secondary dark:text-[#8B92A3]">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary dark:text-[#8B92A3] hover:text-text-primary dark:hover:text-[#E8EAED] transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          {messages?.map((message, index) => (
            <div
              key={index}
              className={`flex ${message?.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${message?.role === 'user' ? 'bg-primary text-white' : 'bg-surface dark:bg-[#1A2139] text-text-primary dark:text-[#E8EAED] border border-border dark:border-[#1E2640]'
                  }`}
              >
                <p className="text-sm whitespace-pre-line">{message?.content}</p>
                <span className="text-xs opacity-70 mt-2 block">
                  {message?.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-surface dark:bg-[#1A2139] border border-border dark:border-[#1E2640] rounded-lg p-4 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-text-muted dark:bg-[#8B92A3] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-text-muted dark:bg-[#8B92A3] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-text-muted dark:bg-[#8B92A3] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        {messages?.length <= 1 && (
          <div className="px-4 pb-24">
            <p className="text-xs text-text-secondary dark:text-[#8B92A3] mb-2">Quick questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickPrompts?.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt?.text)}
                  className="flex items-center space-x-2 p-2 bg-surface dark:bg-[#1A2139] hover:bg-surface-100 dark:hover:bg-[#0A0E27] rounded-lg text-left transition-colors border border-border dark:border-[#1E2640]"
                >
                  <Icon name={prompt?.icon} size={14} className="text-primary flex-shrink-0" />
                  <span className="text-xs text-text-primary dark:text-[#E8EAED]">{prompt?.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input - Suspended Style */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2 bg-white dark:bg-[#13182E] p-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-border dark:border-[#1E2640]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e?.target?.value)}
              onKeyPress={(e) => e?.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your career..."
              className="flex-1 px-4 py-2 bg-transparent text-sm text-[#0F172A] dark:text-[#E8EAED] focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input?.trim()}
              className="btn-primary flex items-center justify-center p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
            >
              <Icon name="Send" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AIChatbot;
