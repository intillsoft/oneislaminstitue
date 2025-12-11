import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { apiService } from '../../lib/api';
import { useToast } from './Toast';

/**
 * Reusable Message Button Component
 * Allows users to message anyone on the platform
 */
const MessageButton = ({ userId, userName, className = '', variant = 'default' }) => {
  const navigate = useNavigate();
  const { error: showError } = useToast();
  const [loading, setLoading] = useState(false);

  const handleMessage = async () => {
    if (!userId) {
      showError('User ID is required');
      return;
    }

    try {
      setLoading(true);
      // Get or create conversation
      const response = await apiService.messages.getConversation(userId);
      
      // Handle table not found error
      if (response.data?.code === 'TABLE_NOT_FOUND') {
        console.error('Messaging system not initialized');
        return;
      }
      if (response.data?.success) {
        navigate(`/messages?conversation=${response.data.data.id}`);
      } else {
        showError('Failed to start conversation');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      showError('Failed to start conversation');
    } finally {
      setLoading(false);
    }
  };

  const baseClasses = variant === 'icon' 
    ? 'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A2139] transition-colors'
    : 'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2';

  const variantClasses = {
    default: 'bg-workflow-primary text-white hover:bg-workflow-primary-600',
    secondary: 'bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] text-[#0F172A] dark:text-[#E8EAED] hover:bg-gray-50 dark:hover:bg-[#1A2139]',
    icon: 'text-[#64748B] dark:text-[#8B92A3] hover:text-workflow-primary',
  };

  return (
    <button
      onClick={handleMessage}
      disabled={loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={userName ? `Message ${userName}` : 'Send Message'}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : (
        <>
          <Icon name="MessageSquare" size={variant === 'icon' ? 18 : 16} />
          {variant !== 'icon' && <span>Message</span>}
        </>
      )}
    </button>
  );
};

export default MessageButton;
