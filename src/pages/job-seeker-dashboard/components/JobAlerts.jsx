import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { alertService } from '../../../services/alertService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';
import Button from '../../../components/ui/Button';

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
      navigate('/job-seeker-registration-login');
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
      navigate('/job-seeker-registration-login');
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
      <div className="text-center py-12">
        <Icon name="Bell" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
        <p className="text-[#64748B] dark:text-[#8B92A3] mb-4">Sign in to create job alerts</p>
        <Button onClick={() => navigate('/job-seeker-registration-login')}>
          Sign In
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse h-32 bg-[#F8FAFC] dark:bg-[#1A2139] rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create New Alert */}
      <div className="bg-background rounded-lg border border-border shadow-soft p-6">
        <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Create Job Alert</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Alert Name
            </label>
            <input
              type="text"
              value={newAlert.name}
              onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
              placeholder="e.g., React Developer Jobs"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Keywords
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                placeholder="Add keyword..."
                className="input-field flex-1"
              />
              <Button variant="secondary" onClick={handleAddKeyword}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newAlert.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-workflow-primary-50 dark:bg-workflow-primary-900/20 text-workflow-primary rounded-full text-sm"
                >
                  {keyword}
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="hover:text-workflow-primary-700"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                Location
              </label>
              <input
                type="text"
                value={newAlert.location}
                onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                placeholder="City, State or Remote"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                Frequency
              </label>
              <select
                value={newAlert.frequency}
                onChange={(e) => setNewAlert({ ...newAlert, frequency: e.target.value })}
                className="input-field"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Notifications
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newAlert.notificationTypes.includes('email')}
                  onChange={() => handleToggleNotificationType('email')}
                  className="mr-2"
                />
                <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">Email</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newAlert.notificationTypes.includes('push')}
                  onChange={() => handleToggleNotificationType('push')}
                  className="mr-2"
                />
                <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">Push</span>
              </label>
            </div>
          </div>

          <Button
            onClick={handleCreateAlert}
            disabled={isCreating || !newAlert.name.trim() || newAlert.keywords.length === 0}
            className="w-full"
          >
            {isCreating ? 'Creating...' : 'Create Alert'}
          </Button>
        </div>
      </div>

      {/* Existing Alerts */}
      <div>
        <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">
          Your Job Alerts ({alerts.length})
        </h3>

        {alerts.length === 0 ? (
          <div className="text-center py-12 bg-background rounded-lg border border-border">
            <Icon name="Bell" className="w-12 h-12 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
            <p className="text-[#64748B] dark:text-[#8B92A3]">No job alerts yet. Create one above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-background rounded-lg border border-border shadow-soft p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED]">
                        {alert.name}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        alert.is_active
                          ? 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400'
                          : 'bg-[#F8FAFC] dark:bg-[#1A2139] text-[#64748B] dark:text-[#8B92A3]'
                      }`}>
                        {alert.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-[#64748B] dark:text-[#8B92A3]">
                      <div className="flex flex-wrap gap-2">
                        {alert.keywords?.map((keyword, i) => (
                          <span key={i} className="px-2 py-1 bg-[#F8FAFC] dark:bg-[#1A2139] rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        {alert.location && (
                          <span className="flex items-center gap-1">
                            <Icon name="MapPin" size={14} />
                            {alert.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={14} />
                          {alert.frequency}
                        </span>
                        {alert.last_sent && (
                          <span>
                            Last sent {formatDistanceToNow(new Date(alert.last_sent), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleAlert(alert.id, alert.is_active)}
                      className={`p-2 rounded-lg transition-colors ${
                        alert.is_active
                          ? 'text-success hover:bg-success-50 dark:hover:bg-success-900/20'
                          : 'text-[#64748B] dark:text-[#8B92A3] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139]'
                      }`}
                      aria-label={alert.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <Icon name={alert.is_active ? "Bell" : "BellOff"} size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-2 rounded-lg text-error hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                      aria-label="Delete alert"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobAlerts;
