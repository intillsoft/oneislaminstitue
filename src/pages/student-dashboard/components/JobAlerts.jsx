import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { alertService } from '../../../services/alertService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';
import { EliteCard } from '../../../components/ui/EliteCard';

const JobAlerts = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newAlert, setNewAlert] = useState({
    name: '',
    keywords: [],
    location: '',
    locationType: 'Any',
    frequency: 'daily',
    notificationTypes: ['email'],
    isActive: true
  });
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (user) {
      loadAlerts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const alertsData = await alertService.getAll();
      setAlerts(alertsData || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      showError('Failed to load job alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAlert = async (id, currentStatus) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await alertService.toggleActive(id, !currentStatus);
      setAlerts(prev => prev.map(alert =>
        alert.id === id ? { ...alert, is_active: !currentStatus } : alert
      ));
      success(`Alert ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      showError('Failed to update alert');
      console.error('Error toggling alert:', error);
    }
  };

  const handleDeleteAlert = async (id) => {
    if (!user) return;

    try {
      await alertService.delete(id);
      setAlerts(prev => prev.filter(alert => alert.id !== id));
      success('Alert deleted');
    } catch (error) {
      showError('Failed to delete alert');
      console.error('Error deleting alert:', error);
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput?.trim() && !newAlert?.keywords?.includes(keywordInput?.trim())) {
      setNewAlert({
        ...newAlert,
        keywords: [...newAlert?.keywords, keywordInput?.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setNewAlert({
      ...newAlert,
      keywords: newAlert?.keywords?.filter(k => k !== keyword)
    });
  };

  const handleToggleNotificationType = (type) => {
    if (newAlert?.notificationTypes?.includes(type)) {
      setNewAlert({
        ...newAlert,
        notificationTypes: newAlert?.notificationTypes?.filter(t => t !== type)
      });
    } else {
      setNewAlert({
        ...newAlert,
        notificationTypes: [...newAlert?.notificationTypes, type]
      });
    }
  };

  const handleCreateAlert = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newAlert?.name?.trim() || newAlert?.keywords?.length === 0) {
      showError('Please provide a name and at least one keyword');
      return;
    }

    try {
      setIsCreating(true);
      const created = await alertService.create(newAlert);
      setAlerts(prev => [created, ...prev]);
      setNewAlert({
        name: '',
        keywords: [],
        location: '',
        locationType: 'Any',
        frequency: 'daily',
        notificationTypes: ['email'],
        isActive: true
      });
      setIsCreating(false);
      success('Job alert created successfully');
    } catch (error) {
      showError('Failed to create alert');
      console.error('Error creating alert:', error);
      setIsCreating(false);
    }
  };

  if (!user) {
    return (
      <EliteCard>
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-2xl bg-surface-elevated dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Icon name="Bell" className="w-10 h-10 text-text-muted dark:text-slate-600 transition-colors" />
          </div>
          <p className="text-text-secondary dark:text-slate-400 mb-6">Sign in to create job alerts</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-workflow-primary text-white rounded-xl hover:bg-workflow-primary/90 transition-all font-semibold shadow-lg shadow-workflow-primary/20"
          >
            <Icon name="LogIn" size={18} />
            Sign In
          </button>
        </div>
      </EliteCard>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse h-32 bg-surface dark:bg-bg rounded-2xl border border-border dark:border-white/10"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Create New Alert */}
      <EliteCard hover={false} className="relative">
        <h3 className="text-xl font-black text-text-primary dark:text-white mb-6">Create Job Alert</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-text-secondary dark:text-slate-300 mb-2">
                Alert Name
              </label>
              <input
                type="text"
                value={newAlert.name}
                onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                placeholder="e.g., React Developer Jobs"
                className="w-full px-4 py-3 rounded-xl bg-surface-elevated dark:bg-white/5 border border-border dark:border-white/10 text-text-primary dark:text-white focus:border-workflow-primary focus:ring-2 focus:ring-workflow-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-secondary dark:text-slate-300 mb-2">
                Keywords
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                  placeholder="React, Remote..."
                  className="flex-1 px-4 py-3 rounded-xl bg-surface-elevated dark:bg-white/5 border border-border dark:border-white/10 text-text-primary dark:text-white focus:border-workflow-primary focus:ring-2 focus:ring-workflow-primary/20 transition-all"
                />
                <button
                  onClick={handleAddKeyword}
                  className="px-4 py-2 bg-workflow-primary/10 text-workflow-primary rounded-xl hover:bg-workflow-primary/20 font-bold transition-all"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {newAlert.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-workflow-primary/10 text-workflow-primary rounded-full text-xs font-black uppercase tracking-wider transition-colors"
                  >
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="hover:text-workflow-primary/80 transition-colors"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-text-secondary dark:text-slate-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={newAlert.location}
                onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                placeholder="City, State or Remote"
                className="w-full px-4 py-3 rounded-xl bg-surface-elevated dark:bg-white/5 border border-border dark:border-white/10 text-text-primary dark:text-white focus:border-workflow-primary focus:ring-2 focus:ring-workflow-primary/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-text-secondary dark:text-slate-300 mb-2">
                  Frequency
                </label>
                <select
                  value={newAlert.frequency}
                  onChange={(e) => setNewAlert({ ...newAlert, frequency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-elevated dark:bg-white/5 border border-border dark:border-white/10 text-text-primary dark:text-white focus:border-workflow-primary focus:ring-2 focus:ring-workflow-primary/20 transition-all appearance-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-secondary dark:text-slate-300 mb-2">
                  Notification
                </label>
                <div className="flex items-center gap-3 h-[50px]">
                  {['email', 'push'].map(type => (
                    <button
                      key={type}
                      onClick={() => handleToggleNotificationType(type)}
                      className={`flex-1 h-full px-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${newAlert.notificationTypes.includes(type)
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-surface-elevated dark:bg-white/5 text-text-muted dark:text-slate-400 border-transparent hover:border-border'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreateAlert}
          disabled={isCreating || !newAlert.name.trim() || newAlert.keywords.length === 0}
          className="w-full mt-6 py-4 bg-workflow-primary text-white rounded-xl hover:bg-workflow-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-black uppercase tracking-widest transition-all shadow-lg shadow-workflow-primary/20 flex items-center justify-center gap-2"
        >
          {isCreating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Icon name="Bell" size={20} />
              Create Job Alert
            </>
          )}
        </button>
      </EliteCard>

      {/* Existing Alerts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-text-primary dark:text-white">
            Your Job Alerts
            <span className="ml-3 px-2 py-1 bg-surface-elevated dark:bg-white/10 rounded-lg text-sm text-text-muted dark:text-slate-400 font-bold transition-colors">
              {alerts.length}
            </span>
          </h3>
        </div>

        {alerts.length === 0 ? (
          <EliteCard>
            <div className="text-center py-12">
              <Icon name="BellOff" className="w-12 h-12 text-text-muted dark:text-slate-600 mx-auto mb-4 transition-colors" />
              <p className="text-text-secondary dark:text-slate-400">No job alerts yet. Create one above!</p>
            </div>
          </EliteCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert) => (
              <EliteCard
                key={alert.id}
                className="relative overflow-visible group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-black text-text-primary dark:text-white truncate">
                        {alert.name}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${alert.is_active
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-surface-elevated dark:bg-white/5 text-text-muted dark:text-slate-400 border-transparent'
                        }`}>
                        {alert.is_active ? 'Active' : 'Paused'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {alert.keywords?.map((keyword, i) => (
                        <span key={i} className="px-2 py-1 bg-surface-elevated dark:bg-white/5 text-text-secondary dark:text-slate-400 rounded-lg text-xs font-bold transition-colors">
                          {keyword}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-text-muted dark:text-slate-400">
                      {alert.location && (
                        <span className="flex items-center gap-1.5">
                          <Icon name="MapPin" size={12} className="text-workflow-primary" />
                          {alert.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-surface-elevated dark:bg-white/5 rounded-lg transition-colors">
                        <Icon name="RefreshCw" size={12} className="text-purple-500" />
                        {alert.frequency}
                      </span>
                      {alert.last_sent && (
                        <span className="opacity-60 italic">
                          Last sent {formatDistanceToNow(new Date(alert.last_sent), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleToggleAlert(alert.id, alert.is_active)}
                      className={`p-3 rounded-xl transition-all border ${alert.is_active
                          ? 'bg-workflow-primary text-white border-workflow-primary/80 shadow-lg shadow-workflow-primary/20'
                          : 'bg-surface-elevated dark:bg-white/5 text-text-muted dark:text-slate-400 border-transparent hover:border-border'
                        }`}
                      aria-label={alert.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <Icon name={alert.is_active ? "Bell" : "BellOff"} size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all border border-transparent hover:border-red-500/20"
                      aria-label="Delete alert"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                </div>
              </EliteCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobAlerts;

