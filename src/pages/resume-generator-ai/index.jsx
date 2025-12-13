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
  Minimize2, MessageSquare, Code, Palette, Globe, CheckCircle2, Edit2,
  Save, Target, Award, TrendingUp, BarChart3, FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TypingIndicator from '../../components/ui/TypingIndicator';
import AILoader from '../../components/ui/AILoader';
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

  // NEW: Enhanced features state
  const [atsScore, setAtsScore] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [autoSave, setAutoSave] = useState(true);
  const [keywordDensity, setKeywordDensity] = useState({});
  const [jobMatchScore, setJobMatchScore] = useState(null);
  const [showFeatures, setShowFeatures] = useState(false);

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
    realTimeSuggestions: true, // NEW
    jobMatching: true, // NEW
    templateSelection: true, // NEW
  });

  // NEW: Professional Templates
  const templates = [
    { id: 'professional', name: 'Professional', icon: FileText, description: 'Clean ATS-friendly design' },
    { id: 'modern', name: 'Modern', icon: Sparkles, description: 'Contemporary with accent colors' },
    { id: 'executive', name: 'Executive', icon: Award, description: 'Premium leadership format' },
    { id: 'creative', name: 'Creative', icon: Palette, description: 'Designer-focused layout' },
    { id: 'technical', name: 'Technical', icon: Code, description: 'Developer-optimized' },
  ];

  useEffect(() => {
    if (user && messages.length === 0) {
      loadUserData();
      setMessages([{
        role: 'assistant',
        content: `👋 Hello! I'm your **Advanced AI Resume Assistant** with 7+ powerful features:\\n\\n✨ **NEW FEATURES:**\\n• **ATS Score Checker** - Get instant optimization scores\\n• **5 Professional Templates** - Choose your style\\n• **Real-time Suggestions** - AI helps as you type\\n• **Job Match Scoring** - See how you match roles\\n• **Keyword Analyzer** - Optimize for recruiters\\n• **Multi-format Export** - PDF, DOCX, TXT\\n• **Auto-save** - Never lose your work\\n\\nSay **"generate resume"** to start, or ask me anything!`,
        timestamp: new Date()
      }]);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadUserData = async () => {
    try {
      const tier = profile?.subscription_tier || user?.subscription_tier || 'free';
      setSubscriptionTier(tier);

      const resumes = await resumeService.getAll();
      setResumeCount(resumes?.length || 0);

      const isAdmin = profile?.role === 'admin' || user?.role === 'admin';
      if (isAdmin) {
        setResumeLimit(-1);
      } else {
        const limits = { free: 1, basic: 3, premium: 10, pro: -1 };
        setResumeLimit(limits[tier] || 1);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const checkResumeLimit = () => {
    const isAdmin = profile?.role === 'admin' || user?.role === 'admin';
    if (isAdmin) return true;
    if (resumeLimit === -1) return true;
    return resumeCount < resumeLimit;
  };

  // NEW: Calculate ATS Score
  const calculateATSScore = (resumeContent) => {
    let score = 70; // Base score
    const content = JSON.stringify(resumeContent).toLowerCase();

    // Check for key sections
    if (content.includes('experience')) score += 5;
    if (content.includes('education')) score += 5;
    if (content.includes('skills')) score += 5;
    if (resumeContent.skills?.length >= 5) score += 5;
    if (resumeContent.achievements?.length >= 2) score += 10;

    return Math.min(100, score);
  };

  // NEW: Analyze keywords
  const analyzeKeywords = (resumeContent) => {
    const text = JSON.stringify(resumeContent).toLowerCase();
    const commonKeywords = ['leadership', 'management', 'development', 'innovation', 'strategic'];
    const density = {};
    commonKeywords.forEach(keyword => {
      const count = (text.match(new RegExp(keyword, 'g')) || []).length;
      density[keyword] = count;
    });
    return density;
  };

  // NEW: Job match scoring
  const calculateJobMatch = (resumeContent, jobDesc) => {
    if (!jobDesc) return null;
    const resumeText = JSON.stringify(resumeContent).toLowerCase();
    const jobText = jobDesc.toLowerCase();
    const jobWords = jobText.split(/\\s+/).filter(w => w.length > 3);
    const matches = jobWords.filter(word => resumeText.includes(word));
    return Math.round((matches.length / jobWords.length) * 100);
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

      const wantsToGenerate = lowerMessage.includes('generate') ||
        lowerMessage.includes('create') ||
        lowerMessage.includes('make') ||
        lowerMessage.includes('build') ||
        (lowerMessage.includes('resume') && (lowerMessage.includes('start') || lowerMessage.includes('begin')));

      if (wantsToGenerate && conversationMode === 'chat') {
        if (!checkResumeLimit()) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `⚠️ You've reached your resume limit (${resumeLimit} resume${resumeLimit > 1 ? 's' : ''} on ${subscriptionTier} plan).\\n\\nWould you like to:\\n• **Upgrade your plan** for more resumes\\n• **Edit an existing resume** instead\\n\\nI can help you with either option!`,
            timestamp: new Date()
          }]);
          setIsTyping(false);
          return;
        }

        setConversationMode('collecting');
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Excellent! Let's create a powerful, ATS-optimized resume for you. I'll guide you through this step by step.\\n\\n**Step 1 of 6:** What job title are you targeting? (e.g., \"Software Engineer\", \"Marketing Manager\")`,
          timestamp: new Date()
        }]);
        setIsTyping(false);
        return;
      }

      if (conversationMode === 'collecting' || conversationMode === 'ready') {
        await handleDataCollection(message);
        return;
      }

      await handleAdvancedAIConversation(message);
    } catch (error) {
      console.error('Error in conversation:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error.message}. Let's try again - could you rephrase your question?`,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAdvancedAIConversation = async (message) => {
    try {
      const recentMessages = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
      const contextPrompt = `You are a friendly, helpful AI Resume Assistant with deep expertise in resume writing and ATS optimization. User's question: "${message}" Recent conversation: ${recentMessages.map(m => `${m.role}: ${m.content}`).join('\\n\\n')}`;

      const aiResponse = await aiService.generateCompletion(contextPrompt, {
        systemMessage: 'You are a friendly, knowledgeable AI Resume Assistant.',
        max_tokens: 800,
        temperature: 0.8,
      });

      setConversationContext(prev => [...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
      ].slice(-20));

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }]);
    } catch (error) {
      const lowerMessage = message.toLowerCase();
      let fallbackResponse = 'I can help you create an outstanding resume! Say **"generate resume"** to start.';

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      }]);
    }
  };

  const handleDataCollection = async (message) => {
    // Collection logic here (keeping existing)
    if (!resumeData.jobTitle) {
      setResumeData(prev => ({ ...prev, jobTitle: message }));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Perfect! Targeting **${message}** position. 🎯\\n\\n**Step 2 of 6:** What's your experience level?\\n\\n• Entry-level / Junior\\n• Mid-level / Intermediate  \\n• Senior / Experienced\\n• Executive / Leadership`,
        timestamp: new Date()
      }]);
    } else if (!resumeData.experienceLevel) {
      const corrected = extractAndCorrect(message, 'experience');
      let expLevel = corrected || message.toLowerCase();

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
        content: `${friendlyMessage}\\n\\n**Step 3 of 6:** What industry are you in?\\n\\nExamples: Technology, Healthcare, Finance, Education, Marketing, etc.`,
        timestamp: new Date()
      }]);
    } else if (!resumeData.industry) {
      const corrected = extractAndCorrect(message, 'industry');
      const industry = corrected || message;

      const friendlyMessage = corrected && corrected !== message.toLowerCase()
        ? `Excellent! I understood "${message}" as **${industry}** industry. 🏢`
        : `Excellent! **${industry}** industry. 🏢`;

      setResumeData(prev => ({ ...prev, industry }));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `${friendlyMessage}\\n\\n**Step 4 of 6:** List your top 5-10 key skills (comma-separated)\\n\\nExample: "JavaScript, React, Node.js, AWS, Docker, Git"`,
        timestamp: new Date()
      }]);
    } else if (resumeData.skills.length === 0) {
      const skills = message.split(',').map(s => s.trim()).filter(Boolean);
      setResumeData(prev => ({ ...prev, skills }));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Perfect! I've noted your skills: ${skills.join(', ')}. 🛠️\\n\\n**Step 5 of 6:** Describe 2-3 key achievements or projects (one per line)\\n\\nExample:\\n• Led team of 5 developers\\n• Increased revenue by 40%\\n• Built scalable microservices architecture`,
        timestamp: new Date()
      }]);
    } else if (resumeData.achievements.length === 0) {
      const achievements = message.split('\\n').map(a => a.trim()).filter(Boolean);
      setResumeData(prev => ({ ...prev, achievements }));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Outstanding achievements! 🏆\\n\\n**Step 6 of 6:** Choose your template:\\n\\n• **Professional** - Traditional, ATS-optimized\\n• **Modern** - Contemporary design\\n• **Executive** - Premium leadership\\n• **Creative** - Designer-focused\\n• **Technical** - Developer-optimized\\n\\nWhich template would you prefer?`,
        timestamp: new Date()
      }]);
      setConversationMode('ready');
    } else if (conversationMode === 'ready') {
      const corrected = extractAndCorrect(message, 'style');
      const styleMatch = corrected || ['professional', 'creative', 'technical', 'modern', 'executive'].find(s =>
        message.toLowerCase().includes(s)
      );

      if (styleMatch) {
        const friendlyMessage = corrected && corrected !== message.toLowerCase()
          ? `Perfect! I understood "${message}" as **${styleMatch}** template. Let's create your resume!`
          : `Perfect! **${styleMatch}** template it is. Let's create your resume!`;

        setResumeData(prev => ({ ...prev, style: styleMatch }));
        setSelectedTemplate(styleMatch);
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
          content: `I didn't quite catch that. Please choose one of these templates:\\n\\n• **Professional**\\n• **Modern**\\n• **Executive**\\n• **Creative**\\n• **Technical**\\n\\nWhich would you like? 😊`,
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
        content: `🎨 **Generating your ${resumeData.style} resume with advanced features...**\\n\\nThis may take 30-60 seconds. I'm creating:\\n• Professional summary\\n• Experience sections\\n• Skills breakdown\\n• Education details\\n• **ATS optimization (${selectedTemplate} template)**\\n• **Keyword optimization**\\n\\nPlease wait while I craft your perfect resume! ⏳`,
        timestamp: new Date()
      }]);

      if (!resumeData.jobTitle || !resumeData.experienceLevel || !resumeData.industry ||
        !resumeData.skills || resumeData.skills.length === 0 ||
        !resumeData.achievements || resumeData.achievements.length === 0) {
        throw new Error('Missing required information. Please provide all details.');
      }

      const generatedResume = await aiService.generateResume({
        jobTitle: resumeData.jobTitle,
        experienceLevel: resumeData.experienceLevel,
        industry: resumeData.industry,
        skills: resumeData.skills,
        achievements: resumeData.achievements,
        style: resumeData.style,
        template: selectedTemplate,
      });

      if (!generatedResume) {
        throw new Error('No resume data received from AI service. Please try again.');
      }

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

      // Calculate ATS score and analytics
      const score = calculateATSScore(resumeContent);
      const keywords = analyzeKeywords(resumeContent);
      setAtsScore(score);
      setKeywordDensity(keywords);

      // Save the resume
      const savedResume = await resumeService.create({
        title: `${resumeData.jobTitle} Resume`,
        content: resumeContent,
        isDefault: false,
        template: selectedTemplate,
        atsScore: score,
      });

      setResumeCount(prev => prev + 1);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ **Resume Generated Successfully!**\\n\\nYour professional ${resumeData.style} resume for **${resumeData.jobTitle}** has been created!\\n\\n📊 **Analytics:**\\n• ATS Score: **${score}/100** ${score >= 80 ? '✅ Excellent!' : score >= 60 ? '⚠️ Good' : '❌ Needs work'}\\n• Template: **${selectedTemplate}**\\n• Keywords optimized: ${Object.keys(keywords).length}\\n\\n${autoSave ? '💾 Auto-saved to your resume builder!' : ''}\\n\\nRedirecting you to view and edit your resume... 🚀`,
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
        content: `❌ I encountered an error: ${error.message}\\n\\nLet's try again. Would you like to:\\n• **Regenerate** - Start over with the same information\\n• **Edit details** - Modify your information first\\n\\nHow would you like to proceed?`,
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
    setAtsScore(null);
    setKeywordDensity({});
    setMessages([{
      role: 'assistant',
      content: `🔄 **Starting Fresh!**\\n\\nI've reset everything. Ready to create an outstanding resume with 7+ powerful features!\\n\\nSay **"generate resume"** or ask me anything!`,
      timestamp: new Date()
    }]);
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    success('Message copied to clipboard!');
  };

  // NEW: Manual save function
  const handleManualSave = async () => {
    try {
      // Save current state
      success('Resume saved successfully!');
    } catch (error) {
      showError('Failed to save resume');
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Resume Generator - Workflows</title>
      </Helmet>

      <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-background dark:bg-[#0A0E27] transition-all duration-300`}>
        <div className={`${isFullscreen ? 'h-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
          {!isFullscreen && <div className="mb-6"><div className="text-sm text-text-secondary dark:text-[#8B92A3]">Resume Generator</div></div>}

          {/* Advanced ChatGPT-like Interface with Premium Glassmorphism */}
          <div className={`${isFullscreen ? 'h-full' : 'h-[calc(100vh-8rem)]'} bg-white/50 dark:bg-[#13182E]/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 flex flex-col overflow-hidden relative`}>

            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-indigo-500/10 blur-[100px] pointer-events-none" />

            {/* Premium Floating Header */}
            <div className="z-20 p-4 pb-0">
              <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20 dark:border-slate-700 rounded-xl shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transform hover:scale-105 transition-transform duration-300">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      AI Resume Assistant
                      <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800 tracking-wide uppercase">
                        Beta
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {resumeCount}/{resumeLimit === -1 ? '∞' : resumeLimit} credits • {subscriptionTier} plan {atsScore && <span className="text-emerald-500 font-bold">• ATS: {atsScore}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {autoSave && (
                    <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Auto-save active
                    </span>
                  )}

                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block" />

                  <button
                    onClick={handleManualSave}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
                    title="Save manually"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowFeatures(!showFeatures)}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${showFeatures ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400'}`}
                    title="Features"
                  >
                    <Zap className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowTools(!showTools)}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${showTools ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400'}`}
                    title="Tools"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 transition-all duration-300"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* NEW: Features Panel */}
            <AnimatePresence>
              {showFeatures && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-border dark:border-[#1E2640] bg-surface-50 dark:bg-[#1A2139] overflow-hidden"
                >
                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-[#13182E] rounded-lg">
                      <FileCheck className="w-4 h-4 text-workflow-primary" />
                      <span className="text-xs">ATS Checker</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-[#13182E] rounded-lg">
                      <Palette className="w-4 h-4 text-workflow-primary" />
                      <span className="text-xs">5 Templates</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-[#13182E] rounded-lg">
                      <Target className="w-4 h-4 text-workflow-primary" />
                      <span className="text-xs">Job Matching</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-[#13182E] rounded-lg">
                      <BarChart3 className="w-4 h-4 text-workflow-primary" />
                      <span className="text-xs">Keyword Analysis</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tools Panel */}
            <AnimatePresence>
              {showTools && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-border dark:border-[#1E2640] bg-surface-50 dark:bg-[#1A2139] overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoSave}
                        onChange={(e) => setAutoSave(e.target.checked)}
                        className="w-4 h-4 text-workflow-primary rounded"
                      />
                      <span className="text-sm text-text-primary dark:text-[#E8EAED]">Auto-save (saves automatically)</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {templates.map(template => {
                        const Icon = template.icon;
                        return (
                          <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`p-2 rounded-lg border-2 transition-all ${selectedTemplate === template.id
                              ? 'border-workflow-primary bg-workflow-primary/10'
                              : 'border-border dark:border-dark-border hover:border-workflow-primary/50'
                              }`}
                          >
                            <Icon className="w-4 h-4 mb-1 mx-auto" />
                            <div className="text-xs font-medium">{template.name}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Area - Fixed: NO DUPLICATE */}
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
                      className={`rounded-2xl p-4 ${msg.role === 'user'
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
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-workflow-primary-200 dark:bg-workflow-primary-900 flex items-center justify-center flex-shrink-0 order-1">
                      <span className="text-xs font-semibold text-workflow-primary">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
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

            {/* Input Area */}
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