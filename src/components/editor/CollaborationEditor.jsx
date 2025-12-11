/**
 * Collaboration Editor Component
 * Real-time collaboration features (placeholder for future implementation)
 */

import React, { useState, useEffect } from 'react';
import TipTapEditor from './TipTapEditor';
import { Users, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const CollaborationEditor = ({
  content,
  onChange,
  onSave,
  documentId,
  userId,
}) => {
  const [collaborators, setCollaborators] = useState([]);
  const [isCollaborating, setIsCollaborating] = useState(false);

  // Simulated collaboration (in production, use WebSockets or similar)
  useEffect(() => {
    if (isCollaborating && documentId) {
      // In production: Connect to collaboration service
      // For now, just simulate
      const interval = setInterval(() => {
        // Sync changes
        console.log('Syncing collaboration changes...');
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isCollaborating, documentId]);

  const handleInviteCollaborator = () => {
    const email = prompt('Enter email to invite:');
    if (email) {
      // In production: Send invitation
      setCollaborators([...collaborators, { email, status: 'pending' }]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Collaboration Header */}
      <div className="flex items-center justify-between p-4 bg-[#F8FAFC] dark:bg-[#1A2139] rounded-lg border border-[#E2E8F0] dark:border-[#1E2640]">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-workflow-primary" />
          <div>
            <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#E8EAED]">
              Collaboration
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#8B92A3]">
              {collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleInviteCollaborator}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite
        </Button>
      </div>

      {/* Collaborators List */}
      <AnimatePresence>
        {collaborators.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-[#F8FAFC] dark:bg-[#1A2139] rounded-lg space-y-2">
              {collaborators.map((collab, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-[#0F172A] dark:text-[#E8EAED]">{collab.email}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    collab.status === 'active'
                      ? 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400'
                      : 'bg-[#E2E8F0] dark:bg-[#1E2640] text-[#64748B] dark:text-[#8B92A3]'
                  }`}>
                    {collab.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <TipTapEditor
        content={content}
        onChange={onChange}
        onSave={onSave}
        autoSave={true}
        autoSaveInterval={30000}
        placeholder="Start editing... Changes are saved automatically and synced with collaborators."
      />

      {/* Collaboration Status */}
      {isCollaborating && (
        <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#8B92A3]">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span>Syncing with collaborators...</span>
        </div>
      )}
    </div>
  );
};

export default CollaborationEditor;

