import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MessageSquare, Settings, User, 
  LogOut, ChevronRight, X, Trash2,
  ChevronLeft, Clock, Sparkles, History
} from 'lucide-react';
import Icon from '../AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';

const AISidebar = ({ 
  isOpen, 
  onClose, 
  onToggle,
  onNewChat, 
  searchHistory = [],
  onHistoryClick,
  onDeleteHistory,
  onCollapseChange
}) => {
  const { user, profile, signOut } = useAuthContext();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('aiSidebarCollapsed');
    return saved === 'true';
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    localStorage.setItem('aiSidebarCollapsed', isCollapsed.toString());
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  const handleNewChat = () => {
    onNewChat();
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleHistoryItemClick = (query) => {
    if (onHistoryClick) {
      onHistoryClick(query);
    }
  };

  const handleDeleteHistoryItem = (index, e) => {
    e.stopPropagation();
    if (onDeleteHistory) {
      onDeleteHistory(index);
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Memoize formatted history to prevent unnecessary re-renders
  const formattedHistory = useMemo(() => {
    return searchHistory.map((item) => ({
      ...item,
      timeAgo: item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '',
    }));
  }, [searchHistory]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - UnifiedSidebar Style Design */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? (isCollapsed ? 64 : 260) : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={`
          fixed left-0 top-16 bottom-0
          bg-white dark:bg-[#0F172A] border-r border-gray-200/50 dark:border-gray-800/50
          z-30 overflow-hidden flex flex-col
          ${!isOpen ? 'hidden' : ''}
        `}
      >
        {/* Minimal Header - Logo Only */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200/50 dark:border-gray-800/50 relative z-50">
          {!isCollapsed ? (
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-workflow-primary rounded-lg blur-md opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative w-8 h-8 bg-gradient-to-br from-workflow-primary to-workflow-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
            </Link>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-workflow-primary to-workflow-primary-600 rounded-lg flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Beautiful Toggle Button - UnifiedSidebar Style */}
        {isOpen && (
          <button
            onClick={handleToggleCollapse}
            className={`fixed ${isCollapsed ? 'right-4' : 'right-[260px]'} top-24 p-2.5 rounded-full hover:bg-workflow-primary/10 dark:hover:bg-workflow-primary/20 text-workflow-primary dark:text-workflow-primary-400 hover:text-workflow-primary-600 dark:hover:text-workflow-primary-300 transition-all duration-200 bg-white dark:bg-[#13182E] border-2 border-workflow-primary/30 dark:border-workflow-primary/50 shadow-xl hover:shadow-2xl z-[9999] hover:scale-110 active:scale-95 backdrop-blur-sm`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={20} 
            />
          </button>
        )}

        {/* New Chat Button */}
        <div className="p-3 border-b border-gray-200/50 dark:border-gray-800/50 flex-shrink-0">
          {!isCollapsed ? (
            <motion.button
              onClick={handleNewChat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-4 py-2.5 w-full bg-gradient-to-r from-workflow-primary to-purple-600 text-white rounded-lg hover:from-workflow-primary-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm font-semibold">New Chat</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={handleNewChat}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 w-full bg-gradient-to-r from-workflow-primary to-purple-600 text-white rounded-lg hover:from-workflow-primary-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              aria-label="New chat"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Search History - Scrollable */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
            <div className="mb-3 px-2">
              <div className="flex items-center gap-2 mb-2">
                <History className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Recent
                </h3>
              </div>
            </div>
            <div className="space-y-0.5">
              {formattedHistory.length > 0 ? (
                formattedHistory.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleHistoryItemClick(item.query)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-start px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 relative group"
                  >
                    <MessageSquare className="w-4 h-4 flex-shrink-0 mr-3" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="truncate">{item.query || `Search ${index + 1}`}</p>
                      {item.timeAgo && (
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.timeAgo}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDeleteHistoryItem(index, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500 rounded-lg"
                      aria-label="Delete search"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.button>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-700" />
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">No recent searches</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collapsed History Icons - Enhanced Beautiful */}
        {isCollapsed && (
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
            <div className="space-y-1">
              {formattedHistory.slice(0, 12).map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleHistoryItemClick(item.query)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-full p-2.5 rounded-lg hover:bg-workflow-primary/10 dark:hover:bg-purple-500/20 transition-all duration-200 group relative"
                  aria-label={item.query}
                >
                  <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-500 group-hover:text-workflow-primary dark:group-hover:text-purple-400 transition-colors mx-auto" />
                  <div className="absolute left-full ml-3 top-0 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {item.query?.substring(0, 40)}...
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* User Section - Bottom - Always Visible */}
        <div className="p-3 border-t border-gray-200/50 dark:border-gray-800/50 flex-shrink-0 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-900/50">
          <div className="relative">
            {!isCollapsed ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                aria-label="User menu"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-workflow-primary to-workflow-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.name}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {profile?.name || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                      {profile?.role || 'User'}
                    </p>
                  </div>
                </div>
                <Icon 
                  name={showUserMenu ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                />
              </button>
            ) : (
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-full p-2.5 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 relative group"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-workflow-primary to-workflow-primary-600 flex items-center justify-center mx-auto shadow-sm">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="absolute left-full ml-3 top-0 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                  {profile?.name || user?.email?.split('@')[0] || 'User'}
                </div>
              </motion.button>
            )}

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute ${isCollapsed ? 'left-full ml-2 top-0' : 'bottom-full left-0 right-0 mb-2'} bg-white dark:bg-[#1E293B] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[200px]`}
                >
                  <Link
                    to="/user-profile"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/talent/settings"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AISidebar;
