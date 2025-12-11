import React, { useState } from 'react';
import { Copy, Edit2, Check, X } from 'lucide-react';
import { useToast } from './Toast';

/**
 * Reusable AI Message Component with Copy/Edit functionality
 */
const AIMessage = ({ 
  message, 
  role, 
  onEdit, 
  showActions = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(message.content);
  };

  const handleSaveEdit = () => {
    if (onEdit && editedContent.trim() !== message.content) {
      onEdit(editedContent, true); // Pass true to indicate regeneration needed
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  if (isEditing && role === 'user') {
    return (
      <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`max-w-[80%] rounded-lg p-4 ${
          role === 'user'
            ? 'bg-workflow-primary text-white'
            : 'bg-surface-100 dark:bg-[#1A2139] text-text-primary dark:text-[#E8EAED]'
        }`}>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full bg-transparent border-none outline-none resize-none text-sm"
            rows={Math.min(editedContent.split('\n').length, 6)}
            autoFocus
          />
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleSaveEdit}
              className="p-1.5 hover:bg-white/20 rounded transition-colors"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1.5 hover:bg-white/20 rounded transition-colors"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-3 group`}>
      <div className={`max-w-[80%] rounded-lg p-4 relative ${
        role === 'user'
          ? 'bg-workflow-primary text-white'
          : 'bg-surface-100 dark:bg-[#1A2139] text-text-primary dark:text-[#E8EAED]'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        
        {showActions && role === 'user' && (
          <div className="absolute -right-14 top-2 flex gap-1 z-20">
            <button
              onClick={handleCopy}
              className="p-2 bg-white/90 dark:bg-[#1A2139]/90 hover:bg-white dark:hover:bg-[#1E2640] rounded-lg transition-all shadow-md border border-white/20 flex items-center justify-center min-w-[36px] min-h-[36px]"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-workflow-primary" />
              )}
            </button>
            <button
              onClick={handleEdit}
              className="p-2 bg-white/90 dark:bg-[#1A2139]/90 hover:bg-white dark:hover:bg-[#1E2640] rounded-lg transition-all shadow-md border border-white/20 flex items-center justify-center min-w-[36px] min-h-[36px]"
              title="Edit message"
            >
              <Edit2 className="w-4 h-4 text-workflow-primary" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMessage;
