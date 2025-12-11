import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuthContext } from '../../contexts/AuthContext';
import { resumeService } from '../../services/resumeService';
import { useToast } from '../../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../../services/aiService';
import { apiService } from '../../lib/api';
import { 
  Sparkles, Send, Settings, Zap, FileText, Download, 
  Copy, ThumbsUp, ThumbsDown, RefreshCw, X, Maximize2,
  Minimize2, MessageSquare, Code, Palette, Globe, CheckCircle2, Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TypingIndicator from '../../components/ui/TypingIndicator';
import { extractAndCorrect, correctSpelling } from '../../utils/spellChecker';

const ResumeGeneratorAI = () => {
  const { user, profile } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [resumeCount, setResumeCount] = useState(0);
  const [subscriptionTier, setSubscriptionTier] = useState('free');
  const [resumeLimit, setResumeLimit] = useState(1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const [resumeData, setResumeData] = useState({
    jobTitle: '',
    experienceLevel: '',
    industry: '',
    skills: [],
    achievements: [],
    style: 'professional',
    jobDescription: '',
  });
  const [conversationMode, setConversationMode] = useState('chat');
  const [conversationContext, setConversationContext] = useState([]);

  // Advanced features/tools
  const [enabledTools, setEnabledTools] = useState({
    atsOptimization: true,
    keywordExtraction: true,
    skillSuggestions: true,
    industryInsights: true,
  });

  useEffect(() => {
    if (user && messages.length === 0) {
      loadUserData();
      setMessages([{
        role: 'assistant',
        content: `👋 Hello! I'm your advanced AI Resume Assistant, powered by cutting-edge AI technology.\n\nI can help you with:\n• Creating professional, ATS-optimized resumes\n• Answering resume and career questions\n• Providing industry insights and tips\n• Optimizing your resume for specific jobs\n\nJust chat naturally with me, or say **"generate resume"** when you're ready to create one!\n\nWhat would you like to know?`,
        timestamp: new Date()
      }]);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadUserData = async () => {
    try {
      // Get user's subscription tier
      const tier = profile?.subscription_tier || user?.subscription_tier || 'free';
      setSubscriptionTier(tier);
      
      // Get resume count
      const resumes = await resumeService.getAll();
      setResumeCount(resumes?.length || 0);
      
      // Set limits based on tier (admins have unlimited)
      const isAdmin = profile?.role === 'admin' || user?.role === 'admin';
      if (isAdmin) {
        setResumeLimit(-1); // Unlimited
      } else {
        const limits = {
          free: 1,
          basic: 3,
          premium: 10,
          pro: -1, // Unlimited
        };
        setResumeLimit(limits[tier] || 1);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const checkResumeLimit = () => {
    const isAdmin = profile?.role === 'admin' || user?.role === 'admin';
    if (isAdmin) return true; // Admins have unlimited
    
    if (resumeLimit === -1) return true; // Unlimited tier
    return resumeCount < resumeLimit;
  };

  const handleSend = async (message = input) => {
    if (!message?.trim() || isTyping) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const lowerMessage = message.toLowerCase().trim();
      
      // Check if user wants to generate resume
      const wantsToGenerate = lowerMessage.includes('generate') || 
                             lowerMessage.includes('create') || 
                             lowerMessage.includes('make') ||
                             lowerMessage.includes('build') ||
                             (lowerMessage.includes('resume') && (lowerMessage.includes('start') || lowerMessage.includes('begin')));
      
      if (wantsToGenerate && conversationMode === 'chat') {
        // Check resume limit
        if (!checkResumeLimit()) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `⚠️ You've reached your resume limit (${resumeLimit} resume${resumeLimit > 1 ? 's' : ''} on ${subscriptionTier} plan).\n\nWould you like to:\n• **Upgrade your plan** for more resumes\n• **Edit an existing resume** instead\n\nI can help you with either option!`,
            timestamp: new Date()
          }]);
          setIsTyping(false);
          return;
        }

        // Switch to collection mode
        setConversationMode('collecting');
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Excellent! Let's create a powerful, ATS-optimized resume for you. I'll guide you through this step by step.\n\n**Step 1 of 6:** What job title are you targeting? (e.g., "Software Engineer", "Marketing Manager")`,
          timestamp: new Date()
        }]);
        setIsTyping(false);
        return;
      }

      // If in collecting mode, handle data collection
      if (conversationMode === 'collecting' || conversationMode === 'ready') {
        await handleDataCollection(message);
        setIsTyping(false);
        return;
      }

      // Otherwise, use advanced AI for general conversation
      await handleAdvancedAIConversation(message);
      setIsTyping(false);
    } catch (error) {
      console.error('Error in conversation:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error.message}. Let's try again - could you rephrase your question?`,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }
  };

  const handleAdvancedAIConversation = async (message) => {
    try {
      // Build rich context for AI with friendly tone
      const recentMessages = messages.slice(-8).map(m => ({
        role: m.role,
        content: m.content
      }));

      const contextPrompt = `You are a friendly, helpful AI Resume Assistant with deep expertise in:
- Resume writing and ATS optimization
- Career development and job search strategies
- Industry trends and hiring practices
- Professional networking and branding

User's question: "${message}"

Recent conversation context:
${recentMessages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n')}

${enabledTools.atsOptimization ? 'ATS Optimization tool is enabled - provide ATS-focused advice when relevant.' : ''}
${enabledTools.industryInsights ? 'Industry Insights tool is enabled - include industry-specific information when helpful.' : ''}

IMPORTANT: Be warm, friendly, and conversational. Use emojis sparingly but effectively. Show enthusiasm and genuine care. Always be encouraging and supportive. Use markdown formatting for better readability. If the user asks about generating a resume, naturally guide them to say "generate resume".`;

      const aiResponse = await aiService.generateCompletion(contextPrompt, {
        systemMessage: `You are a friendly, knowledgeable, and enthusiastic AI Resume Assistant. You genuinely care about helping users succeed. You're warm, encouraging, and professional. You use markdown formatting to make responses more readable. Always be positive and supportive.`,
        max_tokens: 800,
        temperature: 0.8, // Slightly higher for more friendly responses
      });

      // Update conversation context
      setConversationContext(prev => [...prev, 
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      ].slice(-20)); // Keep last 20 messages

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }]);
    } catch (error) {
      // Enhanced fallback responses
      const lowerMessage = message.toLowerCase();
      let fallbackResponse = '';
      
      if (lowerMessage.includes('ats') || lowerMessage.includes('applicant tracking')) {
        fallbackResponse = `**ATS Optimization Tips:**\n\n1. Use standard section headings (Experience, Education, Skills)\n2. Include relevant keywords from job descriptions\n3. Use simple, clean formatting\n4. Avoid graphics, tables, or complex layouts\n5. Save as PDF for best compatibility\n\nWould you like me to help optimize your resume for ATS?`;
      } else if (lowerMessage.includes('skill') || lowerMessage.includes('competenc')) {
        fallbackResponse = `**Skills Section Best Practices:**\n\n• List 8-12 technical skills relevant to your target role\n• Include both hard and soft skills\n• Use industry-standard terminology\n• Match skills to job descriptions\n• Quantify your proficiency when possible\n\nI can help you identify the best skills for your resume!`;
      } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        fallbackResponse = `**I can help you with:**\n\n✨ **Resume Creation** - Generate professional, ATS-optimized resumes\n📊 **ATS Optimization** - Ensure your resume passes applicant tracking systems\n💡 **Career Advice** - Get insights on resume best practices\n🎯 **Job Targeting** - Tailor your resume for specific roles\n📝 **Content Enhancement** - Improve your resume's impact\n\nJust ask me anything, or say **"generate resume"** to get started!`;
      } else {
        fallbackResponse = `I'm here to help you create an outstanding resume! You can ask me questions about resumes, ATS optimization, career advice, or say **"generate resume"** to create a new one. What would you like to know?`;
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      }]);
    }
  };

  const handleDataCollection = async (message) => {
    if (!resumeData.jobTitle) {
      setResumeData(prev => ({ ...prev, jobTitle: message }));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Perfect! Targeting **${message}** position. 🎯\n\n**Step 2 of 6:** What's your experience level?\n\n• Entry-level / Junior\n• Mid-level / Intermediate  \n• Senior / Experienced\n• Executive / Leadership`,
        timestamp: new Date()
      }]);
    } else if (!resumeData.experienceLevel) {
      // Use spell checker for experience level
      const corrected = extractAndCorrect(message, 'experience');
      let expLevel = corrected || message.toLowerCase();
      
      // Fallback to keyword matching if spell checker didn't find a match
      if (!corrected) {
        if (expLevel.includes('entry') || expLevel.includes('junior') || expLevel.includes('beginner')) {
          expLevel = 'entry-level';
        } else if (expLevel.includes('mid') || expLevel.includes('intermediate')) {
          expLevel = 'mid-level';
        } else if (expLevel.includes('senior') || expLevel.includes('experienced')) {
          expLevel = 'senior';
        } else if (expLevel.includes('executive') || expLevel.includes('lead') || expLevel.includes('director') || expLevel.includes('leadership')) {
          expLevel = 'executive';
        }
      }
      
      const friendlyMessage = corrected && corrected !== message.toLowerCase() 
        ? `Great! I understood "${message}" as **${expLevel}** level. 💼`
        : `Great! **${expLevel}** level it is. 💼`;
      
      setResumeData(prev => ({ ...prev, experienceLevel: expLevel }));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `${friendlyMessage}\n\n**Step 3 of 6:** What industry are you in?\n\nExamples: Technology, Healthcare, Finance, Education, Marketing, etc.`,
        timestamp: new Date()
      }]);
    } else if (!resumeData.industry) {
      // Use spell checker for industry
      const corrected = extractAndCorrect(message, 'industry');
      const industry = corrected || message;
      
      const friendlyMessage = corrected && corrected !== message.toLowerCase()
        ? `Excellent! I understood "${message}" as **${industry}** industry. 🏢`
        : `Excellent! **${industry}** industry. 🏢`;
      
      setResumeData(prev => ({ ...prev, industry }));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `${friendlyMessage}\n\n**Step 4 of 6:** List your top 5-10 key skills (comma-separated)\n\nExample: "JavaScript, React, Node.js, AWS, Docker, Git"`,
        timestamp: new Date()
      }]);
    } else if (resumeData.skills.length === 0) {
      const skills = message.split(',').map(s => s.trim()).filter(Boolean);
      setResumeData(prev => ({ ...prev, skills }));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Perfect! I've noted your skills: ${skills.join(', ')}. 🛠️\n\n**Step 5 of 6:** Describe 2-3 key achievements or projects (one per line)\n\nExample:\n• Led team of 5 developers\n• Increased revenue by 40%\n• Built scalable microservices architecture`,
        timestamp: new Date()
      }]);
    } else if (resumeData.achievements.length === 0) {
      const achievements = message.split('\n').map(a => a.trim()).filter(Boolean);
      setResumeData(prev => ({ ...prev, achievements }));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Outstanding achievements! 🏆\n\n**Step 6 of 6:** Choose your writing style:\n\n• **Professional** - Traditional, formal business style\n• **Creative** - Modern, engaging style for creative industries\n• **Technical** - Focused on technical skills and achievements\n\nWhich style would you prefer?`,
        timestamp: new Date()
      }]);
      setConversationMode('ready');
    } else if (conversationMode === 'ready') {
      // Use spell checker for style
      const corrected = extractAndCorrect(message, 'style');
      const styleMatch = corrected || ['professional', 'creative', 'technical'].find(s => 
        message.toLowerCase().includes(s)
      );
      
      if (styleMatch) {
        const friendlyMessage = corrected && corrected !== message.toLowerCase()
          ? `Perfect! I understood "${message}" as **${styleMatch}** style. Let's create your resume!`
          : `Perfect! **${styleMatch}** style it is. Let's create your resume!`;
        
        setResumeData(prev => ({ ...prev, style: styleMatch }));
        setConversationMode('generating');
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: friendlyMessage,
          timestamp: new Date()
        }]);
        
        await handleGenerate();
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I didn't quite catch that. Please choose one of these styles:\n\n• **Professional** - Traditional, formal business style\n• **Creative** - Modern, engaging style\n• **Technical** - Focused on technical skills\n\nWhich would you like? 😊`,
          timestamp: new Date()
        }]);
      }
    }
  };

  const handleGenerate = async () => {
    try {
      setIsTyping(true);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `🎨 **Generating your ${resumeData.style} resume...**\n\nThis may take 30-60 seconds. I'm creating:\n• Professional summary\n• Experience sections\n• Skills breakdown\n• Education details\n• ATS optimization\n\nPlease wait while I craft your perfect resume! ⏳`,
        timestamp: new Date()
      }]);

      // Validate all required fields
      if (!resumeData.jobTitle || !resumeData.experienceLevel || !resumeData.industry || 
          !resumeData.skills || resumeData.skills.length === 0 || 
          !resumeData.achievements || resumeData.achievements.length === 0) {
        throw new Error('Missing required information. Please provide all details.');
      }

      // Generate resume
      const generatedResume = await aiService.generateResume({
        jobTitle: resumeData.jobTitle,
        experienceLevel: resumeData.experienceLevel,
        industry: resumeData.industry,
        skills: resumeData.skills,
        achievements: resumeData.achievements,
        style: resumeData.style,
      });

      if (!generatedResume) {
        throw new Error('No resume data received from AI service. Please try again.');
      }

      // Extract resume content
      let resumeContent = null;
      if (generatedResume.resume) {
        resumeContent = generatedResume.resume;
      } else if (generatedResume.summary || generatedResume.experience || generatedResume.skills) {
        resumeContent = generatedResume;
      } else {
        resumeContent = generatedResume;
      }
      
      if (!resumeContent || typeof resumeContent !== 'object' || Object.keys(resumeContent).length === 0) {
        throw new Error('Invalid resume data received. Please try again.');
      }

      // Save the resume
      const savedResume = await resumeService.create({
        title: `${resumeData.jobTitle} Resume`,
        content: resumeContent,
        isDefault: false,
      });

      // Update resume count
      setResumeCount(prev => prev + 1);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ **Resume Generated Successfully!**\n\nYour professional ${resumeData.style} resume for **${resumeData.jobTitle}** has been created and saved!\n\nRedirecting you to view and edit your resume... 🚀`,
        timestamp: new Date()
      }]);

      success('Resume generated and saved successfully!');
      
      setTimeout(() => {
        navigate(`/resume-builder-ai-enhancement?resumeId=${savedResume.id}`, { 
          replace: true,
          state: { resumeId: savedResume.id }
        });
      }, 2000);
    } catch (error) {
      console.error('Error generating resume:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ I encountered an error: ${error.message}\n\nLet's try again. Would you like to:\n• **Regenerate** - Start over with the same information\n• **Edit details** - Modify your information first\n\nHow would you like to proceed?`,
        timestamp: new Date()
      }]);
      showError('Failed to generate resume. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleRegenerate = () => {
    setResumeData({
      jobTitle: '',
      experienceLevel: '',
      industry: '',
      skills: [],
      achievements: [],
      style: 'professional',
      jobDescription: '',
    });
    setConversationMode('chat');
    setMessages([{
      role: 'assistant',
      content: `🔄 **Starting Fresh!**\n\nI've reset everything. You can ask me questions or say **"generate resume"** to create a new one. What would you like to do?`,
      timestamp: new Date()
    }]);
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    success('Message copied to clipboard!');
  };

  return (
    <>
      <Helmet>
        <title>AI Resume Generator - Workflows</title>
      </Helmet>
      
      <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-background dark:bg-[#0A0E27] transition-all duration-300`}>
        <div className={`${isFullscreen ? 'h-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
          {!isFullscreen && <div className="mb-6"><div className="text-sm text-text-secondary dark:text-[#8B92A3]">Resume Generator</div></div>}

          {/* Advanced ChatGPT-like Interface */}
          <div className={`${isFullscreen ? 'h-full' : 'h-[calc(100vh-12rem)]'} bg-white dark:bg-[#13182E] rounded-lg shadow-xl border border-border dark:border-[#1E2640] flex flex-col overflow-hidden`}>
            {/* Modern Header */}
            <div className="flex items-center justify-between p-4 border-b border-border dark:border-[#1E2640] bg-gradient-to-r from-workflow-primary/5 to-workflow-primary/10 dark:from-workflow-primary/10 dark:to-workflow-primary/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-workflow-primary to-workflow-primary-600 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary dark:text-[#E8EAED] flex items-center gap-2">
                    AI Resume Assistant
                    <span className="text-xs font-normal bg-workflow-primary/20 text-workflow-primary px-2 py-0.5 rounded-full">
                      Advanced
                    </span>
                  </h3>
                  <p className="text-xs text-text-secondary dark:text-[#8B92A3]">
                    {resumeCount}/{resumeLimit === -1 ? '∞' : resumeLimit} resumes • {subscriptionTier} plan
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTools(!showTools)}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-[#1A2139] transition-colors"
                  title="Tools"
                >
                  <Zap className="w-5 h-5 text-text-secondary dark:text-[#8B92A3]" />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-[#1A2139] transition-colors"
                  title="Settings"
                >
                  <Settings className="w-5 h-5 text-text-secondary dark:text-[#8B92A3]" />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-[#1A2139] transition-colors"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5 text-text-secondary dark:text-[#8B92A3]" /> : <Maximize2 className="w-5 h-5 text-text-secondary dark:text-[#8B92A3]" />}
                </button>
              </div>
            </div>

            {/* Tools Panel */}
            <AnimatePresence>
              {showTools && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-border dark:border-[#1E2640] bg-surface-50 dark:bg-[#1A2139] overflow-hidden"
                >
                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabledTools.atsOptimization}
                        onChange={(e) => setEnabledTools(prev => ({ ...prev, atsOptimization: e.target.checked }))}
                        className="w-4 h-4 text-workflow-primary rounded"
                      />
                      <span className="text-sm text-text-primary dark:text-[#E8EAED]">ATS Optimization</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabledTools.keywordExtraction}
                        onChange={(e) => setEnabledTools(prev => ({ ...prev, keywordExtraction: e.target.checked }))}
                        className="w-4 h-4 text-workflow-primary rounded"
                      />
                      <span className="text-sm text-text-primary dark:text-[#E8EAED]">Keyword Extraction</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabledTools.skillSuggestions}
                        onChange={(e) => setEnabledTools(prev => ({ ...prev, skillSuggestions: e.target.checked }))}
                        className="w-4 h-4 text-workflow-primary rounded"
                      />
                      <span className="text-sm text-text-primary dark:text-[#E8EAED]">Skill Suggestions</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabledTools.industryInsights}
                        onChange={(e) => setEnabledTools(prev => ({ ...prev, industryInsights: e.target.checked }))}
                        className="w-4 h-4 text-workflow-primary rounded"
                      />
                      <span className="text-sm text-text-primary dark:text-[#E8EAED]">Industry Insights</span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Area - ChatGPT Style */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-background to-surface-50 dark:from-[#0A0E27] dark:to-[#13182E]">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-workflow-primary to-workflow-primary-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`flex-1 max-w-3xl ${msg.role === 'user' ? 'order-2' : ''}`}>
                    <div
                      className={`rounded-2xl p-4 ${
                        msg.role === 'user'
                          ? 'bg-workflow-primary text-white ml-auto'
                          : 'bg-white dark:bg-[#1A2139] text-text-primary dark:text-[#E8EAED] border border-border dark:border-[#1E2640] shadow-sm'
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ 
                          __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                            .replace(/\n/g, '<br />')
                        }} />
                      </div>
                    </div>
                    
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleCopyMessage(msg.content)}
                          className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-[#1E2640] transition-colors group relative"
                          title="Copy message"
                        >
                          <Copy className="w-3.5 h-3.5 text-text-secondary dark:text-[#8B92A3] group-hover:text-workflow-primary" />
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Copy
                          </span>
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-[#1E2640] transition-colors"
                          title="Like this response"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-text-secondary dark:text-[#8B92A3] hover:text-green-500" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-[#1E2640] transition-colors"
                          title="Dislike this response"
                        >
                          <ThumbsDown className="w-3.5 h-3.5 text-text-secondary dark:text-[#8B92A3] hover:text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <>
                      <div className="w-8 h-8 rounded-full bg-workflow-primary-200 dark:bg-workflow-primary-900 flex items-center justify-center flex-shrink-0 order-1">
                        <span className="text-xs font-semibold text-workflow-primary">
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 max-w-3xl order-2 relative group">
                        <div className="rounded-2xl p-4 bg-workflow-primary text-white ml-auto">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ 
                              __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                .replace(/\n/g, '<br />')
                            }} />
                          </div>
                        </div>
                        <div className="absolute -right-12 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                          <button
                            onClick={() => handleCopyMessage(msg.content)}
                            className="p-1.5 bg-white/20 hover:bg-white/30 rounded transition-colors shadow-sm"
                            title="Copy"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              const editedContent = prompt(msg.content);
                              if (editedContent && editedContent !== msg.content) {
                                // Update the message
                                setMessages(prev => prev.map(m => 
                                  m.id === msg.id ? { ...m, content: editedContent } : m
                                ));
                                
                                // Regenerate AI response
                                setIsTyping(true);
                                try {
                                  const conversationHistory = messages.map(m => ({
                                    role: m.role,
                                    content: m.id === msg.id ? editedContent : m.content,
                                  }));
                                  
                                  const result = await aiService.generateCompletion(
                                    `User message: ${editedContent}\n\nContext: ${JSON.stringify(resumeData)}`,
                                    {
                                      systemMessage: 'You are Workflow AI, an advanced AI Resume Assistant. Help users create professional, ATS-optimized resumes.',
                                      max_tokens: 800,
                                      temperature: 0.7,
                                    }
                                  );
                                  
                                  const aiResponse = {
                                    role: 'assistant',
                                    content: result,
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
                            className="p-1.5 bg-white/20 hover:bg-white/30 rounded transition-colors shadow-sm"
                            title="Edit & Regenerate"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-workflow-primary to-workflow-primary-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-[#1A2139] rounded-2xl p-4 border border-border dark:border-[#1E2640]">
                    <AILoader variant="sparkles" />
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Advanced Input Area */}
            <div className="p-4 border-t border-border dark:border-[#1E2640] bg-white dark:bg-[#13182E]">
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Message AI Resume Assistant..."
                    rows={1}
                    className="w-full px-4 py-3 pr-12 border border-border dark:border-[#1E2640] rounded-xl bg-background dark:bg-[#0A0E27] text-text-primary dark:text-[#E8EAED] placeholder:text-text-secondary dark:placeholder:text-[#8B92A3] focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:border-transparent resize-none overflow-hidden"
                    style={{ minHeight: '48px', maxHeight: '200px' }}
                    disabled={isTyping}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={isTyping || !input.trim()}
                    className="absolute right-2 bottom-2 p-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-text-secondary dark:text-[#8B92A3]">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleRegenerate}
                      className="flex items-center gap-1 hover:text-workflow-primary transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      New Chat
                    </button>
                  </div>
                  <div>
                    {resumeCount}/{resumeLimit === -1 ? '∞' : resumeLimit} resumes remaining
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeGeneratorAI;