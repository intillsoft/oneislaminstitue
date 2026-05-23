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
      quote: "Hope Dawah Institute transformed how I study. The structured curriculum and access to verified research is world-class.",
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
          <title>Hope Dawah Institute | Authentic Islamic Curriculum & Research Curation</title>
          <meta name="description" content="Access a structured Islamic curriculum curated from verified sources. Hope Dawah Institute offers a comprehensive gateway to master sacred sciences with academic excellence." />
          <meta name="keywords" content="Islamic Courses, Authentic Islam, Quran, Hadith, Seerah, Fiqh, Islamic Research, Traditional Islamic Knowledge, Muslim Student Platform" />
        </Helmet>
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 transition-colors duration-200">
          {/* Subtle Background - Professional Academic */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
              <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
              <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
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
                  
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight leading-[1.2] sm:leading-[1.1]">
                    The Modern Gateway to <br className="hidden sm:block" />
                    <span className="text-primary">Sacred Knowledge</span>
                  </h1>

                  <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                    Access a structured curriculum curated by a team of learned Muslims from verified platforms like Yaqeen Institute and Towards Eternity. Master the sacred sciences through a cohesive, institutional approach.
                  </p>

                  <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 w-full max-w-sm mx-auto sm:max-w-none">
                    <button 
                      onClick={() => navigate('/courses')}
                      className="flex-1 sm:flex-none sm:w-auto px-2 sm:px-8 py-3.5 sm:py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md sm:rounded-lg font-bold transition-all active:scale-[0.98] text-[10px] sm:text-sm uppercase tracking-wider sm:tracking-widest"
                    >
                      Explore Courses
                    </button>
                    <button 
                      onClick={() => navigate('/team')}
                      className="flex-1 sm:flex-none sm:w-auto px-2 sm:px-8 py-3.5 sm:py-4 bg-card text-foreground border border-border rounded-md sm:rounded-lg font-bold hover:bg-muted transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm uppercase tracking-wider sm:tracking-widest"
                    >
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
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
                    <div className="absolute -inset-1 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    <div className="relative flex items-center bg-card border border-border rounded-xl md:rounded-2xl shadow-card transition-all p-1.5 sm:p-2">
                    <div className="absolute left-4 sm:left-6 text-primary">
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
                      className="w-full pl-12 sm:pl-16 pr-16 sm:pr-32 py-3.5 sm:py-5 bg-transparent border-none rounded-xl focus:ring-0 text-sm sm:text-lg text-foreground placeholder-muted-foreground font-medium"
                    />
                    <button
                      onClick={() => {
                        const query = searchQuery;
                        openPanel(query);
                      }}
                      className="absolute right-2 top-2 bottom-2 px-4 sm:px-6 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-primary-hover transition-all active:scale-95"
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
                        className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-foreground rounded-lg text-xs font-semibold hover:bg-muted hover:border-border hover:text-primary transition-all hover:-translate-y-0.5 shadow-sm"
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
            <section className="py-16 sm:py-24 bg-card border-y border-border relative overflow-hidden transition-colors duration-200">
               <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                 <div className="text-center mb-16 max-w-3xl mx-auto">
                   <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                     The Standard of <span className="text-primary">Authentic Synthesis</span>
                   </h2>
                   <p className="text-lg text-muted-foreground leading-relaxed">
                     We aggregate the best of Islamic research and design it into a seamless learning experience.
                   </p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {[
                     {
                       icon: Shield,
                       title: "Verified Sources",
                       desc: "Our team sources content from authentic platforms including Yaqeen and Towards Eternity, ensuring every lesson is grounded in the Quran and Sunnah.",
                       color: "blue"
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
                       className="group relative p-8 rounded-2xl bg-gradient-to-br from-[#005A9E] to-[#0078D4] text-white border border-white/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
                      >
                         <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/15 group-hover:scale-110 transition-transform duration-500">
                           <item.icon className="w-7 h-7 text-white" />
                         </div>
                         <h3 className="text-xl font-bold text-white mb-3 transition-colors">
                           {item.title}
                         </h3>
                         <p className="text-blue-100 leading-relaxed">
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
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">Recommended Courses</h2>
                  <p className="text-muted-foreground">Handpicked curriculum based on your academic interests</p>
                </div>
                <button 
                  onClick={() => navigate('/courses')} 
                  className="text-primary font-bold flex items-center gap-2 group text-sm"
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
            <section className="py-16 sm:py-24 bg-gradient-to-br from-[#0B0F2A] via-[#005A9E] to-[#0078D4] text-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                       <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Curriculum Roadmap</span>
                       <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Structured Knowledge Paths</h2>
                       <p className="text-blue-100 text-lg">
                         Stop guessing where to start. Follow a clear, scholar-designed roadmap from basics to mastery.
                       </p>
                    </div>
                    <button onClick={() => navigate('/courses')} className="px-6 py-3 bg-white border border-white/20 rounded-xl font-bold text-[#005A9E] hover:bg-blue-50 transition-all shadow-xl hover:shadow-white/5">
                      View All Paths
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-white/10 via-white/20 to-white/10 -translate-y-1/2 z-0" />
                    
                    {[
                      {
                        level: "Level 1",
                        title: "The Foundations",
                        subtitle: "Fard 'Ayn",
                        desc: "Essential knowledge every believer must know. covering purity, prayer, and basic creed.",
                        icon: BookOpen,
                        color: "blue",
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
                        className="relative z-10 bg-card/95 backdrop-blur-md p-8 rounded-2xl border border-border/50 shadow-xl flex flex-col items-start h-full hover:-translate-y-2 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 }}
                      >
                         <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4 border border-primary/20">
                           {path.level}
                         </span>
                         <h3 className="text-2xl font-bold text-foreground mb-1">{path.title}</h3>
                         <p className="text-sm font-bold text-primary uppercase tracking-wider mb-4">{path.subtitle}</p>
                         <p className="text-muted-foreground mb-8 leading-relaxed flex-grow">
                           {path.desc}
                         </p>
                         <div className="w-full mt-auto pt-6 border-t border-border flex items-center justify-between">
                            <path.icon className="text-primary" size={20} />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{path.status}</span>
                         </div>
                      </motion.div>
                    ))}
                 </div>
              </div>
            </section>



            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-8 border border-border">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <blockquote className="text-lg sm:text-xl md:text-3xl font-medium text-foreground leading-relaxed tracking-tight max-w-2xl mx-auto px-4 italic">
                    "{testimonials[testimonialIndex].quote}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
                      {testimonials[testimonialIndex].avatar}
                    </div>
                    <div className="text-left">
                      <p className="text-foreground font-bold text-sm">{testimonials[testimonialIndex].author}</p>
                      <p className="text-muted-foreground text-xs">{testimonials[testimonialIndex].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </section>


          </main>
          <Footer />
        </div>
    </div>
  );
};

export default HomePage;
