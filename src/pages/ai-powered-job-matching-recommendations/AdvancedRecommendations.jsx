import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, TrendingUp, Sparkles } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { apiService } from '../../lib/api';
import { useToast } from '../../components/ui/Toast';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import './AdvancedRecommendations.css';

const AdvancedRecommendations = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { error: showError } = useToast();

    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        if (user) {
            loadRecommendations();
        } else {
            navigate('/job-seeker-registration-login');
        }
    }, [user]);

    const loadRecommendations = async () => {
        try {
            setLoading(true);

            const response = await apiService.get('/recommendations/jobs', {
                params: {
                    limit: 50,
                    minScore: 60,
                    includeExplanations: true,
                    useAI: true,
                },
            });

            if (response.data.success) {
                const recs = response.data.data.recommendations || [];
                setRecommendations(recs);
                console.log(`✅ Loaded ${recs.length} advanced AI recommendations`);
            }
        } catch (error) {
            console.error('Error loading recommendations:', error);
            showError('Failed to load recommendations. Please try again.');

            // Fallback to regular jobs
            try {
                const jobsResponse = await apiService.get('/jobs');
                const jobs = (jobsResponse.data.data || []).slice(0, 20).map(job => ({
                    ...job,
                    matchScore: 70,
                    explanation: 'Standard job listing',
                }));
                setRecommendations(jobs);
            } catch (fallbackError) {
                console.error('Fallback failed:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'score-excellent';
        if (score >= 70) return 'score-good';
        return 'score-fair';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent Match';
        if (score >= 70) return 'Good Match';
        return 'Fair Match';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface dark:bg-[#0A0E27] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading AI-powered recommendations...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="advanced-recommendations min-h-screen bg-surface dark:bg-[#0A0E27] pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="page-header mb-8">
                        <h1 className="text-3xl font-bold text-text-primary dark:text-[#E8EAED] flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-workflow-primary" />
                            AI-Powered Job Recommendations
                        </h1>
                        <p className="text-text-secondary mt-2">
                            Personalized job matches based on your profile, skills, and preferences
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="stats-grid mb-8">
                        <div className="stat-card">
                            <div className="stat-label">Total Matches</div>
                            <div className="stat-value">{recommendations.length}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Excellent Matches</div>
                            <div className="stat-value">{recommendations.filter(r => r.matchScore >= 80).length}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Good Matches</div>
                            <div className="stat-value">{recommendations.filter(r => r.matchScore >= 70 && r.matchScore < 80).length}</div>
                        </div>
                    </div>

                    {/* Recommendations Grid */}
                    {recommendations.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-text-secondary text-lg">
                                No recommendations found. Please update your profile or resume to get better matches.
                            </p>
                        </div>
                    ) : (
                        <div className="recommendations-grid">
                            {recommendations.map((job) => (
                                <div
                                    key={job.id}
                                    className="recommendation-card"
                                    onClick={() => navigate(`/job-details/${job.id}`)}
                                >
                                    {/* Match Score Badge */}
                                    <div className={`match-score-badge ${getScoreColor(job.matchScore)}`}>
                                        <TrendingUp className="w-4 h-4" />
                                        <span>{job.matchScore}% Match</span>
                                    </div>

                                    {/* Job Info */}
                                    <h3 className="job-title">{job.title}</h3>
                                    <p className="job-company">{job.company || job.companies?.name || 'Company'}</p>

                                    {/* Details */}
                                    <div className="job-details-grid">
                                        {job.location && (
                                            <div className="detail-item">
                                                <MapPin className="w-4 h-4" />
                                                <span>{job.location}</span>
                                            </div>
                                        )}
                                        {(job.salary_min || job.salary_max) && (
                                            <div className="detail-item">
                                                <DollarSign className="w-4 h-4" />
                                                <span>
                                                    {job.salary_min && job.salary_max
                                                        ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                                                        : job.salary_min
                                                            ? `$${job.salary_min.toLocaleString()}+`
                                                            : `Up to $${job.salary_max.toLocaleString()}`}
                                                </span>
                                            </div>
                                        )}
                                        {job.employment_type && (
                                            <div className="detail-item">
                                                <Briefcase className="w-4 h-4" />
                                                <span>{job.employment_type}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Explanation */}
                                    {job.explanation && (
                                        <div className="explanation">
                                            <p>{job.explanation}</p>
                                        </div>
                                    )}

                                    {/* Score Breakdown */}
                                    {job.scoreBreakdown && (
                                        <div className="score-breakdown">
                                            <div className="breakdown-item">
                                                <span>Content</span>
                                                <span>{job.scoreBreakdown.content}%</span>
                                            </div>
                                            <div className="breakdown-item">
                                                <span>AI</span>
                                                <span>{job.scoreBreakdown.ai}%</span>
                                            </div>
                                            <div className="breakdown-item">
                                                <span>Recency</span>
                                                <span>{job.scoreBreakdown.recency}%</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AdvancedRecommendations;
