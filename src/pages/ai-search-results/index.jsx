import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Send, Mic, ArrowRight, MapPin, Clock, DollarSign, 
  Building2, Briefcase, TrendingUp, Sparkles, Filter, X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '../../contexts/ThemeContext';
import { jobService } from '../../services/jobService';
import { talentService } from '../../services/talentService';
import { apiService } from '../../lib/api';
import VoiceSearch from '../../components/ui/VoiceSearch';
import Image from '../../components/AppImage';
import './SearchResults.css';

// Format time ago helper
const formatTimeAgo = (date) => {
  if (!date) return 'recently';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return 'recently';
  }
};

const AISearchResults = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({
    jobs: [],
    talents: [],
    aiExplanation: '',
    extractedTerms: [],
    matchScores: {}
  });
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'jobs', 'talents'
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    salaryRange: '',
    experienceLevel: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef(null);

  // Perform AI search when component mounts or query changes
  useEffect(() => {
    if (queryParam) {
      performAISearch(queryParam);
    }
  }, [queryParam]);

  const performAISearch = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchQuery(query);
    
    try {
      // Call AI search API endpoint - use direct api.post
      const response = await apiService.post('/ai/search/all', {
        query: query.trim(),
        filters: filters
      });

      if (response.data && response.data.success !== false) {
        const resultData = response.data.data || response.data;
        setSearchResults({
          jobs: resultData.jobs || [],
          talents: resultData.talents || [],
          aiExplanation: resultData.explanation || `Found ${(resultData.jobs || []).length} jobs and ${(resultData.talents || []).length} talents matching "${query}"`,
          extractedTerms: resultData.extractedTerms || [],
          matchScores: resultData.matchScores || {}
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('AI Search error:', error);
      
      // Always fallback to regular search if AI endpoint fails
      await performFallbackSearch(query);
    } finally {
      setIsSearching(false);
    }
  };

  const performFallbackSearch = async (query) => {
    try {
      // Extract keywords from query
      const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      
      // Search jobs
      const jobsResult = await jobService.getAll({
        pageSize: 20,
        search: query
      });
      
      // Search talents
      const talentsResult = await talentService.getGigs({
        is_active: true
      });
      
      // Filter talents by query
      const filteredTalents = (talentsResult || []).filter(talent => {
        const searchText = `${talent.title || ''} ${talent.user_name || ''} ${talent.skills?.join(' ') || ''}`.toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword));
      }).slice(0, 20);

      // Generate simple AI explanation
      const aiExplanation = `Found ${jobsResult.data?.length || 0} jobs and ${filteredTalents.length} talents matching "${query}". Showing results based on relevance.`;

      setSearchResults({
        jobs: jobsResult.data || [],
        talents: filteredTalents,
        aiExplanation,
        extractedTerms: keywords,
        matchScores: {}
      });
    } catch (error) {
      console.error('Fallback search error:', error);
      setSearchResults({
        jobs: [],
        talents: [],
        aiExplanation: query ? `No results found for "${query}". Try adjusting your search terms or browse all available jobs and talents.` : 'Please enter a search query to find jobs and talents.',
        extractedTerms: [],
        matchScores: {}
      });
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    performAISearch(searchQuery);
    // Update URL without reload
    navigate(`/ai-search-results?q=${encodeURIComponent(searchQuery)}`, { replace: true });
  };

  const handleVoiceTranscript = (transcript) => {
    setSearchQuery(transcript);
    setTimeout(() => {
      performAISearch(transcript);
      navigate(`/ai-search-results?q=${encodeURIComponent(transcript)}`, { replace: true });
    }, 500);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const applyFilters = () => {
    performAISearch(searchQuery);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      jobType: '',
      salaryRange: '',
      experienceLevel: ''
    });
    performAISearch(searchQuery);
  };

  const displayedJobs = activeTab === 'all' || activeTab === 'jobs' ? searchResults.jobs : [];
  const displayedTalents = activeTab === 'all' || activeTab === 'talents' ? searchResults.talents : [];

  return (
    <div className="search-results-page">
      {/* Search Header */}
      <div className="search-results-header">
        <div className="search-results-container">
          <motion.div
            className="search-box-wrapper"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="inline-search-box">
              <Search className="search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search for jobs, talents, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <VoiceSearch 
                onTranscript={handleVoiceTranscript}
                disabled={isSearching}
              />
              <button
                className="search-send-button"
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching}
              >
                {isSearching ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Send className="send-icon" />
                  </motion.div>
                ) : (
                  <Send className="send-icon" />
                )}
              </button>
            </div>
            
            <div className="search-actions">
              <button
                className="filter-toggle-button"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </motion.div>

          {/* AI Explanation */}
          {searchResults.aiExplanation && (
            <motion.div
              className="ai-explanation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Sparkles className="sparkles-icon" />
              <p>{searchResults.aiExplanation}</p>
            </motion.div>
          )}

          {/* Extracted Terms */}
          {searchResults.extractedTerms.length > 0 && (
            <div className="extracted-terms">
              {searchResults.extractedTerms.map((term, index) => (
                <span key={index} className="term-chip">{term}</span>
              ))}
            </div>
          )}

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="filters-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="filters-content">
                  <div className="filter-group">
                    <label>Location</label>
                    <input
                      type="text"
                      placeholder="City, Country"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    />
                  </div>
                  <div className="filter-group">
                    <label>Job Type</label>
                    <select
                      value={filters.jobType}
                      onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Experience Level</label>
                    <select
                      value={filters.experienceLevel}
                      onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                    >
                      <option value="">All Levels</option>
                      <option value="entry">Entry</option>
                      <option value="mid">Mid-level</option>
                      <option value="senior">Senior</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>
                  <div className="filter-actions">
                    <button className="apply-filters-button" onClick={applyFilters}>
                      Apply Filters
                    </button>
                    <button className="clear-filters-button" onClick={clearFilters}>
                      Clear
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results Section */}
      <div className="search-results-content">
        <div className="search-results-container">
          {/* Tabs */}
          <div className="results-tabs">
            <button
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Results ({displayedJobs.length + displayedTalents.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              Jobs ({displayedJobs.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'talents' ? 'active' : ''}`}
              onClick={() => setActiveTab('talents')}
            >
              Talents ({displayedTalents.length})
            </button>
          </div>

          {/* Results Grid */}
          <div className="results-grid">
            {isSearching ? (
              <div className="loading-state">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="loading-spinner"
                >
                  <Sparkles className="w-8 h-8 text-workflow-primary" />
                </motion.div>
                <p>Searching with AI...</p>
              </div>
            ) : displayedJobs.length === 0 && displayedTalents.length === 0 ? (
              <div className="empty-state">
                <Search className="empty-icon" />
                <h3>No results found</h3>
                <p>Try adjusting your search query or filters</p>
              </div>
            ) : (
              <>
                {/* Job Results */}
                {displayedJobs.length > 0 && (
                  <div className="results-section">
                    <h3 className="results-section-title">
                      <Briefcase className="section-icon" />
                      Jobs ({displayedJobs.length})
                    </h3>
                    <div className="jobs-grid">
                      {displayedJobs.map((job, index) => (
                        <motion.div
                          key={job.id}
                          className="result-job-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ y: -4 }}
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
                            {job.description ? job.description.substring(0, 120) + '...' : 'No description available'}
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
                          <div className="job-card-footer">
                            <span className="job-posted-time">
                              Posted {formatTimeAgo(job.created_at || job.postedDate)}
                            </span>
                            <button className="view-job-button">
                              View <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                          </div>
                          {searchResults.matchScores[job.id] && (
                            <div className="match-score-badge">
                              {searchResults.matchScores[job.id]}% match
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Talent Results */}
                {displayedTalents.length > 0 && (
                  <div className="results-section">
                    <h3 className="results-section-title">
                      <TrendingUp className="section-icon" />
                      Talents ({displayedTalents.length})
                    </h3>
                    <div className="talents-grid">
                      {displayedTalents.map((talent, index) => (
                        <motion.div
                          key={talent.id}
                          className="result-talent-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ y: -4 }}
                          onClick={() => navigate(`/talent/gigs/${talent.id}`)}
                        >
                          <div className="talent-cover" />
                          <div className="talent-avatar">
                            {talent.user_name ? talent.user_name.charAt(0).toUpperCase() : 'T'}
                          </div>
                          <div className="talent-content">
                            <h3 className="talent-name">{talent.user_name || 'Talent'}</h3>
                            <p className="talent-title">{talent.title || 'Professional'}</p>
                            {talent.price && (
                              <p className="talent-rate">${talent.price}/hr</p>
                            )}
                            {talent.skills && talent.skills.length > 0 && (
                              <div className="talent-skills">
                                {talent.skills.slice(0, 4).map((skill, i) => (
                                  <span key={i} className="skill-tag">{skill}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          {searchResults.matchScores[talent.id] && (
                            <div className="match-score-badge">
                              {searchResults.matchScores[talent.id]}% match
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISearchResults;

