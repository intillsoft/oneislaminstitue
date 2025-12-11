import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { useToast } from '../../../components/ui/Toast';
import { apiService } from '../../../lib/api';
import { Play, Pause, RefreshCw, BarChart3, Clock } from 'lucide-react';

const JobCrawlerPanel = () => {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    keywords: 'software engineer',
    location: 'United States',
    sources: ['linkedin', 'glassdoor', 'indeed'],
    limit: 50,
  });

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await apiService.jobCrawler.getStatus();
      if (response.data) {
        setStatus(response.data);
      }
    } catch (error) {
      console.error('Error loading crawler status:', error);
    }
  };

  const handleCrawl = async () => {
    try {
      setLoading(true);
      setCrawling(true);
      
      const response = await apiService.jobCrawler.crawl({
        keywords: formData.keywords,
        location: formData.location,
        sources: formData.sources,
        limit: formData.limit,
      });

      if (response.success) {
        success(
          `Crawling completed! ${response.data.inserted} jobs inserted, ${response.data.skipped} skipped.`
        );
        await loadStatus();
      }
    } catch (error) {
      console.error('Crawling error:', error);
      showError(error.response?.data?.message || 'Failed to crawl jobs. Make sure backend is running.');
    } finally {
      setLoading(false);
      setCrawling(false);
    }
  };

  const handleScheduleCrawl = async () => {
    try {
      setLoading(true);
      const response = await apiService.jobCrawler.schedule();
      if (response.success) {
        success('Scheduled crawl completed successfully!');
        await loadStatus();
      }
    } catch (error) {
      console.error('Schedule crawl error:', error);
      showError(error.response?.data?.message || 'Failed to schedule crawl.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSource = (source) => {
    setFormData(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Crawler</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Crawl jobs from LinkedIn, Glassdoor, and Indeed
          </p>
        </div>
        <button
          onClick={loadStatus}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#13182E] border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {/* Status Cards */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs in DB</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {status.data?.total_jobs_in_db || status.total_jobs_in_db || 0}
                </p>
              </div>
            </div>
          </div>

          {status.data?.last_run && (
            <>
              <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Run</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {status.data.last_run.timestamp 
                        ? new Date(status.data.last_run.timestamp).toLocaleString()
                        : 'Never'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Play className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Inserted</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {status.data.last_run.inserted || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <RefreshCw className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Skipped</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {status.data.last_run.skipped || 0}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {status.data?.crawl_results && Object.entries(status.data.crawl_results).map(([source, result]) => (
            <div key={source} className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{source}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {result.count || 0}
                  </p>
                  {result.error && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 truncate">
                      Error: {result.error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crawl Form */}
      <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Manual Job Crawl
        </h3>

        <div className="space-y-4">
          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keywords
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
              placeholder="e.g., software engineer, data scientist"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., United States, New York"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary"
            />
          </div>

          {/* Sources */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sources
            </label>
            <div className="flex flex-wrap gap-2">
              {['linkedin', 'glassdoor', 'indeed'].map((source) => (
                <button
                  key={source}
                  onClick={() => toggleSource(source)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.sources.includes(source)
                      ? 'bg-workflow-primary text-white'
                      : 'bg-gray-100 dark:bg-[#1A2139] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  {source.charAt(0).toUpperCase() + source.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Limit per source
            </label>
            <input
              type="number"
              value={formData.limit}
              onChange={(e) => setFormData(prev => ({ ...prev, limit: parseInt(e.target.value) || 50 }))}
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleCrawl}
              disabled={loading || formData.sources.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-workflow-primary text-white rounded-lg font-medium hover:bg-workflow-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {crawling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Crawling...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Crawl
                </>
              )}
            </button>

            <button
              onClick={handleScheduleCrawl}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-[#1A2139] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              <Clock className="w-4 h-4" />
              Run Full Schedule
            </button>
          </div>
        </div>
      </div>

      {/* API Configuration Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
              API Configuration Required
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              To use real job crawling, add these environment variables to your backend <code className="bg-blue-100 dark:bg-blue-900/30 px-1 rounded">.env</code> file:
            </p>
            <ul className="text-xs text-blue-700 dark:text-blue-400 mt-2 space-y-1 list-disc list-inside">
              <li><code>RAPIDAPI_KEY</code> - For RapidAPI LinkedIn/Glassdoor/Indeed APIs</li>
              <li><code>LINKEDIN_API_KEY</code> - For LinkedIn Official API (optional)</li>
              <li><code>INDEED_API_KEY</code> - For Indeed Publisher API (optional)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCrawlerPanel;

