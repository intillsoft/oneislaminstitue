/**
 * Navigation Buttons Component
 * Reusable navigation buttons for pages
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

export const BackButton = ({ to, onClick, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-[#64748B] dark:text-[#8B92A3] hover:text-[#0F172A] dark:hover:text-[#E8EAED] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] rounded-lg transition-all duration-200 min-h-[44px] ${className}`}
      aria-label="Go back"
    >
      <Icon name="ChevronLeft" size={20} />
      <span>Back</span>
    </button>
  );
};

export const EditButton = ({ onClick, disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-workflow-primary hover:text-workflow-primary-700 dark:hover:text-workflow-primary-300 border-2 border-workflow-primary hover:border-workflow-primary-700 dark:hover:border-workflow-primary-300 rounded-lg transition-all duration-200 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Edit"
    >
      <Icon name="Edit" size={18} />
      <span>Edit</span>
    </button>
  );
};

export const SaveButton = ({ onClick, loading = false, disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center space-x-2 px-6 py-2.5 text-sm font-semibold bg-workflow-primary text-white hover:bg-workflow-primary-600 dark:hover:bg-workflow-primary-500 rounded-lg transition-all duration-200 shadow-lg shadow-workflow-primary/25 hover:shadow-xl hover:shadow-workflow-primary/30 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Save"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Icon name="Check" size={18} />
          <span>Save</span>
        </>
      )}
    </button>
  );
};

export const DeleteButton = ({ onClick, disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300 border-2 border-error-600 dark:border-error-400 hover:border-error-700 dark:hover:border-error-300 rounded-lg transition-all duration-200 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-error-50 dark:hover:bg-error-900/20 ${className}`}
      aria-label="Delete"
    >
      <Icon name="Trash2" size={18} />
      <span>Delete</span>
    </button>
  );
};

export const CreateButton = ({ onClick, label = 'Create', className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-2.5 text-sm font-semibold bg-workflow-primary text-white hover:bg-workflow-primary-600 dark:hover:bg-workflow-primary-500 rounded-lg transition-all duration-200 shadow-lg shadow-workflow-primary/25 hover:shadow-xl hover:shadow-workflow-primary/30 min-h-[44px] ${className}`}
      aria-label={label}
    >
      <Icon name="Plus" size={18} />
      <span>{label}</span>
    </button>
  );
};

export const CancelButton = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-[#64748B] dark:text-[#8B92A3] hover:text-[#0F172A] dark:hover:text-[#E8EAED] border-2 border-[#E2E8F0] dark:border-[#1E2640] hover:border-[#CBD5E1] dark:hover:border-[#2A3142] rounded-lg transition-all duration-200 min-h-[44px] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] ${className}`}
      aria-label="Cancel"
    >
      <Icon name="X" size={18} />
      <span>Cancel</span>
    </button>
  );
};

export const ApplyButton = ({ onClick, disabled = false, loading = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center space-x-2 px-6 py-2.5 text-sm font-semibold bg-workflow-primary text-white hover:bg-workflow-primary-600 dark:hover:bg-workflow-primary-500 rounded-lg transition-all duration-200 shadow-lg shadow-workflow-primary/25 hover:shadow-xl hover:shadow-workflow-primary/30 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Apply"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Applying...</span>
        </>
      ) : (
        <>
          <Icon name="Send" size={18} />
          <span>Apply Now</span>
        </>
      )}
    </button>
  );
};

export default {
  BackButton,
  EditButton,
  SaveButton,
  DeleteButton,
  CreateButton,
  CancelButton,
  ApplyButton,
};











