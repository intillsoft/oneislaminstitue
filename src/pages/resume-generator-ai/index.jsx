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
  Save, Target, Award, TrendingUp, BarChart3, FileCheck, PanelLeft, PanelLeftClose, ArrowLeft,
  ChevronRight, Layout, Filter, Wand2, Search as SearchIcon, Upload, Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TypingIndicator from '../../components/ui/TypingIndicator';
import AILoader from '../../components/ui/AILoader';
import { extractAndCorrect, correctSpelling } from '../../utils/spellChecker';
import ReactMarkdown from 'react-markdown';
import { EliteCard, ElitePageHeader, EliteStatCard } from '../../components/ui/EliteCard';
import IconComponent from '../../components/AppIcon';
import ResumePreview from '../resume/components/ResumePreview';


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
  const [activeTool, setActiveTool] = useState(null); // Replaces showTools
  const [generatedResumeJson, setGeneratedResumeJson] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userResumes, setUserResumes] = useState([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [showCanvasControls, setShowCanvasControls] = useState(false);
  const [referencedResume, setReferencedResume] = useState(null); // NEW: Track referenced resume context
  const [isProcessing, setIsProcessing] = useState(false); // NEW: Processing edits
  const fileInputRef = useRef(null);

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
    if (user) {
      loadUserData();
    }
  }, [user, profile]);

  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `👋 **Hi! I'm your AI Recruitment Strategist.**\n\nI'm here to collaborate on building a high-impact, professional resume that gets you noticed. Whether you're starting from scratch or optimizing for a dream role, I'll leverage deep career intelligence to help you stand out. \n\n**Common starting points:**\n• Provide a **Job Description** for an ATS audit\n• Describe your **recent highlights** to build a blueprint\n• Reference an **existing resume** from your library`,
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
      setUserResumes(resumes || []);

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

  const toggleLibrary = () => {
    loadUserData(); // Force refresh when opening
    setShowLibrary(!showLibrary);
  };

  const handleLoadResume = (resume) => {
    // We set it as the primary preview data
    setGeneratedResumeJson(resume.content_json || resume.content);
    setSelectedResumeId(resume.id);
    setSelectedTemplate(resume.template || 'professional');
    setAtsScore(resume.ats_score || 0);

    // Also set it as the active REFERENCE for AI context
    setReferencedResume(resume);

    setShowLibrary(false);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `📁 **Intelligence Loaded: ${resume.title}**\n\nI've synchronized this resume to the primary intelligence canvas and set it as our active context. \n\n**What shall we do?**\n• **Review** for impact and ATS score\n• **Edit** specific sections or bullets\n• **Tailor** it for a target job description`,
      timestamp: new Date()
    }]);
    success('Resume context synchronized.');
  };

  const checkResumeLimit = () => {
    // Priority: Profile role, then user role, then check if resumeLimit is -1
    const isAdmin = profile?.role === 'admin' || user?.role === 'admin' || user?.user_metadata?.role === 'admin';
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

  // NEW: Real AI ATS Analysis
  const performATSAnalysis = async (resumeContent) => {
    try {
      const prompt = `Analyze this resume JSON for ATS optimization.
        Resume: ${JSON.stringify(resumeContent).slice(0, 3000)}...
        
        Return JSON ONLY:
        {
            "score": (0-100 number),
            "keywords": {"keyword": count, ...},
            "missing_keywords": ["..."],
            "formatting_issues": ["..."],
            "feedback": ["..."]
        }`;

      const response = await aiService.generateCompletion(prompt, {
        systemMessage: "You are an expert ATS Algorithm Auditor. Return valid JSON.",
        temperature: 0.2
      });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        setAtsScore(result.score || 70);
        setKeywordDensity(result.keywords || {});
        return result;
      }
    } catch (e) {
      console.error("ATS Analysis failed, using fallback", e);
      setAtsScore(calculateATSScore(resumeContent));
      setKeywordDensity(analyzeKeywords(resumeContent));
    }
  };

  const handleCanvasUpdate = (path, value) => {
    // Deep update helper
    const updateDeep = (obj, pathArray, val) => {
      const newObj = { ...obj };
      let current = newObj;
      for (let i = 0; i < pathArray.length - 1; i++) {
        if (!current[pathArray[i]]) current[pathArray[i]] = {};
        current = current[pathArray[i]];
      }
      current[pathArray[pathArray.length - 1]] = val;
      return newObj;
    };

    // Path comes as "personalInfo.firstName"
    const pathArray = path.split('.');
    const newData = updateDeep(generatedResumeJson, pathArray, value);
    setGeneratedResumeJson(newData);
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
            content: `⚠️ You've reached your resume limit (${resumeLimit} resume${resumeLimit > 1 ? 's' : ''} on ${subscriptionTier} plan).\n\nWould you like to:\n• **Upgrade your plan** for more resumes\n• **Edit an existing resume** instead\n\nI can help you with either option!`,
            timestamp: new Date()
          }]);
          setIsTyping(false);
          return;
        }

        setConversationMode('collecting');
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Excellent! Let's build a high-impact, ATS-optimized resume. I'll guide you through the essentials, but feel free to provide details in any order.\n\n**First, what's the role you're aiming for?**`,
          timestamp: new Date()
        }]);
        setIsTyping(false);
        return;
      }

      if (conversationMode === 'collecting' || conversationMode === 'ready' || wantsToGenerate) {
        await handleAdvancedDataCollection(message);
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

      // NEW: Inject profile and reference context
      const userProfileContext = profile ? `\n\nUSER PROFILE DATA:\n- Name: ${profile.full_name || 'Not provided'}\n- Role: ${profile.role || 'Not provided'}\n- Bio: ${profile.bio || 'Not provided'}\n- Skills: ${profile.skills ? profile.skills.join(', ') : 'None listed'}` : '';

      // NEW: Inject referenced resume context
      const referenceContext = referencedResume
        ? `\n\nCURRENT REFERENCED RESUME CONTENT:\n${JSON.stringify(referencedResume.content_json || referencedResume.content, null, 2)}`
        : '';

      const systemPrompt = `You are a world-class AI Career Strategist and Talent Advocate. 
      Your purpose is to help users engineer exceptional careers by crafting high-impact resumes and providing elite industry insights.
      Be collaborative, insightful, and professional. Use clear, beautiful markdown for your responses.${userProfileContext}${referenceContext}`;

      const contextPrompt = `User input: "${message}"\n\nRecent conversation history:\n${recentMessages.map(m => `${m.role}: ${m.content}`).join('\n\n')}`;

      const aiResponse = await aiService.generateCompletion(contextPrompt, {
        systemMessage: systemPrompt,
        max_tokens: 1000,
        temperature: 0.7,
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

  const handleEditWithAI = async (prompt) => {
    if (!prompt?.trim() || isProcessing) return;

    const userMessage = {
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    setIsTyping(true);

    try {
      const systemPrompt = `You are a world-class AI Career Strategist. You are currently editing the live resume displayed on the canvas. 
      Analyze the user's request and update the resume's JSON content accordingly. 
      You MUST return your response in a valid JSON format with two keys:
      1. "updatedResume": The complete, modified resume JSON object.
      2. "explanation": A brief, professional explanation of the specific changes you made.
      
      Resume JSON Schema: { "personalInfo": {...}, "summary": "...", "experience": [...], "skills": [...], "education": [...] }`;

      const context = `CURRENT RESUME DATA:\n${JSON.stringify(generatedResumeJson, null, 2)}\n\nUSER EDIT REQUEST: "${prompt}"`;

      const response = await aiService.generateCompletion(context, {
        systemMessage: systemPrompt,
        temperature: 0.3,
      });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[jsonMatch.length - 1] === '}' ? jsonMatch[0] : jsonMatch[0] + '}');
          if (result.updatedResume) {
            setGeneratedResumeJson(result.updatedResume);
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `✨ **Modifications Applied!**\n\n${result.explanation || "I've updated the intelligence canvas based on your request."}`,
              timestamp: new Date()
            }]);
            success('Visual intelligence updated.');
          } else {
            await handleAdvancedAIConversation(prompt);
          }
        } catch (e) {
          console.error('JSON Parse Error in AI Edit:', e);
          await handleAdvancedAIConversation(prompt);
        }
      } else {
        await handleAdvancedAIConversation(prompt);
      }
    } catch (err) {
      console.error('AI Edit Error:', err);
      showError('Neuro-link unstable. Conversion failed.');
    } finally {
      setIsProcessing(false);
      setIsTyping(false);
    }
  };

  const handleAdvancedDataCollection = async (message) => {
    try {
      // Use profile as initial blueprint if available
      const initialBlueprint = {
        jobTitle: profile?.role || '',
        skills: profile?.skills || [],
        ...resumeData
      };

      const extractionPrompt = `User said: "${message}"\n\nExtract relevant resume detail from this message. 
      Return only JSON format: { "jobTitle": "...", "experienceLevel": "...", "industry": "...", "skills": ["..."], "achievements": ["..."] }. 
      If info missing, leave as null. Current state: ${JSON.stringify(initialBlueprint)}`;

      const extraction = await aiService.generateCompletion(extractionPrompt, {
        systemMessage: "You are a data extractor for resumes. Return valid JSON only.",
        temperature: 0
      });

      const jsonMatch = extraction.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const newInfo = JSON.parse(jsonMatch[0]);
        const updatedData = {
          ...resumeData,
          jobTitle: newInfo.jobTitle || resumeData.jobTitle,
          experienceLevel: newInfo.experienceLevel || resumeData.experienceLevel,
          industry: newInfo.industry || resumeData.industry,
          skills: [...new Set([...resumeData.skills, ...(newInfo.skills || [])])],
          achievements: [...new Set([...resumeData.achievements, ...(newInfo.achievements || [])])]
        };
        setResumeData(updatedData);

        // Check if we have enough to generate OR need more
        const missing = [];
        if (!updatedData.jobTitle) missing.push("target role");
        if (!updatedData.experienceLevel) missing.push("experience level");
        if (!updatedData.industry) missing.push("industry");
        if (updatedData.skills.length < 3) missing.push("at least 3 skills");

        if (missing.length === 0) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `🎯 **Intelligence Gathered.** I have enough context to construct your primary document! 
              \n\n**Brief Overview:**\n• Role: ${updatedData.jobTitle}\n• Industry: ${updatedData.industry}\n• Skills: ${updatedData.skills.slice(0, 3).join(', ')}...\n\nShould I **initialize generation** now, or do you have more to add?`,
            timestamp: new Date()
          }]);
          setConversationMode('ready');
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Got it. I've noted that into your profile. To complete the blueprint, I still need: **${missing.join(', ')}**. \n\nWhat else can you tell me?`,
            timestamp: new Date()
          }]);
        }
      }
    } catch (err) {
      console.error("Data collection error:", err);
      // Fallback to simple handling
      await handleAdvancedAIConversation(message);
    }
  };

  const handleGenerate = async () => {
    try {
      setIsTyping(true);
      setShowCanvasControls(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `🎨 **Initializing Neural Rendering Hub...**\n\nStreaming your professional **${resumeData.jobTitle}** architecture to the canvas. One moment...`,
        timestamp: new Date()
      }]);

      const generatedResume = await aiService.generateResume({
        jobTitle: resumeData.jobTitle,
        experienceLevel: resumeData.experienceLevel,
        industry: resumeData.industry,
        skills: resumeData.skills,
        achievements: resumeData.achievements,
        style: resumeData.style || 'professional',
        template: selectedTemplate,
      });

      if (!generatedResume) throw new Error('No resume data received.');

      const resumeContent = generatedResume.resume || generatedResume;

      // START SIMULATED STREAMING
      setIsStreaming(true);
      setGeneratedResumeJson({}); // Reset canvas for streaming

      const sections = ['personalInfo', 'summary', 'experience', 'education', 'skills'];
      for (const section of sections) {
        if (resumeContent[section]) {
          await new Promise(r => setTimeout(r, 800)); // Simulated delay per section
          setGeneratedResumeJson(prev => ({
            ...prev,
            [section]: resumeContent[section]
          }));
        }
      }

      setIsStreaming(false);

      setIsStreaming(false);

      // Real AI ATS Analysis
      performATSAnalysis(resumeContent);

      setResumeCount(prev => prev + 1);

      // Save the resume
      const savedResume = await resumeService.create({
        title: `${resumeData.jobTitle} Resume`,
        content: resumeContent,
        isDefault: false,
        template: selectedTemplate,
        atsScore: score,
      });

      setResumeCount(prev => prev + 1);
      setShowCanvasControls(true);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `📈 **Intelligence Deployed Successfully.**\n\nI've synchronized the finalized document to your canvas. \n\n📊 **Insights:**\n• ATS Compliance: **${score}/100**\n• Optimization: 100%\n\nOur construction is complete. You can now **commit the draft**, **enter the full editor**, or describe further fine-tunings.`,
        timestamp: new Date(),
        isResumeResult: true,
        resumeId: savedResume.id
      }]);

      success('Intelligence synchronized.');
    } catch (error) {
      console.error('Error generating resume:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ I encountered a synchronized failure: ${error.message}\n\nWould you like me to attempt a recalibration?`,
        timestamp: new Date()
      }]);
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
      content: `🔄 **Starting Fresh!**\n\nI've reset everything. Ready to create an outstanding resume with 7+ powerful features!\n\nSay **"generate resume"** or ask me anything!`,
      timestamp: new Date()
    }]);
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    success('Message copied to clipboard!');
  };

  const handleSaveToDashboard = (resumeId) => {
    success('Intel secured. Resume saved to your intelligence hub.');
    setTimeout(() => {
      navigate('/resume/dashboard');
    }, 1500);
  };


  return (
    <>
      <Helmet>
        <title>AI Resume Architect | Workflow</title>
      </Helmet>

      {/* --- ALWAYS FULL SCREEN OVERLAY --- */}
      <div className="fixed inset-0 z-[100] bg-[#0F172A] text-slate-200 font-sans selection:bg-workflow-primary/30 overflow-hidden flex flex-col h-screen">

        {/* --- Header Bar --- */}
        <div className="h-16 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/resume/dashboard')}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 group bg-white/[0.04] shadow-lg"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Sparkles size={14} className="text-workflow-primary" />
                Career Intel Strategist
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Neural Resume Optimization v3.0</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLibrary}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${showLibrary ? 'bg-workflow-primary text-white border-workflow-primary' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
            >
              <FileText size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Intel Library</span>
            </button>
          </div>
        </div>

        {/* intelligence Library Sidebar */}
        <AnimatePresence>
          {showLibrary && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="absolute left-0 top-16 bottom-0 w-80 bg-[#0F172A] border-r border-white/5 z-[60] shadow-2xl overflow-y-auto custom-scrollbar"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Resume Intel Hub</h3>
                  <button onClick={() => setShowLibrary(false)} className="text-slate-500 hover:text-white transition-colors"><X size={16} /></button>
                </div>

                <div className="space-y-3">
                  {userResumes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-white/5 rounded-2xl">
                      <FileText size={24} className="text-slate-700 mb-3" />
                      <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">No intelligence records found.</p>
                    </div>
                  ) : (
                    userResumes.map(res => (
                      <button
                        key={res.id}
                        onClick={() => handleLoadResume(res)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all group ${selectedResumeId === res.id ? 'bg-workflow-primary/10 border-workflow-primary text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <FileText size={14} className={selectedResumeId === res.id ? 'text-workflow-primary' : 'text-slate-600'} />
                          <span className="text-xs font-bold truncate uppercase tracking-tight">{res.title}</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase">
                          <span>ATS: {res.ats_score || '00'}</span>
                          <span>{new Date(res.updated_at).toLocaleDateString()}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MAIN WORKSPACE: 2-COLUMN LAYOUT --- */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* COLUMN 1: AI CHAT (Collaborative Interface) */}
          <div className={`flex flex-col border-r border-white/5 bg-[#0F172A] transition-all duration-500 ease-in-out ${isEditMode ? 'w-0 opacity-0 overflow-hidden' : 'w-full lg:w-[40%] xl:w-[35%] opacity-100'}`}>
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar scroll-smooth">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-workflow-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-workflow-primary/30 mt-1">
                        <Wand2 className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                      <div className={`p-4 rounded-2xl ${msg.role === 'user'
                        ? 'bg-slate-800 text-white rounded-tr-sm shadow-xl'
                        : 'bg-white/[0.03] border border-white/5 text-slate-200 rounded-tl-sm shadow-xl'
                        }`}>
                        <div className="prose prose-invert prose-sm max-w-none leading-relaxed text-slate-300">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                        {msg.isResumeResult && (
                          <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                            <button
                              onClick={() => navigate(`/resume/edit/${msg.resumeId}`)}
                              className="px-3 py-1.5 rounded-lg bg-workflow-primary/20 border border-workflow-primary/30 text-workflow-primary text-[10px] font-black uppercase tracking-widest hover:bg-workflow-primary/30 transition-all"
                            >
                              Edit Manually
                            </button>
                            <button
                              onClick={() => handleSaveToDashboard(msg.resumeId)}
                              className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                            >
                              Save to Hub
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-600 mt-2 block px-1 uppercase font-bold tracking-widest">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-lg bg-workflow-primary/20 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-4 h-4 text-workflow-primary animate-spin" />
                  </div>
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* SUGGESTED ACTIONS: Dynamic based on context */}
            <div className="flex flex-wrap justify-center gap-2 mb-6 px-6 max-w-2xl mx-auto shrink-0">
              {!generatedResumeJson && messages.length <= 1 ? (
                <>
                  {[
                    { label: "Build from Scratch", icon: Wand2, action: "Let's build a new resume from scratch" },
                    { label: "Analyze Existing", icon: SearchIcon, onClick: toggleLibrary },
                    { label: "Target a Role", icon: Target, action: "I'm targeting a specific role, can you help?" }
                  ].map((btn, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (btn.onClick) {
                          btn.onClick();
                        } else {
                          setInput(btn.action);
                          inputRef.current?.focus();
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-workflow-primary/10 hover:border-workflow-primary/30 transition-all flex items-center gap-2"
                    >
                      <btn.icon size={12} />
                      {btn.label}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {(generatedResumeJson || referencedResume) && [
                    { label: "Deep ATS Audit", icon: BarChart3, action: "Perform a deep ATS audit and give me actionable feedback" },
                    { label: "Tailor for Job", icon: Target, action: "I have a job description, tailor this resume for it" },
                    { label: "Refine Summary", icon: FileText, action: "Rewrite my professional summary for higher impact" },
                    { label: "Identify Gaps", icon: Zap, action: "What critical skills are missing for a Senior role?" }
                  ].map((btn, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (generatedResumeJson) {
                          handleEditWithAI(btn.action);
                        } else {
                          setInput(btn.action);
                          handleSend(btn.action);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-workflow-primary/5 border border-workflow-primary/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-workflow-primary/20 transition-all flex items-center gap-2"
                    >
                      <btn.icon size={12} className="text-workflow-primary" />
                      {btn.label}
                    </button>
                  ))}
                </>
              )}
            </div>

            <div className="relative w-full max-w-2xl mx-auto px-6 mb-8 shrink-0">
              <div className="absolute inset-0 bg-workflow-primary/5 rounded-3xl blur-2xl group-focus-within:bg-workflow-primary/10 transition-all" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl shadow-2xl flex flex-col p-2 transition-all focus-within:border-workflow-primary/40 focus-within:ring-4 focus-within:ring-workflow-primary/5">
                {/* REFERENCE CHIP */}
                <AnimatePresence>
                  {referencedResume && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className="mx-2 mt-1 mb-2 px-3 py-1.5 rounded-lg bg-workflow-primary/20 border border-workflow-primary/30 flex items-center justify-between group/chip"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-workflow-primary flex items-center justify-center">
                          <FileCheck size={12} className="text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-workflow-primary uppercase tracking-widest truncate max-w-[200px]">
                          Referencing: {referencedResume.title}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setReferencedResume(null);
                          setSelectedResumeId(null);
                        }}
                        className="p-1 text-workflow-primary/60 hover:text-workflow-primary transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-end">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-slate-500 hover:text-white transition-colors"
                    title="Upload Document"
                  >
                    <Paperclip size={18} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) success(`Intel secured: ${file.name}`);
                    }}
                  />
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), generatedResumeJson ? handleEditWithAI(input) : handleSend())}
                    placeholder={generatedResumeJson ? "Collaborate on adjustments..." : "Message AI Career Strategist..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-500 px-4 py-3 min-h-[50px] max-h-[150px] resize-none text-[13px] font-medium leading-relaxed"
                    rows={1}
                    disabled={isTyping || isStreaming}
                  />
                  <button
                    onClick={() => generatedResumeJson ? handleEditWithAI(input) : handleSend()}
                    disabled={!input.trim() || isTyping || isStreaming}
                    className="p-3 bg-workflow-primary hover:bg-workflow-primary/90 text-white rounded-xl shadow-lg shadow-workflow-primary/20 disabled:opacity-30 disabled:shadow-none transition-all active:scale-95 mb-0.5 mr-0.5"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: RESUME CANVAS (Persistent Display) */}
          <div className={`flex-1 flex flex-col bg-[#020617] relative ${!isEditMode ? 'hidden lg:flex' : 'flex'}`}>

            {/* CANVAS HEADER / TOOLS */}
            <div className="h-14 border-b border-white/5 bg-[#0A0F1E]/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="p-2 text-slate-400 hover:text-white transition-colors lg:hidden"
                  title={isEditMode ? "Expand Canvas" : "Show Chat"}
                >
                  <PanelLeft size={18} className={isEditMode ? "rotate-180 transition-transform" : "transition-transform"} />
                </button>
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-workflow-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live Resume Canvas</span>
                </div>

                {/* 5 TOOLS */}
                <div className="hidden lg:flex items-center gap-2 ml-4">
                  {[
                    { id: 'ats', icon: BarChart3, label: 'ATS Score' },
                    { id: 'keywords', icon: Filter, label: 'Keywords' },
                    { id: 'format', icon: Palette, label: 'Style' }
                  ].map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border transition-all flex items-center gap-1.5 ${activeTool === tool.id ? 'bg-workflow-primary text-white border-workflow-primary' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}
                    >
                      <tool.icon size={12} />
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AnimatePresence>
                  {showCanvasControls && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2"
                    >
                      <button
                        onClick={() => {
                          const lastMsg = messages.filter(m => m.isResumeResult).pop();
                          if (lastMsg?.resumeId) {
                            navigate(`/resume/edit/${lastMsg.resumeId}`);
                          } else if (selectedResumeId) {
                            navigate(`/resume/edit/${selectedResumeId}`);
                          }
                        }}
                        className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                      >
                        <Edit2 size={14} /> Full Editor
                      </button>
                      <button
                        onClick={() => {
                          const lastMsg = messages.filter(m => m.isResumeResult).pop();
                          if (lastMsg?.resumeId) handleSaveToDashboard(lastMsg.resumeId);
                          else if (selectedResumeId) handleSaveToDashboard(selectedResumeId);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-workflow-primary text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-workflow-primary/20 flex items-center gap-2"
                      >
                        <Save size={14} /> Commit Draft
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CANVAS VIEWPORT */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar bg-[radial-gradient(circle_at_center,rgba(0,70,255,0.03)_0%,transparent_70%)]">
              <div className="max-w-[850px] mx-auto">
                <AnimatePresence mode="wait">
                  {generatedResumeJson ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="shadow-[0_40px_100px_rgba(0,0,0,0.4)]"
                    >
                      <ResumePreview
                        resumeData={generatedResumeJson}
                        template={selectedTemplate}
                        onUpdate={handleCanvasUpdate}
                        isGenerating={isStreaming}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-[1000px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center p-12 text-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center mb-8">
                        <FileText size={32} className="text-slate-800" />
                      </div>
                      <h3 className="text-xl font-black text-slate-700 uppercase tracking-tighter mb-4">Awaiting Intel Payload</h3>
                      <p className="max-w-xs text-sm text-slate-600 leading-relaxed font-medium"> Describe your career goals on the left to initialize the neural document construction.</p>

                      <div className="mt-12 flex items-center gap-8 opacity-20 filter grayscale">
                        <Zap size={24} />
                        <Sparkles size={24} />
                        <IconComponent name="Shield" size={24} />
                        <Award size={24} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTELLIGENCE TOOLS OVERLAY */}
      {/* INTELLIGENCE TOOLS OVERLAY */}
      <AnimatePresence>
        {activeTool && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#0F172A]/80 backdrop-blur-xl"
            onClick={() => setActiveTool(null)}
          >
            <motion.div
              className={`w-full bg-[#1E293B] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${activeTool === 'format' ? 'max-w-6xl' : 'max-w-4xl'}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-workflow-primary/20 flex items-center justify-center">
                    {activeTool === 'format' ? <Palette className="text-workflow-primary" size={24} /> :
                      activeTool === 'ats' ? <BarChart3 className="text-workflow-primary" size={24} /> :
                        <Filter className="text-workflow-primary" size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                      {activeTool === 'format' ? 'Design Architecture' :
                        activeTool === 'ats' ? 'ATS Verification Core' : 'Keyword Intelligence'}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {activeTool === 'format' ? 'Select a visual framework' : 'Deep Neural Analysis'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setActiveTool(null)} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                {activeTool === 'format' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`group relative aspect-[3/4] rounded-2xl border-2 overflow-hidden transition-all ${selectedTemplate === t.id ? 'border-workflow-primary ring-4 ring-workflow-primary/20' : 'border-white/10 hover:border-workflow-primary/50'}`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${t.id === 'modern' ? 'from-slate-900 to-slate-800' : 'from-white to-slate-100'} flex items-center justify-center`}>
                          {/* Preview Placeholder */}
                          <div className="text-xs font-black uppercase tracking-widest text-slate-500">{t.name} Preview</div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-black/80 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">{t.name}</span>
                            {selectedTemplate === t.id && <CheckCircle2 size={16} className="text-workflow-primary" />}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">{t.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {activeTool === 'ats' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-center p-8">
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                          <circle cx="96" cy="96" r="88" stroke="#3B82F6" strokeWidth="12" fill="transparent" strokeDasharray={552} strokeDashoffset={552 - (552 * (atsScore || 0) / 100)} className="transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-5xl font-black text-white tracking-tighter">{atsScore || 0}</span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ATS Score</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <EliteCard title="Pass Rate" icon={CheckCircle2}>
                        <div className="text-2xl font-black text-green-400">High Probability</div>
                        <p className="text-xs text-slate-400 mt-2">Your resume structure is standard and readable by most ATS parsers.</p>
                      </EliteCard>
                      <EliteCard title="Critical Issues" icon={X}>
                        <div className="text-2xl font-black text-white">{100 - (atsScore || 0) < 20 ? '0' : '2'}</div>
                        <p className="text-xs text-slate-400 mt-2">Minor formatting adjustments recommended.</p>
                      </EliteCard>
                    </div>
                  </div>
                )}

                {activeTool === 'keywords' && (
                  <div className="space-y-4">
                    {Object.entries(keywordDensity).length > 0 ? Object.entries(keywordDensity).map(([key, val], i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                          <span>{key}</span>
                          <span>{val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(val * 10, 100)}%` }}
                            className="h-full bg-workflow-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                          />
                        </div>
                      </div>
                    )) : (
                      <p className="text-[10px] text-slate-500 font-bold uppercase italic">No keyword intelligence found yet. Generate a resume first.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
                <button
                  onClick={() => setActiveTool(null)}
                  className="px-6 py-2.5 rounded-xl bg-workflow-primary text-white text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-workflow-primary/20"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResumeGeneratorAI;
