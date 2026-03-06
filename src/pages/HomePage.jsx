import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  Search, Mic, Send, ArrowRight, ChevronLeft, ChevronRight,
  Briefcase, Users, TrendingUp, Award, Sparkles,
  Star, CheckCircle2, ArrowUpRight, Clock, MapPin, DollarSign,
  MessageCircle, Zap, MessageSquare, FileText, List,
  Plus, SquarePen, ChevronDown, ArrowUp, Copy, Check, Edit3, RotateCcw, Brain, BookOpen,
  Shield, Globe, GraduationCap, Layers, ArrowRightCircle, PlayCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuthContext } from '../contexts/AuthContext';
import { courseService } from '../services/jobService';
import { enrollmentService } from '../services/applicationService';
import { apiService } from '../lib/api';
import AISearchBox from '../components/ui/AISearchBox';
import VoiceSearch from '../components/ui/VoiceSearch';
import Footer from '../components/ui/Footer';
import Image from '../components/AppImage';
import FeaturedCourseCard from './HomePage/components/FeaturedCourseCard';
import RecommendedCoursesSection from './HomePage/components/RecommendedCoursesSection';
import RecommendedTalentSection from './HomePage/components/RecommendedTalentSection';
import Header from '../components/ui/Header';
import { useAIPanel } from '../contexts/AIPanelContext';
import { renderMarkdown } from '../utils/markdownRenderer';
import { Helmet } from 'react-helmet';
import './HomePage.css';

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        const currentCount = Math.floor(progress * value);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// Format time ago helper
const formatTimeAgo = (date) => {
  if (!date) return 'recently';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return 'recently';
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState('search'); // 'search' or 'chat'
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);
  const { user } = useAuthContext();
  const { openPanel } = useAIPanel();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredTalents, setFeaturedTalents] = useState([]);
  const [stats] = useState([
    { number: 50000, label: 'Successful Graduates', suffix: '+' },
    { number: 95, label: 'Academic Achievement', suffix: '%' },
    { number: 1000, label: 'Institutions Trust Us', suffix: '+' },
    { number: 99, label: 'Platform Uptime', suffix: '%' },
  ]);
  const [testimonials] = useState([
    {
      quote: "One Islam Institute transformed how I study. The structured curriculum and access to verified research is world-class.",
      author: "Sarah Chen",
      role: "Theology Student",
      rating: 5,
      avatar: "SC"
    },
    {
      quote: "The curation team has done a remarkable job structuring complex concepts. The 'Lesson Architect' makes navigation seamless.",
      author: "Michael Rodriguez",
      role: "Lead Researcher",
      rating: 5,
      avatar: "MR"
    },
    {
      quote: "The modular lesson blocks helped me master complex subjects at my own pace. Highly recommended!",
      author: "Emily Johnson",
      role: "Graduate Student",
      rating: 5,
      avatar: "EJ"
    }
  ]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const heroRef = useRef(null);

  // Fetch featured courses for the homepage
  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const result = await courseService.getAll({ 
          pageSize: 4,
          sortBy: 'created_at',
          sortOrder: 'desc'
        });
        if (result.data) {
          setFeaturedJobs(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch featured courses:', err);
      }
    };
    fetchFeaturedCourses();
  }, []);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const response = await apiService.get('/chat/history');
        if (response.data?.success && response.data.data?.messages) {
          setChatMessages(response.data.data.messages);
        }
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
      }
    };
    fetchHistory();
  }, [user?.id]);

  const handleClearChat = async () => {
    setChatMessages([]);
    try {
      await apiService.post('/chat/history', { messages: [] });
    } catch (err) {
      console.error('Failed to clear chat history:', err);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleEditMessage = (id, newContent) => {
    setChatMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, content: newContent } : msg
    ));
    // Optionally trigger a re-send here if desired, 
    // but for now just update the UI
  };

  const handleChatMessage = async (overrideQuery = null) => {
    const queryToUse = overrideQuery || searchQuery;
    if (!queryToUse.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: queryToUse,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setSearchQuery('');
    setIsChatLoading(true);

    try {
      const response = await apiService.post('/ai/career/chat', {
        message: queryToUse,
        conversation_history: chatMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      const responseData = response.data?.data || response.data;
      const jobsToShow = responseData.jobs || responseData.similarJobs || [];

      // Simulated "Typing" or "Streaming" delay for Elite feel
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseData.response || responseData.data?.response || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        jobs: jobsToShow,
        hasExactMatches: responseData.hasExactMatches || false,
      };

      // Add a slight delay for realism and auto-save
      await new Promise(r => setTimeout(r, 600));

      setChatMessages(prev => {
        const updated = [...prev, aiResponse];
        // Persistent save
        apiService.post('/chat/history', { messages: updated.slice(-50) }).catch(console.error);
        return updated;
      });
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = {
        role: 'assistant',
        content: `I'm having trouble connecting right now. ${error.message || 'Please try again in a moment.'}`,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSearch = async (overrideQuery = null) => {
    // Determine the query, checking if overrideQuery is passed explicitly as a string
    const queryToUse = typeof overrideQuery === 'string' ? overrideQuery : searchQuery;
    if (!queryToUse.trim()) return;

    // Navigate to AI Chat page with the query
    navigate(`/aichat?q=${encodeURIComponent(queryToUse)}`);
  };

  const enhanceSearchQuery = async (query) => {
    try {
      if (query.length > 20 && (query.includes('find') || query.includes('looking for'))) {
        return query;
      }
      const response = await apiService.post('/ai/enhance-search', {
        query: query.trim(),
        context: 'job_search'
      });
      return response.data?.enhancedQuery || query;
    } catch (error) {
      return query;
    }
  };

  useEffect(() => {
    if (searchMode === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, searchMode]);

  const quickFilters = [
    'Remote Jobs', 'Full-time', 'Part-time', 'Contract',
    'React Developer', 'Python Developer', 'Data Scientist', 'UI/UX Designer'
  ];

  return (
    <div className="homepage-container">
        <Helmet>
          <title>One Islam Institute | Authentic Islamic Curriculum & Research Curation</title>
          <meta name="description" content="Access a structured Islamic curriculum curated from verified sources. One Islam Institute offers a comprehensive gateway to master sacred sciences with academic excellence." />
          <meta name="keywords" content="Islamic Courses, Authentic Islam, Quran, Hadith, Seerah, Fiqh, Islamic Research, Traditional Islamic Knowledge, Muslim Student Platform" />
        </Helmet>
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A1120] selection:bg-emerald-500/30">
          {/* Subtle Background - Professional Academic */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
              <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
              <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>
          </div>

          <main className="relative z-10">
            <section className="pt-32 pb-16 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-6 border border-emerald-100 dark:border-emerald-500/20">
                    Trusted by 10,000+ Students Worldwide
                  </span>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight leading-[1.2] sm:leading-[1.1]">
                    The Modern Gateway to <br className="hidden sm:block" />
                    <span className="text-emerald-600 dark:text-emerald-500">Sacred Knowledge</span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                    Access a structured curriculum curated by a team of learned Muslims from verified platforms like Yaqeen Institute and Towards Eternity. Master the sacred sciences through a cohesive, institutional approach.
                  </p>

                  <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 w-full max-w-sm mx-auto sm:max-w-none">
                    <button 
                      onClick={() => navigate('/courses')}
                      className="flex-1 sm:flex-none sm:w-auto px-2 sm:px-8 py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl sm:rounded-2xl font-black transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] text-[10px] sm:text-sm uppercase tracking-wider sm:tracking-widest"
                    >
                      Explore Courses
                    </button>
                    <button 
                      onClick={() => navigate('/team')}
                      className="flex-1 sm:flex-none sm:w-auto px-2 sm:px-8 py-3.5 sm:py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl font-black hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm uppercase tracking-wider sm:tracking-widest"
                    >
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                      Join Team
                    </button>
                  </div>
                </motion.div>

                {/* AI Search Box - The Elite Standard */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="relative mt-10 md:mt-16 group">
                    <div className="absolute -inset-1 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    <div className="relative flex items-center bg-white dark:bg-slate-900/80 backdrop-blur-3xl border border-border dark:border-emerald-500/20 rounded-2xl md:rounded-3xl shadow-2xl transition-all p-1.5 sm:p-2">
                    <div className="absolute left-4 sm:left-6 text-emerald-600">
                      <Zap className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const query = searchQuery;
                          openPanel(query);
                        }
                      }}
                      placeholder="Ask the Assistant anything..."
                      className="w-full pl-12 sm:pl-16 pr-16 sm:pr-32 py-3.5 sm:py-5 bg-transparent border-none rounded-2xl focus:ring-0 text-sm sm:text-lg text-slate-900 dark:text-white placeholder-slate-400 font-medium"
                    />
                    <button
                      onClick={() => {
                        const query = searchQuery;
                        openPanel(query);
                      }}
                      className="absolute right-2 top-2 bottom-2 px-4 sm:px-6 flex items-center justify-center gap-2 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-emerald-800 dark:hover:bg-emerald-500 transition-all active:scale-95 shadow-lg"
                    >
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>  
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    {[
                      { icon: BookOpen, text: 'Explain the basics of Fiqh' },
                      { icon: Layers, text: 'Recommend a learning path' },
                      { icon: Sparkles, text: 'What is the Seerah?' }
                    ].map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => { 
                          openPanel(tag.text); 
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all hover:-translate-y-0.5 shadow-sm"
                      >
                        <tag.icon className="w-4 h-4 opacity-70" />
                        {tag.text}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* NEW SECTION 1: THE ELITE STANDARD */}
            <section className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                 <div className="text-center mb-16 max-w-3xl mx-auto">
                   <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                     The Standard of <span className="text-emerald-600 dark:text-emerald-500">Authentic Synthesis</span>
                   </h2>
                   <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                     We aggregate the best of Islamic research and design it into a seamless learning experience.
                   </p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {[
                     {
                       icon: Shield,
                       title: "Verified Sources",
                       desc: "Our team sources content from authentic platforms including Yaqeen and Towards Eternity, ensuring every lesson is grounded in the Quran and Sunnah.",
                       color: "emerald"
                     },
                     {
                       icon: Users,
                       title: "Learned Curation",
                       desc: "Managed by a dedicated team of learned Muslims who structure complex topics into digestible modules.",
                       color: "blue"
                     },
                     {
                       icon: Zap,
                       title: "Structured Navigation",
                       desc: "A clear roadmap from foundations to mastery, with progress tracking.",
                       color: "amber" // Changed to amber/gold for premium feel
                     }
                   ].map((item, idx) => (
                     <motion.div
                       key={idx}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: idx * 0.2 }}
                       className="group relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500"
                     >
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-${item.color}-500/10 group-hover:scale-110 transition-transform duration-500`}>
                         <item.icon className={`w-7 h-7 text-${item.color}-600 dark:text-${item.color}-400`} />
                       </div>
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                         {item.title}
                       </h3>
                       <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                         {item.desc}
                       </p>
                     </motion.div>
                   ))}
                 </div>
               </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Recommended Courses</h2>
                  <p className="text-slate-500 dark:text-slate-400">Handpicked curriculum based on your academic interests</p>
                </div>
                <button 
                  onClick={() => navigate('/courses')} 
                  className="text-emerald-600 dark:text-emerald-500 font-bold flex items-center gap-2 group text-sm"
                >
                  Browse all modules <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-2 sm:px-0">
                {featuredJobs.map((job, index) => (
                  <FeaturedCourseCard key={job.id} job={job} index={index} />
                ))}
              </div>
            </section>

            {/* NEW SECTION 2: STRUCTURED KNOWLEDGE PATHS */}
            <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0B1221] relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                       <span className="text-emerald-600 dark:text-emerald-500 font-bold tracking-widest uppercase text-xs mb-2 block">Curriculum Roadmap</span>
                       <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Structured Knowledge Paths</h2>
                       <p className="text-slate-600 dark:text-slate-400 text-lg">
                         Stop guessing where to start. Follow a clear, scholar-designed roadmap from basics to mastery.
                       </p>
                    </div>
                    <button onClick={() => navigate('/courses')} className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                      View All Paths
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-amber-500/20 -translate-y-1/2 z-0" />
                    
                    {[
                      {
                        level: "Level 1",
                        title: "The Foundations",
                        subtitle: "Fard 'Ayn",
                        desc: "Essential knowledge every believer must know. covering purity, prayer, and basic creed.",
                        icon: BookOpen,
                        color: "emerald",
                        status: "Open"
                      },
                      {
                        level: "Level 2",
                        title: "The Seeker",
                        subtitle: "Intermediate Studies",
                        desc: "Deepen your understanding with Fiqh of transactions, Seerah analysis, and Quranic Arabic.",
                        icon: Layers,
                        color: "blue",
                        status: "Requires Level 1"
                      },
                      {
                        level: "Level 3",
                        title: "The Scholar",
                        subtitle: "Advanced Specialization",
                        desc: "Mastery modules in Usul al-Fiqh, Hadith sciences, and advanced theology.",
                        icon: GraduationCap,
                        color: "amber",
                        status: "Locked"
                      }
                    ].map((path, idx) => (
                      <motion.div
                        key={idx}
                        className="relative z-10 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-start h-full hover:-translate-y-2 transition-transform duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 }}
                      >
                         <span className={`inline-block px-3 py-1 rounded-full bg-${path.color}-50 dark:bg-${path.color}-500/10 text-${path.color}-700 dark:text-${path.color}-400 text-[10px] font-bold uppercase tracking-widest mb-4 border border-${path.color}-100 dark:border-${path.color}-500/20`}>
                           {path.level}
                         </span>
                         <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{path.title}</h3>
                         <p className={`text-sm font-bold text-${path.color}-600 dark:text-${path.color}-500 uppercase tracking-wider mb-4`}>{path.subtitle}</p>
                         <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed flex-grow">
                           {path.desc}
                         </p>
                         <div className="w-full mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <path.icon className={`text-${path.color}-500`} size={20} />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{path.status}</span>
                         </div>
                      </motion.div>
                    ))}
                 </div>
              </div>
            </section>

            <section className="py-12 sm:py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
                  {[
                    { number: 50, suffix: "+", label: "Professional Courses" },
                    { number: 12, suffix: "k", label: "Registered Students" },
                    { number: 25, suffix: "+", label: "Curation Experts" },
                    { number: 98, suffix: "%", label: "Course Completion" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 sm:mb-2">
                        <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                      </div>
                      <p className="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest sm:tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 mb-8 border border-emerald-100 dark:border-emerald-500/20">
                <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <blockquote className="text-lg sm:text-xl md:text-3xl font-medium text-slate-900 dark:text-white leading-relaxed tracking-tight max-w-2xl mx-auto px-4 italic">
                    "{testimonials[testimonialIndex].quote}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                      {testimonials[testimonialIndex].avatar}
                    </div>
                    <div className="text-left">
                      <p className="text-slate-900 dark:text-white font-bold text-sm">{testimonials[testimonialIndex].author}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">{testimonials[testimonialIndex].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </section>

            {/* NEW SECTION 3: GLOBAL SCHOLARSHIP NETWORK */}
            <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
               {/* Decorative background elements */}
               <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed" />
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[128px] pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />

               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div>
                        <motion.div
                           initial={{ opacity: 0, scale: 0.9 }}
                           whileInView={{ opacity: 1, scale: 1 }}
                           viewport={{ once: true }}
                        >
                           <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
                              Join a Global <br className="hidden sm:block" />
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Network of Seekers</span>
                           </h2>
                           <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-lg">
                              Knowledge increases when shared. Connect with students from over 40 countries, participate in live colloquiums, and contribute to the revival of Islamic intellectual tradition.
                           </p>
                           
                           <div className="flex flex-col sm:flex-row gap-4">
                              <button 
                                onClick={() => navigate('/register')}
                                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                              >
                                Join the Institute <ArrowUpRight size={18} />
                              </button>
                              <button 
                                onClick={() => navigate('/community')}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                              >
                                <Globe size={18} className="text-blue-400" /> Explore Impact
                              </button>
                           </div>

                           <div className="mt-12 flex items-center gap-4 text-sm font-medium text-slate-400">
                              <div className="flex -space-x-3">
                                 {[1,2,3,4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs text-white box-content">
                                       <Users size={14} />
                                    </div>
                                 ))}
                              </div>
                              <span>Joined by 500+ scholars this week</span>
                           </div>
                        </motion.div>
                     </div>

                     <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                           <motion.div 
                              className="space-y-4 translate-y-8"
                              initial={{ opacity: 0, y: 40 }}
                              whileInView={{ opacity: 1, y: 32 }} // keep translate-y-8 (approx 32px)
                              viewport={{ once: true }}
                              transition={{ duration: 0.7 }}
                           >
                              <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                                 <Globe className="w-8 h-8 text-blue-400 mb-4" />
                                 <h3 className="text-xl font-bold mb-1">Global Reach</h3>
                                 <p className="text-sm text-slate-400">Students accessing knowledge from 6 continents.</p>
                              </div>
                              <div className="p-6 bg-emerald-600/10 backdrop-blur-md rounded-2xl border border-emerald-500/20">
                                 <Award className="w-8 h-8 text-emerald-400 mb-4" />
                                 <h3 className="text-xl font-bold mb-1">Accredited</h3>
                                 <p className="text-sm text-slate-400">Recognized certifications upon course completion.</p>
                              </div>
                           </motion.div>
                           <motion.div 
                              className="space-y-4"
                              initial={{ opacity: 0, y: 40 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.7, delay: 0.2 }}
                           >
                              <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                                 <MessageCircle className="w-8 h-8 text-amber-400 mb-4" />
                                 <h3 className="text-xl font-bold mb-1">Community</h3>
                                 <p className="text-sm text-slate-400">Vibrant discussion forums and study groups.</p>
                              </div>
                              <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                                 <PlayCircle className="w-8 h-8 text-rose-400 mb-4" />
                                 <h3 className="text-xl font-bold mb-1">Live Events</h3>
                                 <p className="text-sm text-slate-400">Weekly webinars with guest speakers.</p>
                              </div>
                           </motion.div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
          </main>
          <Footer />
        </div>
    </div>
  );
};

export default HomePage;
