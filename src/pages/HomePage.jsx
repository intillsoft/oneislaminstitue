import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  Search, Mic, Send, ArrowRight, ChevronLeft, ChevronRight,
  Briefcase, Users, TrendingUp, Award, Sparkles,
  Star, CheckCircle2, ArrowUpRight, Clock, MapPin, DollarSign,
  MessageCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuthContext } from '../contexts/AuthContext';
import { jobService } from '../services/jobService';
import { talentService } from '../services/talentService';
import { apiService } from '../lib/api';
import VoiceSearch from '../components/ui/VoiceSearch';
import Footer from '../components/ui/Footer';
import Image from '../components/AppImage';
import RecommendedJobsSections from './HomePage/components/RecommendedJobsSections';
import Header from '../components/ui/Header';
import { renderMarkdown } from '../utils/markdownRenderer';
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
  const chatEndRef = useRef(null);
  const { user } = useAuthContext();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredTalents, setFeaturedTalents] = useState([]);
  const [stats] = useState([
    { number: 50000, label: 'Successful Matches', suffix: '+' },
    { number: 95, label: 'User Satisfaction', suffix: '%' },
    { number: 1000, label: 'Companies Trust Us', suffix: '+' },
    { number: 99, label: 'Platform Uptime', suffix: '%' },
  ]);
  const [testimonials] = useState([
    {
      quote: "Workflow transformed how I find jobs. The AI matching is incredibly accurate and saves me hours of searching.",
      author: "Sarah Chen",
      role: "Software Engineer",
      rating: 5,
      avatar: "SC"
    },
    {
      quote: "As a recruiter, I've never found better talent faster. The platform's intelligent matching is a game-changer.",
      author: "Michael Rodriguez",
      role: "HR Director",
      rating: 5,
      avatar: "MR"
    },
    {
      quote: "The talent marketplace helped me find the perfect freelancer for my project. Highly recommended!",
      author: "Emily Johnson",
      role: "Project Manager",
      rating: 5,
      avatar: "EJ"
    },
    {
      quote: "The AI resume generator created a professional resume that got me multiple interviews within a week!",
      author: "David Kim",
      role: "Frontend Developer",
      rating: 5,
      avatar: "DK"
    },
    {
      quote: "Career advisor gave me insights I never considered. My job search strategy improved dramatically.",
      author: "Lisa Anderson",
      role: "Product Manager",
      rating: 5,
      avatar: "LA"
    },
    {
      quote: "The skill analysis feature helped me identify exactly what I needed to learn to advance my career.",
      author: "James Wilson",
      role: "Data Scientist",
      rating: 5,
      avatar: "JW"
    },
    {
      quote: "As a startup founder, finding the right talent was challenging until I discovered Workflow. Game changer!",
      author: "Maria Garcia",
      role: "Startup Founder",
      rating: 5,
      avatar: "MG"
    },
    {
      quote: "The job recommendations are spot-on. Every suggestion matched my skills and career goals perfectly.",
      author: "Robert Taylor",
      role: "DevOps Engineer",
      rating: 5,
      avatar: "RT"
    },
    {
      quote: "I love how the platform learns my preferences and shows me increasingly relevant opportunities.",
      author: "Jennifer Martinez",
      role: "UX Designer",
      rating: 5,
      avatar: "JM"
    },
    {
      quote: "The application tracking feature keeps me organized and never miss a follow-up. Essential tool!",
      author: "Christopher Lee",
      role: "Backend Developer",
      rating: 5,
      avatar: "CL"
    },
    {
      quote: "Workflow's AI understands context better than any other platform. It's like having a career coach!",
      author: "Amanda White",
      role: "Marketing Manager",
      rating: 5,
      avatar: "AW"
    },
    {
      quote: "The salary predictions helped me negotiate a better offer. I got 20% more than I expected!",
      author: "Daniel Brown",
      role: "Senior Engineer",
      rating: 5,
      avatar: "DB"
    }
  ]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const searchRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Load featured jobs and talents
  useEffect(() => {
    loadFeaturedJobs();
    loadFeaturedTalents();
  }, []);

  // Load chat history when entering chat mode
  useEffect(() => {
    if (searchMode === 'chat' && user) {
      loadChatHistory();
    }
  }, [searchMode, user]);

  // Save chat history when messages change
  useEffect(() => {
    if (searchMode === 'chat' && user && chatMessages.length > 0) {
      const timeoutId = setTimeout(() => {
        saveChatHistory();
      }, 1000); // Debounce saves
      return () => clearTimeout(timeoutId);
    }
  }, [chatMessages, searchMode, user]);

  const loadChatHistory = async () => {
    try {
      const response = await apiService.ai.getChatHistory({ chat_type: 'homepage' });
      if (response.data?.data?.messages && response.data.data.messages.length > 0) {
        setChatMessages(response.data.data.messages);
      }
    } catch (error) {
      console.log('No chat history found or error loading:', error);
    }
  };

  const saveChatHistory = async () => {
    try {
      await apiService.ai.saveChatHistory({
        chat_type: 'homepage',
        messages: chatMessages,
      });
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const loadFeaturedJobs = async () => {
    try {
      const result = await jobService.getAll({
        pageSize: 6,
        sortBy: 'created_at',
        sortOrder: 'desc'
      });
      setFeaturedJobs(result.data || []);
    } catch (error) {
      console.error('Error loading featured jobs:', error);
    }
  };

  const loadFeaturedTalents = async () => {
    try {
      const gigs = await talentService.getGigs({ is_active: true });
      if (Array.isArray(gigs)) {
        setFeaturedTalents(gigs.slice(0, 6));
      } else {
        setFeaturedTalents([]);
      }
    } catch (error) {
      console.error('Error loading featured talents:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    if (searchMode === 'chat') {
      // Chat mode - respond in the interface
      await handleChatMessage();
    } else {
      // Search mode - navigate to search results
      setIsSearching(true);
      try {
        // Show AI processing state
        // Navigate to AI search results page with enhanced query processing
        const enhancedQuery = await enhanceSearchQuery(searchQuery);
        navigate(`/jobs/search-results?q=${encodeURIComponent(enhancedQuery)}`);
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to direct navigation
        navigate(`/jobs/search-results?q=${encodeURIComponent(searchQuery)}`);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleChatMessage = async () => {
    if (!searchQuery.trim()) return;

    const userMessage = {
      role: 'user',
      content: searchQuery,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentQuery = searchQuery;
    setSearchQuery('');
    setIsChatLoading(true);

    try {
      // Always use the career chat endpoint - it handles job searches internally
      const response = await apiService.post('/ai/career/chat', {
        message: currentQuery,
        conversation_history: chatMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      const responseData = response.data?.data || response.data;
      const jobsToShow = responseData.jobs || responseData.similarJobs || [];

      const aiResponse = {
        role: 'assistant',
        content: responseData.response || responseData.data?.response || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        jobs: jobsToShow, // Include jobs for display
        hasExactMatches: responseData.hasExactMatches || false,
      };

      setChatMessages(prev => [...prev, aiResponse]);
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

  const handleJobSearchInChat = async (query) => {
    try {
      // Use AI to search for jobs
      const response = await apiService.post('/ai/search/all', {
        query: query,
        filters: {}
      });

      const jobs = response.data?.data?.jobs || response.data?.jobs || [];
      const explanation = response.data?.data?.explanation || response.data?.explanation || '';

      if (jobs.length > 0) {
        // Format jobs for display
        const jobsList = jobs.slice(0, 5).map((job, index) => {
          const locationText = job.location ? `📍 ${job.location}` : '';
          const salaryText = job.salary_range ? ` | 💰 ${job.salary_range}` : '';
          const descText = job.description ? job.description.substring(0, 150) + '...' : '';
          return `${index + 1}. **${job.title}** at ${job.company || 'Company'}\n   ${locationText}${salaryText}\n   ${descText}`;
        }).join('\n\n');

        const jobCountText = jobs.length > 1 ? 's' : '';
        const moreJobsText = jobs.length > 5 ? `\n*Showing top 5 results. There are ${jobs.length - 5} more jobs available.*` : '';
        const defaultExplanation = `I found ${jobs.length} job${jobCountText} matching your search on Workflow:\n\n${jobsList}\n\n${moreJobsText}\n\nWould you like me to show more details about any of these positions, or refine your search?`;

        const aiResponse = {
          role: 'assistant',
          content: explanation || defaultExplanation,
          timestamp: new Date(),
          jobs: jobs.slice(0, 5), // Store jobs for potential interaction
        };

        setChatMessages(prev => [...prev, aiResponse]);
      } else {
        const aiResponse = {
          role: 'assistant',
          content: `I searched our Workflow job database, but couldn't find any jobs matching "${query}".\n\nLet me help you:\n- Try different keywords (e.g., "React developer", "Python engineer")\n- Be more specific about location or job type\n- I can also help you improve your profile to match available positions\n\nWould you like me to search with different terms or help you in another way?`,
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Job search error:', error);
      const aiResponse = {
        role: 'assistant',
        content: `I encountered an issue searching for jobs. Please try rephrasing your request or use the Search Mode to browse our job listings directly.`,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }
  };

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (searchMode === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, searchMode]);

  // Enhance search query with AI understanding
  const enhanceSearchQuery = async (query) => {
    try {
      // If query is already a natural language prompt, use it directly
      if (query.length > 20 && (query.includes('find') || query.includes('looking for') || query.includes('need') || query.includes('want'))) {
        return query; // Already a prompt
      }

      // For shorter queries, enhance with context
      const response = await apiService.post('/ai/enhance-search', {
        query: query.trim(),
        context: 'job_search'
      });

      if (response.data?.enhancedQuery) {
        return response.data.enhancedQuery;
      }

      return query;
    } catch (error) {
      console.error('Error enhancing query:', error);
      return query; // Return original if enhancement fails
    }
  };

  // Generate AI suggestions as user types
  useEffect(() => {
    if (searchQuery.length > 3 && !isSearching) {
      const timer = setTimeout(async () => {
        try {
          const response = await apiService.post('/ai/search-suggestions', {
            query: searchQuery,
            limit: 5
          });

          if (response.data?.suggestions) {
            setSuggestions(response.data.suggestions);
          }
        } catch (error) {
          // Silently fail - suggestions are optional
          console.log('Suggestions not available');
        }
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, isSearching]);

  const handleVoiceTranscript = (transcript) => {
    setSearchQuery(transcript);
    setTimeout(() => {
      handleSearch();
    }, 500);
  };

  const quickFilters = [
    'Remote Jobs',
    'Full-time',
    'Part-time',
    'Contract',
    'React Developer',
    'Python Developer',
    'Data Scientist',
    'UI/UX Designer'
  ];

  const steps = [
    {
      number: 1,
      icon: Search,
      title: 'Search with AI',
      description: 'Describe what you\'re looking for in natural language. Our AI understands your needs and finds the perfect matches.'
    },
    {
      number: 2,
      icon: Briefcase,
      title: 'Browse Opportunities',
      description: 'Explore thousands of jobs and talent profiles. Filter by skills, location, salary, and more.'
    },
    {
      number: 3,
      icon: Users,
      title: 'Connect & Apply',
      description: 'Connect with recruiters or talents. Apply to jobs or hire freelancers with one click.'
    },
    {
      number: 4,
      icon: Award,
      title: 'Get Hired',
      description: 'Land your dream job or find the perfect talent. Track applications and manage everything in one place.'
    }
  ];

  return (
    <div className="homepage-container">
      {/* Full ChatGPT Interface - Chat Mode */}
      {searchMode === 'chat' ? (
        <div className="chatgpt-full-interface">
          {/* Header - Always visible in chat mode */}
          <Header />

          {/* Floating Switch to Search Button */}
          <motion.button
            onClick={() => {
              setSearchMode('search');
              setChatMessages([]);
            }}
            className="chatgpt-floating-switch"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={18} />
            <span>Switch to Search</span>
          </motion.button>

          {/* Chat Messages Area */}
          <div className="chatgpt-messages-container" ref={chatEndRef}>
            {chatMessages.length === 0 ? (
              <div className="chatgpt-welcome-screen">
                <motion.div
                  className="chatgpt-welcome-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="chatgpt-welcome-icon-wrapper">
                    <Sparkles size={64} className="chatgpt-welcome-icon" />
                    <div className="chatgpt-welcome-glow"></div>
                  </div>
                  <h1 className="chatgpt-welcome-title">How can I help you today?</h1>
                  <p className="chatgpt-welcome-subtitle">
                    I'm Workflow AI, your intelligent assistant for finding jobs, improving your career,
                    and navigating our platform. Ask me anything!
                  </p>
                  <div className="chatgpt-suggestions-grid">
                    <motion.button
                      className="chatgpt-suggestion-card"
                      onClick={() => {
                        setSearchQuery("Find software developer jobs for me");
                        setTimeout(() => handleChatMessage(), 100);
                      }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Search size={20} />
                      <div>
                        <h3>Find Jobs</h3>
                        <p>Search for software developer positions</p>
                      </div>
                    </motion.button>
                    <motion.button
                      className="chatgpt-suggestion-card"
                      onClick={() => {
                        setSearchQuery("How do I improve my resume?");
                        setTimeout(() => handleChatMessage(), 100);
                      }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sparkles size={20} />
                      <div>
                        <h3>Resume Help</h3>
                        <p>Get AI-powered resume advice</p>
                      </div>
                    </motion.button>
                    <motion.button
                      className="chatgpt-suggestion-card"
                      onClick={() => {
                        setSearchQuery("What skills are in demand right now?");
                        setTimeout(() => handleChatMessage(), 100);
                      }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <TrendingUp size={20} />
                      <div>
                        <h3>Career Trends</h3>
                        <p>Discover in-demand skills</p>
                      </div>
                    </motion.button>
                    <motion.button
                      className="chatgpt-suggestion-card"
                      onClick={() => {
                        setSearchQuery("Tell me about Workflow's features");
                        setTimeout(() => handleChatMessage(), 100);
                      }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Award size={20} />
                      <div>
                        <h3>Platform Guide</h3>
                        <p>Learn about Workflow features</p>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="chatgpt-messages-list">
                {chatMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`chatgpt-message ${message.role === 'user' ? 'user' : 'assistant'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message.role === 'assistant' && (
                      <div className="chatgpt-avatar">
                        <Sparkles size={20} />
                      </div>
                    )}
                    <div className="chatgpt-message-content">
                      <div
                        className="chatgpt-message-text"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(message.content)
                        }}
                        onClick={(e) => {
                          // Handle internal link clicks
                          const link = e.target.closest('.markdown-link-internal');
                          if (link) {
                            e.preventDefault();
                            const href = link.getAttribute('href') || link.getAttribute('data-internal-link');
                            if (href) {
                              navigate(href);
                            }
                          }
                        }}
                      />
                      {message.jobs && message.jobs.length > 0 && (
                        <div className="chatgpt-job-cards">
                          {message.jobs.map((job, idx) => (
                            <motion.div
                              key={job.id || idx}
                              className="chatgpt-job-card"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              onClick={() => navigate(`/jobs/detail?id=${job.id}`)}
                              whileHover={{ scale: 1.02, y: -2 }}
                            >
                              <div className="chatgpt-job-header">
                                <h4>{job.title}</h4>
                                <span className="chatgpt-job-company">{job.company || 'Company'}</span>
                              </div>
                              <div className="chatgpt-job-meta">
                                {job.location && <span>📍 {job.location}</span>}
                                {job.salary_range && <span>💰 {job.salary_range}</span>}
                              </div>
                              <button className="chatgpt-job-button">View Details →</button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isChatLoading && (
                  <motion.div
                    className="chatgpt-message assistant"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="chatgpt-avatar">
                      <Sparkles size={20} />
                    </div>
                    <div className="chatgpt-message-content">
                      <div className="chatgpt-typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="chatgpt-input-container">
            <div className="chatgpt-input-wrapper">
              <textarea
                className="chatgpt-input"
                placeholder="Message Workflow AI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatMessage();
                  }
                }}
                rows={1}
                style={{
                  minHeight: '24px',
                  maxHeight: '200px',
                  resize: 'none',
                  overflow: 'auto'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
              <motion.button
                className="chatgpt-send-button"
                onClick={handleChatMessage}
                disabled={!searchQuery.trim() || isChatLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={20} />
              </motion.button>
            </div>
            <p className="chatgpt-input-footer">
              Workflow AI can make mistakes. Check important info.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section ref={heroRef} className="hero-section">
            <motion.div
              className="hero-background-decoration"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.03, 0.05, 0.03],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Text Content - First */}
              <motion.h1
                className="hero-headline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Find Your Dream Job or{' '}
                <span className="hero-gradient">Perfect Talent</span>
              </motion.h1>

              <motion.p
                className="hero-subheadline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Powered by AI to match you with the best opportunities.
                Search naturally, discover instantly.
              </motion.p>

              {/* AI Search Bar - Small, Below Text */}
              <motion.div
                className="search-container hero-search-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Mode Toggle */}
                <motion.div
                  className="mode-toggle-container"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <div className="mode-toggle">
                    <button
                      onClick={() => {
                        setSearchMode('search');
                        setChatMessages([]);
                      }}
                      className={`mode-toggle-btn ${searchMode === 'search' ? 'active' : ''}`}
                    >
                      <Search size={16} />
                      <span>Search Mode</span>
                    </button>
                    <button
                      onClick={() => setSearchMode('chat')}
                      className={`mode-toggle-btn ${searchMode === 'chat' ? 'active' : ''}`}
                    >
                      <MessageCircle size={16} />
                      <span>Chat Mode</span>
                    </button>
                  </div>
                </motion.div>

                <div
                  className={`search-box-wrapper ai-powered-search-wrapper ${isSearchFocused ? 'focused' : ''}`}
                  ref={searchRef}
                >
                  {/* AI Badge */}
                  <motion.div
                    className="ai-badge"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Sparkles className="ai-badge-icon" />
                    <span className="ai-badge-text">AI Powered</span>
                  </motion.div>

                  {/* Glowing Effect Container */}
                  <div className="ai-glow-container">
                    <div className="ai-glow ai-glow-1"></div>
                    <div className="ai-glow ai-glow-2"></div>
                    <div className="ai-glow ai-glow-3"></div>
                  </div>

                  <motion.div
                    className={`inline-search-box hero-search-box ai-powered-search ${isSearchFocused ? 'focused' : ''}`}
                    onClick={() => searchRef.current?.querySelector('input')?.focus()}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      animate={isSearchFocused ? { rotate: [0, -10, 10, -10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Search className="search-icon" />
                    </motion.div>
                    <input
                      type="text"
                      className="search-input"
                      placeholder={
                        searchMode === 'chat'
                          ? "Chat with AI: Ask anything about jobs, careers, or opportunities..."
                          : "Ask AI anything: 'I'm looking for remote software engineering jobs in San Francisco with $150k+ salary...'"
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => {
                        // Delay to allow clicking on suggestions
                        setTimeout(() => setIsSearchFocused(false), 200);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                    />

                    {/* AI Suggestions Dropdown - Only show in search mode */}
                    {searchMode === 'search' && suggestions.length > 0 && isSearchFocused && (
                      <motion.div
                        className="ai-suggestions-dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            className="ai-suggestion-item"
                            onClick={() => {
                              setSearchQuery(suggestion);
                              setTimeout(() => handleSearch(), 100);
                            }}
                            whileHover={{ backgroundColor: 'rgba(0, 70, 255, 0.1)' }}
                          >
                            <Sparkles className="suggestion-icon" size={14} />
                            <span>{suggestion}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                    <VoiceSearch
                      onTranscript={handleVoiceTranscript}
                      disabled={isSearching}
                    />
                    <motion.button
                      className="search-send-button ai-send-button"
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() || (isSearching || isChatLoading)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {(isSearching || isChatLoading) ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Send className="send-icon" />
                        </motion.div>
                      ) : (
                        <Send className="send-icon" />
                      )}
                    </motion.button>
                  </motion.div>
                </div>

                {/* Chat Interface - Only show in chat mode */}
                {searchMode === 'chat' && (
                  <motion.div
                    className="homepage-chat-interface"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="chat-messages-container">
                      {chatMessages.length === 0 ? (
                        <div className="chat-welcome-message">
                          <div className="welcome-icon-wrapper">
                            <Sparkles className="welcome-icon" size={56} />
                            <div className="welcome-icon-glow"></div>
                          </div>
                          <h3>Hi! I'm Workflow AI</h3>
                          <p className="welcome-description">
                            I'm your intelligent assistant for finding jobs, improving your career, and navigating Workflow.
                            I can search our job database, provide career advice, help with your resume, and guide you through our platform features.
                          </p>
                          <div className="chat-suggestions">
                            <button onClick={() => setSearchQuery("Find software developer jobs for me")}>
                              🔍 Find software developer jobs
                            </button>
                            <button onClick={() => setSearchQuery("Show me remote React developer positions")}>
                              💼 Show remote React positions
                            </button>
                            <button onClick={() => setSearchQuery("How do I improve my resume?")}>
                              ✍️ Improve my resume
                            </button>
                            <button onClick={() => setSearchQuery("What skills are in demand right now?")}>
                              📈 In-demand skills
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="chat-messages">
                          {chatMessages.map((message, index) => (
                            <motion.div
                              key={index}
                              className={`chat-message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {message.role === 'assistant' && (
                                <div className="ai-avatar">
                                  <Bot size={20} />
                                </div>
                              )}
                              <div className="message-content">
                                <p className="message-text">{message.content}</p>
                                {message.jobs && message.jobs.length > 0 && (
                                  <div className="chat-job-results">
                                    {message.jobs.map((job, idx) => (
                                      <motion.div
                                        key={job.id || idx}
                                        className="chat-job-card"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => navigate(`/job-detail-application?id=${job.id}`)}
                                      >
                                        <div className="chat-job-header">
                                          <h4>{job.title}</h4>
                                          <span className="chat-job-company">{job.company || 'Company'}</span>
                                        </div>
                                        <div className="chat-job-details">
                                          {job.location && <span>📍 {job.location}</span>}
                                          {job.salary_range && <span>💰 {job.salary_range}</span>}
                                        </div>
                                        <button className="chat-job-view-btn">View Details →</button>
                                      </motion.div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                          {isChatLoading && (
                            <motion.div
                              className="chat-message ai-message"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <div className="ai-avatar">
                                <Bot size={20} />
                              </div>
                              <div className="message-content">
                                <div className="typing-indicator">
                                  <span></span>
                                  <span></span>
                                  <span></span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          <div ref={chatEndRef} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Quick Filters - Only show in search mode */}
                {searchMode === 'search' && (
                  <div className="quick-filters">
                    {quickFilters.map((filter, index) => (
                      <motion.button
                        key={filter}
                        className="filter-chip"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSearchQuery(filter);
                          setTimeout(() => handleSearch(), 100);
                        }}
                      >
                        {filter}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </section>

          {/* How It Works Section */}
          <section className="how-it-works-section">
            <div className="section-header">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                How It Works
              </motion.h2>
              <motion.p
                className="section-subtitle"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Get started in minutes. Our AI-powered platform makes finding jobs or talent effortless.
              </motion.p>
            </div>

            <div className="steps-container">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    className="step-card"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    <div className="step-number">{step.number}</div>
                    <div className="step-icon-wrapper">
                      <IconComponent className="step-icon" />
                    </div>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Recommended Jobs Sections */}
          <RecommendedJobsSections />

          {/* Featured Jobs Section */}
          <section className="featured-jobs-section">
            <div className="section-header-horizontal">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Featured Jobs
              </motion.h2>
              <motion.button
                className="view-all-button"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                onClick={() => navigate('/jobs')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </motion.button>
            </div>

            <div className="jobs-carousel">
              {featuredJobs.length > 0 ? (
                featuredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    className="job-card"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    onClick={() => navigate(`/job-detail-application?id=${job.id}`)}
                  >
                    <div className="job-card-header">
                      <div className="company-logo-wrapper">
                        <Image
                          src={job.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || 'Company')}&background=0046FF&color=fff&size=128`}
                          alt={`${job.company} logo`}
                          className="company-logo-img"
                        />
                      </div>
                      <div className="job-card-header-text">
                        <h3 className="job-card-title">{job.title || 'Job Title'}</h3>
                        <p className="job-card-company">{job.company || 'Company'}</p>
                      </div>
                    </div>
                    <p className="job-card-description">
                      {job.description ? job.description.substring(0, 100) + '...' : 'No description available'}
                    </p>
                    <div className="job-card-info">
                      {job.location && (
                        <div className="job-info-item">
                          <MapPin size={14} />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.job_type && (
                        <div className="job-info-item">
                          <Clock size={14} />
                          <span>{job.job_type}</span>
                        </div>
                      )}
                      {job.salary_min && (
                        <div className="job-info-item">
                          <DollarSign size={14} />
                          <span>
                            ${job.salary_min?.toLocaleString()}
                            {job.salary_max && ` - $${job.salary_max.toLocaleString()}`}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="job-card-tags">
                      {job.experience_level && (
                        <span className="tag">{job.experience_level}</span>
                      )}
                      {job.remote && (
                        <span className="tag">{job.remote}</span>
                      )}
                    </div>
                    <div className="job-card-footer">
                      <span className="job-posted-time">
                        Posted {formatTimeAgo(job.created_at || job.postedDate)}
                      </span>
                      <button className="view-job-button">
                        View <ArrowUpRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">Loading featured jobs...</div>
              )}
            </div>
          </section>

          {/* Featured Talents Section */}
          <section className="featured-talents-section">
            <div className="section-header">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Featured Talents
              </motion.h2>
            </div>

            <div className="talents-grid">
              {featuredTalents.length > 0 ? (
                featuredTalents.map((talent, index) => (
                  <motion.div
                    key={talent.id}
                    className="talent-card"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    onClick={() => navigate(`/talent/gigs/${talent.id}`)}
                  >
                    <div className="talent-cover" />
                    <div className="talent-avatar">
                      {talent.user_name ? talent.user_name.charAt(0).toUpperCase() : 'T'}
                    </div>
                    <div className="talent-content">
                      <h3 className="talent-name">{talent.user_name || 'Talent'}</h3>
                      <p className="talent-title">{talent.title || 'Professional'}</p>
                      {talent.rating && (
                        <div className="talent-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`star ${i < Math.floor(talent.rating) ? 'filled' : ''}`}
                              size={14}
                            />
                          ))}
                          <span className="rating-text">{talent.rating}</span>
                        </div>
                      )}
                      {talent.price && (
                        <p className="talent-rate">${talent.price}/hr</p>
                      )}
                      {talent.skills && talent.skills.length > 0 && (
                        <div className="talent-skills">
                          {talent.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">Loading featured talents...</div>
              )}
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="stats-background-decoration" />
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="stat-card"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.h3
                    className="stat-number"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <AnimatedCounter value={stat.number} suffix={stat.suffix} duration={2} />
                  </motion.h3>
                  <p className="stat-label">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="testimonials-section">
            <div className="section-header">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                What Our Users Say
              </motion.h2>
            </div>

            <div className="testimonials-carousel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  className="testimonial-card"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="testimonial-quote">"{testimonials[testimonialIndex].quote}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      {testimonials[testimonialIndex].avatar}
                    </div>
                    <div className="author-info">
                      <p className="author-name">{testimonials[testimonialIndex].author}</p>
                      <p className="author-role">{testimonials[testimonialIndex].role}</p>
                    </div>
                  </div>
                  <div className="rating">
                    {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                      <Star key={i} className="star filled" size={16} />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="carousel-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === testimonialIndex ? 'active' : ''}`}
                  onClick={() => setTestimonialIndex(index)}
                />
              ))}
            </div>
          </section>

          {/* Footer */}
          <Footer />
        </>
      )}
    </div>
  );
};

export default HomePage;
